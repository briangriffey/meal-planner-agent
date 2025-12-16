#!/usr/bin/env ts-node

/**
 * Test the Email Rendering and Sending functionality
 *
 * This script tests the email template renderer and email connector
 * by generating a sample meal plan email and sending it.
 *
 * Usage:
 *   pnpm test:email              # Test mode - saves to file
 *   pnpm test:email --send       # Actually sends email via Gmail
 */

import { config } from 'dotenv';
import {
  EmailTemplateRenderer,
  MealPlanPostProcessor,
  EmailConnector,
  Meal
} from '@meal-planner/core';

// Load environment variables
config();

const SAMPLE_MEALS: Meal[] = [
  {
    day: "Day 1",
    name: "Garlic Herb Baked Cod with Roasted Vegetables",
    description: "Flaky white fish seasoned with fresh herbs and garlic, paired with colorful roasted vegetables. This Mediterranean-inspired dish is light yet satisfying, with bright flavors from lemon and parsley.",
    ingredients: [
      { item: "cod fillets", amount: "1 lb" },
      { item: "fresh parsley", amount: "2 tbsp chopped" },
      { item: "fresh lemon", amount: "1 whole" },
      { item: "garlic", amount: "4 cloves minced" },
      { item: "cherry tomatoes", amount: "1 cup halved" },
      { item: "zucchini", amount: "1 medium sliced" },
      { item: "olive oil", amount: "2 tbsp" },
      { item: "salt", amount: "1 tsp" },
      { item: "black pepper", amount: "1/2 tsp" }
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season cod with garlic, parsley, lemon juice, salt and pepper",
      "Toss vegetables with olive oil and seasonings",
      "Arrange vegetables on baking sheet, place cod on top",
      "Bake for 15-20 minutes until fish flakes easily"
    ],
    prepTime: "10 min",
    cookTime: "20 min",
    nutrition: {
      calories: 285,
      protein: 42,
      carbs: 12,
      fat: 8,
      fiber: 4
    }
  },
  {
    day: "Day 2",
    name: "Spicy Turkey and Black Bean Lettuce Wraps",
    description: "Seasoned ground turkey with black beans wrapped in crisp butter lettuce leaves. A protein-packed, low-carb meal with a kick of heat and fresh toppings.",
    ingredients: [
      { item: "ground turkey", amount: "1 lb" },
      { item: "black beans", amount: "1 cup cooked" },
      { item: "butter lettuce", amount: "1 head" },
      { item: "bell pepper", amount: "1 diced" },
      { item: "red onion", amount: "1/2 diced" },
      { item: "cumin", amount: "1 tsp" },
      { item: "chili powder", amount: "1 tsp" },
      { item: "lime", amount: "1 whole" },
      { item: "cilantro", amount: "1/4 cup chopped" }
    ],
    instructions: [
      "Brown turkey in large skillet over medium-high heat",
      "Add bell pepper and onion, cook until softened",
      "Stir in beans, cumin, and chili powder",
      "Cook for 5 minutes, squeeze in lime juice",
      "Serve in lettuce leaves, top with cilantro"
    ],
    prepTime: "10 min",
    cookTime: "15 min",
    nutrition: {
      calories: 365,
      protein: 41,
      carbs: 28,
      fat: 10,
      fiber: 9
    }
  },
  {
    day: "Day 3",
    name: "Mediterranean Chicken with Zucchini Noodles",
    description: "Grilled chicken breast seasoned with Mediterranean spices, served over fresh zucchini noodles with cherry tomatoes and feta. A light, veggie-forward dish bursting with flavor.",
    ingredients: [
      { item: "chicken breast", amount: "1.5 lbs" },
      { item: "zucchini", amount: "3 large spiralized" },
      { item: "cherry tomatoes", amount: "2 cups halved" },
      { item: "feta cheese", amount: "1/4 cup crumbled" },
      { item: "garlic", amount: "3 cloves minced" },
      { item: "oregano", amount: "1 tsp dried" },
      { item: "olive oil", amount: "2 tbsp" },
      { item: "lemon juice", amount: "2 tbsp" },
      { item: "kalamata olives", amount: "1/4 cup sliced" }
    ],
    instructions: [
      "Season chicken with oregano, salt, and pepper",
      "Grill chicken for 6-7 minutes per side until cooked through",
      "Sauté zucchini noodles with garlic in olive oil for 2-3 minutes",
      "Add cherry tomatoes and cook until just softened",
      "Slice chicken and serve over zucchini noodles",
      "Top with feta, olives, and lemon juice"
    ],
    prepTime: "15 min",
    cookTime: "15 min",
    nutrition: {
      calories: 385,
      protein: 45,
      carbs: 15,
      fat: 16,
      fiber: 5
    }
  }
];

