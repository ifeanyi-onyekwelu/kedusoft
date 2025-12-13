from flask import Blueprint, g, request
from flask_jwt_extended import jwt_required
from ..models import (
    Category,
    Property,
    Review,
    PropertyView,
    LikedProperty,
    SearchHistory,
)
from ..utils.helpers import response, serialize, get_logged_in_user
from ..utils.errors import catch_exception, CustomRequestError
from ..models.db_utils import (
    get_all_items,
    get_item_by_id,
    get_items_by_filter,
    create_item,
    count_items_by_filter,
)
from sqlalchemy.orm import joinedload
from sqlalchemy import or_, func, and_, desc
from datetime import datetime
from geopy.distance import geodesic
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

public = Blueprint("public", __name__)


@public.route("/categories", methods=["GET"])
@catch_exception
def get_all_categories():
    """Fetches all categories with property count for each"""
    categories = get_all_items(g.session, Category)

    categories_with_counts = []
    for category in categories:
        # Count properties in this category that are available using the helper function
        property_count = count_items_by_filter(
            g.session,
            Property,
            filters={
                "deleted": False,
                "is_available": True,
                "category_id": category.id,
            },
        )
        logger.info("Counts", property_count)

        categories_with_counts.append(
            {**serialize(category), "property_count": property_count}
        )

    return response("Categories fetched successfully", categories_with_counts)


@public.route("/categories/<string:category_id>/properties", methods=["GET"])
@catch_exception
def get_all_category_properties(category_id):
    """Fetches all properties under this category"""
    category = get_item_by_id(g.session, Category, category_id)
    if not category:
        raise CustomRequestError("Category not found", 404)

    filters = {
        "is_verified": "true",
        "deleted": False,
        "is_available": True,
    }

    properties = get_items_by_filter(g.session, Property, filters)

    serialized_properties = serialize(properties)

    return response(
        "Properties retrieved successfully!", {"properties": serialized_properties}
    )


@public.route("/properties", methods=["GET"])
@catch_exception
def get_all_properties():
    """
    Enhanced property fetching with map bounds filtering
    Supports geospatial queries for map integration
    """
    try:
        # Base filters
        filters = {
            # "is_verified": "true",
            "deleted": False,
            "is_available": True,
        }

        # Get query parameters
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 50, type=int), 100)

        # Map bounds filtering for interactive map
        north = request.args.get("north", type=float)
        south = request.args.get("south", type=float)
        east = request.args.get("east", type=float)
        west = request.args.get("west", type=float)

        # Location-based filtering
        city = request.args.get("city")
        state = request.args.get("state")
        area = request.args.get("area")

        # Price filtering
        min_price = request.args.get("min_price", type=float)
        max_price = request.args.get("max_price", type=float)

        # Property type filtering
        bedrooms = request.args.get("bedrooms", type=int)
        listing_type = request.args.get("listing_type")
        category = request.args.get("category")

        # Build query
        query = g.session.query(Property).filter_by(**filters)

        # Apply map bounds filtering if provided
        if all([north, south, east, west]):
            query = query.filter(
                Property.latitude.between(south, north),
                Property.longitude.between(west, east),
                Property.latitude.isnot(None),
                Property.longitude.isnot(None),
            )

        # Apply location filters
        if city:
            query = query.filter(Property.city.ilike(f"%{city}%"))
        if state:
            query = query.filter(Property.state.ilike(f"%{state}%"))
        if area:
            query = query.filter(Property.area.ilike(f"%{area}%"))

        # Apply price filters
        if min_price:
            query = query.filter(Property.rent_amount >= min_price)
        if max_price:
            query = query.filter(Property.rent_amount <= max_price)

        # Apply property filters
        if bedrooms:
            query = query.filter(Property.bedrooms == bedrooms)
        if listing_type:
            query = query.filter(Property.listing_type == listing_type)
        if category:
            query = query.join(Category).filter(Category.name.ilike(f"%{category}%"))

        # Execute query with pagination
        total_count = query.count()
        properties = query.offset((page - 1) * per_page).limit(per_page).all()

        # Serialize properties with map data
        serialized_properties = []
        for prop in properties:
            prop_data = serialize(prop)
            # Ensure map coordinates are included
            if hasattr(prop, "latitude") and hasattr(prop, "longitude"):
                prop_data["map_coordinates"] = {
                    "lat": prop.latitude,
                    "lng": prop.longitude,
                }
            serialized_properties.append(prop_data)

        response_data = {
            "properties": serialized_properties,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total_count,
                "pages": (total_count + per_page - 1) // per_page,
            },
            "map_bounds": (
                {"north": north, "south": south, "east": east, "west": west}
                if all([north, south, east, west])
                else None
            ),
            "filters_applied": {
                "city": city,
                "state": state,
                "area": area,
                "min_price": min_price,
                "max_price": max_price,
                "bedrooms": bedrooms,
                "listing_type": listing_type,
                "category": category,
            },
        }

        return response("Properties retrieved successfully!", response_data)

    except Exception as e:
        logger.error(f"Failed to retrieve properties: {str(e)}")
        raise CustomRequestError("Failed to retrieve properties", 500)


