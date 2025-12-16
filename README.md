# MyForm

A self-hosted form builder with a React frontend and Node.js backend. Forms are defined via markdown configuration files, making it easy to create and manage surveys without code.

## Features

- **Modern UI**: Clean, Apple-like design with smooth animations
- **8 Question Types**: Short text, long text, single choice, multiple choice, Likert scale, NPS, Grid, and Information
- **Markdown Configuration**: Define questionnaires in simple markdown files
- **Image Support**: Display images in information blocks for scenarios and context
- **Auto-save**: Answers are automatically saved as users progress
- **Security**: Rate limiting, CSRF protection, input validation, secure admin authentication
- **Admin Panel**: View submissions, export to CSV, manage forms
- **Responsive**: Mobile-first design that works on all devices
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Docker Ready**: Fully containerized with separate dev and production setups
- **Logging**: Structured logging with Winston and daily rotation


## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd myform
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set secure passwords:

```env
POSTGRES_PASSWORD=your-secure-database-password

# IMPORTANT: ADMIN_PASSWORD must be a bcrypt hash!
# Generate with: node -e "console.log(require('bcrypt').hashSync('your-password', 12))"
ADMIN_PASSWORD=$2b$12$abcdefghijklmnopqrstuvwxyz123456789
```

⚠️ **CRITICAL SECURITY NOTE**: The `ADMIN_PASSWORD` must be a bcrypt hash, not plaintext. See the command above to generate one.

### 3. Start Development Environment

```bash
make dev
```

This will:
- Build and start all containers (PostgreSQL, server, client)
- Initialize the database with schema
- Enable hot reload for both frontend and backend
- Start the frontend at http://localhost:5173
- Start the backend at http://localhost:3001

### 4. Access the Application

- **Demo Form**: http://localhost:5173/form/demo
- **Patient Feedback**: http://localhost:5173/form/patient-feedback
- **Admin Panel**: http://localhost:5173/admin (password from .env)


## Project Structure

```
/myform
├── /client                  # React frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── /questions   # Question type components
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── NavigationButtons.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── ThankYouScreen.jsx
│   │   │   └── FormNotFound.jsx
│   │   ├── /pages           # Main pages
│   │   ├── /utils           # API utilities
│   │   └── /styles
│   └── Dockerfile / Dockerfile.dev
│
├── /server                  # Express backend
│   ├── /src
│   │   ├── /routes          # API routes
│   │   ├── /controllers     # Request handlers
│   │   ├── /services        # Business logic
│   │   ├── /middleware      # Express middleware
│   │   ├── /models          # Database models
│   │   └── /utils           # Logger, etc.
│   ├── /forms               # Markdown form definitions
│   └── Dockerfile / Dockerfile.dev
│
├── /database
│   └── schema.sql           # Database schema
├── docker-compose.yml       # Production config
├── docker-compose.dev.yml   # Development config
├── Makefile                 # Convenience commands
└── README.md
```

## Creating a New Questionnaire

### 1. Create a Markdown File

Create a new file in `server/forms/` (e.g., `my-survey.md`):

```markdown
---
title: "My Survey"
description: "A brief description"
welcome:
  heading: "Welcome!"
  body: "Thank you for participating."
  buttonText: "Start"
thankYou:
  heading: "Thank You!"
  body: "Your responses have been recorded."
---

# What is your name?
- type: short_text
- required: true
- id: name
- placeholder: "Your name"
- maxLength: 100

---

# How satisfied are you?
- type: likert
- required: true
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
- options:
  - Feature A
  - Feature B
  - Feature C
```

### 2. Access the Form

The form is immediately available at:
```
http://localhost:5173/form/my-survey
```

## Question Types

### 1. Short Text
Single-line text input with character limit.

```markdown
# Question text
- type: short_text
- required: true|false
- id: unique_id
- placeholder: "Text here"
- maxLength: 200
```

### 2. Long Text
Multi-line textarea for longer responses.

```markdown
# Question text
- type: long_text
- required: true|false
- id: unique_id
- placeholder: "Your answer"
- maxLength: 2000
```

### 3. Single Choice
Radio buttons - user can select one option.

**Simple format:**
```markdown
# Question text
- type: single_choice
- required: true|false
- id: unique_id
- options:
  - Option 1
  - Option 2
  - Option 3
```

**Hierarchical format (with descriptions):**
```markdown
# Question text
- type: single_choice
- required: true|false
- id: unique_id
- options:
  - text: Option 1
    description: Brief explanation of option 1
  - text: Option 2
    description: Brief explanation of option 2
  - Option 3  # Can mix formats
```

