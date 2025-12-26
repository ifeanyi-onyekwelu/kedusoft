from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class BaseModel(db.Model):
    __abstract__ = True

    def to_dict(self):
        """
        Converts the model instance into a dictionary.
        """
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        }


from .user import User
from .user_documents import UserIdentityDocument
from .user_bank_details import UserBankDetails
from .user_insurance import UserInsurance
from .landlord_info import LandlordInfo
from .tenant_info import TenantInfo
from .property import Property
from .application import Application
from .document import Document
from .chat_room import ChatRoom
from .message import Message
from .notification import Notification
from .notification_preference import NotificationPreference
from .payment import Payment
from .recommendation import Recommendation
from .screening import Screening
from .review import Review
from .search_history import SearchHistory
from .transaction import Transaction
from .category import Category
from .lease import Lease
from .liked_property import LikedProperty
from .property_draft import PropertyDraft
from .property_view import PropertyView
from .recent_activity import RecentActivity
