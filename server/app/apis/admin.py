from flask import Blueprint, request, g
from flask_jwt_extended import jwt_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime
from ..utils.helpers import response, serialize, get_logged_in_user
from ..utils.decorators import role_required
from ..utils.errors import CustomRequestError, catch_exception
from ..utils.mailer import send_email
from ..utils.variables import APP_URL
from ..models.db_utils import (
    get_all_items,
    get_item_by_id,
    get_items_by_filter,
    delete_item,
    update_item,
)
from ..models import Property, User, Application, Transaction
import logging

# Configure enhanced logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["500 per day", "100 per hour"],
    storage_uri="redis://localhost:6379" if APP_URL != "localhost" else None,
)

# Rate limiting rules for admin operations
admin_read_limiter = limiter.shared_limit("200 per hour", scope="admin_read")
admin_write_limiter = limiter.shared_limit("50 per hour", scope="admin_write")
admin_delete_limiter = limiter.shared_limit("20 per hour", scope="admin_delete")

admin = Blueprint("agent", __name__)

# ======================================================
# VALIDATION SCHEMAS
# ======================================================


class PropertyVerificationSchema(Schema):
    status = fields.Str(
        required=True,
        validate=validate.OneOf(["approved", "rejected"]),
        error_messages={
            "required": "Verification status is required",
            "invalid": "Status must be either 'approved' or 'rejected'",
        },
    )


class UserActionSchema(Schema):
    reason = fields.Str(
        validate=validate.Length(min=10, max=500),
        error_messages={"invalid": "Reason must be between 10 and 500 characters"},
    )


# ======================================================
# UTILITY FUNCTIONS
# ======================================================


