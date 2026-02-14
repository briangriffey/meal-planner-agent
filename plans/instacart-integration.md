# Instacart Developer Platform Integration Plan

## Executive Summary

This document outlines the complete integration strategy for connecting the Meal Planner Agent application with Instacart's Developer Platform, enabling users to seamlessly order ingredients directly from their generated meal plans.

Instacart is the **recommended primary retailer integration** due to its accessible Public API with open application process, clear upgrade path to Partner API with full catalog access, and extensive retailer network covering over 5,500 retailers across the US and Canada.

The integration will follow a phased approach: starting with the Public API for shopping list URL generation, then progressing to Partner API access for enhanced product matching and catalog search capabilities. This mirrors our existing connector architecture established by the HEB connector pattern.

### Key Benefits

- **Low Barrier to Entry**: Public API available through open application (~1 week approval)
- **Extensive Coverage**: Access to 5,500+ retailers including Costco, Kroger, Safeway, Target
- **Clear Monetization Path**: Affiliate program available after going live
- **Modern API Design**: RESTful JSON API with well-documented endpoints
- **User Experience**: One-click ordering from meal plans to filled Instacart carts

---

## API Research

### Available APIs

Instacart offers two tiers of API access with different capabilities:

#### Public API (IDP - Instacart Developer Platform)

**Access Requirements:**
- Open application process (no partnership required)
- US or Canada business registration or residency
- Agreement to API usage policies
- Typical approval time: ~1 week

**Capabilities:**
| Feature | Supported |
|---------|-----------|
| Shopping List URL Generation | Yes |
| Recipe Page Creation | Yes |
| Product Catalog Search | No |
| Price Information | No |
| Inventory Availability | No |
| Order Placement | No (redirect to Instacart) |

**Key Endpoints:**

```
POST /idp/v1/products/products_link
POST /idp/v1/products/recipe
```

#### Partner API (Advanced)

**Access Requirements:**
- Must first demonstrate MVP with Public API
- Business application with demo
- Approval process (~1-2 business days after demo)
- More stringent usage policies

**Capabilities:**
| Feature | Supported |
|---------|-----------|
| All Public API Features | Yes |
| Product Catalog Search | Yes |
| Price Information | Yes |
| Inventory Availability | Yes |
| Store-Specific Products | Yes |
| Enhanced Product Matching | Yes |

### Authentication Requirements

#### Bearer Token Authentication

Instacart uses OAuth 2.0 Client Credentials flow for API authentication:

```
┌─────────────────┐                ┌──────────────────┐
│  Meal Planner   │                │  Instacart API   │
│    Backend      │                │                  │
└────────┬────────┘                └────────┬─────────┘
         │                                  │
         │  POST /oauth/token               │
         │  grant_type=client_credentials   │
         │  client_id + client_secret       │
         ├─────────────────────────────────►│
         │                                  │
         │  { access_token, expires_in }    │
         │◄─────────────────────────────────┤
         │                                  │
         │  API Request                     │
         │  Authorization: Bearer {token}   │
         ├─────────────────────────────────►│
         │                                  │
```

**Token Characteristics:**
- **Expiration**: 24 hours from issuance
- **Type**: Bearer token
- **Scope**: API-specific (read, write operations)
- **Refresh**: New token must be requested (no refresh token)

**Required Environment Variables:**
```
INSTACART_API_KEY       # API key from developer portal
INSTACART_CLIENT_ID     # OAuth client ID
INSTACART_CLIENT_SECRET # OAuth client secret
```

**Authentication Flow Implementation:**

```typescript
interface InstacartAuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;  // seconds (86400 = 24 hours)
  created_at: number;  // Unix timestamp
}

// Token should be cached and refreshed proactively
// Recommended: Refresh when < 1 hour remaining
```

### Rate Limits and Quotas

#### Public API Limits

| Metric | Limit | Window |
|--------|-------|--------|
| Requests per minute | 100 | Per minute |
| Requests per day | 10,000 | Per 24 hours |
| Concurrent requests | 10 | Simultaneous |
| Request payload size | 1 MB | Per request |
| List items per request | 100 | Per products_link call |

#### Rate Limit Headers

