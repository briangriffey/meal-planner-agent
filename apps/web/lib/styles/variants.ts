/**
 * Component Variant Utilities
 *
 * Reusable style variants for common UI components.
 * These variants are extracted from the most frequently duplicated
 * Tailwind class patterns identified in the style audit.
 *
 * Usage:
 * import { buttonVariants, cardVariants, inputVariants } from '@/lib/styles/variants';
 *
 * <button className={buttonVariants.primary}>Click me</button>
 * <div className={cardVariants.default}>Card content</div>
 * <input className={inputVariants.default} />
 */

// ============================================================================
// UTILITY FUNCTION - Class Name Merger
// ============================================================================

/**
 * Merges multiple class names, filtering out falsy values.
 * Similar to clsx/classnames but simple and dependency-free.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

/**
 * Button style variants extracted from the style audit.
 * Covers all common button patterns used throughout the application.
 */
export const buttonVariants = {
  /**
   * Primary gradient button - Main CTAs, submit buttons
   * Usage: 15 occurrences across the app
   */
  primary:
    'bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',

  /**
   * Primary with icon - Same as primary but with icon support
   */
  primaryWithIcon:
    'inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',

  /**
   * Secondary/Outline button - Cancel actions, secondary options
   * Usage: 12 occurrences
   */
  secondary:
    'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors',

  /**
   * Outline button for card actions - Edit, view, remove actions
   * Usage: 8 occurrences
   */
  outline:
    'px-4 py-2 border border-primary text-sm font-medium rounded-lg text-primary hover:bg-primary hover:text-white transition-all duration-150',

  /**
   * Outline variant for destructive actions (delete, remove)
   */
  outlineDestructive:
    'px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all duration-150',

  /**
   * Ghost/Text link button - Inline links, navigation links
   * Usage: 6 occurrences
   */
  ghost: 'font-medium text-primary hover:text-primary-dark transition-colors',

  /**
   * Accent button - Special CTAs like meal plan generation
   * Usage: 2 occurrences
   */
  accent:
    'inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent shadow-lg hover:shadow-xl transition-all duration-150',

  /**
   * Navigation link (active state) - Dashboard navigation
   * Usage: 10 occurrences (5 nav items × 2 states)
   */
  navActive:
    'bg-white/20 text-white inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',

  /**
   * Navigation link (inactive state) - Dashboard navigation
   */
  navInactive:
    'text-white/80 hover:bg-white/10 hover:text-white inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',

  /**
   * Sign out button - Logout action in navigation
   * Usage: 2 occurrences
   */
  signOut:
    'inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-150',
} as const;

// ============================================================================
// CARD VARIANTS
// ============================================================================

/**
 * Card style variants for various container types.
 */
export const cardVariants = {
  /**
   * Default card - Primary content containers, forms, sections
   * Usage: 18 occurrences
   */
  default: 'bg-white shadow-xl rounded-2xl',

  /**
   * Default card with padding
   */
  defaultWithPadding: 'bg-white shadow-xl rounded-2xl px-6 py-6 sm:p-8',

  /**
   * Bordered card - List items, member cards, secondary containers
   * Usage: 8 occurrences
   */
  bordered: 'bg-white border border-gray-200 rounded-lg',

  /**
   * Bordered card with hover effect
   */
  borderedHover:
    'bg-white border border-gray-200 rounded-lg hover:border-primary-light transition-colors',

  /**
   * Gradient stat card - Dashboard statistics, metrics display
   * Usage: 3 occurrences
   */
  gradientStat:
    'bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-150',

  /**
   * Gradient stat card variations
   */
  gradientStatLight:
    'bg-gradient-to-br from-primary-light to-primary rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-150',

  gradientStatAccent:
    'bg-gradient-to-br from-accent to-accent/90 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-150',

  /**
   * Card header with gradient - Section headers, emphasized card titles
   * Usage: 12 occurrences
   */
  headerGradient:
    'px-6 py-5 bg-gradient-to-r from-primary-light to-primary border-b border-gray-200',

  /**
   * Subtle card header
   */
  headerSubtle: 'px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200',

  /**
   * List item card - Meal plan lists, data tables, repeating items
   * Usage: 8 occurrences
   */
  listItem: 'px-6 py-4 hover:bg-primary-light/5 transition-colors duration-150',

  /**
   * List item with hover (gray variant)
   */
  listItemGray: 'px-4 py-4 sm:px-6 hover:bg-gray-50',

  /**
   * Icon container in cards - Icons within stat cards, headers
   * Usage: 15 occurrences
   */
  iconContainer:
    'w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center',

  /**
   * Larger icon container
   */
  iconContainerLarge:
    'w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center',

  /**
   * Light icon container (for dark backgrounds)
   */
  iconContainerLight: 'w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center',
} as const;

