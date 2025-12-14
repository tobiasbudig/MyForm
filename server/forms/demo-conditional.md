---
title: "Conditional Logic Demo"
description: "Demonstrates conditional questions"
welcome:
  heading: "Conditional Questions Demo"
  body: "This form shows how questions can appear based on your answers."
  buttonText: "Start"
thankYou:
  heading: "Complete!"
  body: "Thank you for testing conditional questions."
---

# Do you use our service?
- type: single_choice
- id: use_service
- required: true
- options:
  - Yes
  - No

---

# How long have you been using it?
- type: single_choice
- depends_on: use_service
- show_when: Yes
- id: usage_duration
- required: true
- options:
  - Less than 3 months
  - 3-6 months
  - 6-12 months
  - Over a year

---

# Why haven't you tried it yet?
- type: long_text
- depends_on: use_service
- show_when: No
- id: why_not
- required: true
- placeholder: "Tell us what's holding you back..."

---

# What is your role?
- type: single_choice
- id: role
- required: true
- has_other: true
- options:
  - Developer
  - Designer
  - Manager
  - Executive

---

# Please specify your role
- type: short_text
- depends_on: role
- show_when: Other
- id: role_other
- required: true
- placeholder: "Enter your role..."

---

# Which features do you use?
- type: multiple_choice
- id: features
- required: true
- has_other: true
- options:
  - Dashboard
  - Reports
  - API
  - Integrations

---

# Please describe the other features
- type: long_text
- depends_on: features
- show_when: Other
- id: features_other
- required: true
- placeholder: "Describe the features you use..."
