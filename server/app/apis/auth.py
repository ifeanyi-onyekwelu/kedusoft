from flask import Blueprint, request, make_response, g
from datetime import timedelta, datetime
import bcrypt
import jwt
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, validate, ValidationError
import logging
import random
import requests as py_requests
import secrets
from ..utils.helpers import response, dict_except, generate_tokens, serialize
from ..utils.errors import CustomRequestError, catch_exception
from ..utils.variables import APP_URL, JWT_SECRET, GOOGLE_CLIENT_ID, SITE_URL
from ..utils.mailer import send_email
from ..models.user import User
from ..models.db_utils import create_item, get_item_by_filter, update_item

# Configure logging with more detail
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

auth = Blueprint("auth", __name__)

# Initialize rate limiter with storage backend for production
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379" if APP_URL != "localhost" else None,
)

# Enhanced rate limiting rules
login_limiter = limiter.shared_limit("5 per minute", scope="login")
signup_limiter = limiter.shared_limit("10 per hour", scope="signup")
verification_limiter = limiter.shared_limit("3 per minute", scope="verification")
password_reset_limiter = limiter.shared_limit("3 per hour", scope="password_reset")

# ======================================================
# VALIDATION SCHEMAS
# ======================================================


class LoginSchema(Schema):
    email = fields.Email(
        required=True,
        error_messages={
            "required": "Email is required",
            "invalid": "Please enter a valid email address",
        },
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=1),
        error_messages={"required": "Password is required"},
    )
    rememberMe = fields.Bool(required=False)


def validate_role(role):
    allowed_role = ["tenant", "landlord", "admin"]

    if not role in allowed_role:
        raise ValidationError(
            f"Invalid role: {role}, Role must be 'tenant', 'landlord', or 'admin'"
        )


class SignupSchema(Schema):
    firstName = fields.Str(
        required=True,
        error_messages={
            "required": "First name is required",
        },
    )
    lastName = fields.Str(
        required=True,
        error_messages={
            "required": "Last name is required",
        },
    )
    email = fields.Email(
        required=True,
        error_messages={
            "required": "Email is required",
            "invalid": "Please enter a valid email address",
        },
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=8, max=128),
        error_messages={
            "required": "Password is required",
            "invalid": "Password must be at least 8 characters long",
        },
    )
    password2 = fields.Str(
        required=True,
        validate=validate.Length(min=8, max=128),
        error_messages={
            "required": "Password confirmation is required",
            "invalid": "Password confirmation must be at least 8 characters long",
        },
    )
    role = fields.Str(
        required=True,
        validate=validate_role,
        error_messages={
            "required": "Role is required",
        },
    )
    terms = fields.Bool(
        required=True,
        error_messages={
            "required": "You must accept the terms and conditions",
        },
    )

    def validate_passwords_match(self, data, **kwargs):
        """Custom validation to ensure passwords match"""
        password = data.get("password")
        password2 = data.get("password2")

        if password and password2 and password != password2:
            raise ValidationError("Passwords do not match", field_name="password2")

        return data


class GoogleAuthSchema(Schema):
    token = fields.Str(
        required=True, error_messages={"required": "Google token is required"}
    )
    role = fields.Str(required=False)


class VerificationSchema(Schema):
    email = fields.Email(required=True)
    code = fields.Str(required=True, validate=validate.Length(equal=6))


class PasswordResetSchema(Schema):
    email = fields.Email(required=True)


class PasswordResetConfirmSchema(Schema):
    token = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))