Instacart includes rate limit information in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

#### Error Responses

| Status Code | Meaning | Retry Strategy |
|-------------|---------|----------------|
| 429 | Rate limited | Exponential backoff, retry after header |
| 401 | Token expired | Refresh token, retry once |
| 403 | Forbidden | Check API key permissions |
| 500 | Server error | Exponential backoff, max 3 retries |

---

## Technical Design

### Data Flow

#### Shopping List Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MEAL PLANNER APPLICATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌─────────────────┐    ┌──────────────────────────┐  │
│  │  Meal Plan   │    │  ShoppingItem[] │    │  InstacartLineItem[]     │  │
│  │  Generated   │───►│  Extraction     │───►│  Transformation          │  │
│  │              │    │                 │    │                          │  │
│  └──────────────┘    └─────────────────┘    └────────────┬─────────────┘  │
│                                                          │                 │
└──────────────────────────────────────────────────────────┼─────────────────┘
                                                           │
                                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INSTACART CONNECTOR                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌─────────────────┐    ┌──────────────────────────┐  │
│  │  Auth Token  │    │  POST           │    │  products_link_url       │  │
│  │  Manager     │───►│  /products_link │───►│  Response                │  │
│  │              │    │                 │    │                          │  │
│  └──────────────┘    └─────────────────┘    └────────────┬─────────────┘  │
│                                                          │                 │
└──────────────────────────────────────────────────────────┼─────────────────┘
                                                           │
                                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌─────────────────┐    ┌──────────────────────────┐  │
│  │  Store URL   │    │  User Click     │    │  Instacart Website       │  │
│  │  in UI       │───►│  "Order Now"    │───►│  Pre-filled Cart         │  │
│  │              │    │                 │    │                          │  │
│  └──────────────┘    └─────────────────┘    └──────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Complete Request/Response Cycle

```
User                  Web App              Instacart          Database
 │                       │                 Connector              │
 │  View Meal Plan       │                     │                  │
 │──────────────────────►│                     │                  │
 │                       │                     │                  │
 │                       │  Get Shopping List  │                  │
 │                       │────────────────────►│                  │
 │                       │                     │                  │
 │                       │                     │  Check Token     │
 │                       │                     │─────────────────►│
 │                       │                     │◄─────────────────│
 │                       │                     │                  │
 │                       │                     │  POST /products_link
 │                       │                     │──────────────────►
 │                       │                     │                  Instacart API
 │                       │                     │◄──────────────────
 │                       │                     │  { products_link_url }
 │                       │                     │                  │
 │                       │  Cache URL          │                  │
 │                       │────────────────────►│─────────────────►│
 │                       │                     │                  │
 │  Render Order Button  │                     │                  │
 │◄──────────────────────│                     │                  │
 │                       │                     │                  │
 │  Click "Order"        │                     │                  │
 │  Redirect to Instacart│                     │                  │
 ╳════════════════════════════════════════════════════════════════►
                                                        Instacart.com
```

### Connector Interface

Following the existing HEB connector pattern, define the Instacart connector interfaces:

#### Interface Definitions

**File: `packages/core/src/connectors/instacart.interface.ts`**