@public.route("/properties/<string:property_id>", methods=["GET"])
@catch_exception
def get_property(property_id):
    """Fetches a property by its ID with related data"""
    filters = {
        # "is_verified": "true",
        "deleted": False,
    }

    # Get property with relationships loaded
    property = (
        g.session.query(Property)
        .options(
            joinedload(Property.landlord),
            joinedload(Property.category),
            joinedload(Property.reviews).joinedload(Review.user),
        )
        .filter_by(id=property_id, **filters)
        .first()
    )

    if not property:
        raise CustomRequestError("Property not found", 404)

    data = {
        "property_id": property_id,
        "user_id": None,
        "ip_address": request.remote_addr,
        "user_agent": request.headers.get("User-Agent"),
    }

    new_view = create_item(g.session, PropertyView, data)
    property_views = get_items_by_filter(
        g.session, PropertyView, {"property_id": property_id}
    )

    # Build the response data structure
    result = {
        **serialize(property),
        "category": {"id": property.category.id, "name": property.category.name},
        "landlord": {
            "id": property.landlord.id,
            "firstName": property.landlord.firstName,
            "lastName": property.landlord.lastName,
            "phone_number": property.landlord.phone_number,
            "email": property.landlord.email,
            "profile_picture": property.landlord.profile_picture,
            "joined_at": property.landlord.joined_at,
            "last_active": property.landlord.last_successful_login,
        },
        "reviews": [
            {
                "review_id": review.review_id,
                "rating": review.rating,
                "feedback": review.feedback,
                "date": review.date.isoformat(),
                "user": {
                    "id": review.user.id,
                    "firstName": review.user.firstName,
                    "lastName": review.user.lastName,
                    "profile_picture": review.user.profile_picture,
                },
            }
            for review in property.reviews
            if review.is_deleted == 0
        ],
        "views": len(property_views),
        "new_view": serialize(new_view),
    }

    return response("Property retrieved successfully", result)


@public.route("/properties/map-bounds", methods=["GET"])
@catch_exception
def get_properties_in_bounds():
    """
    Get properties within specific map bounds for real-time map updates
    Used when user pans/zooms the map
    """
    try:
        # Required map bounds parameters
        north = request.args.get("north", type=float)
        south = request.args.get("south", type=float)
        east = request.args.get("east", type=float)
        west = request.args.get("west", type=float)

        if not all([north, south, east, west]):
            raise CustomRequestError(
                "Map bounds required: north, south, east, west parameters", 400
            )

        # Optional filters
        min_price = request.args.get("min_price", type=float)
        max_price = request.args.get("max_price", type=float)
        bedrooms = request.args.get("bedrooms", type=int)
        property_type = request.args.get("type")

        # Base query with bounds filtering
        query = g.session.query(Property).filter(
            Property.verification_status == "approved",
            Property.deleted == False,
            Property.is_available == True,
            Property.latitude.between(south, north),
            Property.longitude.between(west, east),
            Property.latitude.isnot(None),
            Property.longitude.isnot(None),
        )

        # Apply additional filters
        if min_price:
            query = query.filter(Property.price >= min_price)
        if max_price:
            query = query.filter(Property.price <= max_price)
        if bedrooms:
            query = query.filter(Property.bedrooms == bedrooms)
        if property_type:
            query = query.filter(Property.listing_type == property_type)

        # Limit results for performance (maps typically show 100-500 markers max)
        properties = query.limit(500).all()

        # Return minimal data for map markers
        map_markers = []
        for prop in properties:
            map_markers.append(
                {
                    "id": prop.id,
                    "latitude": prop.latitude,
                    "longitude": prop.longitude,
                    "price": prop.price,
                    "bedrooms": prop.bedrooms,
                    "bathrooms": prop.bathrooms,
                    "title": prop.name,
                    "image": prop.gallery[0] if prop.gallery else None,
                    "listing_type": prop.listing_type,
                    "area": prop.area,
                }
            )

        return response(
            "Map properties retrieved successfully",
            {
                "markers": map_markers,
                "count": len(map_markers),
                "bounds": {"north": north, "south": south, "east": east, "west": west},
            },
        )

    except Exception as e:
        logger.error(f"Failed to retrieve map properties: {str(e)}")
        if isinstance(e, CustomRequestError):
            raise
        raise CustomRequestError("Failed to retrieve map properties", 500)


