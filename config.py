class WEB:
    host = "localhost"
    port = 4000
    base_url = f"http://{host}:{port}"


class POSTGRES:
    user = "angelatan"
    password = "dongdonG09" # enter your postgres password here
    host = "localhost" # or your IP address
    port = 5432
    name = "cs35l"
    uri = f"postgres://{user}:{password}@{host}:{port}/{name}"


class SPOTIFY:
    client_id = "315e1a27ebcb4a5988683331762b6a52" # get this from the spotify 
    client_secret = "96d1d934e0644431af15c0678603a0f8" # get this from the spotify 
    redirect_uri = WEB.base_url + "/connect"
