# Retailer Integration Overview

## Executive Summary

This document provides a comprehensive overview of grocery retailer integration options for the Meal Planner Agent application. The goal is to enable users to seamlessly order ingredients from their generated meal plans directly through popular grocery retailers.

After thorough research and analysis, we have evaluated three major retailers: **Instacart**, **Walmart**, and **Whole Foods (Amazon Fresh)**. Our findings indicate that **Instacart is the only viable option** for immediate integration due to their publicly available Developer Platform APIs. Both Walmart and Whole Foods lack public consumer-facing APIs suitable for our use case.

The integration architecture will follow the existing connector pattern established by the HEB connector (`packages/core/src/connectors/`), ensuring consistency with the codebase and maintainability. This document outlines the comparison between retailers, recommended implementation order, shared infrastructure requirements, database schema considerations, and UI/UX flow designs.

### Key Findings Summary

| Retailer | Viability | Timeline | Effort |
|----------|-----------|----------|--------|
| Instacart | **VIABLE** | 3-4 weeks | Medium |
| Walmart | NOT VIABLE | N/A | N/A |
| Whole Foods | NOT VIABLE | N/A | N/A |

---

## Retailer Comparison Matrix

### API Access and Capabilities

| Feature | Instacart | Walmart | Whole Foods |
|---------|-----------|---------|-------------|
| **Public API Available** | Yes (Developer Platform) | No (Seller APIs only) | No |
| **Consumer-Facing API** | Yes | No | No |
| **Shopping List Creation** | Yes | No | No |
| **Product Catalog Access** | Partner API only | No | No |
| **Direct Cart Integration** | Via URL redirect | N/A | N/A |
| **Authentication Method** | Bearer Token (24hr) | N/A | N/A |
| **SDK Available** | No official SDK | Seller SDK only | No |
| **Documentation Quality** | Good | N/A | N/A |

### Business Requirements

| Requirement | Instacart | Walmart | Whole Foods |
|-------------|-----------|---------|-------------|
| **Business Registration** | US/Canada required | Partnership required | N/A |
| **API Key Timeline** | ~1 week | N/A | N/A |
| **MVP Demo Required** | Yes (for Partner API) | N/A | N/A |
| **Approval Process** | ~19 days average | Unknown | N/A |
| **Monetization Options** | Affiliate program | N/A | N/A |
| **Regional Availability** | US & Canada | N/A | N/A |

### Technical Comparison

| Technical Aspect | Instacart | Walmart | Whole Foods |
|------------------|-----------|---------|-------------|
| **Integration Complexity** | Medium | N/A | N/A |
| **Rate Limiting** | Standard (documented) | N/A | N/A |
| **Webhook Support** | Unknown | N/A | N/A |
| **Error Handling** | Well-documented | N/A | N/A |
| **Sandbox Environment** | Available | N/A | N/A |

### Risk Assessment

| Risk Factor | Instacart | Walmart | Whole Foods |
|-------------|-----------|---------|-------------|
| **API Stability Risk** | Low | N/A | N/A |
| **Terms of Service Risk** | Low | High (no API) | Very High (scraping) |
| **Blocking/Rate Limit Risk** | Low | N/A | Very High |
| **Long-term Viability** | High | Low | Very Low |
| **Legal Risk** | None | Medium | High |

### Feature Support Matrix

| Meal Planner Feature | Instacart Support |
|----------------------|-------------------|
| Shopping list from meal plan | Full support via `/products_link` |
| Recipe page creation | Full support via `/recipe` endpoint |
| Product matching | Basic (by name), Advanced (Partner API) |
| Price comparison | Not available (Public API) |
| Delivery scheduling | Redirect to Instacart app |
| Order tracking | Not available (user handles in app) |

---

## Recommended Implementation Order

### Phase 1: Instacart Public API Integration (Weeks 1-4)

**Priority:** HIGH
**Effort:** Medium
**Dependencies:** None

This is the recommended starting point due to:
1. Well-documented public API with open application process
2. No partnership requirements for basic functionality
3. Aligns with existing connector architecture pattern
4. Provides immediate value to users

**Deliverables:**
- Instacart connector implementation
- Shopping list generation from meal plans
- "Order on Instacart" button in meal plan UI
- Token management and refresh logic
- Error handling and user feedback

### Phase 2: Instacart Partner API Upgrade (Weeks 5-8)

**Priority:** MEDIUM
**Effort:** Medium
**Dependencies:** Phase 1 completion, Partner API approval

After demonstrating MVP functionality:
1. Apply for Partner API access
2. Implement product catalog integration
3. Add product price display
4. Improve product matching accuracy
5. Consider affiliate program enrollment