```typescript
/**
 * Instacart Connector Interface
 *
 * Interface for Instacart Developer Platform integration.
 * Follows the same pattern as HEB connector for consistency.
 */

// ============================================================================
// Input Types
// ============================================================================

export interface InstacartLineItem {
  name: string;           // Required: Item name (e.g., "chicken breast")
  quantity?: number;      // Optional: Number of units (default: 1)
  unit?: string;          // Optional: Unit of measure (e.g., "lb", "oz")
  filters?: {
    organic?: boolean;    // Optional: Prefer organic products
    vegan?: boolean;      // Optional: Prefer vegan products
    gluten_free?: boolean;// Optional: Prefer gluten-free products
  };
}

export interface InstacartExecuteParams {
  title: string;                    // Required: Shopping list title
  line_items: InstacartLineItem[];  // Required: Items to add to cart
  landing_page_configuration?: {
    partner_linkback_url?: string;  // URL to return to after checkout
    action_button_text?: string;    // Custom button text
    action_button_url?: string;     // Custom button URL
  };
}

// ============================================================================
// Response Types
// ============================================================================

export interface InstacartProductLink {
  products_link_url: string;  // URL to Instacart with pre-filled cart
  expires_at?: string;        // ISO timestamp when link expires
}

export interface InstacartSuccessResponse {
  success: true;
  products_link_url: string;
  items_count: number;
  title: string;
}

export interface InstacartErrorResponse {
  success: false;
  error: string;
  error_code?: string;
  retry_after?: number;  // Seconds to wait before retry (rate limit)
}

export type InstacartResponse = InstacartSuccessResponse | InstacartErrorResponse;

// ============================================================================
// Configuration Types
// ============================================================================

export interface InstacartConnectorConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  baseUrl?: string;       // Default: https://connect.instacart.com
  timeout?: number;       // Request timeout in ms (default: 30000)
  maxRetries?: number;    // Max retry attempts (default: 3)
}

// ============================================================================
// Connector Interface
// ============================================================================

/**
 * Interface that all Instacart connectors must implement
 */
export interface IInstacartConnector {
  /**
   * Generate a shopping list URL for the given items
   */
  execute(params: InstacartExecuteParams): Promise<InstacartResponse>;

  /**
   * Check if the connector is properly configured
   */
  isConfigured(): boolean;

  /**
   * Get remaining rate limit quota
   */
  getRateLimitStatus(): Promise<{
    remaining: number;
    reset: Date;
  }>;
}

// ============================================================================
// Mapping Types (ShoppingItem -> InstacartLineItem)
// ============================================================================

export interface ShoppingItemMapper {
  /**
   * Convert app ShoppingItem to Instacart format
   */
  mapToInstacart(items: ShoppingItem[]): InstacartLineItem[];

  /**
   * Parse amount string to quantity and unit
   * e.g., "2 lbs" -> { quantity: 2, unit: "lb" }
   */
  parseAmount(amount: string): { quantity?: number; unit?: string };
}
```

#### Implementation Pattern

**File: `packages/core/src/connectors/instacart.ts`**

```typescript
import {
  IInstacartConnector,
  InstacartConnectorConfig,
  InstacartExecuteParams,
  InstacartResponse,
} from './instacart.interface';

export class InstacartConnector implements IInstacartConnector {
  private config: InstacartConnectorConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(config: InstacartConnectorConfig) {
    this.config = {
      baseUrl: 'https://connect.instacart.com',
      timeout: 30000,
      maxRetries: 3,
      ...config,
    };
  }

  async execute(params: InstacartExecuteParams): Promise<InstacartResponse> {
    try {
      // Ensure we have a valid token
      await this.ensureValidToken();

      // Make API request
      const response = await this.makeRequest(
        'POST',
        '/idp/v1/products/products_link',
        params
      );

      return {
        success: true,
        products_link_url: response.products_link_url,
        items_count: params.line_items.length,
        title: params.title,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  isConfigured(): boolean {
    return !!(
      this.config.apiKey &&
      this.config.clientId &&
      this.config.clientSecret
    );
  }

  async getRateLimitStatus(): Promise<{ remaining: number; reset: Date }> {
    // Implementation would track rate limits from response headers
  }

  private async ensureValidToken(): Promise<void> {
    // Check if token is valid (with 1-hour buffer)
    if (this.accessToken && this.tokenExpiresAt) {
      const bufferMs = 60 * 60 * 1000; // 1 hour
      if (new Date() < new Date(this.tokenExpiresAt.getTime() - bufferMs)) {
        return;
      }
    }
    await this.refreshToken();
  }

  private async refreshToken(): Promise<void> {
    // OAuth 2.0 Client Credentials flow
    const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
  }

  private async makeRequest(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    // Implementation with retry logic and rate limit handling
  }

  private handleError(error: any): InstacartErrorResponse {
    // Error handling implementation
  }
}
```

### Database Changes

#### New Tables Required

Add to `packages/database/prisma/schema.prisma`:

