#!/bin/bash
# Custom build script for Render (optional)
# Installs pipenv and dependencies, then exits (Render will use startCommand to launch the app)
cd backend
pip install pipenv
pipenv install --deploy --ignore-pipfile
