from flask import Blueprint, request, g
from flask_jwt_extended import jwt_required
from ..utils.helpers import response, get_logged_in_user, serialize
from ..utils.errors import CustomRequestError, catch_exception
from ..models.db_utils import (
    create_item,
    get_item_by_filter,
    get_items_by_filter,
    get_item_by_id,
    delete_item,
    update_item,
)
from sqlalchemy.orm import joinedload
from ..utils.decorators import role_required
from ..models import (
    Application,
    Screening,
    SearchHistory,
    Transaction,
    Property,
    Lease,
    Payment,
    LikedProperty,
    Recommendation,
    User,
    RecentActivity,
    TenantInfo,
)
import logging
from datetime import datetime, timedelta
from ..utils.activity_logger import ActivityLogger
from ..utils.mailer import send_email
from ..utils.variables import SITE_URL

# Configure logging

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Create Blueprint for tenant-related routes
tenant = Blueprint("tenant", __name__)

###############################################################################
# SCREENINGS ENDPOINTS
# Handles all operations related to property screenings (background checks, etc.)
###############################################################################


@tenant.route("/leases/<string:lease_id>/sign", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("tenant")
def sign_lease(lease_id):
    """Sign a lease as tenant"""
    user_id, _, _ = get_logged_in_user()
    data = request.json

    # Verify lease exists and belongs to tenant
    lease = get_item_by_filter(g.session, Lease, {"id": lease_id, "tenant_id": user_id})
    if not lease:
        raise CustomRequestError("Lease not found", 404)

    # Update lease with signature
    updated_lease = update_item(
        g.session,
        Lease,
        lease_id,
        {"tenant_signed_at": datetime.utcnow(), "tenant_signature": data["signature"]},
    )

    # Log activity
    ActivityLogger.log_tenant_activity(
        g.session,
        user_id,
        "lease_signed",
        f"Signed lease agreement for property ID: {updated_lease.property_id}",
        "lease",
        lease_id,
    )

    # Check if both parties signed
    if updated_lease.landlord_signed_at:
        update_item(
            g.session,
            Lease,
            lease_id,
            {"status": "active", "start_date": datetime.utcnow()},
        )

        # Mark property as unavailable
        update_item(
            g.session, Property, updated_lease.property_id, {"is_available": False}
        )

        # Log lease activation
        ActivityLogger.log_tenant_activity(
            g.session,
            user_id,
            "lease_activated",
            f"Lease became active for property ID: {updated_lease.property_id}",
            "lease",
            lease_id,
        )

    return response("Lease signed successfully")


@tenant.route("/screenings", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_screenings_tenant():
    """Get all screening records for the current tenant"""
    user_id, _, _ = get_logged_in_user()

    # Get screenings with related application and property data
    screenings = (
        g.session.query(Screening)
        .options(
            joinedload(Screening.application).joinedload(Application.property),
            joinedload(Screening.application).joinedload(Application.landlord),
        )
        .filter(Screening.tenant_id == user_id)
        .order_by(Screening.created_at.desc())
        .all()
    )

    # Serialize with related data
    screenings_data = []
    for screening in screenings:
        screening_data = serialize(screening)
        if screening.application:
            screening_data["application"] = serialize(screening.application)
            if screening.application.property:
                screening_data["property"] = serialize(screening.application.property)
            if screening.application.landlord:
                screening_data["landlord"] = {
                    "id": screening.application.landlord.id,
                    "firstName": screening.application.landlord.firstName,
                    "lastName": screening.application.landlord.lastName,
                    "email": screening.application.landlord.email,
                    "phone_number": screening.application.landlord.phone_number,
                }
        screenings_data.append(screening_data)

    return response(
        "Screenings retrieved successfully", {"screenings": screenings_data}
    )


@tenant.route("/screenings/<string:screening_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_screening_tenant(screening_id):
    """Get details of a specific screening for the current tenant"""
    user_id, _, _ = get_logged_in_user()

    # Get screening with related data
    screening = (
        g.session.query(Screening)
        .options(
            joinedload(Screening.application).joinedload(Application.property),
            joinedload(Screening.application).joinedload(Application.landlord),
        )
        .filter(Screening.id == screening_id, Screening.tenant_id == user_id)
        .first()
    )

    if not screening:
        raise CustomRequestError("Screening not found", 404)

    # Serialize with all related data
    screening_data = serialize(screening)
    if screening.application:
        screening_data["application"] = serialize(screening.application)
        if screening.application.property:
            screening_data["property"] = serialize(screening.application.property)
        if screening.application.landlord:
            screening_data["landlord"] = {
                "id": screening.application.landlord.id,
                "firstName": screening.application.landlord.firstName,
                "lastName": screening.application.landlord.lastName,
                "email": screening.application.landlord.email,
                "phone_number": screening.application.landlord.phone_number,
            }

    return response(
        "Screening details retrieved successfully", {"screening": screening_data}
    )


@tenant.route("/leases", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_pending_tenant_leases():
    """Get all lease agreements for current tenant"""
    user_id, _, _ = get_logged_in_user()

    leases = get_items_by_filter(
        g.session,
        Lease,
        {"tenant_id": user_id},
        complex_filters=[
            Lease.tenant_signature.is_(None) | Lease.landlord_signature.is_(None)
        ],
        order_by=Lease.created_at.desc(),
    )

    return response("Lease agreements retrieved", {"leases": serialize(leases)})


@tenant.route("/all-leases", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_all_tenant_leases():
    """Get all lease agreements for current tenant (pending and active)"""
    user_id, _, _ = get_logged_in_user()

    leases = get_items_by_filter(
        g.session,
        Lease,
        {"tenant_id": user_id},
        order_by=Lease.created_at.desc(),
    )

    return response("All lease agreements retrieved", {"leases": serialize(leases)})


@tenant.patch("/screenings/<string:screening_id>/submit")
@catch_exception
@jwt_required()
def submit_screening(screening_id):
    """
    Allows tenant to submit their screening data
    - Updates screening with tenant's bio data
    - Sets screening_date to current time
    - Updates status to 'completed' for landlord review
    - Notifies landlord that screening is ready for review
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify screening exists and belongs to the current user (tenant)
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "tenant_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found or not authorized", 404)

    # Check if screening is in the right status
    if screening.status not in ["invited", "in-progress"]:
        raise CustomRequestError("Screening cannot be modified in current status", 400)

    try:
        # Update screening with submitted data
        screening_update = {
            "bio_data": data.get("bio_data", {}),
            "screening_date": datetime.datetime.utcnow(),  # Set screening completion date
            "status": "completed",  # Ready for landlord review
        }

        updated_screening = update_item(
            g.session, Screening, screening_id, screening_update
        )

        # Update application status to indicate screening is completed
        update_item(
            g.session,
            Application,
            screening.application_id,
            {"status": "screening-completed"},
        )

        # Log activity
        ActivityLogger.log_tenant_activity(
            g.session,
            user_id,
            "screening_completed",
            f"Completed screening for application ID: {screening.application_id}",
            "screening",
            screening_id,
        )

        # Optionally notify landlord (you can add email notification here)
        logging.info(f"Screening {screening_id} completed by tenant {user_id}")

        return response(
            "Screening submitted successfully. The landlord will review and get back to you.",
            {"screening": serialize(updated_screening)},
        )

    except Exception as e:
        logging.error(f"Error submitting screening: {e}")
        raise CustomRequestError("Failed to submit screening", 500)


@tenant.patch("/screenings/<string:screening_id>/update")
@catch_exception
@jwt_required()
@role_required("tenant")
def update_screening_tenant(screening_id):
    """
    Allows tenant to update their screening data before final submission
    - Can only update if status is 'invited' or 'in-progress'
    - Updates bio_data and other screening information
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify screening exists and belongs to the current user (tenant)
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "tenant_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found or not authorized", 404)

    # Check if screening can be updated
    if screening.status not in ["invited", "in-progress"]:
        raise CustomRequestError("Screening cannot be modified in current status", 400)

    try:
        # Update screening data (but don't mark as completed)
        screening_update = {
            "bio_data": data.get("bio_data", screening.bio_data or {}),
            "status": "in-progress",  # Mark as in-progress when tenant starts
        }

        updated_screening = update_item(
            g.session, Screening, screening_id, screening_update
        )

        # Log activity
        ActivityLogger.log_tenant_activity(
            g.session,
            user_id,
            "screening_updated",
            f"Updated screening information for application ID: {screening.application_id}",
            "screening",
            screening_id,
        )

        return response(
            "Screening information updated successfully.",
            {"screening": serialize(updated_screening)},
        )

    except Exception as e:
        logging.error(f"Error updating screening: {e}")
        raise CustomRequestError("Failed to update screening", 500)


@tenant.post("/screenings/<string:screening_id>/accept")
@catch_exception
@jwt_required()
@role_required("tenant")
def accept_screening_invitation(screening_id):
    """
    Tenant accepts screening invitation
    - Updates screening status to accepted
    - Notifies landlord
    """
    user_id, _, _ = get_logged_in_user()

    # Verify screening exists and belongs to tenant
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "tenant_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found or not authorized", 404)

    # Can only accept if status is "invited"
    if screening.status != "invited":
        raise CustomRequestError("This screening invitation cannot be accepted", 400)

    # Update screening status
    updated_screening = update_item(
        g.session,
        Screening,
        screening_id,
        {"status": "accepted"},
    )

    # Log activity
    ActivityLogger.log_tenant_activity(
        g.session,
        user_id,
        "screening_accepted",
        f"Accepted screening invitation for property ID: {screening.property_id}",
        "screening",
        screening_id,
    )

    # Get landlord info to send notification
    landlord = get_item_by_filter(g.session, User, {"id": screening.landlord_id})
    template_vars = {
        "tenant": f"{screening.tenant.first_name} {screening.tenant.last_name}",
        "property": screening.property.name,
    }

    if landlord:
        send_email(
            subject="Screening Invitation Accepted",
            recipients=[landlord.email],
            template_name="screening_invitation_accepted",
            template_vars=template_vars,
            template_folder="tenant",
        )

    return response(
        "Screening invitation accepted",
        {"screening": serialize(updated_screening)},
    )


@tenant.post("/screenings/<string:screening_id>/decline")
@catch_exception
@jwt_required()
@role_required("tenant")
def decline_screening_invitation(screening_id):
    """
    Tenant declines screening invitation
    - Updates screening status to declined
    - Notifies landlord via professional HTML template
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify screening exists and belongs to tenant
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "tenant_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found or not authorized", 404)

    # Can only decline if status is "invited"
    if screening.status != "invited":
        raise CustomRequestError("This screening invitation cannot be declined", 400)

    reason = data.get("reason", "Not specified")

    # Update screening status
    updated_screening = update_item(
        g.session,
        Screening,
        screening_id,
        {"status": "declined", "decline_reason": reason},
    )

    # Log activity
    ActivityLogger.log_tenant_activity(
        g.session,
        user_id,
        "screening_declined",
        f"Declined screening invitation for property ID: {screening.property_id}",
        "screening",
        screening_id,
    )

    # Update application status back to received (so landlord can re-action it if needed)
    update_item(
        g.session, Application, screening.application_id, {"status": "received"}
    )

    # Get landlord info to send notification
    landlord = get_item_by_filter(g.session, User, {"id": screening.landlord_id})

    if landlord:
        template_vars = {
            "landlord_name": landlord.first_name,
            "tenant_name": f"{screening.tenant.first_name} {screening.tenant.last_name}",
            "property_name": screening.property.name,
            "reason": reason,
            "dashboard_url": f"{SITE_URL}/property-owner/applications",
        }

        send_email(
            subject="Screening Invitation Declined",
            recipients=[landlord.email],
            template_name="screening_invitation_declined",
            template_vars=template_vars,
            template_folder="tenant",
        )

    return response(
        "Screening invitation declined",
        {"screening": serialize(updated_screening)},
    )


###############################################################################
# PAYMENT ENDPOINTS
# Handles payment operations related to screenings and applications
###############################################################################
@tenant.route("/screenings/payment", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("tenant")
def screening_payment_tenant():
    """Process payment for a screening"""
    user_id, _, _ = get_logged_in_user()
    data = request.json
    screening_id = data.get("screening_id")

    # Verify screening exists and belongs to tenant
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "tenant_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found", 404)

    # Create payment
    new_payment = create_item(
        g.session,
        Payment,
        {
            "screening_id": screening_id,
            "amount": data["amount"],
            "payment_status": "pending",
        },
    )

    # Create transaction
    new_transaction = create_item(
        g.session,
        Transaction,
        {
            "tenant_id": user_id,
            "property_id": screening.property_id,
            "payment_id": new_payment.id,
            "amount": data["amount"],
            "payment_status": "unpaid",
            "payment_purpose": "screening",
        },
    )

    # Update screening status
    update_item(g.session, Screening, screening_id, {"status": "payment-pending"})

    return response("Payment initiated", {"payment_id": new_payment.id})


###############################################################################
# APPLICATION ENDPOINTS
# Handles property application operations (create, view, delete applications)
###############################################################################
@tenant.route("/applications", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_all_applications_tenant():
    """
    Get all applications for the current tenant with status counts
    Returns both individual applications and aggregated status counts
    """
    user_id, _, _ = get_logged_in_user()

    # Get applications with joined property data
    applications = (
        g.session.query(Application)
        .join(Property)
        .filter(Application.tenant_id == user_id)
        .all()
    )

    applications_data = [
        {
            "application_id": app.id,
            "property": serialize(app.property),
            "status": app.status,
            "screening_status": "screened" if app.viewed_at else "unscreened",
            "date_applied": app.created_at.isoformat(),
            "date_screened": app.viewed_at.isoformat() if app.viewed_at else None,
            "result": (
                "approved"
                if app.status == "accepted"
                else ("rejected" if app.status == "rejected" else "pending")
            ),
            "category": (
                serialize(app.property.category) if app.property.category else None
            ),
        }
        for app in applications
    ]

    status_counts = {
        "unscreened": sum(1 for app in applications if app.viewed_at is None),
        "screened": sum(1 for app in applications if app.viewed_at is not None),
        "pending": sum(1 for app in applications if app.status == "pending"),
        "under-review": sum(1 for app in applications if app.status == "under-review"),
        "accepted": sum(1 for app in applications if app.status == "accepted"),
        "rejected": sum(1 for app in applications if app.status == "rejected"),
    }

    return response(
        "Applications retrieved successfully",
        {"applications": applications_data, "status_counts": status_counts},
    )


@tenant.route("/applications/<string:application_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_application_tenant(application_id):
    """Get details of a specific application"""
    user_id, _, _ = get_logged_in_user()

    application = (
        g.session.query(Application)
        .join(Property)
        .filter(Application.id == application_id, Application.tenant_id == user_id)
        .first()
    )

    if not application:
        raise CustomRequestError("Application not found", 404)

    property = get_item_by_id(g.session, Property, application.property_id)
    if not property:
        raise CustomRequestError("Property not found", 404)

    response_data = {
        "application_id": application.id,
        "status": application.status,
        "screening_status": "screened" if application.viewed_at else "unscreened",
        "date_applied": application.created_at.isoformat(),
        "date_screened": (
            application.viewed_at.isoformat() if application.viewed_at else None
        ),
        "result": (
            "approved"
            if application.status == "accepted"
            else "rejected" if application.status == "rejected" else "pending"
        ),
    }
    response_data["property"] = serialize(property)
    response_data["category"] = (
        serialize(property.category) if property.category else None
    )
    return response(
        "Application retrieved successfully", {"application": response_data}
    )


@tenant.route("/applications/<string:application_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("tenant")
def delete_application_tenant(application_id):
    """Delete/Cancel a property application"""
    user_id, _, _ = get_logged_in_user()
    application = get_item_by_filter(
        g.session, Application, application_id, {"tenant_id": user_id}
    )
    delete_item(g.session, Application, application_id)
    return response("Application deleted successfully", {"application": application})


@tenant.route("/properties/<string:property_id>/applications", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("tenant")
def apply_for_property(property_id):
    """Apply for a property as a tenant"""
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Validate required fields
    required_fields = ["employment_status", "number_of_occupants", "move_in_date"]
    for field in required_fields:
        if not data.get(field):
            raise CustomRequestError(f"Missing required field: {field}", 400)

    # Check if property exists and is available
    property = get_item_by_filter(
        g.session, Property, {"id": property_id, "is_available": True}
    )
    if not property:
        raise CustomRequestError("Property not available", 404)

    # Check if user already applied
    existing_application = (
        g.session.query(Application)
        .filter(
            Application.property_id == property_id,
            (Application.applicant_id == user_id) | (Application.tenant_id == user_id),
        )
        .first()
    )
    if existing_application:
        raise CustomRequestError("You've already applied for this property", 400)

    application_data = {
        "property_id": property_id,
        "applicant_id": user_id,
        "tenant_id": user_id,
        "employment_status": data["employment_status"],
        "number_of_occupants": data["number_of_occupants"],
        "move_in_date": data["move_in_date"],
        "message": data.get("message", ""),
        "status": "received",
    }

    # Create new application
    new_application = create_item(g.session, Application, application_data)

    # Log activity
    ActivityLogger.log_tenant_activity(
        g.session,
        user_id,
        "property_application_submitted",
        f"Applied for property: {property.name}",
        "application",
        new_application.id,
    )

    return response(
        "Application submitted successfully", {"application_id": new_application.id}
    )


###############################################################################
# SEARCH HISTORY ENDPOINTS
# Manages property search history for personalized recommendations
###############################################################################
@tenant.route("/search-history", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("tenant")
def create_history_tenant():
    """Save a new search query to user's history"""
    user_id, _, _ = get_logged_in_user()
    data = request.json

    search_query = data.get("search_query")
    if not search_query:
        raise CustomRequestError("Search query cannot be empty", 400)

    new_search = create_item(
        g.session,
        SearchHistory,
        user_id,
        {"user_id": user_id, "search_query": search_query},
    )
    return response("Search query saved.", {"search": new_search})


@tenant.route("/search-history", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_history():
    """Get all saved search queries for the current user"""
    user_id, _, _ = get_logged_in_user()
    history = get_items_by_filter(g.session, SearchHistory, {"user_id": user_id})
    return response("Search query retreived.", {"search_histories": history})


@tenant.route("/search-history", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("tenant")
def clear_history_tenant():
    """Clear all search history for the current user"""
    user_id, _, _ = get_logged_in_user()
    history = get_items_by_filter(g.session, SearchHistory, {"user_id": user_id})
    for his in history:
        del his
    return response("Search query cleared")


###############################################################################
# TRANSACTION ENDPOINTS
# Handles payment transactions related to applications and rent
###############################################################################
@tenant.route("/transactions", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_all_transaction_tenant():
    """Get all payment transactions for the current tenant"""
    user_id, _, _ = get_logged_in_user()
    transactions = get_items_by_filter(g.session, Transaction, {"tenant_id": user_id})

    # Format transaction data for response
    transactions_data = [
        {
            "id": app.id,
            "tenant_id": app.tenant_id,
            "property_id": app.property_id,
            "payment_id": app.payment_id,
            "amount": app.amount,
            "payment_status": app.payment_status,
            "payment_purpose": app.payment_purpose,
            "transaction_date": app.transaction_date,
        }
        for app in transactions
    ]

    return response(
        "Applications retrieved successfully",
        {"applications": transactions_data},
    )


@tenant.get("/transactions/<string:transaction_id>")
@catch_exception
@jwt_required()
@role_required("tenant")
def get_transaction_tenant(transaction_id):
    """Get details of a specific transaction"""
    user_id, _, _ = get_logged_in_user()
    transaction = get_item_by_filter(g.session, Transaction, {"id": transaction_id})
    return response("Transaction retrieved successfully", {"transaction": transaction})


###############################################################################
# Liked Properties ENDPOINTS
# Handles liking and unliking properties for tenants
###############################################################################
@tenant.route("/properties/liked", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_liked_properties():
    """Get all properties liked by current tenant"""
    user_id, _, _ = get_logged_in_user()

    liked_properties = (
        g.session.query(LikedProperty)
        .join(Property)
        .filter(LikedProperty.tenant_id == user_id)
        .order_by(LikedProperty.date_liked.desc())
        .all()
    )

    properties_data = [
        {"like_id": like.id, "property": like.property} for like in liked_properties
    ]

    return response("Liked properties retrieved", {"properties": properties_data})


@tenant.route("/properties/<string:property_id>/like", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("tenant")
def like_property(property_id):
    """Like a property"""
    user_id, _, _ = get_logged_in_user()

    # Check if already liked
    existing = get_item_by_filter(
        g.session, LikedProperty, {"tenant_id": user_id, "property_id": property_id}
    )
    if existing:
        raise CustomRequestError("Property already liked", 400)

    # Create new like
    new_like = create_item(
        g.session, LikedProperty, {"tenant_id": user_id, "property_id": property_id}
    )

    # Get property details for activity log
    property = get_item_by_id(g.session, Property, property_id)

    # Log activity
    ActivityLogger.log_tenant_activity(
        g.session,
        user_id,
        "property_liked",
        f"Liked property: {property.name if property else 'Property'}",
        "property",
        property_id,
    )

    return response("Property liked successfully", {"like_id": new_like.id}, 201)


@tenant.route("/properties/<string:like_id>/unlike", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("tenant")
def unlike_property(like_id):
    """Remove property from liked list"""
    user_id, _, _ = get_logged_in_user()

    # Verify like belongs to user
    like = get_item_by_filter(
        g.session, LikedProperty, {"id": like_id, "tenant_id": user_id}
    )

    if not like:
        raise CustomRequestError("Like not found", 404)

    delete_item(g.session, LikedProperty, like_id)

    return response("Property unliked successfully")


@tenant.route("/properties/<string:property_id>/like-status", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def check_like_status(property_id):
    """Check if current tenant has liked a property"""
    user_id, _, _ = get_logged_in_user()

    like = get_item_by_filter(
        g.session, LikedProperty, {"tenant_id": user_id, "property_id": property_id}
    )

    return response(
        "Like status checked",
        {"isLiked": bool(like), "likeId": like.id if like else None},
    )


###############################################################################
# Onboarding ENDPOINTS
# Handles all onboarding endpoints
###############################################################################
@tenant.route("/recommendations", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("tenant")
def create_recommendation():
    """
    Create a new property recommendation based on tenant preferences
    """
    user_id, user, _ = get_logged_in_user()
    data = request.get_json()

    # Validate required fields
    required_fields = ["min_budget", "max_budget"]
    for field in required_fields:
        if not data.get(field):
            raise CustomRequestError(f"{field} is required", 400)

    # Map the incoming data to the recommendation model
    recommendation_data = {
        "user_id": user_id,
        "min_budget": data.get("min_budget"),
        "max_budget": data.get("max_budget"),
        "preferred_bedrooms": data.get("bedrooms"),
        "preferred_bathrooms": data.get("bathrooms"),
        "preferred_parking_space": data.get("parking_space"),
        "preferred_furnished": data.get("furnished"),
        "preferred_pets": data.get("pets"),
        "preferred_kitchens": data.get("kitchens"),
        "preferred_floors_no": data.get("floors_no"),
        "preferred_size_sqft": data.get("size_sqft"),
        "preferred_year_built": data.get("year_built"),
        "preferred_min_lease": data.get("minimum_lease_duration"),
        "preferred_amenities": data.get("amenities"),
        "preferred_locations": data.get("locations"),
        "preferred_payment_frequency": data.get("paymentFrequency"),
        "preferred_move_in_date": data.get("moveInDate"),
        "property_category": data.get("property_category"),
    }

    # Create the recommendation
    new_recommendation = create_item(g.session, Recommendation, recommendation_data)

    # Update TenantInfo onboarding status
    tenant_info = get_item_by_filter(g.session, TenantInfo, {"user_id": user_id})
    if tenant_info:
        update_item(g.session, TenantInfo, tenant_info.id, {"is_onboarded": True})

    # Send Onboarding Completion Email
    try:
        template_vars = {
            "name": f"{user.firstName} {user.lastName}",
            "max_budget": data.get("max_budget"),
            "location": (
                data.get("locations")[0]
                if data.get("locations")
                else "your preferred areas"
            ),
            "dashboard_url": f"{SITE_URL}/tenants",
        }

        send_email(
            "Onboarding Completed - Your Matches are Ready!",
            [user.email],
            "onboarding_complete_email",
            template_vars,
        )
    except Exception as e:
        raise CustomRequestError(f"Failed to send onboarding email: {e}", 500)

    # Log activity
    ActivityLogger.log_tenant_activity(
        g.session,
        user_id,
        "onboarding_completed",
        "Completed onboarding and set property preferences",
        "recommendation",
        new_recommendation.recommendation_id,
    )

    return response(
        "Recommendation created successfully",
        {"recommendation": serialize(new_recommendation)},
    )


@tenant.route("/recommendations", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_recommendations():
    """
    Get all recommendations for the current user
    """
    user_id, _, _ = get_logged_in_user()

    recommendations = get_items_by_filter(
        g.session, Recommendation, {"user_id": user_id}
    )

    return response(
        "Recommendations retrieved successfully", {"recommendations": recommendations}
    )


@tenant.route("/recommendations/<recommendation_id>", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("tenant")
def update_recommendation(recommendation_id):
    """
    Update a recommendation
    """
    user_id, _, _ = get_logged_in_user()
    data = request.json

    updated_recommendation = update_item(
        g.session,
        Recommendation,
        recommendation_id,
        data,
        user_id=user_id,  # Ensure the recommendation belongs to the user
    )

    return response(
        "Recommendation updated successfully",
        {"recommendation": updated_recommendation},
    )


@tenant.route("/recommendations/<recommendation_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("tenant")
def delete_recommendation(recommendation_id):
    """
    Delete a recommendation
    """
    user_id, _, _ = get_logged_in_user()

    delete_item(
        g.session,
        Recommendation,
        recommendation_id,
        user_id=user_id,  # Ensure the recommendation belongs to the user
    )

    return response("Recommendation deleted successfully", {})


@tenant.route("/recommendations/properties", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_recommended_properties():
    """
    Get property recommendations based on user's preferences using advanced algorithm
    """
    from sqlalchemy import and_, or_, func, case
    from ..models import Category

    user_id, _, _ = get_logged_in_user()

    # Get user's latest recommendation preferences
    user_recommendation = (
        g.session.query(Recommendation)
        .filter(Recommendation.user_id == user_id)
        .order_by(Recommendation.created_at.desc())
        .first()
    )

    if not user_recommendation:
        raise CustomRequestError(
            "No preferences found. Please complete onboarding first.", 404
        )

    # Get pagination parameters
    page = int(request.args.get("page", 1))
    per_page = min(int(request.args.get("per_page", 20)), 50)
    offset = (page - 1) * per_page

    # Base query for available properties
    base_query = g.session.query(Property).filter(
        Property.is_available == True,
        Property.deleted == False,
        Property.is_verified == True,
        Property.flagged == False,
    )

    # Build scoring algorithm with weighted factors
    score_conditions = []

    # 1. Budget Match (40% weight) - Most Important
    budget_score = (
        case(
            (Property.rent_amount >= user_recommendation.min_budget, 100),
            (Property.rent_amount <= user_recommendation.max_budget, 100),
            (Property.rent_amount > user_recommendation.max_budget, 70),
            (Property.rent_amount <= user_recommendation.max_budget * 1.2, 70),
            (Property.rent_amount < user_recommendation.min_budget, 60),
            (Property.rent_amount >= user_recommendation.min_budget * 0.8, 60),
            else_=0,
        )
        * 0.4
    )
    score_conditions.append(budget_score)

    # 2. Location Match (25% weight)
    if user_recommendation.preferred_locations:
        location_conditions = []
        for location in user_recommendation.preferred_locations:
            location_conditions.extend(
                [
                    func.lower(Property.city).contains(func.lower(location)),
                    func.lower(Property.area).contains(func.lower(location)),
                    func.lower(Property.state).contains(func.lower(location)),
                    func.lower(Property.address).contains(func.lower(location)),
                ]
            )

        location_score = case((or_(*location_conditions), 100), else_=0) * 0.25
        score_conditions.append(location_score)

    # 3. Bedrooms Match (15% weight)
    if user_recommendation.preferred_bedrooms:
        bedroom_score = (
            case(
                (Property.bedrooms == user_recommendation.preferred_bedrooms, 100),
                (
                    func.abs(Property.bedrooms - user_recommendation.preferred_bedrooms)
                    == 1,
                    70,
                ),
                (
                    func.abs(Property.bedrooms - user_recommendation.preferred_bedrooms)
                    == 2,
                    40,
                ),
                else_=0,
            )
            * 0.15
        )
        score_conditions.append(bedroom_score)

    # 4. Bathrooms Match (10% weight)
    if user_recommendation.preferred_bathrooms:
        bathroom_score = (
            case(
                (
                    Property.bathrooms == user_recommendation.preferred_bathrooms,
                    100,
                ),
                (
                    func.abs(
                        Property.bathrooms - user_recommendation.preferred_bathrooms
                    )
                    <= 1,
                    70,
                ),
                else_=0,
            )
            * 0.1
        )

        score_conditions.append(bathroom_score)

    # 5. Furnished Preference (5% weight)
    if user_recommendation.preferred_furnished:
        furnished_score = (
            case(
                (
                    Property.furnished == user_recommendation.preferred_furnished,
                    100,
                ),
                else_=0,
            )
            * 0.05
        )
        score_conditions.append(furnished_score)

    # 6. Amenities Match (5% weight)
    if user_recommendation.preferred_amenities:
        # This is a simplified amenities check - can be enhanced with JSON operations
        amenities_score = (
            case(
                (
                    Property.amenities.isnot(None),
                    50,
                ),  # Basic score if property has amenities
                else_=0,
            )
            * 0.05
        )
        score_conditions.append(amenities_score)

    # Calculate total score
    total_score = sum(score_conditions) if score_conditions else func.random() * 100

    # Apply filters and sorting
    query = base_query.filter(
        # Budget filter (allow some flexibility)
        or_(
            and_(
                Property.rent_amount >= user_recommendation.min_budget * 0.8,
                Property.rent_amount <= user_recommendation.max_budget * 1.2,
            ),
            Property.is_featured == True,  # Always include featured properties
        )
    )

    # Add location filter if specified
    if user_recommendation.preferred_locations:
        location_filters = []
        for location in user_recommendation.preferred_locations:
            location_filters.extend(
                [
                    func.lower(Property.city).contains(func.lower(location)),
                    func.lower(Property.area).contains(func.lower(location)),
                    func.lower(Property.state).contains(func.lower(location)),
                ]
            )

        query = query.filter(or_(*location_filters))

    # Get total count for pagination
    total_count = query.count()

    # Apply scoring, ordering, and pagination
    properties = (
        query.add_column(total_score.label("recommendation_score"))
        .order_by(
            # Primary sort by score (descending)
            total_score.desc(),
            # Secondary sort by featured status
            Property.is_featured.desc(),
            # Tertiary sort by creation date (newest first)
            Property.created_at.desc(),
        )
        .offset(offset)
        .limit(per_page)
        .all()
    )

    # Format response with score
    recommended_properties = []
    for property_data, score in properties:
        property_dict = serialize(property_data)
        property_dict["recommendation_score"] = round(float(score), 2)
        property_dict["match_reason"] = _generate_match_reason(
            property_data, user_recommendation, score
        )
        recommended_properties.append(property_dict)

    # Log recommendation activity
    if recommended_properties:
        ActivityLogger.log_tenant_activity(
            g.session,
            user_id,
            "recommendations_viewed",
            f"Viewed {len(recommended_properties)} recommended properties",
            "recommendation",
            user_recommendation.recommendation_id,
        )

    return response(
        "Property recommendations retrieved successfully",
        {
            "properties": recommended_properties,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total_count,
                "pages": (total_count + per_page - 1) // per_page,
            },
            "preferences_used": {
                "budget_range": f"₦{user_recommendation.min_budget:,.0f} - ₦{user_recommendation.max_budget:,.0f}",
                "locations": user_recommendation.preferred_locations,
                "bedrooms": user_recommendation.preferred_bedrooms,
                "bathrooms": user_recommendation.preferred_bathrooms,
                "furnished": user_recommendation.preferred_furnished,
            },
        },
    )


def _generate_match_reason(property_obj, recommendation, score):
    """Generate human-readable match reason"""
    reasons = []

    # Budget match
    if (
        property_obj.rent_amount >= recommendation.min_budget
        and property_obj.rent_amount <= recommendation.max_budget
    ):
        reasons.append("Perfect budget match")
    elif property_obj.rent_amount <= recommendation.max_budget * 1.2:
        reasons.append("Within budget range")

    # Location match
    if recommendation.preferred_locations:
        for location in recommendation.preferred_locations:
            if (
                location.lower() in property_obj.city.lower()
                or location.lower() in property_obj.area.lower()
            ):
                reasons.append(f"Located in preferred area ({location})")
                break

    # Bedrooms match
    if (
        recommendation.preferred_bedrooms
        and property_obj.bedrooms == recommendation.preferred_bedrooms
    ):
        reasons.append(f"Exact bedroom match ({property_obj.bedrooms} bedrooms)")

    # Featured property
    if property_obj.is_featured:
        reasons.append("Featured property")

    return reasons[:3]  # Return top 3 reasons


###############################################################################
# NOTIFICATION ENDPOINTS
# Handles screening invitations and other notifications
###############################################################################


@tenant.route("/notifications/screenings", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_screening_notifications():
    """
    Get all screening invitations and notifications for the tenant
    """
    user_id, _, _ = get_logged_in_user()

    # Get all screenings with status 'invited' - these are pending invitations
    pending_screenings = (
        g.session.query(Screening)
        .options(
            joinedload(Screening.application).joinedload(Application.property),
            joinedload(Screening.application).joinedload(Application.landlord),
        )
        .filter(
            Screening.tenant_id == user_id,
            Screening.status.in_(["invited", "in-progress"]),
        )
        .order_by(Screening.invitation_date.desc())
        .all()
    )

    notifications = []
    for screening in pending_screenings:
        notification = {
            "id": screening.id,
            "type": "screening_invitation",
            "title": "Screening Invitation",
            "message": f"You've been invited for screening for {screening.application.property.name}",
            "status": screening.status,
            "created_at": (
                screening.invitation_date.isoformat()
                if screening.invitation_date
                else None
            ),
            "screening": serialize(screening),
            "property": (
                serialize(screening.application.property)
                if screening.application.property
                else None
            ),
            "landlord": (
                {
                    "firstName": screening.application.landlord.firstName,
                    "lastName": screening.application.landlord.lastName,
                    "email": screening.application.landlord.email,
                }
                if screening.application.landlord
                else None
            ),
        }
        notifications.append(notification)

    return response(
        "Screening notifications retrieved successfully",
        {"notifications": notifications, "total_count": len(notifications)},
    )


###############################################################################
# RECENT ACTIVITIES ENDPOINTS
# Handles fetching recent activities for dashboard
###############################################################################


@tenant.route("/activities/recent", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("tenant")
def get_recent_activities():
    """
    Get recent activities for the current tenant
    Query params:
    - limit: number of activities to return (default: 10, max: 50)
    - days: number of days to look back (default: 30)
    """
    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    limit = min(int(request.args.get("limit", 10)), 50)
    days = int(request.args.get("days", 30))

    # Calculate date range
    cutoff_date = datetime.now() - timedelta(days=days)

    # Get recent activities
    activities = (
        g.session.query(RecentActivity)
        .filter(
            RecentActivity.user_id == user_id,
            RecentActivity.user_role == "tenant",
            RecentActivity.created_at >= cutoff_date,
        )
        .order_by(RecentActivity.created_at.desc())
        .limit(limit)
        .all()
    )

    # Serialize activities
    activities_data = [
        {
            "id": activity.id,
            "activity_type": activity.activity_type,
            "description": activity.activity_description,
            "related_entity_type": activity.related_entity_type,
            "related_entity_id": activity.related_entity_id,
            "created_at": (
                activity.created_at.isoformat() if activity.created_at else None
            ),
            "time_ago": (
                get_time_ago(activity.created_at) if activity.created_at else "Unknown"
            ),
        }
        for activity in activities
    ]

    return response(
        "Recent activities retrieved successfully",
        {
            "activities": activities_data,
            "total_count": len(activities_data),
            "date_range": {
                "from": cutoff_date.isoformat(),
                "to": datetime.now().isoformat(),
                "days": days,
            },
        },
    )


def get_time_ago(created_at):
    """
    Helper function to get human-readable time difference
    """
    now = datetime.now()
    diff = now - created_at

    if diff.days > 0:
        return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    else:
        return "Just now"
