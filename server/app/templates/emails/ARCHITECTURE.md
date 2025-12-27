# Email Template System Architecture

## How It Works (Visual Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│ FLASK ROUTE (app/apis/tenant.py)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Get user data from database                                 │
│  2. Prepare template variables                                  │
│     template_vars = {                                           │
│         "name": "John Doe",                                     │
│         "max_budget": 500000,                                   │
│         "location": "Lagos",                                    │
│         "dashboard_url": "https://kedusoft.com/..."             │
│     }                                                           │
│  3. Call send_email()                                           │
│     send_email(                                                 │
│         subject="...",                                          │
│         recipients=[user.email],                                │
│         template_name="onboarding_complete_email",              │
│         template_vars=template_vars  ← Variables passed here    │
│     )                                                           │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ MAILER FUNCTION (app/utils/mailer.py)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  render_template(                                               │
│      "emails/onboarding_complete_email.html",                   │
│      name="John Doe",        ← Variables unpacked               │
│      max_budget=500000,                                         │
│      location="Lagos",                                          │
│      dashboard_url="https://..."                                │
│  )                                                              │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ JINJA2 TEMPLATE ENGINE                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  {% extends "emails/base_email.html" %}  ← Inherit from base   │
│  {% block content %}                     ← Fill content block   │
│    <h2>Your preferences are set, {{ name }}.</h2>              │
│    <!-- name becomes "John Doe" -->                            │
│    <p>Budget: ₦{{ max_budget }}</p>                             │
│    <!-- max_budget becomes "₦500000" -->                        │
│  {% endblock %}                                                 │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼ (Renders complete HTML)
┌─────────────────────────────────────────────────────────────────┐
│ RENDERED HTML EMAIL                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  <!DOCTYPE html>                                                │
│  <html>                                                         │
│    <head>                                                       │
│      <title>Onboarding Complete - Kedusoft</title>             │
│      <style>... all common styles from base ...</style>         │
│    </head>                                                      │
│    <body>                                                       │
│      <div class="wrapper">                                      │
│        <div class="header">                                     │
│          <img src="logo.png" class="logo-img">                 │
│        </div>                                                   │
│        <div class="body-text">                                  │
│          <h2>Your preferences are set, John Doe.</h2>          │
│          <p>Budget: ₦500000</p>                                 │
│          <div class="btn-container">                            │
│            <a href="https://..." class="btn">                  │
│              Access Dashboard                                   │
│            </a>                                                 │
│          </div>                                                 │
│        </div>                                                   │
│        <div class="footer">...</div>                            │
│      </div>                                                     │
│    </body>                                                      │
│  </html>                                                        │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ SENDGRID API                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Sends rendered HTML to recipient email address                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ USER'S EMAIL INBOX                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📧 From: ifeanyi.onyekwelu@kedusoft.com                        │
│  Subject: Onboarding Completed - Your Matches are Ready!        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Kedusoft Logo]                                          │  │
│  │                                                          │  │
│  │ Your preferences are set, John Doe.                     │  │
│  │                                                          │  │
│  │ Thank you for completing your onboarding...            │  │
│  │                                                          │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ SEARCH CRITERIA SUMMARY                             │ │  │
│  │ │ Budget: ₦500000                                     │ │  │
│  │ │ Location: Lagos                                     │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │ [Access Dashboard Button]                              │  │
│  │                                                          │  │
│  │ Best regards,                                           │  │
│  │ The Kedusoft Team                                       │  │
│  │                                                          │  │
│  │ © 2025 Kedusoft Technologies                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Template Inheritance Tree

```
base_email.html (120 lines - used by all)
│
├─ Common HTML structure
│  └ DOCTYPE, head, body, wrapper
│
├─ Shared CSS (130+ lines)
│  ├ Layout (.wrapper, .main-content)
│  ├ Header (.header, .logo-img)
│  ├ Body text (.body-text, h2, p)
│  ├ Components (.highlight-box, .btn)
│  ├ Footer (.footer)
│  └ Mobile responsive (@media)
│
├─ Header section with logo
│
├─ Placeholder blocks for children
│  ├ {% block title %} ← Child specifies email type
│  ├ {% block extra_styles %} ← Child can add custom CSS
│  └ {% block content %} ← Child specifies unique content
│
└─ Footer with copyright
```

Child templates EXTEND this and only specify:
```
onboarding_complete_email.html (20 lines)
├─ {% extends "emails/base_email.html" %}
├─ {% block title %}Onboarding Complete...{% endblock %}
└─ {% block content %}Unique greeting and content{% endblock %}
```

---

## Variable Flow Diagram

```
Database Layer
│
├─ User Table: { id, first_name, email, ... }
├─ Recommendation Table: { user_id, min_budget, max_budget, preferred_locations, ... }
│
▼
Python Code (Flask Route)
│
├─ user = User.query.get(user_id)          # Get John Doe
├─ recommendation = get_recommendation()    # Get budget 500,000
│
├─ template_vars = {
│     "name": user.first_name,                      # "John Doe"
│     "max_budget": recommendation.max_budget,      # 500000
│     "location": recommendation.preferred_locations[0],  # "Lagos"
│     "dashboard_url": f"{SITE_URL}/tenants"        # URL
│  }
│
▼
Mailer Function (Flask Utility)
│
├─ render_template(
│     "emails/onboarding_complete_email.html",
│     **template_vars  # Unpack dict as kwargs
│  )
│
│  Equivalent to:
│  render_template(
│     "emails/onboarding_complete_email.html",
│     name="John Doe",
│     max_budget=500000,
│     location="Lagos",
│     dashboard_url="https://..."
│  )
│
▼
Jinja2 Template Engine
│
├─ Reads onboarding_complete_email.html
├─ Sees {% extends "emails/base_email.html" %}
│  └─ Loads base_email.html as parent
├─ Substitutes variables {{ name }} → "John Doe"
├─ Substitutes variables {{ max_budget }} → 500000
├─ Renders final HTML
│
▼
Rendered HTML
│
├─ All base styles applied
├─ All variables replaced
├─ Ready to send
│
▼
SendGrid API
│
├─ Sends HTML to user's email
│
▼
User Inbox
│
└─ Beautiful styled email with correct data
```

