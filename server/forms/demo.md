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
- explaination: How did you liked the experience
- help: "0 means not likely, 10 means very likely"
- explanation: "Net Promoter Score (NPS) helps us understand customer loyalty and satisfaction. Your honest feedback enables us to improve our service and better serve our users."

---

# How satisfied are you with our service?
- type: likert
- required: false
- id: satisfaction
- explaination: Please rate us
- scale: 5
- labels:
  - Very Unsatisfied
  - Unsatisfied
  - Neutral
  - Satisfied
  - Very Satisfied

---

# How much do you agree with these statements?
- type: grid
- required: false
- id: satisfaction_grid
- help: "Rate each statement based on your experience"
- explanation: "Your feedback on these specific aspects helps us understand which areas we're excelling in and where we need to improve. Please rate each statement honestly."
- options:
  - Strongly Disagree
  - Disagree
  - Neutral
  - Agree
  - Strongly Agree
- statements:
  - The product is easy to use
  - The product meets my needs
  - The product is reliable
  - I would recommend this product

---

# Which features do you use?
- type: multiple_choice
- required: false
- id: features
- has_other: true
- help: "Select all that apply"
- explanation: "Knowing which features you use most helps us prioritize development efforts and ensure we're investing in the areas that matter most to our users. Feel free to select multiple options."
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
- has_other: true
- explanation: "Understanding your role helps us tailor our content, features, and communication to match your specific needs and use cases. This allows us to provide more relevant and valuable experiences."
- options:
  - Developer
  - Designer
  - Manager
  - Executive

---

# Please specify your role in Dev
- type: short_text
- depends_on: role
- show_when: Developer
- id: role_specify
- required: false
- placeholder: "Enter your specific role..."
- maxLength: 100

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
