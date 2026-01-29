# SEM Strategy - Meal Planner Agent

This document outlines the comprehensive Search Engine Marketing (SEM) strategy for the Meal Planner Agent web application at [mealplanner.briangriffey.com](https://mealplanner.briangriffey.com). The goal is to drive qualified traffic through Google Ads across Search, Display, and YouTube campaigns.

## Table of Contents

- [Executive Summary](#executive-summary)
- [Environment Variables](#environment-variables)
- [Target Keywords & Search Volumes](#target-keywords--search-volumes)
- [Ad Group Structure](#ad-group-structure)
- [Campaign Types](#campaign-types)
- [Budget Allocation](#budget-allocation)
- [Sample Ad Copy](#sample-ad-copy)
- [Landing Page Recommendations](#landing-page-recommendations)
- [Conversion Tracking Setup](#conversion-tracking-setup)
- [Optimization Strategy](#optimization-strategy)
- [Implementation Timeline](#implementation-timeline)

---

## Executive Summary

### Strategic Overview

The Meal Planner Agent SEM strategy focuses on Google Ads as the primary paid acquisition channel, targeting high-intent users actively searching for meal planning solutions. Based on competitive research and market analysis, we've identified a total addressable market with **50,000+ monthly searches** across our target keywords.

### Key Recommendations

1. **Initial Budget**: $800-$1,200/month across all Google Ads campaigns
2. **Primary Focus**: Google Search Ads (70% of budget) targeting high-intent keywords
3. **Supporting Channels**: Display Network (20%) and YouTube (10%) for awareness and retargeting
4. **Target CPC**: $1.50-$2.50 average (based on industry benchmarks)
5. **Expected Monthly Clicks**: 400-800 clicks at target CPC
6. **Target Conversion Rate**: 3-5% (sign-ups from clicks)
7. **Expected Monthly Sign-ups**: 12-40 new users

### Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Cost Per Click (CPC) | $1.50-$2.50 | Google Ads dashboard |
| Click-Through Rate (CTR) | 3-5% | Google Ads dashboard |
| Conversion Rate | 3-5% | Google Analytics + GA4 events |
| Cost Per Acquisition (CPA) | $30-$50 | Calculated from conversions |
| Return on Ad Spend (ROAS) | 3:1+ (after 6 months) | Revenue/ad spend |
| Quality Score | 7+ | Google Ads keyword quality score |

---

## Environment Variables

The SEM implementation requires Google Ads conversion tracking integration with Google Analytics 4.

### NEXT_PUBLIC_GA_ID

**Purpose**: Google Analytics 4 Measurement ID for tracking conversions from Google Ads campaigns.

**Type**: Public environment variable (accessible in browser)

**Format**: `G-XXXXXXXXXX`

**Required**: Yes (critical for conversion tracking)

**Configuration**:
```bash
# .env.local (development)
# .env.production (production)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

**SEM-Specific Usage**:
- Tracks Google Ads conversion events: `sign_up`, `generate_meal_plan`, `enable_automation`
- Links Google Ads and Google Analytics for attribution reporting
- Enables remarketing audiences for Display and YouTube campaigns
- Powers conversion optimization in Smart Bidding strategies

**Setup Steps**:
1. Create Google Analytics 4 property (if not already created)
2. Link Google Ads account to GA4: Admin → Data Display → Google Ads Links
3. Import GA4 conversion events into Google Ads as conversion actions
4. Enable auto-tagging in Google Ads: Settings → Account settings → Auto-tagging
5. Set environment variable with GA4 Measurement ID

**Conversion Events Configuration**:

The following GA4 events should be imported as Google Ads conversions:

| Event Name | Value | Conversion Action Type | Primary Conversion |
|------------|-------|----------------------|-------------------|
| `sign_up` | Free | Sign-up | Yes |
| `verify_email` | Free | Sign-up | No |
| `generate_meal_plan` | Calculated | Engagement | Yes |
| `enable_automation` | Calculated | Engagement | Yes |

**Important Notes**:
- Auto-tagging must be enabled for proper attribution
- Conversion window: 30 days click, 1 day view (Google Ads default)
- Use GA4's data-driven attribution model (recommended)
- Cross-domain tracking not required (single domain deployment)

---

### NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID

**Purpose**: Google Ads conversion tracking ID for dedicated conversion tracking (alternative to GA4 import).

**Type**: Public environment variable (accessible in browser)

**Format**: `AW-XXXXXXXXXX`

**Required**: No (optional if using GA4 conversion import)

**Configuration**:
```bash
# .env.production (production)
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID="AW-1234567890"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_SIGNUP="AbCdEfGhIjKlMnOp"
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_MEAL_PLAN="QrStUvWxYzAbCdEf"
```

**When to Use**:
- If you need dedicated Google Ads conversion tracking separate from GA4
- For more granular control over conversion counting methods
- If implementing enhanced conversions for better accuracy

**Setup Steps**:
1. In Google Ads, go to Tools → Conversions → New conversion action
2. Choose "Website" and set up conversion tracking
3. Copy the Conversion ID (format: `AW-XXXXXXXXXX`)
4. Copy each conversion label for different actions
5. Implement the global site tag (gtag.js) with conversion tracking

**Note**: For simplicity, we recommend using GA4 conversion import rather than dedicated conversion tracking. This reduces implementation complexity and provides unified analytics.

---

## Target Keywords & Search Volumes

### Keyword Research Methodology

Keywords were selected based on:
1. **Search Volume**: Monthly searches in Google Search Console and keyword planner data
2. **Commercial Intent**: Likelihood to convert to sign-ups
3. **Competition Level**: Estimated CPC and difficulty
4. **Relevance**: Alignment with Meal Planner Agent's value proposition

### Primary Keywords (High-Intent, High-Volume)

These keywords represent the core of our Search campaign strategy. Target 70% of Search campaign budget here.

| Keyword | Monthly Volume | Estimated CPC | Match Type | Intent | Priority |
|---------|---------------|--------------|-----------|--------|----------|
| ai meal planner | 8,100 | $2.00-$3.00 | Phrase, Exact | Commercial | Critical |
| meal planning app | 12,100 | $2.50-$3.50 | Phrase, Exact | Commercial | Critical |
| ai meal planning | 2,900 | $1.50-$2.50 | Phrase, Exact | Informational | High |
| automatic meal planner | 1,600 | $1.50-$2.00 | Phrase, Exact | Commercial | High |
| weekly meal planner | 18,100 | $2.00-$3.00 | Phrase | Commercial | High |

**Total Primary Volume**: ~42,800 monthly searches

### Secondary Keywords (Supporting Traffic)

These keywords support the primary keywords with related searches. Allocate 20% of Search campaign budget.

| Keyword | Monthly Volume | Estimated CPC | Match Type | Intent | Priority |
|---------|---------------|--------------|-----------|--------|----------|
| personalized meal plan | 3,600 | $1.80-$2.50 | Phrase | Commercial | Medium |
| nutrition meal planner | 1,900 | $1.50-$2.20 | Phrase | Commercial | Medium |
| meal prep planner | 8,100 | $1.80-$2.80 | Phrase | Commercial | Medium |
| healthy meal planning | 4,400 | $1.20-$2.00 | Phrase | Informational | Medium |
| family meal planner | 9,900 | $1.50-$2.50 | Phrase | Commercial | Low |

**Total Secondary Volume**: ~27,900 monthly searches

### Long-Tail Keywords (High Conversion Potential)

These specific phrases have lower volume but higher conversion rates. Allocate 10% of Search campaign budget.

| Keyword | Monthly Volume | Estimated CPC | Match Type | Intent | Priority |
|---------|---------------|--------------|-----------|--------|----------|
| ai powered meal planning app | 390 | $1.20-$1.80 | Exact | Commercial | High |
| automatic weekly meal planner | 480 | $1.30-$2.00 | Exact | Commercial | High |
| meal planner with grocery list | 1,300 | $1.50-$2.20 | Phrase | Commercial | Medium |
| ai meal plan generator | 590 | $1.40-$2.00 | Exact | Commercial | High |
| personalized nutrition meal plan | 320 | $1.30-$1.90 | Exact | Commercial | High |
| meal planner that learns preferences | 140 | $0.80-$1.50 | Exact | Commercial | High |

**Total Long-Tail Volume**: ~3,220 monthly searches

### Negative Keywords

To prevent wasted spend and improve campaign efficiency, exclude these keywords:

**Category: Free/DIY Solutions**
- free
- free meal planner
- printable meal planner
- meal planner template
- diy meal planning

**Category: Unrelated Products**
- meal delivery
- meal kit
- hello fresh
- blue apron
- meal delivery service

**Category: Job/Career Related**
- meal planner job
- meal planner career
- dietitian
- nutritionist certification

**Category: Wrong Intent**
- meal planner notebook
- meal planner sticker
- meal planner for dogs
- meal planner for pets

**Implementation**: Add these as campaign-level negative keywords in both exact and phrase match types.

---

## Ad Group Structure

### Campaign Hierarchy

The Google Ads account structure follows best practices for organization and optimization:

```
Account: Meal Planner Agent
├── Campaign 1: Search - Brand
│   └── Ad Group: Brand Terms
├── Campaign 2: Search - Competitors
│   └── Ad Group: Competitor Comparison
├── Campaign 3: Search - High Intent
│   ├── Ad Group: AI Meal Planning
│   ├── Ad Group: Meal Planning Apps
│   └── Ad Group: Automatic Planning
├── Campaign 4: Search - Secondary Intent
│   ├── Ad Group: Personalized Plans
│   ├── Ad Group: Nutrition Planning
│   └── Ad Group: Family Meal Planning
├── Campaign 5: Search - Long Tail
│   ├── Ad Group: Feature-Specific
│   └── Ad Group: Problem-Solution
├── Campaign 6: Display - Awareness
│   ├── Ad Group: In-Market Audiences
│   └── Ad Group: Custom Intent
├── Campaign 7: Display - Retargeting
│   ├── Ad Group: Site Visitors
│   └── Ad Group: Engaged Users
└── Campaign 8: Video - YouTube
    ├── Ad Group: In-Stream Skippable
    └── Ad Group: Video Discovery
```

### Ad Group Details

#### Campaign 1: Search - Brand

**Objective**: Capture branded traffic and protect brand visibility

**Ad Group: Brand Terms**
- Keywords:
  - meal planner agent (exact)
  - mealplanner.briangriffey.com (exact)
  - meal planner agent app (exact)
- Budget: $50-$100/month (5-10% of total)
- Expected CPC: $0.50-$1.00 (low competition)
- Match Type: Exact match only

---

#### Campaign 2: Search - Competitors

**Objective**: Capture users researching competitor solutions

**Ad Group: Competitor Comparison**
- Keywords:
  - emeals alternative (phrase)
  - mealime alternative (phrase)
  - platejoy alternative (phrase)
  - paprika app alternative (phrase)
  - yummly alternative (phrase)
- Budget: $100-$150/month (10-15% of total)
- Expected CPC: $1.50-$2.50
- Match Type: Phrase match
- Ad Copy Focus: Comparison messaging, unique AI features

---

#### Campaign 3: Search - High Intent

**Objective**: Convert users actively searching for meal planning solutions

**Ad Group: AI Meal Planning**
- Keywords:
  - ai meal planner (phrase, exact)
  - ai meal planning (phrase, exact)
  - ai powered meal planning app (exact)
  - ai meal plan generator (exact)
- Budget: $200-$300/month (25-30%)
- Expected CPC: $1.80-$2.80
- Landing Page: Homepage with AI features highlighted

**Ad Group: Meal Planning Apps**
- Keywords:
  - meal planning app (phrase, exact)
  - best meal planning app (phrase)
  - meal planner app (phrase)
- Budget: $150-$250/month (20-25%)
- Expected CPC: $2.00-$3.50 (highest competition)
- Landing Page: Features page or homepage

**Ad Group: Automatic Planning**
- Keywords:
  - automatic meal planner (phrase, exact)
  - automatic weekly meal planner (exact)
- Budget: $100-$150/month (10-15%)
- Expected CPC: $1.50-$2.00
- Landing Page: Homepage with automation focus

---

#### Campaign 4: Search - Secondary Intent

**Objective**: Capture supporting keyword traffic with mid-tier intent

**Ad Group: Personalized Plans**
- Keywords:
  - personalized meal plan (phrase)
  - personalized nutrition meal plan (exact)
- Budget: $50-$100/month (5-10%)
- Expected CPC: $1.50-$2.50

**Ad Group: Nutrition Planning**
- Keywords:
  - nutrition meal planner (phrase)
  - healthy meal planning (phrase)
- Budget: $50-$80/month (5-8%)
- Expected CPC: $1.20-$2.20

**Ad Group: Family Meal Planning**
- Keywords:
  - family meal planner (phrase)
  - weekly meal planner (phrase)
- Budget: $50-$80/month (5-8%)
- Expected CPC: $1.50-$2.50

---

#### Campaign 5: Search - Long Tail

**Objective**: Capture highly specific, high-conversion searches

**Ad Group: Feature-Specific**
- Keywords:
  - meal planner with grocery list (phrase)
  - meal planner that learns preferences (exact)
- Budget: $30-$50/month (3-5%)
- Expected CPC: $1.00-$2.00

**Ad Group: Problem-Solution**
- Keywords:
  - meal planning for busy families (phrase, exact)
- Budget: $20-$40/month (2-4%)
- Expected CPC: $0.80-$1.50

---

#### Campaign 6: Display - Awareness

**Objective**: Build brand awareness and reach in-market audiences

**Ad Group: In-Market Audiences**
- Targeting:
  - Cooking Enthusiasts
  - Health & Fitness Fans
  - Weight Loss / Dieting
  - Organic & Natural Products
- Budget: $100-$150/month (10-15%)
- Expected CPM: $2-$5
- Ad Format: Responsive display ads

**Ad Group: Custom Intent**
- Targeting:
  - Users who searched for meal planning keywords in past 30 days
  - Users who visited competitor websites
- Budget: $50-$100/month (5-10%)
- Expected CPM: $3-$6

---

#### Campaign 7: Display - Retargeting

**Objective**: Re-engage site visitors and increase conversions

**Ad Group: Site Visitors**
- Audience:
  - All website visitors (past 30 days)
  - Exclude converters (signed up)
- Budget: $50-$80/month (5-8%)
- Expected CPC: $0.50-$1.00
- Ad Copy: "Come back to create your meal plan"

**Ad Group: Engaged Users**
- Audience:
  - Visitors who spent 2+ minutes on site
  - Visitors who viewed 3+ pages
  - Exclude converters
- Budget: $30-$50/month (3-5%)
- Expected CPC: $0.40-$0.80
- Ad Copy: Highlight specific features they viewed

---

#### Campaign 8: Video - YouTube

**Objective**: Build awareness through video content on YouTube

**Ad Group: In-Stream Skippable**
- Targeting:
  - Cooking channels (placement targeting)
  - Health & wellness channels
  - Parenting channels
  - Keywords: meal prep, meal planning, healthy eating
- Budget: $50-$100/month (5-10%)
- Expected CPV: $0.10-$0.30
- Video Format: 15-30 second skippable in-stream ads

**Ad Group: Video Discovery**
- Targeting:
  - YouTube search results for "meal planning"
  - Related videos on cooking channels
- Budget: $30-$50/month (3-5%)
- Expected CPV: $0.05-$0.15
- Video Format: Video discovery ads in search results

---

## Campaign Types

### 1. Google Search Ads (Primary Focus)

**Budget Allocation**: 70% ($560-$840/month)

**Campaign Types**:
- Brand protection
- Competitor targeting
- High-intent keywords
- Secondary keywords
- Long-tail keywords

**Bidding Strategy**:
- **Phase 1 (Month 1-2)**: Manual CPC bidding to gather data
  - Start with $1.50-$2.00 max CPC
  - Adjust based on performance (target position 1-4)
  - Focus on Quality Score improvement

- **Phase 2 (Month 3+)**: Transition to Smart Bidding
  - Use "Maximize Conversions" with target CPA
  - Target CPA: $30-$50 (based on Month 1-2 data)
  - Enable conversion value optimization

**Ad Extensions** (mandatory for all Search campaigns):
- **Sitelink Extensions**:
  - "See Features" → /features
  - "How It Works" → /how-it-works
  - "Sign Up Free" → /register
  - "View Sample Plan" → /sample-meal-plan

- **Callout Extensions**:
  - "AI-Powered Meal Planning"
  - "Personalized to Your Preferences"
  - "Free to Start"
  - "No Credit Card Required"

- **Structured Snippets**:
  - Features: AI Generation, Grocery Lists, Dietary Preferences, Nutritional Info
  - Diet Types: Keto, Vegan, Paleo, Low-Carb, Gluten-Free

- **Image Extensions**:
  - Screenshot of meal plan interface
  - Sample meal plan output
  - Mobile app screenshots

**Ad Scheduling**:
- **Peak Hours** (1.2x bid adjustment):
  - Monday-Friday: 7-9am, 4-7pm (meal planning decision times)
  - Sunday: 2-8pm (traditional meal planning day)

- **Reduced Hours** (0.7x bid adjustment):
  - Late night: 11pm-6am (low conversion times)
  - Work hours: 9am-4pm on weekdays (lower engagement)

**Device Targeting**:
- Mobile: 1.0x baseline (40% of traffic)
- Desktop: 1.1x modifier (higher conversion rate)
- Tablet: 0.9x modifier (lower volume)

**Geographic Targeting**:
- **Phase 1**: United States (all states)
- **Performance Optimization**: Increase bids by 20% in top-performing metros:
  - Austin, TX (HEB integration advantage)
  - Houston, TX
  - San Antonio, TX
  - Major metro areas (NYC, LA, Chicago, SF, etc.)

---

### 2. Google Display Network (Supporting Awareness)

**Budget Allocation**: 20% ($160-$240/month)

**Campaign Types**:
1. **Awareness Campaign** (60% of Display budget)
   - Targeting: In-market audiences + custom intent
   - Goal: Reach new users, build brand awareness

2. **Retargeting Campaign** (40% of Display budget)
   - Targeting: Website visitors (past 30 days)
   - Goal: Re-engage users, increase conversion rate

**Targeting Strategy**:

**In-Market Audiences**:
- Cooking Enthusiasts & Recipes
- Diets & Weight Loss
- Health & Fitness
- Organic & Natural Products

**Affinity Audiences**:
- Cooking Enthusiasts
- Health & Fitness Buffs
- Foodies

**Custom Intent Audiences**:
- Users who searched for: meal planning app, ai meal planner, meal prep
- Users who visited: competitor websites (eMeals, Mealime, PlateJoy)

**Placement Targeting** (managed placements for Display):
- Food Network website
- AllRecipes.com
- Epicurious.com
- MyFitnessPal blog
- Health-focused blogs and publications

**Ad Formats**:
1. **Responsive Display Ads** (primary format)
   - Headlines: 5 variations (30 characters max)
   - Descriptions: 5 variations (90 characters max)
   - Images: Multiple sizes (square, landscape)
   - Logo: Meal Planner Agent branding

2. **Uploaded Image Ads** (secondary)
   - Standard sizes: 300x250, 728x90, 160x600, 300x600
   - Custom designed with call-to-action
   - A/B test different messaging

**Frequency Capping**:
- Maximum 5 impressions per user per day
- Maximum 20 impressions per user per week
- Prevents ad fatigue and wasted spend

---

### 3. YouTube Video Ads (Brand Building)

**Budget Allocation**: 10% ($80-$120/month)

**Campaign Types**:

**Campaign A: In-Stream Skippable Ads** (70% of YouTube budget)
- Format: 15-30 second video ads that play before YouTube videos
- Billing: Cost-per-view (CPV) when user watches 30 seconds or interacts
- Expected CPV: $0.10-$0.30
- Goal: Brand awareness and consideration

**Campaign B: Video Discovery Ads** (30% of YouTube budget)
- Format: Thumbnail + text ad in YouTube search results and related videos
- Billing: Cost-per-view when user clicks to watch
- Expected CPV: $0.05-$0.15
- Goal: Capture active searchers on YouTube

**Targeting Strategy**:

**Placement Targeting** (specific channels):
- Top cooking channels: Tasty, Binging with Babish, Joshua Weissman
- Health & fitness channels: Athlean-X, Jeff Nippard
- Family/parenting channels: What's Up Moms

**Keyword Targeting**:
- meal prep
- meal planning
- healthy eating
- weekly meal prep
- meal prep for beginners
- healthy meal ideas

**Audience Targeting**:
- In-market: Cooking & Recipes, Health & Fitness
- Custom intent: Users searching meal planning related terms
- Remarketing: Website visitors (retargeting with brand message)

**Video Creative Requirements**:

**Version 1: Problem-Solution (15 seconds)**
- 0-3s: Hook - "Tired of asking 'what's for dinner?'"
- 3-8s: Solution - "Meal Planner Agent uses AI to create personalized weekly plans"
- 8-12s: Benefit - "Save hours and eat healthier"
- 12-15s: CTA - "Start free at mealplanner.briangriffey.com"

**Version 2: Feature Highlight (30 seconds)**
- 0-5s: Hook - Show stress of meal planning
- 5-15s: Demo - Quick app walkthrough
- 15-25s: Benefits - AI personalization, grocery lists, dietary preferences
- 25-30s: CTA - "Sign up free, no credit card required"

**Version 3: Testimonial/Social Proof (20 seconds)**
- 0-5s: User testimonial - "This changed our weeknight dinners"
- 5-15s: Show app in action
- 15-20s: CTA - "Join thousands of families. Start free today"

**Creative Production Notes**:
- Use royalty-free stock footage initially (cost-effective)
- Screen recordings of actual app interface
- Text overlays for key messages (mobile viewing)
- Background music (upbeat, modern)
- Closed captions (80% watch without sound)

---

## Budget Allocation

### Monthly Budget Breakdown

**Total Recommended Budget**: $800-$1,200/month

#### Tier 1: Launch Budget ($800/month)

Minimum viable budget for effective campaign launch:

| Campaign Type | Monthly Budget | % of Total | Expected Clicks | Expected Conversions |
|--------------|---------------|-----------|----------------|---------------------|
| **Search - Brand** | $80 | 10% | 80-160 | 4-8 |
| **Search - High Intent** | $320 | 40% | 160-213 | 5-11 |
| **Search - Secondary** | $80 | 10% | 40-67 | 1-3 |
| **Search - Competitors** | $80 | 10% | 40-53 | 1-3 |
| **Display - Awareness** | $80 | 10% | 160-320 | 2-5 |
| **Display - Retargeting** | $80 | 10% | 160-200 | 3-6 |
| **YouTube - Video** | $80 | 10% | 267-800 views | 1-3 |
| **TOTAL** | **$800** | **100%** | **~500-700** | **17-39** |

**Key Metrics at Launch Budget**:
- Cost per click: $1.50-$2.00 average
- Conversion rate: 3-5% (clicks to sign-ups)
- Cost per acquisition: $20-$47
- Expected monthly sign-ups: 17-39 users

---

#### Tier 2: Growth Budget ($1,200/month)

Recommended budget for scaling and optimization:

| Campaign Type | Monthly Budget | % of Total | Expected Clicks | Expected Conversions |
|--------------|---------------|-----------|----------------|---------------------|
| **Search - Brand** | $120 | 10% | 120-240 | 6-12 |
| **Search - High Intent** | $480 | 40% | 240-320 | 7-16 |
| **Search - Secondary** | $120 | 10% | 60-100 | 2-5 |
| **Search - Competitors** | $120 | 10% | 60-80 | 2-4 |
| **Display - Awareness** | $120 | 10% | 240-480 | 3-7 |
| **Display - Retargeting** | $120 | 10% | 240-300 | 5-9 |
| **YouTube - Video** | $120 | 10% | 400-1,200 views | 2-5 |
| **TOTAL** | **$1,200** | **100%** | **~750-1,050** | **27-58** |

**Key Metrics at Growth Budget**:
- Cost per click: $1.40-$1.80 average (improved from optimization)
- Conversion rate: 3.5-5.5% (improved landing pages, targeting)
- Cost per acquisition: $21-$44
- Expected monthly sign-ups: 27-58 users

---

### Budget Scaling Strategy

**Month 1-2: Learning Phase ($800/month)**
- Focus: Data gathering and optimization
- Goal: Achieve 50+ conversions for algorithm learning
- Strategy: Manual CPC bidding, test multiple ad variations
- Key Actions:
  - Monitor Quality Scores (target 7+)
  - Identify best-performing keywords
  - A/B test ad copy (minimum 3 variations per ad group)
  - Optimize landing pages based on bounce rate

**Month 3-4: Optimization Phase ($1,000/month)**
- Focus: Implement learnings, scale what works
- Goal: Improve CPA by 15-20%
- Strategy: Transition to Smart Bidding (Maximize Conversions)
- Key Actions:
  - Increase budget on top-performing campaigns by 30%
  - Pause underperforming keywords (CPA > $60)
  - Add negative keywords based on search term reports
  - Launch Display retargeting campaigns

**Month 5+: Scaling Phase ($1,200+/month)**
- Focus: Aggressive scaling while maintaining CPA
- Goal: 2x conversion volume while keeping CPA under $50
- Strategy: Expand to additional keywords and audiences
- Key Actions:
  - Launch YouTube video campaigns
  - Test Performance Max campaigns (Google's automated campaign type)
  - Expand geographic targeting based on top-performing regions
  - Implement value-based bidding (optimize for high-value users)

---

### Budget Allocation by Persona

Allocate budget based on persona volume and conversion potential:

| Persona | % of Budget | Targeting Strategy | Expected CPA |
|---------|------------|-------------------|-------------|
| **Busy Parent Beth** | 35% | "family meal planner", "meal planning for busy families" | $25-$35 |
| **Fitness-Focused Frank** | 25% | "nutrition meal planner", "personalized meal plan" | $30-$45 |
| **Meal Prep Maven Maria** | 20% | "meal prep planner", "weekly meal planner" | $20-$30 |
| **Budget-Conscious Brian** | 10% | "save money meal planning", "grocery list planner" | $35-$50 |
| **Health-Seeker Hannah** | 10% | "healthy meal planning", "ai nutrition" | $30-$40 |

**Implementation**:
- Create separate campaigns for each persona
- Use audience targeting on Display/YouTube to reach specific personas
- Tailor ad copy to persona pain points and goals

---

### ROI Projections

**Assumptions**:
- Average CPA: $35 (blended across all campaigns)
- User lifetime value (LTV): $120 (estimated over 12 months, including potential premium features)
- Conversion rate: 4% (clicks to sign-ups)
- LTV:CAC ratio target: 3:1+

**Month 1-3 Projections (Learning Phase)**:
- Monthly ad spend: $800
- Monthly conversions: 23 sign-ups
- CPA: $35
- Monthly cost: $800
- 3-month total spend: $2,400
- 3-month total conversions: 69 sign-ups
- 12-month LTV of cohort: $8,280
- ROI: 245% (3.45:1 LTV:CAC ratio)

**Month 4-6 Projections (Optimization Phase)**:
- Monthly ad spend: $1,000
- Monthly conversions: 33 sign-ups (improved CPA)
- CPA: $30 (optimized)
- Monthly cost: $1,000
- 3-month total spend: $3,000
- 3-month total conversions: 99 sign-ups
- 12-month LTV of cohort: $11,880
- ROI: 296% (3.96:1 LTV:CAC ratio)

**Month 7-12 Projections (Scaling Phase)**:
- Monthly ad spend: $1,200
- Monthly conversions: 43 sign-ups
- CPA: $28 (further optimized)
- Monthly cost: $1,200
- 6-month total spend: $7,200
- 6-month total conversions: 258 sign-ups
- 12-month LTV of cohort: $30,960
- ROI: 330% (4.30:1 LTV:CAC ratio)

**Year 1 Total**:
- Total ad spend: $12,600
- Total conversions: 426 sign-ups
- Average CPA: $29.58
- Total LTV (12-month cohort): $51,120
- First-year ROI: 306% (4.06:1 LTV:CAC ratio)

---

## Sample Ad Copy

### Search Ads - Responsive Search Ads (RSA) Format

Google Search Ads use Responsive Search Ads (RSA) which allow up to 15 headlines and 4 descriptions. Google's algorithm tests combinations to find the best performers.

#### Ad Group: AI Meal Planning

**Headlines** (15 variations, 30 characters max):
1. AI-Powered Meal Planning App
2. Personalized Weekly Meal Plans
3. Smart Meal Planner with AI
4. Get Your Meal Plan in Minutes
5. Meal Planning Made Effortless
6. AI Creates Your Perfect Menu
7. Custom Meal Plans for You
8. Save 5 Hours Per Week
9. Never Ask "What's for Dinner?"
10. Automated Weekly Meal Plans
11. Tailored to Your Preferences
12. Try Free - No Credit Card
13. Join Thousands of Happy Users
14. HEB Grocery Integration
15. Dietary Preferences Built-In

**Descriptions** (4 variations, 90 characters max):
1. Our AI learns your preferences and creates personalized weekly meal plans. Start free today!
2. Get custom meal plans with grocery lists in minutes. Perfect for busy families. Try it free.
3. AI-powered meal planning that adapts to your diet, family size & preferences. Sign up free.
4. Stop stressing about meals. Get personalized plans, grocery lists & recipes. Free to start!

**Display URL**: mealplanner.briangriffey.com
**Final URL**: https://mealplanner.briangriffey.com/?utm_source=google&utm_medium=cpc&utm_campaign=search-ai-meal-planning

---

#### Ad Group: Meal Planning Apps

**Headlines**:
1. Top Rated Meal Planning App
2. Best AI Meal Planner 2026
3. Meal Planning App That Learns
4. Personalized Meal Plans Daily
5. Smart Weekly Meal Planner
6. The Future of Meal Planning
7. Automated Grocery Lists
8. Custom Family Meal Plans
9. Save Time & Eat Healthier
10. Meal Planning for Busy Lives
11. Start Free - No Card Needed
12. Trusted by Busy Families
13. 5-Star Meal Planning Tool
14. Plan Meals in Under 5 Minutes
15. AI Meal Planning Revolution

**Descriptions**:
1. Discover the meal planning app that uses AI to create perfect plans for your family. Free trial.
2. Personalized weekly meal plans + grocery lists. Dietary restrictions supported. Start free now.
3. Join families saving 5+ hours weekly with AI meal planning. No credit card required to start.
4. The smartest way to plan meals. AI learns your tastes & creates custom weekly plans. Try free!

---

#### Ad Group: Competitor Comparison (Alternative Keywords)

**Headlines**:
1. Better Than [Competitor Name]
2. AI-Powered Meal Planning
3. More Personalization, Less Cost
4. Smarter Meal Planning Solution
5. Advanced AI Technology
6. Truly Personalized Meal Plans
7. Learn Your Preferences Over Time
8. Free to Start - No Commitment
9. Plans That Adapt to You
10. Superior Meal Planning
11. Meal Planner Agent
12. Join the AI Revolution
13. Next-Generation Planning
14. Try the Smarter Alternative
15. See Why Families Are Switching

**Descriptions**:
1. Unlike other planners, our AI truly learns your preferences and improves over time. Try free!
2. More personalized than static templates. AI creates custom plans just for you. Start free today.
3. Experience meal planning powered by advanced AI. Adapts to your family's needs. No cost to try.
4. See why families are switching. Smarter AI, better personalization, free to start. Try it now!

**Note**: Replace [Competitor Name] with actual competitor (eMeals, Mealime, etc.) in separate ad variations. Monitor trademark policies.

---

### Display Ads - Responsive Display Ad Format

**Headlines** (5 short headlines, 30 characters):
1. AI Meal Planning Made Easy
2. Your Personal Meal Planner
3. Save Time on Meal Planning
4. Custom Weekly Meal Plans
5. Never Wonder What's for Dinner

**Long Headline** (1 long headline, 90 characters):
Get AI-powered meal plans personalized to your family's tastes and dietary needs.

**Descriptions** (5 descriptions, 90 characters):
1. Our AI creates custom weekly meal plans with grocery lists in minutes. Start free today!
2. Personalized meal planning for busy families. Adapts to your preferences. Try it free now.
3. Stop the "what's for dinner" stress. Get AI-generated meal plans tailored just for you.
4. Join thousands using AI to plan meals, save time, and eat healthier. Free to start!
5. Meal planning that learns your tastes. Custom plans + grocery lists. No credit card needed.

**Business Name**: Meal Planner Agent

**Images**:
- Square image (1:1): App interface showing meal plan
- Landscape image (1.91:1): Family dinner scene + app screenshot
- Logo: Meal Planner Agent branding

**Call-to-Action**: "Sign Up" or "Learn More"

---

### Display Ads - Static Image Ads (Alternative)

**Ad Version 1: Problem-Solution**

**Visual**:
- Background: Split screen
  - Left side: Stressed person looking at empty fridge (problem)
  - Right side: Happy family eating together + app screenshot (solution)
- Text overlay: "From Meal Stress to Meal Success"
- Subtext: "AI creates your perfect weekly plan"
- CTA button: "Start Free →"

**Sizes**: 300x250, 728x90, 160x600, 300x600

---

**Ad Version 2: Feature Highlight**

**Visual**:
- Background: Clean, modern design with app screenshot
- Icons highlighting key features:
  - 🤖 AI-Powered
  - 🥗 Personalized
  - 📝 Grocery Lists
  - ⚡ Minutes to Create
- Headline: "Meal Planning, Perfected"
- Subtext: "AI-powered plans for your family"
- CTA button: "Try Free Today"

---

**Ad Version 3: Social Proof**

**Visual**:
- Background: App interface screenshot
- Quote testimonial: "This changed our weeknight dinners!" - Beth, Mom of 2
- Star rating: ⭐⭐⭐⭐⭐
- Subtext: "Join thousands of happy families"
- CTA button: "Get Started Free"

---

### YouTube Video Ad Scripts

#### Script 1: 15-Second In-Stream Skippable

**On-Screen Text**:
- [0-3s] "What's for dinner?" (repeated frustrated)
- [3-8s] App interface animation showing meal plan generation
- [8-12s] "AI creates your perfect weekly plan"
- [12-15s] "Start free at mealplanner.briangriffey.com"

**Voiceover**:
"Tired of meal planning stress? Meal Planner Agent uses AI to create personalized weekly plans in minutes. Start free today."

**Visuals**:
- Opening: Person stressed looking at refrigerator
- Middle: Screen recording of app generating meal plan (sped up)
- End: Happy family eating dinner + URL on screen

---

#### Script 2: 30-Second In-Stream Skippable

**On-Screen Text**:
- [0-5s] "Meal planning doesn't have to be hard"
- [5-15s] App walkthrough with annotations
- [15-22s] "✓ AI Personalization ✓ Grocery Lists ✓ Dietary Preferences"
- [22-27s] "Free to start. No credit card required."
- [27-30s] "mealplanner.briangriffey.com"

**Voiceover**:
"Introducing Meal Planner Agent - the AI-powered solution to meal planning. Just tell us your preferences, family size, and dietary needs, and our AI creates a personalized weekly plan in minutes. Complete with grocery lists organized by store aisle. Whether you're keto, vegan, or feeding picky eaters, we've got you covered. Start free today at mealplanner.briangriffey.com. No credit card required."

**Visuals**:
- [0-5s] Time-lapse of busy week (work, kids, activities)
- [5-15s] App demo: preferences → generation → meal plan output
- [15-22s] Feature highlights with icons
- [22-30s] Call-to-action screen with URL and "Sign Up Free" button

---

### Ad Copy by Persona

Tailor messaging to specific persona pain points:

#### Busy Parent Beth

**Search Ad Headlines**:
- Stop the "What's for Dinner?" Panic
- Meal Planning for Busy Families
- Reclaim 5 Hours Every Week
- Kid-Friendly Meal Plans
- Family Dinners Made Simple

**Description**:
Save hours on meal planning with AI. Get family-friendly weekly plans with grocery lists. Even picky eaters approved. Start free!

---

#### Fitness-Focused Frank

**Search Ad Headlines**:
- Hit Your Macro Goals with AI
- Personalized Nutrition Planning
- Meal Plans for Your Fitness Goals
- Track Calories & Macros Easily
- Fuel Your Workouts Right

**Description**:
AI-powered meal plans tailored to your fitness goals. Track macros, calories, and nutrients. Perfect for athletes and fitness enthusiasts. Try free!

---

#### Meal Prep Maven Maria

**Search Ad Headlines**:
- Master Weekly Meal Prep
- Efficient Meal Planning System
- Batch Cooking Made Easy
- Organized Meal Prep Plans
- Prep Once, Eat All Week

**Description**:
Get organized with AI meal prep plans. Batch cooking guides and efficient grocery lists. Save time and money. Start free today!

---

#### Budget-Conscious Brian

**Search Ad Headlines**:
- Save Money on Groceries
- Reduce Food Waste with AI
- Budget-Friendly Meal Plans
- Plan Meals, Cut Costs
- Smart Shopping Lists

**Description**:
Cut grocery costs with AI meal planning. Organized lists prevent impulse buys and reduce waste. Meal plan on any budget. Free to start!

---

#### Health-Seeker Hannah

**Search Ad Headlines**:
- Improve Health with Meal Planning
- Nutritious Personalized Meal Plans
- Eat Healthier, Feel Better
- AI-Powered Nutrition Planning
- Balanced Meals Made Easy

**Description**:
AI creates nutritious meal plans tailored to your health goals. Support weight loss, heart health, or dietary needs. Try free now!

---

## Landing Page Recommendations

### Landing Page Strategy

**Principle**: Match ad message to landing page content (message match) to improve Quality Score and conversion rate.

**Primary Landing Page**: Homepage (https://mealplanner.briangriffey.com)
- Use for broad keywords: "meal planning app", "ai meal planner"
- Highlights all key features and value propositions
- Clear call-to-action: "Start Free" button above the fold

**Secondary Landing Pages** (create for higher performance):

---

### Landing Page 1: Features Page

**URL**: /features
**Use For**: Feature-specific keywords and ad groups
**Target Ad Groups**:
- AI Meal Planning
- Meal Planning Apps
- Automatic Planning

**Required Elements**:
1. **Hero Section**:
   - Headline: "AI-Powered Meal Planning That Adapts to You"
   - Subheadline: "Personalized weekly meal plans in minutes. No guesswork, no stress."
   - CTA button: "Get Started Free" (prominent, above fold)
   - Visual: App screenshot or demo animation

2. **Feature Showcase** (3-column layout):
   - 🤖 **AI Personalization**: "Learns your preferences and improves over time"
   - 📝 **Automatic Grocery Lists**: "Organized by aisle for efficient shopping"
   - 🥗 **Dietary Flexibility**: "Supports keto, vegan, paleo, and more"

3. **How It Works** (3-step process):
   - Step 1: Tell us your preferences (family size, diet, dislikes)
   - Step 2: AI creates your personalized meal plan
   - Step 3: Get grocery list and start cooking
   - Include screenshot for each step

4. **Social Proof**:
   - Testimonials from 3-4 users (with photos if possible)
   - Star rating or user count: "Join 1,000+ happy families"

5. **FAQ Section** (address common objections):
   - "How is this different from other meal planners?"
   - "Does it work for picky eaters?"
   - "How long does it take to create a plan?"
   - "Is it really free to start?"

6. **Final CTA**:
   - Repeated "Start Free" button
   - Text: "No credit card required. Cancel anytime."

**Performance Optimizations**:
- Load time under 2 seconds (critical for Quality Score)
- Mobile-responsive design (60%+ traffic from mobile)
- Clear value proposition above the fold
- Single, focused goal: drive sign-ups

---

### Landing Page 2: Persona-Specific Pages

Create targeted landing pages for each primary persona:

**URL Structure**:
- /for-busy-families (Busy Parent Beth)
- /for-fitness (Fitness-Focused Frank)
- /for-meal-prep (Meal Prep Maven Maria)

**Template Structure** (customize for each persona):

1. **Hero Section** (persona-specific):
   - **Busy Families**: "Stop the Weeknight Dinner Panic"
   - **Fitness**: "Meal Plans That Match Your Macros"
   - **Meal Prep**: "Master Weekly Meal Prep with AI"

2. **Pain Points** (address top 3 persona pain points):
   - Use bullet points with checkmarks
   - Example (Busy Families):
     - ✓ No more "what's for dinner?" stress
     - ✓ Kid-friendly meals they'll actually eat
     - ✓ Reclaim 5+ hours every week

3. **Solution** (how we solve it):
   - Short paragraph explaining AI personalization
   - Screenshot showing relevant feature (e.g., macro tracking for Fitness persona)

4. **Testimonial** (from matching persona):
   - Quote from user with similar demographics
   - Include photo and first name + description: "Beth, Mom of 2"

5. **Feature Highlights** (persona-relevant features):
   - **Busy Families**: Quick recipes (under 30 min), grocery delivery integration
   - **Fitness**: Macro tracking, meal timing optimization
   - **Meal Prep**: Batch cooking guides, prep time estimates

6. **CTA**: "Start Your Free Meal Plan"

**Targeting**:
- Use URL parameter tracking: ?utm_content=busy-families
- Link from persona-specific ad copy
- A/B test different headlines and images

---

### Landing Page 3: Competitor Comparison

**URL**: /vs-[competitor-name] (e.g., /vs-emeals)
**Use For**: Competitor alternative keywords
**Target Ad Groups**: Competitor Comparison

**Required Elements**:

1. **Hero Section**:
   - Headline: "Looking for an Alternative to [Competitor]?"
   - Subheadline: "See why families are switching to AI-powered meal planning"
   - CTA: "Try Meal Planner Agent Free"

2. **Comparison Table**:
   | Feature | Meal Planner Agent | [Competitor] |
   |---------|-------------------|--------------|
   | AI Personalization | ✓ Learns over time | ✗ Static templates |
   | Price | Free to start | $X/month |
   | Dietary Options | All diets supported | Limited options |
   | Grocery Integration | HEB + more | Limited |

3. **Key Differentiators**:
   - "Unlike [Competitor], our AI truly learns your preferences"
   - "No upfront cost - try it free with no credit card"
   - "More flexible and personalized than template-based planners"

4. **Migration Offer** (if applicable):
   - "Special offer for [Competitor] users"
   - "Get your first month premium free" (if premium tier exists)

5. **FAQ**:
   - "How do I switch from [Competitor]?"
   - "Can I import my recipes?"
   - "What if I don't like it?"

6. **CTA**: "Start Free Today"

**Legal Considerations**:
- Use competitor names for comparison purposes (generally allowed)
- Ensure all claims are factually accurate
- Don't use competitor logos or trademarked images
- Monitor for trademark complaints in Google Ads

---

### Landing Page 4: Free Trial / Offer Page

**URL**: /free-trial
**Use For**: Retargeting campaigns, high-intent keywords
**Target Ad Groups**: Long-tail, retargeting audiences

**Required Elements**:

1. **Hero Section**:
   - Headline: "Start Your Free Meal Planning Trial"
   - Subheadline: "Create your first personalized meal plan in under 5 minutes"
   - CTA: "Get Started Now" (extra prominent)

2. **What You Get** (clear value):
   - ✓ Personalized weekly meal plan
   - ✓ Grocery list organized by aisle
   - ✓ Nutritional information for every meal
   - ✓ Unlimited plan regeneration
   - ✓ Dietary preference customization

3. **No-Risk Messaging**:
   - Large text: "No Credit Card Required"
   - "Cancel anytime (but you won't want to)"
   - "Join risk-free today"

4. **Step-by-Step Preview**:
   - Visual walkthrough of the sign-up process
   - Shows it's quick and easy (1-2 minutes)
   - Screenshots of each step

5. **Urgency Element** (optional, test carefully):
   - "Limited-time: Get premium features free for 30 days"
   - Countdown timer (if running promotion)
   - Use sparingly to avoid appearing spammy

6. **Trust Signals**:
   - "Trusted by 1,000+ families"
   - Security badges (SSL, privacy policy link)
   - Money-back guarantee (if applicable)

7. **Single-Purpose CTA**:
   - Remove navigation distractions
   - One clear action: Sign up
   - Button should stand out visually

---

### Landing Page Optimization Best Practices

**Technical Requirements**:
1. **Page Speed**:
   - Target: Under 2 seconds load time
   - Optimize images (WebP format, lazy loading)
   - Minify CSS/JS
   - Use CDN for static assets

2. **Mobile Optimization**:
   - Responsive design (mobile-first approach)
   - Large tap targets (minimum 48x48px)
   - Readable font sizes (minimum 16px)
   - Test on multiple devices

3. **SEO Basics**:
   - Unique title tag matching ad headline
   - Meta description matching ad copy
   - H1 tag with primary keyword
   - Canonical URL set correctly

**Conversion Rate Optimization (CRO)**:

1. **Above-the-Fold Requirements**:
   - Clear headline (matches ad promise)
   - Value proposition visible
   - Primary CTA button
   - Supporting visual (screenshot/demo)
   - No distractions (minimize nav, remove popups)

2. **Trust Building**:
   - Real user testimonials (photos + names)
   - Trust badges (if applicable)
   - Clear privacy policy link
   - "No credit card required" messaging

3. **Form Optimization** (if using lead form):
   - Minimum fields (email only for lowest friction)
   - Inline validation (show errors immediately)
   - Clear button text: "Get Started Free" (not "Submit")
   - Privacy notice below form

4. **Visual Hierarchy**:
   - Use size and color to guide attention
   - Primary CTA should be most prominent element
   - Whitespace around important elements
   - F-pattern or Z-pattern layout

**A/B Testing Priorities**:

Test these elements in order of impact:

1. **Headline** (highest impact):
   - Test benefit-focused vs. feature-focused
   - Test different pain points
   - Example: "Stop Meal Planning Stress" vs. "AI Creates Your Perfect Meal Plan"

2. **CTA Button**:
   - Test button copy: "Start Free" vs. "Get My Meal Plan" vs. "Try It Free"
   - Test button color (high contrast)
   - Test button size and placement

3. **Hero Image**:
   - App screenshot vs. lifestyle image
   - People vs. product-only
   - Single image vs. carousel

4. **Social Proof**:
   - Testimonials vs. user count
   - Star rating vs. quote
   - Video testimonial vs. text

5. **Form Length**:
   - Email only vs. email + name
   - Single-step vs. multi-step

**Analytics Setup**:
- Track bounce rate (target: under 40%)
- Track time on page (target: 60+ seconds)
- Set up conversion goals in GA4
- Use heatmaps (Hotjar, Microsoft Clarity) to see user behavior
- Track scroll depth (ensure CTA is seen)

**UTM Parameter Structure**:
```
?utm_source=google
&utm_medium=cpc
&utm_campaign=search-ai-meal-planning
&utm_content=ad-variation-1
&utm_term=ai-meal-planner
```

Use these to track which ads/keywords drive best conversions.

---

## Conversion Tracking Setup

### Google Analytics 4 (GA4) Event Tracking

**Critical Events to Track**:

| Event Name | Trigger | Category | Value | Primary Conversion |
|------------|---------|----------|-------|-------------------|
| `sign_up` | User completes registration | Conversion | Free | Yes |
| `verify_email` | User verifies email address | Engagement | Free | No |
| `generate_meal_plan` | First meal plan generated | Conversion | Calculated | Yes |
| `view_meal_plan` | User views meal plan | Engagement | Free | No |
| `enable_automation` | User enables weekly automation | Conversion | High | Yes |
| `share_meal_plan` | User shares plan (if feature exists) | Engagement | Free | No |

**Event Parameters**:

For each event, include these parameters:
- `user_id`: Unique user identifier
- `timestamp`: Event timestamp
- `source`: Traffic source (organic, cpc, social, etc.)
- `campaign`: Campaign name (from UTM parameters)
- `ad_group`: Ad group name (from UTM parameters)

**Implementation** (already in place via `apps/web/lib/analytics/google-analytics.tsx`):

```typescript
// Example: Track sign_up event
gtag('event', 'sign_up', {
  method: 'email',
  user_id: userId,
  campaign: getCampaignParam(),
});

// Example: Track generate_meal_plan event
gtag('event', 'generate_meal_plan', {
  value: 1, // Can be used for value-based bidding
  currency: 'USD',
  user_id: userId,
});
```

---

### Google Ads Conversion Tracking

**Setup Methods**:

**Option 1: Import GA4 Conversions (Recommended)**

Advantages:
- Single implementation (use existing GA4 events)
- Unified analytics across platforms
- Easier to maintain

Steps:
1. In Google Ads, go to: Tools → Conversions → Import
2. Select "Google Analytics 4 properties"
3. Choose GA4 property
4. Import events: `sign_up`, `generate_meal_plan`, `enable_automation`
5. Configure conversion settings:
   - **Count**: One (count first conversion only)
   - **Conversion window**: 30 days (click), 1 day (view)
   - **Attribution model**: Data-driven (or Last Click initially)

6. Set conversion values:
   - `sign_up`: Value = $0 (free action, but important)
   - `generate_meal_plan`: Value = $10 (estimated engagement value)
   - `enable_automation`: Value = $50 (highest intent action)

---

**Option 2: Direct Google Ads Conversion Tag**

Use if you need more control or faster attribution (GA4 import has slight delay).

Implementation:
1. Create conversion action in Google Ads
2. Get conversion ID and label
3. Add to environment variables:
   ```bash
   NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID="AW-123456789"
   NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_SIGNUP="AbCdEfGhIjKl"
   ```

4. Implement on conversion pages:
   ```javascript
   gtag('event', 'conversion', {
     'send_to': 'AW-123456789/AbCdEfGhIjKl',
     'value': 1.0,
     'currency': 'USD'
   });
   ```

---

### Enhanced Conversions

**What It Is**: Sends hashed first-party data (email, phone) to Google for better conversion matching.

**Benefits**:
- Improves conversion accuracy by 5-15%
- Better attribution in cookie-less environment
- Enables better automated bidding

**Implementation**:
1. Enable in Google Ads: Tools → Conversions → Settings → Enhanced conversions
2. Choose implementation method: "Google tag" (recommended)
3. Update conversion tracking to include user data:

```javascript
gtag('set', 'user_data', {
  'email': hashedEmail, // SHA-256 hashed
  'phone_number': hashedPhone, // SHA-256 hashed
  'address': {
    'first_name': hashedFirstName,
    'last_name': hashedLastName,
    'country': 'US'
  }
});

gtag('event', 'conversion', {
  'send_to': 'AW-123456789/AbCdEfGhIjKl'
});
```

**Privacy Compliance**:
- Hash all personal data before sending
- Update privacy policy to mention Google Ads enhanced conversions
- Ensure user consent (if in EU/UK, use consent mode)

---

### Value-Based Bidding Setup

**Goal**: Optimize for high-value conversions (users who engage more).

**Implementation Steps**:

1. **Assign Conversion Values**:
   - Sign-up: $0 (initial conversion)
   - Generate first meal plan: $10 (engagement signal)
   - Enable automation: $50 (high intent, recurring usage)

2. **Enable Value-Based Bidding** (Month 3+, after 50+ conversions):
   - Change bidding strategy to: "Maximize conversion value"
   - Set target ROAS (Return on Ad Spend): 300% initially
   - Allow 2-3 weeks for learning period

3. **Track Revenue** (if monetizing):
   - Pass actual revenue as conversion value
   - Update GA4 events to include `value` parameter
   - Example: Premium subscription purchase = $99 value

---

### Offline Conversion Tracking

**Use Case**: Track conversions that happen outside the website (e.g., phone sign-ups, email conversions).

**Setup**:
1. Enable auto-tagging in Google Ads (captures GCLID)
2. Store GCLID in database with user record
3. Upload offline conversions via Google Ads API or UI:
   - Go to: Tools → Conversions → Uploads
   - Upload CSV with: GCLID, conversion time, conversion name, value

**Example CSV Format**:
```csv
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency
abc123xyz,generate_meal_plan,2026-01-28 14:30:00,10,USD
```

---

### Attribution Modeling

**Available Models**:
1. **Last Click**: Gives 100% credit to last click (Google Ads default)
2. **First Click**: Gives 100% credit to first click
3. **Linear**: Equal credit to all touchpoints
4. **Time Decay**: More credit to recent touchpoints
5. **Position-Based**: 40% first, 40% last, 20% middle
6. **Data-Driven**: Google's algorithm determines credit (recommended, requires 3,000+ conversions)

**Recommendation**:
- **Month 1-3**: Use Last Click (simple, good for learning)
- **Month 4+**: Switch to Data-Driven attribution (if have 3,000+ conversions)
- **Alternative**: Use Position-Based (40/20/40) for multi-touch journeys

**Setup**:
1. Go to: Tools → Conversions → Attribution
2. Select conversion action
3. Choose attribution model
4. Click Save

---

### Conversion Tracking Checklist

Before launching campaigns:

- [ ] GA4 installed and tracking page views correctly
- [ ] Custom events configured: sign_up, generate_meal_plan, enable_automation
- [ ] GA4 linked to Google Ads account
- [ ] Conversions imported from GA4 to Google Ads
- [ ] Conversion values assigned appropriately
- [ ] Auto-tagging enabled in Google Ads settings
- [ ] UTM parameters added to all campaign URLs
- [ ] Test conversions to verify tracking (use Google Tag Assistant)
- [ ] Exclude internal traffic (office IP addresses) in GA4
- [ ] Set up conversion goals in GA4 (target: 50+ conversions/month)

---

## Optimization Strategy

### Ongoing Optimization Framework

**Weekly Tasks** (Every Monday):

1. **Performance Review**:
   - Check overall CPA (target: under $50)
   - Review conversion rate (target: 3-5%)
   - Check Quality Scores (target: 7+)
   - Identify top performing ads and keywords

2. **Search Term Review**:
   - Download search term report (last 7 days)
   - Add irrelevant terms to negative keyword list
   - Identify new keyword opportunities
   - Add high-performing search terms as exact match keywords

3. **Budget Reallocation**:
   - Increase budget by 10-20% on campaigns with CPA < target
   - Decrease budget by 10-20% on campaigns with CPA > target
   - Pause ad groups with zero conversions after 50+ clicks

4. **Ad Copy Testing**:
   - Check ad performance (minimum 100 impressions to evaluate)
   - Pause underperforming ads (CTR < 2%)
   - Launch new ad variations to replace paused ads

---

**Monthly Tasks** (First week of month):

1. **Comprehensive Analysis**:
   - Full account audit (all campaigns, ad groups, keywords)
   - Identify trends (day of week, time of day, device performance)
   - Review landing page performance (bounce rate, conversion rate)
   - Competitor analysis (Auction Insights report)

2. **Keyword Optimization**:
   - Pause keywords with CPA > $60 (after 30+ clicks)
   - Add new keywords from search term report
   - Test new match types (e.g., add exact match for top phrase match keywords)
   - Review keyword Quality Scores, improve low scores (<5)

3. **Ad Extensions Review**:
   - Update sitelinks (test new pages)
   - Refresh callouts (seasonal messaging)
   - Update structured snippets
   - Test new extension types (price, promotion)

4. **Landing Page Tests**:
   - Review A/B test results
   - Implement winning variations site-wide
   - Launch new tests (headlines, CTAs, images)
   - Check mobile performance (50%+ of traffic)

5. **Audience Optimization**:
   - Review audience performance (in-market, affinity)
   - Create new custom audiences based on converters
   - Adjust bid modifiers for high/low performing audiences
   - Set up new remarketing lists

---

**Quarterly Tasks** (Every 3 months):

1. **Strategic Review**:
   - Compare performance to goals (CPA, ROAS, conversion volume)
   - Identify successful campaigns for scaling
   - Identify underperforming campaigns for major revamp or pause
   - Review competitor landscape (new entrants, pricing changes)

2. **Creative Refresh**:
   - Launch new ad creative (avoid ad fatigue)
   - Test new messaging angles
   - Update Display ad images
   - Produce new YouTube video ads (if applicable)

3. **Account Structure Review**:
   - Evaluate campaign structure (is it optimal?)
   - Consider consolidating campaigns (if too fragmented)
   - Consider splitting campaigns (if too broad)
   - Review negative keyword lists (consolidate, expand)

4. **Advanced Testing**:
   - Test new campaign types (Performance Max, Discovery)
   - Test new bidding strategies
   - Experiment with new ad formats
   - Geographic expansion (if performing well)

---

### Quality Score Improvement

**Why It Matters**: Higher Quality Scores = Lower CPCs and better ad positions.

**Quality Score Components**:
1. **Expected CTR** (40% weight): Predicted click-through rate
2. **Ad Relevance** (30% weight): How well ad matches keyword
3. **Landing Page Experience** (30% weight): Page quality and relevance

**Improvement Tactics**:

**To Improve Expected CTR**:
- Write compelling ad headlines (include keyword)
- Use strong calls-to-action
- Test multiple ad variations
- Add all relevant ad extensions
- Remove underperforming keywords (CTR < 2%)

**To Improve Ad Relevance**:
- Create tightly themed ad groups (5-10 keywords max)
- Include keyword in headline (dynamic keyword insertion)
- Match ad copy to keyword intent
- Use negative keywords aggressively
- Create separate ad groups for different match types

**To Improve Landing Page Experience**:
- Ensure landing page is relevant to ad and keyword
- Improve page load speed (under 2 seconds)
- Make site mobile-friendly
- Include keyword on landing page (in headline, H1)
- Provide clear call-to-action
- Improve content quality (add value, not just sales pitch)

**Target Quality Scores**:
- Excellent: 8-10 (keep optimizing)
- Good: 6-7 (monitor, make incremental improvements)
- Poor: 1-5 (urgent action required - revamp or pause)

---

### Bid Optimization Strategy

**Phase 1: Manual CPC (Month 1-2)**

Goal: Gather data and establish baseline performance.

Strategy:
- Set max CPC at $2.00 initially
- Adjust based on performance:
  - If avg. position > 4: Increase bid by 15-20%
  - If avg. position < 2: Decrease bid by 10-15% (may be overpaying)
  - If CPA < target: Increase bid by 10% (capture more volume)
  - If CPA > target: Decrease bid by 10% (improve efficiency)

Review frequency: Weekly

---

**Phase 2: Enhanced CPC (Month 2-3)**

Goal: Let Google adjust bids for conversions while maintaining control.

Strategy:
- Enable Enhanced CPC (ECPC) in bid strategy settings
- Keep manual max CPC bids
- Google adjusts up to 30% higher/lower based on conversion likelihood
- Monitor closely for first 2 weeks (can increase CPC)

Requirements:
- Minimum 15 conversions in last 30 days

---

**Phase 3: Maximize Conversions with Target CPA (Month 3+)**

Goal: Automate bidding to achieve target cost per acquisition.

Strategy:
- Switch to "Maximize Conversions" bidding
- Set target CPA at $35 (based on historical data from Phase 1-2)
- Allow 2-3 week learning period (performance may fluctuate)
- Review weekly, adjust target CPA monthly based on results

Requirements:
- Minimum 30 conversions in last 30 days (Google recommendation: 50+)
- Stable conversion rate

---

**Phase 4: Maximize Conversion Value with Target ROAS (Month 6+)**

Goal: Optimize for highest-value conversions.

Strategy:
- Switch to "Maximize Conversion Value" bidding
- Set target ROAS at 300% (3:1 return)
- Requires conversion value tracking (assign values to different actions)
- Best for scaling while maintaining profitability

Requirements:
- Minimum 50 conversions per month
- Conversion value tracking implemented
- Stable performance in Phase 3

---

### A/B Testing Framework

**Prioritized Test Ideas**:

**Priority 1: High-Impact Tests**

1. **Landing Page Headlines**:
   - Test: Benefit-focused vs. Feature-focused
   - Example A: "Stop the 'What's for Dinner?' Panic"
   - Example B: "AI-Powered Meal Planning in Minutes"
   - Success metric: Conversion rate
   - Required traffic: 1,000 visitors per variation
   - Duration: 2-4 weeks

2. **CTA Button Text**:
   - Test: "Start Free" vs. "Get My Meal Plan" vs. "Try It Free"
   - Success metric: Click-through rate on CTA
   - Required traffic: 500 visitors per variation
   - Duration: 1-2 weeks

3. **Ad Headlines**:
   - Test: Multiple RSA headline combinations
   - Google automatically tests combinations
   - Success metric: CTR and conversion rate
   - Review after 1,000 impressions per ad

---

**Priority 2: Medium-Impact Tests**

4. **Social Proof**:
   - Test: Testimonial quote vs. User count ("Join 1,000+ families")
   - Success metric: Conversion rate
   - Duration: 2-3 weeks

5. **Hero Image**:
   - Test: App screenshot vs. Lifestyle photo (family eating)
   - Success metric: Bounce rate and conversion rate
   - Duration: 2-3 weeks

6. **Ad Extensions**:
   - Test: Different sitelink combinations
   - Test: Callout variations
   - Success metric: CTR
   - Duration: 2 weeks

---

**Priority 3: Optimization Tests**

7. **Form Length**:
   - Test: Email only vs. Email + Name
   - Success metric: Form completion rate
   - Duration: 1-2 weeks

8. **Pricing Display**:
   - Test: "Free to start" vs. "No credit card required" vs. Both
   - Success metric: Conversion rate
   - Duration: 2 weeks

9. **Video on Landing Page**:
   - Test: Explainer video vs. Static images
   - Success metric: Time on page and conversion rate
   - Duration: 3-4 weeks

---

**Testing Best Practices**:

- Test ONE variable at a time (isolate impact)
- Ensure statistical significance (95% confidence minimum)
- Use adequate sample size (calculator: optimizely.com/sample-size-calculator/)
- Don't stop tests too early (minimum 1-2 weeks)
- Document all tests and results
- Implement winners site-wide
- Re-test periodically (audience preferences change)

---

### Performance Troubleshooting

**Problem: Low CTR (< 2%)**

Potential Causes & Solutions:
1. **Ads not compelling**:
   - Solution: Rewrite with stronger benefit statements
   - Test: Include numbers ("Save 5 hours per week")
   - Test: Add urgency or scarcity elements

2. **Poor ad position**:
   - Solution: Increase bids by 20-30%
   - Check: Quality Score (improve if < 6)

3. **Wrong audience**:
   - Solution: Review search term report, add negative keywords
   - Tighten: Use more specific match types (phrase/exact)

---

**Problem: High CPC (> $3.50)**

Potential Causes & Solutions:
1. **High competition keywords**:
   - Solution: Shift budget to long-tail keywords (lower competition)
   - Test: Different match types (exact match often cheaper)

2. **Low Quality Score**:
   - Solution: Improve ad relevance and landing page
   - Action: Follow Quality Score improvement tactics above

3. **Bidding too aggressively**:
   - Solution: Lower max CPC bids by 15-20%
   - Monitor: Ensure you still get sufficient impressions

---

**Problem: Low Conversion Rate (< 2%)**

Potential Causes & Solutions:
1. **Landing page issues**:
   - Check: Bounce rate (if > 60%, page is problem)
   - Solution: Improve message match between ad and page
   - Solution: Simplify page, make CTA more prominent
   - Test: Different landing page variations

2. **Wrong audience**:
   - Check: Search term report for irrelevant searches
   - Solution: Add negative keywords
   - Solution: Use more restrictive match types

3. **Poor value proposition**:
   - Solution: Strengthen headline and benefits
   - Test: Add social proof (testimonials, user count)
   - Test: Emphasize "free" and "no credit card required"

---

**Problem: High CPA (> $60)**

Potential Causes & Solutions:
1. **Combination of low CTR + low conversion rate**:
   - Solution: Address both issues above
   - Priority: Fix conversion rate first (bigger impact)

2. **Inefficient keywords**:
   - Solution: Pause keywords with CPA > $80
   - Focus: Reallocate budget to better performing keywords

3. **Wrong bidding strategy**:
   - Solution: Switch to manual CPC temporarily
   - Action: Lower bids to reduce CPA
   - Later: Re-enable automated bidding once performance stabilizes

---

## Implementation Timeline

### Pre-Launch (Week -2 to Week 0)

**Week -2: Setup & Configuration**

- [ ] **Day 1-2: Account Setup**
  - Create Google Ads account
  - Link to Google Analytics 4
  - Set up billing (credit card on file)
  - Configure account settings (time zone, currency)
  - Enable auto-tagging

- [ ] **Day 3-4: Conversion Tracking**
  - Verify GA4 installation and events
  - Import GA4 conversions into Google Ads
  - Test conversion tracking (use Tag Assistant)
  - Set up conversion values
  - Exclude internal traffic

- [ ] **Day 5-7: Campaign Structure**
  - Create campaign structure (8 campaigns per plan)
  - Build out ad groups
  - Upload keywords (with match types)
  - Add negative keywords (campaign level)

**Week -1: Creative & Testing**

- [ ] **Day 1-3: Ad Creation**
  - Write RSA ad copy (15 headlines, 4 descriptions per ad group)
  - Create Display responsive ads
  - Design static Display ads (if using)
  - Write YouTube video scripts

- [ ] **Day 4-5: Landing Pages**
  - Optimize homepage for conversions
  - Create /features landing page
  - Create persona-specific pages
  - Implement UTM tracking
  - Mobile optimization check

- [ ] **Day 6-7: Final Review & Testing**
  - Review all campaigns, ad groups, keywords
  - Double-check match types and bids
  - Test all ad copy (no typos, links work)
  - Test conversion tracking end-to-end
  - Set daily budgets

---

### Month 1: Launch & Learning

**Week 1: Campaign Launch**

- [ ] **Day 1: Launch**
  - Enable all Search campaigns (70% of budget)
  - Set campaigns to "Eligible" status
  - Monitor first impressions and clicks
  - Check for any policy violations

- [ ] **Day 2-3: Initial Monitoring**
  - Check hourly for first 48 hours
  - Verify conversions are tracking
  - Check search term reports
  - Add negative keywords (if needed)
  - Adjust bids if avg. position is way off target

- [ ] **Day 4-7: Optimization Start**
  - Review search terms daily
  - Add 10-20 negative keywords per day
  - Pause keywords with zero impressions (too low bids)
  - Increase bids on top performers by 10-15%

**Week 2-4: Data Gathering**

- [ ] **Weekly Tasks**:
  - Download search term report every Monday
  - Review ad performance (pause ads with CTR < 1.5%)
  - Check Quality Scores (improve low scores)
  - Review conversion rate by campaign
  - Adjust budgets based on CPA performance

- [ ] **End of Month 1 Goals**:
  - 15-25 conversions (minimum for optimization)
  - Quality Scores averaging 6+
  - CTR averaging 3%+
  - Establish baseline CPA
  - Identify top 5 performing keywords

---

### Month 2: Display & Optimization

**Week 1: Display Launch**

- [ ] **Day 1-2: Display Campaigns**
  - Launch Display awareness campaign (15% of budget)
  - Launch Display retargeting campaign (5% of budget)
  - Upload responsive display ads
  - Set frequency capping

- [ ] **Day 3-7: Monitoring**
  - Check Display CTR (target: 0.5%+)
  - Review placements (add negative placements if needed)
  - Check conversion rate from Display
  - Adjust budgets if needed

**Week 2-4: Search Optimization**

- [ ] **Search Campaign Improvements**:
  - Implement Enhanced CPC on top campaigns
  - Split test ad copy (3 variations per ad group)
  - Expand exact match keywords based on winners
  - Increase budgets on campaigns with CPA < $40
  - Decrease or pause campaigns with CPA > $60

- [ ] **Landing Page Testing**:
  - Launch A/B test on homepage headline
  - Test CTA button copy
  - Monitor bounce rate and time on page
  - Implement quick wins

- [ ] **End of Month 2 Goals**:
  - 30-40 total conversions
  - CPA trending toward $35-$45 range
  - Quality Scores averaging 7+
  - Display campaigns generating 3-5 conversions
  - Complete 1-2 A/B tests on landing pages

---

### Month 3: Automation & YouTube

**Week 1: Smart Bidding Transition**

- [ ] **Bidding Strategy Update**:
  - Transition top campaigns to "Maximize Conversions" with target CPA
  - Set target CPA at $35 (based on Month 1-2 average)
  - Allow 2-week learning period
  - Monitor daily for first week

**Week 2: YouTube Launch**

- [ ] **Video Campaign Setup**:
  - Produce 15-30 second video ads (2-3 variations)
  - Create YouTube campaigns (10% of budget)
  - Set up In-Stream and Discovery ad groups
  - Launch campaigns

- [ ] **Monitoring**:
  - Check video view rate (target: 15%+)
  - Review placements (channels, videos)
  - Add negative placements if needed
  - Check for conversions from YouTube

**Week 3-4: Comprehensive Optimization**

- [ ] **Full Account Audit**:
  - Review all campaigns, ad groups, keywords
  - Pause underperformers (CPA > $65)
  - Scale top performers (increase budget by 20-30%)
  - Consolidate small ad groups if needed
  - Refresh ad copy (avoid ad fatigue)

- [ ] **End of Month 3 Goals**:
  - 40-50 conversions
  - CPA at or below $40
  - Smart Bidding active on main campaigns
  - YouTube generating brand awareness (check Brand Lift if available)
  - Conversion rate improved to 4-5%

---

### Month 4-6: Scaling

**Ongoing Activities**:

- [ ] **Weekly Optimization** (every Monday):
  - Search term review
  - Negative keyword additions
  - Ad performance review
  - Budget reallocation
  - Landing page test reviews

- [ ] **Monthly Strategic Reviews**:
  - Comprehensive performance analysis
  - Keyword expansion (add 20-30 new keywords)
  - Creative refresh (new ad copy, images)
  - Landing page updates
  - Audience optimization

**Scaling Tactics**:

- [ ] **Budget Increases**:
  - Month 4: Increase to $1,000/month
  - Month 5: Increase to $1,100/month
  - Month 6: Increase to $1,200/month
  - Maintain target CPA while increasing volume

- [ ] **New Initiatives**:
  - Test Performance Max campaigns (if eligible)
  - Geographic expansion (if performing well nationally)
  - Test new ad formats (Gallery ads, etc.)
  - Launch competitor comparison landing pages

- [ ] **End of Month 6 Goals**:
  - 50-60 conversions per month
  - CPA stable at $30-$40
  - ROAS at 3:1 or better (if tracking revenue)
  - Quality Scores averaging 8+
  - Automated bidding performing well

---

### Month 7-12: Maturity & Experimentation

**Mature Account Management**:

- [ ] **Quarterly Activities**:
  - Strategic review and planning
  - Major creative refreshes
  - Competitive analysis updates
  - Budget reforecasting
  - Test new Google Ads features

**Advanced Optimization**:

- [ ] **Value-Based Bidding**:
  - Transition to "Maximize Conversion Value" (if revenue tracking)
  - Set target ROAS at 300%
  - Optimize for high-lifetime-value users

- [ ] **Audience Expansion**:
  - Create similar audiences (lookalikes of converters)
  - Test new in-market segments
  - Expand remarketing to 60-90 day windows
  - Layer audiences on Search campaigns

- [ ] **Creative Innovation**:
  - Produce professional video content
  - Test interactive Display ads
  - Experiment with new messaging angles
  - Seasonal campaigns (New Year, back-to-school, etc.)

**End of Year 1 Goals**:
- 400+ total conversions for the year
- Consistent CPA of $25-$35
- ROAS of 4:1 or better
- Established brand presence in market
- Optimized account structure for Year 2 scaling

---

## Appendix: Quick Reference

### Campaign Naming Conventions

Format: `[Type]-[Intent]-[Audience]`

Examples:
- `Search-HighIntent-AIMealPlanning`
- `Display-Retargeting-SiteVisitors`
- `Video-Awareness-CookingEnthusiasts`

### UTM Parameter Standards

```
?utm_source=google
&utm_medium=cpc
&utm_campaign={campaign_name}
&utm_content={ad_group_name}
&utm_term={keyword}
```

Use Google's Campaign URL Builder: ga-dev-tools.google/campaign-url-builder/

### Key Performance Benchmarks

| Metric | Target | Excellent | Poor |
|--------|--------|-----------|------|
| **CTR (Search)** | 3-5% | 6%+ | <2% |
| **CTR (Display)** | 0.5-1% | 1.5%+ | <0.3% |
| **Conversion Rate** | 3-5% | 6%+ | <2% |
| **Quality Score** | 7-8 | 9-10 | <6 |
| **CPA** | $30-$50 | <$30 | >$60 |
| **ROAS** | 3:1 | 5:1+ | <2:1 |

### Common Negative Keywords

Add at campaign level:
```
free, cheap, download, torrent, crack, pirate
job, career, salary, hiring, employment
printable, template, pdf, worksheet
meal kit, meal delivery, hello fresh, blue apron
```

### Emergency Pause Checklist

If campaigns are spending too fast or CPA is too high:

1. Pause all campaigns immediately
2. Review daily budgets (set daily budget caps)
3. Lower all max CPC bids by 30%
4. Add negative keywords aggressively
5. Re-enable only top-performing campaigns
6. Monitor hourly for 24 hours
7. Gradually increase bids/budgets once stable

---

## Document Version History

- **Version 1.0** (January 2026): Initial SEM strategy document
- Created by: auto-claude subtask implementation
- Next review date: March 2026 (or after Month 2 of campaign launch)

---

## Contact & Support

For questions about this SEM strategy or Google Ads implementation:
- Review the [SEO Strategy](./SEO_STRATEGY.md) for complementary organic tactics
- Review the [Competitive Research](./competitive-research-sem.md) for market context
- Review the [Target Audience Personas](./target-audience-personas.md) for messaging guidance

---

*End of SEM Strategy Document*
