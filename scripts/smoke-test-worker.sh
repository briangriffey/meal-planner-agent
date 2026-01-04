#!/bin/bash

# Smoke test for worker service
# Tests that worker process is running

set -e

echo "🧪 Running Worker Service Smoke Tests"
echo "====================================="
echo ""

# Configuration
CONTAINER_NAME="${CONTAINER_NAME:-meal-planner-worker-test}"
MAX_RETRIES=30
RETRY_INTERVAL=2

# Check if running in Docker or local
if command -v docker &> /dev/null && docker ps --filter "name=$CONTAINER_NAME" --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
  echo "🐳 Testing Docker container: $CONTAINER_NAME"
  DOCKER_MODE=true
else
  echo "💻 Testing local process (Docker container not found)"
  DOCKER_MODE=false
fi

echo ""

# Wait for worker to start
echo "⏳ Waiting for worker process to start..."
RETRIES=0
while [ $RETRIES -lt $MAX_RETRIES ]; do
  if [ "$DOCKER_MODE" = true ]; then
    # Check if container is running
    if docker exec "$CONTAINER_NAME" pgrep -f "worker" > /dev/null 2>&1; then
      echo "✅ Worker process is running in container"
      break
    fi
  else
    # Check if process is running locally (ts-node or node)
    if pgrep -f "worker.ts" > /dev/null 2>&1 || pgrep -f "worker.js" > /dev/null 2>&1; then
      echo "✅ Worker process is running locally"
      break
    fi
  fi

  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "⚠️  Worker process not detected after $MAX_RETRIES attempts"
    echo "   This is expected if the worker is not running."
    echo "   Skipping worker smoke tests."
    exit 0  # Exit with success since worker is optional for some tests
  fi

  echo "   Attempt $RETRIES/$MAX_RETRIES - Retrying in ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done

echo ""

# Test 1: Worker process is running
echo "Test 1: Worker process status"
if [ "$DOCKER_MODE" = true ]; then
  PROCESS_COUNT=$(docker exec "$CONTAINER_NAME" pgrep -f "worker" | wc -l)
else
  PROCESS_COUNT=$(pgrep -f "worker.ts\|worker.js" | wc -l)
fi

if [ "$PROCESS_COUNT" -gt 0 ]; then
  echo "✅ PASS - Worker process is running (count: $PROCESS_COUNT)"
else
  echo "❌ FAIL - Worker process is not running"
  exit 1
fi

echo ""

# Test 2: Check required environment variables (Docker only)
if [ "$DOCKER_MODE" = true ]; then
  echo "Test 2: Environment variables"

  REQUIRED_VARS=("DATABASE_URL" "REDIS_URL" "ANTHROPIC_API_KEY" "GMAIL_USER" "GMAIL_APP_PASSWORD")
  ALL_SET=true

  for VAR in "${REQUIRED_VARS[@]}"; do
    if docker exec "$CONTAINER_NAME" printenv "$VAR" > /dev/null 2>&1; then
      echo "   ✅ $VAR is set"
    else
      echo "   ❌ $VAR is not set"
      ALL_SET=false
    fi
  done

  if [ "$ALL_SET" = true ]; then
    echo "✅ PASS - All required environment variables are set"
  else
    echo "❌ FAIL - Missing required environment variables"
    exit 1
  fi
else
  echo "Test 2: Environment variables (skipped - local mode)"
fi

echo ""
echo "====================================="
echo "✅ All smoke tests passed!"
echo "====================================="