async function testEmail() {
  console.log('📧 Testing Email Rendering and Sending\n');
  console.log('═'.repeat(60));

  const sendEmail = process.argv.includes('--send');

  if (sendEmail) {
    console.log('🚨 SEND MODE: Will actually send email via Gmail\n');

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Error: GMAIL_USER and GMAIL_APP_PASSWORD required for send mode');
      console.error('   Set these in your .env file or use test mode (no --send flag)');
      process.exit(1);
    }
  } else {
    console.log('📝 TEST MODE: Email will be saved to TESTEMAIL.html\n');
  }

  console.log('═'.repeat(60) + '\n');

  try {
    // Step 1: Post-process the meals (aggregate ingredients, categorize, generate HEB links)
    console.log('1️⃣  Processing meal data...');
    const postProcessor = new MealPlanPostProcessor();
    const processedData = await postProcessor.process(SAMPLE_MEALS, true); // HEB enabled

    console.log(`   ✅ Processed ${processedData.meals.length} meals`);
    console.log(`   ✅ Aggregated shopping list into ${Object.keys(processedData.shoppingList).length} categories`);
    console.log(`   ✅ Generated ${processedData.hebLinks.size} HEB search links\n`);

    // Step 2: Render the email template
    console.log('2️⃣  Rendering email template...');
    const renderer = new EmailTemplateRenderer();
    const emailHtml = renderer.render(processedData, {
      weekLabel: 'Week of December 15, 2025',
      includeHEBLinks: true,
      servingsPerMeal: 2,
      minProteinPerMeal: 40,
      maxCaloriesPerMeal: 600
    });

    console.log(`   ✅ Generated HTML email (${emailHtml.length} characters)\n`);

    // Step 3: Send or save the email
    console.log('3️⃣  ' + (sendEmail ? 'Sending email...' : 'Saving email to file...'));

    const emailConnector = new EmailConnector(
      {
        user: process.env.GMAIL_USER || 'test@example.com',
        appPassword: process.env.GMAIL_APP_PASSWORD || 'test',
        recipients: ['brian.a.griffey@gmail.com']
      },
      !sendEmail // testMode = true unless --send flag
    );

    const result = await emailConnector.execute({
      subject: '🍽️ Your High-Protein Dinner Meal Plan - Week of December 15, 2025',
      body: emailHtml
    });

    if (result.success) {
      console.log(`   ✅ ${result.message}\n`);

      if (result.testMode) {
        console.log('═'.repeat(60));
        console.log('📧 Email Preview Generated');
        console.log('═'.repeat(60));
        console.log(`File: ${result.filePath}`);
        console.log('Open this file in a browser to see the email\n');
      } else {
        console.log('═'.repeat(60));
        console.log('📧 Email Sent Successfully!');
        console.log('═'.repeat(60));
        console.log(`Message ID: ${result.messageId}\n`);
      }
    } else {
      console.error(`   ❌ Error: ${result.error}\n`);
      process.exit(1);
    }

    console.log('═'.repeat(60));
    console.log('✅ Test completed successfully\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  }
}

// Run the test
testEmail()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
