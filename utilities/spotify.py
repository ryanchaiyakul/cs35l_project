#########################################
## AUTHENTICATION AND SPOTIFY REQUESTS ##
#########################################

from urllib.parse import urlencode
from collections import Counter, defaultdict
import base64
import time
import json

from datetime import datetime, date

from quart import request
from utilities import cache
from config import SPOTIFY


class CONSTANTS:
    API_URL = "https://api.spotify.com/v1/"
    AUTH_URL = "https://accounts.spotify.com/authorize"
    TOKEN_URL = "https://accounts.spotify.com/api/token"
    SCOPES = [  # Ask for permissions
        # Users
        "user-read-private",
        # Library
        "user-library-read",
        # Listening history
        "user-top-read",
        "user-read-recently-played",
        # Playlists
        "playlist-read-collaborative",
        "playlist-read-private",
        "playlist-modify-public",
        # Currently playing track
        "user-read-currently-playing",
    ]
    TIME_RANGE_MAP = {
        "short_term": "four weeks.",
        "medium_term": "six months.",
        "long_term": "few years.",
    }


class ClientCredentials:
    def __init__(self, app):
        self.app = app
        self.id = SPOTIFY.client_id
        self.secret = SPOTIFY.client_secret

        self.token = None
        app.loop.create_task(self.get_token())  # validate token

    def _make_token_auth(self, client_id, client_secret):
        auth_header = base64.b64encode(
            (client_id + ":" + client_secret).encode("ascii")
        )
        return {"Authorization": "Basic %s" % auth_header.decode("ascii")}

    async def get_track(self, track_id):
        """Get a track's info from its id"""
        return await self.make_spotify_req(
            CONSTANTS.API_URL + "tracks/{0}".format(track_id)
        )

    async def get_track_features(self, track_id):
        return await self.make_spotify_req(
            CONSTANTS.API_URL + "audio-features/{0}".format(track_id)
        )

    async def get_tracks_features(self, track_ids):
        features = []
        while len(track_ids) > 0:
            params = {"ids": ",".join(track_ids[:100])}
            query = urlencode(params)
            batch = await self.make_spotify_req(
                CONSTANTS.API_URL + "audio-features?" + query
            )
            features.extend(batch["audio_features"])
            del track_ids[:100]

        return features

    @cache.cache(strategy=cache.Strategy.raw)
    async def get_full_track(self, track_id):
        data = await self.get_track(track_id)
        data["audio_features"] = await self.get_track_features(track_id)

        album_tracks = data["album"]["tracks"] = await self.get_album_tracks(
            data["album"]["id"]
        )

        artist_tracks = data["artists"][0][
            "top_tracks"
        ] = await self.get_artist_top_tracks(data["artists"][0]["id"])

        tracks_without_features = album_tracks + artist_tracks

        features = await self.get_tracks_features(
            [t["id"] for t in tracks_without_features]
        )
        for track, feat in zip(tracks_without_features, features):
            track["audio_features"] = feat

        return Track(data)

    async def get_album_tracks(self, album_id):
        """Get an album's info from its URI"""
        r = await self.make_spotify_req(
            CONSTANTS.API_URL + "albums/{0}/tracks".format(album_id)
        )
        return r["items"]

    async def get_artist_top_tracks(self, artist_id):
        """Get an artist's info from its URI"""
        r = await self.make_spotify_req(
            CONSTANTS.API_URL + "artists/{0}/top-tracks?market=US".format(artist_id)
        )
        return r["tracks"]

    async def get_playlist(self, user, uri):
        """Get a playlist's info from its URI"""
        return await self.make_spotify_req(
            CONSTANTS.API_URL + "users/{0}/playlists/{1}{2}".format(user, uri)
        )

    async def get_playlist_tracks(self, uri):
        """Get a list of a playlist's tracks"""
        return await self.make_spotify_req(
            CONSTANTS.API_URL + "playlists/{0}/tracks".format(uri)
        )

    async def make_spotify_req(self, url):
        """Proxy method for making a Spotify req using the correct Auth headers"""
        token = await self.get_token()
        return await self.make_get(
            url, headers={"Authorization": "Bearer {0}".format(token)}
        )

    async def make_get(self, url, headers=None):
        """Makes a GET request and returns the results"""
        return await self.app.http.get(url, headers=headers, res_method="json")

    async def make_post(self, url, payload, headers=None):
        """Makes a POST request and returns the results"""
        return await self.app.http.post(
            url, data=payload, headers=headers, res_method="json"
        )

    async def get_token(self):
        """Gets the token or creates a new one if expired"""
        if self.token and not await self.check_token(self.token):
            return self.token["access_token"]

        token = await self.request_token()
        if token:
            token["expires_at"] = int(time.time()) + token["expires_in"]
            self.token = token
            return self.token["access_token"]

    async def check_token(self, token):
        """Checks a token is valid"""
        now = int(time.time())
        return token["expires_at"] - now < 60

    async def request_token(self):
        """Obtains a token from Spotify and returns it"""
        payload = {"grant_type": "client_credentials"}
        headers = self._make_token_auth(self.id, self.secret)
        r = await self.make_post(CONSTANTS.TOKEN_URL, payload=payload, headers=headers)
        return r


