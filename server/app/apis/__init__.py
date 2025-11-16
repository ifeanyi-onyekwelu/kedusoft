from flask import Blueprint
from flask_dance.contrib.google import make_google_blueprint
from ..utils.helpers import response
from ..utils.variables import APP_NAME
from .auth import auth
from .admin import admin
from .landlord import landlord
from .review import review
from .profile import profile
from .tenant import tenant
from .public import public
from .messaging import messaging_bp

api = Blueprint("apis", __name__)


api.register_blueprint(auth, url_prefix="/auth")
api.register_blueprint(admin, url_prefix="/admin")
api.register_blueprint(landlord, url_prefix="/property-owner")
api.register_blueprint(review, url_prefix="/review")
api.register_blueprint(profile, url_prefix="/profile")
api.register_blueprint(tenant, url_prefix="/tenant")
api.register_blueprint(public, url_prefix="/public")
api.register_blueprint(messaging_bp, url_prefix="/messaging")

google_bp = make_google_blueprint(
    client_id="your-client-id",
    client_secret="your-client-secret",
    scope=["profile", "email"],
    redirect_to="auth.google_login_callback",  # Ensure this route exists in the auth blueprint
)
api.register_blueprint(google_bp, url_prefix="/auth/google")
