-----------------------------
-- DATABASE TABLE CREATION --
-----------------------------

CREATE TABLE IF NOT EXISTS spotify_auth (
    user_id TEXT PRIMARY KEY,
    token_info JSONB DEFAULT '{}'::JSONB
);
CREATE INDEX IF NOT EXISTS token_idx ON spotify_auth(user_id, token_info);

CREATE TABLE IF NOT EXISTS audio_files (
    index BIGSERIAL PRIMARY KEY,
    audio BYTEA,
    title TEXT,
    owner_id TEXT,
    tag TEXT,
    insertion TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC')
);

