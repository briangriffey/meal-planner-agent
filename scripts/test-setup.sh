#!/bin/bash

# ============================================================================
# Test Setup Script
# ============================================================================
# This script sets up the complete test environment:
# 1. Starts Docker services (PostgreSQL, Redis)
# 2. Waits for all services to be healthy
# 3. Runs database migrations
# 4. Seeds the database with test fixtures
# 5. Verifies all services are responding
# 6. Outputs test environment URLs

set -e  # Exit on error

echo "=================================================="
echo "Test Setup - Initializing test environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_WAIT_TIME=120  # Maximum time to wait for services (seconds)
HEALTH_CHECK_INTERVAL=2  # Seconds between health checks

# ============================================================================
# Helper Functions
# ============================================================================

# Print error and exit
error_exit() {
  echo -e "${RED}ERROR: $1${NC}" >&2
  exit 1
}

# Print success message
success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Print info message
info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

# Print warning message
warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Wait for a service to be healthy
wait_for_service() {
  local service_name=$1
  local check_command=$2
  local elapsed=0

  echo ""
  echo -e "${YELLOW}Waiting for $service_name to be healthy...${NC}"

  while [ $elapsed -lt $MAX_WAIT_TIME ]; do
    if eval "$check_command" >/dev/null 2>&1; then
      success "$service_name is healthy (${elapsed}s)"
      return 0
    fi

    sleep $HEALTH_CHECK_INTERVAL
    elapsed=$((elapsed + HEALTH_CHECK_INTERVAL))
    echo -n "."
  done

  echo ""
  error_exit "$service_name failed to become healthy after ${MAX_WAIT_TIME}s"
}

# Check if Docker is running
check_docker() {
  if ! command_exists docker; then
    error_exit "Docker is not installed. Please install Docker first."
  fi

  if ! docker info >/dev/null 2>&1; then
    error_exit "Docker daemon is not running. Please start Docker."
  fi

  success "Docker is running"
}

# Check if docker-compose is available
check_docker_compose() {
  if ! command_exists docker-compose; then
    error_exit "docker-compose is not installed. Please install docker-compose first."
  fi

  success "docker-compose is available"
}

# ============================================================================
# Step 1: Validate prerequisites
# ============================================================================
echo ""
echo -e "${YELLOW}Step 1: Validating prerequisites...${NC}"

check_docker
check_docker_compose

# Check if docker-compose.test.yml exists
if [ ! -f "docker-compose.test.yml" ]; then
  error_exit "docker-compose.test.yml not found in current directory"
fi
success "docker-compose.test.yml found"

# Check if .env.test exists
if [ ! -f ".env.test" ]; then
  warning ".env.test not found, using .env.example as template"
  if [ -f ".env.example" ]; then
    cp .env.example .env.test
    info "Created .env.test from .env.example"
    info "Please review and update .env.test with test-specific values"
  else
    error_exit ".env.example not found, cannot create .env.test"
  fi
fi
success ".env.test found"

# Copy credentials from .env if they're not set in .env.test
if [ -f ".env" ]; then
  info "Checking .env.test credentials..."

  # Check if ANTHROPIC_API_KEY needs to be copied
  if grep -q 'ANTHROPIC_API_KEY="your-anthropic-api-key-here"' .env.test; then
    ANTHROPIC_KEY=$(grep ANTHROPIC_API_KEY .env | cut -d '=' -f2-)
    if [ -n "$ANTHROPIC_KEY" ] && [ "$ANTHROPIC_KEY" != '""' ]; then
      # Use sed to replace the value (macOS compatible)
      sed -i.bak 's|ANTHROPIC_API_KEY="your-anthropic-api-key-here"|ANTHROPIC_API_KEY='"$ANTHROPIC_KEY"'|' .env.test && rm .env.test.bak
      info "Copied ANTHROPIC_API_KEY from .env"
    fi
  fi

  # Check if GMAIL_USER needs to be copied
  if grep -q 'GMAIL_USER="your-email@gmail.com"' .env.test; then
    GMAIL_USER_VAL=$(grep GMAIL_USER .env | cut -d '=' -f2-)
    if [ -n "$GMAIL_USER_VAL" ] && [ "$GMAIL_USER_VAL" != '""' ]; then
      sed -i.bak 's|GMAIL_USER="your-email@gmail.com"|GMAIL_USER='"$GMAIL_USER_VAL"'|' .env.test && rm .env.test.bak
      info "Copied GMAIL_USER from .env"
    fi
  fi

  # Check if GMAIL_APP_PASSWORD needs to be copied
  if grep -q 'GMAIL_APP_PASSWORD="your-app-password-here"' .env.test; then
    GMAIL_PASS=$(grep GMAIL_APP_PASSWORD .env | cut -d '=' -f2-)
    if [ -n "$GMAIL_PASS" ] && [ "$GMAIL_PASS" != '""' ]; then
      sed -i.bak 's|GMAIL_APP_PASSWORD="your-app-password-here"|GMAIL_APP_PASSWORD='"$GMAIL_PASS"'|' .env.test && rm .env.test.bak
      info "Copied GMAIL_APP_PASSWORD from .env"
    fi
  fi
