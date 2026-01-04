#!/bin/bash

# ============================================================================
# Test Setup Script
# ============================================================================
# This script sets up the complete test environment:
# 1. Starts Docker services (PostgreSQL, Redis, Web, Worker)
# 2. Waits for all services to be healthy
# 3. Runs database migrations
# 4. Seeds the database with test fixtures
# 5. Verifies all services are responding
# 6. Runs smoke tests
# 7. Outputs test environment URLs

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

# Wait for Web app (check if port is responding)
wait_for_service "Web Application" "curl -f http://localhost:3001/api/health"

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

# Test Web app health endpoint
info "Testing Web application..."
if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
  success "Web application is responding"
else
  error_exit "Web application health check failed"
fi

# ============================================================================
# Step 7: Run smoke tests
# ============================================================================
echo ""
echo -e "${YELLOW}Step 7: Running smoke tests...${NC}"

# Run web smoke test
if [ -f "scripts/smoke-test-web.sh" ]; then
  info "Running web smoke test..."
  bash scripts/smoke-test-web.sh || warning "Web smoke test failed (non-critical)"
else
  warning "scripts/smoke-test-web.sh not found, skipping web smoke test"
fi

# Run worker smoke test
if [ -f "scripts/smoke-test-worker.sh" ]; then
  info "Running worker smoke test..."
  bash scripts/smoke-test-worker.sh || warning "Worker smoke test failed (non-critical)"
else
  warning "scripts/smoke-test-worker.sh not found, skipping worker smoke test"
fi

# ============================================================================
# Step 8: Output test environment information
# ============================================================================
echo ""
echo "=================================================="
echo -e "${GREEN}✓ Test environment setup complete!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}Test Environment URLs:${NC}"
echo "  Web Application:    http://localhost:3001"
echo "  API Health Check:   http://localhost:3001/api/health"
echo "  Database (psql):    postgresql://mealplanner:test@localhost:5433/meal_planner_test"
echo "  Redis:              redis://localhost:6380"
echo ""
echo -e "${BLUE}Test Credentials:${NC}"
echo "  Email:              brian@test.com"
echo "  Password:           Password123!"
echo ""
echo -e "${BLUE}Docker Containers:${NC}"
docker-compose -f docker-compose.test.yml ps
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Run E2E tests:        pnpm test:e2e"
echo "  2. Run integration tests: pnpm test:integration"
echo "  3. View logs:            docker-compose -f docker-compose.test.yml logs -f"
echo "  4. Teardown:             ./scripts/test-teardown.sh"
echo ""
echo -e "${GREEN}Environment is ready for testing!${NC}"
echo ""