// ============================================================================
// INPUT VARIANTS
// ============================================================================

/**
 * Input and form element style variants.
 */
export const inputVariants = {
  /**
   * Standard text input - All form inputs, text fields, email, password
   * Usage: 25+ occurrences
   */
  default:
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent',

  /**
   * Extended input with appearance reset and transitions
   */
  extended:
    'appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out',

  /**
   * Select/Dropdown - Day selection, time selection, schedule settings
   * Usage: 6 occurrences
   */
  select:
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent',

  /**
   * Input label - Form field labels
   * Usage: 20+ occurrences
   */
  label: 'block text-sm font-medium text-gray-700 mb-2',

  /**
   * Label with less margin
   */
  labelCompact: 'block text-sm font-medium text-gray-700 mb-1',

  /**
   * Help text/Description - Field hints, descriptions, notes
   * Usage: 15+ occurrences
   */
  helpText: 'text-xs text-gray-500 mt-1',

  /**
   * Help text variations
   */
  helpTextSmall: 'text-sm text-gray-500 mt-2',
} as const;

// ============================================================================
// ALERT/MESSAGE VARIANTS
// ============================================================================

/**
 * Alert and notification message variants.
 */
export const alertVariants = {
  /**
   * Success alert - Success messages, confirmation notifications
   * Usage: 8 occurrences
   */
  success: 'rounded-lg bg-green-50 border border-green-200 p-4',

  /**
   * Error alert - Error messages, validation failures
   * Usage: 8 occurrences
   */
  error: 'rounded-lg bg-red-50 border border-red-200 p-4',

  /**
   * Info alert - Informational messages
   * Usage: 4 occurrences
   */
  info: 'rounded-lg bg-blue-50 border border-blue-200 p-4',

  /**
   * Warning alert - Warning messages
   * Usage: 2 occurrences
   */
  warning: 'rounded-lg bg-yellow-50 border border-yellow-200 p-4',

  /**
   * Alert icon styles
   */
  iconSuccess: 'h-5 w-5 text-green-400',
  iconError: 'h-5 w-5 text-red-400',
  iconInfo: 'h-5 w-5 text-blue-400',
  iconWarning: 'h-5 w-5 text-yellow-400',

  /**
   * Alert text styles
   */
  textSuccess: 'ml-3 text-sm text-green-800',
  textError: 'ml-3 text-sm text-red-800',
  textInfo: 'ml-3 text-sm text-blue-800',
  textWarning: 'ml-3 text-sm text-yellow-800',
} as const;

// ============================================================================
// BADGE/STATUS VARIANTS
// ============================================================================

/**
 * Badge and status indicator variants.
 */
export const badgeVariants = {
  /**
   * Base badge style
   */
  base: 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',

  /**
   * Status badge variants for meal plans
   * Usage: 10+ occurrences
   */
  statusPending: 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200',
  statusProcessing: 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light/20 text-primary-dark border border-primary-light',
  statusCompleted: 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200',
  statusFailed: 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200',
  statusCancelled: 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200',

  /**
   * Role badges for household members
   * Usage: 2 occurrences
   */
  roleOwner: 'text-xs px-3 py-1 rounded-full font-medium bg-purple-100 text-purple-800',
  roleMember: 'text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800',

  /**
   * Dietary restriction tags
   * Usage: 4 occurrences
   */
  dietaryTag:
    'inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-light to-primary-dark text-white rounded-full text-sm',
} as const;

// ============================================================================
// MODAL VARIANTS
// ============================================================================

/**
 * Modal and dialog style variants.
 */
export const modalVariants = {
  /**
   * Modal backdrop - Overlay for modal dialogs
   * Usage: 2 occurrences
   */
  backdrop: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',

  /**
   * Modal container - Modal content wrapper
   * Usage: 2 occurrences
   */
  container: 'bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto',

  /**
   * Large modal container
   */
  containerLarge: 'bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto',

  /**
   * Modal header - Modal titles
   * Usage: 4 occurrences
   */
  header: 'text-2xl font-bold text-primary-dark',

  /**
   * Close button - Modal close icon button
   * Usage: 2 occurrences
   */
  closeButton: 'text-gray-400 hover:text-gray-600 transition-colors',
} as const;

// ============================================================================
// LAYOUT VARIANTS
// ============================================================================

/**
 * Common layout and spacing patterns.
 */
