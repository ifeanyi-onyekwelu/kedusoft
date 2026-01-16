from flask import Blueprint, request, g
from flask_jwt_extended import jwt_required
from ..utils.decorators import role_required
from ..utils.helpers import response, serialize, get_logged_in_user, generate_pdf
from ..utils.errors import CustomRequestError, catch_exception
from ..utils.mailer import send_email
from ..utils.activity_logger import ActivityLogger
from ..utils.variables import SITE_URL
from ..models.db_utils import (
    create_item,
    get_item_by_filter,
    get_items_by_filter,
    get_item_with_relationships,
    delete_item,
    update_item,
)
from ..models import (
    Property,
    Transaction,
    Application,
    Category,
    Screening,
    Lease,
    User,
    LikedProperty,
    PropertyDraft,
    PropertyView,
    RecentActivity,
)
from ..models.transaction import PaymentPurpose
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload
from sqlalchemy import func, or_, desc


logging.basicConfig(level=logging.DEBUG)

# ======================================================
# LANDLORD ROUTES BLUEPRINT
# Handles all landlord-specific operations including:
# - Property management
# - Application processing
# - Tenant screening
# - Lease management
# - Tenant management
# - Financial transactions
# ======================================================

landlord = Blueprint("landlord_bp", __name__)

# ======================================================
# PROPERTY MANAGEMENT ROUTES
# ======================================================


@landlord.post("/properties")
@catch_exception
@jwt_required()
@role_required("landlord")
def create_property_landlord():
    """
    Creates a new property listing for the authenticated landlord
    - Validates landlord role via JWT
    - Extracts property data from request
    - Filters allowed fields to prevent unauthorized updates
    - Associates property with landlord's user ID
    - Handles property category lookup
    - Stores gallery images as provided
    """
    data = request.get_json()
    user_id, _, _ = get_logged_in_user()

    # Fields to exclude from direct user input
    excluded = {
        "id",
        "landlord_id",
        "category_id",
        "is_available",
        "is_verified",
        "verification_status",
        "flagged",
        "deleted",
        "date",
        "tenant_id",
        "current_lease_id",
        "is_featured",
        "featured_priority",
        "featured_until",
        "created_at",
        "updated_at",
    }

    # Dynamically get allowed fields from Property model
    allowed_fields = [
        col.name for col in Property.__table__.columns if col.name not in excluded
    ]

    # Prepare property data with only allowed fields
    property_data = {
        field: data.get(field) for field in allowed_fields if field in data
    }
    property_data["landlord_id"] = user_id
    property_data["gallery"] = data.get("gallery", [])

    # Handle category association
    if "category_id" in data and data["category_id"]:
        # Frontend sends category_id directly
        category = get_item_by_filter(g.session, Category, {"id": data["category_id"]})
        if not category:
            raise CustomRequestError("Category not found", 404)
        property_data["category_id"] = category.id
    elif "category" in data and data["category"]:
        # Fallback: if frontend sends category name
        category = get_item_by_filter(g.session, Category, {"name": data["category"]})
        if not category:
            raise CustomRequestError("Category not found", 404)
        property_data["category_id"] = category.id
    else:
        raise CustomRequestError("Category is required", 400)

    try:
        new_property = create_item(g.session, Property, property_data)

        # Log activity
        ActivityLogger.log_landlord_activity(
            g.session,
            user_id,
            "property_created",
            f"Created new property: {new_property.name}",
            "property",
            new_property.id,
        )

        return response(
            "Property created successfully",
            {"Property Created:": serialize(new_property)},
        )
    except Exception as e:
        logging.error(f"Error creating property: {e}")
        raise CustomRequestError("Failed to create property", 500)


@landlord.post("/properties/drafts")
@catch_exception
@jwt_required()
@role_required("landlord")
def save_property_draft():
    """
    Saves a property as draft with partial data
    - If draft_id is provided, updates existing draft
    - If no draft_id, creates a new draft
    - Supports multiple drafts per landlord
    """
    data = request.get_json()
    user_id, _, _ = get_logged_in_user()

    # Filter allowed fields
    allowed_fields = [
        col.name
        for col in PropertyDraft.__table__.columns
        if col.name not in {"id", "last_saved_at"}
    ]

    draft_data = {k: v for k, v in data.items() if k in allowed_fields}
    draft_data["landlord_id"] = user_id

    # Handle category if provided
    if "category" in data:
        category = get_item_by_filter(g.session, Category, {"name": data["category"]})
        if category:
            draft_data["category_id"] = category.id

    try:
        # Check if we're updating an existing draft
        draft_id = data.get("draft_id")

        if draft_id:
            # Update existing draft
            existing_draft = get_item_by_filter(
                g.session, PropertyDraft, {"id": draft_id, "landlord_id": user_id}
            )
            if existing_draft:
                update_item(g.session, PropertyDraft, existing_draft.id, draft_data)
                draft = existing_draft
            else:
                raise CustomRequestError("Draft not found or access denied", 404)
        else:
            # Create new draft
            draft = create_item(g.session, PropertyDraft, draft_data)

        return response("Draft saved successfully", {"draft": serialize(draft)})
    except CustomRequestError:
        raise
    except Exception as e:
        logging.error(f"Draft save error: {e}")
        raise CustomRequestError("Failed to save draft", 500)


@landlord.get("/properties/drafts")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_property_drafts():
    """Retrieves all drafts for the landlord"""
    user_id, _, _ = get_logged_in_user()
    drafts = get_items_by_filter(g.session, PropertyDraft, {"landlord_id": user_id})
    return response("Drafts retrieved", {"drafts": serialize(drafts)})


@landlord.post("/properties/drafts/<draft_id>/publish")
@catch_exception
@jwt_required()
@role_required("landlord")
def publish_draft(draft_id):
    """Converts a draft to a published property"""
    user_id, _, _ = get_logged_in_user()
    draft = get_item_by_filter(
        g.session, PropertyDraft, {"id": draft_id, "landlord_id": user_id}
    )

    if not draft:
        raise CustomRequestError("Draft not found", 404)

    # Map draft fields to property fields
    property_data = {
        col.name: getattr(draft, col.name)
        for col in Property.__table__.columns
        if hasattr(draft, col.name) and getattr(draft, col.name) is not None
    }
    property_data["landlord_id"] = user_id

    try:
        new_property = create_item(g.session, Property, property_data)
        delete_item(g.session, PropertyDraft, draft.id)  # Remove draft after publishing

        # Log activity
        ActivityLogger.log_landlord_activity(
            g.session,
            user_id,
            "property_published",
            f"Published property from draft: {new_property.name}",
            "property",
            new_property.id,
        )

        return response(
            "Property published successfully", {"property": serialize(new_property)}
        )
    except Exception as e:
        logging.error(f"Publish error: {e}")
        raise CustomRequestError("Failed to publish property", 500)


@landlord.delete("/properties/drafts/<draft_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def delete_property_draft(draft_id):
    """Deletes a specific draft owned by the landlord"""
    user_id, _, _ = get_logged_in_user()
    draft = get_item_by_filter(
        g.session, PropertyDraft, {"id": draft_id, "landlord_id": user_id}
    )

    if not draft:
        raise CustomRequestError("Draft not found", 404)

    try:
        delete_item(g.session, PropertyDraft, draft.id)
        return response("Draft deleted successfully")
    except Exception as e:
        logging.error(f"Draft deletion error: {e}")
        raise CustomRequestError("Failed to delete draft", 500)


@landlord.get("/properties/drafts/<draft_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_single_property_draft(draft_id):
    """Retrieves a specific draft by ID"""
    user_id, _, _ = get_logged_in_user()
    draft = get_item_by_filter(
        g.session, PropertyDraft, {"id": draft_id, "landlord_id": user_id}
    )

    if not draft:
        raise CustomRequestError("Draft not found", 404)

    return response("Draft retrieved", {"draft": serialize(draft)})


@landlord.get("/properties")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_all_properties_landlord():
    """
    Retrieves all properties listed by the authenticated landlord
    - Returns complete property listings
    - Filters by landlord_id from JWT
    """
    user_id, _, _ = get_logged_in_user()
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})

    logging.info(f"Landlord {user_id} retrieved {len(properties)} properties")
    return response("Properties retrieved successfully", serialize(properties))


@landlord.get("/properties/performance")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_properties_performance():
    """
    Retrieves property performance metrics for the authenticated landlord
    - Returns properties with views, applications, and occupancy statistics
    - Includes occupancy rate, monthly rent, and status
    """
    from sqlalchemy import func

    user_id, _, _ = get_logged_in_user()

    # Get landlord's properties with related statistics
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})

    performance_data = []

    for property_obj in properties:
        # Count views for this property
        views_count = (
            g.session.query(func.count(PropertyView.id))
            .filter(PropertyView.property_id == property_obj.id)
            .scalar()
            or 0
        )

        # Count applications for this property
        applications_count = (
            g.session.query(func.count(Application.id))
            .filter(Application.property_id == property_obj.id)
            .scalar()
            or 0
        )

        # Determine occupancy status and rate
        is_occupied = property_obj.tenant_id is not None
        occupancy_rate = 100 if is_occupied else 0
        status = "occupied" if is_occupied else "vacant"

        performance_data.append(
            {
                "id": property_obj.id,
                "name": property_obj.name,
                "views": views_count,
                "applications": applications_count,
                "occupancy_rate": occupancy_rate,
                "monthly_rent": property_obj.rent_amount,
                "status": status,
                "listing_type": property_obj.listing_type,
                "bedrooms": property_obj.bedrooms,
                "bathrooms": property_obj.bathrooms,
                "location": f"{property_obj.city}, {property_obj.state}",
            }
        )

    logging.info(
        f"Landlord {user_id} retrieved performance data for {len(performance_data)} properties"
    )
    return response(
        "Property performance data retrieved successfully",
        {"properties": performance_data, "total_properties": len(performance_data)},
    )


