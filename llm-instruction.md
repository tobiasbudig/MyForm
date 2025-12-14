# Form Definition Guide for LLMs

This guide explains how to create form definition files for the typeform-clone application. Forms are defined using Markdown files with YAML frontmatter.

## File Structure

Forms consist of two parts:
1. **Frontmatter** (YAML): Contains form metadata and configuration
2. **Content** (Markdown): Contains individual questions separated by `---`

```markdown
---
title: "Form Title"
description: "Form description"
welcome:
  heading: "Welcome Message"
  body: "Description of what the form is about"
  buttonText: "Start"
thankYou:
  heading: "Thank You!"
  body: "Your responses have been recorded"
---

# First Question?
- type: short_text
- required: true
- id: question_1

---

# Second Question?
- type: single_choice
- required: false
- id: question_2
- options:
  - Option A
  - Option B
```

## Frontmatter Configuration

### Required Fields
- `title` (string): The form title
- `description` (string): Brief description of the form

### Optional Fields
- `welcome` (object): Customize the welcome screen
  - `heading` (string): Welcome screen heading
  - `body` (string): Welcome screen description
  - `buttonText` (string): Start button text (default: "Start")

- `thankYou` (object): Customize the completion screen
  - `heading` (string): Thank you screen heading
  - `body` (string): Thank you screen message

## Question Types

### 1. Short Text (`short_text`)

Single-line text input for brief responses.

**Attributes:**
- `type: short_text` (required)
- `id` (string, required): Unique identifier for the question
- `required` (boolean): Whether the question must be answered
- `placeholder` (string): Placeholder text in the input field
- `help` (string): Helper text displayed below the question
- `maxLength` (number): Maximum character limit (default: 200)
- `explanation` (string): Detailed explanation shown in modal
- `depends_on` (string): Question ID this depends on
- `show_when` (string): Answer value that triggers visibility

**Example:**
```markdown
# What is your name?
- type: short_text
- required: true
- id: user_name
- placeholder: Enter your full name
- maxLength: 100
- help: We'll use this to personalize your experience
```

### 2. Long Text (`long_text`)

Multi-line text area for detailed responses.

**Attributes:**
- `type: long_text` (required)
- `id` (string, required)
- `required` (boolean)
- `placeholder` (string)
- `help` (string)
- `maxLength` (number): Maximum character limit (default: 2000)
- `explanation` (string)
- `depends_on` (string)
- `show_when` (string)

**Example:**
```markdown
# Please share your detailed feedback
- type: long_text
- required: false
- id: detailed_feedback
- placeholder: Share your thoughts...
- maxLength: 1000
- help: Press Cmd/Ctrl + Enter to submit
```

### 3. Single Choice (`single_choice`)

Select one option from a list.

**Attributes:**
- `type: single_choice` (required)
- `id` (string, required)
- `required` (boolean)
- `options` (array, required): List of choices
- `has_other` (boolean): Enable "Other" option with text input
- `help` (string)
- `explanation` (string)
- `depends_on` (string)
- `show_when` (string)

**Example:**
```markdown
# What is your role?
- type: single_choice
- required: true
- id: user_role
- has_other: true
- explanation: This helps us tailor content to your needs
- options:
  - Developer
  - Designer
  - Manager
  - Executive
```

**Note:** When `has_other: true`, users can type custom text if they select "Other".

### 4. Multiple Choice (`multiple_choice`)

Select multiple options from a list.

**Attributes:**
- `type: multiple_choice` (required)
- `id` (string, required)
- `required` (boolean)
- `options` (array, required): List of choices
- `has_other` (boolean): Enable "Other" option with text input
- `help` (string)
- `explanation` (string)
- `depends_on` (string)
- `show_when` (string)

**Example:**
```markdown
# Which features do you use?
- type: multiple_choice
- required: false
- id: features_used
- has_other: true
- help: Select all that apply
- options:
  - Dashboard
  - Reports
  - API
  - Integrations
  - Mobile App
```

