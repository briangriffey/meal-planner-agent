#!/bin/bash

# Smoke test for web service
# Tests health endpoint and service status

set -e

echo "🧪 Running Web Service Smoke Tests"
echo "=================================="
echo ""

# Configuration
WEB_URL="${WEB_URL:-http://localhost:3000}"
MAX_RETRIES=30
RETRY_INTERVAL=2

echo "📍 Testing endpoint: $WEB_URL/api/health"
echo ""

# Wait for service to be ready
echo "⏳ Waiting for web service to be ready..."
RETRIES=0
while [ $RETRIES -lt $MAX_RETRIES ]; do
  if curl -sf "$WEB_URL/api/health" > /dev/null 2>&1; then
    echo "✅ Web service is responding"
    break
  fi

  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "❌ Web service failed to respond after $MAX_RETRIES attempts"
    exit 1
  fi

  echo "   Attempt $RETRIES/$MAX_RETRIES - Retrying in ${RETRY_INTERVAL}s..."
  sleep $RETRY_INTERVAL
done

echo ""

# Test 1: Health endpoint returns 200
echo "Test 1: Health endpoint returns 200"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL/api/health")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ PASS - Health endpoint returned 200"
else
  echo "❌ FAIL - Health endpoint returned $HTTP_CODE (expected 200)"
  exit 1
fi

echo ""

# Test 2: Health response contains required fields
echo "Test 2: Health response structure"
HEALTH_RESPONSE=$(curl -s "$WEB_URL/api/health")

if echo "$HEALTH_RESPONSE" | grep -q '"status":"healthy"'; then
  echo "✅ PASS - Status is healthy"
else
  echo "❌ FAIL - Status is not healthy"
  echo "Response: $HEALTH_RESPONSE"
  exit 1
fi

echo ""

# Test 3: Database is connected
echo "Test 3: Database connectivity"
if echo "$HEALTH_RESPONSE" | grep -q '"database":"connected"'; then
  echo "✅ PASS - Database is connected"
else
  echo "❌ FAIL - Database is not connected"
  echo "Response: $HEALTH_RESPONSE"
  exit 1
fi

echo ""

# Test 4: Redis is connected
echo "Test 4: Redis connectivity"
if echo "$HEALTH_RESPONSE" | grep -q '"redis":"connected"'; then
  echo "✅ PASS - Redis is connected"
else
  echo "❌ FAIL - Redis is not connected"
  echo "Response: $HEALTH_RESPONSE"
  exit 1
fi

echo ""

# Test 5: Environment variables are set
echo "Test 5: Environment variables"
if echo "$HEALTH_RESPONSE" | grep -q '"environment":"ok"'; then
  echo "✅ PASS - Required environment variables are set"
else
  echo "❌ FAIL - Missing required environment variables"
  echo "Response: $HEALTH_RESPONSE"
  exit 1
fi

echo ""
echo "=================================="
echo "✅ All smoke tests passed!"
echo "=================================="
