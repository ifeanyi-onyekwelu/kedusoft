from flask import Flask, render_template, current_app
from flask_mail import Mail, Message
import logging
import smtplib
import socket
from typing import List, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask-Mail
mail = Mail()


def init_mail(app: Flask):
    """Initialize mail extension with Flask app"""
    mail.init_app(app)


def send_email(
    subject: str,
    recipients: List[str],
    template_name: Optional[str] = None,
    template_vars: Optional[Dict] = None,
    body: Optional[str] = None,
    sender: Optional[str] = None,
    attachments: Optional[List[Dict]] = None,
) -> bool:
    """
    Send email using either a template or raw body

    Args:
        subject: Email subject
        recipients: List of recipient emails
        template_name: Name of template file (without .html extension)
        template_vars: Variables to pass to the template
        body: Raw email body (alternative to template)
        sender: Optional sender override
        attachments: List of attachments (each with 'filename' and 'content')

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Log email configuration for debugging
        logger.info(
            f"Email config - Server: {current_app.config.get('MAIL_SERVER')}, Port: {current_app.config.get('MAIL_PORT')}, Username: {current_app.config.get('MAIL_USERNAME')}"
        )

        # Prepare content
        if template_name:
            content = render_template(
                f"emails/{template_name}.html", **(template_vars or {})
            )
            is_html = True
        else:
            content = body or ""
            is_html = False

        # Create message
        msg = Message(
            subject=subject,
            recipients=recipients,
            html=content if is_html else None,
            body=content if not is_html else None,
            sender=sender,
        )

        # Add attachments if provided
        if attachments:
            for attachment in attachments:
                msg.attach(
                    filename=attachment["filename"],
                    content_type=attachment.get(
                        "content_type", "application/octet-stream"
                    ),
                    data=attachment["content"],
                )

        mail.send(msg)
        logger.info(f"Email sent to {recipients}: {subject}")
        return True

    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication failed: {e}")
        logger.error(
            "Please check your email credentials and enable 'App Passwords' for Gmail"
        )
        return False
    except smtplib.SMTPConnectError as e:
        logger.error(f"SMTP Connection failed: {e}")
        logger.error("Please check your SMTP server settings and network connection")
        return False
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error occurred: {e}")
        return False
    except socket.gaierror as e:
        logger.error(f"Network error - could not resolve SMTP server: {e}")
        return False
    except ConnectionRefusedError as e:
        logger.error(f"Connection refused by SMTP server: {e}")
        logger.error(
            "This often happens when firewall blocks SMTP or wrong port is used"
        )
        return False
    except Exception as e:
        logger.error(f"Unexpected error sending email: {e}")
        return False