# ======================================================
# UTILITY FUNCTIONS
# ======================================================


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password meets security requirements
    Returns: (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"

    # Check for special characters (optional but recommended)
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        return (
            False,
            "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\"\\,./<>?)",
        )

    # Check for common weak passwords
    weak_passwords = [
        "12345678",
        "password",
        "password123",
        "admin123",
        "qwerty123",
        "abc123456",
    ]
    if password.lower() in weak_passwords:
        return False, "Password is too common. Please choose a stronger password"

    return True, ""


def validate_password_confirmation(password: str, password2: str) -> tuple[bool, str]:
    """
    Validate that password and confirmation password match
    Returns: (is_valid, error_message)
    """
    if password != password2:
        return False, "Passwords do not match"

    return True, ""


def validate_signup_passwords(password: str, password2: str) -> tuple[bool, str]:
    """
    Comprehensive password validation for signup
    Validates both strength and confirmation
    Returns: (is_valid, error_message)
    """
    # First check if passwords match
    match_valid, match_error = validate_password_confirmation(password, password2)
    if not match_valid:
        return False, match_error

    # Then check password strength
    strength_valid, strength_error = validate_password_strength(password)
    if not strength_valid:
        return False, strength_error

    return True, ""


def log_security_event(event_type: str, user_email: str = None, details: dict = None):
    """Log security-related events for monitoring"""
    logger.warning(
        f"SECURITY_EVENT: {event_type}",
        extra={
            "event_type": event_type,
            "user_email": user_email,
            "ip_address": request.remote_addr,
            "user_agent": request.headers.get("User-Agent"),
            "details": details or {},
        },
    )


def check_account_status(user: User) -> None:
    """Check if user account is in valid state for authentication"""
    if user.is_deleted:
        log_security_event("LOGIN_ATTEMPT_DELETED_ACCOUNT", user.email)
        raise CustomRequestError(
            "Your account was deleted. Please create a new account", 400
        )

    if not user.is_active and user.is_suspended:
        log_security_event("LOGIN_ATTEMPT_SUSPENDED_ACCOUNT", user.email)
        raise CustomRequestError("Your account is suspended! Contact support", 400)


def check_and_reset_failed_attempts(user: User) -> None:
    """
    Check if enough time has passed to reset failed login attempts
    Reset attempts if more than 30 minutes have passed since last failed login
    """
    if not user.last_failed_login or not user.failed_login_attempts:
        return

    # Calculate time since last failed login
    time_since_failure = datetime.utcnow() - user.last_failed_login
    reset_threshold = timedelta(minutes=30)  # Reset after 30 minutes

    if time_since_failure > reset_threshold:
        try:
            update_item(
                g.session,
                User,
                user.id,
                {"failed_login_attempts": 0, "last_failed_login": None},
            )
            logger.info(
                f"Auto-reset failed login attempts for user {user.email} after timeout"
            )
        except Exception as e:
            logger.error(
                f"Failed to auto-reset login attempts for {user.email}: {str(e)}"
            )


def create_info_based_on_role(session, user_id: str, role: str) -> None:
    if role == "landlord":
        from ..models.landlord_info import LandlordInfo

        existing_info = get_item_by_filter(session, LandlordInfo, {"user_id": user_id})
        if not existing_info:
            create_item(session, LandlordInfo, {"user_id": user_id})
            logger.info(f"Created LandlordInfo for user_id: {user_id}")
    if role == "tenant":
        from ..models.tenant_info import TenantInfo

        existing_info = get_item_by_filter(session, TenantInfo, {"user_id": user_id})
        if not existing_info:
            create_item(session, TenantInfo, {"user_id": user_id})
            logger.info(f"Created TenantInfo for user_id: {user_id}")


# ======================================================
# AUTHENTICATION ROUTES
# ======================================================


@auth.post("/")
@catch_exception
@login_limiter
def login_page():
    """
    Enhanced authenticate user and return JWT tokens
    Rate limited: 5 attempts per minute
    """
    try:
        # Validate request data
        schema = LoginSchema()
        data = schema.load(request.get_json() or {})

        email = data["email"].lower().strip()  # Normalize email
        password = data["password"]

    except ValidationError as err:
        log_security_event("LOGIN_VALIDATION_ERROR", details={"errors": err.messages})
        raise CustomRequestError(f"Validation error: {err}", 400)

    # Enhanced user lookup with timing attack protection
    user = get_item_by_filter(g.session, User, {"email": email})

    # Always perform password check to prevent timing attacks
    if user:
        password_valid = bcrypt.checkpw(
            password.encode("utf-8"), user.password.encode("utf-8")
        )
    else:
        # Perform dummy hash check to maintain consistent timing
        bcrypt.checkpw(b"dummy", b"$2b$12$dummy.hash.to.prevent.timing.attacks")
        password_valid = False

    # Check both user existence and password validity
    if not user or not password_valid:
        # Increment failed login attempts for existing users
        if user:
            current_attempts = getattr(user, "failed_login_attempts", 0) or 0
            new_attempts = current_attempts + 1

            try:
                update_item(
                    g.session,
                    User,
                    user.id,
                    {
                        "failed_login_attempts": new_attempts,
                        "last_failed_login": datetime.utcnow(),
                    },
                )

                # Log the failed attempt with count
                log_security_event(
                    "LOGIN_FAILED_INVALID_CREDENTIALS",
                    email,
                    {"attempts": new_attempts, "locked": new_attempts >= 5},
                )

                # If this puts them over the limit, log account lock
                if new_attempts >= 5:
                    log_security_event("ACCOUNT_LOCKED_FAILED_ATTEMPTS", email)

            except Exception as e:
                logger.error(f"Failed to update login attempts for {email}: {str(e)}")
        else:
            log_security_event("LOGIN_FAILED_INVALID_CREDENTIALS", email)

        raise CustomRequestError("Invalid email or password", 401)

    # Enhanced account status checks
    try:
        check_account_status(user)

        # Check and potentially reset failed login attempts based on time
        check_and_reset_failed_attempts(user)

    except CustomRequestError:
        raise  # Re-raise the same error

    # Check for too many failed attempts with proper field access
    failed_attempts = getattr(user, "failed_login_attempts", 0) or 0
    if failed_attempts >= 5:
        log_security_event(
            "LOGIN_BLOCKED_TOO_MANY_ATTEMPTS", email, {"attempts": failed_attempts}
        )
        raise CustomRequestError(
            "Account temporarily locked due to too many failed attempts. Please contact support or wait before trying again.",
            423,
        )

    # Enhanced verification flow for unverified users
    if not user.is_email_verified:
        verification_code = str(random.randint(100000, 999999))
        verification_token = jwt.encode(
            {
                "user_id": user.id,
                "code": verification_code,
                "exp": datetime.utcnow() + timedelta(minutes=30),
            },
            JWT_SECRET,
            algorithm="HS256",
        )

        try:
            update_item(
                g.session,
                User,
                user.id,
                {
                    "verification_token": verification_token,
                    "verification_code": verification_code,
                },
            )

            template_vars = {
                "verification_code": verification_code,
                "email": user.email,
                "name": f"{user.firstName} {user.lastName}",
            }
            send_email(
                "Verify your account",
                [user.email],
                "send_verification_email",
                template_vars,
            )

            logger.info(f"Verification email sent to {user.email}")

        except Exception as e:
            logger.error(f"Failed to send verification email: {str(e)}")
            # Continue with login but log the error

    # Generate secure tokens
    try:
        access_token, refresh_token = generate_tokens(user.to_dict())

        # Reset failed login attempts on successful login
        failed_attempts = getattr(user, "failed_login_attempts", 0) or 0
        if failed_attempts > 0:
            try:
                update_item(
                    g.session,
                    User,
                    user.id,
                    {
                        "failed_login_attempts": 0,
                        "last_successful_login": datetime.utcnow(),
                    },
                )
                logger.info(f"Reset failed login attempts for user {email}")
            except Exception as e:
                logger.error(f"Failed to reset login attempts for {email}: {str(e)}")

        # Create response
        user_data = dict_except(user.to_dict(), "password")
        # Determine onboarding status based on user role
        is_onboarded = (
            user.landlord_info and user.landlord_info.is_onboarded
            if user.role == "landlord"
            else user.tenant_info and user.tenant_info.is_onboarded
        )
        resp = make_response(
            response(
                "Login successful",
                {
                    "accessToken": access_token,
                    "refreshToken": refresh_token,
                    "user": user_data,
                    "is_email_verified": user.is_email_verified,
                    "is_onboarded": is_onboarded,
                },
            )
        )

        # Set secure HTTP-only cookie
        resp.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=timedelta(days=7).total_seconds(),  # 7 days
        )

        # Log successful login and send notification
        login_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        ip_address = request.remote_addr
        user_agent = request.headers.get("User-Agent", "Unknown")

        log_security_event(
            "LOGIN_SUCCESS", user.email, {"ip": ip_address, "user_agent": user_agent}
        )

        reset_token = jwt.encode(
            {"user_id": user.id, "exp": datetime.utcnow() + timedelta(minutes=3600)},
            JWT_SECRET,
            algorithm="HS256",
        )

        try:
            content = {
                "email": user.email,
                "name": f"{user.firstName} {user.lastName}",
                "IP": ip_address,
                "login_time": login_time,
                "user_agent": user_agent,
                "security_url": f"{SITE_URL}/auth/reset-password?token={reset_token}",
            }

            send_email(
                "Recent Login Notification", [user.email], "login_notification", content
            )
        except Exception as e:
            logger.error(f"Failed to send login notification: {str(e)}")

        return resp

    except Exception as e:
        logger.error(f"Token generation failed for user {user.email}: {str(e)}")
        raise CustomRequestError("Authentication failed. Please try again.", 500)