class Oauth:
    def __init__(self, app):
        self.client_id = SPOTIFY.client_id
        self.client_secret = SPOTIFY.client_secret
        self.redirect_uri = SPOTIFY.redirect_uri
        self.scope = " ".join(CONSTANTS.SCOPES)

        self.client = app

    @property
    def headers(self):
        """
        Return proper headers for all token requests
        """
        auth_header = base64.b64encode(
            (self.client_id + ":" + self.client_secret).encode("ascii")
        )
        return {
            "Authorization": "Basic %s" % auth_header.decode("ascii"),
            "Content-Type": "application/x-www-form-urlencoded",
        }

    def get_auth_url(self, state=None):
        """
        Return an authorization url to get an access code
        """
        params = {
            "client_id": self.client_id,
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "scope": " ".join(CONSTANTS.SCOPES),
            "show_dialog": True,  # If they agreed already, why show them the annoying auth page?
        }
        if state:
            params["state"] = state
        constructed = urlencode(params)
        return "%s?%s" % (CONSTANTS.AUTH_URL, constructed)

    def validate_token(self, token_info):
        """Checks a token is valid"""
        now = int(time.time())
        return token_info["expires_at"] - now > 60

    async def get_access_token(self, user_id, token_info):
        """Gets the token or creates a new one if expired"""
        if self.validate_token(token_info):
            return token_info["access_token"]

        token_info = await self.refresh_access_token(
            user_id, token_info.get("refresh_token")
        )

        return token_info["access_token"]

    async def refresh_access_token(self, user_id, refresh_token):
        params = {"grant_type": "refresh_token", "refresh_token": refresh_token}
        token_info = await self.client.http.post(
            CONSTANTS.TOKEN_URL, data=params, headers=self.headers, res_method="json"
        )
        if not token_info.get("refresh_token"):
            # Didn't get new refresh token.
            # Old one is still valid.
            token_info["refresh_token"] = refresh_token

        token_info["expires_at"] = int(time.time()) + token_info["expires_in"]
        await self.client.db.insert_user(user_id, token_info)
        return token_info

    async def request_access_token(self, code):
        params = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
        }
        token_info = await self.client.http.post(
            CONSTANTS.TOKEN_URL, data=params, headers=self.headers, res_method="json"
        )
        if not token_info.get("access_token"):  # Something went wrong, return None
            return
        token_info["expires_at"] = int(time.time()) + token_info["expires_in"]
        return token_info


