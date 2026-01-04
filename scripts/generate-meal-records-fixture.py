#!/usr/bin/env python3
"""
Generate meal records fixture data for testing
Creates 140+ meal records for the 15 COMPLETED meal plans
"""

import json
from datetime import datetime

# Sample meal recipes with full data
SAMPLE_MEALS = [
    {
        "name": "Grilled Chicken Breast with Roasted Vegetables",
        "ingredients": [
            {"item": "chicken breast", "amount": "1.5 lbs"},
            {"item": "broccoli florets", "amount": "2 cups"},
            {"item": "bell peppers", "amount": "2 medium"},
            {"item": "olive oil", "amount": "2 tbsp"},
            {"item": "garlic", "amount": "3 cloves"},
            {"item": "lemon", "amount": "1 medium"},
            {"item": "salt and pepper", "amount": "to taste"}
        ],
        "instructions": [
            "Preheat oven to 425°F.",
            "Season chicken breasts with salt, pepper, and minced garlic.",
            "Heat olive oil in oven-safe skillet over medium-high heat.",
            "Sear chicken for 3-4 minutes per side until golden brown.",
            "Add broccoli and peppers to the skillet around the chicken.",
            "Transfer skillet to oven and roast for 15-20 minutes.",
            "Check chicken reaches internal temperature of 165°F.",
            "Squeeze fresh lemon juice over chicken before serving."
        ],
        "nutrition": {"calories": 420, "protein": 45, "carbs": 18, "fat": 16, "fiber": 5},
        "prepTime": 15,
        "cookTime": 30,
        "hebAvailable": True
    },
    {
        "name": "Honey Garlic Salmon with Quinoa",
        "ingredients": [
            {"item": "salmon fillets", "amount": "1.5 lbs"},
            {"item": "quinoa", "amount": "1 cup"},
            {"item": "honey", "amount": "3 tbsp"},
            {"item": "soy sauce", "amount": "2 tbsp"},
            {"item": "garlic", "amount": "4 cloves"},
            {"item": "green beans", "amount": "2 cups"},
            {"item": "sesame seeds", "amount": "1 tbsp"}
        ],
        "instructions": [
            "Cook quinoa according to package directions.",
            "Mix honey, soy sauce, and minced garlic in a bowl.",
            "Brush salmon fillets with honey-garlic mixture.",
            "Bake salmon at 400°F for 12-15 minutes.",
            "Steam green beans for 5-7 minutes until tender-crisp.",
            "Serve salmon over quinoa with green beans on the side.",
            "Garnish with sesame seeds."
        ],
        "nutrition": {"calories": 520, "protein": 42, "carbs": 45, "fat": 18, "fiber": 6},
        "prepTime": 10,
        "cookTime": 20,
        "hebAvailable": True
    },
    {
        "name": "Turkey Meatballs with Marinara",
        "ingredients": [
            {"item": "ground turkey", "amount": "1.5 lbs"},
            {"item": "breadcrumbs", "amount": "1/2 cup"},
            {"item": "egg", "amount": "1 large"},
            {"item": "marinara sauce", "amount": "2 cups"},
            {"item": "zucchini", "amount": "4 medium"},
            {"item": "parmesan cheese", "amount": "1/4 cup"},
            {"item": "Italian seasoning", "amount": "2 tsp"}
        ],
        "instructions": [
            "Mix ground turkey, breadcrumbs, egg, and Italian seasoning.",
            "Form mixture into 16-20 meatballs.",
            "Brown meatballs in skillet over medium heat.",
            "Add marinara sauce and simmer for 15 minutes.",
            "Spiralize zucchini into noodles.",
            "Sauté zucchini noodles for 2-3 minutes until tender.",
            "Serve meatballs and sauce over zucchini noodles.",
            "Top with parmesan cheese."
        ],
        "nutrition": {"calories": 380, "protein": 38, "carbs": 22, "fat": 14, "fiber": 4},
        "prepTime": 20,
        "cookTime": 25,
        "hebAvailable": False
    },
    {
        "name": "Beef Stir-Fry with Brown Rice",
        "ingredients": [
            {"item": "sirloin steak", "amount": "1.5 lbs"},
            {"item": "brown rice", "amount": "1.5 cups"},
            {"item": "broccoli", "amount": "2 cups"},
            {"item": "snap peas", "amount": "1 cup"},
            {"item": "carrots", "amount": "1 cup sliced"},
            {"item": "soy sauce", "amount": "3 tbsp"},
            {"item": "ginger", "amount": "1 tbsp minced"},
            {"item": "sesame oil", "amount": "2 tsp"}
        ],
        "instructions": [
            "Cook brown rice according to package directions.",
            "Slice beef into thin strips against the grain.",
            "Heat sesame oil in wok over high heat.",
            "Stir-fry beef for 3-4 minutes until browned, remove.",
            "Add vegetables and stir-fry for 5-6 minutes.",
            "Return beef to pan with soy sauce and ginger.",
            "Cook for 2 more minutes, tossing to combine.",
            "Serve over brown rice."
        ],
        "nutrition": {"calories": 480, "protein": 44, "carbs": 42, "fat": 14, "fiber": 5},
        "prepTime": 15,
        "cookTime": 20,
        "hebAvailable": True
    },
    {
        "name": "Baked Tofu Buddha Bowl",
        "ingredients": [
            {"item": "firm tofu", "amount": "14 oz"},
            {"item": "sweet potato", "amount": "2 medium"},
            {"item": "kale", "amount": "2 cups chopped"},
            {"item": "chickpeas", "amount": "1 can"},
            {"item": "tahini", "amount": "3 tbsp"},
            {"item": "lemon juice", "amount": "2 tbsp"},
            {"item": "quinoa", "amount": "1 cup"}
        ],
        "instructions": [
            "Press tofu and cut into cubes, toss with soy sauce.",
            "Dice sweet potatoes and drain chickpeas.",
            "Roast tofu, sweet potatoes, and chickpeas at 400°F for 25 minutes.",
            "Cook quinoa according to package directions.",
            "Massage kale with olive oil until softened.",
            "Make tahini dressing with tahini, lemon juice, and water.",
            "Assemble bowls with quinoa, kale, roasted vegetables, and tofu.",
            "Drizzle with tahini dressing."
        ],
        "nutrition": {"calories": 450, "protein": 22, "carbs": 58, "fat": 16, "fiber": 12},
        "prepTime": 20,
        "cookTime": 30,
        "hebAvailable": False
    },
    {
        "name": "Lemon Herb Chicken Thighs",
        "ingredients": [
            {"item": "chicken thighs", "amount": "2 lbs"},
            {"item": "baby potatoes", "amount": "1.5 lbs"},
            {"item": "lemon", "amount": "2 medium"},
            {"item": "fresh rosemary", "amount": "2 tbsp"},
            {"item": "garlic", "amount": "6 cloves"},
            {"item": "olive oil", "amount": "3 tbsp"}
        ],
        "instructions": [
            "Preheat oven to 425°F.",
            "Halve baby potatoes and toss with olive oil, salt, and pepper.",
            "Season chicken with lemon zest, rosemary, and minced garlic.",
            "Arrange chicken and potatoes on a baking sheet.",
            "Roast for 35-40 minutes until chicken is cooked through.",
            "Squeeze fresh lemon juice over chicken before serving."
        ],
        "nutrition": {"calories": 510, "protein": 38, "carbs": 32, "fat": 24, "fiber": 4},
        "prepTime": 15,
        "cookTime": 40,
        "hebAvailable": True
    },
    {
        "name": "Shrimp Tacos with Cabbage Slaw",
        "ingredients": [
            {"item": "large shrimp", "amount": "1.5 lbs"},
            {"item": "corn tortillas", "amount": "12 small"},
            {"item": "red cabbage", "amount": "2 cups shredded"},
            {"item": "lime", "amount": "2 medium"},
            {"item": "cilantro", "amount": "1/2 cup"},
            {"item": "avocado", "amount": "2 medium"},
            {"item": "chili powder", "amount": "1 tbsp"}
        ],
        "instructions": [
            "Season shrimp with chili powder, cumin, and lime juice.",
            "Make slaw by mixing cabbage, lime juice, and cilantro.",
            "Sauté shrimp in hot skillet for 2-3 minutes per side.",
            "Warm tortillas in a separate pan.",
            "Mash avocado with lime juice for guacamole.",
            "Assemble tacos with shrimp, slaw, and guacamole."
        ],
        "nutrition": {"calories": 440, "protein": 36, "carbs": 38, "fat": 16, "fiber": 10},
        "prepTime": 20,
        "cookTime": 10,
        "hebAvailable": True
    }
]