@auth.post("/signup")
@catch_exception
@signup_limiter
def handle_signup_page():
    """
    Enhanced user registration with validation
    Rate limited: 10 accounts per hour
    """
    try:
        # Validate request data
        schema = SignupSchema()
        data = schema.load(request.get_json() or {})

        email = data["email"].lower().strip()  # Normalize email
        password = data["password"]
        password2 = data["password2"]
        role = data["role"]

    except ValidationError as err:
        log_security_event("SIGNUP_VALIDATION_ERROR", details={"errors": err.messages})
        raise CustomRequestError(f"Error occurred: {err}", 400)

    # Check if passwords match
    if password != password2:
        raise CustomRequestError("Passwords do not match", 400)

    # Enhanced password validation using comprehensive function
    password_valid, password_error = validate_signup_passwords(password, password2)
    if not password_valid:
        raise CustomRequestError(password_error, 400)

    # Check for existing user
    existing_user = get_item_by_filter(g.session, User, {"email": email})
    if existing_user:
        log_security_event("SIGNUP_FAILED_EMAIL_EXISTS", email)
        raise CustomRequestError("An account with this email already exists", 409)

    try:
        # Create secure password hash
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt(rounds=12)  # Higher cost factor
        ).decode("utf-8")

        # Prepare user data
        user_data = {
            **dict_except(data, "password2", "terms"),
            "email": email,
            "password": hashed_password,
            "is_verified": False,
            "is_email_verified": False,
            "role": role,
            "joined_at": datetime.utcnow(),
        }

        # Create new user
        new_user = create_item(g.session, User, user_data)
        logger.info(f"New user created: {email}")

        # create user info (landlord info / tenant info)
        create_info_based_on_role(g.session, new_user.id, role)

        # Generate verification code
        verification_code = str(random.randint(100000, 999999))
        verification_token = jwt.encode(
            {
                "user_id": new_user.id,
                "code": verification_code,
                "exp": datetime.utcnow() + timedelta(minutes=30),
            },
            JWT_SECRET,
            algorithm="HS256",
        )

        # Update user with verification info
        update_item(
            g.session,
            User,
            new_user.id,
            {
                "verification_token": verification_token,
                "verification_code": verification_code,
            },
        )

        # Generate tokens
        access_token, refresh_token = generate_tokens(new_user.to_dict())

        # Create response
        user_data = dict_except(new_user.to_dict(), "password")
        resp = make_response(
            response(
                "Registration successful. Please verify your email.",
                {
                    "accessToken": access_token,
                    "user": user_data,
                },
            )
        )

        # Set secure cookie
        resp.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=timedelta(days=7).total_seconds(),
        )

        # Send verification email (non-blocking)
        try:
            template_vars = {
                "verification_code": verification_code,
                "email": email,
                "name": f"{data['firstName']} {data['lastName']}",
            }
            send_email(
                "Welcome! Please verify your email",
                [email],
                "welcome_verification_email",
                template_vars,
            )
            logger.info(f"Welcome verification email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send welcome email: {str(e)}")

        log_security_event("SIGNUP_SUCCESS", email)
        return resp

    except Exception as e:
        logger.error(f"User creation failed for {email}: {str(e)}")
        raise CustomRequestError("Registration failed. Please try again.", 500)


