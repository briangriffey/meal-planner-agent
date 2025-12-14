# Meal Planner Agent - Test Suite

This directory contains test scripts for validating various components of the meal planner agent.

## Available Tests

### 1. HEB Scraper Tests (`heb-scraper/`)

Tests for the HEB web scraping functionality. See [heb-scraper/README.md](./heb-scraper/README.md) for detailed documentation.

**Quick commands:**
```bash
# Test standalone HEB scraper
pnpm test:heb-scraper

# Test HEB connector integration
pnpm test:heb-connector
```

### 2. Email Send Test (`test-email-send.ts`)

Tests ONLY the email connector with a sample meal plan (no AI generation).

**⚠️ WARNING:** This sends real emails to configured recipients!

**How to run:**
```bash
# Safety confirmation required
CONFIRM_EMAIL_SEND=true pnpm test:email-send
```

**What it does:**
- Validates email configuration
- Shows email configuration summary
- Requires explicit confirmation via environment variable
- Sends a **hardcoded sample meal plan** (NO AI generation)
- Tests email sending functionality in isolation

**Prerequisites:**
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` set in .env
- `EMAIL_RECIPIENTS` configured (comma-separated list)
- **NO** `ANTHROPIC_API_KEY` required (doesn't use AI)

**Safety features:**
- Requires `CONFIRM_EMAIL_SEND=true` to prevent accidental sends
- Displays configuration before running
- Shows all recipients before proceeding
- Uses sample content (fast, no API costs)

**Note:** For testing with a FULL AI-generated meal plan, use `pnpm test:now:send` instead

---

## Quick Reference

| Command | Description | Mode |
|---------|-------------|------|
| `pnpm test:now` | Run agent with email saved to file | Test Mode |
| `pnpm test:now:send` | Run full agent + send actual email (AI-generated) | **Production** ⚠️ |
| `pnpm test:heb-scraper` | Test HEB scraping standalone | Test Mode |
| `pnpm test:heb-connector` | Test HEB connector class | Test Mode |
| `pnpm test:email-send` | Test email only (sample content, no AI) | **Production** ⚠️ |

---

## Test vs Production Mode

### Test Mode (Email to File)
- Used by: `pnpm test:now`, HEB scraper tests
- Email content saved to `TESTEMAIL.html`
- No actual emails sent
- Safe for development

### Production Mode (Actual Emails)
- Used by: `pnpm test:email-send`, `pnpm start`
- Emails sent to configured recipients
- Requires confirmation
- Use with caution

---

## Running Tests

### Basic HEB Scraping Test
```bash
pnpm test:heb-scraper
```
Expected: Browser opens, searches for 3 ingredients, all succeed

### Full Agent Test (No Email)
```bash
pnpm test:now
```
Expected: Meal plan generated, saved to TESTEMAIL.html

### Full Agent Test (With Email) ⚠️
```bash
# Option 1: Using --sendemail flag (simpler)
pnpm test:now:send

# Option 2: Using dedicated test script with confirmation
CONFIRM_EMAIL_SEND=true pnpm test:email-send
```
Expected: Email sent to recipients

**Note:** `pnpm test:now:send` is equivalent to `pnpm dev -- --now --sendemail`

---

## Environment Variables Required

For AI-powered tests (`pnpm test:now`, `pnpm test:now:send`):
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

For email tests (`pnpm test:email-send`, `pnpm test:now:send`):
```bash
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
EMAIL_RECIPIENTS=recipient1@example.com,recipient2@example.com
```

For email send test (safety):
```bash
CONFIRM_EMAIL_SEND=true  # Only for pnpm test:email-send
```

**Note:** `pnpm test:email-send` does NOT require `ANTHROPIC_API_KEY` since it uses sample content

---

## Debugging Failed Tests

### HEB Tests Failing
1. Check `tests/heb-scraper/README.md` troubleshooting section
2. Verify stealth plugin is installed
3. Try waiting 5-10 minutes (IP cooldown)
4. Check if HEB website structure changed

### Email Tests Failing
1. Verify Gmail app password is correct
2. Check recipient email addresses
3. Ensure `.env` file is in project root
4. Test SMTP connection separately

### Agent Tests Failing
1. Check Anthropic API key validity
2. Review agent logs for specific errors
3. Test connectors individually first

---

## Adding New Tests

When adding new test scripts:

1. Create the test file in appropriate subdirectory
2. Add pnpm script to `package.json`:
   ```json
   "test:your-test": "ts-node tests/your-test.ts"
   ```
3. Document in this README
4. Include safety measures for destructive tests

---

## Test Maintenance

Run tests regularly:
- Before deploying changes
- After dependency updates
- When HEB website changes
- When Anthropic API updates

Keep test documentation up to date with code changes.
