# Scripts

Utility scripts for testing and development.

## test-agent.ts

Test the meal planner agent locally without the queue system.

### Usage

```bash
# From root directory
pnpm test:agent
```

### What it does

1. Creates or uses existing test user (`test@example.com`)
2. Initializes the meal planner agent with connectors
3. Generates a meal plan using Claude AI
4. Saves the email to `TESTEMAIL.html` in the project root
5. Shows progress bar and results

### Configuration

The script uses default test preferences:
- **Number of Meals**: 3
- **Servings per Meal**: 2
- **Min Protein**: 40g per meal
- **Max Calories**: 600 per meal
- **HEB Integration**: Disabled (set to `true` in script to enable)
- **Dietary Restrictions**: None

To modify these, edit the test user preferences in the script or update them via the web interface.

### Requirements

- PostgreSQL running (for database access)
- `ANTHROPIC_API_KEY` environment variable set
- Optional: `GMAIL_USER` and `GMAIL_APP_PASSWORD` (only used for test metadata)

### Output

The script will:
- Display real-time progress with a progress bar
- Show the generated meals with nutrition info
- Save the complete email HTML to `TESTEMAIL.html`

Open `TESTEMAIL.html` in a browser to view the formatted meal plan email.

### Example Output

```
🧪 Testing Meal Planner Agent Locally

════════════════════════════════════════════════════════════
✅ Using existing test user

User Configuration:
  Email: test@example.com
  Number of Meals: 3
  Servings per Meal: 2
  Min Protein: 40g
  Max Calories: 600
  HEB Enabled: false
  Dietary Restrictions: None
════════════════════════════════════════════════════════════

🤖 Initializing agent...
✅ Connectors initialized

🚀 Starting meal plan generation...
════════════════════════════════════════════════════════════
[████████████████████████████████████████] 100% - Complete

════════════════════════════════════════════════════════════

✅ Meal plan generation complete!

Results:
  Duration: 45.2s
  Meals Generated: 3
  Email Sent: Yes (saved to TESTEMAIL.html)
  Iterations: 8

Generated Meals:
  1. Grilled Chicken with Roasted Vegetables
     - Protein: 42g, Calories: 550
  2. Baked Salmon with Quinoa and Asparagus
     - Protein: 45g, Calories: 580
  3. Turkey Meatballs with Zucchini Noodles
     - Protein: 48g, Calories: 520

════════════════════════════════════════════════════════════
📧 Email saved to: TESTEMAIL.html
💡 Open the file in a browser to view the meal plan
════════════════════════════════════════════════════════════

✅ Test completed successfully
```

### Troubleshooting

**Error: ANTHROPIC_API_KEY not set**
- Make sure you have a `.env` file in the project root with your API key
- Or export the environment variable: `export ANTHROPIC_API_KEY=your-key`

**Error: Database connection failed**
- Ensure PostgreSQL is running: `docker-compose up -d`
- Check your `DATABASE_URL` in `.env`

**HEB integration not working**
- Set `hebEnabled: true` in the script (line 58)
- Note: HEB integration requires Puppeteer and may take longer
