# Email Template Refactoring - Before & After

## The Problem: Repetition
Each email template was a complete 180+ line HTML file with duplicated:
- DOCTYPE, head, meta tags
- Common CSS (styles for wrapper, header, footer, buttons)
- Logo, header section
- Footer with copyright
- Same responsive design media queries

## The Solution: Template Inheritance

### BEFORE (Old Way - Repetitive)
File: `onboarding_complete_email.html` (180 lines)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kedusoft</title>
  <style>
    /* 130+ lines of CSS */
    body { margin: 0; padding: 0; ... }
    .wrapper { width: 100%; ... }
    .main-content { max-width: 600px; ... }
    /* ... tons of repeating styles ... */
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="main-content">
      <div class="header">
        <img src="..." alt="Kedusoft" class="logo-img">
      </div>
      <div class="body-text">
        <!-- Only this part is unique! -->
        <h2>Your preferences are set, {{ name }}.</h2>
        <p>Thank you for completing your onboarding...</p>
        <!-- ... -->
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2025 Kedusoft Technologies. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

**Problems:**
- ❌ 180 lines of code for ~20 lines of unique content
- ❌ Styling changes must be made in 10+ different files
- ❌ Hard to maintain consistency
- ❌ Easy to introduce bugs when copying/pasting

---

### AFTER (New Way - DRY Principle)

#### Base Template: `base_email.html` (120 lines)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}Kedusoft{% endblock %}</title>
  <style>
    /* Common styles - defined ONCE */
    body { margin: 0; padding: 0; ... }
    .wrapper { width: 100%; ... }
    /* ... all common styles ... */
    {% block extra_styles %}{% endblock %}
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="main-content">
      <div class="header">
        <img src="..." alt="Kedusoft" class="logo-img">
      </div>

      <div class="body-text">
        {% block content %}{% endblock %}  <!-- Child templates fill this -->

        <hr>
        <p style="font-size: 13px;">
          Best regards,<br>
          <strong>The Kedusoft Team</strong>
        </p>
      </div>
    </div>

    <div class="footer">
      <p>&copy; 2025 Kedusoft Technologies. All rights reserved.</p>
      <p>Lagos, Nigeria | <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
```

#### Child Template: `onboarding_complete_email.html` (20 lines)
```html
{% extends "emails/base_email.html" %}

{% block title %}Onboarding Complete - Kedusoft{% endblock %}

{% block content %}
<h2>Your preferences are set, {{ name }}.</h2>
<p>Thank you for completing your onboarding. Our matching engine has analyzed your requirements...</p>

<div class="highlight-box">
  <div class="summary-label">Search Criteria Summary</div>
  <p class="summary-value">
    Budget: ₦{{ max_budget }}<br>
    Location: {{ location }}
  </p>
</div>

<p>You can now access your dashboard...</p>

<div class="btn-container">
  <a href="{{ dashboard_url }}" class="btn">Access Dashboard</a>
</div>
{% endblock %}
```

**Benefits:**
- ✅ 20 lines vs 180 lines (89% reduction!)
- ✅ Update styling once, applies to all emails
- ✅ Easy to create new email templates
- ✅ Consistent look and feel across all emails
- ✅ Maintainable and testable

---

## How Variables Are Passed

### Flask Route
```python
from .utils.mailer import send_email

# Prepare variables
template_vars = {
    "name": user.first_name,
    "max_budget": recommendation.max_budget,
    "location": recommendation.preferred_locations[0],
    "dashboard_url": f"{SITE_URL}/tenants",
}

# Send email
send_email(
    subject="Onboarding Completed - Your Matches are Ready!",
    recipients=[user.email],
    template_name="onboarding_complete_email",  # File: onboarding_complete_email.html
    template_vars=template_vars,  # ← Variables passed here
)
```

### Mailer Function (`utils/mailer.py`)
```python
def send_email(
    subject: str,
    recipients: list,
    template_name: str = None,
    template_vars: dict = None,
    body: str = None,
    sender: str = None,
) -> bool:
    # ... validation code ...

    # Render template with variables
    html_content = render_template(
        f"emails/{template_name}.html",
        **(template_vars or {})  # ← Variables unpacked here
    )

    # Send via SendGrid
    mail = Mail(
        from_email=from_email,
        to_emails=recipients,
        subject=subject,
        html_content=html_content,  # ← Rendered HTML sent
    )

    sg = SendGridAPIClient(sg_api_key)
    response = sg.send(mail)