**Note:** Answer is stored as an array of selected options.

### 5. Likert Scale (`likert`)

Rating scale for agreement/satisfaction questions.

**Attributes:**
- `type: likert` (required)
- `id` (string, required)
- `required` (boolean)
- `scale` (number, required): Number of points (e.g., 5 for 5-point scale)
- `labels` (array, required): Labels for each scale point
- `help` (string)
- `explanation` (string)
- `depends_on` (string)
- `show_when` (string)

**Example:**
```markdown
# How satisfied are you with our service?
- type: likert
- required: true
- id: satisfaction_rating
- scale: 5
- help: Rate your overall experience
- labels:
  - Very Unsatisfied
  - Unsatisfied
  - Neutral
  - Satisfied
  - Very Satisfied
```

**Note:** The `labels` array must have exactly `scale` number of items.

### 6. Net Promoter Score (`nps`)

Standard NPS question with 0-10 scale.

**Attributes:**
- `type: nps` (required)
- `id` (string, required)
- `required` (boolean)
- `help` (string): Usually explains what 0 and 10 mean
- `explanation` (string)
- `depends_on` (string)
- `show_when` (string)

**Example:**
```markdown
# How likely are you to recommend us to a friend?
- type: nps
- required: true
- id: nps_score
- help: 0 means not likely, 10 means very likely
- explanation: Net Promoter Score helps us measure customer loyalty
```

**Note:** NPS always uses a 0-10 scale with standard styling (red 0-6, yellow 7-8, green 9-10).

### 7. Grid/Matrix (`grid`)

Multiple statements rated on the same scale.

**Attributes:**
- `type: grid` (required)
- `id` (string, required)
- `required` (boolean)
- `statements` (array, required): List of statements to rate
- `options` (array, required): Rating options for each statement
- `help` (string)
- `explanation` (string)
- `depends_on` (string)
- `show_when` (string)

**Example:**
```markdown
# How much do you agree with these statements?
- type: grid
- required: false
- id: product_feedback
- help: Rate each statement based on your experience
- explanation: Your feedback helps us improve the product
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
```

**Note:** Users answer each statement one at a time with auto-advance. Answer is stored as an object with keys `statement_0`, `statement_1`, etc.

## Conditional Logic

Questions can be shown or hidden based on answers to previous questions.

### Attributes
- `depends_on` (string): The `id` of the question this depends on
- `show_when` (string): The answer value that makes this question visible

### Rules
1. `depends_on` must reference a question that appears **before** the current question
2. `show_when` must be a valid answer value for the dependency question
3. Questions without answers to their dependencies remain hidden
4. Circular dependencies will be detected and logged as errors

### Examples

**Text field based on choice:**
```markdown
# What is your role?
- type: single_choice
- id: role
- options:
  - Developer
  - Designer
  - Manager

---

# What programming languages do you use?
- type: multiple_choice
- depends_on: role
- show_when: Developer
- id: languages
- options:
  - JavaScript
  - Python
  - Java
```

**Matching "Other" option:**
```markdown
# How did you hear about us?
- type: single_choice
- id: referral_source
- has_other: true
- options:
  - Google Search
  - Friend
  - Social Media

---

# Please specify how you heard about us
- type: short_text
- depends_on: referral_source
- show_when: Other
- id: referral_other
```

**Note:** For single/multiple choice, `show_when: Other` matches both "Other" and "Other: custom text".

## Common Attributes (All Question Types)

### Required Attributes
- `type`: Question type (see types above)
- `id`: Unique identifier (use lowercase, underscores, no spaces)

### Optional Attributes
- `required` (boolean, default: false): Whether answer is mandatory
- `placeholder` (string): Placeholder text for text inputs
- `help` (string): Helper text shown below the question
- `explanation` (string): Detailed explanation shown in a modal (help icon)
- `depends_on` (string): Question ID for conditional visibility
- `show_when` (string): Answer value that triggers visibility

## User Comments

All question types support optional user comments. Users can click a speech bubble icon to add comments/notes about their answer. Comments are stored separately from the answer value.

