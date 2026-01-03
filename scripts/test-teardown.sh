#!/bin/bash

# ============================================================================
# Test Teardown Script
# ============================================================================
# This script cleans up the test environment after running tests.
# It stops Docker containers, removes volumes, and cleans up test data.

set -e  # Exit on error

echo "=================================================="
echo "Test Teardown - Cleaning up test environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# Step 1: Stop all test containers
# ============================================================================
echo ""
echo -e "${YELLOW}Step 1: Stopping test containers...${NC}"
if [ -f "docker-compose.test.yml" ]; then
  docker-compose -f docker-compose.test.yml down || {
    echo -e "${RED}Warning: Failed to stop some containers${NC}"
  }
  echo -e "${GREEN}✓ Test containers stopped${NC}"
else
  echo -e "${YELLOW}Warning: docker-compose.test.yml not found, skipping container shutdown${NC}"
fi

# ============================================================================
# Step 2: Remove test volumes
# ============================================================================
echo ""
echo -e "${YELLOW}Step 2: Removing test volumes...${NC}"
if [ -f "docker-compose.test.yml" ]; then
  docker-compose -f docker-compose.test.yml down -v || {
    echo -e "${RED}Warning: Failed to remove some volumes${NC}"
  }
  echo -e "${GREEN}✓ Test volumes removed${NC}"
else
  echo -e "${YELLOW}Warning: docker-compose.test.yml not found, skipping volume removal${NC}"
fi

# ============================================================================
# Step 3: Clean up test database files (if using local SQLite for tests)
# ============================================================================
echo ""
echo -e "${YELLOW}Step 3: Cleaning up test data...${NC}"
# Remove any test database files
if [ -f "test.db" ]; then
  rm -f test.db
  echo -e "${GREEN}✓ Test database file removed${NC}"
fi

# ============================================================================
# Step 4: Remove temporary test files
# ============================================================================
echo ""
echo -e "${YELLOW}Step 4: Removing temporary files...${NC}"

# Remove Playwright artifacts
if [ -d "test-results" ]; then
  rm -rf test-results
  echo -e "${GREEN}✓ Playwright test results removed${NC}"
fi

if [ -d "playwright-report" ]; then
  rm -rf playwright-report
  echo -e "${GREEN}✓ Playwright report removed${NC}"
fi

# Remove Jest coverage
if [ -d "coverage" ]; then
  rm -rf coverage
  echo -e "${GREEN}✓ Coverage reports removed${NC}"
fi

# Remove any .env.test.local files (but keep .env.test)
if [ -f ".env.test.local" ]; then
  rm -f .env.test.local
  echo -e "${GREEN}✓ Local test environment file removed${NC}"
fi

# ============================================================================
# Step 5: Output cleanup confirmation
# ============================================================================
echo ""
echo "=================================================="
echo -e "${GREEN}✓ Test environment cleanup complete!${NC}"
echo "=================================================="
echo ""
echo "Test environment has been cleaned up successfully."
echo "All containers stopped, volumes removed, and temporary files deleted."
echo ""