import requests as py_requests
from datetime import datetime, timedelta


@auth.post("/google-login")
@catch_exception
@login_limiter
def google_login():
    try:
        # 1. Validate request data
        schema = GoogleAuthSchema()
        data = schema.load(request.get_json() or {})
        token = data["token"]
    except ValidationError as err:
        logger.info("Validation error in Google login", err)
        log_security_event("GOOGLE_LOGIN_VALIDATION_ERROR", details={"errors": err})
        raise CustomRequestError("Validation error", 400)

    try:
        # 2. Verify Access Token with Google
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        google_resp = py_requests.get(user_info_url, params={"access_token": token})

        if not google_resp.ok:
            logger.warning(f"Google Token Verification Failed: {google_resp.text}")
            raise ValueError("Invalid Google token")

        id_info = google_resp.json()
        email = id_info["email"].lower().strip()
        google_id = id_info["sub"]

        # 3. Check if user exists in your database
        user = get_item_by_filter(g.session, User, {"email": email})

        if not user:
            log_security_event("GOOGLE_LOGIN_NO_ACCOUNT", email)
            # For an MVP, we usually tell them to sign up or we auto-create an account
            raise CustomRequestError(
                "No account found. Please join the waitlist first.", 404
            )

        # 4. Check account status (banned, suspended, etc.)
        check_account_status(user)

        # 5. Update google_id if it's their first time using Google for this account
        if not getattr(user, "google_id", None):
            update_item(g.session, User, user.id, {"google_id": google_id})

        # 6. Generate YOUR app's tokens
        access_token, refresh_token = generate_tokens(user.to_dict())

        # 7. Prepare Response
        user_data = dict_except(serialize(user), "password")
        is_onboarded = (
            user.landlord_info and user.landlord_info.verification_status == "approved"
            if user.role == "landlord"
            else user.tenant_info and user.tenant_info.verification_status == "approved"
        )

        resp = make_response(
            response(
                "Google login successful",
                {
                    "accessToken": access_token,
                    "refreshToken": refresh_token,
                    "user": user_data,
                    "is_onboarded": is_onboarded,
                },
            )
        )

        # 8. Set Secure Refresh Cookie
        resp.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=604800,  # 7 days
        )

        # Log successful login and send notification
        login_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        ip_address = request.remote_addr
        user_agent = request.headers.get("User-Agent", "Unknown")

        reset_token = jwt.encode(
            {"user_id": user.id, "exp": datetime.utcnow() + timedelta(minutes=3600)},
            JWT_SECRET,
            algorithm="HS256",
        )

        try:
            content = {
                "email": user.email,
                "name": f"{user.firstName} {user.lastName}",
                "IP": ip_address,
                "login_time": login_time,
                "user_agent": user_agent,
                "security_url": f"{SITE_URL}/auth/reset-password?token={reset_token}",
            }

            send_email(
                "Recent Login Notification", [user.email], "login_notification", content
            )
        except Exception as e:
            logger.error(f"Failed to send login notification: {str(e)}")

        log_security_event("GOOGLE_LOGIN_SUCCESS", email, {"ip": request.remote_addr})
        return resp

    except ValueError as e:
        raise CustomRequestError(str(e), 401)
    except CustomRequestError:
        raise
    except Exception as e:
        logger.error(f"Google login system error: {str(e)}")
        raise CustomRequestError("Google authentication failed", 500)


