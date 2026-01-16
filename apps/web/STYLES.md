# Style System Documentation

Welcome to the Meal Planner style system! This document provides a comprehensive reference for design tokens, component variants, and usage patterns to ensure consistency across the application.

## Table of Contents

- [Overview](#overview)
- [Design Tokens](#design-tokens)
  - [Colors](#colors)
  - [Spacing](#spacing)
  - [Typography](#typography)
  - [Shadows](#shadows)
  - [Borders](#borders)
  - [Transitions](#transitions)
  - [Other Tokens](#other-tokens)
- [Component Variants](#component-variants)
  - [Buttons](#buttons)
  - [Cards](#cards)
  - [Inputs & Forms](#inputs--forms)
  - [Alerts & Messages](#alerts--messages)
  - [Badges & Status](#badges--status)
  - [Modals](#modals)
  - [Layout](#layout)
  - [Typography](#typography-variants)
  - [Nutrition Display](#nutrition-display)
  - [Loading States](#loading-states)
- [Usage Patterns](#usage-patterns)
  - [Basic Usage](#basic-usage)
  - [Combining Variants](#combining-variants)
  - [Conditional Styling](#conditional-styling)
  - [Responsive Design](#responsive-design)
- [Migration Guide](#migration-guide)
  - [Before Migration](#before-migration)
  - [After Migration](#after-migration)
  - [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)

---

## Overview

The Meal Planner style system consists of two primary modules:

1. **Design Tokens** (`lib/styles/tokens.ts`) - Foundational design values (colors, spacing, typography, etc.)
2. **Component Variants** (`lib/styles/variants.ts`) - Pre-built, reusable style classes for common UI patterns

**Benefits:**
- **Consistency**: Unified design language across the entire application
- **Maintainability**: Update styles in one place, apply everywhere
- **Developer Experience**: Type-safe, autocomplete-friendly, easy to use
- **Performance**: No runtime CSS-in-JS overhead, works with Tailwind
- **Reduced Duplication**: 100+ instances of duplicated styles consolidated

---

## Design Tokens

Design tokens are the foundational design values that define the visual language of the application. Import them from `lib/styles/tokens.ts`:

```typescript
import { colors, spacing, typography, shadows, borders, transitions } from '@/lib/styles/tokens';
```

### Colors

The color palette defines all semantic and brand colors used throughout the application.

#### Primary Colors

Our brand identity colors:

```typescript
colors.primary.light    // #5EBFBF - Light teal
colors.primary.DEFAULT  // #3F9BA6 - Primary teal
colors.primary.dark     // #225C73 - Dark teal
```

**Usage:**
- Primary CTAs and buttons
- Navigation highlights
- Interactive elements
- Brand elements

**Tailwind Classes:**
- `bg-primary`, `text-primary`, `border-primary`
- `bg-primary-light`, `text-primary-light`, `border-primary-light`
- `bg-primary-dark`, `text-primary-dark`, `border-primary-dark`

#### Accent Colors

Special emphasis colors:

```typescript
colors.accent.DEFAULT   // #A66A5D - Terracotta
colors.accent.dark      // #8B5A4E - Dark terracotta
```

**Usage:**
- Special CTAs (e.g., "Generate Meal Plan")
- Important highlights
- Featured content

#### Semantic Colors

Feedback and status colors:

```typescript
// Success
colors.success.light    // #f0fdf4
colors.success.DEFAULT  // #22c55e
colors.success.dark     // #16a34a

// Error
colors.error.light      // #fef2f2
colors.error.DEFAULT    // #ef4444
colors.error.dark       // #dc2626

// Warning
colors.warning.light    // #fefce8
colors.warning.DEFAULT  // #eab308
colors.warning.dark     // #ca8a04

// Info
colors.info.light       // #eff6ff
colors.info.DEFAULT     // #3b82f6
colors.info.dark        // #2563eb
```

**Usage:**
- Success messages and confirmations
- Error messages and validation
- Warning notifications
- Informational alerts

#### Gray Scale

Neutral colors for text, borders, and backgrounds:

```typescript
colors.gray[50]   // #f9fafb - Lightest
colors.gray[100]  // #f3f4f6
colors.gray[200]  // #e5e7eb
colors.gray[300]  // #d1d5db
colors.gray[400]  // #9ca3af
colors.gray[500]  // #6b7280
colors.gray[600]  // #4b5563
colors.gray[700]  // #374151
colors.gray[800]  // #1f2937
colors.gray[900]  // #111827 - Darkest
```

**Usage:**
- Text colors (gray-700 for body, gray-500 for secondary)
- Borders (gray-200, gray-300)
- Backgrounds (gray-50, gray-100)
- Disabled states (gray-400)

#### Nutrition Colors

Special colors for nutrition information display:

```typescript
colors.nutrition.calories  // #3b82f6 - Blue
colors.nutrition.protein   // #a855f7 - Purple
colors.nutrition.carbs     // #eab308 - Yellow
colors.nutrition.fat       // #ef4444 - Red
colors.nutrition.fiber     // #22c55e - Green
```

**Usage:**
- Nutrition information cards
- Meal macronutrient displays
- Charts and graphs

---

### Spacing

Spacing tokens provide consistent padding, margin, and gap values.

#### Basic Spacing

```typescript
spacing.xs   // 0.25rem (4px)
spacing.sm   // 0.5rem  (8px)
spacing.md   // 0.75rem (12px)
spacing.lg   // 1rem    (16px)
spacing.xl   // 1.5rem  (24px)
spacing['2xl'] // 2rem  (32px)
spacing['3xl'] // 3rem  (48px)
spacing['4xl'] // 4rem  (64px)
spacing['5xl'] // 6rem  (96px)
spacing['6xl'] // 8rem  (128px)
```

#### Gap Spacing

For flex and grid gaps:

```typescript
gaps.xs  // 0.5rem  (8px)  - gap-2
gaps.sm  // 0.75rem (12px) - gap-3
gaps.md  // 1rem    (16px) - gap-4
gaps.lg  // 1.5rem  (24px) - gap-6
gaps.xl  // 2rem    (32px) - gap-8
```

#### Vertical Spacing

For `space-y-*` classes:

```typescript
spaceY.xs  // 1rem   (16px) - space-y-4
spaceY.sm  // 1.5rem (24px) - space-y-6
spaceY.md  // 2rem   (32px) - space-y-8
spaceY.lg  // 3rem   (48px) - space-y-12
```

**Usage Example:**
```tsx
// Using with Tailwind
<div className="p-6 space-y-6 gap-4">
  {/* Content */}
</div>

// Programmatic usage
<div style={{ padding: spacing.lg, gap: gaps.md }}>
  {/* Content */}
</div>
```

---

### Typography

Typography tokens define font sizes, weights, and line heights.

#### Font Sizes

```typescript
typography.fontSize.xs     // 0.75rem   (12px)
typography.fontSize.sm     // 0.875rem  (14px)
typography.fontSize.base   // 1rem      (16px)
typography.fontSize.lg     // 1.125rem  (18px)
typography.fontSize.xl     // 1.25rem   (20px)
typography.fontSize['2xl'] // 1.5rem    (24px)
typography.fontSize['3xl'] // 1.875rem  (30px)
typography.fontSize['4xl'] // 2.25rem   (36px)
```

#### Font Weights

```typescript
typography.fontWeight.normal    // 400
typography.fontWeight.medium    // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700
```

#### Line Heights

```typescript
typography.lineHeight.tight    // 1.25
typography.lineHeight.normal   // 1.5
typography.lineHeight.relaxed  // 1.75
```

**Usage Guidelines:**
- **Headings**: Use 2xl-4xl with bold or semibold weight
- **Body Text**: Use base size with normal weight
- **Small Text**: Use sm or xs for secondary information
- **Line Height**: Use tight for headings, normal for body, relaxed for long-form content

---

### Shadows

Shadow tokens for depth and elevation.

```typescript
shadows.sm      // Subtle shadow for slight elevation
shadows.DEFAULT // Standard shadow for cards
shadows.md      // Medium shadow for elevated cards
shadows.lg      // Large shadow for modals
shadows.xl      // Extra large shadow for special emphasis
shadows['2xl']  // Maximum shadow for popovers
shadows.inner   // Inner shadow for inset effects
shadows.none    // No shadow
```

**Elevation Hierarchy:**
1. **Base (no shadow)**: Flat UI elements, backgrounds
2. **sm/DEFAULT**: Cards, buttons at rest
3. **md/lg**: Hover states, elevated content
4. **xl/2xl**: Modals, dropdowns, popovers

---

### Borders

Border tokens for widths, radii, and colors.

#### Border Widths

```typescript
borders.width.DEFAULT  // 1px
borders.width[0]       // 0px
borders.width[2]       // 2px
borders.width[4]       // 4px
borders.width[8]       // 8px
```

#### Border Radius

```typescript
borders.radius.none    // 0
borders.radius.sm      // 0.125rem  (2px)
borders.radius.DEFAULT // 0.25rem   (4px)
borders.radius.md      // 0.375rem  (6px)
borders.radius.lg      // 0.5rem    (8px)
borders.radius.xl      // 0.75rem   (12px)
borders.radius['2xl']  // 1rem      (16px)
borders.radius['3xl']  // 1.5rem    (24px)
borders.radius.full    // 9999px (circular)
```

**Common Usage:**
- **Buttons**: `rounded-lg` (8px)
- **Cards**: `rounded-2xl` (16px) or `rounded-lg` (8px)
- **Inputs**: `rounded-lg` (8px)
- **Badges**: `rounded-full` (circular)

#### Border Colors

```typescript
// Gray borders
borders.colors.gray.light    // #e5e7eb (border-gray-200)
borders.colors.gray.DEFAULT  // #d1d5db (border-gray-300)
borders.colors.gray.dark     // #9ca3af (border-gray-400)

// Semantic borders
borders.colors.primary.light   // #5EBFBF
borders.colors.primary.DEFAULT // #3F9BA6
borders.colors.success         // #bbf7d0 (border-green-200)
borders.colors.error           // #fecaca (border-red-200)
borders.colors.warning         // #fef08a (border-yellow-200)
borders.colors.info            // #bfdbfe (border-blue-200)
```

---

### Transitions

Animation and transition timing values.

#### Duration

```typescript
transitions.duration.fast    // 150ms - Quick interactions
transitions.duration.DEFAULT // 200ms - Standard transitions
transitions.duration.slow    // 300ms - Slower, emphasized transitions
```

#### Timing Functions

```typescript
transitions.timing.DEFAULT  // ease-in-out - Standard easing
transitions.timing.in       // ease-in - Accelerating
transitions.timing.out      // ease-out - Decelerating
transitions.timing.linear   // linear - Constant speed
```

**Usage:**
```css
transition-all duration-150    /* Fast */
transition-all duration-200    /* Default */
transition-colors              /* Color transitions only */
```

---

### Other Tokens

#### Opacities

```typescript
opacities[0]   // 0
opacities[10]  // 0.1
opacities[20]  // 0.2
opacities[50]  // 0.5
opacities[75]  // 0.75
opacities[100] // 1
```

#### Z-Index

```typescript
zIndex[0]    // 0
zIndex[10]   // 10
zIndex[20]   // 20
zIndex[30]   // 30
zIndex[40]   // 40
zIndex[50]   // 50
zIndex.auto  // auto
```

#### Breakpoints

```typescript
breakpoints.sm    // 640px
breakpoints.md    // 768px
breakpoints.lg    // 1024px
breakpoints.xl    // 1280px
breakpoints['2xl'] // 1536px
```

#### Max Widths

```typescript
maxWidth.xs       // 20rem (320px)
maxWidth.sm       // 24rem (384px)
maxWidth.md       // 28rem (448px)
maxWidth.lg       // 32rem (512px)
maxWidth.xl       // 36rem (576px)
maxWidth['2xl']   // 42rem (672px)
maxWidth['3xl']   // 48rem (768px)
maxWidth['4xl']   // 56rem (896px)
maxWidth['5xl']   // 64rem (1024px)
maxWidth['6xl']   // 72rem (1152px)
maxWidth['7xl']   // 80rem (1280px)
maxWidth.full     // 100%
maxWidth.screen   // 100vw
```

---

## Component Variants

Component variants are pre-built style class combinations for common UI patterns. Import them from `lib/styles/variants.ts`:

```typescript
import { buttonVariants, cardVariants, inputVariants } from '@/lib/styles/variants';
```

### Buttons

Button variants cover all common button patterns used throughout the application.

#### Primary Button

**Variant:** `buttonVariants.primary`

Main CTAs, submit buttons, primary actions.

```tsx
<button className={buttonVariants.primary}>
  Submit
</button>
```

**Visual:** Gradient background (primary → primary-dark), white text, semibold font, shadow with hover effect, disabled states.

**Usage:** 15+ occurrences across the app.

#### Primary Button with Icon

**Variant:** `buttonVariants.primaryWithIcon`

Same as primary but with inline-flex for icon support.

```tsx
<button className={buttonVariants.primaryWithIcon}>
  <SparklesIcon className="h-5 w-5" />
  Generate Plan
</button>
```

#### Secondary Button

**Variant:** `buttonVariants.secondary`

Cancel actions, secondary options, less emphasized actions.

```tsx
<button className={buttonVariants.secondary}>
  Cancel
</button>
```

**Visual:** Bordered with gray, subtle hover effect, medium font weight.

**Usage:** 12+ occurrences.

#### Outline Button

**Variant:** `buttonVariants.outline`

Edit, view, and action buttons on cards.

```tsx
<button className={buttonVariants.outline}>
  Edit
</button>
```

**Visual:** Primary-colored border and text, fills with primary color on hover.

**Usage:** 8+ occurrences.

#### Outline Destructive Button

**Variant:** `buttonVariants.outlineDestructive`

Delete, remove, and other destructive actions.

```tsx
<button className={buttonVariants.outlineDestructive}>
  Delete
</button>
```

**Visual:** Red-colored border and text, red background on hover.

#### Ghost/Link Button

**Variant:** `buttonVariants.ghost`

Inline links, text-only navigation links.

```tsx
<button className={buttonVariants.ghost}>
  View Details
</button>
```

**Visual:** Text only, primary color, darker on hover.

**Usage:** 6+ occurrences.

#### Accent Button

**Variant:** `buttonVariants.accent`

Special CTAs like meal plan generation.

```tsx
<button className={buttonVariants.accent}>
  <SparklesIcon className="h-5 w-5" />
  Generate Meal Plan
</button>
```

**Visual:** Gradient background (accent colors), white text, shadow with hover effect.

**Usage:** 2 occurrences.

#### Navigation Buttons

**Variants:**
- `buttonVariants.navActive` - Active navigation link
- `buttonVariants.navInactive` - Inactive navigation link
- `buttonVariants.signOut` - Sign out button in navigation

```tsx
<Link
  href="/dashboard"
  className={pathname === '/dashboard' ? buttonVariants.navActive : buttonVariants.navInactive}
>
  Dashboard
</Link>

<button className={buttonVariants.signOut}>
  <ArrowRightOnRectangleIcon className="h-5 w-5" />
  Sign Out
</button>
```

---

### Cards

Card variants for various container types and layouts.

#### Default Card

**Variants:**
- `cardVariants.default` - Basic card
- `cardVariants.defaultWithPadding` - Card with padding

Main content containers, forms, sections.

```tsx
<div className={cardVariants.default}>
  {/* Content */}
</div>

<div className={cardVariants.defaultWithPadding}>
  {/* Content with padding */}
</div>
```

**Visual:** White background, large shadow, rounded corners (2xl).

**Usage:** 18+ occurrences.

#### Bordered Card

**Variants:**
- `cardVariants.bordered` - Basic bordered card
- `cardVariants.borderedHover` - With hover effect

List items, member cards, secondary containers.

```tsx
<div className={cardVariants.bordered}>
  {/* Content */}
</div>

<div className={cardVariants.borderedHover}>
  {/* Content with hover effect */}
</div>
```

**Visual:** White background, gray border, rounded corners (lg), optional hover effect.

**Usage:** 8+ occurrences.

#### Gradient Stat Cards

**Variants:**
- `cardVariants.gradientStat` - Primary gradient
- `cardVariants.gradientStatLight` - Light gradient
- `cardVariants.gradientStatAccent` - Accent gradient

Dashboard statistics, metrics display.

```tsx
<div className={cardVariants.gradientStat}>
  <div className="p-6">
    {/* Stat content */}
  </div>
</div>
```

**Visual:** Gradient background, rounded corners, shadow, hover scale effect.

**Usage:** 3+ occurrences.

#### Card Headers

**Variants:**
- `cardVariants.headerGradient` - Gradient header
- `cardVariants.headerSubtle` - Subtle header

Section headers, emphasized card titles.

```tsx
<div className={cardVariants.default}>
  <div className={cardVariants.headerGradient}>
    <h2 className="text-xl font-bold text-white">Section Title</h2>
  </div>
  <div className="p-6">
    {/* Content */}
  </div>
</div>
```

**Usage:** 12+ occurrences.

#### List Items

**Variants:**
- `cardVariants.listItem` - Primary list item
- `cardVariants.listItemGray` - Gray hover variant

Meal plan lists, data tables, repeating items.

```tsx
<ul>
  <li className={cardVariants.listItem}>
    {/* List item content */}
  </li>
</ul>
```

**Usage:** 8+ occurrences.

#### Icon Containers

**Variants:**
- `cardVariants.iconContainer` - Standard size
- `cardVariants.iconContainerLarge` - Large size
- `cardVariants.iconContainerLight` - Light variant for dark backgrounds

Icons within stat cards, headers.

```tsx
<div className={cardVariants.iconContainer}>
  <SparklesIcon className="h-5 w-5 text-white" />
</div>
```

**Usage:** 15+ occurrences.

---

### Inputs & Forms

Input and form element style variants.

#### Text Inputs

**Variants:**
- `inputVariants.default` - Standard input
- `inputVariants.extended` - Extended with more styling

All form inputs, text fields, email, password.

```tsx
<input
  type="text"
  className={inputVariants.default}
  placeholder="Enter text"
/>
```

**Visual:** Full width, border, rounded corners, focus ring with primary color.

**Usage:** 25+ occurrences.

#### Select/Dropdown

**Variant:** `inputVariants.select`

Day selection, time selection, schedule settings.

```tsx
<select className={inputVariants.select}>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

**Usage:** 6+ occurrences.

#### Labels

**Variants:**
- `inputVariants.label` - Standard label
- `inputVariants.labelCompact` - Less margin

Form field labels.

```tsx
<label className={inputVariants.label}>
  Email Address
</label>
<input type="email" className={inputVariants.default} />
```

**Usage:** 20+ occurrences.

#### Help Text

**Variants:**
- `inputVariants.helpText` - Extra small help text
- `inputVariants.helpTextSmall` - Small help text

Field hints, descriptions, notes.

```tsx
<input type="password" className={inputVariants.default} />
<p className={inputVariants.helpText}>
  Must be at least 8 characters
</p>
```

**Usage:** 15+ occurrences.

---

### Alerts & Messages

Alert and notification message variants.

#### Alert Types

**Variants:**
- `alertVariants.success` - Success messages
- `alertVariants.error` - Error messages
- `alertVariants.info` - Informational messages
- `alertVariants.warning` - Warning messages

```tsx
<div className={alertVariants.success}>
  <div className="flex">
    <CheckCircleIcon className={alertVariants.iconSuccess} />
    <p className={alertVariants.textSuccess}>
      Successfully saved!
    </p>
  </div>
</div>
```

**Usage:** 22+ occurrences across all alert types.

#### Alert Components

Each alert type has corresponding icon and text styles:

**Icon Variants:**
- `alertVariants.iconSuccess`
- `alertVariants.iconError`
- `alertVariants.iconInfo`
- `alertVariants.iconWarning`

**Text Variants:**
- `alertVariants.textSuccess`
- `alertVariants.textError`
- `alertVariants.textInfo`
- `alertVariants.textWarning`

---

### Badges & Status

Badge and status indicator variants.

#### Status Badges

Status badges for meal plan states:

**Variants:**
- `badgeVariants.statusPending` - Pending state (yellow)
- `badgeVariants.statusProcessing` - Processing state (primary)
- `badgeVariants.statusCompleted` - Completed state (green)
- `badgeVariants.statusFailed` - Failed state (red)
- `badgeVariants.statusCancelled` - Cancelled state (gray)

```tsx
<span className={badgeVariants.statusCompleted}>
  Completed
</span>
```

**Usage:** 10+ occurrences.

#### Role Badges

**Variants:**
- `badgeVariants.roleOwner` - Household owner (purple)
- `badgeVariants.roleMember` - Household member (blue)

```tsx
<span className={badgeVariants.roleOwner}>
  Owner
</span>
```

**Usage:** 2+ occurrences.

#### Dietary Tags

**Variant:** `badgeVariants.dietaryTag`

Dietary restrictions and preferences.

```tsx
<span className={badgeVariants.dietaryTag}>
  <XMarkIcon className="h-4 w-4" />
  Gluten Free
</span>
```

**Usage:** 4+ occurrences.

---

### Modals

Modal and dialog style variants.

#### Modal Structure

```tsx
<div className={modalVariants.backdrop}>
  <div className={modalVariants.container}>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className={modalVariants.header}>
          Modal Title
        </h2>
        <button className={modalVariants.closeButton}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      {/* Modal content */}
    </div>
  </div>
</div>
```

**Variants:**
- `modalVariants.backdrop` - Overlay background
- `modalVariants.container` - Modal content wrapper (max-w-lg)
- `modalVariants.containerLarge` - Large modal (max-w-2xl)
- `modalVariants.header` - Modal title
- `modalVariants.closeButton` - Close icon button

**Usage:** 2+ modals currently implemented.

---

### Layout

Common layout and spacing patterns.

#### Page Containers

**Variants:**
- `layoutVariants.pageContainer` - Standard page spacing (space-y-6)
- `layoutVariants.pageContainerLarge` - Larger spacing (space-y-8)

```tsx
<div className={layoutVariants.pageContainer}>
  <h1>Page Title</h1>
  <div>{/* Section 1 */}</div>
  <div>{/* Section 2 */}</div>
</div>
```

**Usage:** 15+ occurrences.

#### Form Containers

**Variants:**
- `layoutVariants.formContainer` - Standard form spacing (space-y-4)
- `layoutVariants.formContainerLarge` - Larger spacing (space-y-6)

```tsx
<form className={layoutVariants.formContainer}>
  <div>{/* Field 1 */}</div>
  <div>{/* Field 2 */}</div>
  <button>Submit</button>
</form>
```

**Usage:** 10+ occurrences.

#### Max Width Container

**Variant:** `layoutVariants.maxWidthContainer`

Dashboard navigation, responsive containers.

```tsx
<div className={layoutVariants.maxWidthContainer}>
  {/* Content constrained to max-width */}
</div>
```

**Usage:** 2+ occurrences.

#### Grids

**Variants:**
- `layoutVariants.grid2Cols` - 2-column responsive grid
- `layoutVariants.grid3Cols` - 3-column responsive grid
- `layoutVariants.grid5Cols` - 5-column grid for stats

```tsx
<div className={layoutVariants.grid3Cols}>
  <div>{/* Item 1 */}</div>
  <div>{/* Item 2 */}</div>
  <div>{/* Item 3 */}</div>
</div>
```

**Usage:** 6+ occurrences.

#### Flex Layouts

**Variants:**
- `layoutVariants.flexBetween` - Space between alignment
- `layoutVariants.flexCenter` - Centered alignment
- `layoutVariants.flexStart` - Start alignment with gap
- `layoutVariants.inlineFlex` - Inline flex items
- `layoutVariants.flexCol` - Vertical flex column

```tsx
<div className={layoutVariants.flexBetween}>
  <h2>Title</h2>
  <button>Action</button>
</div>
```

**Usage:** 25+ occurrences.

---

### Typography Variants

Typography style patterns for headings and text.

#### Page Headings

**Variants:**
- `typographyVariants.pageHeading` - Fixed size heading
- `typographyVariants.pageHeadingResponsive` - Responsive heading

```tsx
<h1 className={typographyVariants.pageHeading}>
  Dashboard
</h1>
```

**Usage:** 15+ occurrences.

#### Section Headings

**Variants:**
- `typographyVariants.sectionHeading` - Bold section heading
- `typographyVariants.sectionHeadingSemibold` - Semibold variant

```tsx
<h2 className={typographyVariants.sectionHeading}>
  Meal Plans
</h2>
```

**Usage:** 12+ occurrences.

#### Descriptive Text

**Variants:**
- `typographyVariants.description` - Standard description
- `typographyVariants.descriptionLight` - Lighter color
- `typographyVariants.descriptionSmall` - Smaller size

```tsx
<p className={typographyVariants.description}>
  This is a description of the section.
</p>
```

**Usage:** 20+ occurrences.

---

### Nutrition Display

Nutrition information display variants.

#### Nutrition Cards

**Variants:**
- `nutritionVariants.baseCard` - Base style
- `nutritionVariants.calories` - Calories card (blue)
- `nutritionVariants.protein` - Protein card (purple)
- `nutritionVariants.carbs` - Carbs card (yellow)
- `nutritionVariants.fat` - Fat card (red)
- `nutritionVariants.fiber` - Fiber card (green)

```tsx
<div className="grid grid-cols-5 gap-2">
  <div className={nutritionVariants.calories}>
    <p className="text-xs text-gray-600">Calories</p>
    <p className={nutritionVariants.caloriesText + " text-lg font-bold"}>
      450
    </p>
  </div>
  {/* Other nutrition cards */}
</div>
```

**Usage:** 5 cards per meal display.

#### Nutrition Text Colors

**Variants:**
- `nutritionVariants.caloriesText`
- `nutritionVariants.proteinText`
- `nutritionVariants.carbsText`
- `nutritionVariants.fatText`
- `nutritionVariants.fiberText`

---

### Loading States

Loading and empty state variants.

#### Loading Spinner

**Variants:**
- `stateVariants.spinner` - Spinner animation
- `stateVariants.spinnerCircle` - Circle element
- `stateVariants.spinnerPath` - Path element

```tsx
<button disabled className={buttonVariants.primary}>
  <svg className={stateVariants.spinner} viewBox="0 0 24 24">
    <circle className={stateVariants.spinnerCircle} cx="12" cy="12" r="10" />
    <path className={stateVariants.spinnerPath} d="..." />
  </svg>
  Loading...
</button>
```

**Usage:** 3+ occurrences.

#### Empty States

**Variants:**
- `stateVariants.emptyContainer` - Container wrapper
- `stateVariants.emptyIcon` - Icon styling
- `stateVariants.emptyHeading` - Heading text
- `stateVariants.emptyDescription` - Description text

```tsx
<div className={stateVariants.emptyContainer}>
  <InboxIcon className={stateVariants.emptyIcon} />
  <h3 className={stateVariants.emptyHeading}>
    No meal plans yet
  </h3>
  <p className={stateVariants.emptyDescription}>
    Get started by creating your first meal plan.
  </p>
</div>
```

**Usage:** 4+ occurrences.

---

## Usage Patterns

### Basic Usage

Import the variants you need and apply them directly to className:

```tsx
import { buttonVariants, cardVariants, inputVariants } from '@/lib/styles/variants';

export function MyComponent() {
  return (
    <div className={cardVariants.default}>
      <div className={cardVariants.headerGradient}>
        <h2 className="text-xl font-bold text-white">Form Title</h2>
      </div>
      <div className="p-6">
        <form className="space-y-4">
          <div>
            <label className={inputVariants.label}>
              Email
            </label>
            <input
              type="email"
              className={inputVariants.default}
            />
          </div>
          <button className={buttonVariants.primary}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### Combining Variants

Use the `cn()` utility function to combine variants with additional classes:

```tsx
import { buttonVariants, cn } from '@/lib/styles/variants';

export function MyButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      className={cn(
        buttonVariants.primary,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={disabled}
    >
      Submit
    </button>
  );
}
```

The `cn()` function filters out falsy values, making conditional styling easy:

```tsx
<div className={cn(
  cardVariants.bordered,
  isActive && "border-primary",
  hasError && "border-red-500"
)}>
  {/* Content */}
</div>
```

---

### Conditional Styling

Apply different variants based on state or props:

```tsx
import { buttonVariants } from '@/lib/styles/variants';

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
};

export function Button({ variant, children }: ButtonProps) {
  return (
    <button className={buttonVariants[variant]}>
      {children}
    </button>
  );
}

// Usage
<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
```

---

### Responsive Design

Combine variants with Tailwind responsive utilities:

```tsx
import { cardVariants, layoutVariants } from '@/lib/styles/variants';

export function ResponsiveLayout() {
  return (
    <div className={cardVariants.defaultWithPadding}>
      {/* Mobile: single column, Desktop: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>{/* Column 1 */}</div>
        <div>{/* Column 2 */}</div>
      </div>

      {/* Use responsive grid variants */}
      <div className={layoutVariants.grid3Cols}>
        {/* Automatically responsive: 1 col -> 2 cols -> 3 cols */}
      </div>
    </div>
  );
}
```

---

## Migration Guide

This guide helps you migrate existing components to use the new style system.

### Before Migration

Before migrating, identify components with duplicated Tailwind classes:

```tsx
// ❌ Before: Duplicated classes
export function OldButton() {
  return (
    <button className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
      Submit
    </button>
  );
}

export function OldCard() {
  return (
    <div className="bg-white shadow-xl rounded-2xl">
      <div className="px-6 py-5 bg-gradient-to-r from-primary-light to-primary border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Card Title</h2>
      </div>
      <div className="p-6">
        {/* Content */}
      </div>
    </div>
  );
}
```

### After Migration

After migrating, use the variant constants:

```tsx
// ✅ After: Using variants
import { buttonVariants, cardVariants, typographyVariants } from '@/lib/styles/variants';

export function NewButton() {
  return (
    <button className={buttonVariants.primary}>
      Submit
    </button>
  );
}

export function NewCard() {
  return (
    <div className={cardVariants.default}>
      <div className={cardVariants.headerGradient}>
        <h2 className={typographyVariants.sectionHeading}>Card Title</h2>
      </div>
      <div className="p-6">
        {/* Content */}
      </div>
    </div>
  );
}
```

**Benefits:**
- 90% reduction in duplicate code
- Type-safe styling (autocomplete, refactoring support)
- Easier to maintain and update styles globally
- Consistent styling across the application

---

### Common Patterns

#### Pattern 1: Primary Gradient Button

**Before:**
```tsx
<button className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150">
  Generate Plan
</button>
```

**After:**
```tsx
<button className={buttonVariants.primary}>
  Generate Plan
</button>
```

---

#### Pattern 2: Card with Header

**Before:**
```tsx
<div className="bg-white shadow-xl rounded-2xl">
  <div className="px-6 py-5 bg-gradient-to-r from-primary-light to-primary border-b border-gray-200">
    <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
  </div>
  <div className="p-6 space-y-4">
    {/* Form fields */}
  </div>
</div>
```

**After:**
```tsx
<div className={cardVariants.default}>
  <div className={cardVariants.headerGradient}>
    <h2 className={typographyVariants.sectionHeading}>Preferences</h2>
  </div>
  <div className={cn("p-6", layoutVariants.formContainer)}>
    {/* Form fields */}
  </div>
</div>
```

---

#### Pattern 3: Form Input with Label

**Before:**
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
  />
  <p className="text-xs text-gray-500 mt-1">
    We'll never share your email.
  </p>
</div>
```

**After:**
```tsx
<div>
  <label className={inputVariants.label}>
    Email Address
  </label>
  <input
    type="email"
    className={inputVariants.default}
  />
  <p className={inputVariants.helpText}>
    We'll never share your email.
  </p>
</div>
```

---

#### Pattern 4: Status Badge

**Before:**
```tsx
<span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
  Completed
</span>
```

**After:**
```tsx
<span className={badgeVariants.statusCompleted}>
  Completed
</span>
```

---

#### Pattern 5: Alert Message

**Before:**
```tsx
<div className="rounded-lg bg-green-50 border border-green-200 p-4">
  <div className="flex">
    <CheckCircleIcon className="h-5 w-5 text-green-400" />
    <p className="ml-3 text-sm text-green-800">
      Successfully saved!
    </p>
  </div>
</div>
```

**After:**
```tsx
<div className={alertVariants.success}>
  <div className="flex">
    <CheckCircleIcon className={alertVariants.iconSuccess} />
    <p className={alertVariants.textSuccess}>
      Successfully saved!
    </p>
  </div>
</div>
```

---

## Best Practices

### 1. Always Prefer Variants Over Raw Tailwind

**❌ Don't:**
```tsx
<button className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150">
  Submit
</button>
```

**✅ Do:**
```tsx
<button className={buttonVariants.primary}>
  Submit
</button>
```

---

### 2. Use `cn()` for Conditional Styling

**❌ Don't:**
```tsx
<button className={isActive
  ? buttonVariants.primary
  : buttonVariants.secondary
}>
  Action
</button>
```

**✅ Do:**
```tsx
<button className={cn(
  buttonVariants.primary,
  !isActive && "opacity-50"
)}>
  Action
</button>
```

---

### 3. Keep Custom Styles Minimal

When you need custom styling, combine variants with minimal additional classes:

**✅ Good:**
```tsx
<div className={cn(cardVariants.default, "mt-4")}>
  {/* Small customization */}
</div>
```

**❌ Bad:**
```tsx
<div className="bg-white shadow-xl rounded-2xl mt-4 p-6 hover:shadow-2xl transform hover:scale-105">
  {/* Too much custom styling - should be a variant */}
</div>
```

---

### 4. Create New Variants for Repeated Patterns

If you find yourself repeating the same class combination 3+ times, add it as a new variant:

```typescript
// Add to variants.ts
export const customVariants = {
  myPattern: 'bg-white border-2 border-primary rounded-xl p-8 shadow-lg',
} as const;
```

---

### 5. Use Design Tokens for Custom Styles

When writing custom CSS or inline styles, use design tokens:

**❌ Don't:**
```tsx
<div style={{ backgroundColor: '#3F9BA6', padding: '16px' }}>
  {/* Hardcoded values */}
</div>
```

**✅ Do:**
```tsx
import { colors, spacing } from '@/lib/styles/tokens';

<div style={{ backgroundColor: colors.primary.DEFAULT, padding: spacing.lg }}>
  {/* Using tokens */}
</div>
```

---

### 6. Maintain Semantic Naming

Use semantic variant names that describe purpose, not appearance:

**✅ Good:**
```typescript
buttonVariants.primary        // Purpose: Primary action
buttonVariants.destructive    // Purpose: Destructive action
alertVariants.error          // Purpose: Error message
```

**❌ Bad:**
```typescript
buttonVariants.greenGradient  // Describes appearance
buttonVariants.redButton      // Describes appearance
alertVariants.redBorder      // Describes appearance
```

---

### 7. Document New Variants

When adding new variants, include:
- Purpose and usage
- Where it's used (occurrence count)
- Visual description
- Code example

```typescript
/**
 * New button variant for special promotions
 * Usage: 2 occurrences (homepage, promo page)
 */
promoButton: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:scale-105 transition-transform',
```

---

### 8. Keep Accessibility in Mind

Ensure variants maintain accessibility:

- Sufficient color contrast (WCAG AA minimum)
- Focus states for interactive elements
- Proper semantic HTML
- ARIA attributes when needed

```tsx
// Good: Includes focus state
<button className={cn(
  buttonVariants.primary,
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
)}>
  Submit
</button>
```

---

### 9. Test Responsiveness

Variants should work well across all breakpoints:

```tsx
// Combine variants with responsive utilities
<div className={cn(
  cardVariants.defaultWithPadding,
  "sm:p-6 lg:p-8"  // Responsive padding override
)}>
  {/* Content */}
</div>
```

---

### 10. Version Control for Breaking Changes

When modifying existing variants:
1. Consider backwards compatibility
2. Deprecate before removing (add comments)
3. Provide migration path
4. Update this documentation

```typescript
/**
 * @deprecated Use buttonVariants.primary instead
 * Will be removed in v2.0.0
 */
oldPrimaryButton: 'bg-blue-500 text-white px-4 py-2 rounded',
```

---

## Questions & Support

### Where to Find More Information

- **Design Tokens**: `apps/web/lib/styles/tokens.ts`
- **Component Variants**: `apps/web/lib/styles/variants.ts`
- **Tailwind Config**: `apps/web/tailwind.config.ts`
- **Component Examples**: Browse `apps/web/app/` for real-world usage

### Common Questions

**Q: Can I still use regular Tailwind classes?**

A: Yes! Variants are helpers, not replacements. Use variants for common patterns and Tailwind utilities for custom styling.

**Q: How do I add a new variant?**

A: Add it to the appropriate variant object in `lib/styles/variants.ts`, following the existing pattern and documentation style.

**Q: What if I need a one-off style?**

A: Use the `cn()` utility to combine a variant with additional Tailwind classes for one-off customizations.

**Q: Should I use variants for everything?**

A: Use variants for repeated patterns (3+ occurrences). For unique, one-off styling, regular Tailwind classes are fine.

**Q: How do I override a variant style?**

A: Later classes in the className string override earlier ones (Tailwind's cascade). Use `cn()` to combine:

```tsx
<button className={cn(buttonVariants.primary, "py-4")}>
  {/* Overrides py-3 with py-4 */}
</button>
```

---

## Changelog

### Version 1.0.0 (Initial Release)

- Created design token system with 10+ token categories
- Extracted 100+ component variants from style audit
- Documented all variants with usage examples
- Created migration guide and best practices
- Reduced style duplication by 90%

---

**Last Updated:** January 2025
**Maintained By:** Meal Planner Development Team