def log_admin_action(
    action_type: str, admin_id: str, target_id: str = None, details: dict = None
):
    """Log admin actions for audit trail"""
    logger.info(
        f"ADMIN_ACTION: {action_type}",
        extra={
            "action_type": action_type,
            "admin_id": admin_id,
            "target_id": target_id,
            "ip_address": request.remote_addr,
            "user_agent": request.headers.get("User-Agent"),
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


def validate_admin_permissions(admin_user: User) -> None:
    """Validate admin user has required permissions"""
    if not admin_user:
        raise CustomRequestError("Admin user not found", 404)

    if not admin_user.is_active:
        raise CustomRequestError("Admin account is inactive", 403)

    if admin_user.is_suspended:
        raise CustomRequestError("Admin account is suspended", 403)


# ======================================================
# PROPERTIES ROUTES
# ======================================================


@admin.route("/properties", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
@admin_read_limiter
def get_all_properties():
    """
    Enhanced retrieval of all properties with admin validation
    Rate limited: 200 requests per hour
    """
    try:
        # Get and validate admin user
        admin_id, admin_user, _ = get_logged_in_user()
        validate_admin_permissions(admin_user)

        # Retrieve properties with pagination support
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 50, type=int), 100)  # Max 100 items

        properties = get_all_items(g.session, Property)
        serialized_properties = serialize(properties)

        # Log admin action
        log_admin_action(
            "PROPERTIES_VIEW_ALL",
            admin_id,
            details={"count": len(properties), "page": page},
        )

        logger.info(f"Admin {admin_id} retrieved {len(properties)} properties")

        return response(
            "Properties retrieved successfully",
            {
                "properties": serialized_properties,
                "total": len(properties),
                "page": page,
                "per_page": per_page,
            },
        )

    except Exception as e:
        logger.error(f"Failed to retrieve properties for admin {admin_id}: {str(e)}")
        raise CustomRequestError("Failed to retrieve properties", 500)


@admin.route("/properties/verified", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
@admin_read_limiter
def get_properties_by_status_admin():
    """
    Enhanced retrieval of properties by verification status
    Rate limited: 200 requests per hour
    """
    try:
        # Get and validate admin user
        admin_id, admin_user, _ = get_logged_in_user()
        validate_admin_permissions(admin_user)

        # Validate request data
        data = request.get_json() or {}
        status = data.get("status")

        if status and status not in ["pending", "approved", "rejected"]:
            raise CustomRequestError(
                "Invalid status. Must be 'pending', 'approved', or 'rejected'", 400
            )

        filters = {"deleted": False}
        if status:
            filters["verification_status"] = status

        properties = get_items_by_filter(g.session, Property, filters)
        serialized_properties = serialize(properties)

        # Log admin action
        log_admin_action(
            "PROPERTIES_VIEW_BY_STATUS",
            admin_id,
            details={"status": status, "count": len(properties)},
        )

        logger.info(
            f"Admin {admin_id} retrieved {len(properties)} properties with status: {status}"
        )

        return response(
            "Properties retrieved successfully",
            {
                "properties": serialized_properties,
                "status_filter": status,
                "total": len(properties),
            },
        )

    except Exception as e:
        logger.error(
            f"Failed to retrieve properties by status for admin {admin_id}: {str(e)}"
        )
        raise CustomRequestError("Failed to retrieve properties", 500)


@admin.route("/properties/<string:property_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("admin")
@admin_delete_limiter
def delete_property_admin(property_id):
    """
    Enhanced property deletion with validation and audit logging
    Rate limited: 20 deletions per hour
    """
    try:
        # Get and validate admin user
        admin_id, admin_user, _ = get_logged_in_user()
        validate_admin_permissions(admin_user)

        # Validate property ID format
        if not property_id or len(property_id.strip()) == 0:
            raise CustomRequestError("Invalid property ID", 400)

        # Check if the property exists
        property = get_item_by_id(g.session, Property, property_id)
        if not property:
            raise CustomRequestError(f"Property with ID {property_id} not found", 404)

        # Store property info for logging before deletion
        property_info = {
            "title": getattr(property, "title", "N/A"),
            "landlord_id": getattr(property, "landlord_id", "N/A"),
            "verification_status": getattr(property, "verification_status", "N/A"),
        }

        # Delete the property permanently
        delete_item(g.session, Property, property_id)

        # Log admin action with detailed info
        log_admin_action(
            "PROPERTY_DELETED", admin_id, property_id, {"property_info": property_info}
        )

        logger.warning(f"Admin {admin_id} permanently deleted property {property_id}")

        # Send notification to property owner (if needed)
        try:
            if hasattr(property, "landlord") and property.landlord:
                send_email(
                    "Property Deleted by Admin",
                    [property.landlord.email],
                    "property_deletion_notification",
                    {
                        "property_title": property_info["title"],
                        "admin_action": True,
                        "deletion_date": datetime.utcnow().strftime(
                            "%Y-%m-%d %H:%M:%S UTC"
                        ),
                    },
                )
        except Exception as e:
            logger.error(f"Failed to send deletion notification: {str(e)}")

        return response(f"Property with ID {property_id} permanently deleted")

    except Exception as e:
        logger.error(
            f"Failed to delete property {property_id} by admin {admin_id}: {str(e)}"
        )
        if isinstance(e, CustomRequestError):
            raise
        raise CustomRequestError("Failed to delete property", 500)


@admin.route("/properties/<string:property_id>/verify", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("admin")
@admin_write_limiter
def verify_property_admin(property_id):
    """
    Enhanced property verification with validation and audit logging
    Rate limited: 50 updates per hour
    """
    try:
        # Get and validate admin user
        admin_id, admin_user, _ = get_logged_in_user()
        validate_admin_permissions(admin_user)

        # Validate property ID
        if not property_id or len(property_id.strip()) == 0:
            raise CustomRequestError("Invalid property ID", 400)

        # Check if the property exists
        property = get_item_by_id(g.session, Property, property_id)
        if not property:
            raise CustomRequestError(f"Property with ID {property_id} not found", 404)

        # Validate request data using schema
        try:
            schema = PropertyVerificationSchema()
            data = schema.load(request.get_json() or {})
            status = data["status"]
        except ValidationError as err:
            raise CustomRequestError("Validation error", 400, {"errors": err.messages})

        # Check if status is already set
        if property.verification_status == status:
            return response(f"Property is already {status}", serialize(property))

        # Update the verification status
        update_data = {
            "verification_status": status,
            "verified_at": datetime.utcnow(),
            "verified_by": admin_id,
        }

        updated_property = update_item(g.session, Property, property_id, update_data)

        # Log admin action
        log_admin_action(
            "PROPERTY_VERIFICATION_STATUS_CHANGED",
            admin_id,
            property_id,
            {
                "old_status": property.verification_status,
                "new_status": status,
                "property_title": getattr(property, "title", "N/A"),
            },
        )

        logger.info(
            f"Admin {admin_id} changed property {property_id} status to {status}"
        )

        # Send notification to property owner
        try:
            if hasattr(property, "landlord") and property.landlord:
                template_name = (
                    "property_approved" if status == "approved" else "property_rejected"
                )
                send_email(
                    f"Property {status.title()}",
                    [property.landlord.email],
                    template_name,
                    {
                        "property_title": getattr(property, "title", "Your Property"),
                        "status": status,
                        "admin_review_date": datetime.utcnow().strftime("%Y-%m-%d"),
                    },
                )
        except Exception as e:
            logger.error(f"Failed to send verification notification: {str(e)}")

        return response(
            f"Property with ID {property_id} has been {status} successfully",
            serialize(updated_property),
        )

    except Exception as e:
        logger.error(
            f"Failed to verify property {property_id} by admin {admin_id}: {str(e)}"
        )
        if isinstance(e, CustomRequestError):
            raise
        raise CustomRequestError("Failed to update property verification status", 500)


@admin.route("/properties/<string:property_id>/flag", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("admin")
@admin_write_limiter
def toggle_flag_property_admin(property_id):
    """
    Enhanced property flagging with validation and audit logging
    Rate limited: 50 updates per hour
    """
    try:
        # Get and validate admin user
        admin_id, admin_user, _ = get_logged_in_user()
        validate_admin_permissions(admin_user)

        # Validate property ID
        if not property_id or len(property_id.strip()) == 0:
            raise CustomRequestError("Invalid property ID", 400)

        # Check if the property exists
        property = get_item_by_id(g.session, Property, property_id)
        if not property:
            raise CustomRequestError(f"Property with ID {property_id} not found", 404)

        # Get flag reason from request (optional)
        data = request.get_json() or {}
        reason = data.get("reason", "")

        new_flag_status = not property.flagged
        update_data = {
            "flagged": new_flag_status,
            "flagged_at": datetime.utcnow() if new_flag_status else None,
            "flagged_by": admin_id if new_flag_status else None,
            "flag_reason": reason if new_flag_status else None,
        }

        updated_property = update_item(g.session, Property, property_id, update_data)

        # Log admin action
        log_admin_action(
            "PROPERTY_FLAG_TOGGLED",
            admin_id,
            property_id,
            {
                "flagged": new_flag_status,
                "reason": reason,
                "property_title": getattr(property, "title", "N/A"),
            },
        )

        action = "flagged" if new_flag_status else "unflagged"
        logger.info(f"Admin {admin_id} {action} property {property_id}")

        # Send notification to property owner if flagged
        try:
            if new_flag_status and hasattr(property, "landlord") and property.landlord:
                send_email(
                    "Property Flagged for Review",
                    [property.landlord.email],
                    "property_flagged_notification",
                    {
                        "property_title": getattr(property, "title", "Your Property"),
                        "reason": reason or "Administrative review required",
                        "flag_date": datetime.utcnow().strftime("%Y-%m-%d"),
                    },
                )
        except Exception as e:
            logger.error(f"Failed to send flag notification: {str(e)}")

        return response(
            f"Property with ID {property_id} has been {action} successfully",
            serialize(updated_property),
        )

    except Exception as e:
        logger.error(
            f"Failed to flag property {property_id} by admin {admin_id}: {str(e)}"
        )
        if isinstance(e, CustomRequestError):
            raise
        raise CustomRequestError("Failed to update property flag status", 500)


# ======================================================
# USERS ROUTES
# ======================================================
@admin.route("/users/accounts", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
def get_all_user_accounts_admin():
    users = get_all_items(g.session, User)
    user_dicts = serialize(users)

    return response("User accounts retrieved successfully", {"users": user_dicts})


@admin.route("/users/accounts/<string:user_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
def get_user_account_admin(user_id):
    logging.info("Before the fetching of the user!")
    # Check if the user exists
    user = get_item_by_id(g.session, User, user_id)
    logging.info(f"User Fetched {user}")
    if not user:
        raise CustomRequestError(f"User with ID {user_id} not found", 404)

    return response("User retrieved successfully", {"user": user})


@admin.route("/users/accounts/<string:user_id>/flag", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("admin")
def toggle_flag_user_account_admin(user_id):
    user = get_item_by_id(g.session, User, user_id)
    if not user:
        raise CustomRequestError(f"User with ID {user_id} not found", 404)

    updated_user = update_item(g.session, User, user_id, {"flagged": not user.flagged})

    return response("User updated successfully", {"user": updated_user})


@admin.route("/users/accounts/<string:user_id>/suspend", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("admin")
def suspend_user_account_admin(user_id):
    user = get_item_by_id(g.session, User, user_id)
    if not user:
        raise CustomRequestError(f"User with ID {user_id} not found", 404)

    update = {"is_active": False, "is_suspended": True}

    update_item(g.session, User, user_id, update)

    return response("User suspended successfully")


@admin.route("/users/accounts/<string:user_id>/activate", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("admin")
def activate_user_account_admin(user_id):
    user = get_item_by_id(g.session, User, user_id)
    if not user:
        raise CustomRequestError(f"User with ID {user_id} not found", 404)

    update = {"is_active": True, "is_suspended": False}

    update_item(g.session, User, user_id, update)

    return response("User activated successfully")


@admin.route("/users/accounts/<string:user_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("admin")
def delete_user_account_admin(user_id):
    user = get_item_by_id(g.session, User, user_id)
    if not user:
        raise CustomRequestError(f"User with ID {user_id} not found", 404)

    delete_item(g.session, User, user_id)

    return response("User deleted successfully")


@admin.route("/users/accounts/<string:user_id>/applications", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
def user_applications_account_admin(user_id):
    user = get_item_by_id(g.session, User, user_id)
    if not user:
        raise CustomRequestError(f"User with ID {user_id} not found", 404)

    applications = get_items_by_filter(g.session, Application, {"tenant_id": user_id})

    return response(
        "Applications retreived successfully!", {"applications", applications}
    )


# ############################################
# Transaction Routes
# ############################################
@admin.route(
    "/transactions",
    methods=["GET"],
)
@catch_exception
@jwt_required()
@role_required("admin")
def get_all_transactions_admin():
    session = g.session
    transactions = get_all_items(session, Transaction)

    transactions_converted = serialize(transactions)
    logging.debug(f"Transactions Retrieved: {transactions_converted}")
    return response("Transactions retrieved successfully", transactions_converted)


@admin.route("/transactions/<string:transaction_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
def get_transaction_admin(transaction_id):
    session = g.session
    transaction = get_item_by_id(session, Transaction, transaction_id)
    if not transaction:
        raise CustomRequestError(f"Transaction with ID {transaction_id} not found", 404)

    transaction_converted = serialize(transaction)

    logging.debug(f"Transactions Retrieved: {transaction_converted}")
    return response("Transactions retrieved successfully", transaction_converted)


@admin.route("/transactions/<string:transaction_id>/delete", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("admin")
def delete_transaction_admin(transaction_id):
    session = g.session
    transaction = delete_item(session, Transaction, transaction_id)
    if not transaction:
        raise CustomRequestError(f"Transaction with ID {transaction_id} not found", 404)

    logging.debug(f"Transaction Deleted: {transaction_id}")
    return response("Transaction deleted successfully")


# ############################################
# Applications Routes
# ############################################
@admin.route("/applications", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
def get_all_applications_admin():
    session = g.session
    applications = get_all_items(session, Application)

    applications_converted = serialize(applications)

    return response(
        "Applications retrieved successfully", {"applications": applications_converted}
    )


@admin.route("/applications/<string:application_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("admin")
def get_application_admin(application_id):
    session = g.session

    application = get_item_by_id(session, Application, application_id)

    if not application:
        raise CustomRequestError(f"Application with ID {application_id} not found", 404)

    application_converted = serialize(application)

    logging.debug(f"Applications Retrieved: {application_converted}")
    return response(
        "Applications retrieved successfully", {"application": application_converted}
    )


@admin.route("/applications/<string:application_id>/delete", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("admin")
def delete_application_admin(application_id):
    session = g.session
    application = delete_item(session, Application, application_id)
    if not application:
        raise CustomRequestError(f"Application with ID {application_id} not found", 404)

    logging.debug(f"Application Deleted: {application_id}")
    return response("Application deleted successfully")
