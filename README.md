# SETUP GUIDE

## Step 1: Create a virtualenv

Run the command:
```console
myuser@computer:~$ python3 -m venv .venv
```

## Step 2: Activate the virtual environment

#### Windows:
```console
myuser@computer:~$ .venv/Scripts/activate
```
#### MacOS/Linux:
```console
myuser@computer:~$ source .venv/bin/activate
```

## Step 3: Install requirements

```console
myuser@computer:~$ pip install -r requirements.txt
```

## Step 4: Install postgresql

If no postgres is installed, default to json database.

#### Linux:
```console
myuser@computer:~$ sudo apt install postgresql postgresql-contrib
myuser@computer:~$ sudo -i -u postgres
postgres@computer:~$ psql
postgres=# \password
postgres=# mypassword # this will be used in the config.py file
postgres=# \q
postgres@computer:~$ createdb CS35L
postgres@computer:~$ su -
```
Mac users: Just install it with brew, should be plenty of resources online.

Windows users: install wsl and ubuntu, then run the above commands in ubuntu terminal
Here's a good tutorial: https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#5-install-your-first-package


## Step 5: Configure Spotify Dev Portal

Go to https://developer.spotify.com/dashboard and click "Create App"
Enter the following info:
App name: CS35L
App description: Recommendations/Stats/Audio
Redirect URI: http://localhost:3000/connect
Leave the rest blank and click save.

Copy the client ID and client secret and paste it into the config.py file

## Step 6: Initialize the config.py file.

```py
# example config.py file:
class WEB:
    host = "localhost"
    port = 4000
    base_url = f"http://{host}:{port}"


class POSTGRES:
    user = "postgres"
    password = "postgres password" # enter your postgres password here
    host = "localhost" # or your IP address
    port = 5432
    name = "CS35L"
    uri = f"postgres://{user}:{password}@{host}:{port}/{name}"


class SPOTIFY:
    client_id = "my client id" # get this from the spotify 
    client_secret = "my client secret" # get this from the spotify 
    redirect_uri = WEB.base_url + "/connect" 

```
