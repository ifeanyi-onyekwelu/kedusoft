# Email Template System - Complete Reference

## What You Get

✅ **Base Email Template** - `base_email.html`
- Single source of truth for all email styling
- 120 lines of HTML + CSS (vs 180 lines per email before)
- Responsive design for mobile
- Professional branded layout

✅ **Refactored Email Templates**
- `onboarding_complete_email.html` - Reduced to 20 lines
- `welcome.html` - Reduced to 18 lines
- `reset_password.html` - Reduced to 15 lines

✅ **Flask Integration Ready**
- `mailer.py` already supports template variables
- `send_email()` function renders templates
- Works with Jinja2 template inheritance

---

## How to Use

### 1. Send an Email with Variables

```python
from app.utils.mailer import send_email

# Route handler
@app.route("/complete-onboarding", methods=["POST"])
def complete_onboarding():
    user = get_user()
    recommendation = get_recommendation()

    # Prepare template variables
    template_vars = {
        "name": user.first_name,
        "max_budget": recommendation.max_budget,
        "location": recommendation.preferred_locations[0],
        "dashboard_url": f"{SITE_URL}/tenants",
    }

    # Send email with variables
    send_email(
        subject="Onboarding Completed - Your Matches are Ready!",
        recipients=[user.email],
        template_name="onboarding_complete_email",  # File: onboarding_complete_email.html
        template_vars=template_vars,  # Variables passed here
    )

    return {"status": "success"}
```

### 2. Access Variables in Template

```html
<!-- File: templates/emails/onboarding_complete_email.html -->
{% extends "emails/base_email.html" %}

{% block title %}Onboarding Complete - Kedusoft{% endblock %}

{% block content %}
<!-- Variables are automatically available -->
<h2>Your preferences are set, {{ name }}.</h2>

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

---

## Template Structure

### Extends Pattern
```html
{% extends "emails/base_email.html" %}
```
- Imports all HTML structure and CSS from base
- Imports header, footer, and layout
- Inherits responsive design

### Block Pattern
```html
{% block title %}Email Title{% endblock %}
{% block content %}Unique content here{% endblock %}
```
- `title` block - Sets page title (shown in email client)
- `content` block - Main email content (REQUIRED)
- `extra_styles` block - Optional custom CSS

### Variable Pattern
```html
{{ variable_name }}
```
- Automatically replaced with values from `template_vars` dict
- Syntax: `{{ key_from_dict }}`
- Example: `{{ name }}` → "John Doe"

---

## Complete Example: Create New Email

### Scenario: Send application status email

**Step 1: Create template file**
```html
<!-- File: app/templates/emails/application_status.html -->
{% extends "emails/base_email.html" %}

{% block title %}Application Status Update - Kedusoft{% endblock %}

{% block content %}
<h2>Application Status Update</h2>
<p>Hi {{ tenant_name }},</p>
<p>Your application for {{ property_name }} has been {{ status }}.</p>

<div class="highlight-box">
  <div class="summary-label">APPLICATION DETAILS</div>
  <p class="summary-value">
    Property: {{ property_name }}<br>
    Status: {{ status }}<br>
    Updated: {{ updated_date }}
  </p>
</div>

{% if status == "approved" %}
<p>Congratulations! The landlord would like to proceed. Click below to schedule a viewing.</p>
<a href="{{ viewing_link }}" class="btn">Schedule Viewing</a>
{% elif status == "rejected" %}
<p>Unfortunately, your application was not accepted. Please check other available properties.</p>
<a href="{{ browse_link }}" class="btn">Browse Properties</a>
{% endif %}
{% endblock %}
```

**Step 2: Send from Flask route**
```python
# In app/apis/tenant.py
from app.utils.mailer import send_email

@tenant.route("/applications/<app_id>/check-status", methods=["GET"])
@jwt_required()
def check_application_status(app_id):
    application = get_application(app_id)
    tenant = get_current_user()
    property = get_property(application.property_id)

    # Build variables
    template_vars = {
        "tenant_name": tenant.first_name,
        "property_name": property.name,
        "status": application.status,  # "approved" or "rejected"
        "updated_date": application.updated_at.strftime("%B %d, %Y"),
        "viewing_link": f"{SITE_URL}/applications/{app_id}/viewing",
        "browse_link": f"{SITE_URL}/properties",
    }

    # Send email
    send_email(
        subject=f"Application Status: {property.name}",
        recipients=[tenant.email],
        template_name="application_status",
        template_vars=template_vars,
    )

    return {"status": "email_sent"}
```

---

## Jinja2 Quick Reference

### Basic Syntax
```html
<!-- Variables -->
{{ name }}                          <!-- Output: John -->
{{ user.email }}                    <!-- Output: john@example.com -->

