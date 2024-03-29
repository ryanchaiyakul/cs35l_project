#########################################
## AUTHENTICATION AND SPOTIFY REQUESTS ##
#########################################

import json
import time
import base64
from urllib.parse import urlencode

from backend import cache
from config import SPOTIFY

from datetime import date


class CONSTANTS:
    GREEN_ICON = "https://cdn.discordapp.com/attachments/872338764276576266/932399347289706556/spotify_green.png"  # Spotify icon
    BASE_URL = "https://open.spotify.com/"
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
    async def get_recommendations(self, limit=100):
        recents = await self.get_recent_tracks(10)

        tracks = ",".join([t["track"]["id"] for t in recents["items"]][:5])
        params = {
            "limit": limit,
            "seed_tracks": tracks,
        }
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

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_playlists(self, playlists: int = 100):
        """Get a user's owned and followed playlists"""
        _playlists = []
        offset = 0
        while playlists > 0:
            limit = playlists if playlists < 50 else 50
            query = urlencode({"limit": limit, "offset": offset * 50})
            batch = await self.get(CONSTANTS.API_URL + "me/playlists?" + query)
            if not batch["items"]:
                break
            _playlists.extend(batch["items"])
            playlists -= limit
            offset += 1

        return _playlists

    @cache.cache(strategy=cache.Strategy.timed)
    async def get_embed(self, url):
        query = urlencode({"url": url})
        return await self.get(CONSTANTS.BASE_URL + "oembed?" + query)

    async def get_playlist(self, user, uri):
        """Get a playlist's info from its URI"""
        return await self.make_spotify_req(
            CONSTANTS.API_URL + "users/{0}/playlists/{1}{2}".format(user, uri)
        )

    async def create_recommended_playlist(self):
        spotify_id = await self.get_spotify_id()
        data = {
            "name": "My Terrarium Recomendations",
            "public": True,
            "collaborative": False,
            "description": "",
        }

        return await self.client.http.post(
            CONSTANTS.API_URL + f"users/{spotify_id}/playlists",
            data=json.dumps(data),
            headers=await self.auth(),
            res_method="json",
        )

    async def add_to_playlist(self, playlist_id, uris: list, position=None):

        while uris:
            data = {"uris": uris[:100]}  # 100 at a time spotify limit.
            if position:
                data["position"] = position
            snapshot = await self.client.http.put(
                CONSTANTS.API_URL + f"playlists/{playlist_id}/tracks",
                data=json.dumps(data),
                headers=await self.auth(),
                res_method="json",
            )
            uris = uris[100:]
        return snapshot


class BaseUtils:
    def __init__(self) -> None:
        pass

    def _get_image(self, obj, quality="best"):
        if quality == "fast":
            index = -1
        else:
            index = 0
        try:
            return obj["images"][index]["url"]
        except (IndexError, KeyError):
            return CONSTANTS.GREEN_ICON

    def _release_date(self, date_str):
        date_parts = date_str.split("-")
        date_parts = [int(dp) for dp in date_parts]

        if len(date_parts) == 1 or len(date_parts) == 2:
            return date_parts[0]

        date_obj = date(*date_parts)

        return date_obj.__format__("%B %d, %Y")

    def parse_duration(self, duration: int):
        """
        Helper function to get visually pleasing
        timestamps from position of song in seconds.
        """
        duration = round(duration)
        if duration > 0:
            minutes, seconds = divmod(duration, 60)
            hours, minutes = divmod(minutes, 60)
            days, hours = divmod(hours, 24)

            duration = []
            if days > 0:
                duration.append(str(days))
            if hours > 0:
                duration.append(str(hours))
            if minutes > 0:
                duration.append(str(minutes))
            duration.append("{}".format(str(seconds).zfill(2)))

            value = ":".join(duration)

        elif duration == 0:
            value = "LIVE"

        return value


class Track(BaseUtils):
    def __init__(self, data, *, quality="best"):
        super().__init__()
        self.id = data["id"]
        self.name = data["name"]
        self.cover = self._get_image(data["album"], quality=quality)
        self.release = self._release_date(data["album"]["release_date"])
        self.uri = "spotify:track:" + self.id
        self.url = data["external_urls"]["spotify"]
        self.popularity = data.get("popularity")
        self.duration = self.parse_duration(data["duration_ms"] / 1000)
        self.raw_duration = data["duration_ms"]
        self.preview = data["preview_url"]

        self.artists = data["artists"]

        self.raw = data
        self.json = json.dumps(data)
        self.index = data.get("index")
