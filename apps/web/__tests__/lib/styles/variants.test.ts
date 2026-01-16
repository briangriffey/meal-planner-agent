/**
 * Component Variants Unit Tests
 *
 * Tests to verify that all component variant utilities are properly exported,
 * return valid class strings, and follow expected patterns.
 */

import {
  cn,
  buttonVariants,
  cardVariants,
  inputVariants,
  alertVariants,
  badgeVariants,
  modalVariants,
  layoutVariants,
  typographyVariants,
  nutritionVariants,
  stateVariants,
} from '../../../lib/styles/variants';

describe('Component Variants', () => {
  describe('cn() utility function', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', false, 'class2', null, undefined)).toBe('class1 class2');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
    });

    it('should handle mixed types', () => {
      expect(cn('class1', true && 'class2', false && 'class3', undefined, null, 'class4')).toBe(
        'class1 class2 class4'
      );
    });
  });

  describe('buttonVariants', () => {
    it('should export buttonVariants object', () => {
      expect(buttonVariants).toBeDefined();
      expect(typeof buttonVariants).toBe('object');
    });

    it('should have primary variant', () => {
      expect(buttonVariants.primary).toBeDefined();
      expect(typeof buttonVariants.primary).toBe('string');
      expect(buttonVariants.primary).toContain('bg-gradient-to-r');
      expect(buttonVariants.primary).toContain('from-primary');
      expect(buttonVariants.primary).toContain('to-primary-dark');
    });

    it('should have primaryWithIcon variant', () => {
      expect(buttonVariants.primaryWithIcon).toBeDefined();
      expect(buttonVariants.primaryWithIcon).toContain('inline-flex');
      expect(buttonVariants.primaryWithIcon).toContain('items-center');
    });

    it('should have secondary variant', () => {
      expect(buttonVariants.secondary).toBeDefined();
      expect(buttonVariants.secondary).toContain('border');
      expect(buttonVariants.secondary).toContain('border-gray-300');
    });

    it('should have outline variant', () => {
      expect(buttonVariants.outline).toBeDefined();
      expect(buttonVariants.outline).toContain('border-primary');
      expect(buttonVariants.outline).toContain('text-primary');
    });

    it('should have outlineDestructive variant', () => {
      expect(buttonVariants.outlineDestructive).toBeDefined();
      expect(buttonVariants.outlineDestructive).toContain('border-red');
      expect(buttonVariants.outlineDestructive).toContain('text-red');
    });

    it('should have ghost variant', () => {
      expect(buttonVariants.ghost).toBeDefined();
      expect(buttonVariants.ghost).toContain('text-primary');
    });

    it('should have accent variant', () => {
      expect(buttonVariants.accent).toBeDefined();
      expect(buttonVariants.accent).toContain('from-accent');
    });

    it('should have navigation variants', () => {
      expect(buttonVariants.navActive).toBeDefined();
      expect(buttonVariants.navInactive).toBeDefined();
      expect(buttonVariants.navActive).toContain('bg-white/20');
      expect(buttonVariants.navInactive).toContain('text-white/80');
    });

    it('should have signOut variant', () => {
      expect(buttonVariants.signOut).toBeDefined();
      expect(buttonVariants.signOut).toContain('border-white/30');
    });

    it('should have transition classes in variants', () => {
      expect(buttonVariants.primary).toContain('transition');
      expect(buttonVariants.secondary).toContain('transition');
    });

    it('should have disabled states in applicable variants', () => {
      expect(buttonVariants.primary).toContain('disabled:');
      expect(buttonVariants.primaryWithIcon).toContain('disabled:');
    });
  });

  describe('cardVariants', () => {
    it('should export cardVariants object', () => {
      expect(cardVariants).toBeDefined();
      expect(typeof cardVariants).toBe('object');
    });

    it('should have default variant', () => {
      expect(cardVariants.default).toBeDefined();
      expect(cardVariants.default).toContain('bg-white');
      expect(cardVariants.default).toContain('shadow');
      expect(cardVariants.default).toContain('rounded');
    });

    it('should have defaultWithPadding variant', () => {
      expect(cardVariants.defaultWithPadding).toBeDefined();
      expect(cardVariants.defaultWithPadding).toContain('px-6');
      expect(cardVariants.defaultWithPadding).toContain('py-6');
    });

    it('should have bordered variants', () => {
      expect(cardVariants.bordered).toBeDefined();
      expect(cardVariants.borderedHover).toBeDefined();
      expect(cardVariants.bordered).toContain('border');
      expect(cardVariants.borderedHover).toContain('hover:border-primary');
    });

    it('should have gradient stat variants', () => {
      expect(cardVariants.gradientStat).toBeDefined();
      expect(cardVariants.gradientStatLight).toBeDefined();
      expect(cardVariants.gradientStatAccent).toBeDefined();
      expect(cardVariants.gradientStat).toContain('bg-gradient-to-br');
      expect(cardVariants.gradientStat).toContain('from-primary');
    });

    it('should have header variants', () => {
      expect(cardVariants.headerGradient).toBeDefined();
      expect(cardVariants.headerSubtle).toBeDefined();
      expect(cardVariants.headerGradient).toContain('bg-gradient-to-r');
    });

    it('should have list item variants', () => {
      expect(cardVariants.listItem).toBeDefined();
      expect(cardVariants.listItemGray).toBeDefined();
      expect(cardVariants.listItem).toContain('hover:bg-');
    });

    it('should have icon container variants', () => {
      expect(cardVariants.iconContainer).toBeDefined();
      expect(cardVariants.iconContainerLarge).toBeDefined();
      expect(cardVariants.iconContainerLight).toBeDefined();
      expect(cardVariants.iconContainer).toContain('flex');
      expect(cardVariants.iconContainer).toContain('items-center');
      expect(cardVariants.iconContainer).toContain('justify-center');
    });
  });

  describe('inputVariants', () => {
    it('should export inputVariants object', () => {
      expect(inputVariants).toBeDefined();
      expect(typeof inputVariants).toBe('object');
    });

    it('should have default variant', () => {
      expect(inputVariants.default).toBeDefined();
      expect(inputVariants.default).toContain('w-full');
      expect(inputVariants.default).toContain('border');
      expect(inputVariants.default).toContain('focus:ring');
    });

    it('should have extended variant', () => {
      expect(inputVariants.extended).toBeDefined();
      expect(inputVariants.extended).toContain('appearance-none');
      expect(inputVariants.extended).toContain('focus:outline-none');
    });

    it('should have select variant', () => {
      expect(inputVariants.select).toBeDefined();
      expect(inputVariants.select).toContain('w-full');
      expect(inputVariants.select).toContain('focus:ring');
    });

    it('should have label variants', () => {
      expect(inputVariants.label).toBeDefined();
      expect(inputVariants.labelCompact).toBeDefined();
      expect(inputVariants.label).toContain('text-sm');
      expect(inputVariants.label).toContain('font-medium');
    });

    it('should have helpText variants', () => {
      expect(inputVariants.helpText).toBeDefined();
      expect(inputVariants.helpTextSmall).toBeDefined();
      expect(inputVariants.helpText).toContain('text-xs');
      expect(inputVariants.helpText).toContain('text-gray-500');
    });
  });

  describe('alertVariants', () => {
    it('should export alertVariants object', () => {
      expect(alertVariants).toBeDefined();
      expect(typeof alertVariants).toBe('object');
    });

    it('should have semantic alert variants', () => {
      expect(alertVariants.success).toBeDefined();
      expect(alertVariants.error).toBeDefined();
      expect(alertVariants.info).toBeDefined();
      expect(alertVariants.warning).toBeDefined();
    });

    it('should have proper color coding for success', () => {
      expect(alertVariants.success).toContain('green');
    });

    it('should have proper color coding for error', () => {
      expect(alertVariants.error).toContain('red');
    });

    it('should have proper color coding for info', () => {
      expect(alertVariants.info).toContain('blue');
    });

    it('should have proper color coding for warning', () => {
      expect(alertVariants.warning).toContain('yellow');
    });

    it('should have icon variants', () => {
      expect(alertVariants.iconSuccess).toBeDefined();
      expect(alertVariants.iconError).toBeDefined();
      expect(alertVariants.iconInfo).toBeDefined();
      expect(alertVariants.iconWarning).toBeDefined();
    });

    it('should have text variants', () => {
      expect(alertVariants.textSuccess).toBeDefined();
      expect(alertVariants.textError).toBeDefined();
      expect(alertVariants.textInfo).toBeDefined();
      expect(alertVariants.textWarning).toBeDefined();
    });
  });

  describe('badgeVariants', () => {
    it('should export badgeVariants object', () => {
      expect(badgeVariants).toBeDefined();
      expect(typeof badgeVariants).toBe('object');
    });

    it('should have base variant', () => {
      expect(badgeVariants.base).toBeDefined();
      expect(badgeVariants.base).toContain('px-');
      expect(badgeVariants.base).toContain('rounded-full');
    });

    it('should have status badge variants', () => {
      expect(badgeVariants.statusPending).toBeDefined();
      expect(badgeVariants.statusProcessing).toBeDefined();
      expect(badgeVariants.statusCompleted).toBeDefined();
      expect(badgeVariants.statusFailed).toBeDefined();
      expect(badgeVariants.statusCancelled).toBeDefined();
    });

    it('should have proper color coding for statuses', () => {
      expect(badgeVariants.statusPending).toContain('yellow');
      expect(badgeVariants.statusCompleted).toContain('green');
      expect(badgeVariants.statusFailed).toContain('red');
    });

    it('should have role badge variants', () => {
      expect(badgeVariants.roleOwner).toBeDefined();
      expect(badgeVariants.roleMember).toBeDefined();
      expect(badgeVariants.roleOwner).toContain('purple');
      expect(badgeVariants.roleMember).toContain('blue');
    });

    it('should have dietaryTag variant', () => {
      expect(badgeVariants.dietaryTag).toBeDefined();
      expect(badgeVariants.dietaryTag).toContain('bg-gradient-to-r');
    });
  });

  describe('modalVariants', () => {
    it('should export modalVariants object', () => {
      expect(modalVariants).toBeDefined();
      expect(typeof modalVariants).toBe('object');
    });

    it('should have backdrop variant', () => {
      expect(modalVariants.backdrop).toBeDefined();
      expect(modalVariants.backdrop).toContain('fixed');
      expect(modalVariants.backdrop).toContain('inset-0');
      expect(modalVariants.backdrop).toContain('bg-black');
      expect(modalVariants.backdrop).toContain('z-50');
    });

    it('should have container variants', () => {
      expect(modalVariants.container).toBeDefined();
      expect(modalVariants.containerLarge).toBeDefined();
      expect(modalVariants.container).toContain('bg-white');
      expect(modalVariants.container).toContain('rounded');
    });

    it('should have header variant', () => {
      expect(modalVariants.header).toBeDefined();
      expect(modalVariants.header).toContain('text-2xl');
      expect(modalVariants.header).toContain('font-bold');
    });

    it('should have closeButton variant', () => {
      expect(modalVariants.closeButton).toBeDefined();
      expect(modalVariants.closeButton).toContain('hover:');
    });
  });

  describe('layoutVariants', () => {
    it('should export layoutVariants object', () => {
      expect(layoutVariants).toBeDefined();
      expect(typeof layoutVariants).toBe('object');
    });

    it('should have page container variants', () => {
      expect(layoutVariants.pageContainer).toBeDefined();
      expect(layoutVariants.pageContainerLarge).toBeDefined();
      expect(layoutVariants.pageContainer).toContain('space-y');
    });

    it('should have form container variants', () => {
      expect(layoutVariants.formContainer).toBeDefined();
      expect(layoutVariants.formContainerLarge).toBeDefined();
      expect(layoutVariants.formContainer).toContain('space-y');
    });

    it('should have maxWidthContainer variant', () => {
      expect(layoutVariants.maxWidthContainer).toBeDefined();
      expect(layoutVariants.maxWidthContainer).toContain('max-w-7xl');
      expect(layoutVariants.maxWidthContainer).toContain('mx-auto');
    });

    it('should have grid variants', () => {
      expect(layoutVariants.grid2Cols).toBeDefined();
      expect(layoutVariants.grid3Cols).toBeDefined();
      expect(layoutVariants.grid5Cols).toBeDefined();
      expect(layoutVariants.grid2Cols).toContain('grid');
      expect(layoutVariants.grid2Cols).toContain('gap');
    });

    it('should have flex layout variants', () => {
      expect(layoutVariants.flexBetween).toBeDefined();
      expect(layoutVariants.flexCenter).toBeDefined();
      expect(layoutVariants.flexStart).toBeDefined();
      expect(layoutVariants.inlineFlex).toBeDefined();
      expect(layoutVariants.flexCol).toBeDefined();
      expect(layoutVariants.flexBetween).toContain('flex');
      expect(layoutVariants.flexBetween).toContain('items-center');
      expect(layoutVariants.flexBetween).toContain('justify-between');
    });
  });

  describe('typographyVariants', () => {
    it('should export typographyVariants object', () => {
      expect(typographyVariants).toBeDefined();
      expect(typeof typographyVariants).toBe('object');
    });

    it('should have page heading variants', () => {
      expect(typographyVariants.pageHeading).toBeDefined();
      expect(typographyVariants.pageHeadingResponsive).toBeDefined();
      expect(typographyVariants.pageHeading).toContain('text-3xl');
      expect(typographyVariants.pageHeading).toContain('font-bold');
    });

    it('should have section heading variants', () => {
      expect(typographyVariants.sectionHeading).toBeDefined();
      expect(typographyVariants.sectionHeadingSemibold).toBeDefined();
      expect(typographyVariants.sectionHeading).toContain('text-xl');
    });

    it('should have description variants', () => {
      expect(typographyVariants.description).toBeDefined();
      expect(typographyVariants.descriptionLight).toBeDefined();
      expect(typographyVariants.descriptionSmall).toBeDefined();
      expect(typographyVariants.description).toContain('text-sm');
    });
  });

  describe('nutritionVariants', () => {
    it('should export nutritionVariants object', () => {
      expect(nutritionVariants).toBeDefined();
      expect(typeof nutritionVariants).toBe('object');
    });

    it('should have baseCard variant', () => {
      expect(nutritionVariants.baseCard).toBeDefined();
      expect(nutritionVariants.baseCard).toContain('text-center');
      expect(nutritionVariants.baseCard).toContain('rounded');
    });

    it('should have nutrition category variants', () => {
      expect(nutritionVariants.calories).toBeDefined();
      expect(nutritionVariants.protein).toBeDefined();
      expect(nutritionVariants.carbs).toBeDefined();
      expect(nutritionVariants.fat).toBeDefined();
      expect(nutritionVariants.fiber).toBeDefined();
    });

    it('should have proper color coding for nutrition categories', () => {
      expect(nutritionVariants.calories).toContain('blue');
      expect(nutritionVariants.protein).toContain('purple');
      expect(nutritionVariants.carbs).toContain('yellow');
      expect(nutritionVariants.fat).toContain('red');
      expect(nutritionVariants.fiber).toContain('green');
    });

    it('should have nutrition text color variants', () => {
      expect(nutritionVariants.caloriesText).toBeDefined();
      expect(nutritionVariants.proteinText).toBeDefined();
      expect(nutritionVariants.carbsText).toBeDefined();
      expect(nutritionVariants.fatText).toBeDefined();
      expect(nutritionVariants.fiberText).toBeDefined();
    });
  });

  describe('stateVariants', () => {
    it('should export stateVariants object', () => {
      expect(stateVariants).toBeDefined();
      expect(typeof stateVariants).toBe('object');
    });

    it('should have spinner variants', () => {
      expect(stateVariants.spinner).toBeDefined();
      expect(stateVariants.spinnerCircle).toBeDefined();
      expect(stateVariants.spinnerPath).toBeDefined();
      expect(stateVariants.spinner).toContain('animate-spin');
    });

    it('should have empty state variants', () => {
      expect(stateVariants.emptyContainer).toBeDefined();
      expect(stateVariants.emptyIcon).toBeDefined();
      expect(stateVariants.emptyHeading).toBeDefined();
      expect(stateVariants.emptyDescription).toBeDefined();
      expect(stateVariants.emptyContainer).toContain('text-center');
    });
  });

  describe('Variant Exports', () => {
    it('should export all required variant categories', () => {
      const exports = {
        cn,
        buttonVariants,
        cardVariants,
        inputVariants,
        alertVariants,
        badgeVariants,
        modalVariants,
        layoutVariants,
        typographyVariants,
        nutritionVariants,
        stateVariants,
      };

      // Verify cn function is exported
      expect(exports.cn).toBeDefined();
      expect(typeof exports.cn).toBe('function');

      // Verify all variant objects are exported
      Object.entries(exports).forEach(([name, value]) => {
        if (name !== 'cn') {
          expect(value).toBeDefined();
          expect(typeof value).toBe('object');
        }
      });
    });
  });

  describe('Variant String Validity', () => {
    it('should have non-empty strings for all button variants', () => {
      Object.values(buttonVariants).forEach(variant => {
        expect(typeof variant).toBe('string');
        expect(variant.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty strings for all card variants', () => {
      Object.values(cardVariants).forEach(variant => {
        expect(typeof variant).toBe('string');
        expect(variant.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty strings for all input variants', () => {
      Object.values(inputVariants).forEach(variant => {
        expect(typeof variant).toBe('string');
        expect(variant.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty strings for all other variant categories', () => {
      const variantObjects = [
        alertVariants,
        badgeVariants,
        modalVariants,
        layoutVariants,
        typographyVariants,
        nutritionVariants,
        stateVariants,
      ];

      variantObjects.forEach(variantObj => {
        Object.values(variantObj).forEach(variant => {
          expect(typeof variant).toBe('string');
          expect(variant.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Tailwind Class Patterns', () => {
    it('should contain valid Tailwind utility classes', () => {
      // Test that variants use common Tailwind patterns
      const commonPatterns = [
        /bg-/, // background colors
        /text-/, // text colors/sizes
        /border/, // borders
        /rounded/, // border radius
        /px-|py-|p-/, // padding
        /flex|grid/, // layout
        /shadow/, // shadows
        /hover:/, // hover states
        /transition/, // transitions
      ];

      const allVariants = [
        ...Object.values(buttonVariants),
        ...Object.values(cardVariants),
        ...Object.values(inputVariants),
      ];

      allVariants.forEach(variant => {
        const hasValidPattern = commonPatterns.some(pattern => pattern.test(variant));
        expect(hasValidPattern).toBe(true);
      });
    });
  });
});
