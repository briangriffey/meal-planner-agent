#!/bin/bash

# ============================================================================
# Integration Test Runner
# ============================================================================
# This script orchestrates the full integration test cycle:
# 1. Sets up the test environment (test-setup.sh)
# 2. Executes smoke tests to verify services are running
# 3. Executes API integration tests (future)
# 4. Runs E2E tests with Playwright (future)
# 5. Tears down the test environment (test-teardown.sh)
# 6. Reports results with proper exit codes for CI/CD
#
# Exit codes:
#   0 - All tests passed
#   1 - Test setup failed
#   2 - Smoke tests failed
#   3 - Integration tests failed
#   4 - E2E tests failed
#   5 - Teardown failed (non-critical)

set +e  # Don't exit on error - we want to clean up even if tests fail

echo "============================================================"
echo "Integration Test Runner"
echo "============================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SETUP_SCRIPT="$SCRIPT_DIR/test-setup.sh"
TEARDOWN_SCRIPT="$SCRIPT_DIR/test-teardown.sh"
SMOKE_TEST_WEB="$SCRIPT_DIR/smoke-test-web.sh"
SMOKE_TEST_WORKER="$SCRIPT_DIR/smoke-test-worker.sh"

# Test results
SETUP_RESULT=0
SMOKE_TESTS_RESULT=0
INTEGRATION_TESTS_RESULT=0
E2E_TESTS_RESULT=0
TEARDOWN_RESULT=0

# ============================================================================
# Helper Functions
# ============================================================================

