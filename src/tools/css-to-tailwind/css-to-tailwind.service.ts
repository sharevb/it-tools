import { generate, parse, walk } from 'css-tree';
import type { CssNode, Declaration, Rule } from 'css-tree';
import { tailwindColors } from '../tailwind-colors/tailwind-colors.service';

// Create a reverse mapping from HEX color codes to Tailwind color names
const hexToTailwindMap: Record<string, string> = {};
tailwindColors.forEach((color) => {
  const colorName = color.name.toLowerCase();
  Object.entries(color.shades).forEach(([shade, hex]) => {
    hexToTailwindMap[hex.toLowerCase()] = `${colorName}-${shade}`;
  });
});

interface TransformPattern {
  regex: RegExp
  format: (match: RegExpExecArray) => string
}

const TRANSFORM_PATTERNS: TransformPattern[] = [
  { regex: /^scale\(([^)]+)\)$/, format: m => `scale-[${m[1]}]` },
  { regex: /^translateX\(([^)]+)\)$/, format: m => `translate-x-[${m[1]}]` },
  { regex: /^translateY\(([^)]+)\)$/, format: m => `translate-y-[${m[1]}]` },
  { regex: /^rotate\(([^)]+)\)$/, format: m => `rotate-[${m[1]}]` },
  { regex: /^skewX\(([^)]+)\)$/, format: m => `skew-x-[${m[1]}]` },
  { regex: /^skewY\(([^)]+)\)$/, format: m => `skew-y-[${m[1]}]` },
];

function mapTransform(value: string): string | null {
  for (const { regex, format } of TRANSFORM_PATTERNS) {
    const m = regex.exec(value);
    if (m) {
      return format(m);
    }
  }
  return null;
}

const SPACING_SCALE: Record<string, string> = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

const SPACING_ALIAS: Record<string, string> = {
  '0.25rem': '1',
  '0.5rem': '2',
  '0.75rem': '3',
  '1rem': '4',
  '1.25rem': '5',
  '1.5rem': '6',
  '2rem': '8',
  '2.5rem': '10',
  '3rem': '12',
  '4rem': '16',
  '5rem': '20',
  '6rem': '24',
  '8rem': '32',
};

function resolveSpacingToken(raw: string): string | null {
  if (SPACING_SCALE[raw]) {
    return raw;
  }
  if (SPACING_ALIAS[raw]) {
    return SPACING_ALIAS[raw];
  }
  return null;
}

function mapSpacing(prefix: string, value: string, remInPx: number = 16): string {
  if (value === 'auto') {
    return `${prefix}-auto`;
  }

  // Handle px values by converting them to rem and then mapping to Tailwind units
  if (value.endsWith('px')) {
    const pxValue = Number.parseFloat(value.replace('px', ''));
    const remValue = pxValue / remInPx;
    const remValueStr = `${remValue}rem`;

    // Check if the rem value exists in our spacing alias map
    if (SPACING_ALIAS[remValueStr]) {
      const token = SPACING_ALIAS[remValueStr];
      if (token === '0') {
        return `${prefix}-0`;
      }
      return `${prefix}-${token}`;
    }
    // If the rem value is not in the alias map, fall through to handle as arbitrary value
  }

  const token = resolveSpacingToken(value);
  if (token === null) {
    return `${prefix}-[${value}]`;
  }
  if (token === '0') {
    return `${prefix}-0`;
  }
  return `${prefix}-${token}`;
}

function expandBoxShorthand(values: string[]): {
  top: string
  right: string
  bottom: string
  left: string
} {
  const [v1, v2 = v1, v3 = v1, v4 = v2] = values;
  return { top: v1, right: v2, bottom: v3, left: v4 };
}

export interface ConvertedClass {
  className: string
  pseudoClass: string | null
  tailwindClasses: string[]
}

/**
 * Converts CSS string to an array of objects containing class names and their corresponding Tailwind CSS classes.
 * @param css The CSS string to convert.
 * @param remInPx The number of pixels that represent 1rem. Defaults to 16.
 * @returns An array of objects with className and tailwindClasses.
 */
