# SendGrid Email Configuration

## Setup Complete ✅

Your Flask application is now configured to use SendGrid for email sending instead of SMTP Gmail.

## Configuration Details

### 1. Environment Variables (.env)
Make sure your `.env` file contains:
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

Get your SendGrid API key from:
- Go to https://app.sendgrid.com/
- Navigate to Settings > API Keys
- Create a new API key with Mail Send permissions

### 2. Flask App Integration
The `init_mail()` function in `app/__init__.py` automatically:
- Stores the SendGrid API key in Flask app config
- Initializes the mailer when the app starts

### 3. Usage Examples

#### Send email with template:
```python
from app.utils.mailer import send_email

send_email(
    subject="Welcome to Kedusoft",
    recipients=["user@example.com"],
    template_name="welcome",  # renders templates/emails/welcome.html
    template_vars={
        "user_name": "John Doe",
        "verification_link": "https://kedusoft.com/verify"
    }
)
```

#### Send plain text email:
```python
from app.utils.mailer import send_email

send_email(
    subject="Password Reset",
    recipients=["user@example.com"],
    body="<h1>Reset Your Password</h1><p>Click the link below...</p>"
)
```

#### Send to multiple recipients:
```python
from app.utils.mailer import send_email

send_email(
    subject="System Alert",
    recipients=["admin@example.com", "support@example.com"],
    body="<p>System maintenance scheduled for tomorrow.</p>"
)
```

#### Custom sender email:
```python
from app.utils.mailer import send_email

send_email(
    subject="Invoice",
    recipients=["customer@example.com"],
    body="<p>Your invoice is attached.</p>",
    sender="billing@kedusoft.com"
)
```

## Email Templates

Create HTML templates in `server/app/templates/emails/`:

**server/app/templates/emails/welcome.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome {{ user_name }}!</h1>
        <p>Thank you for joining Kedusoft.</p>
        <a href="{{ verification_link }}">Verify Your Email</a>
    </div>
</body>
</html>
```

## Response Codes
- `200`, `201`, `202` = Email sent successfully
- `4xx` = Client error (check your API key, sender email, recipient format)
- `5xx` = SendGrid server error (temporary issue)

## Troubleshooting

### SendGrid API Key not configured
- Check `.env` file has `SENDGRID_API_KEY`
- Make sure you ran `source .env` to load variables
- Restart the Flask app

### Invalid sender email
- Make sure sender email is verified in SendGrid
- Default sender `noreply@kedusoft.com` needs verification

### Template not found
- Check template path: `templates/emails/template_name.html`
- Use relative paths from Flask templates folder

### Bounced emails
- Ensure recipient email format is valid
- Check SendGrid bounce logs for details

## Files Modified
- ✅ `server/app/utils/mailer.py` - Switched from SMTP to SendGrid
- ✅ `server/app/__init__.py` - Removed SMTP config, kept init_mail()
- ✅ `server/app/utils/variables.py` - Already has SENDGRID_API_KEY

## Next Steps
1. Get your SendGrid API key from https://app.sendgrid.com/
2. Add it to your `.env` file
3. Start using `send_email()` in your routes!
