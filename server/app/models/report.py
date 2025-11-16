from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum, JSON
import datetime
from sqlalchemy.orm import relationship
from . import BaseModel
from .db_utils import generate_id
import enum


class ReportType(enum.Enum):
    FINANCIAL = "financial"
    OCCUPANCY = "occupancy"
    TENANT = "tenant"
    TRANSACTION = "transaction"
    PROPERTY = "property"
    MAINTENANCE = "maintenance"


class ReportStatus(enum.Enum):
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class Report(BaseModel):
    __tablename__ = "reports"

    id = Column(String(20), primary_key=True, default=generate_id)
    landlord_id = Column(String(20), ForeignKey("users.id"), nullable=False)
    report_type = Column(Enum(ReportType), nullable=False)
    status = Column(Enum(ReportStatus), nullable=False, default=ReportStatus.PENDING)
    title = Column(String(200), nullable=False)
    date_range_start = Column(DateTime, nullable=False)
    date_range_end = Column(DateTime, nullable=False)
    parameters = Column(JSON, nullable=True)  # Store any additional filters/parameters
    file_path = Column(String(500), nullable=True)  # Path to generated report file
    file_format = Column(String(10), nullable=True)  # csv, pdf, excel
    data = Column(JSON, nullable=True)  # Store report data as JSON
    error_message = Column(Text, nullable=True)
    generated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(
        DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now
    )

    # Relationships
    landlord = relationship("User", backref="reports")

    def to_dict(self):
        """Convert report to dictionary"""
        data = super().to_dict()
        data["report_type"] = self.report_type.value if self.report_type else None
        data["status"] = self.status.value if self.status else None
        data["landlord_name"] = (
            f"{self.landlord.first_name} {self.landlord.last_name}"
            if self.landlord
            else None
        )
        return data
