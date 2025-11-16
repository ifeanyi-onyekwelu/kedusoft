from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum, Time
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import enum


class InspectionType(enum.Enum):
    MOVE_IN = "move_in"
    MOVE_OUT = "move_out"
    ROUTINE = "routine"
    MAINTENANCE = "maintenance"


class InspectionStatus(enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Inspection(BaseModel):
    __tablename__ = "inspections"

    id = Column(String(20), primary_key=True, default=generate_id)
    property_id = Column(String(20), ForeignKey("properties.id"), nullable=False)
    landlord_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    tenant_id = Column(String(20), ForeignKey("users.id"), nullable=True)
    inspection_type = Column(
        Enum(InspectionType), nullable=False, default=InspectionType.ROUTINE
    )
    status = Column(
        Enum(InspectionStatus), nullable=False, default=InspectionStatus.SCHEDULED
    )
    inspector_name = Column(String(200), nullable=True)
    scheduled_date = Column(DateTime, nullable=False)
    scheduled_time = Column(
        String(10), nullable=False
    )  # Storing as string like "14:30"
    completed_date = Column(DateTime, nullable=True)
    findings = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(
        DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now
    )

    # Relationships
    property = relationship("Property", backref="inspections")
    landlord = relationship(
        "User", foreign_keys=[landlord_id], backref="landlord_inspections"
    )
    tenant = relationship(
        "User", foreign_keys=[tenant_id], backref="tenant_inspections"
    )

    def to_dict(self):
        """Convert inspection to dictionary with related data"""
        data = super().to_dict()
        data["inspection_type"] = (
            self.inspection_type.value if self.inspection_type else None
        )
        data["status"] = self.status.value if self.status else None
        data["property_name"] = self.property.title if self.property else None
        data["property_address"] = (
            self.property.location.get("address")
            if self.property and self.property.location
            else None
        )
        data["tenant_name"] = (
            f"{self.tenant.first_name} {self.tenant.last_name}" if self.tenant else None
        )
        data["landlord_name"] = (
            f"{self.landlord.first_name} {self.landlord.last_name}"
            if self.landlord
            else None
        )
        return data
