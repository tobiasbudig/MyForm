.PHONY: dev prod down logs db-shell clean rebuild db-reset help

# Development
dev:
	docker-compose -f docker-compose.dev.yml up --build

dev-d:
	docker-compose -f docker-compose.dev.yml up --build -d

# Production
prod:
	docker-compose up --build -d

# Stop all containers
down:
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

# View logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f

logs-server:
	docker-compose -f docker-compose.dev.yml logs -f server

logs-client:
	docker-compose -f docker-compose.dev.yml logs -f client

logs-db:
	docker-compose -f docker-compose.dev.yml logs -f postgres

# Database shell
db-shell:
	docker-compose -f docker-compose.dev.yml exec postgres psql -U questionnaire -d questionnaire_db

# Clean up volumes (WARNING: deletes data)
clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	@echo "All volumes deleted. Data has been removed."

# Rebuild without cache
rebuild:
	docker-compose -f docker-compose.dev.yml build --no-cache
	docker-compose -f docker-compose.dev.yml up

# Reset database
db-reset:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.dev.yml up -d postgres
	@echo "Waiting for PostgreSQL to initialize..."
	@sleep 5
	docker-compose -f docker-compose.dev.yml up -d

# Help
help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-d        - Start development environment in detached mode"
	@echo "  make prod         - Start production environment"
	@echo "  make down         - Stop all containers"
	@echo "  make logs         - View all logs"
	@echo "  make logs-server  - View server logs"
	@echo "  make logs-client  - View client logs"
	@echo "  make logs-db      - View database logs"
	@echo "  make db-shell     - Connect to database shell"
	@echo "  make clean        - Remove all containers and volumes (deletes data!)"
	@echo "  make rebuild      - Rebuild containers without cache"
	@echo "  make db-reset     - Reset database with fresh schema"
