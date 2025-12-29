from flask import Flask, render_template, current_app
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from .variables import SENDGRID_API_KEY
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_mail(app: Flask):
    """Initialize mail extension with Flask app"""
    # Store SendGrid API key in app config
    app.config["SENDGRID_API_KEY"] = SENDGRID_API_KEY
    logger.info("SendGrid mailer initialized with Flask app")


def send_email(
    subject: str,
    recipients: list,
    template_name: str = None,
    template_vars: dict = None,
    body: str = None,
    sender: str = None,
    template_folder: str = None,
) -> bool:
    """
    Send email using SendGrid

    Args:
        subject: Email subject
        recipients: List of recipient emails
        template_name: Name of template file (without .html extension)
        template_vars: Variables to pass to the template
        body: Raw email body (alternative to template)
        sender: Optional sender override (default: noreply@kedusoft.com)
        template_folder: Optional folder path inside emails/ directory (e.g., 'landlord' or 'tenant')

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Get SendGrid API key from app config
        sg_api_key = current_app.config.get("SENDGRID_API_KEY")
        if not sg_api_key:
            logger.error("SendGrid API key not configured")
            return False

        # Prepare content
        if template_name:
            try:
                # Build template path with optional folder
                if template_folder:
                    template_path = f"emails/{template_folder}/{template_name}.html"
                else:
                    template_path = f"emails/{template_name}.html"

                html_content = render_template(template_path, **(template_vars or {}))
            except Exception as e:
                logger.error(f"Error rendering template {template_path}: {e}")
                html_content = body or ""
        else:
            html_content = body or ""

        # Set sender email
        from_email = sender or "ifeanyi.onyekwelu@kedusoft.com"

        # Create Mail object
        mail = Mail(
            from_email=from_email,
            to_emails=recipients if isinstance(recipients, list) else [recipients],
            subject=subject,
            html_content=html_content,
        )

        # Send email via SendGrid
        sg = SendGridAPIClient(sg_api_key)
        response = sg.send(mail)

        # Check response status
        if response.status_code in [200, 201, 202]:
            logger.info(f"Email sent successfully to {recipients}: {subject}")
            return True
        else:
            logger.error(f"SendGrid returned status code {response.status_code}")
            return False

    except Exception as e:
        logger.error(f"Error sending email via SendGrid: {e}")
        return False
