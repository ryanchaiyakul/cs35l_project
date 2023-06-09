# SETUP GUIDE:

## Step 1:
Clone this repository into your directory of choice using:
```console
git clone https://github.com/ryanchaiyakul/cs35l_project
```

## Step 2:
Ensure python3, pip, nodejs, and npm are all installed and up to date.

## Step 3 (OPTIONAL): Install postgresql
If no postgres is installed, the app will default to a local json database.

#### Linux:
```console
myuser@computer:~$ sudo apt install postgresql postgresql-contrib
myuser@computer:~$ sudo -i -u postgres
postgres@computer:~$ psql
postgres=# \password
postgres=# mypassword # this will be used in the config.py file
postgres=# \q
postgres@computer:~$ createdb cs35l
postgres@computer:~$ su -
```

## Step 4: Configure Spotify Client Via Dev Portal

Go to https://developer.spotify.com/dashboard and click "Create App"
Enter the following info:
App name: CS35L
App description: Recommendations/Stats/Audio
Redirect URI: http://localhost:4000/connect
Leave the rest blank and click save.

Copy the client ID and client secret and paste it into the config.py file template below:

## Step 5: Initialize the config.py file.
Create a file in the cs35l_project directory named config.py and paste the following template into it.
Note:
    If you wish to use the postgres database, update the corresponding fields in the postgres class.

```py
# example config.py file:
class WEB:
    host = "localhost"
    port = 4000
    base_url = f"http://{host}:{port}"


class POSTGRES:
    user = "postgres" # Your db admin postgres username (postgres is default)
    password = "" # Your postgres database password
    host = "localhost" # or your IP address
    port = 5432 # Default port
    name = "cs35l" # Your database name.
    uri = f"postgres://{user}:{password}@{host}:{port}/{name}" # Leave unchanged.


class SPOTIFY:
    client_id = "my client id" # get this from the spotify 
    client_secret = "my client secret" # get this from the spotify 
    redirect_uri = WEB.base_url + "/connect"  # Leave unchanged
```

## Step 6: Run The App!
Run the command from inside the cs35l_project:
```console
./main.sh
```