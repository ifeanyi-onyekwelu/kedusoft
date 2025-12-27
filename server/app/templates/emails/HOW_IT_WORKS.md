# ANNOTATED: How send_email() Works with Template Variables

## The send_email() Function (With Comments)

```python
from flask import Flask, render_template, current_app
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(
    subject: str,
    recipients: list,
    template_name: str = None,      # ← "onboarding_complete_email"
    template_vars: dict = None,     # ← {"name": "John", "max_budget": 500000}
    body: str = None,
    sender: str = None,
) -> bool:
    """
    Send email using SendGrid with Jinja2 template rendering

    The key insight: This function bridges Flask routes and email templates
    """
    try:
        # Get SendGrid API key
        sg_api_key = current_app.config.get("SENDGRID_API_KEY")
        if not sg_api_key:
            logger.error("SendGrid API key not configured")
            return False

        # STEP 1: RENDER TEMPLATE WITH VARIABLES
        # =========================================
        if template_name:
            try:
                # KEY LINE - This is where the magic happens:
                html_content = render_template(
                    f"emails/{template_name}.html",      # ← Load: onboarding_complete_email.html
                    **(template_vars or {})              # ← Unpack dict as kwargs
                )

                # If template_vars = {"name": "John", "max_budget": 500000}
                # This becomes: render_template("...", name="John", max_budget=500000)

                # Jinja2 then:
                # 1. Loads onboarding_complete_email.html
                # 2. Loads base_email.html (from {% extends %})
                # 3. Substitutes {{ name }} → "John"
                # 4. Substitutes {{ max_budget }} → 500000
                # 5. Returns rendered HTML with all variables replaced

            except Exception as e:
                logger.error(f"Error rendering template {template_name}: {e}")
                html_content = body or ""  # Fallback to plain text
        else:
            html_content = body or ""  # Use provided body if no template

        # STEP 2: CREATE EMAIL OBJECT
        # ============================
        from_email = sender or "ifeanyi.onyekwelu@kedusoft.com"

        mail = Mail(
            from_email=from_email,
            to_emails=recipients if isinstance(recipients, list) else [recipients],
            subject=subject,
            html_content=html_content,  # ← This is the rendered HTML with variables
        )

        # STEP 3: SEND VIA SENDGRID
        # ==========================
        sg = SendGridAPIClient(sg_api_key)
        response = sg.send(mail)

        # Check if successful
        if response.status_code in [200, 201, 202]:
            logger.info(f"Email sent successfully to {recipients}: {subject}")
            return True
        else:
            logger.error(f"SendGrid returned status code {response.status_code}")
            return False

    except Exception as e:
        logger.error(f"Error sending email via SendGrid: {e}")
        return False
```

---

## Real Example: How Variables Flow Through

### 1. Flask Route Calls send_email()
```python
# File: app/apis/tenant.py
from app.utils.mailer import send_email

@tenant.route("/recommendations", methods=["POST"])
@jwt_required()
@role_required("tenant")
def create_recommendation():
    user_id, _, _ = get_logged_in_user()
    user = get_user(user_id)

    # ... create recommendation ...

    # PREPARE TEMPLATE VARIABLES
    template_vars = {
        "name": user.first_name,                    # ← "John"
        "max_budget": recommendation.max_budget,    # ← 500000
        "location": recommendation.preferred_locations[0],  # ← "Lagos"
        "dashboard_url": f"{SITE_URL}/tenants",     # ← "https://kedusoft.com/..."
    }

    # CALL send_email WITH VARIABLES
    send_email(
        subject="Onboarding Completed - Your Matches are Ready!",
        recipients=[user.email],              # ← ["john@example.com"]
        template_name="onboarding_complete_email",  # ← Filename
        template_vars=template_vars,          # ← Dictionary of values
    )
```

### 2. mailer.py Receives and Renders
```python
# Inside send_email() function
def send_email(
    subject="Onboarding Completed - Your Matches are Ready!",
    recipients=["john@example.com"],
    template_name="onboarding_complete_email",
    template_vars={"name": "John", "max_budget": 500000, "location": "Lagos", "dashboard_url": "https://..."},
):
    # UNPACK template_vars as keyword arguments
    html_content = render_template(
        "emails/onboarding_complete_email.html",
        # Equivalent to:
        # name="John"
        # max_budget=500000
        # location="Lagos"
        # dashboard_url="https://..."
    )
```