```prisma
// ============================================================================
// Retailer Integration Models
// ============================================================================

model RetailerConnection {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Retailer identification
  retailer  RetailerType  // INSTACART, HEB, etc.
  enabled   Boolean       @default(true)

  // Preferences
  preferredStore    String?   // Store name or ID
  defaultZipCode    String?   // User's preferred delivery area

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  shoppingLinks ShoppingLink[]

  @@unique([userId, retailer])
  @@index([userId])
  @@map("retailer_connections")
}

enum RetailerType {
  INSTACART
  HEB
}

model ShoppingLink {
  id           String   @id @default(cuid())
  mealPlanId   String
  mealPlan     MealPlan @relation(fields: [mealPlanId], references: [id], onDelete: Cascade)

  // Connection reference
  retailerConnectionId String
  retailerConnection   RetailerConnection @relation(fields: [retailerConnectionId], references: [id])

  // Link details
  url       String    @db.Text
  title     String
  itemCount Int

  // Tracking
  clickCount    Int       @default(0)
  lastClickedAt DateTime?
  expiresAt     DateTime?

  // Timestamps
  createdAt DateTime @default(now())

  @@index([mealPlanId])
  @@index([retailerConnectionId])
  @@map("shopping_links")
}

model InstacartToken {
  id          String   @id @default(cuid())

  // Token data
  accessToken String   @db.Text
  expiresAt   DateTime

  // Single row table pattern (application-level token)
  singleton   Boolean  @default(true) @unique

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("instacart_tokens")
}
```

#### User Model Extension

Add to existing User model:

```prisma
model User {
  // ... existing fields ...

  // Retailer connections
  retailerConnections RetailerConnection[]

  // ... existing relations ...
}
```

#### MealPlan Model Extension

Add to existing MealPlan model:

```prisma
model MealPlan {
  // ... existing fields ...

  // Shopping links
  shoppingLinks ShoppingLink[]

  // ... existing relations ...
}
```

### API Endpoints

#### Shopping Link Generation

**POST `/api/meal-plans/[id]/shopping-link`**

Creates an Instacart shopping link for a meal plan.

```typescript
// Route: apps/web/app/api/meal-plans/[id]/shopping-link/route.ts

interface ShoppingLinkRequest {
  retailer: 'INSTACART' | 'HEB';
  zipCode?: string;  // Override user's default
}

interface ShoppingLinkResponse {
  success: boolean;
  link?: {
    id: string;
    url: string;
    title: string;
    itemCount: number;
    expiresAt: string;
    retailer: string;
  };
  error?: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ShoppingLinkResponse>> {
  // 1. Authenticate user
  // 2. Validate meal plan ownership
  // 3. Extract shopping list from meal plan
  // 4. Transform to Instacart format
  // 5. Call Instacart connector
  // 6. Store link in database
  // 7. Return link to client
}
```

#### Retailer Preferences

**GET/PUT `/api/user/retailer-preferences`**

Manage user's retailer connection preferences.

```typescript
// Route: apps/web/app/api/user/retailer-preferences/route.ts

interface RetailerPreferences {
  instacart?: {
    enabled: boolean;
    preferredStore?: string;
    defaultZipCode?: string;
  };
  heb?: {
    enabled: boolean;
    // HEB-specific preferences
  };
}
```

#### Shopping Link Tracking

**POST `/api/shopping-links/[id]/click`**

Track when users click shopping links for analytics.