@landlord.put("/properties/<string:property_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def update_property_landlord(property_id):
    """
    Updates a specific property owned by the landlord
    - Verifies property ownership via landlord_id
    - Applies partial updates from request data
    """
    user_id, _, _ = get_logged_in_user()
    property_data = get_item_by_filter(
        g.session,
        Property,
        {"id": property_id, "landlord_id": user_id, "deleted": False},
    )

    if not property_data:
        raise CustomRequestError("Property not found", 404)

    update_data = request.get_json()
    updated_property = update_item(g.session, Property, property_id, update_data)

    # Log activity
    ActivityLogger.log_landlord_activity(
        g.session,
        user_id,
        "property_updated",
        f"Updated property: {updated_property.name}",
        "property",
        property_id,
    )

    return response(
        "Property updated successfully", {"property": serialize(updated_property)}
    )


@landlord.delete("/property/<string:property_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def delete_property_landlord(property_id):
    """
    Soft deletes a property (marks as deleted)
    - Verifies ownership before deletion
    - Uses soft delete pattern
    """
    user_id, _, _ = get_logged_in_user()
    property_data = get_item_by_filter(
        g.session, Property, {"id": property_id, "landlord_id": user_id}
    )

    if not property_data:
        raise CustomRequestError("Property not found", 404)

    delete_item(g.session, Property, property_id)
    return response("Property deleted successfully")


@landlord.get("/properties/<string:property_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_property_details(property_id):
    """
    Retrieves detailed information about a specific property including:
    - Full property details
    - Current lease information (if exists)
    - Tenant details (if property is rented)
    - Verification of landlord ownership

    Parameters:
        property_id (str): The unique identifier of the property

    Returns:
        dict: Property details with nested lease and tenant information

    Example Response:
        {
            "property": {
                "id": "prop_123",
                "name": "Sunset Apartments",
                ...,
                "current_lease": {
                    "id": "lease_456",
                    "start_date": "2023-01-01",
                    ...
                },
                "tenant": {
                    "id": "user_789",
                    "name": "John Doe",
                    ...
                }
            }
        }
    """
    user_id, _, _ = get_logged_in_user()

    # Get property with relationships eager-loaded
    property_data = get_item_with_relationships(
        g.session,
        Property,
        filters={"id": property_id, "landlord_id": user_id, "deleted": False},
        relationships=[Property.tenant, Property.category],
    )

    if not property_data:
        raise CustomRequestError("Property not found or access denied", 404)

    current_lease = (
        g.session.query(Lease)
        .filter(
            Lease.property_id == property_id,
            Lease.is_active == True,  # or your current lease condition
        )
        .order_by(Lease.start_date.desc())
        .first()
    )

    # Serialize property with nested relationships
    result = {
        "property": serialize(property_data),
        "current_lease": serialize(current_lease) if current_lease else None,
        "tenant": serialize(property_data.tenant) if property_data.tenant else None,
        "category": serialize(property_data.category),
    }

    return response("Property details retrieved successfully", result)


@landlord.route("/properties/liked", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_properties_liked_by_tenants():
    """
    Get properties that have been liked by tenants with statistics

    Query Parameters:
    - date_range: 'today', 'week', 'month', 'year', 'custom'
    - start_date: ISO date string (for custom range)
    - end_date: ISO date string (for custom range)
    - limit: number of results to return (default: 20)

    Returns:
    - List of liked properties with like counts
    - Total likes statistics
    - Trending properties (most liked in period)
    """
    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    date_range = request.args.get("date_range", "month")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    limit = int(request.args.get("limit", 20))

    # Calculate date ranges (only need current period for this endpoint)
    current_start, current_end, _, _ = get_date_ranges(date_range, start_date, end_date)

    # Get landlord's properties
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [property.id for property in properties]

    if not property_ids:
        return response(
            "No properties found",
            {"liked_properties": [], "total_likes": 0, "properties_with_likes": 0},
        )

    # Query for liked properties in the date range
    liked_query = (
        g.session.query(
            LikedProperty.property_id,
            Property.title,
            Property.location,
            Property.rent_amount,
            func.count(LikedProperty.id).label("like_count"),
            func.max(LikedProperty.date_liked).label("latest_like"),
        )
        .join(Property, LikedProperty.property_id == Property.id)
        .filter(
            LikedProperty.property_id.in_(property_ids),
            LikedProperty.date_liked >= current_start,
            LikedProperty.date_liked <= current_end,
        )
        .group_by(
            LikedProperty.property_id,
            Property.title,
            Property.location,
            Property.rent_amount,
        )
        .order_by(desc("like_count"))
        .limit(limit)
    )

    liked_properties_data = []
    for result in liked_query.all():
        liked_properties_data.append(
            {
                "property_id": result.property_id,
                "title": result.title,
                "location": result.location,
                "rent_amount": float(result.rent_amount) if result.rent_amount else 0,
                "like_count": result.like_count,
                "latest_like": (
                    result.latest_like.isoformat() if result.latest_like else None
                ),
            }
        )

    # Overall statistics
    total_likes = (
        g.session.query(func.count(LikedProperty.id))
        .filter(
            LikedProperty.property_id.in_(property_ids),
            LikedProperty.date_liked >= current_start,
            LikedProperty.date_liked <= current_end,
        )
        .scalar()
        or 0
    )

    properties_with_likes = (
        g.session.query(func.count(func.distinct(LikedProperty.property_id)))
        .filter(
            LikedProperty.property_id.in_(property_ids),
            LikedProperty.date_liked >= current_start,
            LikedProperty.date_liked <= current_end,
        )
        .scalar()
        or 0
    )

    result = {
        "liked_properties": liked_properties_data,
        "total_likes": total_likes,
        "properties_with_likes": properties_with_likes,
        "average_likes_per_property": (
            round(total_likes / len(property_ids), 2) if property_ids else 0
        ),
        "date_range": {
            "start": current_start.isoformat(),
            "end": current_end.isoformat(),
            "period": date_range,
        },
    }

    return response("Liked properties retrieved successfully", result)


@landlord.route("/properties/views/statistics", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_property_views_statistics():
    """
    Get comprehensive property views statistics with date filtering support

    Query Parameters:
    - date_range: 'today', 'week', 'month', 'year', 'custom'
    - start_date: ISO date string (for custom range)
    - end_date: ISO date string (for custom range)
    - compare: boolean - whether to include comparison with previous period
    - property_id: specific property ID to filter (optional)

    Returns:
    - Current period view statistics
    - Previous period statistics (if compare=true)
    - Percentage changes and trends
    - Top viewed properties
    """
    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    date_range = request.args.get("date_range", "month")
    compare = request.args.get("compare", "false").lower() == "true"
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    property_id = request.args.get("property_id")

    # Calculate date ranges
    current_start, current_end, previous_start, previous_end = get_date_ranges(
        date_range, start_date, end_date
    )

    # Get landlord's properties
    properties_filter = {"landlord_id": user_id}
    if property_id:
        properties_filter["id"] = property_id

    properties = get_items_by_filter(g.session, Property, properties_filter)
    property_ids = [property.id for property in properties]

    if not property_ids:
        return response(
            "No properties found",
            {
                "total_views": 0,
                "unique_viewers": 0,
                "average_views_per_property": 0,
                "trend_data": [],
            },
        )

    # Current period statistics
    current_stats = get_property_views_stats_for_period(
        property_ids, current_start, current_end
    )

    result = {
        "current_period": current_stats,
        "date_range": {
            "start": current_start.isoformat(),
            "end": current_end.isoformat(),
            "period": date_range,
        },
    }

    # Add comparison data if requested
    if compare and previous_start and previous_end:
        previous_stats = get_property_views_stats_for_period(
            property_ids, previous_start, previous_end
        )
        result["previous_period"] = previous_stats
        result["comparison"] = calculate_views_changes(current_stats, previous_stats)

    # For backwards compatibility
    result.update(current_stats)

    return response("Property views statistics retrieved successfully", result)


# ======================================================
# APPLICATION ROUTES FOR LANDLORDS
# Handles rental applications for landlord's properties
# ======================================================


@landlord.get("/applications")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_all_applications_landlord():
    """Get applications with filtering and pagination"""
    user_id, _, _ = get_logged_in_user()
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)
    status = request.args.get("status", type=str)

    # Get landlord's properties
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [property.id for property in properties]

    # Build base query
    query = (
        g.session.query(Application)
        .options(
            joinedload(Application.property),
            joinedload(Application.applicant),
            joinedload(Application.tenant),
        )
        .filter(Application.property_id.in_(property_ids))
    )

    # Add status filter if provided
    if status:
        query = query.filter(Application.status == status)

    # Apply pagination
    applications = (
        query.order_by(Application.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    serialized_applications = [
        {
            **app.to_dict(),
            "property": app.property.to_dict() if app.property else None,
            "applicant": (
                app.applicant.to_dict()
                if app.applicant
                else (app.tenant.to_dict() if app.tenant else None)
            ),
            "tenant": (
                app.applicant.to_dict()
                if app.applicant
                else (app.tenant.to_dict() if app.tenant else None)
            ),  # For backward compatibility
        }
        for app in applications
    ]

    return response(
        "Applications retrieved",
        {
            "applications": serialized_applications,
        },
    )


@landlord.get("/applications/<string:application_id>/<string:property_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_application_landlord(application_id, property_id):
    """
    Retrieves a specific application with property and applicant details
    - Verifies property ownership via landlord_id
    - Returns detailed application data with related property and tenant information
    """
    user_id, _, _ = get_logged_in_user()

    # Verify property ownership first
    property = get_item_by_filter(
        g.session, Property, {"id": property_id, "landlord_id": user_id}
    )
    if not property:
        raise CustomRequestError("Property not found", 404)

    # Get the application with related data eager-loaded
    application = (
        g.session.query(Application)
        .options(
            joinedload(Application.property),
            joinedload(Application.applicant),
            joinedload(Application.tenant),
        )
        .filter(
            Application.id == application_id, Application.property_id == property_id
        )
        .first()
    )

    if not application:
        raise CustomRequestError("Application not found", 404)

    # Serialize application with related data
    application_data = serialize(application)

    application_data["property"] = (
        serialize(application.property) if application.property else None
    )

    # Include applicant data
    application_data["applicant"] = (
        serialize(application.applicant)
        if application.applicant
        else (serialize(application.tenant) if application.tenant else None)
    )
    # Also include tenant for backward compatibility
    application_data["tenant"] = application_data["applicant"]

    return response(
        "Application retrieved successfully", {"application": application_data}
    )


@landlord.get("/applications/applicants")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_applicants():
    """Get all applicants (not yet tenants) for landlord's properties"""
    user_id, _, _ = get_logged_in_user()

    # Get landlord's properties
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [p.id for p in properties]

    # Get applications for these properties
    applications = (
        g.session.query(Application)
        .options(joinedload(Application.property), joinedload(Application.tenant))
        .filter(Application.property_id.in_(property_ids))
        .all()
    )

    # Get unique applicants
    applicant_ids = list({app.tenant_id for app in applications})
    applicants = g.session.query(User).filter(User.id.in_(applicant_ids))

    # Format response
    applicants_data = []
    for applicant in applicants:
        applicant_apps = [app for app in applications if app.tenant_id == applicant.id]
        applicant_data = serialize(applicant)
        applicant_data["total_applications"] = len(applicant_apps)
        applicant_data["applications"] = [serialize(app) for app in applicant_apps]
        applicant_data["properties"] = [
            serialize(app.property) for app in applicant_apps
        ]
        applicants_data.append(applicant_data)

    return response("Applicants retrieved", {"applicants": applicants_data})


@landlord.get("/applications/applicants/<string:applicant_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_applicant_details(applicant_id):
    """Get details for an applicant (not yet tenant)"""
    user_id, _, _ = get_logged_in_user()

    # First get all properties owned by this landlord
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [prop.id for prop in properties]

    # Then get applications for this applicant that belong to landlord's properties
    applications = (
        g.session.query(Application)
        .options(joinedload(Application.property))
        .filter(
            Application.tenant_id == applicant_id,
            Application.property_id.in_(property_ids),
        )
        .all()
    )

    if not applications:
        raise CustomRequestError(
            "Applicant not found or not associated with your properties", 404
        )

    # Get applicant details
    applicant = get_item_by_filter(g.session, User, {"id": applicant_id})
    if not applicant:
        raise CustomRequestError("Applicant not found", 404)

    # Serialize with related property info
    serialized_applications = []
    for app in applications:
        serialized = serialize(app)
        serialized["property"] = serialize(app.property)
        serialized_applications.append(serialized)

    return response(
        "Applicant details",
        {
            "applicant": serialize(applicant),
            "applications": serialized_applications,
        },
    )


@landlord.route("/applications/applicants/<string:applicant_id>/download", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def download_applicant_profile_pdf(applicant_id):
    """Generates a PDF Profile of an applicant for the Landlord"""
    user_id, _, _ = get_logged_in_user()

    # 1. Verify access: Get landlord's properties
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [prop.id for prop in properties]

    # 2. Get applications and applicant data
    applications = (
        g.session.query(Application)
        .options(joinedload(Application.property))
        .filter(
            Application.tenant_id == applicant_id,
            Application.property_id.in_(property_ids),
            )
        .all()
    )

    if not applications:
        raise CustomRequestError("Applicant profile not accessible", 404)

    applicant = get_item_by_filter(g.session, User, {"id": applicant_id})

    return generate_pdf(
        template_path="pdf/applicant.html",
        filename=f"Applicant_{id}",
        applicant=applicant,
        applications=applications
    )


@landlord.get("/applications/stats")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_application_stats():
    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    date_range = request.args.get("date_range", "month")
    compare = request.args.get("compare", "false").lower() == "true"
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    # Calculate date ranges
    current_start, current_end, previous_start, previous_end = get_date_ranges(
        date_range, start_date, end_date
    )

    # Get landlord's properties
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [property.id for property in properties]

    if not property_ids:
        return response(
            "No properties found",
            {"total": 0, "received": 0, "accepted": 0, "rejected": 0, "screening": 0, "under_review": 0, "tour_scheduled": 0},
        )

    # Current period statistics
    current_stats = get_application_stats_for_period(
        property_ids, current_start, current_end
    )

    result = {
        "current_period": current_stats,
        "date_range": {
            "start": current_start.isoformat(),
            "end": current_end.isoformat(),
            "period": date_range,
        },
    }

    # Add comparison data if requested
    if compare and previous_start and previous_end:
        previous_stats = get_application_stats_for_period(
            property_ids, previous_start, previous_end
        )
        result["previous_period"] = previous_stats
        result["comparison"] = calculate_application_changes(
            current_stats, previous_stats
        )

    # For backwards compatibility
    result.update(current_stats)

    return response("Application stats retrieved", result)


@landlord.patch("/applications/<string:application_id>/approve")
@catch_exception
@jwt_required()
@role_required("landlord")
def approve_application(application_id):
    user_id, _, _ = get_logged_in_user()
    data = request.get_json() or {}

    application = get_item_by_filter(g.session, Application, {"id": application_id})
    if not application:
        raise CustomRequestError("Application not found", 404)

    property = get_item_by_filter(
        g.session, Property, {"id": application.property_id, "landlord_id": user_id}
    )
    if not property:
        raise CustomRequestError("Not authorized to approve this application", 403)

    if application.status in ["approved", "rejected", "lease-created"]:
        raise CustomRequestError(
            f"Cannot approve application with status: {application.status}", 400
        )

    updated_application = update_item(
        g.session,
        Application,
        application_id,
        {
            "status": "approved",
            "approved_at": datetime.utcnow(),
        },
    )

    # Send Approval Email
    try:
        applicant = application.applicant
        template_vars = {
            "name": f"{applicant.firstName} {applicant.lastName}",
            "property_name": property.name,
            "property_address": f"{property.street}, {property.city}",
            "action_url": f"{SITE_URL}/tenants/applications",
        }
        send_email(
            "Application Approved!",
            [applicant.email],
            "application_approved",  # Template name
            template_vars,
        )
    except Exception as e:
        logging.error(f"Email failed: {str(e)}")

    ActivityLogger.log_landlord_activity(
        g.session,
        user_id,
        "application_approved",
        f"Approved for: {property.name}",
        "application",
        application_id,
    )
    return response(
        "Application approved", {"application": serialize(updated_application)}
    )


# --- REJECT APPLICATION ---
@landlord.patch("/applications/<string:application_id>/reject")
@catch_exception
@jwt_required()
@role_required("landlord")
def reject_application(application_id):
    user_id, _, _ = get_logged_in_user()

    application = get_item_by_filter(g.session, Application, {"id": application_id})
    property = get_item_by_filter(
        g.session, Property, {"id": application.property_id, "landlord_id": user_id}
    )

    updated_application = update_item(
        g.session, Application, application_id, {"status": "rejected"}
    )

    # Send Rejection Email
    try:
        applicant = application.applicant
        template_vars = {
            "name": f"{applicant.firstName} {applicant.lastName}",
            "property_name": property.name,
        }
        send_email(
            "Update regarding your rental application",
            [applicant.email],
            "application_rejected",  # Template name
            template_vars,
        )
    except Exception as e:
        logging.error(f"Email failed: {str(e)}")

    ActivityLogger.log_landlord_activity(
        g.session,
        user_id,
        "application_rejected",
        f"Rejected for: {property.name}",
        "application",
        application_id,
    )
    return response(
        "Application rejected", {"application": serialize(updated_application)}
    )


@landlord.post("/applications/<string:application_id>/screenings")
@catch_exception
@jwt_required()
@role_required("landlord")
def create_screening(application_id):
    """
    Creates a screening process for an application
    - Verifies application exists and belongs to landlord's property
    - Creates screening record with initial status
    - Sends notification to tenant if requested
    - Optionally sends email invitation
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify application exists and belongs to landlord
    application = get_item_by_filter(g.session, Application, {"id": application_id})
    if not application:
        raise CustomRequestError("Application not found", 404)

    property = get_item_by_filter(
        g.session, Property, {"id": application.property_id, "landlord_id": user_id}
    )
    if not property:
        raise CustomRequestError("Not authorized to screen for this property", 403)

    # Get tenant information for email
    tenant = get_item_by_filter(g.session, User, {"id": application.tenant_id})
    if not tenant:
        raise CustomRequestError("Tenant not found", 404)

    # Create screening record
    screening_data = {
        "application_id": application_id,
        "tenant_id": application.tenant_id,
        "landlord_id": user_id,
        "property_id": application.property_id,
        "bio_data": data.get("bio_data", {}),
        "invitation_date": datetime.datetime.utcnow(),  # Set invitation date to now
        "screening_date": None,  # Will be set when tenant completes screening
        "status": "invited",  # Status when landlord sends invitation
    }

    try:
        new_screening = create_item(g.session, Screening, screening_data)

        # Update application status
        update_item(g.session, Application, application_id, {"status": "screening"})

        # Log activity
        ActivityLogger.log_landlord_activity(
            g.session,
            user_id,
            "screening_initiated",
            f"Initiated screening for tenant: {tenant.firstName} {tenant.lastName}",
            "screening",
            new_screening.id,
        )

        return response(
            "Screening process initiated successfully",
            {
                "screening": serialize(new_screening),
                "email_sent": data.get("send_email", False),
            },
        )
    except Exception as e:
        logging.error(f"Error creating screening: {e}")
        raise CustomRequestError("Failed to initiate screening", 500)


@landlord.get("/screenings")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_all_screenings_landlord():
    """
    Get all screening records for the landlord's properties
    """
    user_id, _, _ = get_logged_in_user()

    # Get all screenings for this landlord
    screenings = (
        g.session.query(Screening)
        .options(
            joinedload(Screening.application).joinedload(Application.property),
            joinedload(Screening.application).joinedload(Application.tenant),
        )
        .filter(Screening.landlord_id == user_id)
        .order_by(Screening.created_at.desc())
        .all()
    )

    # Serialize with related data
    screenings_data = []
    for screening in screenings:
        screening_data = serialize(screening)
        if screening.application:
            screening_data["application"] = serialize(screening.application)
            if screening.application.tenant:
                screening_data["tenant"] = serialize(screening.application.tenant)
            if screening.application.property:
                screening_data["property"] = serialize(screening.application.property)
        screenings_data.append(screening_data)

    return response(
        "Screenings retrieved successfully", {"screenings": screenings_data}
    )


@landlord.get("/screenings/<string:screening_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_screening_details(screening_id):
    """
    Get detailed information about a specific screening
    """
    user_id, _, _ = get_logged_in_user()

    # Get screening with related data
    screening = (
        g.session.query(Screening)
        .options(
            joinedload(Screening.application).joinedload(Application.property),
            joinedload(Screening.application).joinedload(Application.tenant),
        )
        .filter(Screening.id == screening_id, Screening.landlord_id == user_id)
        .first()
    )

    if not screening:
        raise CustomRequestError("Screening not found", 404)

    # Serialize with all related data
    screening_data = serialize(screening)
    if screening.application:
        screening_data["application"] = serialize(screening.application)
        if screening.application.tenant:
            screening_data["tenant"] = serialize(screening.application.tenant)
        if screening.application.property:
            screening_data["property"] = serialize(screening.application.property)

    return response(
        "Screening details retrieved successfully", {"screening": screening_data}
    )


@landlord.patch("/screenings/<string:screening_id>/review")
@catch_exception
@jwt_required()
@role_required("landlord")
def review_screening(screening_id):
    """
    Review and approve/reject a completed screening
    - Updates screening with landlord's review
    - Updates application status based on screening result
    - Provides feedback to tenant
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify screening exists and belongs to landlord
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "landlord_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found", 404)

    if screening.status != "completed":
        raise CustomRequestError("Screening must be completed before review", 400)

    # Validate review data
    review_result = data.get("result")  # "approved" or "rejected"
    if review_result not in ["approved", "rejected"]:
        raise CustomRequestError("Review result must be 'approved' or 'rejected'", 400)

    # Update screening with review
    screening_update = {
        "status": f"screening-{review_result}",
        "review_date": datetime.utcnow(),
        "review_notes": data.get("notes", ""),
        "reviewer_id": user_id,
    }

    updated_screening = update_item(
        g.session, Screening, screening_id, screening_update
    )

    # Update application status based on screening result
    application_status = "approved" if review_result == "approved" else "rejected"
    update_item(
        g.session, Application, screening.application_id, {"status": application_status}
    )

    # Log activity
    ActivityLogger.log_landlord_activity(
        g.session,
        user_id,
        f"screening_{review_result}",
        f"Screening {review_result} for application ID: {screening.application_id}",
        "screening",
        screening_id,
    )

    return response(
        f"Screening {review_result} successfully",
        {"screening": serialize(updated_screening)},
    )


@landlord.patch("/screenings/<string:screening_id>/complete")
@catch_exception
@jwt_required()
@role_required("landlord")
def complete_screening(screening_id):
    """
    Completes a screening process with approval/denial
    - Updates screening status
    - Updates application status accordingly
    - Notifies tenant of result
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify screening exists and belongs to landlord
    screening = get_item_by_filter(
        g.session, Screening, {"id": screening_id, "landlord_id": user_id}
    )
    if not screening:
        raise CustomRequestError("Screening not found", 404)

    if screening.status not in ["completed", "in-progress"]:
        raise CustomRequestError(
            "Screening cannot be modified in its current state", 400
        )

    # Update screening
    updated_screening = update_item(
        g.session,
        Screening,
        screening_id,
        {"status": data["status"], "review_date": datetime.utcnow()},
    )

    # Update application status
    update_item(
        g.session, Application, screening.application_id, {"status": data["status"]}
    )

    return response(
        f"Screening marked as {data['status']}",
        {"screening": serialize(updated_screening)},
    )


@landlord.post("/applications/<string:application_id>/invite-screening")
@catch_exception
@jwt_required()
@role_required("landlord")
def invite_for_screening(application_id):
    """
    Sends screening invitation to tenant for an approved application
    - Creates screening record
    - Sends email invitation to tenant
    - Updates application status to screening_invited
    """
    user_id, _, _ = get_logged_in_user()

    # Verify application exists and belongs to landlord's property
    application = get_item_by_filter(g.session, Application, {"id": application_id})
    if not application:
        raise CustomRequestError("Application not found", 404)

    # Verify property belongs to landlord
    property = get_item_by_filter(
        g.session, Property, {"id": application.property_id, "landlord_id": user_id}
    )
    if not property:
        raise CustomRequestError("Not authorized for this property", 403)

    # Check if screening already exists
    existing_screening = get_item_by_filter(
        g.session, Screening, {"application_id": application_id}
    )
    if existing_screening:
        raise CustomRequestError("Screening invitation already sent", 400)

    # Get tenant information
    tenant = get_item_by_filter(g.session, User, {"id": application.tenant_id})
    if not tenant:
        raise CustomRequestError("Tenant not found", 404)

    # Create screening record
    screening_data = {
        "application_id": application_id,
        "tenant_id": application.tenant_id,
        "landlord_id": user_id,
        "property_id": application.property_id,
        "invitation_date": datetime.utcnow(),
        "status": "invited",
    }

    new_screening = create_item(g.session, Screening, screening_data)

    # Update application status
    update_item(g.session, Application, application_id, {"status": "screening_invited"})

    # Log activity
    ActivityLogger.log_landlord_activity(
        g.session,
        user_id,
        "screening_invited",
        f"Sent screening invitation to {tenant.first_name} {tenant.last_name} for {property.name}",
        "screening",
        new_screening.id,
    )

    # Send email notification
    template_vars = {
        "tenant_name": f"{tenant.first_name} {tenant.last_name}",
        "property_name": property.name,
        "property_address": f"{property.street}, {property.city}",
        "action_url": f"{SITE_URL}/tenants/screenings",
    }

    send_email(
        subject=f"Screening Invitation for {property.name}",
        recipients=[tenant.email],
        template_name="screening_invitation",
        template_vars=template_vars,
        template_folder="tenant",
    )

    return response(
        "Screening invitation sent successfully",
        {"screening": serialize(new_screening)},
    )


# ======================================================
# LEASE MANAGEMENT ROUTES
# Handles lease creation, signing, and management
# ======================================================


@landlord.post("/applications/<string:application_id>/leases")
@catch_exception
@jwt_required()
@role_required("landlord")
def create_lease(application_id):
    """
    Creates a lease agreement for an approved application
    - Verifies application is approved
    - Creates lease with initial terms
    - Associates with property and tenant
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify application exists and is approved
    application = get_item_by_filter(
        g.session, Application, {"id": application_id, "status": "approved"}
    )
    if not application:
        raise CustomRequestError("Application not approved", 400)

    # Verify property belongs to landlord
    property = get_item_by_filter(
        g.session, Property, {"id": application.property_id, "landlord_id": user_id}
    )
    if not property:
        raise CustomRequestError("Not authorized for this property", 403)

    # Create lease
    lease_data = {
        "property_id": application.property_id,
        "tenant_id": application.tenant_id,
        "landlord_id": user_id,
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "monthly_rent": data["monthly_rent"],
        "security_deposit": data["security_deposit"],
        "terms": data.get("terms", ""),
        "status": "pending-signature",
    }

    try:
        new_lease = create_item(g.session, Lease, lease_data)

        # Update property with tenant and lease info
        update_item(
            g.session,
            Property,
            application.property_id,
            {"tenant_id": application.tenant_id, "current_lease_id": new_lease.id},
        )

        # Update application status
        update_item(g.session, Application, application_id, {"status": "lease-created"})

        # Log activity
        ActivityLogger.log_landlord_activity(
            g.session,
            user_id,
            "lease_created",
            f"Created lease agreement for property: {property.name}",
            "lease",
            new_lease.id,
        )

        return response("Lease created successfully", {"lease": serialize(new_lease)})
    except Exception as e:
        logging.error(f"Error creating lease: {e}")
        raise CustomRequestError("Failed to create lease", 500)


@landlord.post("/leases/<string:lease_id>/sign")
@catch_exception
@jwt_required()
@role_required("landlord")
def sign_lease_landlord(lease_id):
    """
    Allows landlord to sign a lease agreement
    - Verifies lease ownership
    - Updates signature fields
    - Activates lease if both parties signed
    """
    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Verify lease exists and belongs to landlord
    lease = get_item_by_filter(
        g.session, Lease, {"id": lease_id, "landlord_id": user_id}
    )
    if not lease:
        raise CustomRequestError("Lease not found", 404)

    if lease.status != "pending-signature":
        raise CustomRequestError("Lease is not in signable state", 400)

    # Update lease with landlord signature
    update_data = {
        "landlord_signed_at": datetime.utcnow(),
        "landlord_signature": data["signature"],
        "updated_at": datetime.utcnow(),
    }

    # If tenant already signed, activate lease
    if lease.tenant_signed_at:
        update_data["status"] = "active"
        update_data["start_date"] = datetime.utcnow()

        # Mark property as unavailable
        update_item(g.session, Property, lease.property_id, {"is_available": False})

    updated_lease = update_item(g.session, Lease, lease_id, update_data)

    # Log activity
    activity_description = "Signed lease agreement"
    if updated_lease.status == "active":
        activity_description = "Signed lease agreement - lease is now active"

    ActivityLogger.log_landlord_activity(
        g.session,
        user_id,
        "lease_signed",
        activity_description,
        "lease",
        lease_id,
    )

    return response("Lease signed successfully", {"lease": serialize(updated_lease)})


@landlord.get("/leases")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_all_landlord_leases():
    """Get all lease agreements for current landlord"""
    user_id, _, _ = get_logged_in_user()

    leases = get_items_by_filter(
        g.session,
        Lease,
        {"landlord_id": user_id},
        order_by=Lease.created_at.desc(),
    )

    return response("All lease agreements retrieved", {"leases": serialize(leases)})


# ======================================================
# TENANT MANAGEMENT ROUTES
# Handles viewing and managing current tenants
# ======================================================


def get_tenant_payment_status(session, tenant_id):
    """
    Determines the payment status for a tenant based on their payment history and lease terms
    Returns: 'paid', 'unpaid', or 'overdue'
    """
    # Get the tenant's active leases
    active_leases = get_items_by_filter(
        session, Lease, {"tenant_id": tenant_id, "is_active": True}
    )

    if not active_leases:
        return "unpaid"

    # Get all payments for this tenant, ordered by most recent first
    payments = get_items_by_filter(
        session,
        Transaction,
        {"tenant_id": tenant_id, "payment_purpose": "rent", "payment_status": "paid"},
        order_by="transaction_date.desc()",
    )

    if not payments:
        return "unpaid"  # No payments made

    # Get the most recent payment
    latest_payment = payments[0]
    latest_payment_date = latest_payment.transaction_date

    # Check if payment covers current period
    for lease in active_leases:
        payment_due_date = calculate_next_payment_due(lease, latest_payment_date)
        if datetime.utcnow().date() > payment_due_date:
            return "overdue"

    return "paid"


def get_last_payment(session, tenant_id):
    """
    Gets the last payment made by a tenant
    Returns: dict with amount and date, or None if no payments
    """
    payments = get_items_by_filter(
        session,
        Transaction,
        {"tenant_id": tenant_id, "payment_purpose": "rent", "payment_status": "paid"},
        order_by="transaction_date.desc()",
        limit=1,
    )

    if not payments:
        return None

    last_payment = payments[0]
    return {
        "amount": last_payment.amount,
        "date": last_payment.transaction_date.isoformat(),
    }


def calculate_next_payment_due(lease, last_payment_date):
    """
    Calculates when the next payment is due based on lease terms
    """
    if lease.payment_frequency == "monthly":
        return last_payment_date + timedelta(days=30)
    elif lease.payment_frequency == "quarterly":
        return last_payment_date + timedelta(days=90)
    elif lease.payment_frequency == "yearly":
        return last_payment_date + timedelta(days=365)
    else:
        return last_payment_date + timedelta(days=30)


@landlord.get("/tenants")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_tenants():
    """
    Retrieves paginated, filtered, and searchable list of tenants for landlord
    Query params:
      - page: int (default 1)
      - limit: int (default 10)
      - search: str (search by name/email)
      - status: str (active, overdue, paid, unpaid)
      - start_date, end_date: ISO date strings (filter by lease start)
    Returns:
      - tenants: list
      - total: int
      - pages: int
      - stats: dict (total, active, paid, overdue, unpaid)
    """
    user_id, _, _ = get_logged_in_user()
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    search = request.args.get("search", "")
    status = request.args.get("status")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    # Get all leases for landlord
    leases_query = g.session.query(Lease).filter(Lease.landlord_id == user_id)
    if start_date:
        leases_query = leases_query.filter(Lease.start_date >= start_date)
    if end_date:
        leases_query = leases_query.filter(Lease.start_date <= end_date)
    leases = leases_query.all()

    # Get unique tenant IDs
    tenant_ids = list({lease.tenant_id for lease in leases})
    tenants_query = g.session.query(User).filter(User.id.in_(tenant_ids))
    if search:
        tenants_query = tenants_query.filter(
            or_(
                User.firstName.ilike(f"%{search}%"),
                User.lastName.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
            )
        )
    tenants = tenants_query.all()

    # Stats calculation
    stats = {"total": len(tenants), "active": 0, "paid": 0, "overdue": 0, "unpaid": 0}
    tenants_data = []
    for tenant in tenants:
        tenant_leases = [lease for lease in leases if lease.tenant_id == tenant.id]
        active = any(lease.is_active for lease in tenant_leases)
        paid = any(
            get_tenant_payment_status(g.session, tenant.id) == "paid"
            for lease in tenant_leases
        )
        overdue = any(
            get_tenant_payment_status(g.session, tenant.id) == "overdue"
            for lease in tenant_leases
        )
        unpaid = not paid and not overdue
        if active:
            stats["active"] += 1
        if paid:
            stats["paid"] += 1
        if overdue:
            stats["overdue"] += 1
        if unpaid:
            stats["unpaid"] += 1
        tenants_data.append(
            {
                "id": tenant.id,
                "firstName": tenant.firstName,
                "lastName": tenant.lastName,
                "email": tenant.email,
                "phone": tenant.phone_number,
                "leases": [serialize(lease) for lease in tenant_leases],
                "properties": [serialize(lease.property) for lease in tenant_leases],
                "payment_status": get_tenant_payment_status(g.session, tenant.id),
            }
        )

    # Pagination
    total = len(tenants_data)
    pages = (total + limit - 1) // limit
    start = (page - 1) * limit
    end = start + limit
    paginated_tenants = tenants_data[start:end]

    return response(
        "Tenants retrieved",
        {"items": paginated_tenants, "total": total, "pages": pages, "stats": stats},
    )


@landlord.get("/tenants/stats")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_tenant_stats():
    """
    Returns tenant statistics for landlord dashboard
    """
    user_id, _, _ = get_logged_in_user()
    leases = get_items_by_filter(g.session, Lease, {"landlord_id": user_id})
    tenant_ids = list({lease.tenant_id for lease in leases})
    tenants = get_items_by_filter(g.session, User, {"id": tenant_ids})
    stats = {"total": len(tenants), "active": 0, "paid": 0, "overdue": 0, "unpaid": 0}
    for tenant in tenants:
        tenant_leases = [lease for lease in leases if lease.tenant_id == tenant.id]
        active = any(lease.is_active for lease in tenant_leases)
        paid = any(
            get_tenant_payment_status(g.session, tenant.id) == "paid"
            for lease in tenant_leases
        )
        overdue = any(
            get_tenant_payment_status(g.session, tenant.id) == "overdue"
            for lease in tenant_leases
        )
        unpaid = not paid and not overdue
        if active:
            stats["active"] += 1
        if paid:
            stats["paid"] += 1
        if overdue:
            stats["overdue"] += 1
        if unpaid:
            stats["unpaid"] += 1
    return response("Tenant stats", stats)


# ======================================================
# TRANSACTION ROUTES FOR LANDLORDS
# Handles financial transactions related to properties
# ======================================================


@landlord.get("/transactions")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_all_transactions_landlord():
    """
    Retrieves all transactions for landlord's properties
    - Gets all properties owned by landlord
    - Fetches transactions for those properties
    - Returns formatted transaction data
    """
    user_id, _, _ = get_logged_in_user()

    # Get landlord's properties
    properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})
    property_ids = [property.id for property in properties]

    # Get transactions for these properties
    transactions = get_items_by_filter(
        g.session, Transaction, {"property_id": property_ids}
    )

    # Format response data
    transactions_data = [
        {
            "id": txn.id,
            "tenant_id": txn.tenant_id,
            "property_id": txn.property_id,
            "payment_id": txn.payment_id,
            "amount": txn.amount,
            "payment_status": txn.payment_status,
            "payment_purpose": txn.payment_purpose,
            "transaction_date": txn.transaction_date,
        }
        for txn in transactions
    ]

    return response(
        "Transactions retrieved successfully", {"transactions": transactions_data}
    )


@landlord.get("/transactions/statistics")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_transaction_statistics_landlord():
    """
    Get comprehensive transaction statistics for landlord with date filtering support

    Query Parameters:
    - date_range: 'today', 'week', 'month', 'year', 'custom'
    - start_date: ISO date string (for custom range)
    - end_date: ISO date string (for custom range)
    - compare: boolean - whether to include comparison with previous period

    Returns:
    - Current period statistics
    - Previous period statistics (if compare=true)
    - Percentage changes and trends
    """
    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    date_range = request.args.get("date_range", "month")
    compare = request.args.get("compare", "false").lower() == "true"
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    # Calculate date ranges
    current_start, current_end, previous_start, previous_end = get_date_ranges(
        date_range, start_date, end_date
    )

    # Get landlord's properties for filtering
    landlord_properties = get_items_by_filter(
        g.session, Property, {"landlord_id": user_id}
    )
    property_ids = [prop.id for prop in landlord_properties]

    if not property_ids:
        return response(
            "No properties found",
            {
                "total_balance": 0,
                "total_transactions": 0,
                "rent_payments": 0,
                "screening_payments": 0,
                "average_transaction": 0,
                "trend_data": [],
            },
        )

    # Current period statistics
    current_stats = get_transaction_stats_for_period(
        property_ids, current_start, current_end
    )

    result = {
        "current_period": current_stats,
        "date_range": {
            "start": current_start.isoformat(),
            "end": current_end.isoformat(),
            "period": date_range,
        },
    }

    # Add comparison data if requested
    if compare and previous_start and previous_end:
        previous_stats = get_transaction_stats_for_period(
            property_ids, previous_start, previous_end
        )
        result["previous_period"] = previous_stats
        result["comparison"] = calculate_stat_changes(current_stats, previous_stats)

    # For backwards compatibility
    result.update(current_stats)

    return response("Transaction statistics retrieved successfully", result)


@landlord.get("/financial-overview")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_financial_overview():
    """
    Get comprehensive financial overview for landlord dashboard

    Includes:
    - Revenue this month (collected rent)
    - Expected revenue (pending/upcoming payments)
    - Outstanding rent (overdue payments)
    - Expenses tracking
    - Net profit/loss
    - Revenue trend (last 6 months)
    """
    user_id, _, _ = get_logged_in_user()

    # Get current month boundaries
    now = datetime.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if now.month == 12:
        next_month_start = now.replace(year=now.year + 1, month=1, day=1)
    else:
        next_month_start = now.replace(month=now.month + 1, day=1)

    # Get landlord's properties
    landlord_properties = get_items_by_filter(
        g.session, Property, {"landlord_id": user_id}
    )
    property_ids = [prop.id for prop in landlord_properties]

    if not property_ids:
        return response(
            "No properties found",
            {
                "revenue_this_month": 0,
                "expected_revenue": 0,
                "outstanding_rent": 0,
                "total_expenses": 0,
                "net_profit": 0,
                "revenue_trend": [],
                "expense_breakdown": {},
            },
        )

    # 1. REVENUE THIS MONTH (collected rent)
    revenue_this_month = (
        g.session.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_status == "paid",
            Transaction.payment_purpose == PaymentPurpose.RENT,
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < next_month_start,
        )
        .scalar()
        or 0
    )

    # 2. EXPECTED REVENUE (pending rent payments)
    # Calculate expected rent from active leases
    active_leases = (
        g.session.query(Lease)
        .filter(
            Lease.property_id.in_(property_ids),
            Lease.is_active == True,
            Lease.start_date <= now,
            or_(Lease.end_date.is_(None), Lease.end_date >= now),
        )
        .all()
    )

    expected_revenue = sum(
        [lease.monthly_rent for lease in active_leases if lease.monthly_rent]
    )

    # 3. OUTSTANDING RENT (overdue payments)
    # For now, we'll calculate based on leases that should have paid but haven't
    # This is a simplified calculation - you may want to track this more precisely
    outstanding_rent = (
        g.session.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_status.in_(["pending", "failed"]),
            Transaction.payment_purpose == PaymentPurpose.RENT,
            Transaction.transaction_date < now,
        )
        .scalar()
        or 0
    )

    # 4. EXPENSES TRACKING
    # Get all expense-related transactions (using OTHER for now)
    # Note: Currently only RENT, SCREENING, OTHER are available in PaymentPurpose enum
    expense_transactions = (
        g.session.query(Transaction)
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_purpose == PaymentPurpose.OTHER,
            Transaction.transaction_date >= month_start,
            Transaction.transaction_date < next_month_start,
        )
        .all()
    )

    total_expenses = sum([t.amount for t in expense_transactions if t.amount])

    # Expense breakdown by category
    expense_breakdown = {}
    for transaction in expense_transactions:
        purpose = transaction.payment_purpose or "other"
        if purpose not in expense_breakdown:
            expense_breakdown[purpose] = 0
        expense_breakdown[purpose] += transaction.amount or 0

    # 5. NET PROFIT/LOSS
    net_profit = float(revenue_this_month) - float(total_expenses)

    # 6. REVENUE TREND (last 6 months)
    revenue_trend = []
    for i in range(6, 0, -1):
        # Calculate month boundaries
        if now.month - i < 1:
            trend_month = 12 + (now.month - i)
            trend_year = now.year - 1
        else:
            trend_month = now.month - i
            trend_year = now.year

        trend_start = datetime(trend_year, trend_month, 1)
        if trend_month == 12:
            trend_end = datetime(trend_year + 1, 1, 1)
        else:
            trend_end = datetime(trend_year, trend_month + 1, 1)

        month_revenue = (
            g.session.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.property_id.in_(property_ids),
                Transaction.payment_status == "paid",
                Transaction.payment_purpose == PaymentPurpose.RENT,
                Transaction.transaction_date >= trend_start,
                Transaction.transaction_date < trend_end,
            )
            .scalar()
            or 0
        )

        month_expenses = (
            g.session.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.property_id.in_(property_ids),
                Transaction.payment_purpose == PaymentPurpose.OTHER,
                Transaction.transaction_date >= trend_start,
                Transaction.transaction_date < trend_end,
            )
            .scalar()
            or 0
        )

        revenue_trend.append(
            {
                "month": trend_start.strftime("%b %Y"),
                "revenue": float(month_revenue),
                "expenses": float(month_expenses),
                "profit": float(month_revenue) - float(month_expenses),
            }
        )

    return response(
        "Financial overview retrieved successfully",
        {
            "revenue_this_month": float(revenue_this_month),
            "expected_revenue": float(expected_revenue),
            "outstanding_rent": float(outstanding_rent),
            "total_expenses": float(total_expenses),
            "net_profit": net_profit,
            "revenue_trend": revenue_trend,
            "expense_breakdown": expense_breakdown,
            "active_leases_count": len(active_leases),
        },
    )


@landlord.get("/alerts")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_alerts():
    """
    Get critical alerts and notifications for landlord dashboard

    Includes:
    - Lease expirations (30/60/90 days)
    - Overdue rent payments
    - Pending maintenance requests (placeholder for v2)
    - New applications requiring action
    - Inspection due dates (placeholder for v2)
    - Document expiration warnings (placeholder for v2)
    """
    user_id, _, _ = get_logged_in_user()

    # Get landlord's properties
    landlord_properties = get_items_by_filter(
        g.session, Property, {"landlord_id": user_id}
    )
    property_ids = [prop.id for prop in landlord_properties]

    alerts = []
    now = datetime.now()

    if not property_ids:
        return response("No alerts", {"alerts": [], "total_count": 0})

    # 1. LEASE EXPIRATIONS (30/60/90 days)
    for days_ahead in [30, 60, 90]:
        expiry_date = now + timedelta(days=days_ahead)
        expiring_leases = (
            g.session.query(Lease)
            .filter(
                Lease.property_id.in_(property_ids),
                Lease.status == "active",
                Lease.end_date.isnot(None),
                Lease.end_date >= now,
                Lease.end_date <= expiry_date,
            )
            .all()
        )

        for lease in expiring_leases:
            days_until_expiry = (lease.end_date - now).days
            alerts.append(
                {
                    "id": f"lease_{lease.id}",
                    "type": "lease_expiration",
                    "priority": "high" if days_until_expiry <= 30 else "medium",
                    "title": f"Lease expiring in {days_until_expiry} days",
                    "description": f"Property: {lease.property.name if lease.property else 'N/A'}",
                    "action_text": "Review Lease",
                    "action_route": f"/property-owner/leases/{lease.id}",
                    "date": lease.end_date.isoformat() if lease.end_date else None,
                }
            )

    # 2. OVERDUE RENT PAYMENTS
    overdue_transactions = (
        g.session.query(Transaction)
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_status.in_(["pending", "failed"]),
            Transaction.payment_purpose == PaymentPurpose.RENT,
            Transaction.transaction_date < now,
        )
        .all()
    )

    for transaction in overdue_transactions:
        days_overdue = (now - transaction.transaction_date).days
        alerts.append(
            {
                "id": f"overdue_{transaction.id}",
                "type": "overdue_rent",
                "priority": "urgent",
                "title": f"Rent payment overdue ({days_overdue} days)",
                "description": f"₦{float(transaction.amount):,.2f} - {transaction.property.name if transaction.property else 'N/A'}",
                "action_text": "Collect Payment",
                "action_route": f"/property-owner/transactions/{transaction.id}",
                "date": (
                    transaction.transaction_date.isoformat()
                    if transaction.transaction_date
                    else None
                ),
            }
        )

    # 3. NEW APPLICATIONS REQUIRING ACTION
    pending_applications = (
        g.session.query(Application)
        .filter(
            Application.property_id.in_(property_ids),
            Application.status == "pending",
        )
        .all()
    )

    if len(pending_applications) > 0:
        alerts.append(
            {
                "id": "pending_applications",
                "type": "pending_applications",
                "priority": "high",
                "title": f"{len(pending_applications)} new applications pending",
                "description": "Review and respond to tenant applications",
                "action_text": "Review Applications",
                "action_route": "/property-owner/applications",
                "date": None,
                "count": len(pending_applications),
            }
        )

    # 4. PENDING MAINTENANCE REQUESTS (Placeholder for v2)
    # This would query a MaintenanceRequest table when implemented
    # For now, we'll add a placeholder if needed

    # 5. INSPECTION DUE DATES (Placeholder for v2)
    # This would query an Inspection table when implemented

    # 6. DOCUMENT EXPIRATION WARNINGS (Placeholder for v2)
    # This would check for expiring property documents, insurance, etc.

    # Sort alerts by priority
    priority_order = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
    alerts.sort(key=lambda x: priority_order.get(x["priority"], 3))

    return response(
        "Alerts retrieved successfully",
        {"alerts": alerts, "total_count": len(alerts)},
    )