@public.route("/properties/featured", methods=["GET"])
@catch_exception
def get_featured_properties():
    """Returns 3 featured properties with proper sorting"""
    featured = (
        g.session.query(Property)
        .filter(
            Property.is_featured == True,
            Property.verification_status == "approved",
            Property.deleted == False,
            or_(
                Property.featured_until == None,
                Property.featured_until > datetime.now(),
            ),
        )
        .order_by(Property.featured_priority.desc())
        .limit(3)
        .all()
    )
    return response("Featured properties", {"properties": serialize(featured)})


@public.route("/properties/latest", methods=["GET"])
@catch_exception
def get_latest_properties():
    """Returns 6 latest property listings ordered by creation date"""

    latest = get_items_by_filter(
        g.session,
        Property,
        {
            # "verification_status": "approved",
            "deleted": False,
            "is_available": True,
        },
        order_by="created_at.desc()",
        limit=6,
    )

    # Serialize properties with additional metadata
    serialized_properties = []
    for prop in latest:
        prop_data = serialize(prop)
        # Include property views count
        property_views = get_items_by_filter(
            g.session, PropertyView, {"property_id": prop.id}
        )
        prop_data["views_count"] = len(property_views)
        serialized_properties.append(prop_data)

    return response("Latest properties", {"properties": serialized_properties})


@public.route("/cities", methods=["GET"])
@catch_exception
def get_cities_with_properties():
    """Fetches all cities with property count for each"""

    # Get all unique cities with available properties
    cities_query = (
        g.session.query(Property.city, func.count(Property.id).label("property_count"))
        .filter(Property.deleted == False, Property.is_available == True)
        .group_by(Property.city)
        .order_by(func.count(Property.id).desc())
        .all()
    )

    # Format the response
    cities = [{"city": city, "property_count": count} for city, count in cities_query]

    return response(
        "Cities with properties retrieved successfully!", {"cities": cities}
    )


@public.route("/properties/search", methods=["GET"])
@catch_exception
def search_properties():
    """Search properties with filters"""
    filters = {
        "verification_status": "approved",
        "deleted": False,
    }
    # Get query params
    type_ = request.args.get("type")
    bedrooms = request.args.get("bedrooms")
    bathrooms = request.args.get("bathrooms")
    location = request.args.get("location")
    min_sqft = request.args.get("min_sqft")
    max_sqft = request.args.get("max_sqft")
    amenities = request.args.getlist(
        "amenities"
    )  # e.g. amenities=Parking&amenities=Gym

    # Add filters if present
    if type_ and type_ != "any":
        filters["type"] = type_
    if bedrooms and bedrooms != "any":
        filters["bedrooms"] = int(bedrooms)
    if bathrooms and bathrooms != "any":
        filters["bathrooms"] = int(bathrooms)
    if location:
        filters["address"] = location  # or use ilike for partial match
    # ...handle sqft and amenities as needed...

    # Query with filters
    properties = get_items_by_filter(g.session, Property, filters)
    # Optionally, filter further in Python for amenities, sqft, etc.

    serialized_properties = serialize(properties)
    return response(
        "Filtered properties retrieved!", {"properties": serialized_properties}
    )


@public.route("/properties/nearby", methods=["GET"])
@catch_exception
def get_nearby_properties():
    """
    Fetch properties within a certain radius of user's current location
    Query params: latitude, longitude, radius_km (default: 10km)
    """

    # Get user's current location from request
    latitude = float(request.args.get("latitude"))
    longitude = float(request.args.get("longitude"))
    radius_km = float(request.args.get("radius_km", 10))  # Default 10km radius

    # Get all properties from database
    filter = {
        "is_available": True,
        "deleted": False,
        "flagged": False,
    }
    all_properties = get_items_by_filter(g.session, Property, filter)

    nearby_properties = []
    user_location = (latitude, longitude)

    for property in all_properties:
        if hasattr(property, "latitude") and hasattr(property, "longitude"):
            property_location = (property.latitude, property.longitude)
            distance = geodesic(user_location, property_location).km

            if distance <= radius_km:
                nearby_properties.append(
                    {"property": property.to_dict(), "distance_km": round(distance, 2)}
                )

    # Sort by distance
    nearby_properties.sort(key=lambda x: x["distance_km"])

    return response(
        "Nearby properties fetched!",
        {
            "data": nearby_properties,
            "count": len(nearby_properties),
        },
    )