### 3. Flask's Jinja2 Renders Template
```
Step A: Load template file
    └─ Reads: app/templates/emails/onboarding_complete_email.html

Step B: Process {% extends %}
    └─ {% extends "emails/base_email.html" %}
    └─ Loads parent template: app/templates/emails/base_email.html

Step C: Get all variables from function kwargs
    └─ name = "John"
    └─ max_budget = 500000
    └─ location = "Lagos"
    └─ dashboard_url = "https://..."

Step D: Substitute {{ }} variables in child template
    Child template has:
    <h2>Your preferences are set, {{ name }}.</h2>
                                    ↓ Substitution
    <h2>Your preferences are set, John.</h2>

    <p>Budget: ₦{{ max_budget }}</p>
                  ↓ Substitution
    <p>Budget: ₦500000</p>

Step E: Substitute {{ }} variables in parent template blocks
    Base template has:
    <div class="header">
        <img src="..." alt="Kedusoft" class="logo-img">
    </div>

    (No variables in base - just structure and CSS)

Step F: Combine parent and child
    Jinja2 merges:
    - Parent HTML structure
    - Parent CSS styles
    - Child {{ block content }} with substituted variables

    Result:
    <!DOCTYPE html>
    <html>
        <head>
            <style>...all base styles...</style>
        </head>
        <body>
            <div class="wrapper">
                <div class="header">
                    <img src="..." alt="Kedusoft">
                </div>
                <div class="body-text">
                    <!-- From {% block content %} with substitutions -->
                    <h2>Your preferences are set, John.</h2>
                    <p>Budget: ₦500000</p>
                    <p>Location: Lagos</p>
                    <!-- etc -->
                </div>
                <div class="footer">
                    <p>&copy; 2025 Kedusoft...</p>
                </div>
            </div>
        </body>
    </html>

Step G: Return rendered HTML
    └─ html_content = "<DOCTYPE>...rendered HTML...</html>"
```

### 4. mailer.py Sends the Rendered HTML
```python
# Back in send_email()
html_content = "<DOCTYPE>...with all variables substituted...</html>"

mail = Mail(
    from_email="noreply@kedusoft.com",
    to_emails=["john@example.com"],
    subject="Onboarding Completed - Your Matches are Ready!",
    html_content=html_content,  # ← Fully rendered HTML with variables
)

sg = SendGridAPIClient(api_key)
response = sg.send(mail)  # ← Email sent to SendGrid
```

### 5. User Receives Email
```
From: noreply@kedusoft.com
To: john@example.com
Subject: Onboarding Completed - Your Matches are Ready!

┌─────────────────────────────────────────┐
│ [Kedusoft Logo]                         │
│                                         │
│ Your preferences are set, John.         │ ← {{ name }} substituted
│                                         │
│ Thank you for completing onboarding... │
│                                         │
│ SEARCH CRITERIA SUMMARY                │
│ Budget: ₦500000                        │ ← {{ max_budget }} substituted
│ Location: Lagos                        │ ← {{ location }} substituted
│                                         │
│ [Access Dashboard Button]               │ ← {{ dashboard_url }} substituted
│ https://kedusoft.com/tenants           │
│                                         │
│ © 2025 Kedusoft Technologies           │
└─────────────────────────────────────────┘
```

---

## Key Points

### How **template_vars** Becomes **function arguments**
```python
template_vars = {
    "name": "John",
    "max_budget": 500000,
}

# This line:
render_template("emails/template.html", **(template_vars))

# Is equivalent to:
render_template(
    "emails/template.html",
    name="John",
    max_budget=500000,
)

# The ** unpacks the dict as keyword arguments
```

### How **Jinja2** accesses variables
```html
<!-- In the template, use {{ }} to access arguments -->
{{ name }}        <!-- Accesses: name="John" → outputs: John -->
{{ max_budget }}  <!-- Accesses: max_budget=500000 → outputs: 500000 -->
```

### The **Template Inheritance** Process
```
1. Template calls: {% extends "emails/base_email.html" %}
2. Flask loads parent template
3. Flask loads child template
4. Flask substitutes all {{ }} in both templates using the variables
5. Flask merges parent + child (child's {% block %} overrides parent's)
6. Returns final HTML string
```

---

## Debug Tips

### To see what variables are being passed:
```python
print(f"Template vars: {template_vars}")
# Output: Template vars: {'name': 'John', 'max_budget': 500000, ...}
```

### To check if template rendered correctly:
```python
html_content = render_template(
    "emails/onboarding_complete_email.html",
    **template_vars
)
print(html_content[:500])  # Print first 500 chars
# Should show: <!DOCTYPE html><html>...<h2>Your preferences are set, John.</h2>...
```

### To verify variables are substituted:
```python
# Check if variable appears in rendered HTML
if "John" in html_content:
    print("✓ Name substituted correctly")
else:
    print("✗ Name NOT substituted - check template_vars")
```

---

## Summary

**The Flow:**
```
Flask Route
    ↓ template_vars dict
send_email() function
    ↓ unpacks dict as kwargs
render_template() (Jinja2)
    ↓ substitutes {{ }} with variable values
Rendered HTML string
    ↓ HTML with all variables replaced
SendGrid API
    ↓ sends email
User Inbox
    ↓ receives email with correct data
```

**Key Insights:**
1. `template_vars` dict holds the data
2. `**(dict)` unpacks dict as keyword arguments
3. Jinja2 templates access kwargs via `{{ key_name }}`
4. Base template provides structure + CSS
5. Child template provides unique content
6. All variables substituted before sending
7. SendGrid receives fully rendered HTML

**That's how Flask variables get into email templates!** 🚀
