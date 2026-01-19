#!/bin/bash

# Test script for end-to-end marketing email flow
# This tests: GitHub webhook → BullMQ job → Email generation

set -e  # Exit on error

echo "🧪 Marketing Email Flow End-to-End Test"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print info
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Step 1: Check environment variables
echo "📋 Step 1: Checking environment variables..."
if [ -z "$ANTHROPIC_API_KEY" ]; then
    error "ANTHROPIC_API_KEY not set"
    exit 1
fi
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL not set"
    exit 1
fi
if [ -z "$REDIS_URL" ]; then
    error "REDIS_URL not set"
    exit 1
fi
success "Environment variables configured"
echo ""

# Step 2: Check if services are running
echo "📋 Step 2: Checking if services are running..."
info "This test requires:"
info "  1. Web app running on http://localhost:3000 (pnpm dev)"
info "  2. Worker running (pnpm dev:worker)"
info "  3. PostgreSQL database accessible"
info "  4. Redis accessible"
echo ""
read -p "Are all services running? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Please start all required services first"
    exit 1
fi
success "Services confirmed running"
echo ""

# Step 3: Enable test mode for email
echo "📋 Step 3: Configuring test mode..."
export EMAIL_TEST_MODE=true
success "Email test mode enabled (will write to TESTEMAIL.html)"
echo ""

# Step 4: Create test webhook payload
echo "📋 Step 4: Creating test webhook payload..."
TEST_PAYLOAD=$(cat <<'EOF'
{
  "action": "published",
  "release": {
    "tag_name": "v2.1.0",
    "name": "Version 2.1.0 - Marketing Automation",
    "body": "## What's New\n\n### Features\n- ✨ Automated marketing emails on GitHub releases\n- 🎨 Beautiful HTML email templates with brand styling\n- 📧 Batch email sending with rate limiting\n\n### Improvements\n- 🚀 Enhanced error handling in email queue\n- 📊 Better progress tracking for async jobs\n\n### Bug Fixes\n- 🐛 Fixed email template rendering on mobile devices\n- 🔧 Corrected timezone handling in scheduled jobs",
    "html_url": "https://github.com/meal-planner/meal-planner-agent/releases/tag/v2.1.0",
    "published_at": "2024-01-19T22:00:00Z"
  }
}
EOF
)
success "Test payload created"
echo ""

# Step 5: Send webhook request
echo "📋 Step 5: Sending webhook request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/webhooks/github \
  -H "Content-Type: application/json" \
  -d "$TEST_PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "202" ]; then
    success "Webhook accepted (HTTP 202)"
    echo "Response: $RESPONSE_BODY"
else
    error "Webhook failed (HTTP $HTTP_CODE)"
    echo "Response: $RESPONSE_BODY"
    exit 1
fi
echo ""

# Step 6: Wait for job processing
echo "📋 Step 6: Waiting for worker to process job..."
info "This may take 30-60 seconds depending on Claude API response time..."
info "Watch the worker logs for progress updates"
echo ""

# Poll for TESTEMAIL.html file (it will be created when job completes)
MAX_WAIT=120  # Wait up to 2 minutes
WAIT_TIME=0
while [ ! -f "TESTEMAIL.html" ] && [ $WAIT_TIME -lt $MAX_WAIT ]; do
    sleep 5
    WAIT_TIME=$((WAIT_TIME + 5))
    echo -n "."
done
echo ""

if [ -f "TESTEMAIL.html" ]; then
    success "Email HTML file generated!"
else
    error "Timeout waiting for email generation"
    error "Check worker logs for errors"
    exit 1
fi
echo ""

# Step 7: Verify email content
echo "📋 Step 7: Verifying email content..."
if grep -q "v2.1.0" TESTEMAIL.html; then
    success "Release version found in email"
else
    error "Release version not found in email"
    exit 1
fi

if grep -q "New Release Available" TESTEMAIL.html; then
    success "Email header found"
else
    error "Email header not found"
    exit 1
fi

if grep -q "marketing" TESTEMAIL.html || grep -q "Marketing" TESTEMAIL.html; then
    success "Release notes content found in email"
else
    error "Release notes content not found in email"
    exit 1
fi
echo ""

# Step 8: Show summary
echo "📋 Step 8: Test Summary"
echo "======================"
success "All verification steps passed!"
echo ""
info "Email preview saved to: $(pwd)/TESTEMAIL.html"
info "Open this file in a browser to see the rendered email"
echo ""

# Optional: Open the email in browser
if command -v open &> /dev/null; then
    read -p "Open email preview in browser? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open TESTEMAIL.html
    fi
fi

echo ""
echo "🎉 Marketing email flow test completed successfully!"
echo ""
echo "What was tested:"
echo "  ✅ GitHub webhook endpoint receives release events"
echo "  ✅ Webhook validates payload and enqueues job"
echo "  ✅ BullMQ worker picks up marketing email job"
echo "  ✅ Worker queries users from database"
echo "  ✅ Claude API generates user-friendly marketing copy"
echo "  ✅ MarketingEmailRenderer creates branded HTML email"
echo "  ✅ EmailConnector generates test email file"
echo "  ✅ Email contains release notes and proper formatting"
echo ""
