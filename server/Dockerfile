FROM python:3.11-slim

# Install system dependencies needed for PostgreSQL (if using psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

# Start the container using the entrypoint script
CMD ["./entrypoint.sh"]