@public.route("/properties/state", methods=["GET"])
@catch_exception
def get_state_properties():
    """
    Fetch properties in the user's current state
    Query params: state (optional - if not provided, try to get from user profile)
    """
    _, user, _ = get_logged_in_user()
    state = request.args.get("state")

    if not state:
        # Try to get from authenticated user's profile
        # Assuming you have auth setup and user available
        if user.city:
            state = user.city
        else:
            raise CustomRequestError(
                "State not provided and not available in user profile", 400
            )

    filter = {
        "state": state,
        "is_available": True,
        "deleted": False,
        "is_verified": True,
        "flagged": False,
    }

    properties = get_items_by_filter(g.session, Property, filter)

    return response(
        "Fetched properties in user's current state",
        {"data": serialize(properties), "count": len(properties)},
    )


@public.route("/properties/recommended", methods=["GET"])
@jwt_required()
def get_recommended_properties():
    user_id, _, _ = get_logged_in_user()

    # Get user preferences from multiple sources
    recommendations = {
        "based_on_likes": get_recommendations_based_on_likes(user_id),
        "based_on_searches": get_recommendations_based_on_searches(user_id),
        "popular_in_your_area": get_popular_properties_in_area(user_id),
    }

    return response("Fetched recommended properties", {"data": recommendations})


# Functions to get recommendations
def get_recommendations_based_on_likes(user_id, limit=5):
    """Get recommendations based on properties user has liked"""
    # Get the properties user has liked
    liked_properties = get_items_by_filter(
        g.session,
        model=LikedProperty,
        filters={"tenant_id": user_id},
        order_by="date_liked.desc()",
        limit=10,
    )

    if not liked_properties:
        return []

    liked_ids = [lp.property_id for lp in liked_properties]

    # Get common features from liked properties
    liked_features = (
        g.session.query(
            Property.city,
            Property.state,
            func.avg(Property.rent_amount).label("avg_rent"),
            func.avg(Property.bedrooms).label("avg_bedrooms"),
        )
        .filter(Property.id.in_(liked_ids))
        .group_by(Property.city, Property.state, Property.property_type)
        .first()
    )

    # Find similar properties
    similar_properties = (
        g.session.query(Property)
        .filter(
            Property.id.notin_(liked_ids),
            Property.is_available == True,
            Property.deleted == False,
            or_(
                and_(
                    Property.city == liked_features.city,
                    Property.state == liked_features.state,
                ),
                Property.rent_amount.between(
                    liked_features.avg_rent * 0.7, liked_features.avg_rent * 1.3
                ),
                Property.bedrooms.between(
                    liked_features.avg_bedrooms - 1, liked_features.avg_bedrooms + 1
                ),
            ),
        )
        .order_by(func.random())
        .limit(limit)
        .all()
    )

    return [serialize(p) for p in similar_properties]


def get_recommendations_based_on_searches(user_id, limit=5):
    """Get recommendations based on user's search history"""
    # Get recent search queries
    recent_searches = get_items_by_filter(
        g.session,
        SearchHistory,
        filters={"user_id": user_id},
        order_by="created_at.desc()",
        limit=5,
    )

    if not recent_searches:
        return []

    # Extract common search terms (simplified example)
    search_terms = []
    for search in recent_searches:
        # Parse search query (would need actual parsing logic)
        if "apartment" in search.search_query.lower():
            search_terms.append(("property_type", "Apartment"))
        if "lagos" in search.search_query.lower():
            search_terms.append(("city", "Lagos"))

    # Build dynamic filters
    filters = []
    for field, value in search_terms:
        filters.append(getattr(Property, field) == value)

    if not filters:
        return []

    # Find matching properties
    searched_properties = get_items_by_filter(
        g.session,
        Property,
        filters={
            "is_available": True,
            "deleted": False,
        },
        complex_filters=[or_(*filters)],
        order_by="random()",
        limit=limit,
    )

    return [serialize(p) for p in searched_properties]


def get_popular_properties_in_area(user_id, user, limit=5):
    """Get popular properties in user's area"""
    # Get user's location (simplified - would need actual user location)
    user_city = user.city if user else None

    if not user_city:
        return []

    # Get popular properties in the area (viewed/liked most)
    popular_properties = (
        g.session.query(Property)
        .outerjoin(PropertyView, Property.id == PropertyView.property_id)
        .outerjoin(LikedProperty, Property.id == LikedProperty.property_id)
        .filter(
            Property.city == user_city,
            Property.is_available == True,
            Property.deleted == False,
        )
        .group_by(Property.id)
        .order_by(desc(func.count(PropertyView.id) + func.count(LikedProperty.id)))
        .limit(limit)
        .all()
    )

    return [serialize(p) for p in popular_properties]