@auth.post("/google-signup")
@catch_exception
@signup_limiter
def google_signup():
    try:
        schema = GoogleAuthSchema()
        data = schema.load(request.get_json() or {})
        token = data["token"]
        role = request.get_json().get("role", "tenant")
    except ValidationError as err:
        logging.debug("Validation error in Google signup", err)
        raise CustomRequestError("Validation error", 400)

    try:
        # 1. Verify Access Token and get User Info
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        google_resp = py_requests.get(user_info_url, params={"access_token": token})

        if not google_resp.ok:
            raise ValueError("Invalid Google token")

        id_info = google_resp.json()
        email = id_info["email"].lower().strip()
        first_name = id_info.get("given_name", "User")
        last_name = id_info.get("family_name", "")
        google_id = id_info["sub"]
        profile_picture = id_info.get("picture", "")

        logger.info(f"Google signup attempt for email: {email}")

        # 2. Check if user already exists
        existing_user = get_item_by_filter(g.session, User, {"email": email})
        if existing_user:
            raise CustomRequestError(
                "An account with this email already exists. Please log in.", 409
            )

        # 3. Create new user
        user_data = {
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "role": role,
            "is_email_verified": True,
            "profile_picture": profile_picture,
            "password": secrets.token_urlsafe(32),
        }

        logger.info(f"Creating user with data: {user_data}")
        new_user = create_item(g.session, User, user_data)

        create_info_based_on_role(g.session, new_user.id, role)

        # 4. Generate tokens
        access_token, refresh_token = generate_tokens(new_user.to_dict())

        # 5. Response
        user_dict = dict_except(serialize(new_user), "password")
        resp = make_response(
            response(
                "Google registration successful",
                {
                    "accessToken": access_token,
                    "user": user_dict,
                    "is_onboarded": False,
                },
            )
        )

        resp.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=604800,
        )

        return resp

    except ValueError as ve:
        logger.error(f"ValueError in google_signup: {str(ve)}", exc_info=True)
        raise CustomRequestError("Invalid Google token", 401)
    except CustomRequestError:
        raise
    except Exception as e:
        logger.error(f"Google signup failed: {str(e)}", exc_info=True)
        logger.error(f"Exception type: {type(e).__name__}")
        raise CustomRequestError("Google registration failed", 500)


