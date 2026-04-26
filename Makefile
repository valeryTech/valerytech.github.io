.DEFAULT_GOAL := help

.PHONY: help up down build verify clean format hugo-version migrate migrate-check

help: ## Show available targets
	@echo "Usage: make <target>"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_.-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

up: ## Start the local preview server
	@docker compose up site

down: ## Stop the local preview server
	@docker compose down

build: ## Run the production build in Docker
	@bash scripts/build-site.sh

verify: ## Build and verify local routes
	@bash scripts/verify-site.sh

clean: ## Remove generated local artifacts
	@bash scripts/clean-generated.sh

format: ## Run Prettier in Docker
	@docker compose run --rm site npm run format

hugo-version: ## Print the Hugo version from Docker
	@docker compose run --rm site hugo version

migrate: ## Regenerate managed content from external notes
	@bash scripts/migrate-site.sh sync

migrate-check: ## Validate migration mappings and stage output
	@bash scripts/migrate-site.sh check
