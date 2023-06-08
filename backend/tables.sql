-----------------------------
-- DATABASE TABLE CREATION --
-----------------------------

CREATE TABLE IF NOT EXISTS spotify_auth (
    user_id TEXT PRIMARY KEY,
    token_info JSONB DEFAULT '{}'::JSONB
);
CREATE INDEX IF NOT EXISTS token_idx ON spotify_auth(user_id, token_info);

-- add column to spotify auth to avoid creating duplicate playlists.
ALTER TABLE spotify_auth ADD COLUMN IF NOT EXISTS recommended_playlist_id varchar(64);

CREATE TABLE IF NOT EXISTS audio_files (
    title TEXT PRIMARY KEY,
    owner_id TEXT,
    audio BYTEA,
    tag TEXT,
    insertion TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC')
);