```typescript
// Route: apps/web/app/api/shopping-links/[id]/click/route.ts

// Increments click count and redirects to actual URL
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Objective**: Establish core infrastructure and connector skeleton

#### Tasks

1. **Database Schema Updates**
   - Create migration for RetailerConnection, ShoppingLink, InstacartToken tables
   - Add relations to User and MealPlan models
   - Run migration and update Prisma client

2. **Connector Interface Definition**
   - Create `instacart.interface.ts` following HEB pattern
   - Define all type interfaces
   - Export from package index

3. **Environment Configuration**
   - Add Instacart env vars to `.env.example`
   - Document required credentials
   - Add validation in startup

4. **Basic Connector Implementation**
   - Implement `InstacartConnector` class
   - OAuth token management
   - Basic error handling

#### Deliverables
- Database schema ready
- Interface definitions complete
- Basic connector compiling

#### Verification
```bash
pnpm db:migrate
pnpm build
```

### Phase 2: Core Integration (Week 3-4)

**Objective**: Complete working integration with Public API

#### Tasks

1. **Shopping Item Transformation**
   - Implement `ShoppingItemMapper`
   - Parse amounts to quantity/unit
   - Handle edge cases (ranges, fractions)

2. **API Endpoint Implementation**
   - Create `/api/meal-plans/[id]/shopping-link` route
   - Implement authentication/authorization
   - Connect to Instacart connector

3. **Token Management Service**
   - Implement token caching in database
   - Proactive token refresh
   - Handle token expiration gracefully

4. **Rate Limit Handling**
   - Implement request queuing
   - Track rate limit headers
   - Exponential backoff retry logic

#### Deliverables
- Working shopping link generation
- Token management operational
- Rate limiting implemented

#### Verification
```bash
# Integration test
curl -X POST http://localhost:3000/api/meal-plans/[id]/shopping-link \
  -H "Authorization: Bearer ..." \
  -d '{"retailer": "INSTACART"}'
```

### Phase 3: User Experience (Week 5-6)

**Objective**: Build frontend integration and user preferences

#### Tasks

1. **Retailer Preferences UI**
   - Add retailer settings to user preferences page
   - Enable/disable retailers
   - Zip code configuration

2. **Meal Plan UI Integration**
   - Add "Order Ingredients" button to meal plan view
   - Loading states during link generation
   - Error handling with retry option

3. **Shopping Link Management**
   - Display existing links for meal plan
   - Link expiration indicators
   - Regenerate expired links

4. **Click Tracking**
   - Implement click tracking endpoint
   - Analytics dashboard (optional)

#### Deliverables
- User preferences UI
- Order button integration
- Click tracking operational

### Phase 4: Production Hardening (Week 7-8)

**Objective**: Prepare for production deployment

#### Tasks

1. **Error Handling Enhancement**
   - Comprehensive error messages
   - User-friendly error displays
   - Admin error notifications

2. **Monitoring & Logging**
   - Request/response logging
   - Error rate monitoring
   - Rate limit alerting

3. **Testing**
   - Unit tests for connector
   - Integration tests for API
   - E2E tests for user flows

4. **Documentation**
   - API documentation
   - User guide
   - Troubleshooting guide

#### Deliverables
- Production-ready integration
- Full test coverage
- Complete documentation

---

## Edge Cases

### Token Expiration

**Scenario**: Access token expires during request or between requests

**Handling Strategy**:

```typescript
class TokenManager {
  private token: string | null = null;
  private expiresAt: Date | null = null;
  private refreshPromise: Promise<void> | null = null;

  async getValidToken(): Promise<string> {
    // Check if refresh is needed (1 hour buffer)
    const bufferMs = 60 * 60 * 1000;
    const needsRefresh = !this.token ||
      !this.expiresAt ||
      Date.now() > this.expiresAt.getTime() - bufferMs;

    if (needsRefresh) {
      // Prevent concurrent refresh attempts
      if (!this.refreshPromise) {
        this.refreshPromise = this.doRefresh();
      }
      await this.refreshPromise;
      this.refreshPromise = null;
    }

    return this.token!;
  }

