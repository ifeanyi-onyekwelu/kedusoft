# utils/activity_logger.py
from flask import request
from ..models.db_utils import create_item
from ..models import RecentActivity
import logging

logging.basicConfig(level=logging.DEBUG)


class ActivityLogger:
    """Utility class to log user activities"""

    @staticmethod
    def log_activity(
        session,
        user_id,
        user_role,
        activity_type,
        description,
        related_entity_type=None,
        related_entity_id=None,
    ):
        """
        Log a user activity

        Args:
            session: Database session
            user_id: ID of the user performing the activity
            user_role: Role of the user ('tenant' or 'landlord')
            activity_type: Type of activity (e.g., 'property_applied', 'lease_signed')
            description: Human-readable description of the activity
            related_entity_type: Type of related entity ('property', 'application', etc.)
            related_entity_id: ID of the related entity
        """
        try:
            activity_data = {
                "user_id": user_id,
                "user_role": user_role,
                "activity_type": activity_type,
                "activity_description": description,
                "related_entity_type": related_entity_type,
                "related_entity_id": related_entity_id,
                "ip_address": request.remote_addr if request else None,
                "user_agent": request.headers.get("User-Agent") if request else None,
            }

            activity = create_item(session, RecentActivity, activity_data)
            logging.debug(f"Activity logged: {activity_type} for user {user_id}")
            return activity

        except Exception as e:
            logging.error(f"Failed to log activity: {e}")
            return None

    @staticmethod
    def log_tenant_activity(
        session,
        user_id,
        activity_type,
        description,
        related_entity_type=None,
        related_entity_id=None,
    ):
        """Convenience method for logging tenant activities"""
        return ActivityLogger.log_activity(
            session,
            user_id,
            "tenant",
            activity_type,
            description,
            related_entity_type,
            related_entity_id,
        )

    @staticmethod
    def log_landlord_activity(
        session,
        user_id,
        activity_type,
        description,
        related_entity_type=None,
        related_entity_id=None,
    ):
        """Convenience method for logging landlord activities"""
        return ActivityLogger.log_activity(
            session,
            user_id,
            "landlord",
            activity_type,
            description,
            related_entity_type,
            related_entity_id,
        )