**Deliverables:**
- Partner API integration
- Enhanced product matching
- Price information display
- Analytics for product matches

### Phase 3: Alternative Retailer Research (Future)

**Priority:** LOW
**Effort:** Unknown
**Dependencies:** Walmart/Whole Foods API changes

Monitor for changes in:
- Walmart consumer API availability
- Amazon Fresh/Whole Foods API programs
- New grocery delivery platforms (e.g., DoorDash Grocery, Uber Eats)

**Trigger Points:**
- Walmart announces public consumer API
- Amazon opens grocery API program
- User demand for specific retailers exceeds threshold

---

## Shared Infrastructure Needs

### 1. Connector Interface Pattern

All retailer integrations will follow the established connector pattern from the HEB implementation:

```typescript
// Base interface pattern (from heb.interface.ts)
export interface IRetailerConnector {
  name: string;
  description: string;
  execute(params: RetailerExecuteParams): Promise<RetailerResponse>;
}

export interface RetailerExecuteParams {
  shoppingList: ShoppingItem[];
  userPreferences?: UserRetailerPreferences;
}

export interface RetailerSuccessResponse {
  success: true;
  checkoutUrl: string;
  matchedItems: MatchedItem[];
  unmatchedItems: string[];
  summary: string;
}

export interface RetailerErrorResponse {
  success: false;
  error: string;
  retryable: boolean;
}
```

### 2. Token Management Service

Required for OAuth/Bearer token flows:

```typescript
interface TokenManagerConfig {
  clientId: string;
  clientSecret: string;
  refreshThreshold: number; // seconds before expiry to refresh
}

interface TokenManager {
  getValidToken(): Promise<string>;
  refreshToken(): Promise<void>;
  isTokenValid(): boolean;
}
```

**Storage Requirements:**
- Secure token storage (encrypted at rest)
- Expiration tracking
- Automatic refresh scheduling
- Per-user token management (for user-linked accounts)

### 3. Shopping Item Mapper

Transform internal `ShoppingItem` format to retailer-specific formats:

```typescript
// Internal format (from types/index.ts)
interface ShoppingItem {
  item: string;
  amount: string;
  category?: string;
}

// Instacart format
interface InstacartLineItem {
  name: string;           // Maps from item
  quantity?: number;      // Parsed from amount
  unit?: string;          // Parsed from amount
  filters?: {
    organic?: boolean;    // Could map from category/preferences
    vegan?: boolean;
  };
}
```

**Mapping Logic Required:**
- Amount parsing (e.g., "2 cups" → quantity: 2, unit: "cups")
- Unit normalization
- Category-based filter application
- Ingredient name cleaning (remove preparation notes)

### 4. Error Handling Framework

Standardized error handling across all retailer connectors:

```typescript
enum RetailerErrorType {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  RATE_LIMITED = 'RATE_LIMITED',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  REGION_NOT_SUPPORTED = 'REGION_NOT_SUPPORTED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

interface RetailerError extends Error {
  type: RetailerErrorType;
  retryable: boolean;
  retryAfter?: number; // seconds
  retailer: string;
}
```

### 5. Rate Limiting Middleware

Prevent API abuse and handle rate limit responses:

```typescript
interface RateLimiterConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  retryStrategy: 'exponential' | 'linear' | 'fixed';
  maxRetries: number;
}
```

### 6. Logging and Analytics

Track integration usage and issues:

- Request/response logging
- Success/failure rates by retailer
- Product match rates
- User adoption metrics
- Error categorization

---

## Database Schema Considerations

### New Models Required

#### 1. RetailerAccount (OAuth Account Linking)

Extends the existing NextAuth `Account` pattern for retailer-specific OAuth:

```prisma
model RetailerAccount {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  retailer      String   // "instacart", "walmart", etc.
  accessToken   String?  @db.Text
  refreshToken  String?  @db.Text
  expiresAt     DateTime?
  tokenType     String?
  scope         String?

  // Retailer-specific data
  retailerUserId String?
  metadata       Json?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([userId, retailer])
  @@index([userId])
  @@map("retailer_accounts")
}
```

#### 2. ShoppingListOrder (Order Tracking)

Track orders created through integrations:

```prisma
model ShoppingListOrder {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mealPlanId  String
  mealPlan    MealPlan @relation(fields: [mealPlanId], references: [id], onDelete: Cascade)

  retailer    String   // "instacart", etc.
  checkoutUrl String?  @db.Text
  status      OrderStatus @default(CREATED)

  // Item tracking
  totalItems    Int
  matchedItems  Int
  unmatchedItems Json?  // Array of unmatched item names

  createdAt   DateTime @default(now())
  completedAt DateTime?

  @@index([userId])
  @@index([mealPlanId])
  @@map("shopping_list_orders")
}

enum OrderStatus {
  CREATED     // URL generated, not clicked
  OPENED      // User clicked checkout URL
  COMPLETED   // User completed order (if trackable)
  ABANDONED   // User abandoned (if trackable)
}
```

#### 3. UserRetailerPreferences

Store user preferences for each retailer:

```prisma
model UserRetailerPreferences {
  id       String @id @default(cuid())
  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  retailer String

  // Preferences
  preferredStore    String?  // Store location ID
  organicPreferred  Boolean  @default(false)
  brandPreferences  Json?    // Preferred brands
  substitutions     Boolean  @default(true)  // Allow substitutions

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, retailer])
  @@map("user_retailer_preferences")
}
```

### Schema Migration Strategy

1. **Phase 1:** Add `RetailerAccount` model (for Instacart auth)
2. **Phase 2:** Add `ShoppingListOrder` model (for tracking)
3. **Phase 3:** Add `UserRetailerPreferences` model (for customization)

Each phase aligns with the implementation phases outlined above.

---

## UI/UX Flow Overview

### Flow 1: Initial Retailer Connection

```
┌─────────────────────────────────────────────────────────────┐
│                     Settings Page                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Grocery Retailers                                           │
│  ─────────────────                                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🛒 Instacart                        [Connect]        │   │
│  │  Order ingredients directly from your meal plans     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🔒 Walmart                          [Coming Soon]    │   │
│  │  Not currently available                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🔒 Whole Foods                      [Coming Soon]    │   │
│  │  Not currently available                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flow 2: Order Ingredients from Meal Plan

```
┌─────────────────────────────────────────────────────────────┐
│                     Meal Plan View                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Week of January 27, 2025                                   │
│  ─────────────────────────                                   │
│                                                              │
│  [Monday] Chicken Stir-Fry                                  │
│  [Tuesday] Beef Tacos                                       │
│  [Wednesday] Salmon with Vegetables                         │
│  ...                                                         │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  Shopping List (14 items)                    [View List]     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │   🛒  Order on Instacart                              │   │
│  │                                                        │   │
│  │   Get all ingredients delivered to your door          │   │
│  │                                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Order Confirmation

```
┌─────────────────────────────────────────────────────────────┐
│                  Order on Instacart                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Creating your shopping list...                             │
│                                                              │
│  ✓ Mapped 12 of 14 items                                    │
│                                                              │
│  ⚠️ 2 items may need substitution:                          │
│     • "Fresh Thai basil" → Search manually                  │
│     • "Szechuan peppercorns" → Search manually              │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  You'll be redirected to Instacart to complete your order.  │
│  You can adjust quantities and add more items there.        │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │      Cancel         │  │  Continue to Instacart  →   │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flow 4: Post-Order State

```
┌─────────────────────────────────────────────────────────────┐
│                     Meal Plan View                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Shopping List (14 items)                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ✓ Sent to Instacart                    [View Order]  │   │
│  │    Created: Jan 27, 2025 at 3:45 PM                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Want to order again?           [Create New Order]          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Responsiveness Considerations

- Order buttons should be full-width on mobile
- Modal flows for confirmation dialogs
- Touch-friendly tap targets (min 44px)
- Clear loading states during API calls
- Offline handling (save order intent, retry when online)

---

## Next Steps

1. **Review and approve this overview document**
2. **Read detailed Instacart integration plan** (`instacart-integration.md`)
3. **Review Walmart and Whole Foods feasibility analyses** for documentation
4. **Create implementation tickets** from task breakdowns in each plan
5. **Begin Phase 1 implementation** with Instacart Public API

---

## Document Index

| Document | Purpose | Status |
|----------|---------|--------|
| `retailer-integration-overview.md` | This document - high-level comparison and architecture | Complete |
| `instacart-integration.md` | Detailed Instacart implementation plan | Pending |
| `walmart-integration.md` | Walmart feasibility analysis (NOT_VIABLE) | Pending |
| `wholefoods-integration.md` | Whole Foods feasibility analysis (NOT_VIABLE) | Pending |

---

## References

- [Instacart Developer Platform](https://developers.instacart.com/)
- [Existing HEB Connector Pattern](../packages/core/src/connectors/heb.interface.ts)
- [Shopping Item Types](../packages/core/src/types/index.ts)
- [Database Schema](../packages/database/prisma/schema.prisma)
- [NextAuth Configuration](../apps/web/lib/auth.ts)
