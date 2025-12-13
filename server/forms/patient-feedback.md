---
title: "Patient Feedback Survey"
description: "Help us improve your care experience"
welcome:
  heading: "Welcome to our Feedback Survey"
  body: "Your responses are anonymous and will help us improve our services. This survey takes approximately 5 minutes."
  buttonText: "Start Survey"
thankYou:
  heading: "Thank You!"
  body: "Your feedback has been submitted successfully. We appreciate your time and will use your input to improve our services."
---

# How would you rate your overall experience?
- type: nps
- required: true
- id: overall_experience
- help: "0 = Not at all likely, 10 = Extremely likely to recommend"

---

# How satisfied were you with the waiting time?
- type: likert
- required: true
- id: waiting_satisfaction
- scale: 5
- labels:
  - Very Dissatisfied
  - Dissatisfied
  - Neutral
  - Satisfied
  - Very Satisfied

---

# Which services did you use today?
- type: multiple_choice
- required: true
- id: services_used
- help: "Select all services you received"
- options:
  - General Consultation
  - Laboratory Tests
  - Imaging/Radiology
  - Pharmacy
  - Specialist Referral
  - Other

---

# How did you hear about us?
- type: single_choice
- required: false
- id: referral_source
- help: "Select the primary way you discovered our clinic"
- options:
  - Online Search
  - Friend or Family
  - Insurance Provider
  - Social Media
  - Advertisement
  - Other

---

# Please describe your experience briefly
- type: short_text
- required: false
- id: brief_experience
- placeholder: "Your answer here..."
- maxLength: 200

---

# Any additional comments or suggestions?
- type: long_text
- required: false
- id: additional_comments
- placeholder: "Share your thoughts..."
- help: "Feel free to provide any feedback that could help us serve you better"
- maxLength: 2000
