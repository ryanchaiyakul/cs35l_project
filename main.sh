#!/bin/bash

if [ ! -f "config.py" ]; then
    echo "Error: config.py does not exist"
    exit 1
fi

# Run build if folder does not exist
if [ ! -d "frontend/build" ]; then
    echo "Creating frontend build"
    #npm --prefix frontend i > /dev/null
    npm run build --prefix frontend > /dev/null
else
    echo "Frontend build already exists"
fi

# Create python virtual environment if .venv does not exist
if [ ! -d ".venv" ]; then
    echo "Creating python virtual environment"
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
else
    source .venv/bin/activate
fi

python web.py