<!-- Filters -->
{{ name|upper }}                    <!-- Output: JOHN -->
{{ price|default:0 }}               <!-- Output: 100 (or 0 if empty) -->
{{ date|strftime('%Y-%m-%d') }}     <!-- Output: 2025-12-27 -->

<!-- Conditionals -->
{% if status == "approved" %}
  <p>Congratulations!</p>
{% elif status == "pending" %}
  <p>Still reviewing...</p>
{% else %}
  <p>Better luck next time.</p>
{% endif %}

<!-- Loops -->
{% for item in items %}
  <p>{{ item.name }}</p>
{% endfor %}

<!-- Comments -->
{# This is a comment and won't appear #}
```

### Template Inheritance
```html
<!-- Parent: base_email.html -->
{% block title %}Default Title{% endblock %}
{% block content %}{% endblock %}

<!-- Child: welcome.html -->
{% extends "emails/base_email.html" %}
{% block title %}Welcome to Kedusoft{% endblock %}
{% block content %}<p>Hello {{ name }}</p>{% endblock %}
```

---

## Common CSS Classes

Use these in your `{% block content %}` to style content:

```html
<h2>Heading</h2>
<p>Normal paragraph</p>

<!-- Highlighted info box -->
<div class="highlight-box">
  <div class="summary-label">LABEL TEXT</div>
  <p class="summary-value">Important value</p>
</div>

<!-- Button -->
<div class="btn-container">
  <a href="{{ link }}" class="btn">Button Text</a>
</div>

<!-- Divider -->
<hr>

<!-- Small text -->
<p style="font-size: 12px; color: #9ca3af;">Small footnote</p>
```

---

## Error Handling

### If Template Doesn't Render
```python
try:
    send_email(
        subject="...",
        recipients=[user.email],
        template_name="template_name",
        template_vars=template_vars,
    )
except Exception as e:
    # Log error
    print(f"Failed to send email: {e}")
    # Handle gracefully
    return {"error": "Could not send email"}
```

### Common Issues
| Issue | Cause | Fix |
|-------|-------|-----|
| Variables empty | Not in template_vars dict | Add to dict |
| Template not found | Wrong template_name | Check filename |
| Styling broken | Not in `{% block content %}` | Use correct block |
| Email not sent | Missing recipients | Check email list |

---

## Performance Tips

1. **Batch send emails** - Send multiple emails in loop efficiently
   ```python
   for user in users:
       send_email(...)  # Each call queues async
   ```

2. **Prepare variables once** - Build dict before loop
   ```python
   base_vars = {"dashboard_url": DASHBOARD_URL}
   for user in users:
       vars = {**base_vars, "name": user.name}
       send_email(..., template_vars=vars)
   ```

3. **Use SendGrid async** - Emails send in background, don't block request

---

## File Checklist

✅ `base_email.html` - Base template with all common styles
✅ `onboarding_complete_email.html` - Extends base, 20 lines
✅ `welcome.html` - Extends base, 18 lines
✅ `reset_password.html` - Extends base, 15 lines
✅ `mailer.py` - send_email() function (already supports variables)
✅ Documentation files:
  - `QUICKSTART.md` - 60 second guide
  - `EMAIL_TEMPLATE_GUIDE.md` - Complete reference
  - `REFACTORING_GUIDE.md` - Before/after comparison
  - `ARCHITECTURE.md` - Visual flow diagrams

---

## Quick Commands

### Create new email template
1. Create `app/templates/emails/your_email_name.html`
2. Add `{% extends "emails/base_email.html" %}`
3. Add `{% block title %}Title{% endblock %}`
4. Add `{% block content %}Content with {{ variables }}{% endblock %}`

### Send email from Flask
1. Import: `from app.utils.mailer import send_email`
2. Prepare: `template_vars = {"name": value, ...}`
3. Send: `send_email(..., template_name="...", template_vars=template_vars)`

---

## Support

For questions:
1. Check `QUICKSTART.md` for 60-second guide
2. Check `EMAIL_TEMPLATE_GUIDE.md` for detailed docs
3. Check `ARCHITECTURE.md` for visual explanations
4. Check existing templates as examples

---

## Summary

| Item | Details |
|------|---------|
| **Architecture** | Template inheritance (Jinja2) |
| **Base Template** | `base_email.html` (120 lines) |
| **Child Templates** | Extend base (15-20 lines each) |
| **Variable Passing** | Flask route → mailer → template |
| **Flask Integration** | `send_email(..., template_vars={})` |
| **Email Client** | SendGrid |
| **Styling** | CSS in base template |
| **Mobile** | Responsive design included |
| **Time to add email** | 2 minutes |
| **Reduction** | 89% fewer lines per email |

---

**Your email system is now professional, scalable, and maintainable!** 🚀

Start sending emails with variables today:
```python
send_email(
    subject="Your Subject",
    recipients=[user.email],
    template_name="your_template_name",
    template_vars={"name": user.name, "url": some_url},
)
```

That's all! 😊