# ======================================================
# VERIFICATION ROUTES
# ======================================================


@auth.post("/send-verification")
@catch_exception
@verification_limiter
def send_verification():
    """
    Send verification code to user's email
    Rate limited: 3 attempts per minute
    """
    data = request.get_json()
    email = data.get("email")

    user = get_item_by_filter(g.session, User, {"email": email})
    if not user:
        raise CustomRequestError("User not found", 404)
    if user.is_verified:
        raise CustomRequestError("Email is already verified", 400)

    verification_code = str(random.randint(100000, 999999))
    verification_token = jwt.encode(
        {
            "user_id": user.id,
            "code": verification_code,
            "exp": datetime.utcnow() + timedelta(minutes=30),
        },
        JWT_SECRET,
        algorithm="HS256",
    )
    update_item(
        g.session,
        User,
        user.id,
        {
            "verification_token": verification_token,
            "verification_code": verification_code,
        },
    )

    return response("Verification code sent to your email", {})


@auth.post("/verify-email")
@catch_exception
@verification_limiter
def verify_email():
    """
    Verify user's email with code
    Rate limited: 3 attempts per minute
    """
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    logging.info(f"Email: {email}")
    logging.info(f"Code: {code}")

    user = get_item_by_filter(g.session, User, {"email": email})
    if not user:
        raise CustomRequestError("User not found", 404)
    if user.is_verified:
        raise CustomRequestError("Email is already verified", 400)
    if not user.verification_token:
        raise CustomRequestError("No verification token found", 400)

    try:
        payload = jwt.decode(user.verification_token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise CustomRequestError("Verification code has expired", 400)
    except jwt.InvalidTokenError:
        raise CustomRequestError("Invalid verification token", 400)

    if payload.get("code") != code:
        raise CustomRequestError("Invalid verification code", 400)

    update_item(
        g.session,
        User,
        user.id,
        {"is_email_verified": True, "verification_token": None},
    )

    return response("Email verified successfully", {})


# ======================================================
# PASSWORD RESET ROUTES
# ======================================================


@auth.post("/forgot-password")
@catch_exception
@password_reset_limiter
def forgot_password():
    """
    Initiate password reset process
    Rate limited: 3 attempts per hour
    """
    data = request.get_json()
    email = data.get("email")

    user = get_item_by_filter(g.session, User, {"email": email})
    if not user:
        raise CustomRequestError("Account not found", 404)

    reset_token = jwt.encode(
        {"user_id": user.id, "exp": datetime.utcnow() + timedelta(minutes=30)},
        JWT_SECRET,
        algorithm="HS256",
    )
    reset_link = f"{APP_URL}/reset-password?token={reset_token}"

    # In production, send email with reset link
    # send_mail("Password Reset", [email], f"Reset link: {reset_link}")

    return response(
        "Password reset email sent", {"reset_link": reset_link}  # Debug only
    )


@auth.post("/reset-password")
@catch_exception
@password_reset_limiter
def reset_password():
    """
    Complete password reset process
    Rate limited: 3 attempts per hour
    """
    data = request.get_json()
    token = data.get("token")
    password = data.get("password")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise CustomRequestError("Token has expired", 400)
    except jwt.InvalidTokenError:
        raise CustomRequestError("Invalid token", 400)

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )
    update_item(g.session, User, user_id, {"password": hashed_password})

    return response("Password has been reset successfully", {})


# ======================================================
# SESSION MANAGEMENT
# ======================================================


@auth.post("/logout")
@catch_exception
def logout():
    """
    Clear user session
    No rate limiting needed
    """
    resp = make_response(response("Logout successful", {}))
    resp.delete_cookie("refresh_token")
    return resp
