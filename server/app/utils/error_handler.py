"""
Enhanced error handling utilities for the Flask application
"""

from flask import request, current_app, g
from functools import wraps
import logging
import traceback
from datetime import datetime
from typing import Dict, Any, Optional
from ..utils.helpers import response

# Configure logger
logger = logging.getLogger(__name__)


class ErrorHandler:
    """Enhanced error handling and logging utility"""

    @staticmethod
    def log_error(error: Exception, context: Dict[str, Any] = None) -> str:
        """
        Log error with enhanced context information
        Returns: error_id for tracking
        """
        error_id = f"err_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{id(error)}"

        error_context = {
            "error_id": error_id,
            "error_type": type(error).__name__,
            "error_message": str(error),
            "traceback": traceback.format_exc(),
            "request_method": getattr(request, "method", "Unknown"),
            "request_url": getattr(request, "url", "Unknown"),
            "user_agent": (
                request.headers.get("User-Agent", "Unknown") if request else "Unknown"
            ),
            "ip_address": request.remote_addr if request else "Unknown",
            "timestamp": datetime.utcnow().isoformat(),
        }

        # Add user context if available
        if hasattr(g, "current_user") and g.current_user:
            error_context["user_id"] = getattr(g.current_user, "id", None)
            error_context["user_email"] = getattr(g.current_user, "email", None)

        # Add custom context
        if context:
            error_context.update(context)

        # Log the error
        logger.error(f"Application Error [{error_id}]", extra=error_context)

        # Send to external error tracking in production
        if not current_app.debug:
            ErrorHandler._send_to_error_tracking(error, error_context)

        return error_id

    @staticmethod
    def _send_to_error_tracking(error: Exception, context: Dict[str, Any]):
        """Send error to external tracking service (Sentry, etc.)"""
        try:
            # Example: Send to Sentry
            if hasattr(current_app, "sentry"):
                current_app.sentry.captureException(error, extra=context)
        except Exception as e:
            logger.error(f"Failed to send error to tracking service: {str(e)}")

    @staticmethod
    def handle_validation_error(errors: Dict[str, Any]) -> tuple:
        """
        Handle validation errors consistently
        Returns: (response_dict, status_code)
        """
        logger.warning("Validation Error", extra={"errors": errors})

        return {
            "success": False,
            "message": "Validation failed",
            "data": None,
            "errors": errors,
        }, 400

    @staticmethod
    def handle_not_found_error(resource: str = "Resource") -> tuple:
        """
        Handle 404 errors consistently
        Returns: (response_dict, status_code)
        """
        logger.info(f"Not Found: {resource}")

        return {"success": False, "message": f"{resource} not found", "data": None}, 404

    @staticmethod
    def handle_unauthorized_error(message: str = "Unauthorized") -> tuple:
        """
        Handle 401 errors consistently
        Returns: (response_dict, status_code)
        """
        logger.warning(
            "Unauthorized access attempt",
            extra={
                "ip": request.remote_addr if request else "Unknown",
                "user_agent": (
                    request.headers.get("User-Agent") if request else "Unknown"
                ),
            },
        )

        return {"success": False, "message": message, "data": None}, 401

    @staticmethod
    def handle_forbidden_error(message: str = "Forbidden") -> tuple:
        """
        Handle 403 errors consistently
        Returns: (response_dict, status_code)
        """
        logger.warning(
            "Forbidden access attempt",
            extra={
                "ip": request.remote_addr if request else "Unknown",
                "user_agent": (
                    request.headers.get("User-Agent") if request else "Unknown"
                ),
            },
        )

        return {"success": False, "message": message, "data": None}, 403

    @staticmethod
    def handle_server_error(
        error: Exception, message: str = "Internal server error"
    ) -> tuple:
        """
        Handle 500 errors consistently
        Returns: (response_dict, status_code)
        """
        error_id = ErrorHandler.log_error(error, {"category": "server_error"})

        return {
            "success": False,
            "message": message,
            "data": None,
            "error_id": error_id if current_app.debug else None,
        }, 500


def enhanced_catch_exception(f):
    """
    Enhanced decorator for catching and handling exceptions
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            # Handle known exception types
            if hasattr(e, "code") and hasattr(e, "description"):
                # Custom request errors
                status_code = getattr(e, "code", 500)
                message = getattr(e, "description", str(e))

                if status_code == 400:
                    logger.warning(f"Bad Request: {message}")
                elif status_code == 401:
                    logger.warning(f"Unauthorized: {message}")
                elif status_code == 403:
                    logger.warning(f"Forbidden: {message}")
                elif status_code == 404:
                    logger.info(f"Not Found: {message}")
                else:
                    ErrorHandler.log_error(e, {"category": "known_exception"})

                return response(message, None, False), status_code

            # Handle unknown exceptions
            error_id = ErrorHandler.log_error(e, {"category": "uknown_exception"})

            # Return generic error in production, detailed in development
            if current_app.debug:
                return (
                    response(
                        f"Internal server error: {str(e)}",
                        {"error_id": error_id},
                        False,
                    ),
                    500,
                )
            else:
                return (
                    response(
                        "An internal error occurred. Please try again later.",
                        {"error_id": error_id},
                        False,
                    ),
                    500,
                )

    return decorated_function


def rate_limit_exceeded_handler(e):
    """Handle rate limit exceeded errors"""
    logger.warning(
        "Rate limit exceeded",
        extra={
            "ip": request.remote_addr if request else "Unknown",
            "endpoint": request.endpoint if request else "Unknown",
            "limit": str(e),
        },
    )

    return response("Rate limit exceeded. Please try again later.", None, False), 429


class SecurityAuditLogger:
    """Security event logger for audit trail"""

    @staticmethod
    def log_security_event(
        event_type: str,
        user_email: Optional[str] = None,
        details: Dict[str, Any] = None,
        severity: str = "INFO",
    ):
        """
        Log security events for audit trail
        """
        security_context = {
            "event_type": event_type,
            "severity": severity,
            "user_email": user_email,
            "ip_address": request.remote_addr if request else "Unknown",
            "user_agent": request.headers.get("User-Agent") if request else "Unknown",
            "timestamp": datetime.utcnow().isoformat(),
            "details": details or {},
        }

        # Use different log levels based on severity
        if severity == "CRITICAL":
            logger.critical(f"SECURITY_EVENT: {event_type}", extra=security_context)
        elif severity == "WARNING":
            logger.warning(f"SECURITY_EVENT: {event_type}", extra=security_context)
        else:
            logger.info(f"SECURITY_EVENT: {event_type}", extra=security_context)
