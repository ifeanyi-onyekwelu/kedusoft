from flask import Flask, render_template, current_app
from flask_mail import Mail, Message
import logging
import smtplib
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask-Mail (keep for backward compatibility)
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
    Send email using direct SMTP (more reliable than Flask-Mail)

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
        # Get configuration
        mail_server = current_app.config.get("MAIL_SERVER")
        mail_port = current_app.config.get("MAIL_PORT")
        mail_username = current_app.config.get("MAIL_USERNAME")
        mail_password = current_app.config.get("MAIL_PASSWORD")

        logger.info(f"Sending email via {mail_server}:{mail_port} from {mail_username}")

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
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender or mail_username
        msg["To"] = ", ".join(recipients)

        # Attach content
        if is_html:
            html_part = MIMEText(content, "html")
            msg.attach(html_part)
        else:
            text_part = MIMEText(content, "plain")
            msg.attach(text_part)

        # Add attachments if provided
        if attachments:
            for attachment in attachments:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment["content"])
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f'attachment; filename= {attachment["filename"]}',
                )
                msg.attach(part)

        # Send email using direct SMTP
        server = smtplib.SMTP(mail_server, mail_port, timeout=10)
        server.starttls()  # Enable encryption
        server.login(mail_username, mail_password)
        server.send_message(msg)
        server.quit()

        logger.info(f"Email sent successfully to {recipients}: {subject}")
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
    except socket.timeout as e:
        logger.error(f"SMTP connection timeout: {e}")
        logger.error(
            "Railway may be blocking SMTP. Consider using SendGrid or Mailgun instead"
        )
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
