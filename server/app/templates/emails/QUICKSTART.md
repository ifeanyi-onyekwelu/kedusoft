# Quick Start: Email Template System

## 3-Minute Overview

You now have a professional email template system with:
1. **Base Template** - Common HTML/CSS used by all emails
2. **Child Templates** - Unique content per email type
3. **Flask Integration** - Automatic variable substitution

## Create a New Email in 60 Seconds

### Step 1: Create Template File
File: `server/app/templates/emails/your_email_name.html`

```html
{% extends "emails/base_email.html" %}

{% block title %}Email Title - Kedusoft{% endblock %}

{% block content %}
<h2>Hello {{ name }},</h2>
<p>Your email content here with {{ variables }}.</p>

<div class="btn-container">
  <a href="{{ link }}" class="btn">Button Text</a>
</div>
{% endblock %}
```

### Step 2: Send from Flask
In your route (e.g., `app/apis/tenant.py`):

```python
from .utils.mailer import send_email

# Prepare variables
template_vars = {
    "name": user.first_name,
    "variables": some_value,
    "link": some_url,
}

# Send email
send_email(
    subject="Your Email Subject",
    recipients=[user.email],
    template_name="your_email_name",
    template_vars=template_vars,
)
```

Done! That's all you need.

---

## Available Template Blocks

In your `{% block content %}`, use these HTML classes:

```html
<h2>Heading</h2>
<p>Regular paragraph text.</p>

<!-- Highlight Box (for key info) -->
<div class="highlight-box">
  <div class="summary-label">LABEL</div>
  <p class="summary-value">Important value here</p>
</div>

<!-- Button -->
<div class="btn-container">
  <a href="{{ link }}" class="btn">Click Me</a>
</div>
```

---

## Common Variables Pattern

```python
# From database
user = get_user(user_id)
data = get_some_data()

# Prepare for template
template_vars = {
    "name": user.first_name,           # User's name
    "email": user.email,               # User's email
    "dashboard_url": "https://...",    # Link to dashboard
    "action_link": "https://...",      # Link to action
    # Add any other variables your template needs
}

# Send
send_email(
    subject="...",
    recipients=[user.email],
    template_name="template_name",
    template_vars=template_vars,
)
```

---

## File Structure

```
server/
├── app/
│   ├── apis/
│   │   └── tenant.py          # Where you call send_email()
│   ├── utils/
│   │   └── mailer.py          # send_email() function definition
│   └── templates/
│       └── emails/
│           ├── base_email.html                    # Base (extends nothing)
│           ├── onboarding_complete_email.html    # Extends base_email.html
│           ├── welcome.html                      # Extends base_email.html
│           ├── reset_password.html               # Extends base_email.html
│           └── ... other templates
```

---

## Jinja2 Syntax Cheat Sheet

```html
<!-- Variables -->
{{ variable_name }}

<!-- If statement -->
{% if condition %}
  <p>True branch</p>
{% endif %}

<!-- Loop -->
{% for item in items %}
  <p>{{ item }}</p>
{% endfor %}

<!-- Template inheritance -->
{% extends "emails/base_email.html" %}

<!-- Block definition -->
{% block blockname %}...{% endblock %}

<!-- Filter -->
{{ name|upper }}      <!-- UPPERCASE -->
{{ price|default:0 }} <!-- Default value -->
```

---

## Copy-Paste Example

### Creating a "Welcome Landlord" Email

**1. Create file:** `templates/emails/welcome_landlord.html`
```html
{% extends "emails/base_email.html" %}

{% block title %}Welcome to Kedusoft - Landlord Dashboard{% endblock %}

{% block content %}
<h2>Welcome to Kedusoft, {{ company_name }}!</h2>
<p>We're excited to help you manage your properties and connect with verified tenants.</p>

<div class="highlight-box">
  <div class="summary-label">YOUR DASHBOARD</div>
  <p class="summary-value">
    You now have access to list properties, manage applications, and track tenant interactions.
  </p>
</div>

<div class="btn-container">
  <a href="{{ landlord_dashboard_url }}" class="btn">Access Your Dashboard</a>
</div>
{% endblock %}
```

**2. Send from Flask:** In `app/apis/landlord.py`
```python
from .utils.mailer import send_email

# After landlord creates account
send_email(
    subject="Welcome to Kedusoft - Start Listing Properties",
    recipients=[landlord.email],
    template_name="welcome_landlord",
    template_vars={
        "company_name": landlord.company_name,
        "landlord_dashboard_url": f"{SITE_URL}/landlords",
    }
)
```

That's it! The email is sent with proper styling automatically.

---

## Common Patterns

### Greeting + Info + Link
```html
<h2>Hello {{ name }},</h2>
<p>Some information here.</p>

<div class="highlight-box">
  <div class="summary-label">IMPORTANT</div>
  <p class="summary-value">{{ important_value }}</p>
</div>

<a href="{{ action_url }}" class="btn">Take Action</a>
```

### Multiple Sections
```html
<h2>{{ main_heading }}</h2>

<h3>Section 1</h3>
<p>{{ section1_content }}</p>

<h3>Section 2</h3>
<p>{{ section2_content }}</p>

<a href="{{ link }}" class="btn">{{ button_text }}</a>
```

### Confirmation Email
```html
<h2>{{ action_name }} Confirmed</h2>
<p>This is to confirm that {{ action_description }}.</p>

<div class="highlight-box">
  <div class="summary-label">CONFIRMATION ID</div>
  <p class="summary-value">{{ confirmation_id }}</p>
</div>

<p>If you didn't perform this action, please contact us immediately.</p>
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Template not found | Check filename matches template_name param |
| Variables show as empty | Ensure they're in template_vars dict in Flask |
| Styling looks broken | Make sure you're in `{% block content %}` |
| Email not sending | Check console for mailer.py errors |

---

## Next Steps

1. **Review existing templates** - Check `onboarding_complete_email.html` as example
2. **Refactor other emails** - Follow same pattern for other email types
3. **Read full guide** - See `EMAIL_TEMPLATE_GUIDE.md` for detailed docs

You're all set! 🚀
