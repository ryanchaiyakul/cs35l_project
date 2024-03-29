################################
## CREATE AND MANAGE DATABASE ##
################################

import os
import json
import time
import config
import asyncio
import asyncpg
import logging

log = logging.getLogger("web")


class DB:
    """
    Attempts to create a postgres database connection,
    falls back to json.
    """

    def __init__(self, loop=None):
        self.loop = loop or asyncio.get_event_loop()
        self.json = False
        self.loop.run_until_complete(self.__init__db())

    async def __init__db(self):
        try:
            self.cxn = await asyncpg.create_pool(config.POSTGRES.uri)
        except:
            # Unable to create postgres connection
            log.warning("Unable to create postgres connection, using json instead.")
            self.json = True

        await self.scriptexec()

    async def scriptexec(self):
        if self.json:
            if not os.path.exists("./jsondb"):
                os.makedirs("./jsondb")
            if not os.path.exists("./jsondb/data.json"):
                with open("./jsondb/data.json", "w") as fp:
                    fp.write(r'{"users": {}, "audio": {}}')
            if not os.path.exists("./jsondb/audio_files"):
                os.makedirs("./jsondb/audio_files")

        else:
            # We execute the SQL script to make sure we have all our tables.
            with open("./backend/tables.sql", "r", encoding="utf-8") as script:
                await self.cxn.execute(script.read())

    async def insert_user(self, user_id, token_info):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                db["users"][user_id] = token_info
            with open("./jsondb/data.json", "w") as fp:
                json.dump(db, fp, indent=2)

        else:
            query = """                
                    INSERT INTO spotify_auth
                    VALUES ($1, $2)
                    ON CONFLICT (user_id)
                    DO UPDATE SET token_info = $2
                    WHERE spotify_auth.user_id = $1;
                    """
            await self.cxn.execute(query, user_id, json.dumps(token_info))

    async def delete_user(self, user_id):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                db["users"].pop(user_id, None)
            with open("./jsondb/data.json", "w") as fp:
                json.dump(db, fp, indent=2)
        else:
            query = """
                DELETE FROM spotify_auth
                WHERE user_id = $1
                """
            await self.cxn.execute(query, user_id)

    async def fetch_user(self, user_id):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                token_info = db["users"].get(user_id)
        else:
            query = """
                    SELECT token_info
                    FROM spotify_auth
                    WHERE user_id = $1;
                    """
            token_info = await self.cxn.fetchval(query, user_id)
            if token_info:
                token_info = json.loads(token_info)

        return token_info

    async def insert_audio(self, title, owner_id, audio, tag):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                if db["audio"].get(title):
                    raise asyncpg.UniqueViolationError("Duplicate Key")
                db["audio"][title] = {
                    "owner_id": owner_id,
                    "tag": tag,
                    "insertion": int(time.time()),
                }
            with open("./jsondb/data.json", "w") as fp:
                json.dump(db, fp, indent=2)

            with open(f"./jsondb/audio_files/{title}.mp3", "wb") as fp:
                fp.write(audio)

        else:
            query = """
                    INSERT INTO audio_files
                    (title, owner_id, audio, tag)
                    VALUES ($1, $2, $3, $4)
                    """
            await self.cxn.execute(query, title, owner_id, audio, tag)

    async def fetch_audio_metadata(self):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                data = db["audio"]

            return [{"title": k, "tag": v["tag"]} for k, v in data.items()]

        query = """
                SELECT title, tag
                FROM audio_files;
                """
        data = await self.cxn.fetch(query)
        return [{"title": record["title"], "tag": record["tag"]} for record in data]

    async def fetch_audio_data(self, title):
        if self.json:
            if not os.path.exists(f"./jsondb/audio_files/{title}.mp3"):
                return
            with open(f"./jsondb/audio_files/{title}.mp3", "rb") as fp:
                data = fp.read()
                return data

        query = """
                SELECT audio
                FROM audio_files
                WHERE title = $1;
                """
        return await self.cxn.fetchval(query, title)

    async def insert_recommended_playlist(self, user_id, playlist_id):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                db["users"][user_id]["recommended_playlist_id"] = playlist_id
            with open("./jsondb/data.json", "w") as fp:
                json.dump(db, fp, indent=2)
        else:
            query = """                
                    UPDATE spotify_auth
                    SET recommended_playlist_id = $1
                    WHERE user_id = $2;
                    """
            await self.cxn.execute(query, playlist_id, user_id)

    async def fetch_recommended_playlist(self, user_id):
        if self.json:
            with open("./jsondb/data.json", "r") as fp:
                db = json.load(fp)
                return db["users"][user_id].get("recommended_playlist_id")
        else:
            query = """                
                    SELECT recommended_playlist_id
                    FROM spotify_auth
                    WHERE user_id = $1;
                    """
            return await self.cxn.fetchval(query, user_id)
