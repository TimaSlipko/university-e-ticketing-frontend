# Angular + SonarQube Makefile

# Variables
ANGULAR_DIR := e-ticketing
COVERAGE_DIR := coverage
REPORTS_DIR := reports

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.PHONY: all
all: clean test sonar-scan

# Install dependencies
.PHONY: deps
deps:
	@echo "$(YELLOW)Installing Node.js dependencies...$(NC)"
	@cd $(ANGULAR_DIR) && npm ci
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

# Create reports directory
.PHONY: setup-dirs
setup-dirs:
	@mkdir -p $(ANGULAR_DIR)/$(REPORTS_DIR)
	@mkdir -p $(ANGULAR_DIR)/$(COVERAGE_DIR)

# Run tests with coverage
.PHONY: test
test: setup-dirs
	@echo "$(YELLOW)Running tests with coverage...$(NC)"
	@cd $(ANGULAR_DIR) && (npm run test:coverage 2>/dev/null || npm run test -- --code-coverage --watch=false --browsers=ChromeHeadless) || true
	@echo "$(GREEN)✓ Tests completed with coverage (ignoring failures)$(NC)"

# Run linting
.PHONY: lint
lint:
	@echo "$(YELLOW)Running ESLint...$(NC)"
	@cd $(ANGULAR_DIR) && (npm run lint || npx eslint . --ext .ts,.js,.html)
	@echo "$(GREEN)✓ Linting completed$(NC)"

# Build the application
.PHONY: build
build:
	@echo "$(YELLOW)Building Angular application...$(NC)"
	@cd $(ANGULAR_DIR) && npm run build
	@echo "$(GREEN)✓ Build completed$(NC)"

# Run SonarQube analysis (with Docker)
.PHONY: sonar-scan
sonar-scan: test
	@echo "$(YELLOW)Running SonarQube analysis with Docker...$(NC)"
	@echo "$(YELLOW)Mounting from Git root directory...$(NC)"
	@docker run --rm \
		-e SONAR_HOST_URL="$${SONAR_HOST_URL:-http://localhost:9000}" \
		-e SONAR_TOKEN="$$SONAR_TOKEN" \
		-e SONAR_SCANNER_OPTS="-Xmx4g" \
		-v "$$(pwd):/usr/src" \
		-w /usr/src/$(ANGULAR_DIR) \
		sonarsource/sonar-scanner-cli
	@echo "$(GREEN)✓ SonarQube analysis completed$(NC)"

# Clean reports and build artifacts
.PHONY: clean
clean:
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@rm -rf $(ANGULAR_DIR)/$(REPORTS_DIR)
	@rm -rf $(ANGULAR_DIR)/$(COVERAGE_DIR)
	@rm -rf $(ANGULAR_DIR)/dist/
	@rm -rf $(ANGULAR_DIR)/node_modules/.cache
	@echo "$(GREEN)✓ Cleanup completed$(NC)"

# View coverage report
.PHONY: coverage
coverage:
	@if [ -f $(ANGULAR_DIR)/$(COVERAGE_DIR)/index.html ]; then \
		echo "$(GREEN)Opening coverage report...$(NC)"; \
		open $(ANGULAR_DIR)/$(COVERAGE_DIR)/index.html || xdg-open $(ANGULAR_DIR)/$(COVERAGE_DIR)/index.html; \
	else \
		echo "$(RED)Coverage report not found. Run 'make test' first.$(NC)"; \
	fi

# Development setup
.PHONY: dev-setup
dev-setup: deps
	@echo "$(GREEN)✓ Development environment setup complete$(NC)"

# CI pipeline
.PHONY: ci
ci: clean all
	@echo "$(GREEN)✓ CI pipeline completed$(NC)"

# Help target
.PHONY: help
help:
	@echo "$(GREEN)Available targets:$(NC)"
	@echo "  $(YELLOW)all$(NC)                 - Run complete analysis (test + sonar)"
	@echo "  $(YELLOW)deps$(NC)                - Install Node.js dependencies"
	@echo "  $(YELLOW)test$(NC)                - Run tests with coverage"
	@echo "  $(YELLOW)lint$(NC)                - Run ESLint"
	@echo "  $(YELLOW)build$(NC)               - Build Angular application"
	@echo "  $(YELLOW)sonar-scan$(NC)          - Run SonarQube analysis with Docker"
	@echo "  $(YELLOW)coverage$(NC)            - Open coverage report in browser"
	@echo "  $(YELLOW)clean$(NC)               - Clean reports and build artifacts"
	@echo "  $(YELLOW)dev-setup$(NC)           - Setup development environment"
	@echo "  $(YELLOW)ci$(NC)                  - Run CI pipeline"
	@echo ""
	@echo "$(GREEN)Environment variables:$(NC)"
	@echo "  $(YELLOW)SONAR_HOST_URL$(NC)      - SonarQube server URL (default: http://localhost:9000)"
	@echo "  $(YELLOW)SONAR_TOKEN$(NC)         - SonarQube authentication token"