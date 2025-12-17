.PHONY: dev prod down logs db-shell clean rebuild db-reset db-migrate db-migrate-prod help install-npm impressum doctor-form mfa-form nurse-form participant-form

# Development
dev:
	docker compose -f docker-compose.dev.yml up --build

dev-d:
	docker compose -f docker-compose.dev.yml up --build -d

install-npm:
	cd server && npm i && cd .. && cd client && npm i && cd ..

# Configuration
impressum:
	nano client/src/content/impressum.md

# Forms
doctor-form:

	rm server/forms/doctor.md && nano server/forms/doctor.md

mfa-form:
	rm server/forms/mfa.md && nano server/forms/mfa.md

nurse-form:
	rm server/forms/nurse.md && nano server/forms/nurse.md

participant-form:
	rm server/forms/participant.md && nano server/forms/participant.md

# Production
prod:
	docker compose up --build -d

# Stop all containers
down:
	docker compose -f docker-compose.dev.yml down
	docker compose down

# View logs
logs:
	docker compose -f docker-compose.dev.yml logs -f

logs-server:
	docker compose -f docker-compose.dev.yml logs -f server

logs-client:
	docker compose -f docker-compose.dev.yml logs -f client

logs-db:
	docker compose -f docker-compose.dev.yml logs -f postgres

# Database shell
db-shell:
	docker compose -f docker-compose.dev.yml exec postgres psql -U myform -d myform_db

# Clean up volumes (WARNING: deletes data)
clean:
	docker compose -f docker-compose.dev.yml down -v
	docker compose down -v
	@echo "All volumes deleted. Data has been removed."

# Rebuild without cache
rebuild:
	docker compose -f docker-compose.dev.yml build --no-cache
	docker compose -f docker-compose.dev.yml up

# Reset database
db-reset:
	docker compose -f docker-compose.dev.yml down -v
	docker compose -f docker-compose.dev.yml up -d postgres
	@echo "Waiting for PostgreSQL to initialize..."
	@sleep 5
	docker compose -f docker-compose.dev.yml up -d

# Run all pending database migrations (development)
db-migrate:
	@echo "Running database migrations (development)..."
	docker compose -f docker-compose.dev.yml exec server node scripts/migrate.js
	@echo ""

# Run all pending database migrations (production)
db-migrate-prod:
	@echo "Running database migrations (production)..."
	docker compose exec server node scripts/migrate.js
	@echo ""

# Help
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start development environment"
	@echo "  make dev-d            - Start development environment in detached mode"
	@echo "  make install-npm      - Install npm dependencies for client and server"
	@echo ""
	@echo "Configuration:"
	@echo "  make impressum        - Edit impressum configuration"
	@echo ""
	@echo "Forms:"
	@echo "  make doctor-form      - Edit doctor form"
	@echo "  make mfa-form         - Edit MFA form"
	@echo "  make nurse-form       - Edit nurse form"
	@echo "  make participant-form - Edit participant form"
	@echo ""
	@echo "Production:"
	@echo "  make prod             - Start production environment"
	@echo ""
	@echo "Container Management:"
	@echo "  make down             - Stop all containers"
	@echo "  make rebuild          - Rebuild containers without cache"
	@echo "  make clean            - Remove all containers and volumes (deletes data!)"
	@echo ""
	@echo "Logs:"
	@echo "  make logs             - View all logs"
	@echo "  make logs-server      - View server logs"
	@echo "  make logs-client      - View client logs"
	@echo "  make logs-db          - View database logs"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell         - Connect to database shell"
	@echo "  make db-reset         - Reset database with fresh schema (deletes data!)"
	@echo "  make db-migrate       - Run all pending migrations (development)"
	@echo "  make db-migrate-prod  - Run all pending migrations (production)"