  private async doRefresh(): Promise<void> {
    try {
      const response = await fetchNewToken();
      this.token = response.access_token;
      this.expiresAt = new Date(Date.now() + response.expires_in * 1000);
    } catch (error) {
      // Clear state on failure
      this.token = null;
      this.expiresAt = null;
      throw error;
    }
  }
}
```

**Recovery Scenarios**:

| Scenario | Action |
|----------|--------|
| Token expired during request | Refresh token, retry request once |
| Refresh fails (network) | Exponential backoff, max 3 attempts |
| Refresh fails (credentials) | Alert admin, disable integration temporarily |

### Product Matching Failures

**Scenario**: Instacart cannot find matching products for some items

**Handling Strategy**:

Since Public API returns URLs without product matching feedback, we handle this proactively:

1. **Pre-processing Items**
   ```typescript
   function normalizeIngredient(item: ShoppingItem): InstacartLineItem {
     return {
       name: simplifyName(item.item),      // Remove brand specifics
       quantity: parseQuantity(item.amount),
       unit: parseUnit(item.amount),
     };
   }

   function simplifyName(name: string): string {
     // Remove preparation notes: "chicken breast, diced" -> "chicken breast"
     // Remove brand names: "Kraft cheddar" -> "cheddar cheese"
     // Normalize common variations
   }
   ```

2. **Fallback Item Names**
   ```typescript
   const itemVariations = {
     "chicken thigh": ["chicken thigh", "boneless chicken thigh", "chicken leg quarters"],
     "heavy cream": ["heavy cream", "heavy whipping cream", "whipping cream"],
   };
   ```

3. **User Notification**
   - Display item count in shopping link
   - Note that some items may need manual search on Instacart

### Regional Availability

**Scenario**: User is outside US/Canada where Instacart operates

**Handling Strategy**:

1. **Detection**
   ```typescript
   async function checkRegionalAvailability(zipCode: string): Promise<{
     available: boolean;
     reason?: string;
     alternatives?: string[];
   }> {
     // Instacart covers US and Canada
     const isUSZip = /^\d{5}(-\d{4})?$/.test(zipCode);
     const isCanadaPostal = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zipCode);

     if (!isUSZip && !isCanadaPostal) {
       return {
         available: false,
         reason: 'Instacart is only available in the US and Canada',
         alternatives: ['HEB (Texas only)'],
       };
     }

     // Could also check specific coverage via Instacart's store availability
     return { available: true };
   }
   ```

2. **User Interface**
   - Show availability status in retailer preferences
   - Suggest alternatives (HEB for Texas users)
   - Clear messaging about regional limitations

3. **Graceful Degradation**
   - If Instacart unavailable, check other enabled retailers
   - Fall back to simple ingredient list display
   - Link to generic grocery search

### Account Linking Failures (Future - Partner API)

**Scenario**: OAuth account linking fails during user authentication

**Handling Strategy**:

```typescript
enum AccountLinkErrorCode {
  USER_CANCELLED = 'user_cancelled',
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_EXISTS = 'account_exists',
  NETWORK_ERROR = 'network_error',
  UNKNOWN = 'unknown',
}

interface AccountLinkError {
  code: AccountLinkErrorCode;
  message: string;
  recoverable: boolean;
  retryable: boolean;
}

const errorHandlers: Record<AccountLinkErrorCode, AccountLinkError> = {
  user_cancelled: {
    code: 'user_cancelled',
    message: 'You cancelled the connection. You can try again anytime.',
    recoverable: true,
    retryable: true,
  },
  invalid_credentials: {
    code: 'invalid_credentials',
    message: 'Unable to verify your Instacart account. Please check your credentials.',
    recoverable: true,
    retryable: true,
  },
  account_exists: {
    code: 'account_exists',
    message: 'This Instacart account is already linked to another user.',
    recoverable: false,
    retryable: false,
  },
  // ...
};
```

---

## Risks and Mitigations

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits exceeded | Medium | Medium | Request queuing, caching, exponential backoff |
| Token refresh failures | Low | High | Proactive refresh, multiple retry attempts, alerting |
| Instacart API changes | Medium | High | Abstract connector interface, version pinning |
| Network timeouts | Medium | Low | Configurable timeouts, retry logic |
| Invalid API credentials | Low | High | Validation on startup, admin alerts |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API access revocation | Low | Critical | Comply with ToS, maintain good standing |
| Partner API rejection | Medium | Medium | Build solid Public API MVP first |
| Regional expansion limitations | Low | Low | Document limitations, plan alternatives |
| Affiliate program changes | Low | Medium | Don't depend on affiliate revenue |

### Security Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API credentials exposure | Low | Critical | Environment variables, never in code |
| Token theft | Low | Medium | HTTPS only, secure token storage |
| Shopping link enumeration | Medium | Low | Rate limiting, obfuscated link IDs |

### Monitoring Plan

```typescript
interface InstacartMetrics {
  // Request metrics
  requestCount: number;
  errorCount: number;
  averageLatency: number;

  // Rate limiting
  rateLimitHits: number;
  currentQuotaRemaining: number;

  // Token health
  tokenRefreshCount: number;
  tokenRefreshErrors: number;
  tokenExpiresIn: number;