@landlord.get("/occupancy-stats")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_occupancy_stats():
    """
    Get occupancy statistics for landlord's portfolio

    Returns:
    - Total occupancy percentage
    - Total units
    - Occupied units
    - Vacant units
    - Units under maintenance (placeholder for v2)
    - Available for rent
    """
    user_id, _, _ = get_logged_in_user()

    # Get all landlord's properties
    all_properties = get_items_by_filter(g.session, Property, {"landlord_id": user_id})

    if not all_properties:
        return response(
            "No properties found",
            {
                "total_units": 0,
                "occupied_units": 0,
                "vacant_units": 0,
                "under_maintenance": 0,
                "available_for_rent": 0,
                "occupancy_rate": 0,
            },
        )

    total_units = len(all_properties)
    occupied_units = 0
    vacant_units = 0
    under_maintenance = 0
    available_for_rent = 0

    now = datetime.now()

    for property in all_properties:
        # Check if property has an active lease
        active_lease = (
            g.session.query(Lease)
            .filter(
                Lease.property_id == property.id,
                Lease.is_active == True,
                Lease.start_date <= now,
                or_(Lease.end_date.is_(None), Lease.end_date >= now),
            )
            .first()
        )

        if active_lease:
            occupied_units += 1
        else:
            # Check property status to determine if vacant or other
            property_status = getattr(property, "status", "available")
            if property_status == "available":
                vacant_units += 1
                available_for_rent += 1
            elif property_status == "maintenance":
                under_maintenance += 1
                vacant_units += 1
            else:
                # draft, etc.
                vacant_units += 1

    # Calculate occupancy rate
    occupancy_rate = (
        round((occupied_units / total_units) * 100, 1) if total_units > 0 else 0
    )

    return response(
        "Occupancy statistics retrieved successfully",
        {
            "total_units": total_units,
            "occupied_units": occupied_units,
            "vacant_units": vacant_units,
            "under_maintenance": under_maintenance,
            "available_for_rent": available_for_rent,
            "occupancy_rate": occupancy_rate,
        },
    )


