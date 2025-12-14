---
title: "Demo Survey"
description: "Testing all question types"
welcome:
  heading: "Welcome to the Demo"
  body: "This survey demonstrates all available question types. It takes about 2 minutes to complete."
  buttonText: "Let's Go"
thankYou:
  heading: "All Done!"
  body: "Thanks for testing the demo survey. Your responses have been recorded."
---

# How likely are you to recommend us?
- type: nps
- required: false
- id: nps_score
- help: "0 means not likely, 10 means very likely"

---

# How satisfied are you with our service?
- type: likert
- required: false
- id: satisfaction
- scale: 5
- labels:
  - Very Unsatisfied
  - Unsatisfied
  - Neutral
  - Satisfied
  - Very Satisfied

---

# Which features do you use?
- type: multiple_choice
- required: false
- id: features
- help: "Select all that apply"
- options:
  - Dashboard
  - Reports
  - API
  - Integrations
  - Mobile App

---

# What is your role?
- type: single_choice
- required: false
- id: role
- options:
  - Developer
  - Designer
  - Manager
  - Executive
  - Other

---

# What is your name?
- type: short_text
- required: false
- id: name
- placeholder: "Enter your name"
- maxLength: 100

---

# Any feedback for us?
- type: long_text
- required: false
- id: feedback
- placeholder: "Share your thoughts..."
- help: "We read every piece of feedback"
- maxLength: 1000
