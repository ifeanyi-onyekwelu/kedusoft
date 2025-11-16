from flask import Blueprint, request, g
from flask_jwt_extended import jwt_required
from datetime import datetime
from ..utils.helpers import dict_except, response, get_logged_in_user, serialize
from ..utils.errors import CustomRequestError, catch_exception
import bcrypt
import os
from ..models.db_utils import update_item, get_item_by_id
from ..utils.uploader import upload_file
from ..models import User
import logging

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

profile = Blueprint("profile", __name__)

UPLOADED_FOLDER = "uploads/identity_docs"
os.makedirs(UPLOADED_FOLDER, exist_ok=True)

###############################################################################
# BASIC PROFILE OPERATIONS
###############################################################################


@profile.route("/", methods=["GET", "PUT"])
@catch_exception
@jwt_required()
def get_profile():
    """Get or update basic profile information"""
    user_id, user, _ = get_logged_in_user()

    if not user:
        raise CustomRequestError("User not found", 404)

    if request.method == "GET":
        data = dict_except(user, "password")
        return response("User details", data)

    if request.method == "PUT":
        data = dict_except(request.json, "email", "password")
        updated_user = update_item(g.session, User, user_id, data)
        return response(
            "User profile updated successfully",
            {"updated_user": updated_user.to_dict()},
        )


###############################################################################
# ACCOUNT STATUS MANAGEMENT
###############################################################################


@profile.route("/pause", methods=["POST"])
@catch_exception
@jwt_required()
def pause_account():
    """Pause/temporarily deactivate user account"""
    user_id, _, _ = get_logged_in_user()

    updated_user = update_item(
        g.session,
        User,
        user_id,
        {"is_active": False, "is_suspended": False, "updated_at": datetime.utcnow()},
    )

    return response(
        "Account paused successfully. You can resume anytime.",
        {"user": updated_user.to_dict()},
    )


@profile.route("/resume", methods=["POST"])
@catch_exception
@jwt_required()
def resume_account():
    """Resume/reactivate a paused account"""
    user_id, _, _ = get_logged_in_user()

    updated_user = update_item(
        g.session,
        User,
        user_id,
        {"is_active": True, "is_suspended": False, "updated_at": datetime.utcnow()},
    )

    return response("Account resumed successfully", {"user": updated_user.to_dict()})


@profile.route("/delete", methods=["DELETE"])
@catch_exception
@jwt_required()
def delete_account():
    """Soft delete user account (can be restored by admin)"""
    user_id, _, _ = get_logged_in_user()

    updated_user = update_item(
        g.session,
        User,
        user_id,
        {
            "is_active": False,
            "is_deleted": True,
            "deleted_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        },
    )

    return response(
        "Account deleted successfully. Contact support to restore.",
        {"user": updated_user.to_dict()},
    )


###############################################################################
# SECURITY & AUTHENTICATION
###############################################################################


@profile.route("/change-password", methods=["PUT"])
@catch_exception
@jwt_required()
def handle_change_password():
    """Change account password with current password verification"""
    user_id, user, _ = get_logged_in_user()
    data = request.get_json()

    currentPassword = data.get("currentPassword")
    newPassword = data.get("newPassword")

    if not user or not bcrypt.checkpw(
        currentPassword.encode("utf-8"), user["password"].encode("utf-8")
    ):
        raise CustomRequestError("Current password is incorrect", 401)

    hashed_new_password = bcrypt.hashpw(
        newPassword.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    update_item(
        g.session,
        User,
        user_id,
        {"password": hashed_new_password, "updated_at": datetime.utcnow()},
    )

    return response("Password changed successfully")


###############################################################################
# DOCUMENT UPLOADS
###############################################################################


@profile.route("/upload-profile-picture", methods=["POST"])
@catch_exception
@jwt_required()
def upload_profile_picture():
    """Upload or update profile picture"""
    user_id, _, _ = get_logged_in_user()
    profile_picture = request.files.get("profile_picture")

    if not profile_picture:
        raise CustomRequestError("Profile picture is required", 400)

    profile_picture_response = upload_file(
        profile_picture, f"profile_picture/{user_id}_profile_picture"
    )

    if not profile_picture_response:
        raise CustomRequestError("Failed to upload profile picture", 500)

    data = {
        "profile_picture": profile_picture_response.get("secure_url"),
        "updated_at": datetime.utcnow(),
    }
    updated_user = update_item(g.session, User, user_id, data)

    return response(
        "Profile picture uploaded successfully",
        {"updated_user": serialize(updated_user)},
    )


@profile.route("/upload-identity-docs", methods=["POST"])
@catch_exception
@jwt_required()
def upload_identity_docs():
    """Upload identity verification documents"""
    user_id, _, _ = get_logged_in_user()
    identity_card = request.files.get("identity_card")
    national_id_card = request.files.get("national_id_card")

    if not identity_card or not national_id_card:
        raise CustomRequestError(
            "Both identity card and national id card are required", 400
        )

    identity_card_response = upload_file(
        identity_card, f"identity_docs/{user_id}_identity_card"
    )
    national_id_card_response = upload_file(
        national_id_card, f"identity_docs/{user_id}_national_id_card"
    )

    if not identity_card_response or not national_id_card_response:
        raise CustomRequestError("Failed to upload documents", 500)

    data = {
        "identity_card": identity_card_response.get("secure_url"),
        "national_id_card": national_id_card_response.get("secure_url"),
        "updated_at": datetime.utcnow(),
        "is_verified": True,
    }
    updated_user = update_item(g.session, User, user_id, data)

    return response(
        "Documents uploaded successfully",
        {"updated_user": updated_user.to_dict()},
    )


###############################################################################
# VERIFICATION ENDPOINTS
###############################################################################


@profile.route("/request-verification", methods=["POST"])
@catch_exception
@jwt_required()
def request_verification():
    """Request account verification (typically after uploading docs)"""
    user_id, user, _ = get_logged_in_user()

    if not user.identity_card or not user.national_id_card:
        raise CustomRequestError("Please upload identity documents first", 400)

    updated_user = update_item(
        g.session,
        User,
        user_id,
        {"verification_status": "pending", "updated_at": datetime.utcnow()},
    )

    return response(
        "Verification requested successfully. Please wait for admin approval.",
        {"user": updated_user.to_dict()},
    )