@landlord.get("/tenant-summary")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_tenant_summary():
    """
    Get tenant summary statistics

    Returns:
    - Active tenants count
    - Lease expiration timeline (next 90 days)
    - Tenant satisfaction (placeholder for v2)
    """
    user_id, _, _ = get_logged_in_user()

    # Get landlord's properties
    landlord_properties = get_items_by_filter(
        g.session, Property, {"landlord_id": user_id}
    )
    property_ids = [prop.id for prop in landlord_properties]

    if not property_ids:
        return response(
            "No properties found",
            {
                "active_tenants": 0,
                "expiring_leases_30_days": 0,
                "expiring_leases_60_days": 0,
                "expiring_leases_90_days": 0,
                "lease_expiration_timeline": [],
            },
        )

    now = datetime.now()

    # Get all active leases
    active_leases = (
        g.session.query(Lease)
        .filter(
            Lease.property_id.in_(property_ids),
            Lease.is_active == True,
            Lease.start_date <= now,
            or_(Lease.end_date.is_(None), Lease.end_date >= now),
        )
        .all()
    )

    active_tenants = len(active_leases)

    # Count expiring leases in different time windows
    expiring_30 = 0
    expiring_60 = 0
    expiring_90 = 0
    timeline = []

    for lease in active_leases:
        if lease.end_date:
            days_until_expiry = (lease.end_date - now).days

            if 0 <= days_until_expiry <= 30:
                expiring_30 += 1
            elif 31 <= days_until_expiry <= 60:
                expiring_60 += 1
            elif 61 <= days_until_expiry <= 90:
                expiring_90 += 1

            if 0 <= days_until_expiry <= 90:
                timeline.append(
                    {
                        "lease_id": lease.id,
                        "property_name": (
                            lease.property.name if lease.property else "N/A"
                        ),
                        "tenant_name": (
                            f"{lease.tenant.firstName} {lease.tenant.lastName}"
                            if lease.tenant
                            else "N/A"
                        ),
                        "end_date": lease.end_date.isoformat(),
                        "days_remaining": days_until_expiry,
                    }
                )

    # Sort timeline by days remaining
    timeline.sort(key=lambda x: x["days_remaining"])

    return response(
        "Tenant summary retrieved successfully",
        {
            "active_tenants": active_tenants,
            "expiring_leases_30_days": expiring_30,
            "expiring_leases_60_days": expiring_60,
            "expiring_leases_90_days": expiring_90,
            "lease_expiration_timeline": timeline,
        },
    )