Descriptions appear in smaller, grey text below the main option. The main option text is displayed in **bold**.

### 4. Multiple Choice
Checkboxes - user can select multiple options.

**Simple format:**
```markdown
# Question text
- type: multiple_choice
- required: true|false
- id: unique_id
- options:
  - Option 1
  - Option 2
  - Option 3
```

**Hierarchical format (with descriptions):**
```markdown
# Question text
- type: multiple_choice
- required: true|false
- id: unique_id
- options:
  - text: Option 1
    description: Brief explanation of option 1
  - text: Option 2
    description: Brief explanation of option 2
  - Option 3  # Can mix formats
```

### 5. Likert Scale
Rating scale with custom labels.

```markdown
# Question text
- type: likert
- required: true|false
- id: unique_id
- scale: 5
- labels:
  - Label 1
  - Label 2
  - Label 3
  - Label 4
  - Label 5
```

### 6. Net Promoter Score (NPS)
Fixed 0-10 scale with color gradient.

```markdown
# Question text
- type: nps
- required: true|false
- id: unique_id
```

### 7. Grid
Multiple statements with single-choice options for each. Displays one statement at a time with progress indicators and navigation.

**Simple format:**
```markdown
# Question text
- type: grid
- required: true|false
- id: unique_id
- help: "Optional help text"
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

**Hierarchical format (with descriptions):**
```markdown
# Question text
- type: grid
- required: true|false
- id: unique_id
- help: "Optional help text"
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
```

Descriptions appear in smaller, grey text below the main option. The main option text is displayed in **bold**.

**Features:**
- One statement displayed at a time with smooth transitions
- Progress dots and counter (e.g., "2 / 4")
- Auto-advances to next statement after selection
- Previous/Next navigation buttons
- Auto-submits after completing the last statement
- Answers stored as JSON object: `{"statement_0": "Agree", "statement_1": "Neutral"}`

### 8. Information

Display informational content with optional image. This isn't a traditional question but allows you to present scenarios, instructions, or context to users.

```markdown
# Section Title
- type: information
- description: Your informational text here
- image: filename.png
- imageAlt: Description for accessibility
```

**With multiline description (using `|` pipe):**
```markdown
# Patient Scenario
- type: information
- description: |
  A 45-year-old patient presents with acute chest pain.

  Please review the diagnostic image below before answering.
- image: patient-xray.png
- imageAlt: Chest X-ray showing right lung opacity
```

**With multiline description (indented lines):**
```markdown
# Patient Scenario
- type: information
- description:
  A 45-year-old patient presents with acute chest pain.

  Please review the diagnostic image below before answering.
- image: patient-xray.png
- imageAlt: Chest X-ray showing right lung opacity
```

**With extra whitespace for better formatting:**
```markdown
# Instructions
- type: information
- description:
  Section 1: Important Notes
  Please read carefully before proceeding.


  Section 2: What to Expect
  This survey will take approximately 5 minutes.


  Section 3: Your Privacy
  All responses are confidential.
```
(Blank lines create visual spacing between sections)

**Features:**
- Title displayed in question header
- Description supports multiline text with preserved formatting
- Optional image display (PNG, JPG, GIF supported)
- Uses standard navigation buttons at bottom of form
- No answer stored (purely informational)
- Graceful error handling if image fails to load

**Image Management:**
- Images are uploaded manually to `server/resources/` folder
- Reference images by filename in the markdown file
- Images served at `/api/resources/{filename}`
- Recommended: Keep images under 500KB for fast loading

## Image Resources

Information blocks can display images that are manually uploaded to the `server/resources/` directory.

**Supported Formats**: PNG, JPG, JPEG, GIF
**Upload Method**: Manual file copy to `server/resources/` directory
**Access URL**: `http://localhost:3001/api/resources/{filename}`

To add an image:
1. Place your image file in `server/resources/`
2. Reference it in your markdown: `- image: filename.png`

## Docker Commands

### Development

```bash
# Start all services (with hot reload)
make dev

# Start in detached mode
make dev-d

# View logs
make logs

# View specific service logs
make logs-server
make logs-client
make logs-db

# Stop all services
make down

# Rebuild containers
make rebuild

# Reset database (deletes all data!)
make db-reset

# Access database shell
make db-shell

# Clean everything (deletes all volumes!)
make clean
```

### Production

```bash
# Start production environment
make prod

# View logs
docker compose logs -f

# Stop production
docker compose down
```

## API Endpoints

### Forms
- `GET /api/forms/:formId` - Get form configuration

