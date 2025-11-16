from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import enum


class MaintenancePriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class MaintenanceStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class MaintenanceRequest(BaseModel):
    __tablename__ = "maintenance_requests"

    id = Column(String(20), primary_key=True, default=generate_id)
    property_id = Column(String(20), ForeignKey("properties.id"), nullable=False)
    landlord_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    tenant_id = Column(String(20), ForeignKey("users.id"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(
        Enum(MaintenancePriority), nullable=False, default=MaintenancePriority.MEDIUM
    )
    status = Column(
        Enum(MaintenanceStatus), nullable=False, default=MaintenanceStatus.PENDING
    )
    scheduled_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    cost = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(
        DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now
    )

    # Relationships
    property = relationship("Property", backref="maintenance_requests")
    landlord = relationship(
        "User", foreign_keys=[landlord_id], backref="landlord_maintenance_requests"
    )
    tenant = relationship(
        "User", foreign_keys=[tenant_id], backref="tenant_maintenance_requests"
    )

    def to_dict(self):
        """Convert maintenance request to dictionary with related data"""
        data = super().to_dict()
        data["priority"] = self.priority.value if self.priority else None
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