export const layoutVariants = {
  /**
   * Page container - Main page wrapper, vertical spacing
   * Usage: 15+ occurrences
   */
  pageContainer: 'space-y-6',
  pageContainerLarge: 'space-y-8',

  /**
   * Form spacing - Spacing between form fields
   * Usage: 10+ occurrences
   */
  formContainer: 'space-y-4',
  formContainerLarge: 'space-y-6',

  /**
   * Max width container - Dashboard navigation, responsive containers
   * Usage: 2 occurrences
   */
  maxWidthContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',

  /**
   * Responsive grid - Stat cards, form grids
   * Usage: 6 occurrences
   */
  grid2Cols: 'grid grid-cols-1 gap-6 md:grid-cols-2',
  grid3Cols: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
  grid5Cols: 'grid grid-cols-2 gap-6 md:grid-cols-5',

  /**
   * Flex layouts - Horizontal layouts, alignment
   * Usage: 25+ occurrences
   */
  flexBetween: 'flex items-center justify-between',
  flexCenter: 'flex items-center justify-center',
  flexStart: 'flex items-center gap-3',
  inlineFlex: 'inline-flex items-center',
  flexCol: 'flex flex-col gap-2',
} as const;

// ============================================================================
// TYPOGRAPHY VARIANTS
// ============================================================================

/**
 * Typography style patterns.
 */
export const typographyVariants = {
  /**
   * Page headings - Main page titles
   * Usage: 15+ occurrences
   */
  pageHeading: 'text-3xl font-bold text-primary-dark',
  pageHeadingResponsive: 'text-2xl sm:text-3xl font-bold text-primary-dark',

  /**
   * Section headings - Section titles, card headers
   * Usage: 12+ occurrences
   */
  sectionHeading: 'text-xl font-bold text-gray-900',
  sectionHeadingSemibold: 'text-lg font-semibold text-gray-900',

  /**
   * Descriptive text - Subtitles, descriptions
   * Usage: 20+ occurrences
   */
  description: 'text-sm text-gray-600',
  descriptionLight: 'text-sm text-gray-500',
  descriptionSmall: 'text-xs text-gray-500',
} as const;

// ============================================================================
// NUTRITION DISPLAY VARIANTS
// ============================================================================

/**
 * Nutrition information display variants.
 */
export const nutritionVariants = {
  /**
   * Nutrition info cards - Display calories, protein, carbs, fat, fiber
   * Usage: 5 occurrences per meal
   */
  baseCard: 'text-center p-3 rounded-lg',
  calories: 'text-center p-3 bg-blue-50 rounded-lg',
  protein: 'text-center p-3 bg-purple-50 rounded-lg',
  carbs: 'text-center p-3 bg-yellow-50 rounded-lg',
  fat: 'text-center p-3 bg-red-50 rounded-lg',
  fiber: 'text-center p-3 bg-green-50 rounded-lg',

  /**
   * Nutrition text colors
   */
  caloriesText: 'text-blue-600',
  proteinText: 'text-purple-600',
  carbsText: 'text-yellow-600',
  fatText: 'text-red-600',
  fiberText: 'text-green-600',
} as const;

// ============================================================================
// LOADING/STATE VARIANTS
// ============================================================================

/**
 * Loading and empty state variants.
 */
export const stateVariants = {
  /**
   * Loading spinner - Button loading states, page loading
   * Usage: 3 occurrences
   */
  spinner: 'animate-spin -ml-1 mr-3 h-5 w-5 text-white',
  spinnerCircle: 'opacity-25',
  spinnerPath: 'opacity-75',

  /**
   * Empty state - No data messages, empty lists
   * Usage: 4 occurrences
   */
  emptyContainer: 'text-center py-12',
  emptyIcon: 'mx-auto h-12 w-12 text-gray-400',
  emptyHeading: 'mt-2 text-sm font-medium text-gray-900',
  emptyDescription: 'mt-1 text-sm text-gray-500',
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * TypeScript types for variant keys (for type-safe variant usage)
 */
export type ButtonVariant = keyof typeof buttonVariants;
export type CardVariant = keyof typeof cardVariants;
export type InputVariant = keyof typeof inputVariants;
export type AlertVariant = keyof typeof alertVariants;
export type BadgeVariant = keyof typeof badgeVariants;
export type ModalVariant = keyof typeof modalVariants;
export type LayoutVariant = keyof typeof layoutVariants;
export type TypographyVariant = keyof typeof typographyVariants;
export type NutritionVariant = keyof typeof nutritionVariants;
export type StateVariant = keyof typeof stateVariants;