### Submissions
- `POST /api/submissions/start` - Start new submission
- `POST /api/submissions/:submissionId/answer` - Save answer
- `POST /api/submissions/:submissionId/complete` - Complete submission

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check session
- `GET /api/admin/forms` - List all forms
- `GET /api/admin/forms/:formId/submissions` - View submissions
- `GET /api/admin/forms/:formId/export` - Export CSV

## Admin Panel

### Login
Navigate to `/admin` and enter the admin password (set in .env).

### Dashboard
View all forms with:
- Submission counts
- Last submission date
- Preview and view responses buttons

### View Submissions
- See all submissions for a form
- Expandable rows to view individual answers
- Export all data to CSV

### CSV Export
Click "Export CSV" to download submissions as a spreadsheet.
Format: One row per submission with all answers as columns.

## Security Features

### Rate Limiting
- Submissions: 100 requests / 15 minutes per IP
- Admin login: 10 requests / 15 minutes per IP

### CSRF Protection
All submission endpoints require CSRF tokens.

### Input Validation
Server-side validation for all question types.

### Admin Authentication
- Password-based with secure session tokens
- 2-hour absolute session expiry
- 30-minute inactivity timeout
- Tokens stored in database

### Security Headers
Helmet.js provides protection against common vulnerabilities.

## Logging

Logs are written to `/server/logs/`:
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

Logs rotate daily and are kept for 14 days.

## Database

The database has three main tables:
- `submissions` - Form submission metadata
- `answers` - Individual question answers
- `admin_sessions` - Admin authentication sessions

See [Backup & Maintenance](#backup--maintenance) for backup/restore commands.

## Troubleshooting

### Port Already in Use
If ports 5173, 3001, or 5432 are in use:

```bash
# Stop all containers
make down

# Or change ports in .env:
CLIENT_PORT=8080
SERVER_PORT=4000
DB_PORT=54320
```

### Database Connection Failed
Check if PostgreSQL is running:

```bash
docker compose -f docker-compose.dev.yml ps
make logs-db
```

### Frontend Can't Connect to Backend
Ensure VITE_API_URL in .env points to the correct backend URL.

### Admin Login Fails
Check ADMIN_PASSWORD in .env matches what you're entering.

### Hot Reload Not Working
Ensure volumes are mounted correctly in docker-compose.dev.yml.

## Customization

### Colors
Edit `client/tailwind.config.js` to change the color scheme.

### Animations
Modify Framer Motion transitions in component files.

### Question Types
Add new question types by:
1. Creating a component in `client/src/components/questions/`
2. Adding it to `questionComponents` in `QuestionCard.jsx`
3. Documenting the markdown format

## Performance

### Frontend
- Vite provides fast HMR and optimized builds
- Framer Motion animations are GPU-accelerated
- Code splitting with React lazy loading (future enhancement)

### Backend
- Connection pooling for database queries
- Rate limiting prevents abuse
- Winston logging is asynchronous

### Database
- Indexes on frequently queried columns
- Cascading deletes for data integrity

## Production Deployment

### Quick Deployment (Simple Setup)

For a basic deployment without custom domain:

```bash
# 1. Clone and configure
git clone <your-repo-url> && cd myform
cp .env.example .env

# 2. Generate admin password hash
node -e "console.log(require('bcrypt').hashSync('your-secure-password', 12))"

# 3. Edit .env with strong passwords
nano .env
# Set POSTGRES_PASSWORD and ADMIN_PASSWORD (use hash from step 2)

# 4. Start services
docker compose up -d

# 5. Access at http://YOUR_SERVER_IP
```

### Production Setup (With Domain & SSL)

#### 1. Configure Environment

```bash
git clone <your-repo-url> && cd myform
cp .env.example .env
nano .env
```

Set in `.env`:
```env
POSTGRES_PASSWORD=<strong-random-password>
ADMIN_PASSWORD=<bcrypt-hash>
CLIENT_URL=https://your-domain.com
NODE_ENV=production
```

#### 2. Install & Configure Nginx

```bash
# Install nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Create config
sudo nano /etc/nginx/sites-available/myform
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/myform /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### 3. Start MyForm & Setup SSL

```bash
# Start MyForm
docker compose up -d

# Get SSL certificate (auto-configures nginx)
sudo certbot --nginx -d your-domain.com
```

Done! Access at `https://your-domain.com`

### Backup & Maintenance

```bash
# Backup database
docker compose exec postgres pg_dump -U myform myform_db > backup-$(date +%Y%m%d).sql

# Backup forms
tar -czf forms-backup-$(date +%Y%m%d).tar.gz server/forms/

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U myform myform_db

# Update MyForm
git pull && docker compose down && docker compose build && docker compose up -d
```


## License

MIT - See [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For questions or issues, please use GitHub Issues.
