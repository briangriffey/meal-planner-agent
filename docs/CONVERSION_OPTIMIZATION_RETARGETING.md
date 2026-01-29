# Conversion Optimization & Retargeting Strategy - Meal Planner Agent

This document outlines the comprehensive conversion optimization and retargeting strategy for the Meal Planner Agent web application at [mealplanner.briangriffey.com](https://mealplanner.briangriffey.com). The goal is to maximize conversions from paid traffic and re-engage users who didn't convert on their first visit.

## Table of Contents

- [Executive Summary](#executive-summary)
- [Landing Page Optimization Guidelines](#landing-page-optimization-guidelines)
- [Retargeting Audience Segments](#retargeting-audience-segments)
- [Conversion Funnel Analysis](#conversion-funnel-analysis)
- [A/B Testing Plan](#ab-testing-plan)
- [Pixel & Tracking Setup Requirements](#pixel--tracking-setup-requirements)
- [Implementation Checklist](#implementation-checklist)
- [Ongoing Optimization](#ongoing-optimization)

---

## Executive Summary

### Strategic Overview

Conversion optimization and retargeting are critical components of our SEM strategy, designed to improve ROI by:
1. **Increasing conversion rates** from paid traffic through optimized landing pages
2. **Re-engaging lost traffic** through strategic retargeting campaigns
3. **Reducing cost per acquisition (CPA)** through continuous testing and optimization

### Key Performance Indicators (KPIs)

| Metric | Baseline Target | Optimized Target | Measurement |
|--------|----------------|------------------|-------------|
| Landing Page Conversion Rate | 3-5% | 6-8% | GA4 + Goal tracking |
| Bounce Rate | <40% | <30% | GA4 page analytics |
| Time on Page | >60 seconds | >90 seconds | GA4 engagement |
| Form Completion Rate | 70% | 85% | Event tracking |
| Retargeting CTR | 0.5-0.8% | 1.0-1.5% | Google Ads |
| Retargeting Conversion Rate | 1-2% | 3-5% | GA4 conversions |
| Cost Per Retargeting Conversion | $10-$15 | $8-$12 | Google Ads ROI |

### Quick Wins (0-30 Days)

1. ✅ Install Google Ads conversion tracking pixel
2. ✅ Set up remarketing audiences in Google Ads
3. ✅ Create dedicated landing pages for each ad group
4. ✅ Implement A/B testing framework
5. ✅ Launch initial retargeting campaigns

---

## Landing Page Optimization Guidelines

### 1. Landing Page Structure

Each landing page should follow a proven conversion-focused structure:

#### Above the Fold (Most Critical)

**Hero Section Requirements:**
- **Headline**: Clear value proposition matching ad copy (e.g., "Create Your AI-Powered Meal Plan in Minutes")
- **Subheadline**: Supporting benefit statement (e.g., "Save 5+ hours weekly on meal planning. Healthy meals tailored to your dietary needs.")
- **Hero Image/Visual**: Appetizing meal photos or app screenshot showing meal plan
- **Primary CTA Button**: High-contrast, action-oriented (e.g., "Start Free Trial" or "Get My Meal Plan")
- **Trust Indicators**: Security badges, user count, or social proof above the fold

**Technical Requirements:**
- Maximum load time: <2 seconds
- Mobile-responsive design (50%+ traffic expected from mobile)
- CTA button visible without scrolling on all devices
- Hero image optimized (WebP format, <200KB)

#### Social Proof Section

**Elements:**
- User testimonials with photos (3-5 rotating testimonials)
- Trust badges: "AI-Powered," "Privacy-First," "No Credit Card Required"
- Statistics: "10,000+ Meal Plans Generated" (update dynamically)
- Star rating display if available

**Best Practices:**
- Use real user names and photos (with permission) or illustrated avatars
- Include specific results: "Saved 6 hours weekly" vs. generic "Great app"
- Highlight pain points solved: "No more decision fatigue"

#### Benefits Section

**Core Benefits to Highlight:**
1. **Time Savings**: "5+ hours saved weekly on meal planning and grocery shopping"
2. **Health Goals**: "Personalized nutrition based on your dietary needs"
3. **Variety**: "Never eat the same meal twice unless you want to"
4. **Smart Automation**: "AI learns your preferences and family tastes"
5. **Cost Efficiency**: "Reduce food waste by 30% with planned meals"

**Format:**
- Icon + Headline + 1-2 sentence description
- Grid layout: 3 columns on desktop, stacked on mobile
- Use consistent iconography (food, time, health themes)

#### How It Works Section

**Process Flow (3-4 Steps):**
1. **Set Preferences** → "Tell us your dietary needs, family size, and favorite cuisines"
2. **Generate Plan** → "AI creates a personalized weekly meal plan in seconds"
3. **Get Groceries** → "Download shopping list organized by store section"
4. **Enjoy Meals** → "Follow simple recipes and track your favorites"

**Visual Design:**
- Step-by-step numbered icons
- Brief explanation under each step
- Optional: Animated walkthrough or video

#### Features/Details Section

**Key Features to Showcase:**
- ✓ Dietary restriction support (vegetarian, vegan, gluten-free, keto, etc.)
- ✓ Family size customization (1-8+ people)
- ✓ Cuisine variety (Italian, Mexican, Asian, American, etc.)
- ✓ Automated grocery lists
- ✓ Recipe instructions included
- ✓ Meal history tracking (avoid repetition)
- ✓ Leftover management
- ✓ Email delivery automation

**Presentation:**
- Two-column layout with checkmarks
- Expandable accordions for detailed explanations
- Screenshots showing feature in action

#### Final CTA Section

**Elements:**
- Repeat primary CTA with urgency/scarcity if applicable
- Remove friction: "No credit card required" or "Free forever plan"
- Trust reinforcement: "Join 10,000+ happy users"
- Exit-intent popup option (use sparingly)

---

### 2. Landing Page Variants by Campaign

Create dedicated landing pages for each major ad group to improve relevance and Quality Score:

#### Variant A: "AI Meal Planner" Keywords
- **URL**: `/lp/ai-meal-planner`
- **Headline**: "AI-Powered Meal Planning Made Simple"
- **Focus**: Technology and automation benefits
- **Target Audience**: Tech-savvy users, early adopters
- **Unique Content**: Emphasize AI learning, personalization algorithms

#### Variant B: "Healthy Meal Planning" Keywords
- **URL**: `/lp/healthy-meal-planning`
- **Headline**: "Healthy Meal Plans Tailored to Your Goals"
- **Focus**: Nutrition, dietary restrictions, health outcomes
- **Target Audience**: Health-conscious users, dieters
- **Unique Content**: Nutrition facts, dietary options, health testimonials

#### Variant C: "Weekly Meal Planner" Keywords
- **URL**: `/lp/weekly-meal-planner`
- **Headline**: "Plan Your Week's Meals in Under 5 Minutes"
- **Focus**: Time savings, organization, convenience
- **Target Audience**: Busy families, working professionals
- **Unique Content**: Time-saving stats, batch planning features

#### Variant D: "Family Meal Planning" Keywords
- **URL**: `/lp/family-meal-planning`
- **Headline**: "Family-Friendly Meal Plans Everyone Will Love"
- **Focus**: Family size customization, kid-friendly meals, variety
- **Target Audience**: Parents, families with children
- **Unique Content**: Family testimonials, kid-approved recipes

#### Variant E: "Budget Meal Planning" Keywords
- **URL**: `/lp/budget-meal-planning`
- **Headline**: "Save Money with Smart Meal Planning"
- **Focus**: Cost savings, reducing food waste, budget-friendly
- **Target Audience**: Budget-conscious users, frugal shoppers
- **Unique Content**: Cost-saving stats, budget recipe examples

---

### 3. Conversion Rate Optimization (CRO) Checklist

#### ✅ Message Match
- [ ] Headline matches ad copy promise
- [ ] Keywords from ad appear in first paragraph
- [ ] Visual consistency with ad creative
- [ ] Same offer/CTA as advertised

#### ✅ Visual Hierarchy
- [ ] Clear F-pattern or Z-pattern layout
- [ ] Primary CTA stands out (color contrast >4.5:1 ratio)
- [ ] Whitespace guides eye to important elements
- [ ] No competing CTAs above the fold

#### ✅ Trust Signals
- [ ] HTTPS/SSL certificate (secure connection)
- [ ] Privacy policy link visible
- [ ] Security badges displayed
- [ ] Real testimonials with attribution
- [ ] Professional design (no stock photo clichés)

#### ✅ Form Optimization
- [ ] Minimum required fields (email + password only for signup)
- [ ] Progressive disclosure (don't ask for everything upfront)
- [ ] Inline validation with helpful error messages
- [ ] Clear field labels and placeholders
- [ ] Mobile-friendly input types (email keyboard, etc.)
- [ ] Autofill support enabled
- [ ] Submit button clearly labeled with action

#### ✅ Mobile Optimization
- [ ] Responsive design tested on iOS and Android
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scrolling required
- [ ] Fast mobile load time (<3 seconds)
- [ ] Click-to-call phone numbers (if applicable)
- [ ] Mobile-specific CTAs if needed

#### ✅ Page Speed
- [ ] Total page weight <1MB
- [ ] First Contentful Paint <1.8s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] Lazy loading for below-fold images
- [ ] Minified CSS/JS
- [ ] CDN for static assets

#### ✅ Accessibility
- [ ] Alt text on all images
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation functional
- [ ] Screen reader tested
- [ ] ARIA labels where appropriate

---

### 4. Copywriting Best Practices

#### Headline Formula
**Pattern**: [Desired Outcome] + [Time Frame] + [Unique Mechanism]

**Examples:**
- "Create Personalized Meal Plans in 5 Minutes with AI"
- "Eat Healthier Without the Meal Planning Stress"
- "Your Family's Weekly Meal Plan, Delivered Monday Mornings"

**Rules:**
- Keep under 60 characters for SEO title
- Include primary keyword
- Promise specific benefit
- Use active voice

#### Call-to-Action (CTA) Best Practices

**Button Text Options (A/B Test These):**
- ✅ **Action-oriented**: "Start My Free Trial" (not "Submit")
- ✅ **Value-focused**: "Get My Personalized Plan"
- ✅ **Low-friction**: "Try It Free" or "See How It Works"
- ✅ **Urgency**: "Start Planning Today"
- ❌ **Avoid**: Generic "Click Here," "Learn More," "Sign Up"

**CTA Design:**
- High-contrast color (test orange, green, or red vs. blue)
- Large enough to see (minimum 44px height on mobile)
- Surrounded by whitespace
- Repeat 2-3 times on long pages (top, middle, bottom)

#### Social Proof Copywriting

**Testimonial Template:**
> "[Specific result] - [User pain point solved] - [Emotional benefit]"
> — [Name], [Relevant Detail]

**Example:**
> "I used to spend 2 hours every Sunday planning meals and making grocery lists. Now it takes 5 minutes, and my family actually eats what I cook!"
> — Sarah M., Mom of 3

---

### 5. Technical Implementation

#### File Structure
```
apps/web/app/
├── lp/                              # Landing pages directory
│   ├── layout.tsx                   # Shared landing page layout (minimal nav)
│   ├── ai-meal-planner/
│   │   ├── page.tsx                 # AI-focused landing page
│   │   └── metadata.ts              # SEO metadata
│   ├── healthy-meal-planning/
│   │   ├── page.tsx                 # Health-focused landing page
│   │   └── metadata.ts
│   ├── weekly-meal-planner/
│   │   ├── page.tsx                 # Time-saving landing page
│   │   └── metadata.ts
│   ├── family-meal-planning/
│   │   ├── page.tsx                 # Family-focused landing page
│   │   └── metadata.ts
│   └── budget-meal-planning/
│       ├── page.tsx                 # Budget-focused landing page
│       └── metadata.ts
├── components/
│   └── landing/
│       ├── Hero.tsx                 # Hero section component
│       ├── SocialProof.tsx          # Testimonials component
│       ├── Benefits.tsx             # Benefits grid
│       ├── HowItWorks.tsx           # Process flow
│       ├── Features.tsx             # Feature list
│       ├── FAQ.tsx                  # FAQ accordion
│       └── FinalCTA.tsx             # Bottom CTA section
└── lib/
    └── analytics/
        └── landing-page-tracking.ts # Landing page event tracking
```

#### Component Example: Hero Section
```typescript
// apps/web/components/landing/Hero.tsx
interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  variant: 'ai' | 'health' | 'weekly' | 'family' | 'budget';
}

export function Hero({ headline, subheadline, ctaText, ctaHref, variant }: HeroProps) {
  return (
    <section className="hero-section" data-variant={variant}>
      <div className="container">
        <h1 className="headline">{headline}</h1>
        <p className="subheadline">{subheadline}</p>
        <button
          className="cta-primary"
          onClick={() => trackEvent('lp_cta_click', { variant, position: 'hero' })}
        >
          {ctaText}
        </button>
        <p className="trust-indicator">✓ No credit card required · ✓ Free forever plan</p>
      </div>
      <div className="hero-image">
        {/* Variant-specific imagery */}
      </div>
    </section>
  );
}
```

---

## Retargeting Audience Segments

### 1. Audience Segmentation Strategy

Retargeting allows us to re-engage users based on their specific behavior. We'll create **behavior-based segments** with tailored messaging for each.

#### Segment 1: Landing Page Visitors (No Signup)
**Definition**: Users who visited a landing page but didn't sign up

**Characteristics:**
- Viewed landing page for >10 seconds
- Did NOT complete registration
- Membership duration: 30 days

**Retargeting Strategy:**
- **Platforms**: Google Display Network, YouTube
- **Message**: Address common objections (e.g., "Still thinking about it? Start your free trial today!")
- **Creative**: Highlight key benefit they viewed (based on landing page variant)
- **Offer**: Emphasize "No credit card required" to reduce friction
- **Budget Allocation**: 30% of retargeting budget
- **Frequency Cap**: 3 impressions per day, 15 per week

**Expected Performance:**
- CTR: 0.8-1.2%
- Conversion Rate: 2-3%
- CPA: $10-$15

#### Segment 2: Signup Abandoners
**Definition**: Users who started registration but didn't complete it

**Characteristics:**
- Clicked "Sign Up" or "Get Started"
- Visited registration page
- Did NOT complete email verification
- Membership duration: 14 days

**Retargeting Strategy:**
- **Platforms**: Google Display Network, Search Remarketing Lists (RLSA)
- **Message**: "You're one step away from better meal planning!"
- **Creative**: Reminder of what they're missing, urgency
- **Offer**: Potential incentive (e.g., "Complete signup to get your first meal plan free")
- **Budget Allocation**: 25% of retargeting budget
- **Frequency Cap**: 4 impressions per day, 20 per week

**Expected Performance:**
- CTR: 1.2-1.8%
- Conversion Rate: 5-8%
- CPA: $8-$12

#### Segment 3: Registered Users (No Meal Plan Generated)
**Definition**: Users who completed registration but haven't generated their first meal plan

**Characteristics:**
- Email verified
- Account created
- Did NOT click "Generate Meal Plan"
- Membership duration: 21 days

**Retargeting Strategy:**
- **Platforms**: Google Display Network, Gmail Ads
- **Message**: "Your personalized meal plan is waiting! Generate it now in 5 minutes."
- **Creative**: Show app interface, highlight ease of use
- **Offer**: Tutorial/walkthrough emphasis
- **Budget Allocation**: 20% of retargeting budget
- **Frequency Cap**: 2 impressions per day, 10 per week
- **Email Component**: Combine with onboarding email sequence

**Expected Performance:**
- CTR: 1.5-2.5%
- Conversion Rate: 8-12%
- CPA: $6-$10

#### Segment 4: Trial Users (Generated 1 Meal Plan)
**Definition**: Users who generated one meal plan but haven't returned

**Characteristics:**
- Generated at least 1 meal plan
- Did NOT enable automation
- Last activity: 7-30 days ago
- Membership duration: 45 days

**Retargeting Strategy:**
- **Platforms**: Google Display Network, YouTube
- **Message**: "Ready for next week's meal plan? We saved your preferences!"
- **Creative**: Emphasize convenience, show new recipe examples
- **Offer**: Highlight automation feature ("Get meal plans delivered every Monday")
- **Budget Allocation**: 15% of retargeting budget
- **Frequency Cap**: 2 impressions per day, 8 per week

**Expected Performance:**
- CTR: 1.0-1.5%
- Conversion Rate: 4-6%
- CPA: $12-$18

#### Segment 5: Lapsed Active Users
**Definition**: Previously active users who haven't generated a meal plan in 30+ days

**Characteristics:**
- Generated 2+ meal plans historically
- Last meal plan generation: 30-90 days ago
- Membership duration: 90 days

**Retargeting Strategy:**
- **Platforms**: Google Display Network, Search RLSA
- **Message**: "We've missed you! Come back and rediscover easy meal planning."
- **Creative**: "What's new" angle, show new features or cuisines
- **Offer**: Re-engagement incentive or feature highlight
- **Budget Allocation**: 10% of retargeting budget
- **Frequency Cap**: 1 impression per day, 5 per week

**Expected Performance:**
- CTR: 0.8-1.2%
- Conversion Rate: 3-5%
- CPA: $15-$20

---

### 2. Remarketing Lists for Search Ads (RLSA)

RLSA allows us to customize Search campaigns for users who previously visited our site.

#### RLSA Strategy 1: Bid Adjustments
**Audience**: All website visitors (last 30 days)
- **Bid Modifier**: +20% to +50%
- **Rationale**: These users already know our brand, more likely to convert
- **Budget Impact**: Increases bids on branded and high-intent keywords

#### RLSA Strategy 2: Expanded Keyword Targeting
**Audience**: Trial users who generated a meal plan
- **Tactic**: Target broader keywords (e.g., "meal ideas," "dinner recipes") only for this audience
- **Bid Modifier**: +10% to +30%
- **Rationale**: Lower competition, can profitably target informational queries

#### RLSA Strategy 3: Competitor Conquesting
**Audience**: Landing page visitors (no signup)
- **Tactic**: Bid on competitor brand terms (e.g., "eMeals alternative," "PlateJoy vs")
- **Message**: Direct comparison highlighting our advantages
- **Budget**: Limited budget ($50-$100/month) to test

---

### 3. Dynamic Remarketing Setup

For Google Display Network and YouTube, use **dynamic ads** that automatically show relevant content based on user behavior.

#### Dynamic Feed Requirements

**Product Feed Fields:**
- `id`: Unique identifier (e.g., landing page variant)
- `title`: Ad headline (e.g., "AI Meal Planner")
- `description`: Ad description
- `image_url`: Hero image or screenshot
- `link`: Landing page URL with UTM parameters
- `price`: Free (or subscription tier if applicable)

**Example Feed Entry:**
```json
{
  "id": "lp-ai-meal-planner",
  "title": "AI-Powered Meal Planning",
  "description": "Create personalized weekly meal plans in 5 minutes. Free trial, no credit card required.",
  "image_url": "https://mealplanner.briangriffey.com/images/lp-hero-ai.jpg",
  "link": "https://mealplanner.briangriffey.com/lp/ai-meal-planner?utm_source=google&utm_medium=display&utm_campaign=retargeting_dynamic",
  "price": "Free"
}
```

---

### 4. Retargeting Campaign Structure

#### Campaign Hierarchy
```
Google Ads Account
└── Display Network
    ├── Campaign: Retargeting - Landing Page Visitors
    │   ├── Ad Group: AI Meal Planner Visitors
    │   ├── Ad Group: Healthy Meal Planning Visitors
    │   ├── Ad Group: Weekly Planner Visitors
    │   └── Ad Group: Family Meal Planning Visitors
    │
    ├── Campaign: Retargeting - Signup Abandoners
    │   └── Ad Group: Registration Started (All variants)
    │
    ├── Campaign: Retargeting - Registered No Plan
    │   └── Ad Group: Account Created (No Activity)
    │
    └── Campaign: Retargeting - Re-engagement
        ├── Ad Group: Trial Users (1 plan)
        └── Ad Group: Lapsed Users (2+ plans)

└── YouTube
    ├── Campaign: YouTube Retargeting - Video Views
    │   └── Ad Group: 6-second bumper ads
    └── Campaign: YouTube Retargeting - Skippable
        └── Ad Group: 15-30 second product demos
```

---

### 5. Retargeting Creative Guidelines

#### Display Ad Sizes (Responsive Display Ads)
- **Square**: 1200x1200 (recommended), 300x300
- **Landscape**: 1200x628 (recommended), 728x90
- **Portrait**: 960x1200

**Responsive Display Ad Assets:**
- **Headlines**: 5 variants (max 30 characters each)
- **Long Headlines**: 1 variant (max 90 characters)
- **Descriptions**: 5 variants (max 90 characters each)
- **Images**: Minimum 3 landscape, 3 square
- **Logo**: Square logo (1:1 ratio, minimum 128x128)

#### Example Retargeting Ad Copy

**Landing Page Visitors (No Signup):**
- Headline: "Still Planning Meals by Hand?"
- Description: "Try AI-powered meal planning. Free trial, no credit card. Join 10,000+ users saving 5+ hours weekly."

**Signup Abandoners:**
- Headline: "Finish Your Registration!"
- Description: "You're one step away from effortless meal planning. Complete signup to get your first personalized plan."

**Registered (No Plan):**
- Headline: "Your Meal Plan Awaits"
- Description: "Generate your first AI meal plan in 5 minutes. Healthy, personalized, and free to try."

**YouTube Video Ads:**
- **6-second bumper**: Quick benefit highlight ("Meal planning made simple with AI")
- **15-second skippable**: Problem → Solution → CTA format
- **30-second skippable**: Full product demo with testimonial

---

## Conversion Funnel Analysis

### 1. Full Funnel Mapping

The conversion funnel from ad click to active user has multiple stages. Each stage has drop-off risk and optimization opportunities.

#### Stage 1: Ad Impression → Click
**Current Baseline:**
- Impressions: 50,000/month (Growth budget)
- CTR: 3-5%
- Clicks: 1,500-2,500/month

**Optimization Focus:**
- Ad copy relevance and appeal
- Ad extensions (sitelinks, callouts)
- Negative keywords (reduce irrelevant impressions)
- Quality Score improvement

**Key Metrics:**
- Click-Through Rate (CTR)
- Impression share
- Quality Score

#### Stage 2: Click → Landing Page Visit
**Current Baseline:**
- Clicks: 1,500-2,500/month
- Actual landing page visits: ~95% (some bounce before load)
- Landing page visits: 1,425-2,375/month

**Drop-off Reasons:**
- Slow page load time (>3 seconds)
- Accidental clicks
- URL doesn't match ad promise

**Optimization Focus:**
- Page speed optimization (<2 second load)
- Message match (headline matches ad)
- Mobile optimization

**Key Metrics:**
- Bounce rate before interaction
- Page load time
- Mobile vs. desktop performance

#### Stage 3: Landing Page Visit → Sign Up Started
**Current Baseline:**
- Landing page visits: 1,425-2,375/month
- Signup started: 30-40% interaction rate
- Signup initiated: 428-950/month

**Drop-off Reasons:**
- Value proposition unclear
- Trust/credibility concerns
- CTA not compelling or visible
- Mobile usability issues

**Optimization Focus:**
- Headline clarity (message match with ad)
- Trust signals (testimonials, security badges)
- CTA visibility and copy
- Above-the-fold content
- Social proof

**Key Metrics:**
- CTA click rate
- Scroll depth
- Time on page
- Heat map analysis

#### Stage 4: Sign Up Started → Email Verified
**Current Baseline:**
- Signup initiated: 428-950/month
- Email verified: 70-80% completion rate
- Verified users: 300-760/month

**Drop-off Reasons:**
- Email verification friction
- Long/complex signup form
- Email delivery delays
- Email goes to spam folder

**Optimization Focus:**
- Minimize form fields (email + password only initially)
- Clear instructions for email verification
- Instant email sending
- Spam folder prevention (SPF, DKIM, DMARC)
- Resend verification option

**Key Metrics:**
- Form completion rate
- Email delivery rate
- Email open rate
- Verification click-through rate

#### Stage 5: Email Verified → First Meal Plan Generated
**Current Baseline:**
- Verified users: 300-760/month
- Generated meal plan: 50-60% activation rate
- Active users: 150-456/month

**Drop-off Reasons:**
- Onboarding confusion (don't know next step)
- Preference-setting friction
- Feature intimidation (too complex)
- Forgot to return

**Optimization Focus:**
- Clear onboarding flow
- Guided tutorial or walkthrough
- Simplified preference form
- Immediate value demonstration
- Onboarding email sequence
- In-app prompts

**Key Metrics:**
- Time to first meal plan
- Preference completion rate
- Onboarding abandonment points

#### Stage 6: First Meal Plan → Active User (2+ Plans)
**Current Baseline:**
- First meal plan: 150-456/month
- Repeat usage (2+ plans): 40-50% retention
- Active users: 60-228/month

**Drop-off Reasons:**
- Meal plan quality/relevance issues
- Forgot to return
- No automated reminders
- Better alternatives found

**Optimization Focus:**
- Meal plan quality improvement
- Email automation ("Your weekly meal plan is ready")
- Reminder system
- Habit formation triggers

**Key Metrics:**
- 7-day retention rate
- 30-day retention rate
- Meal plan generation frequency

---

### 2. Funnel Conversion Benchmarks

| Funnel Stage | Current Rate | Industry Benchmark | Optimized Target |
|--------------|-------------|-------------------|-----------------|
| Ad CTR | 3-5% | 2-4% (Google Ads avg) | 4-6% |
| Landing Page Engagement | 60-70% | 50-60% | 70-80% |
| Signup Initiation | 30-40% | 20-30% | 40-50% |
| Email Verification | 70-80% | 60-70% | 80-90% |
| First Meal Plan | 50-60% | 40-50% (SaaS activation) | 65-75% |
| Repeat Usage | 40-50% | 30-40% | 55-65% |

---

### 3. Drop-off Analysis Tools

#### Google Analytics 4 Funnel Exploration
**Setup:**
1. Navigate to: Explore → Funnel exploration
2. Define funnel steps:
   - Step 1: `page_view` (landing page)
   - Step 2: `sign_up_started` (custom event)
   - Step 3: `sign_up` (user registered)
   - Step 4: `verify_email` (email verified)
   - Step 5: `generate_meal_plan` (first plan)
   - Step 6: `generate_meal_plan` (count ≥ 2)
3. Breakdown dimensions:
   - Source/Medium (to compare ad performance)
   - Device category (mobile vs. desktop)
   - Landing page (variant comparison)

**Insights to Monitor:**
- Which funnel step has highest drop-off?
- Does mobile or desktop perform better?
- Which landing page variant converts best?
- Which traffic source has best conversion rate?

#### Hotjar or Microsoft Clarity (Heatmaps & Recordings)
**Use Cases:**
- **Heatmaps**: Where users click, how far they scroll
- **Session Recordings**: Watch user struggles in real-time
- **Form Analytics**: Which form fields cause abandonment?

**Setup:**
- Install tracking code on landing pages
- Focus on high-traffic, low-conversion pages first
- Watch 20-30 recordings monthly to identify usability issues

---

### 4. Segment-Specific Funnel Performance

Not all traffic sources convert equally. Track funnel performance by segment:

#### By Traffic Source
| Source | Landing→Signup | Signup→Verified | Verified→Plan | Overall Conv Rate |
|--------|---------------|----------------|---------------|------------------|
| Google Search | 40-50% | 75-85% | 60-70% | 18-30% |
| Google Display | 25-35% | 70-80% | 50-60% | 9-17% |
| Retargeting | 35-45% | 80-90% | 65-75% | 18-30% |
| YouTube | 20-30% | 65-75% | 55-65% | 7-15% |

#### By Device Type
| Device | Landing→Signup | Signup→Verified | Verified→Plan | Overall Conv Rate |
|--------|---------------|----------------|---------------|------------------|
| Desktop | 45-55% | 80-90% | 65-75% | 23-37% |
| Mobile | 30-40% | 70-80% | 55-65% | 12-21% |
| Tablet | 35-45% | 75-85% | 60-70% | 16-26% |

**Insight**: Mobile has lower conversion rates → prioritize mobile optimization.

#### By Landing Page Variant
| Variant | Traffic Volume | Landing→Signup | Overall Conv Rate | Notes |
|---------|---------------|---------------|------------------|-------|
| AI Meal Planner | High | 35-45% | 15-25% | Tech-savvy audience |
| Healthy Meal Planning | Medium | 40-50% | 18-28% | High intent |
| Weekly Meal Planner | High | 30-40% | 12-22% | Broad audience |
| Family Meal Planning | Medium | 38-48% | 16-26% | Family-focused |
| Budget Meal Planning | Low | 32-42% | 14-24% | Cost-conscious |

---

## A/B Testing Plan

### 1. Testing Framework

#### Testing Prioritization Matrix

Use the **PIE Framework** to prioritize tests:
- **P**otential: How much improvement is possible?
- **I**mportance: How valuable is this page/element?
- **E**ase: How easy is it to implement?

**Scoring**: Rate each factor 1-10, calculate average. Prioritize highest-scoring tests.

**Example Prioritization:**

| Test Idea | Potential | Importance | Ease | PIE Score | Priority |
|-----------|----------|-----------|------|-----------|----------|
| Hero headline variation | 8 | 10 | 9 | 9.0 | 🔥 High |
| CTA button color | 6 | 9 | 10 | 8.3 | 🔥 High |
| Add video to hero | 7 | 8 | 4 | 6.3 | ⚡ Medium |
| Testimonial section redesign | 5 | 6 | 7 | 6.0 | ⚡ Medium |
| FAQ accordion expansion | 4 | 5 | 8 | 5.7 | ⭐ Low |

---

### 2. Phase 1: High-Impact Tests (Months 1-2)

#### Test 1A: Hero Headline Variations
**Hypothesis**: A benefit-focused headline will outperform a feature-focused headline.

**Control (A)**: "AI-Powered Meal Planning Made Simple"
**Variant B**: "Save 5+ Hours Weekly on Meal Planning"
**Variant C**: "Your Personalized Weekly Meal Plan in 5 Minutes"

**Primary Metric**: Signup initiation rate
**Secondary Metrics**: Bounce rate, time on page
**Sample Size**: 1,000 visitors per variant (minimum)
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 10-25% improvement

---

#### Test 1B: CTA Button Copy
**Hypothesis**: Action-oriented CTA copy will outperform generic text.

**Control (A)**: "Get Started"
**Variant B**: "Create My Meal Plan"
**Variant C**: "Start Free Trial"

**Primary Metric**: CTA click-through rate
**Secondary Metrics**: Signup completion rate
**Sample Size**: 1,000 visitors per variant
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 8-20% improvement

---

#### Test 1C: CTA Button Color
**Hypothesis**: A high-contrast color (orange or green) will outperform the current blue.

**Control (A)**: Blue button (#0070F3)
**Variant B**: Orange button (#FF6B35)
**Variant C**: Green button (#4CAF50)

**Primary Metric**: CTA click-through rate
**Sample Size**: 800 visitors per variant
**Estimated Duration**: 1-2 weeks
**Expected Lift**: 5-15% improvement

---

#### Test 1D: Social Proof Placement
**Hypothesis**: Placing testimonials above the fold will increase trust and signup rate.

**Control (A)**: Testimonials in middle section (below How It Works)
**Variant B**: One testimonial in hero section (above the fold)
**Variant C**: Rotating testimonial carousel in hero section

**Primary Metric**: Signup initiation rate
**Secondary Metrics**: Scroll depth, time on page
**Sample Size**: 1,000 visitors per variant
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 12-28% improvement

---

### 3. Phase 2: Moderate-Impact Tests (Months 2-4)

#### Test 2A: Form Field Reduction
**Hypothesis**: Reducing signup fields will increase completion rate.

**Control (A)**: Email, Password, Confirm Password, Name
**Variant B**: Email, Password only (name optional later)

**Primary Metric**: Signup completion rate
**Secondary Metrics**: Form abandonment rate
**Sample Size**: 600 signups initiated per variant
**Estimated Duration**: 2-4 weeks
**Expected Lift**: 15-30% improvement

---

#### Test 2B: Trust Badge Variations
**Hypothesis**: Specific trust badges will increase credibility and conversions.

**Control (A)**: "No Credit Card Required" text only
**Variant B**: Security badges (SSL, Privacy icons) + text
**Variant C**: User count badge ("Join 10,000+ Users") + security icons

**Primary Metric**: Signup initiation rate
**Sample Size**: 1,000 visitors per variant
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 5-12% improvement

---

#### Test 2C: Hero Image vs. Video
**Hypothesis**: A short demo video will increase engagement and conversions vs. static image.

**Control (A)**: Hero image (meal photos)
**Variant B**: 30-second auto-play video (muted, with captions)
**Variant C**: Video thumbnail with play button (user-initiated)

**Primary Metric**: Signup initiation rate
**Secondary Metrics**: Video play rate, time on page
**Sample Size**: 1,200 visitors per variant
**Estimated Duration**: 3-4 weeks
**Expected Lift**: 8-18% improvement

**Implementation Note**: Ensure video is optimized (<2MB) to avoid page speed impact.

---

#### Test 2D: Urgency/Scarcity Elements
**Hypothesis**: Adding urgency will increase signup rate without harming brand trust.

**Control (A)**: No urgency elements
**Variant B**: "Limited spots available this month" banner
**Variant C**: "Join [live counter] users meal planning this week"

**Primary Metric**: Signup initiation rate
**Secondary Metrics**: Trust perception (survey), bounce rate
**Sample Size**: 1,000 visitors per variant
**Estimated Duration**: 2 weeks
**Expected Lift**: 5-15% improvement

**Risk Note**: Monitor for negative trust impact via surveys or support tickets.

---

### 4. Phase 3: Refinement Tests (Months 4-6)

#### Test 3A: Benefit Ordering
**Hypothesis**: Reordering benefits by user priority will improve engagement.

**Control (A)**: Time Savings → Health → Variety → Automation → Cost
**Variant B**: Health → Time Savings → Variety → Cost → Automation
**Variant C**: Time Savings → Cost → Health → Variety → Automation

**Primary Metric**: Scroll depth past benefits section
**Secondary Metrics**: Signup rate
**Sample Size**: 1,500 visitors per variant
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 3-8% improvement

---

#### Test 3B: Pricing Information Display
**Hypothesis**: Clearly stating "Free Forever Plan" will increase signups vs. omitting pricing.

**Control (A)**: No pricing mentioned on landing page
**Variant B**: "Free Forever Plan Available" in hero
**Variant C**: Pricing comparison table mid-page

**Primary Metric**: Signup initiation rate
**Secondary Metrics**: Bounce rate, pricing page visits
**Sample Size**: 1,000 visitors per variant
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 10-20% improvement

---

#### Test 3C: Exit-Intent Popup
**Hypothesis**: Exit-intent popup offering help will recover abandoning visitors.

**Control (A)**: No exit-intent popup
**Variant B**: "Wait! Have questions?" popup with FAQ links
**Variant C**: "Get Your First Meal Plan Free" popup with email capture

**Primary Metric**: Exit-intent conversion rate
**Secondary Metrics**: Overall signup rate, popup annoyance (survey)
**Sample Size**: 2,000 visitors per variant
**Estimated Duration**: 2-3 weeks
**Expected Lift**: 2-5% overall signup improvement

**Implementation Note**: Show popup only once per user, after 30+ seconds on page.

---

### 5. Testing Implementation Guide

#### A/B Testing Tools

**Recommended Tool: Google Optimize (Free)** *(Note: Google Optimize has been sunset as of September 2023. Consider alternatives below.)*

**Alternative Tools:**
1. **Vercel Edge Config + Feature Flags**
   - **Pros**: Free, integrated with Next.js, server-side control
   - **Cons**: Requires custom implementation
   - **Use Case**: Simple A/B tests without external dependencies

2. **PostHog** (Open Source)
   - **Pros**: Free tier available, feature flags, analytics, session recording
   - **Cons**: Self-hosting or paid cloud hosting
   - **Use Case**: Comprehensive experimentation platform

3. **VWO (Visual Website Optimizer)**
   - **Pros**: Visual editor, advanced targeting, robust analytics
   - **Cons**: Paid ($199+/month)
   - **Use Case**: If budget allows, enterprise-grade testing

4. **Optimizely**
   - **Pros**: Industry leader, feature flags, A/B testing, personalization
   - **Cons**: Expensive (enterprise pricing)
   - **Use Case**: Large-scale testing programs

**Recommended Choice**: **Vercel Edge Config** for simple tests, **PostHog** for comprehensive testing.

---

#### Implementation with Vercel Edge Config

**Step 1: Setup Edge Config**
```bash
# Create edge config in Vercel dashboard
# Or via CLI:
vercel edge-config create ab-tests
```

**Step 2: Create A/B Test Configuration**
```json
// Edge Config: ab-tests
{
  "heroHeadlineTest": {
    "enabled": true,
    "variants": {
      "control": {
        "headline": "AI-Powered Meal Planning Made Simple",
        "weight": 34
      },
      "variantB": {
        "headline": "Save 5+ Hours Weekly on Meal Planning",
        "weight": 33
      },
      "variantC": {
        "headline": "Your Personalized Weekly Meal Plan in 5 Minutes",
        "weight": 33
      }
    }
  }
}
```

**Step 3: Create A/B Test Hook**
```typescript
// apps/web/lib/experiments/useABTest.ts
import { get } from '@vercel/edge-config';
import { useEffect, useState } from 'react';

interface ABTest {
  enabled: boolean;
  variants: Record<string, { weight: number; [key: string]: any }>;
}

export function useABTest(testName: string) {
  const [variant, setVariant] = useState<string>('control');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function assignVariant() {
      const test = await get<ABTest>(testName);

      if (!test || !test.enabled) {
        setVariant('control');
        setData(test?.variants?.control || {});
        return;
      }

      // Check if user already assigned (cookie/localStorage)
      const storedVariant = localStorage.getItem(`ab_${testName}`);
      if (storedVariant && test.variants[storedVariant]) {
        setVariant(storedVariant);
        setData(test.variants[storedVariant]);
        return;
      }

      // Assign new variant based on weights
      const totalWeight = Object.values(test.variants).reduce(
        (sum, v) => sum + v.weight,
        0
      );
      const random = Math.random() * totalWeight;
      let cumulative = 0;

      for (const [name, config] of Object.entries(test.variants)) {
        cumulative += config.weight;
        if (random <= cumulative) {
          setVariant(name);
          setData(config);
          localStorage.setItem(`ab_${testName}`, name);

          // Track variant assignment
          trackEvent('ab_test_assigned', {
            test_name: testName,
            variant: name,
          });
          break;
        }
      }
    }

    assignVariant();
  }, [testName]);

  return { variant, data };
}
```

**Step 4: Use in Components**
```typescript
// apps/web/components/landing/Hero.tsx
import { useABTest } from '@/lib/experiments/useABTest';

export function Hero() {
  const { variant, data } = useABTest('heroHeadlineTest');

  return (
    <section data-test-variant={variant}>
      <h1>{data?.headline || 'AI-Powered Meal Planning Made Simple'}</h1>
      {/* Rest of hero component */}
    </section>
  );
}
```

**Step 5: Track Results in GA4**
```typescript
// When user converts (signs up)
trackEvent('sign_up', {
  ab_test_heroHeadlineTest: variant, // e.g., "variantB"
});
```

**Step 6: Analyze Results in GA4**
- Navigate to: Explore → Free form
- Add dimension: `ab_test_heroHeadlineTest` (custom parameter)
- Add metric: `conversions` (sign_up event count)
- Compare conversion rates across variants

---

#### Statistical Significance Calculator

**Minimum Requirements:**
- **Confidence Level**: 95% (industry standard)
- **Statistical Power**: 80% (reduces false negatives)
- **Minimum Detectable Effect (MDE)**: 10% relative improvement

**Sample Size Formula:**
```
n = (Z_α/2 + Z_β)² × (p1(1-p1) + p2(1-p2)) / (p1 - p2)²

Where:
- Z_α/2 = 1.96 (for 95% confidence)
- Z_β = 0.84 (for 80% power)
- p1 = control conversion rate
- p2 = variant conversion rate (expected)
```

**Example Calculation:**
- Control conversion rate: 4%
- Expected improvement: 10% relative (4% → 4.4%)
- Required sample size per variant: ~16,500 visitors

**Tools:**
- [Evan Miller's A/B Test Calculator](https://www.evanmiller.org/ab-testing/sample-size.html)
- [Optimizely Sample Size Calculator](https://www.optimizely.com/sample-size-calculator/)

**Testing Duration:**
- Run tests for minimum 1-2 full weeks (to account for day-of-week variance)
- Stop test only when statistical significance is reached AND minimum duration met
- Don't peek at results daily (increases false positive rate)

---

### 6. Testing Best Practices

#### ✅ Do's
- ✅ Test one variable at a time (unless running multivariate test)
- ✅ Run tests for full business cycles (1-2 weeks minimum)
- ✅ Ensure sufficient sample size before concluding
- ✅ Document all test results (winners and losers)
- ✅ Implement winning variants promptly
- ✅ Re-test major changes after 3-6 months (user behavior changes)

#### ❌ Don'ts
- ❌ Don't stop tests early (even if winning variant is obvious)
- ❌ Don't test too many variants at once (splits traffic too thin)
- ❌ Don't make decisions based on small sample sizes
- ❌ Don't ignore seasonal effects (holidays, etc.)
- ❌ Don't test during unusual traffic spikes
- ❌ Don't change test mid-flight (invalidates results)

---

## Pixel & Tracking Setup Requirements

### 1. Google Ads Conversion Tracking

#### Conversion Actions to Track

| Conversion Action | Type | Value | Counting | Primary? |
|-------------------|------|-------|----------|----------|
| Sign Up (Email Verified) | Sign-up | Free | One per click | ✅ Yes |
| Generate Meal Plan | Engagement | Calculated ($5) | Every | ✅ Yes |
| Enable Automation | Engagement | Calculated ($10) | One per click | No |
| Outbound Click (Grocery) | Engagement | Free | Every | No |

---

#### Installation Method 1: Google Tag Manager (Recommended)

**Advantages:**
- Centralized tag management
- No code deploys needed for tag updates
- Built-in debugging tools
- Version control for tag changes

**Setup Steps:**

**Step 1: Create GTM Container**
1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Create account and container: `Meal Planner Agent - Web`
3. Copy container ID (format: `GTM-XXXXXXX`)

**Step 2: Install GTM Code**

Add to `apps/web/app/layout.tsx`:
```typescript
// apps/web/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {process.env.NODE_ENV === 'production' && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
```

**Environment Variable:**
```bash
# .env.production
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
```

**Step 3: Configure Data Layer**

Create data layer helper:
```typescript
// apps/web/lib/analytics/dataLayer.ts
export function pushDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
  });
}

// Type declaration
declare global {
  interface Window {
    dataLayer: any[];
  }
}
```

**Step 4: Trigger Conversion Events**

Update existing tracking to use data layer:
```typescript
// apps/web/lib/analytics/google-analytics.tsx
import { pushDataLayer } from './dataLayer';

export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  // Push to dataLayer for GTM
  pushDataLayer(eventName, eventParams);

  // Also push to GA4 directly (if using gtag.js alongside GTM)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}
```

**Step 5: Create GTM Tags**

In Google Tag Manager, create these tags:

**Tag 1: Google Ads Conversion - Sign Up**
- **Tag Type**: Google Ads Conversion Tracking
- **Conversion ID**: `AW-XXXXXXXXXX` (from Google Ads)
- **Conversion Label**: `xxxxxxxxxxxxxx` (from Google Ads)
- **Conversion Value**: 0 (free signup)
- **Trigger**: Custom Event = `sign_up`

**Tag 2: Google Ads Conversion - Generate Meal Plan**
- **Tag Type**: Google Ads Conversion Tracking
- **Conversion ID**: `AW-XXXXXXXXXX`
- **Conversion Label**: `yyyyyyyyyyyyyy`
- **Conversion Value**: 5
- **Trigger**: Custom Event = `generate_meal_plan`

**Tag 3: Google Analytics 4 Event**
- **Tag Type**: GA4 Event
- **Measurement ID**: `{{GA4 Measurement ID}}` (variable)
- **Event Name**: `{{Event}}` (variable from data layer)
- **Event Parameters**: Pass all data layer variables
- **Trigger**: All Custom Events

**Step 6: Set Up Google Ads Conversion Import**
1. In Google Ads: Tools → Conversions → New conversion
2. Choose "Import" → "Google Analytics 4 properties"
3. Select GA4 property and import events: `sign_up`, `generate_meal_plan`, `enable_automation`
4. Set primary conversions: `sign_up` and `generate_meal_plan`

---

#### Installation Method 2: Direct Pixel (Alternative)

If not using GTM, install conversion pixel directly.

**Get Conversion Pixel Code:**
1. Google Ads → Tools → Conversions
2. Click on conversion action → Tag setup
3. Copy the global site tag and event snippet

**Install Global Site Tag:**
```typescript
// apps/web/app/layout.tsx
{process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
  <>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
        `,
      }}
    />
  </>
)}
```

**Fire Conversion Events:**
```typescript
// When user signs up
window.gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXXX/xxxxxxxxxxxxx', // Replace with your conversion ID/label
  'value': 0.0,
  'currency': 'USD'
});

// When user generates meal plan
window.gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXXX/yyyyyyyyyyyyyy',
  'value': 5.0,
  'currency': 'USD'
});
```

---

### 2. Google Analytics 4 Enhanced Measurement

GA4 automatically tracks some events, but we need custom events for conversions.

#### Custom Events Already Implemented

From `apps/web/lib/analytics/google-analytics.tsx`:
- ✅ `sign_up` - User completes registration
- ✅ `verify_email` - User verifies email
- ✅ `generate_meal_plan` - User generates meal plan
- ✅ `update_preferences` - User updates preferences
- ✅ `enable_automation` - User enables automation

#### Additional Events to Track

**Landing Page Engagement:**
```typescript
// Track when user scrolls 50% down landing page
trackEvent('scroll_depth_50', {
  page_path: window.location.pathname,
  engagement_level: 'medium',
});

// Track when user clicks CTA button
trackEvent('lp_cta_click', {
  cta_location: 'hero', // or 'middle', 'footer'
  landing_page_variant: 'ai-meal-planner',
});

// Track video plays (if using video)
trackEvent('video_start', {
  video_title: 'Product Demo',
  video_duration: 30,
});
```

**Form Interaction:**
```typescript
// Track form field focus
trackEvent('form_start', {
  form_name: 'registration',
});

// Track form errors
trackEvent('form_error', {
  form_name: 'registration',
  field_name: 'email',
  error_message: 'Invalid email format',
});

// Track form completion
trackEvent('form_submit', {
  form_name: 'registration',
});
```

**Exit Intent:**
```typescript
// Track exit-intent popup shown
trackEvent('exit_intent_shown', {
  page_path: window.location.pathname,
  time_on_page: timeOnPage,
});

// Track exit-intent popup interaction
trackEvent('exit_intent_click', {
  action: 'stay', // or 'leave'
});
```

---

### 3. Remarketing Audience Creation

#### Google Ads Remarketing Lists

**Create Audiences in Google Ads:**

**Audience 1: Landing Page Visitors (No Signup)**
- **Source**: Google Ads Tag
- **Conditions**:
  - Visited URL contains `/lp/`
  - Did NOT visit URL contains `/dashboard`
- **Membership Duration**: 30 days
- **Estimated Size**: Track in Google Ads

**Audience 2: Signup Abandoners**
- **Source**: Google Analytics
- **Conditions**:
  - Event `sign_up_started` = true
  - Event `sign_up` = false
- **Membership Duration**: 14 days

**Audience 3: Registered Users (No Meal Plan)**
- **Source**: Google Analytics
- **Conditions**:
  - Event `sign_up` exists
  - Event `generate_meal_plan` does NOT exist
- **Membership Duration**: 21 days

**Audience 4: Trial Users (1 Meal Plan)**
- **Source**: Google Analytics
- **Conditions**:
  - Event `generate_meal_plan` count = 1
  - Event `enable_automation` does NOT exist
  - Last activity: 7-30 days ago
- **Membership Duration**: 45 days

**Audience 5: Lapsed Active Users**
- **Source**: Google Analytics
- **Conditions**:
  - Event `generate_meal_plan` count ≥ 2
  - Last `generate_meal_plan` event: 30-90 days ago
- **Membership Duration**: 90 days

---

#### Technical Implementation: Custom Audience Signals

To enable more precise audience targeting, send custom parameters with events:

```typescript
// apps/web/lib/analytics/google-analytics.tsx
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_GA_ID) {
    return;
  }

  // Add standard parameters
  const enrichedParams = {
    ...eventParams,
    user_lifecycle_stage: getUserLifecycleStage(), // e.g., 'visitor', 'registered', 'active'
    days_since_signup: getDaysSinceSignup(),
    meal_plans_generated: getMealPlansGenerated(),
  };

  window.gtag('event', eventName, enrichedParams);
}

function getUserLifecycleStage(): string {
  // Logic to determine user stage
  if (!isLoggedIn()) return 'visitor';
  if (getMealPlansGenerated() === 0) return 'registered';
  if (getMealPlansGenerated() === 1) return 'trial';
  if (isAutomationEnabled()) return 'active';
  return 'inactive';
}

function getDaysSinceSignup(): number {
  const signupDate = localStorage.getItem('signup_date');
  if (!signupDate) return 0;
  const days = Math.floor((Date.now() - new Date(signupDate).getTime()) / (1000 * 60 * 60 * 24));
  return days;
}

function getMealPlansGenerated(): number {
  // Fetch from user profile or localStorage
  return parseInt(localStorage.getItem('meal_plans_count') || '0', 10);
}
```

**Create Custom Dimensions in GA4:**
1. Navigate to: Admin → Data display → Custom definitions
2. Create custom dimensions:
   - `user_lifecycle_stage` (User scope)
   - `days_since_signup` (User scope)
   - `meal_plans_generated` (User scope)

**Use in Audiences:**
- Audience: "Registered but Inactive" → `user_lifecycle_stage` = 'registered' AND `days_since_signup` > 7

---

### 4. Facebook Pixel (Optional for Future Expansion)

While Google Ads is the primary focus, installing Facebook Pixel enables future Meta advertising:

**Installation:**
```typescript
// apps/web/app/layout.tsx
{process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `,
    }}
  />
)}
```

**Track Conversions:**
```typescript
// Sign up
window.fbq('track', 'CompleteRegistration');

// Generate meal plan
window.fbq('track', 'Lead', { value: 5.00, currency: 'USD' });
```

---

### 5. Tracking Validation & Quality Assurance

#### Pre-Launch Checklist

**Google Ads Conversion Tracking:**
- [ ] Global site tag installed on all pages
- [ ] Conversion events firing on correct actions
- [ ] Conversion values assigned correctly
- [ ] Test conversions recorded in Google Ads (Tools → Conversions → "Recent conversions")
- [ ] Auto-tagging enabled in Google Ads settings

**Google Analytics 4:**
- [ ] GA4 property created and linked to Google Ads
- [ ] Measurement ID added to environment variables
- [ ] Custom events firing correctly (check in GA4 DebugView)
- [ ] Custom dimensions created for audience segmentation
- [ ] Ecommerce events configured (if applicable)

**Google Tag Manager (if using):**
- [ ] GTM container installed on all pages
- [ ] Tags created for all conversion events
- [ ] Triggers configured correctly
- [ ] Variables set up for dynamic values
- [ ] Preview mode tested before publishing
- [ ] Version published and documented

**Remarketing:**
- [ ] Remarketing tag installed (via GTM or direct)
- [ ] Audiences created in Google Ads
- [ ] Audiences have members (check after 24-48 hours)
- [ ] Audience sizes meet minimum thresholds (1,000+ for Display, 100+ for Search)

**Cross-Domain Tracking (if applicable):**
- [ ] Linker parameter configured for subdomain tracking
- [ ] Cross-domain tracking tested

---

#### Testing Tools

**Google Tag Assistant (Chrome Extension)**
- Install: [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
- Use: Click extension icon to see all tags firing on page
- Validate: Check for errors or warnings

**GA4 DebugView**
- Navigate to: GA4 Admin → DebugView
- Enable debug mode in browser:
  ```javascript
  // Run in browser console
  gtag('set', 'debug_mode', true);
  ```
- Trigger events and watch them appear in real-time

**Google Ads Conversion Tracking Test**
- Navigate to: Google Ads → Tools → Conversions
- Click on conversion action → "Tag setup" → "Test your tag"
- Trigger conversion on website
- Verify conversion appears in "Recent conversions" (may take a few minutes)

**Browser Developer Tools**
- Open DevTools → Network tab
- Filter: `collect?v=2` (GA4) or `pagead/conversion` (Google Ads)
- Trigger event and verify network request sent
- Check request payload for correct parameters

---

### 6. Privacy & Compliance

#### GDPR/CCPA Compliance

**Cookie Consent Banner:**
- Display consent banner before loading tracking scripts
- Provide opt-out mechanism
- Document cookie usage in privacy policy

**Example Implementation:**
```typescript
// apps/web/components/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (stored) {
      setConsent(stored === 'true');
    }
  }, []);

  useEffect(() => {
    if (consent === true) {
      // Load tracking scripts
      initializeAnalytics();
    }
  }, [consent]);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setConsent(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setConsent(false);
  };

  if (consent !== null) return null;

  return (
    <div className="cookie-consent-banner">
      <p>We use cookies to improve your experience and measure site performance.</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
      <a href="/privacy">Privacy Policy</a>
    </div>
  );
}
```

**Privacy Policy Updates:**
- List all tracking technologies used (Google Ads, GA4, GTM)
- Explain data collection purposes
- Provide opt-out instructions
- Include contact information for data requests

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)

#### Landing Page Setup
- [ ] Create landing page directory structure (`apps/web/app/lp/`)
- [ ] Build reusable landing page components
- [ ] Create 5 landing page variants (AI, Healthy, Weekly, Family, Budget)
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Implement mobile-responsive design
- [ ] Test page load speed (<2 seconds)
- [ ] Set up UTM parameter tracking

#### Tracking Infrastructure
- [ ] Install Google Tag Manager (GTM)
- [ ] Configure GTM data layer
- [ ] Create GTM tags for conversion events
- [ ] Set up Google Ads conversion tracking
- [ ] Link Google Ads to Google Analytics 4
- [ ] Import GA4 events as Google Ads conversions
- [ ] Test conversion tracking with Tag Assistant
- [ ] Enable auto-tagging in Google Ads

#### Analytics Setup
- [ ] Verify GA4 installation
- [ ] Create custom dimensions (user_lifecycle_stage, etc.)
- [ ] Set up conversion funnel in GA4 Explore
- [ ] Create dashboard for key metrics
- [ ] Install Hotjar or Microsoft Clarity for heatmaps

---

### Phase 2: Optimization (Week 3-4)

#### Landing Page Optimization
- [ ] Implement message match (headline ↔ ad copy)
- [ ] Add trust signals (testimonials, badges)
- [ ] Optimize CTA buttons (color, copy, placement)
- [ ] Reduce form fields (email + password only)
- [ ] Add social proof above the fold
- [ ] Implement exit-intent popup (optional)
- [ ] A/B test framework setup (Vercel Edge Config or PostHog)

#### Retargeting Setup
- [ ] Create remarketing audiences in Google Ads
  - [ ] Landing Page Visitors (No Signup)
  - [ ] Signup Abandoners
  - [ ] Registered Users (No Meal Plan)
  - [ ] Trial Users (1 Meal Plan)
  - [ ] Lapsed Active Users
- [ ] Verify audiences are collecting users (48-hour check)
- [ ] Create retargeting campaigns (Display Network)
- [ ] Design retargeting ad creatives (responsive display ads)
- [ ] Set up RLSA campaigns (Search Network)
- [ ] Configure frequency caps

---

### Phase 3: Testing & Iteration (Week 5-8)

#### A/B Testing Launch
- [ ] **Test 1A**: Hero headline variations
- [ ] **Test 1B**: CTA button copy
- [ ] **Test 1C**: CTA button color
- [ ] **Test 1D**: Social proof placement
- [ ] Monitor tests daily (without peeking at results too early)
- [ ] Document results in testing log
- [ ] Implement winning variants

#### Retargeting Campaign Launch
- [ ] Launch Display Network retargeting campaigns
- [ ] Launch RLSA campaigns (Search Network)
- [ ] Set initial bids and budgets
- [ ] Monitor performance daily (first week)
- [ ] Adjust audience targeting based on performance
- [ ] Optimize ad creative based on CTR

#### Funnel Analysis
- [ ] Review GA4 funnel exploration weekly
- [ ] Identify highest drop-off points
- [ ] Watch 20-30 Hotjar/Clarity session recordings
- [ ] Document usability issues
- [ ] Prioritize fixes based on PIE framework

---

### Phase 4: Scale & Refinement (Month 3+)

#### Continuous Optimization
- [ ] Run Phase 2 A/B tests (moderate-impact)
- [ ] Run Phase 3 A/B tests (refinement)
- [ ] Launch new landing page variants based on insights
- [ ] Expand retargeting to YouTube (video ads)
- [ ] Test dynamic remarketing with product feed
- [ ] Implement multivariate testing (if traffic allows)

#### Performance Monitoring
- [ ] Weekly performance review (conversion rates, CPA, ROAS)
- [ ] Monthly deep dive analysis (funnel, audience segments, device performance)
- [ ] Quarterly strategy review (adjust budgets, audiences, landing pages)
- [ ] Update retargeting creative quarterly (avoid ad fatigue)

---

## Ongoing Optimization

### 1. Weekly Tasks

**Every Monday:**
- Review weekend traffic and conversion performance
- Check retargeting campaign budgets and pacing
- Review any A/B tests in progress (but don't make decisions yet)

**Every Wednesday:**
- Analyze GA4 funnel exploration (identify drop-off points)
- Review landing page performance by variant
- Check audience sizes for retargeting campaigns

**Every Friday:**
- Review week-over-week performance trends
- Document any anomalies or insights
- Plan upcoming week's tests or optimizations

---

### 2. Monthly Tasks

**Performance Review:**
- Compare actual vs. target KPIs
- Identify best and worst performing landing pages
- Analyze retargeting ROAS by audience segment
- Review device and browser performance (mobile vs. desktop)

**Creative Refresh:**
- Update retargeting ad creatives (avoid ad fatigue)
- Rotate testimonials on landing pages
- Test new hero images or videos

**Audience Optimization:**
- Review audience sizes and overlap
- Adjust membership durations if needed
- Create new custom audiences based on behavior patterns
- Exclude converters from retargeting (reduce wasted spend)

**A/B Test Review:**
- Analyze completed tests for statistical significance
- Implement winning variants
- Document learnings in testing log
- Plan next round of tests

---

### 3. Quarterly Tasks

**Strategic Review:**
- Evaluate overall conversion rate improvement (vs. baseline)
- Calculate cumulative CPA reduction from optimizations
- Review budget allocation (Search vs. Display vs. Retargeting)
- Assess landing page portfolio (retire low-performers, create new variants)

**Competitive Analysis:**
- Review competitor landing pages and ad copy
- Identify new trends in meal planning industry
- Test new value propositions or messaging angles

**Technology Updates:**
- Audit tracking implementation (check for broken tags)
- Update GA4 custom dimensions if user journey changed
- Review privacy compliance (GDPR, CCPA updates)

**Long-Term Testing:**
- Review 6-month test results log
- Identify patterns in winning tests
- Plan major page redesigns based on cumulative learnings

---

### 4. Success Metrics Dashboard

**Create a Dashboard in GA4 or Google Data Studio:**

**Section 1: Traffic & Acquisition**
- Total landing page visits (by variant)
- Traffic source breakdown (Search, Display, Retargeting)
- New vs. returning visitors

**Section 2: Conversion Funnel**
- Landing Page → Signup Started (%)
- Signup Started → Email Verified (%)
- Email Verified → First Meal Plan (%)
- Overall Conversion Rate (Landing Page → Active User)

**Section 3: Retargeting Performance**
- Impressions by audience segment
- CTR by audience segment
- Conversions by audience segment
- Cost per retargeting conversion
- ROAS by audience

**Section 4: A/B Test Results**
- Active tests summary
- Recent completed tests (winner, lift %)
- Cumulative conversion rate improvement

**Section 5: Page Performance**
- Landing page load times
- Bounce rate by page variant
- Mobile vs. desktop conversion rates

---

### 5. Optimization Playbook

**If Conversion Rate is Low (<3%):**
1. Check message match (ad copy ↔ landing page headline)
2. Review trust signals (add more testimonials)
3. Simplify CTA (reduce friction)
4. Test urgency/scarcity elements
5. Improve page speed
6. Add live chat or support options

**If Bounce Rate is High (>40%):**
1. Check page load time (target <2 seconds)
2. Verify mobile responsiveness
3. Ensure headline is clear and compelling
4. Check for broken images or layout issues
5. Review traffic quality (add negative keywords)

**If Signup Started but Low Email Verification (<70%):**
1. Reduce form fields (email + password only)
2. Improve email deliverability (check SPF/DKIM)
3. Make verification email subject line clearer
4. Add "Resend verification" option
5. Send verification email instantly (no delays)

**If Email Verified but Low Activation (<50%):**
1. Improve onboarding email sequence
2. Add in-app tutorial or walkthrough
3. Simplify preference-setting form
4. Send reminder emails ("Generate your first meal plan!")
5. Offer incentive for first meal plan

**If Retargeting CTR is Low (<0.5%):**
1. Refresh ad creative (new images, headlines)
2. Adjust audience targeting (too broad or too narrow?)
3. Test different messaging angles
4. Reduce frequency cap (ad fatigue)
5. Exclude converters from retargeting

**If Retargeting CPA is High (>$20):**
1. Refine audience segments (focus on high-intent)
2. Lower bids incrementally
3. Improve landing page conversion rate (primary driver)
4. Exclude low-performing placements
5. Test RLSA instead of pure display retargeting

---

## Conclusion

This conversion optimization and retargeting strategy provides a comprehensive roadmap to maximize ROI from paid advertising campaigns. By implementing optimized landing pages, strategic retargeting, continuous A/B testing, and robust tracking, we can:

- **Increase conversion rates** from 3-5% (baseline) to 6-8% (optimized)
- **Reduce cost per acquisition** by 20-40% through testing and optimization
- **Re-engage 30-40% of lost traffic** through targeted retargeting campaigns
- **Improve user experience** based on data-driven insights and usability testing

### Next Steps

1. **Immediate (Week 1-2)**: Set up tracking infrastructure (GTM, GA4, Google Ads conversions)
2. **Short-term (Week 3-4)**: Launch landing page variants and retargeting campaigns
3. **Medium-term (Month 2-3)**: Begin A/B testing program and funnel optimization
4. **Long-term (Month 3+)**: Continuous iteration based on data and emerging patterns

### Key Success Factors

✅ **Data-Driven Decisions**: Every change backed by data, not assumptions
✅ **Continuous Testing**: Never stop testing; always be optimizing
✅ **User-Centric Design**: Focus on user experience and removing friction
✅ **Patience**: Statistical significance requires time and sample size
✅ **Documentation**: Track all tests, results, and learnings for future reference

---

**Document Version**: 1.0
**Last Updated**: 2026-01-28
**Owner**: Marketing/Growth Team
**Review Cycle**: Quarterly