```

### Template File
```html
<!-- Variables are accessed directly via {{ }} -->
{{ name }}          <!-- → "John Doe" -->
{{ max_budget }}    <!-- → 500000 -->
{{ location }}      <!-- → "Lagos" -->
{{ dashboard_url }} <!-- → "https://kedusoft.com/tenants" -->
```

---

## Template Hierarchy

```
base_email.html (120 lines - common for ALL emails)
├── onboarding_complete_email.html (20 lines - unique content)
├── welcome.html (20 lines - unique content)
├── reset_password.html (18 lines - unique content)
├── property_approved.html (25 lines - unique content)
├── property_rejected.html (22 lines - unique content)
└── ... other templates
```

---

## Refactoring Checklist

For each email template, follow these steps:

1. **Identify unique content** - What's different from other emails?
2. **Extract to child template** - Keep only unique `{% block content %}`
3. **Use extends** - Add `{% extends "emails/base_email.html" %}` at top
4. **Use blocks** - Define `{% block title %}` and `{% block content %}`
5. **Remove duplicate CSS** - Delete all common styles (now in base)
6. **Remove HTML structure** - Delete DOCTYPE, head, body, footer (now in base)
7. **Add variables** - Use `{{ variable_name }}` for Flask-passed values

---

## File Size Comparison

| Email Template | Before | After | Reduction |
|---|---|---|---|
| onboarding_complete_email.html | 180 lines | 20 lines | 89% ↓ |
| welcome.html | 180 lines | 18 lines | 90% ↓ |
| reset_password.html | 180 lines | 15 lines | 92% ↓ |
| property_approved.html | 180 lines | 22 lines | 88% ↓ |
| property_rejected.html | 180 lines | 20 lines | 89% ↓ |
| **TOTAL** | **~1,800 lines** | **~1,120 lines** | **38% ↓** |

---

## Best Practices

### ✅ DO
```html
<!-- Use extends for all child templates -->
{% extends "emails/base_email.html" %}

<!-- Set block title -->
{% block title %}Email Purpose - Kedusoft{% endblock %}

<!-- Only define unique content -->
{% block content %}
<h2>Greeting</h2>
<p>Content specific to this email type</p>
<a href="{{ link }}" class="btn">Action</a>
{% endblock %}
```

### ❌ DON'T
```html
<!-- Don't repeat HTML structure -->
<!DOCTYPE html>
<html>
<head>...</head>
<body>
...all the styling again...
</body>
</html>

<!-- Don't hardcode values -->
<p>Hello John</p>

<!-- Don't duplicate CSS -->
<style>body { margin: 0; }</style>
```

---

## Adding Variables in Flask

### Pattern for Different Email Types

**Onboarding Email:**
```python
send_email(
    subject="Your Onboarding is Complete",
    recipients=[user.email],
    template_name="onboarding_complete_email",
    template_vars={
        "name": user.first_name,
        "max_budget": user_budget,
        "location": user_location,
        "dashboard_url": dashboard_url,
    }
)
```

**Password Reset Email:**
```python
send_email(
    subject="Reset Your Password",
    recipients=[user.email],
    template_name="reset_password",
    template_vars={
        "name": user.first_name,
        "reset_link": reset_token_url,
    }
)
```

**Property Notification Email:**
```python
send_email(
    subject="Property Status Update",
    recipients=[user.email],
    template_name="property_approved",
    template_vars={
        "name": user.first_name,
        "property_name": property.name,
        "property_url": property_url,
        "next_step": "Schedule a viewing",
    }
)
```

---

## Summary

| Aspect | Before | After |
|---|---|---|
| Lines per template | 180 | 20 |
| Style maintenance | 10+ files | 1 file |
| Time to add email | 5 min (copy/paste) | 2 min (extend) |
| Consistency | Manual | Automatic |
| Variable passing | Hardcoded | Dynamic |
| Learning curve | Steep | Minimal |

**Result: Cleaner, more maintainable, scalable email system!** 🚀