# Print error and set exit code
error() {
  echo -e "${RED}✗ ERROR: $1${NC}" >&2
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

# Print step header
step_header() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

# Print test results summary
print_summary() {
  echo ""
  echo "============================================================"
  echo "Test Results Summary"
  echo "============================================================"
  echo ""

  # Setup
  if [ $SETUP_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Setup: PASSED${NC}"
  else
    echo -e "${RED}✗ Setup: FAILED (exit code: $SETUP_RESULT)${NC}"
  fi

  # Smoke Tests
  if [ $SMOKE_TESTS_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Smoke Tests: PASSED${NC}"
  else
    echo -e "${RED}✗ Smoke Tests: FAILED (exit code: $SMOKE_TESTS_RESULT)${NC}"
  fi

  # Integration Tests (future)
  if [ $INTEGRATION_TESTS_RESULT -eq 0 ]; then
    echo -e "${YELLOW}○ Integration Tests: SKIPPED (not implemented yet)${NC}"
  elif [ $INTEGRATION_TESTS_RESULT -eq 99 ]; then
    echo -e "${YELLOW}○ Integration Tests: SKIPPED${NC}"
  else
    echo -e "${RED}✗ Integration Tests: FAILED (exit code: $INTEGRATION_TESTS_RESULT)${NC}"
  fi

  # E2E Tests (future)
  if [ $E2E_TESTS_RESULT -eq 0 ]; then
    echo -e "${YELLOW}○ E2E Tests: SKIPPED (not implemented yet)${NC}"
  elif [ $E2E_TESTS_RESULT -eq 99 ]; then
    echo -e "${YELLOW}○ E2E Tests: SKIPPED${NC}"
  else
    echo -e "${RED}✗ E2E Tests: FAILED (exit code: $E2E_TESTS_RESULT)${NC}"
  fi

  # Teardown
  if [ $TEARDOWN_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Teardown: PASSED${NC}"
  else
    echo -e "${YELLOW}⚠ Teardown: FAILED (exit code: $TEARDOWN_RESULT)${NC}"
  fi

  echo ""
  echo "============================================================"
}

# Determine overall exit code
get_exit_code() {
  # Setup failure is critical
  if [ $SETUP_RESULT -ne 0 ]; then
    return 1
  fi

  # Smoke test failure is critical
  if [ $SMOKE_TESTS_RESULT -ne 0 ]; then
    return 2
  fi

  # Integration test failure (when implemented)
  if [ $INTEGRATION_TESTS_RESULT -ne 0 ] && [ $INTEGRATION_TESTS_RESULT -ne 99 ]; then
    return 3
  fi

  # E2E test failure (when implemented)
  if [ $E2E_TESTS_RESULT -ne 0 ] && [ $E2E_TESTS_RESULT -ne 99 ]; then
    return 4
  fi

  # Teardown failure is non-critical (warn but don't fail)
  if [ $TEARDOWN_RESULT -ne 0 ]; then
    warning "Teardown failed but tests passed"
  fi

  # All tests passed
  return 0
}

# ============================================================================
# Step 1: Setup Test Environment
# ============================================================================

step_header "Step 1/5: Setting up test environment"

if [ ! -f "$SETUP_SCRIPT" ]; then
  error "Setup script not found: $SETUP_SCRIPT"
  SETUP_RESULT=1
else
  info "Running test setup script..."
  bash "$SETUP_SCRIPT"
  SETUP_RESULT=$?

  if [ $SETUP_RESULT -eq 0 ]; then
    success "Test environment setup complete"
  else
    error "Test environment setup failed (exit code: $SETUP_RESULT)"
    print_summary
    exit 1
  fi
fi

# ============================================================================
# Step 2: Run Smoke Tests
# ============================================================================

step_header "Step 2/5: Running smoke tests"

# Run web service smoke tests
if [ ! -f "$SMOKE_TEST_WEB" ]; then
  warning "Web smoke test not found: $SMOKE_TEST_WEB"
else
  info "Running web service smoke tests..."
  bash "$SMOKE_TEST_WEB"
  WEB_RESULT=$?

  if [ $WEB_RESULT -eq 0 ]; then
    success "Web service smoke tests passed"
  else
    error "Web service smoke tests failed (exit code: $WEB_RESULT)"
    SMOKE_TESTS_RESULT=$WEB_RESULT
  fi
fi

# Run worker service smoke tests
if [ ! -f "$SMOKE_TEST_WORKER" ]; then
  warning "Worker smoke test not found: $SMOKE_TEST_WORKER"
else
  info "Running worker service smoke tests..."
  bash "$SMOKE_TEST_WORKER"
  WORKER_RESULT=$?

  if [ $WORKER_RESULT -eq 0 ]; then
    success "Worker service smoke tests passed"
  else
    error "Worker service smoke tests failed (exit code: $WORKER_RESULT)"
    SMOKE_TESTS_RESULT=$WORKER_RESULT
  fi
fi

if [ $SMOKE_TESTS_RESULT -eq 0 ]; then
  success "All smoke tests passed"
else
  error "Smoke tests failed"
fi

# ============================================================================
# Step 3: Run API Integration Tests (Future)
# ============================================================================

step_header "Step 3/5: Running API integration tests"

# TODO: Implement API integration tests
# These will test API endpoints directly without UI
# Examples:
#   - POST /api/meal-plans (create meal plan)
#   - GET /api/meal-plans/:id (retrieve meal plan)
#   - PUT /api/preferences (update preferences)
#   - GET /api/preferences (get preferences)

info "API integration tests not implemented yet"
INTEGRATION_TESTS_RESULT=99  # 99 = skipped

# Uncomment when API tests are implemented:
# info "Running API integration tests..."
# npm run test:api
# INTEGRATION_TESTS_RESULT=$?
#
# if [ $INTEGRATION_TESTS_RESULT -eq 0 ]; then
#   success "API integration tests passed"
# else
#   error "API integration tests failed (exit code: $INTEGRATION_TESTS_RESULT)"
# fi

# ============================================================================
# Step 4: Run E2E Tests (Future)
# ============================================================================

step_header "Step 4/5: Running E2E tests"

# TODO: Implement E2E tests with Playwright
# These will test the full application flow through the UI
# Examples:
#   - User authentication flow
#   - Meal plan generation flow
#   - Preferences update flow
#   - Email delivery verification

info "E2E tests not implemented yet"
E2E_TESTS_RESULT=99  # 99 = skipped

# Uncomment when E2E tests are implemented:
# info "Running E2E tests with Playwright..."
# cd "$PROJECT_ROOT"
# npm run test:e2e
# E2E_TESTS_RESULT=$?
#
# if [ $E2E_TESTS_RESULT -eq 0 ]; then
#   success "E2E tests passed"
# else
#   error "E2E tests failed (exit code: $E2E_TESTS_RESULT)"
# fi

# ============================================================================
# Step 5: Teardown Test Environment
# ============================================================================

step_header "Step 5/5: Tearing down test environment"

if [ ! -f "$TEARDOWN_SCRIPT" ]; then
  warning "Teardown script not found: $TEARDOWN_SCRIPT"
  TEARDOWN_RESULT=1
else
  info "Running test teardown script..."
  bash "$TEARDOWN_SCRIPT"
  TEARDOWN_RESULT=$?

  if [ $TEARDOWN_RESULT -eq 0 ]; then
    success "Test environment teardown complete"
  else
    warning "Test environment teardown had issues (exit code: $TEARDOWN_RESULT)"
  fi
fi

# ============================================================================
# Print Summary and Exit
# ============================================================================

print_summary

get_exit_code
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                                                           ║${NC}"
  echo -e "${GREEN}║  ✓ ALL INTEGRATION TESTS PASSED                          ║${NC}"
  echo -e "${GREEN}║                                                           ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                                                           ║${NC}"
  echo -e "${RED}║  ✗ INTEGRATION TESTS FAILED                              ║${NC}"
  echo -e "${RED}║                                                           ║${NC}"
  echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${RED}Exit code: $EXIT_CODE${NC}"
  echo ""
  exit $EXIT_CODE
fi
