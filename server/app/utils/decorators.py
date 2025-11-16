from flask import g
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from ..utils.errors import CustomRequestError
from ..models.db_utils import get_item_by_id
from flask import g
from ..models import User


def role_required(required_role):
    """DECORATOR TO ENSURE THE USER HAS THE REQUIRED ROLE"""

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not hasattr(g, "session") or g.session is None:
                raise CustomRequestError("Database session not initialized.", 500)

            session = g.session
            decoded = get_jwt_identity()

            if not decoded:
                raise CustomRequestError("Invalid or missing JWT token.", 401)

            user_id = decoded
            user = get_item_by_id(session, User, user_id)

            if not user:
                raise CustomRequestError("User not found.", 404)

            user_dict = user.to_dict()

            if user_dict["role"] != required_role:
                raise CustomRequestError(
                    f"Unauthenticated. Only {required_role} can perform this action",
                    403,
                )
            return func(*args, **kwargs)

        return wrapper

    return decorator
