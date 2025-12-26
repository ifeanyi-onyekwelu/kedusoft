#!/bin/bash
set -e

echo "Applying database migrations..."
flask db upgrade

echo "seeding properties and users..."
flask seed

echo "Starting Gunicorn..."
# The exec command is important for proper signal handling
exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 4 --threads 2 --timeout 60 run:app