---

## Key Concepts

### Template Inheritance
- **Parent**: `base_email.html` - Common structure & styles
- **Child**: `onboarding_complete_email.html` - Specific content
- Child "extends" parent
- Child fills in "blocks" with custom content

### Variable Passing
- Flask route prepares data: `template_vars = {...}`
- Passes to `send_email(..., template_vars=template_vars)`
- Mailer renders template: `render_template("...", **template_vars)`
- Template accesses variables: `{{ variable_name }}`

### Jinja2 Blocks
```html
{% block blockname %}default content{% endblock %}
```
- Parent defines block
- Child overrides block with custom content
- Empty or default content if child doesn't override

---

## Files & Responsibilities

```
┌──────────────────────────────────────────────────┐
│ app/apis/tenant.py (Route)                       │
├──────────────────────────────────────────────────┤
│ Responsibility: PREPARE DATA                     │
│                                                  │
│ 1. Get user from database                        │
│ 2. Get recommendation from database              │
│ 3. Format data for template                      │
│ 4. Call send_email() with variables              │
│                                                  │
│ Example:                                         │
│ template_vars = {                                │
│     "name": user.first_name,                     │
│     "max_budget": 500000,                        │
│ }                                                │
│ send_email(..., template_vars=template_vars)     │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│ app/utils/mailer.py (Utility)                    │
├──────────────────────────────────────────────────┤
│ Responsibility: RENDER & SEND                    │
│                                                  │
│ 1. Receive template_vars from route              │
│ 2. Render template with variables                │
│ 3. Create Mail object                            │
│ 4. Send via SendGrid                             │
│                                                  │
│ Key line:                                        │
│ html = render_template("emails/...", **vars)     │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│ app/templates/emails/base_email.html (Template) │
├──────────────────────────────────────────────────┤
│ Responsibility: COMMON STRUCTURE & STYLES        │
│                                                  │
│ Contains:                                        │
│ - HTML structure (wrapper, header, footer)       │
│ - All CSS styles (layout, colors, responsive)    │
│ - Jinja2 blocks for children                     │
│ - Logo and footer                                │
│                                                  │
│ Blocks defined:                                  │
│ - {% block title %}                              │
│ - {% block extra_styles %}                       │
│ - {% block content %} ← Main customization       │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│ app/templates/emails/onboarding_complete...html  │
├──────────────────────────────────────────────────┤
│ Responsibility: UNIQUE CONTENT                   │
│                                                  │
│ Contains:                                        │
│ - {% extends "emails/base_email.html" %}         │
│ - {% block title %}Onboarding Complete...{% %}   │
│ - {% block content %}...{% %}                    │
│   - Uses {{ name }} from template_vars           │
│   - Uses {{ max_budget }} from template_vars     │
│   - Custom greeting and content                  │
│                                                  │
│ Size: 20 lines (vs 180 before refactoring)      │
└──────────────────────────────────────────────────┘
```

---

## Data Flow Summary

```
User Action (Completes Onboarding)
        │
        ▼
Flask Route Handler
        │
        ├─ Query: user = User.query.get(user_id)
        ├─ Query: recommendation = get_recommendation()
        │
        ├─ Format: name = user.first_name
        ├─ Format: max_budget = recommendation.max_budget
        │
        └─ Call: send_email(
             template_name="onboarding_complete_email",
             template_vars={
                 "name": "John Doe",
                 "max_budget": 500000,
                 "location": "Lagos",
                 "dashboard_url": "https://...",
             }
          )
        │
        ▼
Mailer Function
        │
        ├─ Receive template_vars
        │
        └─ Call: render_template(
             "emails/onboarding_complete_email.html",
             name="John Doe",           ← Unpacked from dict
             max_budget=500000,
             location="Lagos",
             dashboard_url="https://...",
          )
        │
        ▼
Jinja2 Engine
        │
        ├─ Load: onboarding_complete_email.html
        │
        ├─ Process: {% extends "emails/base_email.html" %}
        │        ▼ Load parent template
        │        └─ Inherit all HTML structure & CSS
        │
        ├─ Process: {% block content %}
        │        ▼ Replace with child's content
        │        ├─ {{ name }} → "John Doe"
        │        ├─ {{ max_budget }} → 500000
        │        └─ Render HTML with actual values
        │
        └─ Return: Complete rendered HTML
        │
        ▼
SendGrid API
        │
        └─ Send email with HTML to user's inbox
```

---

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Lines per email** | 180 | 20 |
| **CSS locations** | Each file | 1 file (base) |
| **Change impact** | 10+ files | 1 file |
| **Time to add email** | 10 min | 2 min |
| **Code duplication** | High | Minimal |
| **Maintainability** | Hard | Easy |
| **Consistency** | Manual | Automatic |
| **Learning curve** | Steep | Gentle |

✨ **Result: Professional, scalable, maintainable email system!**