  // Business metrics
  linksGenerated: number;
  linksClicked: number;
  conversionRate: number;
}
```

---

## Task Breakdown

### Implementation Tickets

#### Phase 1: Foundation

| ID | Task | Estimate | Dependencies |
|----|------|----------|--------------|
| IC-001 | Create Instacart connector interface definitions | 2h | None |
| IC-002 | Add database migration for retailer tables | 3h | None |
| IC-003 | Implement basic InstacartConnector class | 4h | IC-001 |
| IC-004 | Add Instacart environment variables | 1h | None |
| IC-005 | Create InstacartToken database service | 2h | IC-002 |

#### Phase 2: Core Integration

| ID | Task | Estimate | Dependencies |
|----|------|----------|--------------|
| IC-006 | Implement OAuth token management | 4h | IC-003, IC-005 |
| IC-007 | Implement ShoppingItemMapper | 3h | IC-001 |
| IC-008 | Create POST /api/meal-plans/[id]/shopping-link endpoint | 4h | IC-006, IC-007 |
| IC-009 | Implement rate limiting and retry logic | 3h | IC-003 |
| IC-010 | Add shopping link storage and retrieval | 2h | IC-002, IC-008 |

#### Phase 3: User Experience

| ID | Task | Estimate | Dependencies |
|----|------|----------|--------------|
| IC-011 | Create retailer preferences settings UI | 4h | IC-002 |
| IC-012 | Add "Order Ingredients" button to meal plan view | 3h | IC-008 |
| IC-013 | Implement shopping link click tracking | 2h | IC-010 |
| IC-014 | Add loading states and error handling UI | 3h | IC-012 |
| IC-015 | Display existing shopping links with status | 2h | IC-010 |

#### Phase 4: Production Hardening

| ID | Task | Estimate | Dependencies |
|----|------|----------|--------------|
| IC-016 | Write unit tests for InstacartConnector | 4h | IC-003 |
| IC-017 | Write integration tests for API endpoints | 4h | IC-008, IC-010 |
| IC-018 | Write E2E tests for shopping link flow | 4h | IC-012 |
| IC-019 | Add monitoring and alerting | 3h | IC-009 |
| IC-020 | Write user documentation | 2h | All |

### Total Estimated Effort

| Phase | Tasks | Estimated Hours |
|-------|-------|-----------------|
| Phase 1 | 5 | 12 hours |
| Phase 2 | 5 | 16 hours |
| Phase 3 | 5 | 14 hours |
| Phase 4 | 5 | 17 hours |
| **Total** | **20** | **59 hours** |

### Recommended Sprint Allocation

| Sprint | Focus | Tasks |
|--------|-------|-------|
| Sprint 1 | Foundation | IC-001 through IC-005 |
| Sprint 2 | Core API | IC-006 through IC-010 |
| Sprint 3 | User Experience | IC-011 through IC-015 |
| Sprint 4 | Testing & Launch | IC-016 through IC-020 |

---

## References

### Instacart Developer Documentation

- **Developer Portal**: https://developer.instacart.com/
- **API Documentation**: https://developer.instacart.com/docs
- **Getting Started Guide**: https://developer.instacart.com/docs/getting-started
- **Products Link API**: https://developer.instacart.com/docs/api-reference/products-link
- **Authentication Guide**: https://developer.instacart.com/docs/authentication

### Internal References

- **HEB Connector Pattern**: `packages/core/src/connectors/heb.interface.ts`
- **HEB Implementation**: `packages/core/src/connectors/heb.ts`
- **Type Definitions**: `packages/core/src/types/index.ts`
- **Database Schema**: `packages/database/prisma/schema.prisma`
- **Auth Configuration**: `apps/web/lib/auth.ts`

### Related Technologies

- **OAuth 2.0 Specification**: https://oauth.net/2/
- **NextAuth.js Documentation**: https://next-auth.js.org/
- **Prisma Documentation**: https://www.prisma.io/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

### Code Examples

- **Similar Integration Pattern**: HEB scraping connector shows similar interface pattern
- **Token Management**: NextAuth token handling for reference

---

## Appendix A: API Request/Response Examples

### Create Products Link

**Request:**
```bash
curl -X POST https://connect.instacart.com/idp/v1/products/products_link \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Weekly Meal Plan - January 28, 2026",
    "line_items": [
      {
        "name": "chicken breast",
        "quantity": 2,
        "unit": "lb"
      },
      {
        "name": "brown rice",
        "quantity": 1,
        "unit": "bag",
        "filters": {
          "organic": true
        }
      },
      {
        "name": "broccoli",
        "quantity": 2,
        "unit": "head"
      }
    ],
    "landing_page_configuration": {
      "partner_linkback_url": "https://mealplanner.app/meal-plans/abc123"
    }
  }'