@landlord.get("/revenue-chart")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_revenue_chart():
    """
    Get revenue chart data for dashboard

    Returns:
    - Monthly revenue trend (last 12 months)
    - Property-wise revenue breakdown
    - Payment collection status
    """
    user_id, _, _ = get_logged_in_user()

    # Get landlord's properties
    landlord_properties = get_items_by_filter(
        g.session, Property, {"landlord_id": user_id}
    )
    property_ids = [prop.id for prop in landlord_properties]

    if not property_ids:
        return response(
            "No revenue data",
            {
                "monthly_trend": [],
                "property_breakdown": [],
                "payment_status": {
                    "paid": 0,
                    "pending": 0,
                    "failed": 0,
                },
            },
        )

    now = datetime.now()

    # 1. MONTHLY REVENUE TREND (Last 12 months)
    monthly_trend = []
    for i in range(12, 0, -1):
        # Calculate month boundaries
        if now.month - i < 1:
            trend_month = 12 + (now.month - i)
            trend_year = now.year - 1
        else:
            trend_month = now.month - i
            trend_year = now.year

        trend_start = datetime(trend_year, trend_month, 1)
        if trend_month == 12:
            trend_end = datetime(trend_year + 1, 1, 1)
        else:
            trend_end = datetime(trend_year, trend_month + 1, 1)

        month_revenue = (
            g.session.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.property_id.in_(property_ids),
                Transaction.payment_status == "paid",
                Transaction.payment_purpose == PaymentPurpose.RENT,
                Transaction.transaction_date >= trend_start,
                Transaction.transaction_date < trend_end,
            )
            .scalar()
            or 0
        )

        monthly_trend.append(
            {
                "month": trend_start.strftime("%b %Y"),
                "month_short": trend_start.strftime("%b"),
                "revenue": float(month_revenue),
            }
        )

    # 2. PROPERTY-WISE REVENUE BREAKDOWN (Last 6 months)
    six_months_ago = now - timedelta(days=180)
    property_breakdown = []

    for property in landlord_properties:
        property_revenue = (
            g.session.query(func.coalesce(func.sum(Transaction.amount), 0))
            .filter(
                Transaction.property_id == property.id,
                Transaction.payment_status == "paid",
                Transaction.payment_purpose == PaymentPurpose.RENT,
                Transaction.transaction_date >= six_months_ago,
            )
            .scalar()
            or 0
        )

        if property_revenue > 0:
            property_breakdown.append(
                {
                    "property_id": property.id,
                    "property_name": property.name,
                    "revenue": float(property_revenue),
                }
            )

    # Sort by revenue descending
    property_breakdown.sort(key=lambda x: x["revenue"], reverse=True)

    # 3. PAYMENT COLLECTION STATUS (Current month)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    paid_count = (
        g.session.query(func.count(Transaction.id))
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_purpose == PaymentPurpose.RENT,
            Transaction.payment_status == "paid",
            Transaction.transaction_date >= month_start,
        )
        .scalar()
        or 0
    )

    pending_count = (
        g.session.query(func.count(Transaction.id))
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_purpose == PaymentPurpose.RENT,
            Transaction.payment_status == "pending",
            Transaction.transaction_date >= month_start,
        )
        .scalar()
        or 0
    )

    failed_count = (
        g.session.query(func.count(Transaction.id))
        .filter(
            Transaction.property_id.in_(property_ids),
            Transaction.payment_purpose == PaymentPurpose.RENT,
            Transaction.payment_status == "failed",
            Transaction.transaction_date >= month_start,
        )
        .scalar()
        or 0
    )

    return response(
        "Revenue chart data retrieved successfully",
        {
            "monthly_trend": monthly_trend,
            "property_breakdown": property_breakdown[:10],  # Top 10 properties
            "payment_status": {
                "paid": paid_count,
                "pending": pending_count,
                "failed": failed_count,
            },
        },
    )


