#!/bin/sh
# Run migrations
flask db upgrade
# Start the server
exec gunicorn -k eventlet -w 1 -b 0.0.0.0:$PORT run:app
