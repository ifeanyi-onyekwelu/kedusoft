from flask import Flask, render_template, current_app
import resend
from .variables import RESEND_API_KEY
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_mail(app: Flask):
    app.config["RESEND_API_KEY"] = RESEND_API_KEY
    resend.api_key = RESEND_API_KEY
    logger.info("Resend mailer initialized with Flask app")


def send_email(
    subject: str,
    recipients: list,
    template_name: str = None,
    template_vars: dict = None,
    body: str = None,
    sender: str = None,
    template_folder: str = None,
) -> bool:
    try:
        # Get SendGrid API key from app config
        api_key = current_app.config.get("RESEND_API_KEY")
        if not api_key:
            logger.error("Resend API key not configured")
            return False

        resend.api_key = api_key

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
        from_email = sender or "Letsten <no-reply@mail.letsten.com>"

        # Create Mail object
        resend.Emails.send({
            "from": from_email,
            "to": recipients if isinstance(recipients, list) else [recipients],
            "subject": subject,
            "html": html_content,
        })

        logger.info(f"Email sent successfully to {recipients}: {subject}")
        return True

    except Exception as e:
        logger.error(f"Error sending email via Resend: {e}")
        return False