class User:  # Current user's spotify instance
    def __init__(self, user_id, token_info, app):
        self.id = user_id
        self.token_info = token_info
        self.client = app
        self.oauth = Oauth(app)

    @staticmethod
    async def _get_user_id(app, token_info):
        token = token_info.get("access_token")
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        profile = await app.http.get(
            CONSTANTS.API_URL + "me", res_method="json", headers=headers
        )
        return profile["id"]

    @classmethod
    async def from_id(cls, user_id, app):
        token_info = await app.db.fetch_user(user_id)

        if token_info:
            return cls(user_id, token_info, app)

    @classmethod
    async def from_token(cls, token_info, app, *, user_id=None):
        user_id = user_id or await cls._get_user_id(app, token_info)
        await app.db.insert_user(user_id, token_info)

        return cls(user_id, token_info, app)

    async def get_token(self):
        return await self.oauth.get_access_token(self.id, self.token_info)

    async def auth(self):
        access_token = await self.get_token()

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        return headers

    async def get(self, url):
        return await self.client.http.get(
            url, headers=await self.auth(), res_method="json"
        )

    async def put(self, url, json=None, res_method=None):
        return await self.client.http.put(
            url, headers=await self.auth(), json=json, res_method=res_method
        )

    async def get_spotify_id(self):
        profile = await self.get_profile()
        return profile["id"]

    async def get_profile(self):
        return await self.get(CONSTANTS.API_URL + "me")

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_recommendations(self, limit=100, **kwargs):
        params = {"limit": limit}
        params.update(**kwargs)
        return await self.get(
            CONSTANTS.API_URL + "recommendations?" + urlencode(params)
        )

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_liked_tracks(self, tracks: int = 99):
        """
        Get the current users liked tracks.
        Specify # of tracks.
        Returns list of tracks
        """

        liked_tracks = []
        offset = 0
        while tracks > 0:
            limit = tracks if tracks < 50 else 50
            query = urlencode({"limit": limit, "offset": offset * 50})
            batch = await self.get(CONSTANTS.API_URL + "me/tracks?" + query)
            if not batch["items"]:  # No more tracks
                break
            liked_tracks.extend(item["track"] for item in batch["items"])
            tracks -= limit
            offset += 1

        return liked_tracks

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_recent_tracks(self, tracks: int = 50):
        """
        Get the current users recent tracks.
        Specify # of tracks.
        Returns list of tracks
        Max items: 99
        """
        query = urlencode({"limit": tracks if tracks < 50 else 50})
        batch = await self.get(CONSTANTS.API_URL + "me/player/recently-played?" + query)
        return batch

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_top_tracks(self, tracks: int = 99, time_range="short_term"):
        """
        Get the current users top tracks.
        Specify # of tracks and time period.
        Returns list of tracks
        Max items: 99
        """
        top_tracks = []  # list of tracks
        tracks = tracks if tracks < 100 else 99  # Spotify limit.
        limit = tracks if tracks < 50 else 50
        query = urlencode({"limit": limit, "time_range": time_range, "offset": 0})
        batch = await self.get(CONSTANTS.API_URL + "me/top/tracks?" + query)
        top_tracks.extend(batch["items"])

        tracks -= limit

        if tracks > 0:
            query = urlencode({"limit": 50, "time_range": time_range, "offset": tracks})
            batch = await self.get(CONSTANTS.API_URL + "me/top/tracks?" + query)
            top_tracks.extend(batch["items"][1:])

        return top_tracks

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_top_artists(self, artists: int = 99, time_range="short_term"):
        """
        Get the current users top artists.
        Specify # of artists and time period.
        Returns list of artists
        Max items: 99
        """
        top_artists = []  # list of artists
        artists = artists if artists < 100 else 99  # Spotify limit.
        limit = artists if artists < 50 else 50
        query = urlencode({"limit": limit, "time_range": time_range, "offset": 0})
        batch = await self.get(CONSTANTS.API_URL + "me/top/artists?" + query)
        top_artists.extend(batch["items"])

        artists -= limit

        if artists > 0:
            query = urlencode(
                {"limit": 50, "time_range": time_range, "offset": artists}
            )
            batch = await self.get(CONSTANTS.API_URL + "me/top/artists?" + query)
            top_artists.extend(batch["items"][1:])

        return top_artists
    