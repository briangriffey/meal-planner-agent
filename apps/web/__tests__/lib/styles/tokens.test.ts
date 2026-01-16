/**
 * Design Tokens Unit Tests
 *
 * Tests to verify that all design tokens are properly exported,
 * have the correct structure, and contain valid values.
 */

import {
  colors,
  spacing,
  gaps,
  spaceY,
  typography,
  shadows,
  borders,
  transitions,
  opacities,
  zIndex,
  breakpoints,
  maxWidth,
} from '../../../lib/styles/tokens';

describe('Design Tokens', () => {
  describe('colors', () => {
    it('should export colors object', () => {
      expect(colors).toBeDefined();
      expect(typeof colors).toBe('object');
    });

    it('should have primary color variants', () => {
      expect(colors.primary).toBeDefined();
      expect(colors.primary.light).toBe('#5EBFBF');
      expect(colors.primary.DEFAULT).toBe('#3F9BA6');
      expect(colors.primary.dark).toBe('#225C73');
    });

    it('should have accent color variants', () => {
      expect(colors.accent).toBeDefined();
      expect(colors.accent.DEFAULT).toBe('#A66A5D');
      expect(colors.accent.dark).toBe('#8B5A4E');
    });

    it('should have semantic color variants (success, error, warning, info)', () => {
      // Success
      expect(colors.success).toBeDefined();
      expect(colors.success.light).toBe('#f0fdf4');
      expect(colors.success.DEFAULT).toBe('#22c55e');
      expect(colors.success.dark).toBe('#16a34a');

      // Error
      expect(colors.error).toBeDefined();
      expect(colors.error.light).toBe('#fef2f2');
      expect(colors.error.DEFAULT).toBe('#ef4444');
      expect(colors.error.dark).toBe('#dc2626');

      // Warning
      expect(colors.warning).toBeDefined();
      expect(colors.warning.light).toBe('#fefce8');
      expect(colors.warning.DEFAULT).toBe('#eab308');
      expect(colors.warning.dark).toBe('#ca8a04');

      // Info
      expect(colors.info).toBeDefined();
      expect(colors.info.light).toBe('#eff6ff');
      expect(colors.info.DEFAULT).toBe('#3b82f6');
      expect(colors.info.dark).toBe('#2563eb');
    });

    it('should have gray scale variants', () => {
      expect(colors.gray).toBeDefined();
      expect(colors.gray[50]).toBe('#f9fafb');
      expect(colors.gray[100]).toBe('#f3f4f6');
      expect(colors.gray[200]).toBe('#e5e7eb');
      expect(colors.gray[300]).toBe('#d1d5db');
      expect(colors.gray[400]).toBe('#9ca3af');
      expect(colors.gray[500]).toBe('#6b7280');
      expect(colors.gray[600]).toBe('#4b5563');
      expect(colors.gray[700]).toBe('#374151');
      expect(colors.gray[800]).toBe('#1f2937');
      expect(colors.gray[900]).toBe('#111827');
    });

    it('should have nutrition-specific colors', () => {
      expect(colors.nutrition).toBeDefined();
      expect(colors.nutrition.calories).toBe('#3b82f6');
      expect(colors.nutrition.protein).toBe('#a855f7');
      expect(colors.nutrition.carbs).toBe('#eab308');
      expect(colors.nutrition.fat).toBe('#ef4444');
      expect(colors.nutrition.fiber).toBe('#22c55e');
    });

    it('should have valid hex color format', () => {
      const hexColorRegex = /^#[0-9a-fA-F]{6}$/;

      expect(colors.primary.DEFAULT).toMatch(hexColorRegex);
      expect(colors.accent.DEFAULT).toMatch(hexColorRegex);
      expect(colors.success.DEFAULT).toMatch(hexColorRegex);
      expect(colors.gray[500]).toMatch(hexColorRegex);
    });
  });

  describe('spacing', () => {
    it('should export spacing object', () => {
      expect(spacing).toBeDefined();
      expect(typeof spacing).toBe('object');
    });

    it('should have all spacing scale values', () => {
      expect(spacing.xs).toBe('0.25rem');
      expect(spacing.sm).toBe('0.5rem');
      expect(spacing.md).toBe('0.75rem');
      expect(spacing.lg).toBe('1rem');
      expect(spacing.xl).toBe('1.5rem');
      expect(spacing['2xl']).toBe('2rem');
      expect(spacing['3xl']).toBe('3rem');
      expect(spacing['4xl']).toBe('4rem');
      expect(spacing['5xl']).toBe('6rem');
      expect(spacing['6xl']).toBe('8rem');
    });

    it('should have rem unit for all values', () => {
      Object.values(spacing).forEach(value => {
        expect(value).toMatch(/rem$/);
      });
    });
  });

  describe('gaps', () => {
    it('should export gaps object', () => {
      expect(gaps).toBeDefined();
      expect(typeof gaps).toBe('object');
    });

    it('should have all gap scale values', () => {
      expect(gaps.xs).toBe('0.5rem');
      expect(gaps.sm).toBe('0.75rem');
      expect(gaps.md).toBe('1rem');
      expect(gaps.lg).toBe('1.5rem');
      expect(gaps.xl).toBe('2rem');
    });
  });

  describe('spaceY', () => {
    it('should export spaceY object', () => {
      expect(spaceY).toBeDefined();
      expect(typeof spaceY).toBe('object');
    });

    it('should have all vertical spacing values', () => {
      expect(spaceY.xs).toBe('1rem');
      expect(spaceY.sm).toBe('1.5rem');
      expect(spaceY.md).toBe('2rem');
      expect(spaceY.lg).toBe('3rem');
    });
  });

  describe('typography', () => {
    it('should export typography object', () => {
      expect(typography).toBeDefined();
      expect(typeof typography).toBe('object');
    });

    it('should have fontSize scale', () => {
      expect(typography.fontSize).toBeDefined();
      expect(typography.fontSize.xs).toBe('0.75rem');
      expect(typography.fontSize.sm).toBe('0.875rem');
      expect(typography.fontSize.base).toBe('1rem');
      expect(typography.fontSize.lg).toBe('1.125rem');
      expect(typography.fontSize.xl).toBe('1.25rem');
      expect(typography.fontSize['2xl']).toBe('1.5rem');
      expect(typography.fontSize['3xl']).toBe('1.875rem');
      expect(typography.fontSize['4xl']).toBe('2.25rem');
    });

    it('should have fontWeight scale', () => {
      expect(typography.fontWeight).toBeDefined();
      expect(typography.fontWeight.normal).toBe('400');
      expect(typography.fontWeight.medium).toBe('500');
      expect(typography.fontWeight.semibold).toBe('600');
      expect(typography.fontWeight.bold).toBe('700');
    });

    it('should have lineHeight scale', () => {
      expect(typography.lineHeight).toBeDefined();
      expect(typography.lineHeight.tight).toBe('1.25');
      expect(typography.lineHeight.normal).toBe('1.5');
      expect(typography.lineHeight.relaxed).toBe('1.75');
    });
  });

  describe('shadows', () => {
    it('should export shadows object', () => {
      expect(shadows).toBeDefined();
      expect(typeof shadows).toBe('object');
    });

    it('should have all shadow variants', () => {
      expect(shadows.sm).toBeDefined();
      expect(shadows.DEFAULT).toBeDefined();
      expect(shadows.md).toBeDefined();
      expect(shadows.lg).toBeDefined();
      expect(shadows.xl).toBeDefined();
      expect(shadows['2xl']).toBeDefined();
      expect(shadows.inner).toBeDefined();
      expect(shadows.none).toBe('none');
    });

    it('should have valid shadow format (rgba or none)', () => {
      Object.values(shadows).forEach(value => {
        if (value !== 'none') {
          expect(value).toMatch(/rgba\(0, 0, 0,/);
        }
      });
    });
  });

  describe('borders', () => {
    it('should export borders object', () => {
      expect(borders).toBeDefined();
      expect(typeof borders).toBe('object');
    });

    it('should have width variants', () => {
      expect(borders.width).toBeDefined();
      expect(borders.width.DEFAULT).toBe('1px');
      expect(borders.width[0]).toBe('0px');
      expect(borders.width[2]).toBe('2px');
      expect(borders.width[4]).toBe('4px');
      expect(borders.width[8]).toBe('8px');
    });

    it('should have radius variants', () => {
      expect(borders.radius).toBeDefined();
      expect(borders.radius.none).toBe('0');
      expect(borders.radius.sm).toBe('0.125rem');
      expect(borders.radius.DEFAULT).toBe('0.25rem');
      expect(borders.radius.md).toBe('0.375rem');
      expect(borders.radius.lg).toBe('0.5rem');
      expect(borders.radius.xl).toBe('0.75rem');
      expect(borders.radius['2xl']).toBe('1rem');
      expect(borders.radius['3xl']).toBe('1.5rem');
      expect(borders.radius.full).toBe('9999px');
    });

    it('should have color variants', () => {
      expect(borders.colors).toBeDefined();
      expect(borders.colors.gray).toBeDefined();
      expect(borders.colors.primary).toBeDefined();
      expect(borders.colors.success).toBeDefined();
      expect(borders.colors.error).toBeDefined();
      expect(borders.colors.warning).toBeDefined();
      expect(borders.colors.info).toBeDefined();
    });
  });

  describe('transitions', () => {
    it('should export transitions object', () => {
      expect(transitions).toBeDefined();
      expect(typeof transitions).toBe('object');
    });

    it('should have duration variants', () => {
      expect(transitions.duration).toBeDefined();
      expect(transitions.duration.fast).toBe('150ms');
      expect(transitions.duration.DEFAULT).toBe('200ms');
      expect(transitions.duration.slow).toBe('300ms');
    });

    it('should have timing function variants', () => {
      expect(transitions.timing).toBeDefined();
      expect(transitions.timing.DEFAULT).toBe('ease-in-out');
      expect(transitions.timing.in).toBe('ease-in');
      expect(transitions.timing.out).toBe('ease-out');
      expect(transitions.timing.linear).toBe('linear');
    });
  });

  describe('opacities', () => {
    it('should export opacities object', () => {
      expect(opacities).toBeDefined();
      expect(typeof opacities).toBe('object');
    });

    it('should have all opacity values', () => {
      expect(opacities[0]).toBe('0');
      expect(opacities[5]).toBe('0.05');
      expect(opacities[10]).toBe('0.1');
      expect(opacities[25]).toBe('0.25');
      expect(opacities[50]).toBe('0.5');
      expect(opacities[75]).toBe('0.75');
      expect(opacities[100]).toBe('1');
    });

    it('should have opacity values between 0 and 1', () => {
      Object.values(opacities).forEach(value => {
        const numValue = parseFloat(value);
        expect(numValue).toBeGreaterThanOrEqual(0);
        expect(numValue).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('zIndex', () => {
    it('should export zIndex object', () => {
      expect(zIndex).toBeDefined();
      expect(typeof zIndex).toBe('object');
    });

    it('should have all z-index values', () => {
      expect(zIndex[0]).toBe('0');
      expect(zIndex[10]).toBe('10');
      expect(zIndex[20]).toBe('20');
      expect(zIndex[30]).toBe('30');
      expect(zIndex[40]).toBe('40');
      expect(zIndex[50]).toBe('50');
      expect(zIndex.auto).toBe('auto');
    });
  });

  describe('breakpoints', () => {
    it('should export breakpoints object', () => {
      expect(breakpoints).toBeDefined();
      expect(typeof breakpoints).toBe('object');
    });

    it('should have all breakpoint values', () => {
      expect(breakpoints.sm).toBe('640px');
      expect(breakpoints.md).toBe('768px');
      expect(breakpoints.lg).toBe('1024px');
      expect(breakpoints.xl).toBe('1280px');
      expect(breakpoints['2xl']).toBe('1536px');
    });

    it('should have px unit for all values', () => {
      Object.values(breakpoints).forEach(value => {
        expect(value).toMatch(/px$/);
      });
    });

    it('should have ascending breakpoint values', () => {
      const values = [
        parseInt(breakpoints.sm),
        parseInt(breakpoints.md),
        parseInt(breakpoints.lg),
        parseInt(breakpoints.xl),
        parseInt(breakpoints['2xl']),
      ];

      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });

  describe('maxWidth', () => {
    it('should export maxWidth object', () => {
      expect(maxWidth).toBeDefined();
      expect(typeof maxWidth).toBe('object');
    });

    it('should have all max-width values', () => {
      expect(maxWidth.xs).toBe('20rem');
      expect(maxWidth.sm).toBe('24rem');
      expect(maxWidth.md).toBe('28rem');
      expect(maxWidth.lg).toBe('32rem');
      expect(maxWidth.xl).toBe('36rem');
      expect(maxWidth['2xl']).toBe('42rem');
      expect(maxWidth['3xl']).toBe('48rem');
      expect(maxWidth['4xl']).toBe('56rem');
      expect(maxWidth['5xl']).toBe('64rem');
      expect(maxWidth['6xl']).toBe('72rem');
      expect(maxWidth['7xl']).toBe('80rem');
      expect(maxWidth.full).toBe('100%');
      expect(maxWidth.screen).toBe('100vw');
    });

    it('should have ascending max-width values (excluding full and screen)', () => {
      const remValues = [
        parseInt(maxWidth.xs),
        parseInt(maxWidth.sm),
        parseInt(maxWidth.md),
        parseInt(maxWidth.lg),
        parseInt(maxWidth.xl),
        parseInt(maxWidth['2xl']),
        parseInt(maxWidth['3xl']),
        parseInt(maxWidth['4xl']),
        parseInt(maxWidth['5xl']),
        parseInt(maxWidth['6xl']),
        parseInt(maxWidth['7xl']),
      ];

      for (let i = 1; i < remValues.length; i++) {
        expect(remValues[i]).toBeGreaterThan(remValues[i - 1]);
      }
    });
  });

  describe('Token Immutability', () => {
    it('should have const assertion to prevent modification', () => {
      // TypeScript const assertions make objects readonly
      // This test verifies the tokens are properly typed

      // @ts-expect-error - Should not be able to modify const objects
      const testModify = () => { colors.primary.DEFAULT = '#000000'; };

      // If TypeScript compilation succeeds with const assertions,
      // the above line will cause a compilation error
      expect(colors.primary.DEFAULT).toBe('#3F9BA6');
    });
  });

  describe('Token Exports', () => {
    it('should export all required token categories', () => {
      const exports = {
        colors,
        spacing,
        gaps,
        spaceY,
        typography,
        shadows,
        borders,
        transitions,
        opacities,
        zIndex,
        breakpoints,
        maxWidth,
      };

      Object.entries(exports).forEach(([name, value]) => {
        expect(value).toBeDefined();
        expect(typeof value).toBe('object');
      });
    });
  });
});
