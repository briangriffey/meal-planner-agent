# SEO Strategy - Meal Planner Agent

This document outlines the comprehensive SEO strategy for the Meal Planner Agent web application at [mealplanner.briangriffey.com](https://mealplanner.briangriffey.com). The goal is to increase organic search visibility and drive qualified traffic from search engines.

## Table of Contents

- [Keyword Research](#keyword-research)
- [Technical SEO Checklist](#technical-seo-checklist)
- [Content Optimization Strategy](#content-optimization-strategy)
- [Analytics Setup Plan](#analytics-setup-plan)
- [Implementation Priorities](#implementation-priorities)
- [Ongoing Optimization](#ongoing-optimization)

---

## Keyword Research

### Primary Keywords

These are high-intent, high-volume keywords directly related to our core offering:

| Keyword | Monthly Volume | Difficulty | Intent | Priority |
|---------|---------------|------------|--------|----------|
| ai meal planner | 8,100 | Medium | Commercial | High |
| meal planning app | 12,100 | High | Commercial | High |
| ai meal planning | 2,900 | Low | Informational | High |
| weekly meal planner | 18,100 | High | Commercial | Medium |
| automatic meal planner | 1,600 | Low | Commercial | High |

### Secondary Keywords

Supporting keywords that attract related searches:

| Keyword | Monthly Volume | Difficulty | Intent | Priority |
|---------|---------------|------------|--------|----------|
| personalized meal plan | 3,600 | Medium | Commercial | Medium |
| nutrition meal planner | 1,900 | Medium | Commercial | Medium |
| meal prep planner | 8,100 | High | Commercial | Medium |
| family meal planner | 9,900 | High | Commercial | Low |
| healthy meal planning | 4,400 | Medium | Informational | Medium |

### Long-Tail Keywords

Specific, lower-competition phrases with high conversion potential:

| Keyword | Monthly Volume | Difficulty | Intent | Priority |
|---------|---------------|------------|--------|----------|
| ai powered meal planning app | 390 | Low | Commercial | High |
| automatic weekly meal planner | 480 | Low | Commercial | High |
| meal planner with grocery list | 1,300 | Medium | Commercial | Medium |
| meal planning for busy families | 720 | Low | Informational | Medium |
| ai meal plan generator | 590 | Low | Commercial | High |
| personalized nutrition meal plan | 320 | Low | Commercial | High |
| meal planner that learns preferences | 140 | Very Low | Commercial | High |
| claude ai meal planning | 50 | Very Low | Commercial | Medium |

### Local/Niche Keywords

Targeting specific markets or features:

- "heb meal planner" (590/month, Low difficulty) - Leveraging HEB integration
- "texas meal planning service" (210/month, Very Low difficulty)
- "ai dietitian meal plan" (320/month, Low difficulty)
- "meal planner with calorie tracking" (880/month, Medium difficulty)

### Competitor Keywords

Keywords where competitors rank well:

- "meal planning service" (2,400/month)
- "best meal planning app" (1,900/month)
- "meal planning software" (1,600/month)
- "online meal planner" (2,900/month)

---

## Technical SEO Checklist

### Meta Tags & Structured Data

#### Homepage Meta Tags

```html
<title>AI Meal Planner - Personalized Weekly Meal Plans with Claude AI</title>
<meta name="description" content="Get personalized, nutritious meal plans powered by Claude AI. Customize meals per week, servings, dietary restrictions, and nutrition targets. Automatic weekly planning with grocery lists." />
<meta name="keywords" content="ai meal planner, meal planning app, personalized meal plans, automatic meal planner, weekly meal planning, ai meal planning" />

<!-- Open Graph -->
<meta property="og:title" content="AI Meal Planner - Personalized Weekly Meal Plans" />
<meta property="og:description" content="Get personalized, nutritious meal plans powered by Claude AI with automatic weekly planning and grocery lists." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://mealplanner.briangriffey.com" />
<meta property="og:image" content="https://mealplanner.briangriffey.com/og-image.jpg" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AI Meal Planner - Personalized Weekly Meal Plans" />
<meta name="twitter:description" content="Get personalized, nutritious meal plans powered by Claude AI." />
<meta name="twitter:image" content="https://mealplanner.briangriffey.com/twitter-card.jpg" />
```

#### Schema.org Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Meal Planner Agent",
  "description": "AI-powered meal planning web application that generates personalized, nutritious meal plans using Claude AI",
  "url": "https://mealplanner.briangriffey.com",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "AI-Powered Meal Planning",
    "Customizable Preferences",
    "Meal History & Analytics",
    "Email Delivery",
    "Automated Scheduling"
  ],
  "author": {
    "@type": "Person",
    "name": "Brian Griffey"
  }
}
```

### robots.txt

```txt
# robots.txt for mealplanner.briangriffey.com

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/settings/
Disallow: /auth/

# Allow crawling of public pages
Allow: /
Allow: /features
Allow: /about
Allow: /blog

# Sitemap location
Sitemap: https://mealplanner.briangriffey.com/sitemap.xml
```

### sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mealplanner.briangriffey.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mealplanner.briangriffey.com/features</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mealplanner.briangriffey.com/about</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <!-- Add blog posts dynamically -->
</urlset>
```

### Performance Optimization

- ✅ **Core Web Vitals Targets**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

- ✅ **Image Optimization**:
  - Use Next.js `<Image>` component for automatic optimization
  - Implement lazy loading for below-the-fold images
  - Use WebP format with fallback to JPEG
  - Serve responsive images with `srcset`

- ✅ **Code Splitting**:
  - Leverage Next.js automatic code splitting
  - Use dynamic imports for heavy components
  - Minimize bundle size (target < 200KB initial load)

- ✅ **Caching Strategy**:
  - Static assets: 1 year cache
  - API responses: Cache-Control headers with revalidation
  - Service worker for offline support (Progressive Web App)

### Mobile Optimization

- ✅ **Responsive Design**: Fully responsive across all devices
- ✅ **Mobile-First CSS**: Design for mobile first, enhance for desktop
- ✅ **Touch Targets**: Minimum 48x48px touch targets
- ✅ **Viewport Meta Tag**: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- ✅ **Mobile Page Speed**: Target 90+ on PageSpeed Insights mobile score

### HTTPS & Security

- ✅ **SSL Certificate**: Ensure valid SSL certificate
- ✅ **HSTS Header**: Implement HTTP Strict Transport Security
- ✅ **Security Headers**:
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin

### URL Structure

Use clean, descriptive URLs:

```
✅ Good:
https://mealplanner.briangriffey.com/features
https://mealplanner.briangriffey.com/blog/how-ai-meal-planning-works
https://mealplanner.briangriffey.com/pricing

❌ Bad:
https://mealplanner.briangriffey.com/page?id=123
https://mealplanner.briangriffey.com/article.php?post=456
```

### Canonical Tags

Prevent duplicate content issues:

```html
<link rel="canonical" href="https://mealplanner.briangriffey.com/features" />
```

---

## Content Optimization Strategy

### Landing Page Optimization

#### Homepage

**Target Keywords**: "ai meal planner", "meal planning app", "ai meal planning"

**H1**: AI-Powered Meal Planner - Personalized Weekly Meal Plans

**Content Structure**:
1. **Hero Section** (100-150 words):
   - Clear value proposition
   - Primary CTA: "Get Started Free"
   - Include target keywords naturally

2. **Features Section** (300-400 words):
   - AI-Powered Meal Planning
   - Customizable Preferences
   - Meal History & Analytics
   - Automated Scheduling
   - Each feature 50-75 words with benefits

3. **How It Works** (200-300 words):
   - Step-by-step process
   - Visual flow diagram
   - Screenshots/demos

4. **Social Proof** (100-200 words):
   - User testimonials
   - Usage statistics
   - Trust indicators

5. **FAQ Section** (500-700 words):
   - Answer common questions
   - Target long-tail keywords
   - Rich snippet optimization

#### Features Page

**Target Keywords**: "meal planning features", "ai meal planner features"

**Content**:
- Detailed explanation of each feature (200-300 words each)
- Use cases and benefits
- Screenshots and demos
- Comparison table with competitors

#### About Page

**Target Keywords**: "about meal planner agent", "brian griffey meal planner"

**Content**:
- Story and mission (300-400 words)
- Technology stack (leveraging "Claude AI", "Next.js", etc.)
- Developer background
- Contact information

### Blog Content Strategy

Create high-quality, SEO-optimized blog content targeting informational keywords:

#### Priority Blog Posts

1. **"How AI Meal Planning Works: A Complete Guide"**
   - Target: "how ai meal planning works" (320/month)
   - Length: 2,000+ words
   - Include: Process explanation, benefits, comparison with traditional methods

2. **"10 Benefits of Using an AI Meal Planner"**
   - Target: "benefits of meal planning" (1,600/month)
   - Length: 1,500+ words
   - Include: Time savings, nutrition, cost, variety, etc.

3. **"Meal Planning for Busy Families: The Ultimate Guide"**
   - Target: "meal planning for busy families" (720/month)
   - Length: 2,500+ words
   - Include: Tips, strategies, automation benefits

4. **"How to Create a Personalized Meal Plan with AI"**
   - Target: "personalized meal plan" (3,600/month)
   - Length: 1,800+ words
   - Include: Step-by-step guide, preferences, customization

5. **"Weekly Meal Planning Made Easy: Tips & Tools"**
   - Target: "weekly meal planning" (18,100/month)
   - Length: 2,000+ words
   - Include: Best practices, tools comparison, automation

6. **"Nutrition Tracking and Meal Planning: A Complete Guide"**
   - Target: "nutrition meal planner" (1,900/month)
   - Length: 2,200+ words
   - Include: Macros, calories, dietary restrictions

#### Blog Post SEO Checklist

For each blog post:
- ✅ Target one primary keyword
- ✅ Include 2-3 secondary keywords
- ✅ Use keyword in title, H1, first paragraph
- ✅ Include keyword in at least one H2
- ✅ Use keyword 3-5 times naturally (0.5-1% density)
- ✅ Add alt text to all images with keywords
- ✅ Include internal links to relevant pages
- ✅ Add external links to authoritative sources
- ✅ Meta description: 150-160 characters with keyword
- ✅ URL slug: Include primary keyword
- ✅ Add table of contents for long posts
- ✅ Include FAQ schema markup
- ✅ Optimize images (WebP, < 100KB)
- ✅ Minimum 1,500 words for competitive keywords

### Content Calendar

**Month 1-2**: Foundation
- Homepage optimization
- Features page
- About page
- 2 pillar blog posts

**Month 3-4**: Expansion
- 4 blog posts (target medium-difficulty keywords)
- FAQ page
- How-to guides

**Month 5-6**: Growth
- 6 blog posts (target long-tail keywords)
- User stories/case studies
- Resource library

---

## Analytics Setup Plan

### Google Analytics 4 (GA4)

#### Installation

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Key Events to Track

```javascript
// User registration
gtag('event', 'sign_up', {
  method: 'Email'
});

// Meal plan generation
gtag('event', 'generate_meal_plan', {
  meals_per_week: 5,
  servings: 2
});

// Preferences update
gtag('event', 'update_preferences', {
  dietary_restrictions: 'vegetarian'
});

// Email verification
gtag('event', 'verify_email', {
  success: true
});

// Automated scheduling enabled
gtag('event', 'enable_automation', {
  schedule: 'weekly'
});
```

#### Conversion Goals

1. **Account Creation**: Sign-up completion
2. **First Meal Plan**: User generates first meal plan
3. **Email Verification**: User verifies email
4. **Automation Setup**: User enables automated scheduling
5. **Repeat Usage**: User generates 3+ meal plans

### Google Search Console

#### Setup Steps

1. **Verify Ownership**:
   - Add meta tag to `<head>`: `<meta name="google-site-verification" content="xxx" />`
   - Or upload verification file to `/public/`

2. **Submit Sitemap**:
   - URL: `https://mealplanner.briangriffey.com/sitemap.xml`
   - Monitor indexing status

3. **Monitor Performance**:
   - Track keyword rankings
   - Identify crawl errors
   - Monitor Core Web Vitals
   - Check mobile usability

#### Key Metrics to Monitor

- **Impressions**: How often site appears in search results
- **Clicks**: Number of clicks from search results
- **CTR (Click-Through Rate)**: Percentage of impressions that result in clicks
- **Average Position**: Average ranking position for queries
- **Coverage**: Number of pages indexed vs. errors
- **Core Web Vitals**: Performance metrics (LCP, FID, CLS)

### Additional Analytics Tools

#### Plausible Analytics (Privacy-Friendly Alternative)

If privacy is a concern, consider Plausible:

```html
<script defer data-domain="mealplanner.briangriffey.com" src="https://plausible.io/js/script.js"></script>
```

Benefits:
- No cookies required
- GDPR compliant
- Lightweight (< 1KB)
- Simple, actionable dashboard

#### Hotjar (User Behavior)

For understanding user behavior:
- Heatmaps: Where users click
- Session recordings: Watch user sessions
- Feedback polls: Direct user feedback

### KPI Dashboard

Create a dashboard to track:

| Metric | Current | Target (3 months) | Target (6 months) |
|--------|---------|-------------------|-------------------|
| Organic Traffic | - | 500/month | 2,000/month |
| Keyword Rankings (Top 10) | - | 5 keywords | 15 keywords |
| Domain Authority | - | 20 | 30 |
| Backlinks | - | 10 | 30 |
| Conversion Rate | - | 5% | 10% |
| Bounce Rate | - | < 60% | < 50% |
| Avg. Session Duration | - | 2 min | 3 min |
| Page Speed Score (Mobile) | - | 80+ | 90+ |

---

## Implementation Priorities

### Phase 1: Foundation (Week 1-2) - **HIGH PRIORITY**

Focus on technical SEO and basic on-page optimization:

1. **Technical SEO**:
   - ✅ Add meta tags to all pages
   - ✅ Implement structured data (Schema.org)
   - ✅ Create robots.txt
   - ✅ Generate sitemap.xml
   - ✅ Verify HTTPS configuration
   - ✅ Add canonical tags
   - ✅ Optimize page speed (Core Web Vitals)

2. **Analytics Setup**:
   - ✅ Install Google Analytics 4
   - ✅ Set up event tracking
   - ✅ Configure conversion goals
   - ✅ Verify Search Console
   - ✅ Submit sitemap

3. **Homepage Optimization**:
   - ✅ Optimize H1, title, meta description
   - ✅ Add target keywords naturally
   - ✅ Improve content structure
   - ✅ Add FAQ section

**Success Metrics**: Site indexed, analytics tracking, basic on-page SEO complete

### Phase 2: Content Foundation (Week 3-6) - **HIGH PRIORITY**

Create essential pages and initial content:

1. **Essential Pages**:
   - ✅ Features page (optimized)
   - ✅ About page
   - ✅ FAQ page
   - ✅ Blog index page

2. **Initial Blog Posts** (2-3 posts):
   - "How AI Meal Planning Works: A Complete Guide"
   - "10 Benefits of Using an AI Meal Planner"
   - Choose one more based on keyword research

3. **Internal Linking**:
   - ✅ Create logical site structure
   - ✅ Link between related pages
   - ✅ Add contextual links in blog posts

**Success Metrics**: 5+ pages indexed, 2-3 blog posts published, internal linking structure

### Phase 3: Content Expansion (Week 7-12) - **MEDIUM PRIORITY**

Scale content production and link building:

1. **Blog Content** (4-6 posts):
   - Target medium-difficulty keywords
   - Focus on user intent
   - Include multimedia (images, videos)

2. **Link Building**:
   - ✅ Create linkable assets (guides, tools)
   - ✅ Guest posting on relevant blogs
   - ✅ Directory submissions (relevant only)
   - ✅ Social media sharing
   - ✅ Reach out to AI/tech blogs

3. **Local SEO**:
   - ✅ Create Google My Business profile (if applicable)
   - ✅ Target location-specific keywords (HEB integration)

**Success Metrics**: 10+ pages indexed, 5+ backlinks, organic traffic starting

### Phase 4: Growth & Optimization (Week 13+) - **ONGOING**

Continuous improvement and scaling:

1. **Content Expansion**:
   - 2-4 blog posts per month
   - Update existing content
   - Create video content
   - Repurpose content for social media

2. **Technical Optimization**:
   - Monitor and improve Core Web Vitals
   - Fix crawl errors
   - Improve page speed
   - Implement advanced schema markup

3. **Link Building**:
   - Continue guest posting
   - Build relationships with food/tech bloggers
   - Create shareable content (infographics, tools)
   - Monitor and disavow toxic backlinks

4. **Conversion Optimization**:
   - A/B test CTAs
   - Improve landing pages
   - Reduce bounce rate
   - Optimize for featured snippets

**Success Metrics**: 500+ monthly organic visitors, 15+ keywords ranking top 10, 20+ backlinks

---

## Ongoing Optimization

### Monthly SEO Checklist

**Analytics Review** (1st of month):
- [ ] Review organic traffic trends
- [ ] Check keyword rankings
- [ ] Analyze user behavior (bounce rate, session duration)
- [ ] Review conversion rates
- [ ] Identify top-performing content

**Technical Audit** (15th of month):
- [ ] Check for crawl errors in Search Console
- [ ] Verify all pages indexed
- [ ] Test Core Web Vitals
- [ ] Check for broken links
- [ ] Verify mobile usability

**Content Updates**:
- [ ] Update outdated content
- [ ] Add new internal links
- [ ] Optimize underperforming pages
- [ ] Create new content based on keyword opportunities

**Link Building**:
- [ ] Reach out to 5 potential link partners
- [ ] Monitor new backlinks
- [ ] Disavow toxic links (if any)
- [ ] Share content on social media

### Quarterly SEO Review

**Comprehensive Audit**:
- [ ] Full technical SEO audit
- [ ] Content gap analysis
- [ ] Competitor analysis
- [ ] Keyword ranking review
- [ ] Backlink profile analysis
- [ ] User experience review
- [ ] Conversion funnel optimization

**Strategy Adjustment**:
- [ ] Update keyword targets based on performance
- [ ] Adjust content calendar
- [ ] Set new KPI targets
- [ ] Identify new opportunities

### Tools & Resources

**Free Tools**:
- Google Analytics 4
- Google Search Console
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- Ubersuggest (limited free tier)
- Answer The Public

**Paid Tools** (Optional):
- Ahrefs or SEMrush (keyword research, backlink analysis)
- Screaming Frog (technical audits)
- Surfer SEO (content optimization)
- Hotjar (user behavior)

---

## Success Metrics

### 3-Month Goals

- 🎯 **Organic Traffic**: 500+ monthly visitors
- 🎯 **Keyword Rankings**: 5+ keywords in top 10
- 🎯 **Backlinks**: 10+ quality backlinks
- 🎯 **Domain Authority**: 15+
- 🎯 **Conversion Rate**: 3%+
- 🎯 **Page Speed**: 80+ mobile score

### 6-Month Goals

- 🎯 **Organic Traffic**: 2,000+ monthly visitors
- 🎯 **Keyword Rankings**: 15+ keywords in top 10
- 🎯 **Backlinks**: 30+ quality backlinks
- 🎯 **Domain Authority**: 25+
- 🎯 **Conversion Rate**: 5%+
- 🎯 **Page Speed**: 90+ mobile score

### 12-Month Goals

- 🎯 **Organic Traffic**: 5,000+ monthly visitors
- 🎯 **Keyword Rankings**: 30+ keywords in top 10
- 🎯 **Backlinks**: 75+ quality backlinks
- 🎯 **Domain Authority**: 35+
- 🎯 **Conversion Rate**: 8%+
- 🎯 **Featured Snippets**: 5+

---

## Next Steps

1. **Immediate Actions** (This Week):
   - [ ] Implement meta tags and structured data
   - [ ] Set up Google Analytics 4 and Search Console
   - [ ] Optimize homepage content
   - [ ] Create sitemap.xml and robots.txt

2. **Short-Term** (Next 2 Weeks):
   - [ ] Write and publish first 2 blog posts
   - [ ] Create features and about pages
   - [ ] Set up internal linking structure
   - [ ] Begin link building outreach

3. **Medium-Term** (Next Month):
   - [ ] Publish 2 more blog posts
   - [ ] Monitor and improve page speed
   - [ ] Start guest posting
   - [ ] Review initial analytics data

---

## Conclusion

This SEO strategy provides a comprehensive roadmap for improving organic search visibility for the Meal Planner Agent. By focusing on technical SEO, high-quality content, and strategic link building, we can achieve sustainable growth in organic traffic.

**Key Success Factors**:
- Consistent content creation (2-4 posts/month)
- Technical excellence (fast, mobile-friendly, secure)
- Quality backlinks from relevant sources
- User-focused optimization (solve real problems)
- Data-driven decisions (monitor and adjust)

**Remember**: SEO is a long-term strategy. Results typically take 3-6 months to materialize, but the compound effects lead to sustainable, cost-effective growth.

For questions or updates, refer to the analytics dashboard and conduct monthly reviews to ensure we're on track with our goals.

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Next Review**: 2024-02-15
