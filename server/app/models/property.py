from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    Boolean,
    Date,
    Text,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.hybrid import hybrid_property
from . import BaseModel
from .db_utils import generate_id
from .. import g


class Property(BaseModel):
    __tablename__ = "properties"

    # ===== BASIC PROPERTY INFO =====
    id = Column(String(50), primary_key=True, default=generate_id)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    listing_type = Column(String(30), nullable=False)

    # ===== PROPERTY CHARACTERISTICS =====
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    toilets = Column(Integer, nullable=True)  # Important in Nigerian context
    kitchens = Column(Integer, nullable=False)
    floors_no = Column(Integer, nullable=False)
    size_sqft = Column(Float, nullable=False)
    year_built = Column(Integer, nullable=False)
    furnished = Column(String(50), nullable=False)  # 'fully', 'semi', 'unfurnished'
    furnishing_details = Column(JSON, nullable=True)  # Specific items provided

    water_source = Column(String(20), nullable=False)
    has_water_heater = Column(Boolean, default=False)

    security_features = Column(
        JSON,
        default={
            "fence": False,
            "gate": False,
            "cctv": False,
            "security_guards": False,
            "alarm": False,
        },
    )
    neighborhood_security = Column(String(20), nullable=True)

    has_parking = Column(Boolean, default=False)
    parking_type = Column(String(20), nullable=True)
    parking_security = Column(String(20), nullable=True)
    parking_spaces = Column(Integer, nullable=True)

    # ===== AMENITIES & FACILITIES =====
    amenities = Column(
        JSON,
        default={
            "generator": False,
            "borehole": False,
            "water_tank": False,
            "security": [],
            "common_areas": [],
            "swimming_pool": False,
            "gym": False,
            "laundry": False,
            "waste_disposal": False,
            "visitors_room": False,
        },
    )

    # ===== LOCATION DETAILS =====
    address = Column(String(255), nullable=False)
    street = Column(String(100), nullable=False)
    area = Column(String(100), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    zipcode = Column(Float, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    closest_landmark = Column(String(100), nullable=False)
    accessibility_features = Column(ARRAY(String), nullable=True)

    # ===== FINANCIAL DETAILS =====
    payment_structure = Column(String(20), nullable=False)
    rent_amount = Column(Integer, nullable=False)
    caution_fee = Column(Integer, nullable=True)  # Common in Nigeria
    agreement_fee = Column(Integer, nullable=True)  # Common in Nigeria

    # ===== AVAILABILITY =====
    available_from = Column(Date, nullable=False)
    minimum_lease_duration = Column(String(20), nullable=False)  # '1 year', '6 months'
    is_available = Column(Boolean, default=True)
    status = Column(String(20), default="available", nullable=False)

    # ===== MEDIA =====
    cover_image = Column(String(255), nullable=True)
    gallery = Column(ARRAY(String), nullable=False)
    video_tour = Column(String(255), nullable=True)

    # ===== VERIFICATION & STATUS =====
    verification_status = Column(String(20), default="pending")
    is_verified = Column(Boolean, default=False)
    flagged = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)

    # ===== PROMOTION =====
    is_featured = Column(Boolean, default=False)
    featured_priority = Column(Integer, default=0)
    featured_until = Column(DateTime)

    # ===== RELATIONSHIPS =====
    landlord_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    category_id = Column(String(50), ForeignKey("categories.id"), nullable=False)
    tenant_id = Column(String(50), ForeignKey("users.id"), nullable=True)

    landlord = relationship(
        "User", backref="owned_properties", foreign_keys=[landlord_id]
    )
    tenant = relationship("User", backref="rented_properties", foreign_keys=[tenant_id])
    category = relationship(
        "Category", backref="properties", foreign_keys=[category_id]
    )

    leases = relationship(
        "Lease",
        back_populates="property",
        foreign_keys="[Lease.property_id]",
    )

    # ===== TIMESTAMPS =====
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.datetime.utcnow)

    @hybrid_property
    def current_lease(self):
        from .lease import Lease

        return (
            g.session.query(Lease)
            .filter(
                Lease.property_id == self.id,
                Lease.is_active == True,
            )
            .order_by(Lease.start_date.desc())
            .first()
        )