# Meal plan configurations (plan_id: meal_count)
MEAL_PLAN_CONFIGS = {
    "plan-fixture-001": 7,
    "plan-fixture-002": 7,
    "plan-fixture-003": 7,
    "plan-fixture-004": 7,
    "plan-fixture-005": 7,
    "plan-fixture-006": 5,
    "plan-fixture-007": 5,
    "plan-fixture-008": 5,
    "plan-fixture-009": 10,
    "plan-fixture-010": 10,
    "plan-fixture-011": 10,
    "plan-fixture-012": 14,
    "plan-fixture-013": 14,
    "plan-fixture-014": 7,
    "plan-fixture-015": 7
}

def generate_meal_records():
    """Generate meal records for all completed meal plans"""
    meal_records = []
    record_id = 1

    for plan_id, meal_count in MEAL_PLAN_CONFIGS.items():
        for day in range(1, meal_count + 1):
            # Cycle through sample meals
            meal = SAMPLE_MEALS[(record_id - 1) % len(SAMPLE_MEALS)]

            meal_record = {
                "id": f"meal-record-{str(record_id).zfill(3)}",
                "mealPlanId": plan_id,
                "dayNumber": day,
                "data": meal,
                "createdAt": "2025-01-01T10:00:00.000Z"
            }

            meal_records.append(meal_record)
            record_id += 1

    return meal_records

def main():
    meal_records = generate_meal_records()

    # Write to fixture file
    output_file = "/Users/briangriffey/Code/meal-planner-agent/packages/database/fixtures/meal-records.json"
    with open(output_file, 'w') as f:
        json.dump(meal_records, f, indent=2)

    print(f"Generated {len(meal_records)} meal records")
    print(f"Written to {output_file}")

if __name__ == "__main__":
    main()
