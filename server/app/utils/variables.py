from dotenv import load_dotenv
import os

load_dotenv()

# APP VARIABLES
APP_SECRET = os.environ["APP_SECRET"]
APP_NAME = os.environ["APP_NAME"]
APP_URL = os.environ["APP_URL"]

# JWT VARIABLES
JWT_SECRET = os.environ["JWT_SECRET"]

# PORT
PORT = os.environ["PORT"]

# CLOUDINARY VARIABLES
CLOUD_NAME = os.environ["CLOUD_NAME"]
CLOUD_API_KEY = os.environ["CLOUD_API_KEY"]
CLOUD_API_SECRET = os.environ["CLOUD_API_SECRET"]

# MAIL VARIABLES
MAIL_SERVER = os.environ["MAIL_SERVER"]
MAIL_PORT = os.environ["MAIL_PORT"]
MAIL_USERNAME = os.environ["MAIL_USERNAME"]
MAIL_PASSWORD = os.environ["MAIL_PASSWORD"]

DATABASE_URL = os.environ["DATABASE_URL"]

GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]

SENDGRID_API_KEY = os.environ["SENDGRID_API_KEY"]

SITE_URL = os.environ["SITE_URL"]
