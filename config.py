class WEB:
    host = "localhost"
    port = 4000
    base_url = f"http://{host}:{port}"


class POSTGRES:
    user = "helenfeng"
    password = "hyfg2820" # enter your postgres password here
    host = "localhost" # or your IP address
    port = 5432
    name = "cs35l"
    uri = f"postgres://{user}:{password}@{host}:{port}/{name}"


class SPOTIFY:
    client_id = "0ef075763c7c4e4bb9c4741dd65614cb" # get this from the spotify 
    client_secret = "53bff45a9fae46a7a235656b94b73ba1" # get this from the spotify 
    redirect_uri = WEB.base_url + "/connect"