export function convertCssToTailwind(css: string, remInPx: number = 16): ConvertedClass[] {
  try {
    const ast = parse(css, {
      parseValue: true,
      parseRulePrelude: true,
    });

    const results: ConvertedClass[] = [];

    // Create a dynamic mapping function that has access to remInPx
    const createCssToTailwindMap = (remInPx: number) => ({
      'background': (value: string) => {
        // Normalize the value to check for hex colors
        const normalizedValue = value.toLowerCase().trim();

        // Check if the value is a hex color that exists in our map
        if (normalizedValue.startsWith('#')) {
          const hexCode = normalizedValue;
          if (hexToTailwindMap[hexCode]) {
            return `bg-${hexToTailwindMap[hexCode]}`;
          }
        }

        // Handle named colors like 'red', 'blue', etc.
        const colorName = normalizedValue;
        if (['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'].includes(colorName)) {
          return `bg-${colorName}-500`;
        }

        // For other color values (hex, rgb, etc.), use arbitrary value
        return `bg-[${value}]`;
      },
      'background-color': (value: string) => {
        // Normalize the value to check for hex colors
        const normalizedValue = value.toLowerCase().trim();

        // Check if the value is a hex color that exists in our map
        if (normalizedValue.startsWith('#')) {
          const hexCode = normalizedValue;
          if (hexToTailwindMap[hexCode]) {
            return `bg-${hexToTailwindMap[hexCode]}`;
          }
        }

        // Handle named colors like 'red', 'blue', etc.
        const colorName = normalizedValue;
        if (['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'].includes(colorName)) {
          return `bg-${colorName}-500`;
        }

        // For other color values (hex, rgb, etc.), use arbitrary value
        return `bg-[${value}]`;
      },
      'color': (value: string) => {
        // Normalize the value to check for hex colors
        const normalizedValue = value.toLowerCase().trim();

        // Check if the value is a hex color that exists in our map
        if (normalizedValue.startsWith('#')) {
          const hexCode = normalizedValue;
          if (hexToTailwindMap[hexCode]) {
            return `text-${hexToTailwindMap[hexCode]}`;
          }
        }

        // Handle named colors like 'red', 'blue', etc.
        const colorName = normalizedValue;
        if (['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'].includes(colorName)) {
          return `text-${colorName}-500`;
        }

        // For other color values (hex, rgb, etc.), use arbitrary value
        return `text-[${value}]`;
      },
      'font-size': (value: string) => {
        // Map common font sizes to predefined Tailwind classes first
        const fontSizeMap: Record<string, string> = {
          'xs': 'text-xs',
          'sm': 'text-sm',
          'base': 'text-base',
          'lg': 'text-lg',
          'xl': 'text-xl',
          '2xl': 'text-2xl',
          '3xl': 'text-3xl',
          '4xl': 'text-4xl',
          '5xl': 'text-5xl',
          '6xl': 'text-6xl',
          '7xl': 'text-7xl',
          '8xl': 'text-8xl',
          '9xl': 'text-9xl',
          '0.75rem': 'text-xs',
          '0.875rem': 'text-sm',
          '1rem': 'text-base',
          '1.125rem': 'text-lg',
          '1.25rem': 'text-xl',
          '1.5rem': 'text-2xl',
          '1.875rem': 'text-3xl',
          '2.25rem': 'text-4xl',
          '3rem': 'text-5xl',
          '3.75rem': 'text-6xl',
          '4.5rem': 'text-7xl',
          '6rem': 'text-8xl',
          '8rem': 'text-9xl',
        };

        // Check if the value maps to a predefined class
        if (fontSizeMap[value]) {
          return fontSizeMap[value];
        }

        // Use arbitrary value as fallback
        return `text-[${value}]`;
      },
      'padding': (value: string) => {
        const parts = value.trim().split(/\s+/);
        const { top, right, bottom, left } = expandBoxShorthand(parts);

        if (parts.length === 1) {
          return mapSpacing('p', top, remInPx);
        }
        if (parts.length === 2) {
          return `${mapSpacing('py', top, remInPx)} ${mapSpacing('px', right, remInPx)}`;
        }
        if (parts.length === 3) {
          return `${mapSpacing('pt', top, remInPx)} ${mapSpacing('px', right, remInPx)} ${mapSpacing('pb', bottom, remInPx)}`;
        }
        // 4+
        return [
          mapSpacing('pt', top, remInPx),
          mapSpacing('pr', right, remInPx),
          mapSpacing('pb', bottom, remInPx),
          mapSpacing('pl', left, remInPx),
        ].join(' ');
      },
      'padding-left': (v: string) => mapSpacing('pl', v, remInPx),
      'padding-right': (v: string) => mapSpacing('pr', v, remInPx),
      'padding-top': (v: string) => mapSpacing('pt', v, remInPx),
      'padding-bottom': (v: string) => mapSpacing('pb', v, remInPx),
      'margin': (value: string) => {
        const parts = value.trim().split(/\s+/);
        const { top, right, bottom, left } = expandBoxShorthand(parts);

        if (parts.length === 1) {
          return mapSpacing('m', top, remInPx);
        }
        if (parts.length === 2) {
          return `${mapSpacing('my', top, remInPx)} ${mapSpacing('mx', right, remInPx)}`;
        }
        if (parts.length === 3) {
          return `${mapSpacing('mt', top, remInPx)} ${mapSpacing('mx', right, remInPx)} ${mapSpacing('mb', bottom, remInPx)}`;
        }
        // 4+
        return [
          mapSpacing('mt', top, remInPx),
          mapSpacing('mr', right, remInPx),
          mapSpacing('mb', bottom, remInPx),
          mapSpacing('ml', left, remInPx),
        ].join(' ');
      },
      'margin-left': (v: string) => mapSpacing('ml', v, remInPx),
      'margin-right': (v: string) => mapSpacing('mr', v, remInPx),
      'margin-top': (v: string) => mapSpacing('mt', v, remInPx),
      'margin-bottom': (v: string) => mapSpacing('mb', v, remInPx),
      'border-radius': (value: string) => {
        // Map common border radius values to predefined Tailwind classes first
        const borderRadiusMap: Record<string, string> = {
          '0': 'rounded-none',
          '0.125rem': 'rounded-sm', // 2px
          '0.25rem': 'rounded', // 4px
          '0.375rem': 'rounded-md', // 6px
          '0.5rem': 'rounded-lg', // 8px
          '0.75rem': 'rounded-xl', // 12px
          '1rem': 'rounded-2xl', // 16px
          '1.5rem': 'rounded-3xl', // 24px
          '9999px': 'rounded-full', // full
          'sm': 'rounded-sm',
          'md': 'rounded-md',
          'lg': 'rounded-lg',
          'xl': 'rounded-xl',
          '2xl': 'rounded-2xl',
          '3xl': 'rounded-3xl',
          'full': 'rounded-full',
        };

        // Check if the value maps to a predefined class
        if (borderRadiusMap[value]) {
          return borderRadiusMap[value];
        }

        // Use arbitrary value as fallback
        return `rounded-[${value}]`;
      },
      'font-weight': (value: string) => {
        // Map common font weights to predefined Tailwind classes first
        const fontWeightMap: Record<string, string> = {
          normal: 'font-normal',
          bold: 'font-bold',
          100: 'font-thin',
          200: 'font-extralight',
          300: 'font-light',
          400: 'font-normal',
          500: 'font-medium',
          600: 'font-semibold',
          700: 'font-bold',
          800: 'font-extrabold',
          900: 'font-black',
        };

        // Check if the value maps to a predefined class
        if (fontWeightMap[value]) {
          return fontWeightMap[value];
        }

        // Use arbitrary value as fallback
        return `font-[${value}]`;
      },
      'text-align': (value: string) => {
        const alignMap: Record<string, string> = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right',
          justify: 'text-justify',
        };
        return alignMap[value as keyof typeof alignMap] || null;
      },
      'box-shadow': (value: string) => {
        // Replace spaces with underscores for box-shadow arbitrary values
        const formattedValue = value.replace(/\s+/g, '_');
        return `[box-shadow:${formattedValue}]`;
      },
      'width': (value: string) => {
        return `w-[${value}]`;
      },
      'height': (value: string) => {
        return `h-[${value}]`;
      },
      'min-width': (value: string) => {
        return `min-w-[${value}]`;
      },
      'min-height': (value: string) => {
        return `min-h-[${value}]`;
      },
      'max-width': (value: string) => {
        return `max-w-[${value}]`;
      },
      'max-height': (value: string) => {
        return `max-h-[${value}]`;
      },
      'display': (value: string) => {
        if (value === 'inline-block') {
          return 'inline-block';
        }
        return null;
      },
      'text-decoration': (value: string) => {
        if (value === 'none') {
          return 'no-underline';
        }
        return null;
      },
      'transition': (value: string) => {
        // Convert transition properties to arbitrary values
        return `[transition:${value}]`;
      },
      'outline': (value: string) => {
        // Convert outline properties to arbitrary property syntax
        return `[outline:${value.replace(/\s+/g, '_')}]`;
      },
      'outline-offset': (value: string) => {
        // Convert outline-offset properties to arbitrary values with proper Tailwind format
        return `outline-offset-[${value}]`;
      },
      'transform': (value: string) => {
        // handle multi-param translate()/skew() as special cases
        if (value.startsWith('translate(')) {
          // keep your existing 1/2 param logic here
          const params = value.match(/\(([^)]+)\)/)?.[1]?.split(/\s*,\s*|\s+/) || [];
          if (params.length === 1) {
            return `translate-x-[${params[0]}]`;
          }
          if (params.length === 2) {
            return `translate-x-[${params[0]}] translate-y-[${params[1]}]`;
          }
          return `[transform:translate(${params.join(',')})]`;
        }
        else if (value.startsWith('skew(')) {
          // existing skew 1/2 param logic
          const params = value.match(/\(([^)]+)\)/)?.[1]?.split(/\s*,\s*|\s+/) || [];
          if (params.length === 1) {
            return `skew-x-[${params[0]}]`;
          }
          if (params.length === 2) {
            return `skew-x-[${params[0]}] skew-y-[${params[1]}]`;
          }
          return `[transform:skew(${params.join(',')})]`;
        }

        const simple = mapTransform(value);
        if (simple) {
          return simple;
        }

        return `[transform:${value.replace(/\s+/g, '_')}]`;
      },
      'cursor': (value: string) => {
        const cursorMap: Record<string, string> = {
          'pointer': 'cursor-pointer',
          'default': 'cursor-default',
          'wait': 'cursor-wait',
          'text': 'cursor-text',
          'move': 'cursor-move',
          'not-allowed': 'cursor-not-allowed',
          'help': 'cursor-help',
        };
        return cursorMap[value as keyof typeof cursorMap] || null;
      },
      // Add more mappings as needed...
    });

    const cssToTailwindMapWithRem = createCssToTailwindMap(remInPx);

    walk(ast, (node: CssNode) => {
      if (node.type === 'Rule') {
        const rule = node as Rule;

        // Extract selector from the rule's prelude
        if (rule.prelude && rule.prelude.type === 'SelectorList') {
          // Walk through the selector list to find class selectors and pseudo-classes
          walk(rule.prelude, (selectorNode: CssNode) => {
            if (selectorNode.type === 'Selector') {
              let className = '';
              let pseudoClassPrefix = '';
              let pseudoClass = null;

              // Process each child of the selector to extract class names and pseudo-classes
              selectorNode.children.forEach((child: CssNode) => {
                if (child.type === 'ClassSelector') {
                  className = child.name;
                }
                else if (child.type === 'PseudoClassSelector') {
                  // Map CSS pseudo-class to Tailwind variant
                  const pseudoClassValue = child.name;
                  pseudoClass = pseudoClassValue;
                  pseudoClassPrefix = pseudoToPrefix(pseudoClassValue);
                }
              });

              if (className) {
                const tailwindClasses: string[] = [];

                if (rule.block && rule.block.children) {
                  rule.block.children.forEach((childNode: CssNode) => {
                    if (childNode.type === 'Declaration') {
                      const decl = childNode as Declaration;
                      const { property } = decl;
                      // Properly extract the value string from the CSS AST using generate
                      const originalValue = generate(decl.value);

                      // For spacing properties, keep the original value to allow px-to-unit conversion in mapSpacing
                      // For other properties, convert rem to px
                      const isSpacingProperty = [
                        'padding', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
                        'margin', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
                      ].includes(property);

                      const processedValue = isSpacingProperty ? originalValue : convertRemToPx(originalValue, remInPx);

                      const tailwindClassFn = cssToTailwindMapWithRem[property as keyof typeof cssToTailwindMapWithRem];
                      if (tailwindClassFn) {
                        const tailwindClass = tailwindClassFn(processedValue);
                        if (tailwindClass) {
                          // Apply the pseudo-class prefix to the tailwind class
                          const prefixedClass = pseudoClassPrefix ? `${pseudoClassPrefix}${tailwindClass}` : tailwindClass;
                          tailwindClasses.push(prefixedClass);
                        }
                        else {
                          // If no direct mapping found, add a comment or placeholder
                          tailwindClasses.push(`/* ${property}: ${processedValue} */`);
                        }
                      }
                      else {
                        // Property not mapped, add a comment
                        tailwindClasses.push(`/* ${property}: ${processedValue} */`);
                      }
                    }
                  });
                }

                results.push({ className, pseudoClass, tailwindClasses });
              }
            }
          });
        }
      }
    });
    return results;
  }
  catch (error) {
    console.error('Error parsing CSS:', error);
    return []; // Return an empty array on error
  }
}

const PSEUDO_TO_VARIANT: Record<string, string> = {
  'hover': 'hover:',
  'focus': 'focus:',
  'active': 'active:',
  'visited': 'visited:',
  'focus-visible': 'focus-visible:',
  'focus-within': 'focus-within:',
  'first': 'first:',
  'last': 'last:',
  'disabled': 'disabled:',
  'checked': 'checked:',
  'group-hover': 'group-hover:',
  'group-focus': 'group-focus:',
};

function pseudoToPrefix(pseudo: string): string {
  return PSEUDO_TO_VARIANT[pseudo] ?? `${pseudo}:`;
}

/**
 * Converts rem values to px based on the provided ratio
 * @param value The CSS value that may contain rem units
 * @param remInPx The number of pixels that represent 1rem
 * @returns The converted value with rem units converted to px
 */
function convertRemToPx(value: string, remInPx: number): string {
  // Check if the value contains rem units
  if (value.includes('rem')) {
    // Use regex to find all rem values and convert them to px
    return value.replace(/(\d*\.?\d+)rem/g, (match, remValue) => {
      const pxValue = Number.parseFloat(remValue) * remInPx;
      return `${pxValue}px`;
    });
  }
  return value;
}
