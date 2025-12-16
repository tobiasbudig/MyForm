---
title: "Demo Survey"
description: "Testing all question types"
welcome:
  heading: |
    Welcome to the
    Demo Survey
  body: "This survey demonstrates all available question types. It takes about 2 minutes to complete."
  buttonText: "Let's Go"
thankYou:
  heading: |
    All Done!
    Thank You!
  body: "Thanks for testing the demo survey. Your responses have been recorded."
---

# Willkommen zur Umfrage
- type: information
- description:
  Diese Umfrage demonstriert alle verfügbaren Fragetypen.

  Sie dauert etwa 2 Minuten und zeigt verschiedene Möglichkeiten der Datenerfassung.

  Bitte lesen Sie jede Frage sorgfältig durch und beantworten Sie ehrlich.

---

# Wichtige Information
- type: information
- description: Ihre Antworten werden vertraulich behandelt und nur für Testzwecke verwendet. Sie können die Umfrage jederzeit abbrechen.
- image: demo_image.jpeg
- imageAlt: Demo image for the survey

---

# How likely are you to recommend us?
- type: nps
- required: false
- id: nps_score
- help: "0 means not likely, 10 means very likely"
- explanation: "Net Promoter Score (NPS) helps us understand customer loyalty and satisfaction. Your honest feedback enables us to improve our service and better serve our users."

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

# How much do you agree with these statements?
- type: grid
- required: false
- id: satisfaction_grid
- help: "Rate each statement based on your experience"
- explanation: "Your feedback on these specific aspects helps us understand which areas we're excelling in and where we need to improve. Please rate each statement honestly."
- options:
  - text: Strongly Disagree
    description: Completely dissatisfied
  - text: Disagree
    description: Somewhat dissatisfied
  - text: Neutral
    description: Neither satisfied nor dissatisfied
  - text: Agree
    description: Somewhat satisfied
  - text: Strongly Agree
    description: Completely satisfied
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
  - text: Dashboard
    description: Main overview and analytics interface
  - text: Reports
    description: Custom reports and data exports
  - text: API
    description: Programmatic access to data
  - text: Integrations
    description: Third-party app connections
  - Mobile App

---

# What is your role?
- type: single_choice
- required: false
- id: role
- has_other: true
- explanation: "Understanding your role helps us tailor our content, features, and communication to match your specific needs and use cases. This allows us to provide more relevant and valuable experiences."
- options:
  - text: Developer
    description: Software engineers, programmers, and technical roles
  - text: Designer
    description: UI/UX designers, graphic designers, and creative professionals
  - text: Manager
    description: Team leads, project managers, and department heads
  - text: Executive
    description: C-level executives and senior leadership

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
