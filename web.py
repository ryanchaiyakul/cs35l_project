import os
import aiohttp
import asyncio
import logging
import secrets

from datetime import datetime, timedelta
from functools import wraps
from logging.handlers import RotatingFileHandler

from quart import (
    Quart,
    abort,
    request,
    redirect,
    url_for,
    render_template,
    session,
    make_response,
)


import config
from utilities import http, spotify, database

# Set up our website logger
MAX_LOGGING_BYTES = 32 * 1024 * 1024  # 32 MiB
FOLDER = "./logs"
if not os.path.exists(FOLDER):
    os.mkdir(FOLDER)
log = logging.getLogger("web")
log.setLevel(logging.INFO)
handler = RotatingFileHandler(
    filename=f"{FOLDER}/web.log",
    encoding="utf-8",
    mode="w",
    maxBytes=MAX_LOGGING_BYTES,
    backupCount=5,
)
log.addHandler(handler)
fmt = logging.Formatter(
    "{asctime}: [{levelname}] {name} || {message}", "%Y-%m-%d %H:%M:%S", style="{"
)
handler.setFormatter(fmt)


class CS35L(Quart):
    def __init__(self, name):
        super().__init__(name)
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)

        self.http = http.Utils()
        self.db = database.DB(self.loop)
        self.secret_key = secrets.token_urlsafe(64)
        self.current_users = {}

    def run(self):
        super().run(host=config.WEB.host, port=config.WEB.port, loop=self.loop)

app = CS35L(__name__)


async def get_user():
    user_id = request.cookies.get("user_id")
    if user_id:
        user = app.current_users.get(user_id)
        if user:
            return user
        return await spotify.User.from_id(user_id, app)


async def get_user_from_id(user_id):
    user = app.current_users.get(user_id)
    if user:
        return user
    return await spotify.User.from_id(user_id, app)


def login_required():
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user_id = request.cookies.get("user_id")
            user = None
            if user_id:
                user = app.current_users.get(user_id)
                if user:
                    return await func(*args, **kwargs)

                user = await spotify.User.from_id(user_id, app)

            if not user:  # Haven't connected their account.
                session["referrer"] = url_for(func.__name__)
                return redirect(url_for("spotify_connect"))

            app.current_users[user.id] = user

            return await func(*args, **kwargs)

        return wrapper

    return decorator


async def _tasked_requests(user):
    return
    """Immediately cache spotify data for efficiency"""
    for span in spotify.CONSTANTS.TIME_RANGE_MAP.keys():
        await user.get_top_tracks(time_range=span)
        await user.get_top_artists(time_range=span)

    await user.get_recommendations()
    await user.get_recent_tracks()
    await user.get_liked_tracks()


@app.before_first_request
async def speed_loader():
    user = await get_user()
    if user:
        app.loop.create_task(_tasked_requests(user))


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/")
async def home():
    return await render_template("index.html")


@app.route("/faqs")
async def faq_page():
    return "Did you really think I'd write a FAQ page? I sure hope you didn't."


@app.route("/connect")
async def spotify_connect():
    code = request.args.get("code")

    if not code:  # Need code, redirect user to spotify
        return redirect(spotify.Oauth(app).get_auth_url())

    token_info = await spotify.Oauth(app).request_access_token(code)
    if not token_info:  # Invalid code or user rejection, redirect them back.
        return redirect(spotify.Oauth(app).get_auth_url())

    sp_user = await spotify.User.from_token(token_info, app)  # Save user
    redirect_location = session.pop("referrer", url_for("home"))
    response = await make_response(redirect(redirect_location))

    response.set_cookie(
        "user_id",
        str(sp_user.id),
        expires=datetime.utcnow() + timedelta(days=365),
    )

    app.current_users[sp_user.id] = sp_user
    app.loop.create_task(_tasked_requests(sp_user))

    return response


@app.route("/disconnect/")
async def spotify_disconnect():
    user_id = request.cookies.get("user_id")
    if not user_id:
        return "You are not logged in"

    await app.db.delete_user(user_id)
    response = await make_response(redirect(url_for("home")))
    response.set_cookie("user_id", "", expires=0)
    app.current_users.pop(user_id, None)
    return response


@app.route("/recent/")
@login_required()
async def recent():
    user = await get_user()
    tracks = await user.get_recent_tracks()

    return str(tracks)


@app.route("/liked/")
@login_required()
async def spotify_liked():
    user = await get_user()
    tracks = await user.get_liked_tracks()
    return str(tracks)


###############
## INTERNALS ##
###############
@app.route("/_get_user_stats")
async def _get_user_stats():
    user_id = request.args.get("user_id")
    if not user_id:
        abort(400, "Must supply user_id query parameter!")
    user = await get_user_from_id(user_id)
    if not user:
        abort(404, "Invalid user, user must log in to spotify first.")

    rtracks = await user.get_recent_tracks(10)
    ttracks = await user.get_top_tracks(10)
    artists = await user.get_top_artists(10)

    return {"recent": rtracks["items"], "top_tracks": ttracks, "top_artists": artists}


@app.route("/_upload/")
async def upload():
    return await render_template("upload.html")


@app.route("/_upload_audio", methods=["POST", "GET"])
async def _upload_audio():
    if request.method == "POST":
        form = await request.form
        files = await request.files
        try:
            audio = files["audio_file"].read()
            title = form["title"]
            owner_id = form["owner_id"]
            tag = form["tag"]
        except:
            abort(400, "Malformed form received")
        fields = (title, owner_id, audio, tag)
        for field in fields:
            if not field:
                abort(404, "One or more form fields are empty.")
        try:
            await app.db.insert_audio(*fields)
        except:
            abort(502, "an audio file with the same title was already uploaded.")
        return "successfully uploaded audio"
    else:
        return await render_template("upload.html")


@app.route("/_get_audio_metadata")
async def _get_audio_metadata():
    data = await app.db.fetch_audio_metadata()
    return [{"title": record["title"], "tag": record["tag"]} for record in data]


@app.route("/_get_user_playlist_names")
async def _get_user_playlist_names():
    user_id = request.args.get("user_id")
    if not user_id:
        abort(400, "Must supply user_id query parameter!")
    user = await get_user_from_id(user_id)
    if not user:
        abort(404, "Invalid user, user must log in to spotify first.")

    data = await user.get_playlists()
    return {p["id"]: p["name"] for p in data}


@app.route("/_get_embed_html")
# @login_required()
async def get_embed_html():
    user_id = request.args.get("user_id")
    if not user_id:
        abort(400, "Must supply user_id query parameter!")
    user = await get_user_from_id(user_id)
    if not user:
        abort(404, "Invalid user, user must log in to spotify first.")

    spotify_url = request.args.get("url")
    if not spotify_url:
        abort(400, "Must supply url query parameter!")
    user = await get_user()

    embed = await user.get_embed("spotify_url")

    if not embed.get("html"):
        abort(400, "Invalid spotify url")
    return embed["html"]


if __name__ == "__main__":
    app.run()