@landlord.get("/transactions/<string:transaction_id>/<string:property_id>")
@catch_exception
@jwt_required()
@role_required("landlord")
def get_transaction_landlord(transaction_id, property_id):
    """
    Retrieves a specific transaction
    - Verifies property ownership via landlord_id
    - Returns detailed transaction data
    """
    user_id, _, _ = get_logged_in_user()

    # First verify the property belongs to landlord
    property = get_item_by_filter(
        g.session, Property, {"id": property_id, "landlord_id": user_id}
    )
    if not property:
        raise CustomRequestError("Property not found", 404)

    # Then get the transaction
    transaction = get_item_by_filter(
        g.session, Transaction, {"id": transaction_id, "property_id": property_id}
    )

    if not transaction:
        raise CustomRequestError("Transaction not found", 404)

    transaction_data = {
        "id": transaction.id,
        "tenant_id": transaction.tenant_id,
        "property_id": transaction.property_id,
        "payment_id": transaction.payment_id,
        "amount": transaction.amount,
        "payment_status": transaction.payment_status,
        "payment_purpose": transaction.payment_purpose,
        "transaction_date": transaction.transaction_date,
    }

    return response(
        "Transaction retrieved successfully", {"transaction": transaction_data}
    )


# ======================================================
# HELPER FUNCTIONS FOR STATISTICS AND DATE HANDLING
# ======================================================


