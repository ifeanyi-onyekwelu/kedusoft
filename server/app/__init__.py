"""
Main application factory for the Kedusoft Rental API.
Initializes Flask app, database connections, and all extensions.
"""

from flask import Flask, request, g
from flask_docs_api.api import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from datetime import datetime
import click
from .utils.helpers import response
from .utils.variables import (
    APP_NAME,
    MAIL_SERVER,
    MAIL_PASSWORD,
    MAIL_PORT,
    APP_SECRET,
    MAIL_USERNAME,
    JWT_SECRET,
    DATABASE_URL,
)
from .utils.helpers import seed_categories, seed_properties
from .utils.mailer import init_mail
from flask_migrate import Migrate
import sentry_sdk
from .models import db

migrate = Migrate()  # Database migration handler
Session = None  # Global SQLAlchemy scoped session (initialized in create_app)
socketio = SocketIO(cors_allowed_origins="*", async_mode="threading")


def create_app():
    """
    Application factory that creates and configures the Flask app.
    Sets up database connections, authentication, and API routes.

    Returns:
        Flask: Configured Flask application instance
    """
    global Session, socketio  # Access the global Session and SocketIO variables

    sentry_sdk.init(
        dsn="https://7e8f3835077fc87f2c94b9a26eedcfdf@o4509614625521664.ingest.us.sentry.io/4509614628601856",
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
        traces_sample_rate=1.0,
    )

    # --- Flask Application Setup --- #
    app = Flask(__name__)

    # Flask mail initialization
    init_mail(app)

    # API documentation generator
    api = Api(app, "Test")

    # JWT Authentication manager
    jwt = JWTManager(app)

    # CORS configuration (allows cross-origin requests)
    CORS(app, origins="*")

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL

    # Initialize database engine and session

    # --- Database Configuration --- #
    # PostgreSQL connection engine using environment variables
    engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])

    # Scoped session factory for database sessions
    Session = scoped_session(sessionmaker(bind=engine))

    # Initialize Flask-SQLAlchemy and Flask-Migrate
    db.init_app(app)  # Connect SQLAlchemy to Flask app
    migrate.init_app(app, db)  # Connect migrations to app and db
    socketio.init_app(app)

    with app.app_context():
        from . import models

    # --- Socket.IO Event Handlers --- #
    from .utils.messaging_socket import init_messaging_socket

    # --- Application Configuration --- #
    # Security and application settings
    app.config.update(
        {
            "APP_NAME": APP_NAME,
            "APP_SECRET": APP_SECRET,
            "SECRET_KEY": APP_SECRET,
            "JWT_SECRET_KEY": JWT_SECRET,
            "MAIL_SERVER": MAIL_SERVER,
            "MAIL_PORT": int(MAIL_PORT),  # Ensure port is integer
            "MAIL_USE_TLS": True,
            "MAIL_USE_SSL": False,  # Use TLS, not SSL for Gmail
            "MAIL_USERNAME": MAIL_USERNAME,
            "MAIL_PASSWORD": MAIL_PASSWORD,
            "MAIL_DEFAULT_SENDER": MAIL_USERNAME,
        }
    )

    # --- Database Session Management --- #
    @app.before_request
    def create_session():
        """Creates a new database session for each request."""
        g.session = Session()

    @app.teardown_appcontext
    def cleanup_session(exception=None):
        """Cleans up the database session after each request."""
        session = g.pop("session", None)
        if session is not None:
            session.close()

    # --- CLI Commands --- #
    @app.cli.command("seed")
    def seed_data():
        """Seeds initial data into the database."""
        with app.app_context():
            seed_categories(Session())
            seed_properties(Session())

    @app.cli.command("test-email")
    @click.option(
        "--to", default="ifeanyi.onyekwelu@outlook.com", help="Recipient email address"
    )
    @click.option("--subject", default="Test Email", help="Email subject")
    def test_email(to, subject):
        """Test email functionality."""
        from .utils.mailer import send_email

        try:
            success = send_email(
                subject=subject,
                recipients=[to],
                body=f"""
                <h2>Email Test Successful! 🎉</h2>
                <p>This is a test email from your apartment rental platform.</p>
                <p><strong>Server:</strong> {MAIL_SERVER}:{MAIL_PORT}</p>
                <p><strong>From:</strong> {MAIL_USERNAME}</p>
                <p><strong>To:</strong> {to}</p>
                <p><strong>Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <hr>
                <p style="color: green;">✅ Your email configuration is working correctly!</p>
                """,
            )

            if success:
                print(f"✅ Test email sent successfully to {to}")
                return "Email sent successfully"
            else:
                print(f"❌ Failed to send test email to {to}")
                return "Email sending failed"

        except Exception as e:
            print(f"❌ Email test failed: {e}")
            return f"Error: {e}"

    # --- Routes --- #
    @app.get("/")
    def home():
        """Root endpoint that verifies API is running."""
        return response(f"{APP_NAME} API is running")

    # Register API blueprint (main routes)
    from .apis import api as api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api/v1")

    # --- Error Handlers --- #
    @app.errorhandler(404)
    def invalid_route(error):
        """Handles 404 errors for API routes."""
        if "/api/v1" in request.url:
            return response("Invalid route", None, False)
        return error

    @app.errorhandler(Exception)
    def server_error(error):
        """Handles 500 errors for API routes."""
        if "/api/v1" in request.url:
            return response(str(error), None, False)
        return error

    return app