## Best Practices

### Question IDs
- Use descriptive, lowercase IDs with underscores
- Good: `user_email`, `satisfaction_score`, `feature_requests`
- Bad: `q1`, `Question2`, `user-email`

### Question Text
- Keep questions concise and clear
- Use question marks for questions
- Use imperative voice for instructions
- Example: "What is your email?" not "Email address"

### Options
- Keep option text short (1-5 words ideal)
- Use parallel structure (all verbs or all nouns)
- Order logically (chronological, scale-based, alphabetical)

### Help Text
- Use `help` for brief clarifications (1 sentence)
- Use `explanation` for detailed context (1-2 paragraphs)
- Example help: "We'll never share your email with anyone"
- Example explanation: "We use NPS to measure customer loyalty..."

### Conditional Logic
- Keep dependency chains short (max 2-3 levels deep)
- Avoid circular dependencies
- Place dependent questions immediately after their parent
- Consider user flow when designing conditions

## File Naming

Form files should be named using kebab-case with `.md` extension:
- `customer-feedback.md`
- `employee-survey.md`
- `event-registration.md`

The filename becomes the form ID in URLs: `/form/customer-feedback`

## Example Complete Form

```markdown
---
title: "Product Feedback Survey"
description: "Help us improve our product"
welcome:
  heading: "Welcome to our Product Survey"
  body: "This survey takes about 3 minutes. Your feedback helps us build better products."
  buttonText: "Get Started"
thankYou:
  heading: "Thank you!"
  body: "Your feedback has been recorded. We appreciate your time!"
---

# How likely are you to recommend our product?
- type: nps
- required: true
- id: nps_score
- help: 0 = not likely, 10 = very likely
- explanation: Net Promoter Score helps us measure customer satisfaction and loyalty

---

# What is your primary role?
- type: single_choice
- required: true
- id: user_role
- has_other: true
- options:
  - Developer
  - Product Manager
  - Designer
  - Executive

---

# Which features do you use regularly?
- type: multiple_choice
- required: false
- id: features_used
- has_other: true
- help: Select all that apply
- options:
  - Dashboard
  - Reports
  - API Access
  - Mobile App
  - Integrations

---

# How would you rate these aspects of our product?
- type: grid
- required: false
- id: product_ratings
- help: Rate each aspect from Strongly Disagree to Strongly Agree
- options:
  - Strongly Disagree
  - Disagree
  - Neutral
  - Agree
  - Strongly Agree
- statements:
  - Easy to use
  - Meets my needs
  - Good value for money
  - Reliable performance

---

# Any additional feedback?
- type: long_text
- required: false
- id: additional_feedback
- placeholder: Share your thoughts...
- maxLength: 1000
- help: We read every piece of feedback
```

## Validation Rules

The system automatically validates:
- Question IDs are unique within a form
- Required `type` and `id` attributes are present
- Type-specific required fields are present (e.g., `options` for single_choice)
- `scale` and `labels` length match for likert questions
- `depends_on` references an existing question ID
- Warning logged if `show_when` is present without `depends_on`

## Answer Storage Format

Answers are stored in the database with these formats:

- **Short/Long Text**: String value
- **Single Choice**: String value (or "Other: custom text" for other option)
- **Multiple Choice**: JSON array of strings
- **Likert/NPS**: Number (0-10 for NPS, 0 to scale-1 for Likert)
- **Grid**: JSON object with keys `statement_0`, `statement_1`, etc.

## Additional Notes

### Auto-Save
All answers are automatically saved to the server as users respond. No manual save action is required.

### Progress Tracking
- Progress bar shows only visible questions (conditional questions don't count until visible)
- Grid questions show internal progress with dots and counter

### Navigation
- Users can navigate back to previous questions
- Conditional questions dynamically appear/disappear based on answers
- Grid questions auto-advance between statements

### Accessibility
- All form elements support keyboard navigation
- Focus management ensures smooth flow
- ARIA attributes for screen readers