def get_date_ranges(date_range, start_date=None, end_date=None):
    """
    Calculate current and previous date ranges based on the specified period
    """
    now = datetime.now()

    if date_range == "custom" and start_date and end_date:
        current_start = datetime.fromisoformat(
            start_date.replace("Z", "+00:00")
        ).replace(tzinfo=None)
        current_end = datetime.fromisoformat(end_date.replace("Z", "+00:00")).replace(
            tzinfo=None
        )
        duration = current_end - current_start
        previous_end = current_start
        previous_start = previous_end - duration
    elif date_range == "today":
        current_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        current_end = now
        previous_start = current_start - timedelta(days=1)
        previous_end = current_start
    elif date_range == "week":
        # Start of current week (Monday)
        days_since_monday = now.weekday()
        current_start = (now - timedelta(days=days_since_monday)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        current_end = now
        previous_start = current_start - timedelta(weeks=1)
        previous_end = current_start
    elif date_range == "month":
        # Start of current month
        current_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        current_end = now
        if current_start.month == 1:
            previous_start = current_start.replace(
                year=current_start.year - 1, month=12
            )
        else:
            previous_start = current_start.replace(month=current_start.month - 1)
        previous_end = current_start
    elif date_range == "year":
        # Start of current year
        current_start = now.replace(
            month=1, day=1, hour=0, minute=0, second=0, microsecond=0
        )
        current_end = now
        previous_start = current_start.replace(year=current_start.year - 1)
        previous_end = current_start
    else:
        # Default to month
        current_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        current_end = now
        previous_start = current_start.replace(month=current_start.month - 1)
        previous_end = current_start

    return current_start, current_end, previous_start, previous_end


def get_transaction_stats_for_period(property_ids, start_date, end_date):
    """
    Get transaction statistics for a specific period
    """
    # Base query for transactions in the period
    base_query = g.session.query(Transaction).filter(
        Transaction.property_id.in_(property_ids),
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date,
        Transaction.payment_status == "paid",
    )

    # Total statistics
    total_stats = base_query.with_entities(
        func.count(Transaction.id).label("total_transactions"),
        func.coalesce(func.sum(Transaction.amount), 0).label("total_balance"),
    ).first()

    # Statistics by payment purpose
    purpose_stats = (
        base_query.with_entities(
            Transaction.payment_purpose,
            func.count(Transaction.id).label("count"),
            func.coalesce(func.sum(Transaction.amount), 0).label("amount"),
        )
        .group_by(Transaction.payment_purpose)
        .all()
    )

    # Convert to dictionary
    purpose_dict = {
        str(stat.payment_purpose): {"count": stat.count, "amount": float(stat.amount)}
        for stat in purpose_stats
    }

    # Daily trend data for the period
    daily_stats = (
        base_query.with_entities(
            func.date(Transaction.transaction_date).label("date"),
            func.count(Transaction.id).label("count"),
            func.coalesce(func.sum(Transaction.amount), 0).label("amount"),
        )
        .group_by(func.date(Transaction.transaction_date))
        .order_by("date")
        .all()
    )

    trend_data = [
        {
            "date": stat.date.isoformat() if stat.date else "",
            "count": stat.count,
            "amount": float(stat.amount),
        }
        for stat in daily_stats
    ]

    return {
        "total_balance": (
            float(total_stats.total_balance) if total_stats.total_balance else 0
        ),
        "total_transactions": total_stats.total_transactions or 0,
        "rent_payments": purpose_dict.get(
            "PaymentPurpose.RENT", {"count": 0, "amount": 0}
        )["count"],
        "rent_amount": purpose_dict.get(
            "PaymentPurpose.RENT", {"count": 0, "amount": 0}
        )["amount"],
        "screening_payments": purpose_dict.get(
            "PaymentPurpose.SCREENING", {"count": 0, "amount": 0}
        )["count"],
        "screening_amount": purpose_dict.get(
            "PaymentPurpose.SCREENING", {"count": 0, "amount": 0}
        )["amount"],
        "average_transaction": (
            float(total_stats.total_balance / total_stats.total_transactions)
            if total_stats.total_transactions > 0
            else 0
        ),
        "trend_data": trend_data,
    }


def calculate_stat_changes(current, previous):
    """
    Calculate percentage changes between current and previous period statistics
    """

    def calculate_change(current_val, previous_val):
        if previous_val == 0:
            if current_val > 0:
                return {"change": 100, "trend": "up"}
            return {"change": 0, "trend": "neutral"}

        change = ((current_val - previous_val) / previous_val) * 100
        trend = "up" if change > 0 else "down" if change < 0 else "neutral"
        return {"change": round(change, 2), "trend": trend}

    return {
        "total_balance": calculate_change(
            current["total_balance"], previous["total_balance"]
        ),
        "total_transactions": calculate_change(
            current["total_transactions"], previous["total_transactions"]
        ),
        "rent_payments": calculate_change(
            current["rent_payments"], previous["rent_payments"]
        ),
        "screening_payments": calculate_change(
            current["screening_payments"], previous["screening_payments"]
        ),
        "average_transaction": calculate_change(
            current["average_transaction"], previous["average_transaction"]
        ),
    }


def get_application_stats_for_period(property_ids, start_date, end_date):
    """
    Get application statistics for a specific period
    """
    # Base query for applications in the period
    base_query = g.session.query(Application).filter(
        Application.property_id.in_(property_ids),
        Application.created_at >= start_date,
        Application.created_at <= end_date,
    )

    # Get all applications for the period
    applications = base_query.all()

    # Calculate statistics by status
    status_counts = {
        "total": len(applications),
        "received": 0,
        "accepted": 0,
        "rejected": 0,
        "screening": 0,
        "under_review": 0,
        "tour_scheduled": 0,
    }

    # Count applications by status
    for app in applications:
        if app.status in status_counts:
            status_counts[app.status] += 1
        elif "screening" in app.status.lower():
            status_counts["screening"] += 1

    # Daily trend data
    daily_stats = (
        base_query.with_entities(
            func.date(Application.created_at).label("date"),
            func.count(Application.id).label("count"),
        )
        .group_by(func.date(Application.created_at))
        .order_by("date")
        .all()
    )

    trend_data = [
        {"date": stat.date.isoformat() if stat.date else "", "count": stat.count}
        for stat in daily_stats
    ]

    # Recent applications (last 5)
    recent_applications = (
        base_query.order_by(desc(Application.created_at)).limit(5).all()
    )
    recent_data = [
        {
            "id": app.id,
            "tenant_id": app.tenant_id,
            "property_id": app.property_id,
            "status": app.status,
            "created_at": app.created_at.isoformat() if app.created_at else None,
        }
        for app in recent_applications
    ]

    status_counts["trend_data"] = trend_data
    status_counts["recent_applications"] = recent_data

    return status_counts


def calculate_application_changes(current, previous):
    """
    Calculate percentage changes between current and previous period application statistics
    """

    def calculate_change(current_val, previous_val):
        if previous_val == 0:
            if current_val > 0:
                return {"change": 100, "trend": "up"}
            return {"change": 0, "trend": "neutral"}

        change = ((current_val - previous_val) / previous_val) * 100
        trend = "up" if change > 0 else "down" if change < 0 else "neutral"
        return {"change": round(change, 2), "trend": trend}

    return {
        "total": calculate_change(current["total"], previous["total"]),
        "pending": calculate_change(current["pending"], previous["pending"]),
        "approved": calculate_change(current["approved"], previous["approved"]),
        "rejected": calculate_change(current["rejected"], previous["rejected"]),
        "screening": calculate_change(current["screening"], previous["screening"]),
        "received": calculate_change(current["received"], previous["received"]),
    }


def get_property_views_stats_for_period(property_ids, start_date, end_date):
    """
    Get property views statistics for a specific period
    """
    # Base query for views in the period
    base_query = g.session.query(PropertyView).filter(
        PropertyView.property_id.in_(property_ids),
        PropertyView.viewed_at >= start_date,
        PropertyView.viewed_at <= end_date,
    )

    # Total views and unique viewers
    total_views = base_query.count()
    unique_viewers = (
        base_query.with_entities(
            func.count(func.distinct(PropertyView.user_id))
        ).scalar()
        or 0
    )

    # Views by property
    property_views = (
        base_query.with_entities(
            PropertyView.property_id,
            Property.name,
            func.count(PropertyView.id).label("view_count"),
        )
        .join(Property, PropertyView.property_id == Property.id)
        .group_by(PropertyView.property_id, Property.name)
        .order_by(desc("view_count"))
        .all()
    )

    # logging.info("Property Views", property_views)

    top_properties = [
        {"property_id": pv.property_id, "name": pv.name, "view_count": pv.view_count}
        for pv in property_views[:10]  # Top 10
    ]

    # Daily trend data
    daily_stats = (
        base_query.with_entities(
            func.date(PropertyView.viewed_at).label("date"),
            func.count(PropertyView.id).label("count"),
            func.count(func.distinct(PropertyView.user_id)).label("unique_viewers"),
        )
        .group_by(func.date(PropertyView.viewed_at))
        .order_by("date")
        .all()
    )

    trend_data = [
        {
            "date": stat.date.isoformat() if stat.date else "",
            "views": stat.count,
            "unique_viewers": stat.unique_viewers,
        }
        for stat in daily_stats
    ]

    # Anonymous vs registered viewer ratio
    anonymous_views = base_query.filter(PropertyView.user_id.is_(None)).count()
    registered_views = total_views - anonymous_views

    return {
        "total_views": total_views,
        "unique_viewers": unique_viewers,
        "anonymous_views": anonymous_views,
        "registered_views": registered_views,
        "average_views_per_property": (
            round(total_views / len(property_ids), 2) if property_ids else 0
        ),
        "top_properties": top_properties,
        "trend_data": trend_data,
    }


def calculate_views_changes(current, previous):
    """
    Calculate percentage changes between current and previous period view statistics
    """

    def calculate_change(current_val, previous_val):
        if previous_val == 0:
            if current_val > 0:
                return {"change": 100, "trend": "up"}
            return {"change": 0, "trend": "neutral"}

        change = ((current_val - previous_val) / previous_val) * 100
        trend = "up" if change > 0 else "down" if change < 0 else "neutral"
        return {"change": round(change, 2), "trend": trend}

    return {
        "total_views": calculate_change(
            current["total_views"], previous["total_views"]
        ),
        "unique_viewers": calculate_change(
            current["unique_viewers"], previous["unique_viewers"]
        ),
        "anonymous_views": calculate_change(
            current["anonymous_views"], previous["anonymous_views"]
        ),
        "registered_views": calculate_change(
            current["registered_views"], previous["registered_views"]
        ),
        "average_views_per_property": calculate_change(
            current["average_views_per_property"],
            previous["average_views_per_property"],
        ),
    }


# ======================================================
# RECENT ACTIVITIES ROUTES FOR LANDLORDS
# Handles fetching recent activities for dashboard
# ======================================================


@landlord.route("/activities/recent", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_recent_activities_landlord():
    """
    Get recent activities for the current landlord
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
            RecentActivity.user_role == "landlord",
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
                get_time_ago_landlord(activity.created_at)
                if activity.created_at
                else "Unknown"
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


def get_time_ago_landlord(created_at):
    """
    Helper function to get human-readable time difference for landlords
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


# ======================================================
# MAINTENANCE REQUEST ROUTES FOR LANDLORDS
# Handles maintenance request management
# ======================================================


@landlord.route("/maintenance", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("landlord")
def create_maintenance_request():
    """
    Create a new maintenance request
    """
    from ..models import MaintenanceRequest, MaintenancePriority, MaintenanceStatus

    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Validate required fields
    required_fields = ["property_id", "title", "description"]
    for field in required_fields:
        if not data.get(field):
            raise CustomRequestError(f"{field} is required")

    # Verify property belongs to landlord
    property = get_item_by_filter(Property, id=data["property_id"], landlord_id=user_id)
    if not property:
        raise CustomRequestError("Property not found or access denied", 404)

    # Create maintenance request
    maintenance_data = {
        "property_id": data["property_id"],
        "landlord_id": user_id,
        "tenant_id": data.get("tenant_id"),
        "title": data["title"],
        "description": data["description"],
        "priority": MaintenancePriority[data.get("priority", "MEDIUM").upper()],
        "status": MaintenanceStatus.PENDING,
        "scheduled_date": data.get("scheduled_date"),
        "notes": data.get("notes"),
    }

    maintenance_request = create_item(MaintenanceRequest, **maintenance_data)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="maintenance_created",
        activity_description=f"Created maintenance request: {data['title']}",
        related_entity_type="maintenance_request",
        related_entity_id=maintenance_request.id,
    )

    logging.info(
        f"Maintenance request {maintenance_request.id} created by landlord {user_id}"
    )
    return response(
        "Maintenance request created successfully", maintenance_request.to_dict(), 201
    )


@landlord.route("/maintenance", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_maintenance_requests():
    """
    Get all maintenance requests for landlord's properties
    Query params:
    - status: filter by status (pending, in_progress, completed, cancelled)
    - priority: filter by priority (low, medium, high, urgent)
    - property_id: filter by specific property
    - page: page number (default: 1)
    - per_page: items per page (default: 20)
    """
    from ..models import MaintenanceRequest

    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    status = request.args.get("status")
    priority = request.args.get("priority")
    property_id = request.args.get("property_id")
    page = int(request.args.get("page", 1))
    per_page = min(int(request.args.get("per_page", 20)), 100)

    # Build query
    query = g.session.query(MaintenanceRequest).filter(
        MaintenanceRequest.landlord_id == user_id
    )

    if status:
        query = query.filter(MaintenanceRequest.status == status)
    if priority:
        query = query.filter(MaintenanceRequest.priority == priority)
    if property_id:
        query = query.filter(MaintenanceRequest.property_id == property_id)

    # Get total count
    total = query.count()

    # Paginate
    requests = (
        query.order_by(MaintenanceRequest.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return response(
        "Maintenance requests retrieved successfully",
        {
            "requests": [req.to_dict() for req in requests],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": (total + per_page - 1) // per_page,
            },
        },
    )


@landlord.route("/maintenance/<request_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_maintenance_request(request_id):
    """
    Get a specific maintenance request
    """
    from ..models import MaintenanceRequest

    user_id, _, _ = get_logged_in_user()

    maintenance = get_item_by_filter(
        MaintenanceRequest, id=request_id, landlord_id=user_id
    )
    if not maintenance:
        raise CustomRequestError("Maintenance request not found", 404)

    return response("Maintenance request retrieved successfully", maintenance.to_dict())


@landlord.route("/maintenance/<request_id>", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("landlord")
def update_maintenance_request(request_id):
    """
    Update a maintenance request
    """
    from ..models import MaintenanceRequest, MaintenancePriority, MaintenanceStatus

    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    maintenance = get_item_by_filter(
        MaintenanceRequest, id=request_id, landlord_id=user_id
    )
    if not maintenance:
        raise CustomRequestError("Maintenance request not found", 404)

    # Update fields
    update_data = {}
    if "title" in data:
        update_data["title"] = data["title"]
    if "description" in data:
        update_data["description"] = data["description"]
    if "priority" in data:
        update_data["priority"] = MaintenancePriority[data["priority"].upper()]
    if "status" in data:
        update_data["status"] = MaintenanceStatus[data["status"].upper()]
        if data["status"].upper() == "COMPLETED":
            update_data["completed_date"] = datetime.now()
    if "scheduled_date" in data:
        update_data["scheduled_date"] = data["scheduled_date"]
    if "cost" in data:
        update_data["cost"] = data["cost"]
    if "notes" in data:
        update_data["notes"] = data["notes"]

    updated_maintenance = update_item(MaintenanceRequest, request_id, **update_data)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="maintenance_updated",
        activity_description=f"Updated maintenance request: {updated_maintenance.title}",
        related_entity_type="maintenance_request",
        related_entity_id=request_id,
    )

    return response(
        "Maintenance request updated successfully", updated_maintenance.to_dict()
    )


@landlord.route("/maintenance/<request_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("landlord")
def delete_maintenance_request(request_id):
    """
    Delete a maintenance request
    """
    from ..models import MaintenanceRequest

    user_id, _, _ = get_logged_in_user()

    maintenance = get_item_by_filter(
        MaintenanceRequest, id=request_id, landlord_id=user_id
    )
    if not maintenance:
        raise CustomRequestError("Maintenance request not found", 404)

    delete_item(MaintenanceRequest, request_id)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="maintenance_deleted",
        activity_description=f"Deleted maintenance request: {maintenance.title}",
        related_entity_type="maintenance_request",
        related_entity_id=request_id,
    )

    return response("Maintenance request deleted successfully", {})


@landlord.route("/maintenance/statistics", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_maintenance_statistics():
    """
    Get maintenance request statistics for landlord
    """
    from ..models import MaintenanceRequest

    user_id, _, _ = get_logged_in_user()

    # Get all maintenance requests
    requests = (
        g.session.query(MaintenanceRequest)
        .filter(MaintenanceRequest.landlord_id == user_id)
        .all()
    )

    # Calculate statistics
    stats = {
        "total": len(requests),
        "pending": sum(1 for r in requests if r.status.value == "pending"),
        "in_progress": sum(1 for r in requests if r.status.value == "in_progress"),
        "completed": sum(1 for r in requests if r.status.value == "completed"),
        "cancelled": sum(1 for r in requests if r.status.value == "cancelled"),
        "by_priority": {
            "low": sum(1 for r in requests if r.priority.value == "low"),
            "medium": sum(1 for r in requests if r.priority.value == "medium"),
            "high": sum(1 for r in requests if r.priority.value == "high"),
            "urgent": sum(1 for r in requests if r.priority.value == "urgent"),
        },
    }

    return response("Maintenance statistics retrieved successfully", stats)


# ======================================================
# INSPECTION ROUTES FOR LANDLORDS
# Handles property inspection management
# ======================================================


@landlord.route("/inspections", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("landlord")
def create_inspection():
    """
    Create a new property inspection
    """
    from ..models import Inspection, InspectionType, InspectionStatus

    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Validate required fields
    required_fields = [
        "property_id",
        "inspection_type",
        "scheduled_date",
        "scheduled_time",
    ]
    for field in required_fields:
        if not data.get(field):
            raise CustomRequestError(f"{field} is required")

    # Verify property belongs to landlord
    property = get_item_by_filter(Property, id=data["property_id"], landlord_id=user_id)
    if not property:
        raise CustomRequestError("Property not found or access denied", 404)

    # Create inspection
    inspection_data = {
        "property_id": data["property_id"],
        "landlord_id": user_id,
        "tenant_id": data.get("tenant_id"),
        "inspection_type": InspectionType[data["inspection_type"].upper()],
        "status": InspectionStatus.SCHEDULED,
        "inspector_name": data.get("inspector_name"),
        "scheduled_date": data["scheduled_date"],
        "scheduled_time": data["scheduled_time"],
        "notes": data.get("notes"),
    }

    inspection = create_item(Inspection, **inspection_data)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="inspection_scheduled",
        activity_description=f"Scheduled {data['inspection_type']} inspection",
        related_entity_type="inspection",
        related_entity_id=inspection.id,
    )

    logging.info(f"Inspection {inspection.id} created by landlord {user_id}")
    return response("Inspection scheduled successfully", inspection.to_dict(), 201)


@landlord.route("/inspections", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_inspections():
    """
    Get all inspections for landlord's properties
    Query params:
    - status: filter by status
    - type: filter by inspection type
    - property_id: filter by specific property
    - upcoming: if true, only show future inspections
    - page: page number (default: 1)
    - per_page: items per page (default: 20)
    """
    from ..models import Inspection

    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    status = request.args.get("status")
    inspection_type = request.args.get("type")
    property_id = request.args.get("property_id")
    upcoming = request.args.get("upcoming", "false").lower() == "true"
    page = int(request.args.get("page", 1))
    per_page = min(int(request.args.get("per_page", 20)), 100)

    # Build query
    query = g.session.query(Inspection).filter(Inspection.landlord_id == user_id)

    if status:
        query = query.filter(Inspection.status == status)
    if inspection_type:
        query = query.filter(Inspection.inspection_type == inspection_type)
    if property_id:
        query = query.filter(Inspection.property_id == property_id)
    if upcoming:
        query = query.filter(Inspection.scheduled_date >= datetime.now())

    # Get total count
    total = query.count()

    # Paginate
    inspections = (
        query.order_by(Inspection.scheduled_date.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return response(
        "Inspections retrieved successfully",
        {
            "inspections": [inspection.to_dict() for inspection in inspections],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": (total + per_page - 1) // per_page,
            },
        },
    )


@landlord.route("/inspections/<inspection_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_inspection(inspection_id):
    """
    Get a specific inspection
    """
    from ..models import Inspection

    user_id, _, _ = get_logged_in_user()

    inspection = get_item_by_filter(Inspection, id=inspection_id, landlord_id=user_id)
    if not inspection:
        raise CustomRequestError("Inspection not found", 404)

    return response("Inspection retrieved successfully", inspection.to_dict())


@landlord.route("/inspections/<inspection_id>", methods=["PUT"])
@catch_exception
@jwt_required()
@role_required("landlord")
def update_inspection(inspection_id):
    """
    Update an inspection
    """
    from ..models import Inspection, InspectionType, InspectionStatus

    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    inspection = get_item_by_filter(Inspection, id=inspection_id, landlord_id=user_id)
    if not inspection:
        raise CustomRequestError("Inspection not found", 404)

    # Update fields
    update_data = {}
    if "inspection_type" in data:
        update_data["inspection_type"] = InspectionType[data["inspection_type"].upper()]
    if "status" in data:
        update_data["status"] = InspectionStatus[data["status"].upper()]
        if data["status"].upper() == "COMPLETED":
            update_data["completed_date"] = datetime.now()
    if "inspector_name" in data:
        update_data["inspector_name"] = data["inspector_name"]
    if "scheduled_date" in data:
        update_data["scheduled_date"] = data["scheduled_date"]
    if "scheduled_time" in data:
        update_data["scheduled_time"] = data["scheduled_time"]
    if "findings" in data:
        update_data["findings"] = data["findings"]
    if "notes" in data:
        update_data["notes"] = data["notes"]

    updated_inspection = update_item(Inspection, inspection_id, **update_data)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="inspection_updated",
        activity_description=f"Updated inspection for property",
        related_entity_type="inspection",
        related_entity_id=inspection_id,
    )

    return response("Inspection updated successfully", updated_inspection.to_dict())


@landlord.route("/inspections/<inspection_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("landlord")
def delete_inspection(inspection_id):
    """
    Delete an inspection
    """
    from ..models import Inspection

    user_id, _, _ = get_logged_in_user()

    inspection = get_item_by_filter(Inspection, id=inspection_id, landlord_id=user_id)
    if not inspection:
        raise CustomRequestError("Inspection not found", 404)

    delete_item(Inspection, inspection_id)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="inspection_deleted",
        activity_description=f"Deleted inspection",
        related_entity_type="inspection",
        related_entity_id=inspection_id,
    )

    return response("Inspection deleted successfully", {})


@landlord.route("/inspections/statistics", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_inspection_statistics():
    """
    Get inspection statistics for landlord
    """
    from ..models import Inspection

    user_id, _, _ = get_logged_in_user()

    # Get all inspections
    inspections = (
        g.session.query(Inspection).filter(Inspection.landlord_id == user_id).all()
    )

    # Calculate upcoming inspections (next 7 days)
    now = datetime.now()
    next_week = now + timedelta(days=7)
    upcoming = sum(
        1
        for i in inspections
        if i.scheduled_date
        and now <= i.scheduled_date <= next_week
        and i.status.value == "scheduled"
    )

    # Calculate statistics
    stats = {
        "total": len(inspections),
        "scheduled": sum(1 for i in inspections if i.status.value == "scheduled"),
        "in_progress": sum(1 for i in inspections if i.status.value == "in_progress"),
        "completed": sum(1 for i in inspections if i.status.value == "completed"),
        "cancelled": sum(1 for i in inspections if i.status.value == "cancelled"),
        "upcoming": upcoming,
        "by_type": {
            "move_in": sum(
                1 for i in inspections if i.inspection_type.value == "move_in"
            ),
            "move_out": sum(
                1 for i in inspections if i.inspection_type.value == "move_out"
            ),
            "routine": sum(
                1 for i in inspections if i.inspection_type.value == "routine"
            ),
            "maintenance": sum(
                1 for i in inspections if i.inspection_type.value == "maintenance"
            ),
        },
    }

    return response("Inspection statistics retrieved successfully", stats)


# ======================================================
# REPORT ROUTES FOR LANDLORDS
# Handles report generation and management
# ======================================================


@landlord.route("/reports", methods=["POST"])
@catch_exception
@jwt_required()
@role_required("landlord")
def generate_report():
    """
    Generate a new report
    """
    from ..models import Report, ReportType, ReportStatus

    user_id, _, _ = get_logged_in_user()
    data = request.get_json()

    # Validate required fields
    required_fields = ["report_type", "date_range_start", "date_range_end"]
    for field in required_fields:
        if not data.get(field):
            raise CustomRequestError(f"{field} is required")

    # Create report
    report_data = {
        "landlord_id": user_id,
        "report_type": ReportType[data["report_type"].upper()],
        "status": ReportStatus.PENDING,
        "title": data.get("title", f"{data['report_type'].title()} Report"),
        "date_range_start": data["date_range_start"],
        "date_range_end": data["date_range_end"],
        "parameters": data.get("parameters", {}),
        "file_format": data.get("file_format", "pdf"),
    }

    report = create_item(Report, **report_data)

    # TODO: Add background job to generate report
    # For now, we'll just mark it as completed with empty data
    update_item(
        Report,
        report.id,
        status=ReportStatus.COMPLETED,
        generated_at=datetime.now(),
        data={"message": "Report generation will be implemented"},
    )

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="report_generated",
        activity_description=f"Generated {data['report_type']} report",
        related_entity_type="report",
        related_entity_id=report.id,
    )

    logging.info(f"Report {report.id} created by landlord {user_id}")
    return response("Report generation initiated", report.to_dict(), 201)


@landlord.route("/reports", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_reports():
    """
    Get all reports for landlord
    Query params:
    - report_type: filter by report type
    - status: filter by status
    - page: page number (default: 1)
    - per_page: items per page (default: 20)
    """
    from ..models import Report

    user_id, _, _ = get_logged_in_user()

    # Get query parameters
    report_type = request.args.get("report_type")
    status = request.args.get("status")
    page = int(request.args.get("page", 1))
    per_page = min(int(request.args.get("per_page", 20)), 100)

    # Build query
    query = g.session.query(Report).filter(Report.landlord_id == user_id)

    if report_type:
        query = query.filter(Report.report_type == report_type)
    if status:
        query = query.filter(Report.status == status)

    # Get total count
    total = query.count()

    # Paginate
    reports = (
        query.order_by(Report.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return response(
        "Reports retrieved successfully",
        {
            "reports": [report.to_dict() for report in reports],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": (total + per_page - 1) // per_page,
            },
        },
    )


@landlord.route("/reports/<report_id>", methods=["GET"])
@catch_exception
@jwt_required()
@role_required("landlord")
def get_report(report_id):
    """
    Get a specific report
    """
    from ..models import Report

    user_id, _, _ = get_logged_in_user()

    report = get_item_by_filter(Report, id=report_id, landlord_id=user_id)
    if not report:
        raise CustomRequestError("Report not found", 404)

    return response("Report retrieved successfully", report.to_dict())


@landlord.route("/reports/<report_id>", methods=["DELETE"])
@catch_exception
@jwt_required()
@role_required("landlord")
def delete_report(report_id):
    """
    Delete a report
    """
    from ..models import Report

    user_id, _, _ = get_logged_in_user()

    report = get_item_by_filter(Report, id=report_id, landlord_id=user_id)
    if not report:
        raise CustomRequestError("Report not found", 404)

    delete_item(Report, report_id)

    # Log activity
    ActivityLogger.log_activity(
        user_id=user_id,
        user_role="landlord",
        activity_type="report_deleted",
        activity_description=f"Deleted {report.report_type.value} report",
        related_entity_type="report",
        related_entity_id=report_id,
    )

    return response("Report deleted successfully", {})
