# Flask Email Template System Guide

## Overview
This system uses Jinja2 template inheritance to reduce email template duplication. All email templates extend from a base template that contains common styling and structure.

## Architecture

### 1. Base Template (`base_email.html`)
Contains:
- Common HTML structure (DOCTYPE, head, body)
- Shared CSS styles (header, footer, buttons, boxes)
- Reusable blocks that child templates can override:
  - `{% block title %}` - Page title
  - `{% block extra_styles %}` - Additional CSS for specific emails
  - `{% block content %}` - Main email content

### 2. Child Templates
Each email template extends the base and only defines what's unique to that email type.

**Example: `onboarding_complete_email.html`**
```html
{% extends "emails/base_email.html" %}

{% block title %}Onboarding Complete - Kedusoft{% endblock %}

{% block content %}
<h2>Your preferences are set, {{ name }}.</h2>
<p>Your email content here...</p>

<div class="highlight-box">
  <div class="summary-label">Search Criteria Summary</div>
  <p class="summary-value">
    Budget: ₦{{ max_budget }}<br>
    Location: {{ location }}
  </p>
</div>

<a href="{{ dashboard_url }}" class="btn">Access Dashboard</a>
{% endblock %}
```

## Flask Integration

### 1. Sending Emails with Variables

In your Flask route (`tenant.py`), prepare the template variables and pass them to `send_email()`:

```python
from .utils.mailer import send_email

# Prepare template variables
template_vars = {
    "name": user.first_name,
    "max_budget": recommendation.max_budget,
    "location": recommendation.preferred_locations[0] if recommendation.preferred_locations else "your preferred areas",
    "dashboard_url": f"{SITE_URL}/tenants",
}

# Send email - the mailer renders the template with these variables
send_email(
    subject="Onboarding Completed - Your Matches are Ready!",
    recipients=[user.email],
    template_name="onboarding_complete_email",  # Without .html extension
    template_vars=template_vars,  # Jinja2 automatically passes these to template
)
```

### 2. The `send_email()` Function

Located in `utils/mailer.py`:

```python
def send_email(
    subject: str,
    recipients: list,
    template_name: str = None,
    template_vars: dict = None,
    body: str = None,
    sender: str = None,
) -> bool:
    """
    Send email using SendGrid

    Args:
        subject: Email subject line
        recipients: List of recipient email addresses
        template_name: Template filename (without .html) from templates/emails/ folder
        template_vars: Dictionary of variables to pass to the template
        body: Raw HTML body (if not using template)
        sender: Override sender email (default: noreply@kedusoft.com)
    """
    # ... implementation ...

    # Key line - Flask renders the template with template_vars
    html_content = render_template(
        f"emails/{template_name}.html",
        **(template_vars or {})
    )

    # Then sends via SendGrid
```

## Template Variables Pattern

### Common Variables Available in All Emails
These can be accessed in any child template:

```html
<!-- From Flask context -->
{{ name }}              <!-- User's name -->
{{ email }}            <!-- User's email -->
{{ dashboard_url }}    <!-- Link to dashboard -->
{{ logo_url }}         <!-- Logo image URL -->
```

### Email-Specific Variables
Define these in your Flask route based on the email type:

**Onboarding Email:**
```python
template_vars = {
    "name": user.first_name,
    "max_budget": user_budget,
    "location": user_location,
    "dashboard_url": dashboard_link,
}
```

**Password Reset Email:**
```python
template_vars = {
    "name": user.first_name,
    "reset_link": reset_token_url,
    "expiry_time": "24 hours",
}
```

## Creating New Email Templates

### Step 1: Create the template file
Create `templates/emails/your_email_name.html`:

```html
{% extends "emails/base_email.html" %}

{% block title %}Your Email Title - Kedusoft{% endblock %}

{% block extra_styles %}
<style>
  /* Add any custom styles specific to this email */
  .custom-box {
    background: #f0f0f0;
    padding: 20px;
  }
</style>
{% endblock %}

{% block content %}
<h2>Hello {{ name }},</h2>
<p>Your email content here...</p>

<!-- Use any variables passed from Flask -->
<div class="custom-box">
  <p>{{ variable_name }}</p>
</div>

<div class="btn-container">
  <a href="{{ action_url }}" class="btn">Call to Action</a>
</div>
{% endblock %}
```

### Step 2: Send from Flask
In your route:

```python
from .utils.mailer import send_email

template_vars = {
    "name": user.first_name,
    "variable_name": some_value,
    "action_url": some_url,
}

send_email(
    subject="Your Email Subject",
    recipients=[user.email],
    template_name="your_email_name",  # Matches the filename
    template_vars=template_vars,
)
```

## Available Template Blocks

In `base_email.html`:

```html
{% block title %}{% endblock %}       <!-- Override page title -->
{% block extra_styles %}{% endblock %} <!-- Add custom CSS -->
{% block content %}{% endblock %}     <!-- Main email content (REQUIRED) -->
```

## CSS Classes Available from Base Template

### Styling Classes
- `.wrapper` - Main email wrapper
- `.main-content` - Email container
- `.header` - Header section with logo
- `.body-text` - Main content area
- `.highlight-box` - Highlighted information box
- `.summary-label` - Label text in boxes
- `.summary-value` - Value text in boxes
- `.btn` - Call-to-action button
- `.btn-container` - Button wrapper
- `.footer` - Footer section

### Example Usage
```html
{% block content %}
<h2>Title</h2>
<p>Description</p>

<div class="highlight-box">
  <div class="summary-label">LABEL</div>
  <p class="summary-value">Value goes here</p>
</div>

<div class="btn-container">
  <a href="{{ url }}" class="btn">Button Text</a>
</div>
{% endblock %}
```

## Best Practices

1. **Always use template blocks** - Makes emails consistent and maintainable
2. **Pass variables from Flask** - Don't hardcode values in templates
3. **Use semantic variable names** - Clear what each variable represents
4. **Test rendered output** - Check HTML in email clients
5. **Mobile-responsive** - Base template includes @media queries
6. **Consistent styling** - Reuse existing classes from base template

## File Organization

```
server/app/templates/
├── emails/
│   ├── base_email.html                      # Base template (common styles/structure)
│   ├── onboarding_complete_email.html      # Extends base
│   ├── welcome.html                        # Extends base
│   ├── password_reset.html                 # Extends base
│   ├── property_approved.html              # Extends base
│   └── ... other email templates
```

## Benefits

✅ **DRY Principle** - Don't Repeat Yourself - common HTML/CSS in one place
✅ **Maintainability** - Update styling once, applies to all emails
✅ **Consistency** - All emails look professional and branded
✅ **Flexibility** - Each email can override styles with `{% block extra_styles %}`
✅ **Easy to Add** - New emails require minimal code
✅ **Flask Integration** - Variables automatically passed via `render_template()`