fi

# ============================================================================
# Step 2: Start Docker Compose services
# ============================================================================
echo ""
echo -e "${YELLOW}Step 2: Starting Docker Compose services...${NC}"

# Stop any existing test containers first
info "Stopping any existing test containers..."
docker-compose -f docker-compose.test.yml down >/dev/null 2>&1 || true

# Start services
info "Starting services..."
docker-compose -f docker-compose.test.yml up -d || error_exit "Failed to start Docker services"

success "Docker services started"

# ============================================================================
# Step 3: Wait for all services to be healthy
# ============================================================================
echo ""
echo -e "${YELLOW}Step 3: Waiting for services to be healthy...${NC}"

# Wait for PostgreSQL
wait_for_service "PostgreSQL" "docker exec meal-planner-db-test pg_isready -U mealplanner"

# Wait for Redis
wait_for_service "Redis" "docker exec meal-planner-redis-test redis-cli ping"

success "All services are healthy"

# ============================================================================
# Step 4: Run database migrations
# ============================================================================
echo ""
echo -e "${YELLOW}Step 4: Running database migrations...${NC}"

# Set DATABASE_URL for migrations
export DATABASE_URL="postgresql://mealplanner:test@localhost:5433/meal_planner_test"

# Run migrations
if command_exists pnpm; then
  info "Running Prisma migrations..."
  pnpm db:migrate:deploy || error_exit "Failed to run database migrations"
  success "Database migrations completed"
else
  error_exit "pnpm is not installed. Please install pnpm first."
fi

# ============================================================================
# Step 5: Seed database with test fixtures
# ============================================================================
echo ""
echo -e "${YELLOW}Step 5: Seeding database with test fixtures...${NC}"

info "Running database seed script..."
pnpm db:seed || error_exit "Failed to seed database"

success "Database seeded successfully"

# ============================================================================
# Step 6: Verify all services are responding
# ============================================================================
echo ""
echo -e "${YELLOW}Step 6: Verifying all services are responding...${NC}"

# Test PostgreSQL connection
info "Testing PostgreSQL connection..."
docker exec meal-planner-db-test psql -U mealplanner -d meal_planner_test -c "SELECT COUNT(*) FROM users;" >/dev/null || error_exit "PostgreSQL query failed"
success "PostgreSQL is responding"

# Test Redis connection
info "Testing Redis connection..."
docker exec meal-planner-redis-test redis-cli SET test_key "test_value" >/dev/null || error_exit "Redis SET failed"
docker exec meal-planner-redis-test redis-cli GET test_key >/dev/null || error_exit "Redis GET failed"
docker exec meal-planner-redis-test redis-cli DEL test_key >/dev/null
success "Redis is responding"

# ============================================================================
# Step 7: Output test environment information
# ============================================================================
echo ""
echo "=================================================="
echo -e "${GREEN}✓ Test environment setup complete!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}Test Infrastructure:${NC}"
echo "  Database (psql):    postgresql://mealplanner:test@localhost:5433/meal_planner_test"
echo "  Redis:              redis://localhost:6380"
echo ""
echo -e "${BLUE}Test Credentials (in fixtures):${NC}"
echo "  Email:              brian@test.com"
echo "  Password:           Password123!"
echo ""
echo -e "${BLUE}Docker Containers:${NC}"
docker-compose -f docker-compose.test.yml ps
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Start web app:        pnpm dev (in separate terminal)"
echo "  2. Run E2E tests:        pnpm test:e2e"
echo "  3. Run integration tests: pnpm test:integration"
echo "  4. View logs:            docker-compose -f docker-compose.test.yml logs -f"
echo "  5. Teardown:             ./scripts/test-teardown.sh"
echo ""
echo -e "${GREEN}Environment is ready for testing!${NC}"
echo ""