```

**Response:**
```json
{
  "products_link_url": "https://www.instacart.com/store/partner/abc123?items=..."
}
```

### OAuth Token Request

**Request:**
```bash
curl -X POST https://connect.instacart.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "created_at": 1706486400
}
```

---

## Appendix B: ShoppingItem to InstacartLineItem Mapping

### Transformation Logic

```typescript
// Input from Meal Planner
const shoppingItems: ShoppingItem[] = [
  { item: "boneless skinless chicken breast", amount: "2 lbs", category: "protein" },
  { item: "jasmine rice", amount: "1 bag", category: "grains" },
  { item: "fresh broccoli florets", amount: "2 cups" },
  { item: "low-sodium soy sauce", amount: "1/4 cup" },
  { item: "garlic cloves", amount: "4" },
];

// Output for Instacart API
const instacartLineItems: InstacartLineItem[] = [
  { name: "chicken breast boneless skinless", quantity: 2, unit: "lb" },
  { name: "jasmine rice", quantity: 1, unit: "bag" },
  { name: "broccoli florets", quantity: 2, unit: "cup" },
  { name: "soy sauce low sodium", quantity: 1 },  // Quantity normalized to 1 for liquid ingredients
  { name: "garlic", quantity: 4 },  // Unit omitted for count items
];
```

### Amount Parsing Rules

| Input Format | Parsed Quantity | Parsed Unit |
|--------------|-----------------|-------------|
| "2 lbs" | 2 | "lb" |
| "1/2 cup" | 0.5 | "cup" |
| "3-4 pieces" | 4 | undefined |
| "to taste" | 1 | undefined |
| "1 (14 oz) can" | 1 | "can" |
| "2 cups, divided" | 2 | "cup" |

### Ingredient Name Normalization

| Original Name | Normalized Name |
|---------------|-----------------|
| "boneless skinless chicken breast" | "chicken breast boneless skinless" |
| "fresh broccoli florets" | "broccoli florets" |
| "low-sodium soy sauce" | "soy sauce low sodium" |
| "garlic cloves, minced" | "garlic" |
| "extra-virgin olive oil" | "olive oil extra virgin" |

---

## Appendix C: Error Code Reference

### Instacart API Errors

| Code | HTTP Status | Description | Retry Strategy |
|------|-------------|-------------|----------------|
| `invalid_token` | 401 | Token is invalid or expired | Refresh token, retry |
| `rate_limit_exceeded` | 429 | Too many requests | Wait for Retry-After, retry |
| `invalid_request` | 400 | Malformed request body | Fix request, don't retry |
| `server_error` | 500 | Internal server error | Exponential backoff, max 3 retries |
| `service_unavailable` | 503 | Service temporarily unavailable | Exponential backoff, max 3 retries |

### Application Error Codes

| Code | Description | User Message |
|------|-------------|--------------|
| `INSTACART_NOT_CONFIGURED` | Missing API credentials | "Instacart integration is not configured" |
| `REGION_NOT_SUPPORTED` | User outside US/Canada | "Instacart is not available in your region" |
| `EMPTY_SHOPPING_LIST` | No items to add | "No ingredients found in this meal plan" |
| `LINK_GENERATION_FAILED` | API call failed after retries | "Unable to generate shopping link. Please try again." |
| `TOKEN_REFRESH_FAILED` | Cannot get new token | "Connection to Instacart unavailable" |

---

*Document created: January 28, 2026*
*Last updated: January 28, 2026*
*Version: 1.0.0*
