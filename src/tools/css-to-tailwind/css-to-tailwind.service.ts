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

// Define a mapping from CSS properties to Tailwind CSS classes
const cssToTailwindMap: Record<string, (value: string) => string | null> = {
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
    // Split the value by spaces to handle shorthand properties
    const values = value.trim().split(/\s+/);

    if (values.length === 1) {
      // Single value: padding: 8px -> p-[8px]
      const singleValue = values[0];
      // Map common padding values to predefined Tailwind classes first
      const paddingMap: Record<string, string> = {
        '0': 'p-0',
        '1': 'p-1', // 4px
        '2': 'p-2', // 8px
        '3': 'p-3', // 12px
        '4': 'p-4', // 16px
        '5': 'p-5', // 20px
        '6': 'p-6', // 24px
        '8': 'p-8', // 32px
        '10': 'p-10', // 40px
        '12': 'p-12', // 48px
        '16': 'p-16', // 64px
        '20': 'p-20', // 80px
        '24': 'p-24', // 96px
        '32': 'p-32', // 128px
        '0.25rem': 'p-1', // 4px
        '0.5rem': 'p-2', // 8px
        '0.75rem': 'p-3', // 12px
        '1rem': 'p-4', // 16px
        '1.25rem': 'p-5', // 20px
        '1.5rem': 'p-6', // 24px
        '2rem': 'p-8', // 32px
        '2.5rem': 'p-10', // 40px
        '3rem': 'p-12', // 48px
        '4rem': 'p-16', // 64px
        '5rem': 'p-20', // 80px
        '6rem': 'p-24', // 96px
        '8rem': 'p-32', // 128px
      };

      // Check if the value maps to a predefined class
      if (paddingMap[singleValue]) {
        return paddingMap[singleValue];
      }

      // Use arbitrary value as fallback
      return `p-[${singleValue}]`;
    }
    else if (values.length === 2) {
      // Two values: padding: 8px 16px -> py-[8px] px-[16px]
      const vertical = values[0];
      const horizontal = values[1];

      // Apply same mapping logic for each value
      const paddingMap: Record<string, string> = {
        '0': 'p-0',
        '1': 'p-1', // 4px
        '2': 'p-2', // 8px
        '3': 'p-3', // 12px
        '4': 'p-4', // 16px
        '5': 'p-5', // 20px
        '6': 'p-6', // 24px
        '8': 'p-8', // 32px
        '10': 'p-10', // 40px
        '12': 'p-12', // 48px
        '16': 'p-16', // 64px
        '20': 'p-20', // 80px
        '24': 'p-24', // 96px
        '32': 'p-32', // 128px
        '0.25rem': 'p-1', // 4px
        '0.5rem': 'p-2', // 8px
        '0.75rem': 'p-3', // 12px
        '1rem': 'p-4', // 16px
        '1.25rem': 'p-5', // 20px
        '1.5rem': 'p-6', // 24px
        '2rem': 'p-8', // 32px
        '2.5rem': 'p-10', // 40px
        '3rem': 'p-12', // 48px
        '4rem': 'p-16', // 64px
        '5rem': 'p-20', // 80px
        '6rem': 'p-24', // 96px
        '8rem': 'p-32', // 128px
      };

      // Handle the mapping for vertical value
      let verticalResult = `py-[${vertical}]`;
      if (paddingMap[vertical]) {
        if (vertical === '0') {
          verticalResult = 'py-0';
        }
        else {
          verticalResult = paddingMap[vertical].replace('p-', 'py-');
        }
      }
      else {
        verticalResult = `py-[${vertical}]`;
      }

      // Handle the mapping for horizontal value
      let horizontalResult = `px-[${horizontal}]`;
      if (paddingMap[horizontal]) {
        if (horizontal === '0') {
          horizontalResult = 'px-0';
        }
        else {
          horizontalResult = paddingMap[horizontal].replace('p-', 'px-');
        }
      }
      else {
        horizontalResult = `px-[${horizontal}]`;
      }

      return `${verticalResult} ${horizontalResult}`;
    }
    else if (values.length === 3) {
      // Three values: padding: 8px 16px 12px -> pt-[8px] px-[16px] pb-[12px]
      const top = values[0];
      const horizontal = values[1];
      const bottom = values[2];

      const paddingMap: Record<string, string> = {
        '0': 'p-0',
        '1': 'p-1', // 4px
        '2': 'p-2', // 8px
        '3': 'p-3', // 12px
        '4': 'p-4', // 16px
        '5': 'p-5', // 20px
        '6': 'p-6', // 24px
        '8': 'p-8', // 32px
        '10': 'p-10', // 40px
        '12': 'p-12', // 48px
        '16': 'p-16', // 64px
        '20': 'p-20', // 80px
        '24': 'p-24', // 96px
        '32': 'p-32', // 128px
        '0.25rem': 'p-1', // 4px
        '0.5rem': 'p-2', // 8px
        '0.75rem': 'p-3', // 12px
        '1rem': 'p-4', // 16px
        '1.25rem': 'p-5', // 20px
        '1.5rem': 'p-6', // 24px
        '2rem': 'p-8', // 32px
        '2.5rem': 'p-10', // 40px
        '3rem': 'p-12', // 48px
        '4rem': 'p-16', // 64px
        '5rem': 'p-20', // 80px
        '6rem': 'p-24', // 96px
        '8rem': 'p-32', // 128px
      };

      let topResult = `pt-[${top}]`;
      if (paddingMap[top]) {
        if (top === '0') {
          topResult = 'pt-0';
        }
        else {
          topResult = paddingMap[top].replace('p-', 'pt-');
        }
      }

      let horizontalResult = `px-[${horizontal}]`;
      if (paddingMap[horizontal]) {
        if (horizontal === '0') {
          horizontalResult = 'px-0';
        }
        else {
          horizontalResult = paddingMap[horizontal].replace('p-', 'px-');
        }
      }

      let bottomResult = `pb-[${bottom}]`;
      if (paddingMap[bottom]) {
        if (bottom === '0') {
          bottomResult = 'pb-0';
        }
        else {
          bottomResult = paddingMap[bottom].replace('p-', 'pb-');
        }
      }

      return `${topResult} ${horizontalResult} ${bottomResult}`;
    }
    else if (values.length === 4) {
      // Four values: padding: 8px 16px 12px 20px -> pt-[8px] pr-[16px] pb-[12px] pl-[20px]
      const top = values[0];
      const right = values[1];
      const bottom = values[2];
      const left = values[3];

      const paddingMap: Record<string, string> = {
        '0': 'p-0',
        '1': 'p-1', // 4px
        '2': 'p-2', // 8px
        '3': 'p-3', // 12px
        '4': 'p-4', // 16px
        '5': 'p-5', // 20px
        '6': 'p-6', // 24px
        '8': 'p-8', // 32px
        '10': 'p-10', // 40px
        '12': 'p-12', // 48px
        '16': 'p-16', // 64px
        '20': 'p-20', // 80px
        '24': 'p-24', // 96px
        '32': 'p-32', // 128px
        '0.25rem': 'p-1', // 4px
        '0.5rem': 'p-2', // 8px
        '0.75rem': 'p-3', // 12px
        '1rem': 'p-4', // 16px
        '1.25rem': 'p-5', // 20px
        '1.5rem': 'p-6', // 24px
        '2rem': 'p-8', // 32px
        '2.5rem': 'p-10', // 40px
        '3rem': 'p-12', // 48px
        '4rem': 'p-16', // 64px
        '5rem': 'p-20', // 80px
        '6rem': 'p-24', // 96px
        '8rem': 'p-32', // 128px
      };

      let topResult = `pt-[${top}]`;
      if (paddingMap[top]) {
        if (top === '0') {
          topResult = 'pt-0';
        }
        else {
          topResult = paddingMap[top].replace('p-', 'pt-');
        }
      }

      let rightResult = `pr-[${right}]`;
      if (paddingMap[right]) {
        if (right === '0') {
          rightResult = 'pr-0';
        }
        else {
          rightResult = paddingMap[right].replace('p-', 'pr-');
        }
      }

      let bottomResult = `pb-[${bottom}]`;
      if (paddingMap[bottom]) {
        if (bottom === '0') {
          bottomResult = 'pb-0';
        }
        else {
          bottomResult = paddingMap[bottom].replace('p-', 'pb-');
        }
      }

      let leftResult = `pl-[${left}]`;
      if (paddingMap[left]) {
        if (left === '0') {
          leftResult = 'pl-0';
        }
        else {
          leftResult = paddingMap[left].replace('p-', 'pl-');
        }
      }

      return `${topResult} ${rightResult} ${bottomResult} ${leftResult}`;
    }

    // If value doesn't match expected patterns, return as is
    return `p-[${value}]`;
  },
  'padding-left': (value: string) => {
    // Map common padding values to predefined Tailwind classes first
    const paddingLeftMap: Record<string, string> = {
      '0': 'pl-0',
      '1': 'pl-1', // 4px
      '2': 'pl-2', // 8px
      '3': 'pl-3', // 12px
      '4': 'pl-4', // 16px
      '5': 'pl-5', // 20px
      '6': 'pl-6', // 24px
      '8': 'pl-8', // 32px
      '10': 'pl-10', // 40px
      '12': 'pl-12', // 48px
      '16': 'pl-16', // 64px
      '20': 'pl-20', // 80px
      '24': 'pl-24', // 96px
      '32': 'pl-32', // 128px
      '0.25rem': 'pl-1', // 4px
      '0.5rem': 'pl-2', // 8px
      '0.75rem': 'pl-3', // 12px
      '1rem': 'pl-4', // 16px
      '1.25rem': 'pl-5', // 20px
      '1.5rem': 'pl-6', // 24px
      '2rem': 'pl-8', // 32px
      '2.5rem': 'pl-10', // 40px
      '3rem': 'pl-12', // 48px
      '4rem': 'pl-16', // 64px
      '5rem': 'pl-20', // 80px
      '6rem': 'pl-24', // 96px
      '8rem': 'pl-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (paddingLeftMap[value]) {
      return paddingLeftMap[value];
    }

    // Use arbitrary value as fallback
    return `pl-[${value}]`;
  },
  'padding-right': (value: string) => {
    // Map common padding values to predefined Tailwind classes first
    const paddingRightMap: Record<string, string> = {
      '0': 'pr-0',
      '1': 'pr-1', // 4px
      '2': 'pr-2', // 8px
      '3': 'pr-3', // 12px
      '4': 'pr-4', // 16px
      '5': 'pr-5', // 20px
      '6': 'pr-6', // 24px
      '8': 'pr-8', // 32px
      '10': 'pr-10', // 40px
      '12': 'pr-12', // 48px
      '16': 'pr-16', // 64px
      '20': 'pr-20', // 80px
      '24': 'pr-24', // 96px
      '32': 'pr-32', // 128px
      '0.25rem': 'pr-1', // 4px
      '0.5rem': 'pr-2', // 8px
      '0.75rem': 'pr-3', // 12px
      '1rem': 'pr-4', // 16px
      '1.25rem': 'pr-5', // 20px
      '1.5rem': 'pr-6', // 24px
      '2rem': 'pr-8', // 32px
      '2.5rem': 'pr-10', // 40px
      '3rem': 'pr-12', // 48px
      '4rem': 'pr-16', // 64px
      '5rem': 'pr-20', // 80px
      '6rem': 'pr-24', // 96px
      '8rem': 'pr-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (paddingRightMap[value]) {
      return paddingRightMap[value];
    }

    // Use arbitrary value as fallback
    return `pr-[${value}]`;
  },
  'padding-top': (value: string) => {
    // Map common padding values to predefined Tailwind classes first
    const paddingTopMap: Record<string, string> = {
      '0': 'pt-0',
      '1': 'pt-1', // 4px
      '2': 'pt-2', // 8px
      '3': 'pt-3', // 12px
      '4': 'pt-4', // 16px
      '5': 'pt-5', // 20px
      '6': 'pt-6', // 24px
      '8': 'pt-8', // 32px
      '10': 'pt-10', // 40px
      '12': 'pt-12', // 48px
      '16': 'pt-16', // 64px
      '20': 'pt-20', // 80px
      '24': 'pt-24', // 96px
      '32': 'pt-32', // 128px
      '0.25rem': 'pt-1', // 4px
      '0.5rem': 'pt-2', // 8px
      '0.75rem': 'pt-3', // 12px
      '1rem': 'pt-4', // 16px
      '1.25rem': 'pt-5', // 20px
      '1.5rem': 'pt-6', // 24px
      '2rem': 'pt-8', // 32px
      '2.5rem': 'pt-10', // 40px
      '3rem': 'pt-12', // 48px
      '4rem': 'pt-16', // 64px
      '5rem': 'pt-20', // 80px
      '6rem': 'pt-24', // 96px
      '8rem': 'pt-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (paddingTopMap[value]) {
      return paddingTopMap[value];
    }

    // Use arbitrary value as fallback
    return `pt-[${value}]`;
  },
  'padding-bottom': (value: string) => {
    // Map common padding values to predefined Tailwind classes first
    const paddingBottomMap: Record<string, string> = {
      '0': 'pb-0',
      '1': 'pb-1', // 4px
      '2': 'pb-2', // 8px
      '3': 'pb-3', // 12px
      '4': 'pb-4', // 16px
      '5': 'pb-5', // 20px
      '6': 'pb-6', // 24px
      '8': 'pb-8', // 32px
      '10': 'pb-10', // 40px
      '12': 'pb-12', // 48px
      '16': 'pb-16', // 64px
      '20': 'pb-20', // 80px
      '24': 'pb-24', // 96px
      '32': 'pb-32', // 128px
      '0.25rem': 'pb-1', // 4px
      '0.5rem': 'pb-2', // 8px
      '0.75rem': 'pb-3', // 12px
      '1rem': 'pb-4', // 16px
      '1.25rem': 'pb-5', // 20px
      '1.5rem': 'pb-6', // 24px
      '2rem': 'pb-8', // 32px
      '2.5rem': 'pb-10', // 40px
      '3rem': 'pb-12', // 48px
      '4rem': 'pb-16', // 64px
      '5rem': 'pb-20', // 80px
      '6rem': 'pb-24', // 96px
      '8rem': 'pb-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (paddingBottomMap[value]) {
      return paddingBottomMap[value];
    }

    // Use arbitrary value as fallback
    return `pb-[${value}]`;
  },
  'margin': (value: string) => {
    // Split the value by spaces to handle shorthand properties
    const values = value.trim().split(/\s+/);

    if (values.length === 1) {
      // Single value: margin: 8px -> m-[8px]
      const singleValue = values[0];
      // Map common margin values to predefined Tailwind classes first
      const marginMap: Record<string, string> = {
        '0': 'm-0',
        '1': 'm-1', // 4px
        '2': 'm-2', // 8px
        '3': 'm-3', // 12px
        '4': 'm-4', // 16px
        '5': 'm-5', // 20px
        '6': 'm-6', // 24px
        '8': 'm-8', // 32px
        '10': 'm-10', // 40px
        '12': 'm-12', // 48px
        '16': 'm-16', // 64px
        '20': 'm-20', // 80px
        '24': 'm-24', // 96px
        '32': 'm-32', // 128px
        'auto': 'm-auto',
        '0.25rem': 'm-1', // 4px
        '0.5rem': 'm-2', // 8px
        '0.75rem': 'm-3', // 12px
        '1rem': 'm-4', // 16px
        '1.25rem': 'm-5', // 20px
        '1.5rem': 'm-6', // 24px
        '2rem': 'm-8', // 32px
        '2.5rem': 'm-10', // 40px
        '3rem': 'm-12', // 48px
        '4rem': 'm-16', // 64px
        '5rem': 'm-20', // 80px
        '6rem': 'm-24', // 96px
        '8rem': 'm-32', // 128px
      };

      // Check if the value maps to a predefined class
      if (marginMap[singleValue]) {
        return marginMap[singleValue];
      }

      // Use arbitrary value as fallback
      return `m-[${singleValue}]`;
    }
    else if (values.length === 2) {
      // Two values: margin: 8px 16px -> my-[8px] mx-[16px]
      const vertical = values[0];
      const horizontal = values[1];

      // Apply same mapping logic for each value
      const marginMap: Record<string, string> = {
        '0': 'm-0',
        '1': 'm-1', // 4px
        '2': 'm-2', // 8px
        '3': 'm-3', // 12px
        '4': 'm-4', // 16px
        '5': 'm-5', // 20px
        '6': 'm-6', // 24px
        '8': 'm-8', // 32px
        '10': 'm-10', // 40px
        '12': 'm-12', // 48px
        '16': 'm-16', // 64px
        '20': 'm-20', // 80px
        '24': 'm-24', // 96px
        '32': 'm-32', // 128px
        'auto': 'm-auto',
        '0.25rem': 'm-1', // 4px
        '0.5rem': 'm-2', // 8px
        '0.75rem': 'm-3', // 12px
        '1rem': 'm-4', // 16px
        '1.25rem': 'm-5', // 20px
        '1.5rem': 'm-6', // 24px
        '2rem': 'm-8', // 32px
        '2.5rem': 'm-10', // 40px
        '3rem': 'm-12', // 48px
        '4rem': 'm-16', // 64px
        '5rem': 'm-20', // 80px
        '6rem': 'm-24', // 96px
        '8rem': 'm-32', // 128px
      };

      // Handle the mapping for vertical value
      let verticalResult = `my-[${vertical}]`;
      if (marginMap[vertical]) {
        if (vertical === '0') {
          verticalResult = 'my-0';
        }
        else if (vertical === 'auto') {
          verticalResult = 'my-auto';
        }
        else {
          verticalResult = marginMap[vertical].replace('m-', 'my-');
        }
      }
      else {
        verticalResult = `my-[${vertical}]`;
      }

      // Handle the mapping for horizontal value
      let horizontalResult = `mx-[${horizontal}]`;
      if (marginMap[horizontal]) {
        if (horizontal === '0') {
          horizontalResult = 'mx-0';
        }
        else if (horizontal === 'auto') {
          horizontalResult = 'mx-auto';
        }
        else {
          horizontalResult = marginMap[horizontal].replace('m-', 'mx-');
        }
      }
      else {
        horizontalResult = `mx-[${horizontal}]`;
      }

      return `${verticalResult} ${horizontalResult}`;
    }
    else if (values.length === 3) {
      // Three values: margin: 8px 16px 12px -> mt-[8px] mx-[16px] mb-[12px]
      const top = values[0];
      const horizontal = values[1];
      const bottom = values[2];

      const marginMap: Record<string, string> = {
        '0': 'm-0',
        '1': 'm-1', // 4px
        '2': 'm-2', // 8px
        '3': 'm-3', // 12px
        '4': 'm-4', // 16px
        '5': 'm-5', // 20px
        '6': 'm-6', // 24px
        '8': 'm-8', // 32px
        '10': 'm-10', // 40px
        '12': 'm-12', // 48px
        '16': 'm-16', // 64px
        '20': 'm-20', // 80px
        '24': 'm-24', // 96px
        '32': 'm-32', // 128px
        'auto': 'm-auto',
        '0.25rem': 'm-1', // 4px
        '0.5rem': 'm-2', // 8px
        '0.75rem': 'm-3', // 12px
        '1rem': 'm-4', // 16px
        '1.25rem': 'm-5', // 20px
        '1.5rem': 'm-6', // 24px
        '2rem': 'm-8', // 32px
        '2.5rem': 'm-10', // 40px
        '3rem': 'm-12', // 48px
        '4rem': 'm-16', // 64px
        '5rem': 'm-20', // 80px
        '6rem': 'm-24', // 96px
        '8rem': 'm-32', // 128px
      };

      let topResult = `mt-[${top}]`;
      if (marginMap[top]) {
        if (top === '0') {
          topResult = 'mt-0';
        }
        else if (top === 'auto') {
          topResult = 'mt-auto';
        }
        else {
          topResult = marginMap[top].replace('m-', 'mt-');
        }
      }
      else {
        topResult = `mt-[${top}]`;
      }

      let horizontalResult = `mx-[${horizontal}]`;
      if (marginMap[horizontal]) {
        if (horizontal === '0') {
          horizontalResult = 'mx-0';
        }
        else if (horizontal === 'auto') {
          horizontalResult = 'mx-auto';
        }
        else {
          horizontalResult = marginMap[horizontal].replace('m-', 'mx-');
        }
      }
      else {
        horizontalResult = `mx-[${horizontal}]`;
      }

      let bottomResult = `mb-[${bottom}]`;
      if (marginMap[bottom]) {
        if (bottom === '0') {
          bottomResult = 'mb-0';
        }
        else if (bottom === 'auto') {
          bottomResult = 'mb-auto';
        }
        else {
          bottomResult = marginMap[bottom].replace('m-', 'mb-');
        }
      }
      else {
        bottomResult = `mb-[${bottom}]`;
      }

      return `${topResult} ${horizontalResult} ${bottomResult}`;
    }
    else if (values.length === 4) {
      // Four values: margin: 8px 16px 12px 20px -> mt-[8px] mr-[16px] mb-[12px] ml-[20px]
      const top = values[0];
      const right = values[1];
      const bottom = values[2];
      const left = values[3];

      const marginMap: Record<string, string> = {
        '0': 'm-0',
        '1': 'm-1', // 4px
        '2': 'm-2', // 8px
        '3': 'm-3', // 12px
        '4': 'm-4', // 16px
        '5': 'm-5', // 20px
        '6': 'm-6', // 24px
        '8': 'm-8', // 32px
        '10': 'm-10', // 40px
        '12': 'm-12', // 48px
        '16': 'm-16', // 64px
        '20': 'm-20', // 80px
        '24': 'm-24', // 96px
        '32': 'm-32', // 128px
        'auto': 'm-auto',
        '0.25rem': 'm-1', // 4px
        '0.5rem': 'm-2', // 8px
        '0.75rem': 'm-3', // 12px
        '1rem': 'm-4', // 16px
        '1.25rem': 'm-5', // 20px
        '1.5rem': 'm-6', // 24px
        '2rem': 'm-8', // 32px
        '2.5rem': 'm-10', // 40px
        '3rem': 'm-12', // 48px
        '4rem': 'm-16', // 64px
        '5rem': 'm-20', // 80px
        '6rem': 'm-24', // 96px
        '8rem': 'm-32', // 128px
      };

      let topResult = `mt-[${top}]`;
      if (marginMap[top]) {
        if (top === '0') {
          topResult = 'mt-0';
        }
        else if (top === 'auto') {
          topResult = 'mt-auto';
        }
        else {
          topResult = marginMap[top].replace('m-', 'mt-');
        }
      }
      else {
        topResult = `mt-[${top}]`;
      }

      let rightResult = `mr-[${right}]`;
      if (marginMap[right]) {
        if (right === '0') {
          rightResult = 'mr-0';
        }
        else if (right === 'auto') {
          rightResult = 'mr-auto';
        }
        else {
          rightResult = marginMap[right].replace('m-', 'mr-');
        }
      }
      else {
        rightResult = `mr-[${right}]`;
      }

      let bottomResult = `mb-[${bottom}]`;
      if (marginMap[bottom]) {
        if (bottom === '0') {
          bottomResult = 'mb-0';
        }
        else if (bottom === 'auto') {
          bottomResult = 'mb-auto';
        }
        else {
          bottomResult = marginMap[bottom].replace('m-', 'mb-');
        }
      }
      else {
        bottomResult = `mb-[${bottom}]`;
      }

      let leftResult = `ml-[${left}]`;
      if (marginMap[left]) {
        if (left === '0') {
          leftResult = 'ml-0';
        }
        else if (left === 'auto') {
          leftResult = 'ml-auto';
        }
        else {
          leftResult = marginMap[left].replace('m-', 'ml-');
        }
      }
      else {
        leftResult = `ml-[${left}]`;
      }

      return `${topResult} ${rightResult} ${bottomResult} ${leftResult}`;
    }

    // If value doesn't match expected patterns, return as is
    return `m-[${value}]`;
  },
  'margin-left': (value: string) => {
    // Map common margin values to predefined Tailwind classes first
    const marginLeftMap: Record<string, string> = {
      '0': 'ml-0',
      '1': 'ml-1', // 4px
      '2': 'ml-2', // 8px
      '3': 'ml-3', // 12px
      '4': 'ml-4', // 16px
      '5': 'ml-5', // 20px
      '6': 'ml-6', // 24px
      '8': 'ml-8', // 32px
      '10': 'ml-10', // 40px
      '12': 'ml-12', // 48px
      '16': 'ml-16', // 64px
      '20': 'ml-20', // 80px
      '24': 'ml-24', // 96px
      '32': 'ml-32', // 128px
      'auto': 'ml-auto',
      '0.25rem': 'ml-1', // 4px
      '0.5rem': 'ml-2', // 8px
      '0.75rem': 'ml-3', // 12px
      '1rem': 'ml-4', // 16px
      '1.25rem': 'ml-5', // 20px
      '1.5rem': 'ml-6', // 24px
      '2rem': 'ml-8', // 32px
      '2.5rem': 'ml-10', // 40px
      '3rem': 'ml-12', // 48px
      '4rem': 'ml-16', // 64px
      '5rem': 'ml-20', // 80px
      '6rem': 'ml-24', // 96px
      '8rem': 'ml-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (marginLeftMap[value]) {
      return marginLeftMap[value];
    }

    // Use arbitrary value as fallback
    return `ml-[${value}]`;
  },
  'margin-right': (value: string) => {
    // Map common margin values to predefined Tailwind classes first
    const marginRightMap: Record<string, string> = {
      '0': 'mr-0',
      '1': 'mr-1', // 4px
      '2': 'mr-2', // 8px
      '3': 'mr-3', // 12px
      '4': 'mr-4', // 16px
      '5': 'mr-5', // 20px
      '6': 'mr-6', // 24px
      '8': 'mr-8', // 32px
      '10': 'mr-10', // 40px
      '12': 'mr-12', // 48px
      '16': 'mr-16', // 64px
      '20': 'mr-20', // 80px
      '24': 'mr-24', // 96px
      '32': 'mr-32', // 128px
      'auto': 'mr-auto',
      '0.25rem': 'mr-1', // 4px
      '0.5rem': 'mr-2', // 8px
      '0.75rem': 'mr-3', // 12px
      '1rem': 'mr-4', // 16px
      '1.25rem': 'mr-5', // 20px
      '1.5rem': 'mr-6', // 24px
      '2rem': 'mr-8', // 32px
      '2.5rem': 'mr-10', // 40px
      '3rem': 'mr-12', // 48px
      '4rem': 'mr-16', // 64px
      '5rem': 'mr-20', // 80px
      '6rem': 'mr-24', // 96px
      '8rem': 'mr-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (marginRightMap[value]) {
      return marginRightMap[value];
    }

    // Use arbitrary value as fallback
    return `mr-[${value}]`;
  },
  'margin-top': (value: string) => {
    // Map common margin values to predefined Tailwind classes first
    const marginTopMap: Record<string, string> = {
      '0': 'mt-0',
      '1': 'mt-1', // 4px
      '2': 'mt-2', // 8px
      '3': 'mt-3', // 12px
      '4': 'mt-4', // 16px
      '5': 'mt-5', // 20px
      '6': 'mt-6', // 24px
      '8': 'mt-8', // 32px
      '10': 'mt-10', // 40px
      '12': 'mt-12', // 48px
      '16': 'mt-16', // 64px
      '20': 'mt-20', // 80px
      '24': 'mt-24', // 96px
      '32': 'mt-32', // 128px
      'auto': 'mt-auto',
      '0.25rem': 'mt-1', // 4px
      '0.5rem': 'mt-2', // 8px
      '0.75rem': 'mt-3', // 12px
      '1rem': 'mt-4', // 16px
      '1.25rem': 'mt-5', // 20px
      '1.5rem': 'mt-6', // 24px
      '2rem': 'mt-8', // 32px
      '2.5rem': 'mt-10', // 40px
      '3rem': 'mt-12', // 48px
      '4rem': 'mt-16', // 64px
      '5rem': 'mt-20', // 80px
      '6rem': 'mt-24', // 96px
      '8rem': 'mt-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (marginTopMap[value]) {
      return marginTopMap[value];
    }

    // Use arbitrary value as fallback
    return `mt-[${value}]`;
  },
  'margin-bottom': (value: string) => {
    // Map common margin values to predefined Tailwind classes first
    const marginBottomMap: Record<string, string> = {
      '0': 'mb-0',
      '1': 'mb-1', // 4px
      '2': 'mb-2', // 8px
      '3': 'mb-3', // 12px
      '4': 'mb-4', // 16px
      '5': 'mb-5', // 20px
      '6': 'mb-6', // 24px
      '8': 'mb-8', // 32px
      '10': 'mb-10', // 40px
      '12': 'mb-12', // 48px
      '16': 'mb-16', // 64px
      '20': 'mb-20', // 80px
      '24': 'mb-24', // 96px
      '32': 'mb-32', // 128px
      'auto': 'mb-auto',
      '0.25rem': 'mb-1', // 4px
      '0.5rem': 'mb-2', // 8px
      '0.75rem': 'mb-3', // 12px
      '1rem': 'mb-4', // 16px
      '1.25rem': 'mb-5', // 20px
      '1.5rem': 'mb-6', // 24px
      '2rem': 'mb-8', // 32px
      '2.5rem': 'mb-10', // 40px
      '3rem': 'mb-12', // 48px
      '4rem': 'mb-16', // 64px
      '5rem': 'mb-20', // 80px
      '6rem': 'mb-24', // 96px
      '8rem': 'mb-32', // 128px
    };

    // Check if the value maps to a predefined class
    if (marginBottomMap[value]) {
      return marginBottomMap[value];
    }

    // Use arbitrary value as fallback
    return `mb-[${value}]`;
  },
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
    // Convert outline properties to arbitrary values with proper Tailwind format
    return `outline-[${value.replace(/\s+/g, '_')}]`;
  },
  'outline-offset': (value: string) => {
    // Convert outline-offset properties to arbitrary values with proper Tailwind format
    return `outline-offset-[${value}]`;
  },
  'transform': (value: string) => {
    // Handle common transform functions and convert to appropriate Tailwind classes
    if (value.startsWith('scale(')) {
      // Extract the scale value and convert to Tailwind scale class
      const scaleValue = value.match(/scale\(([^)]+)\)/);
      if (scaleValue) {
        return `scale-[${scaleValue[1]}]`;
      }
    }
    else if (value.startsWith('translateX(')) {
      // Extract the translateX value and convert to Tailwind class
      const translateValue = value.match(/translateX\(([^)]+)\)/);
      if (translateValue) {
        return `translate-x-[${translateValue[1]}]`;
      }
    }
    else if (value.startsWith('translateY(')) {
      // Extract the translateY value and convert to Tailwind class
      const translateValue = value.match(/translateY\(([^)]+)\)/);
      if (translateValue) {
        return `translate-y-[${translateValue[1]}]`;
      }
    }
    else if (value.startsWith('translate(')) {
      // Extract the translate values and convert to Tailwind class
      const translateValue = value.match(/translate\(([^)]+)\)/);
      if (translateValue) {
        const params = translateValue[1].trim();
        if (params.includes(',')) {
          // Two parameters: translate-x and translate-y
          const [x, y] = params.split(',').map(param => param.trim());
          return `translate-x-[${x}] translate-y-[${y}]`;
        }
        else {
          // Single parameter: apply to both x and y
          return `translate-x-[${params}] translate-y-[${params}]`;
        }
      }
    }
    else if (value.startsWith('rotate(')) {
      // Extract the rotate value and convert to Tailwind class
      const rotateValue = value.match(/rotate\(([^)]+)\)/);
      if (rotateValue) {
        return `rotate-[${rotateValue[1]}]`;
      }
    }
    else if (value.startsWith('skewX(')) {
      // Extract the skewX value and convert to Tailwind class
      const skewValue = value.match(/skewX\(([^)]+)\)/);
      if (skewValue) {
        return `skew-x-[${skewValue[1]}]`;
      }
    }
    else if (value.startsWith('skewY(')) {
      // Extract the skewY value and convert to Tailwind class
      const skewValue = value.match(/skewY\(([^)]+)\)/);
      if (skewValue) {
        return `skew-y-[${skewValue[1]}]`;
      }
    }
    else if (value.startsWith('skew(')) {
      // Extract the skew values and convert to Tailwind class
      const skewValue = value.match(/skew\(([^)]+)\)/);
      if (skewValue) {
        const params = skewValue[1].trim();
        if (params.includes(',')) {
          // Two parameters: skew-x and skew-y
          const [x, y] = params.split(',').map(param => param.trim());
          return `skew-x-[${x}] skew-y-[${y}]`;
        }
        else {
          // Single parameter: apply to both x and y
          return `skew-x-[${params}] skew-y-[${params}]`;
        }
      }
    }
    // For other transform values, use arbitrary values
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
};

export interface ConvertedClass {
  className: string
  pseudoClass: string | null
  tailwindClasses: string[]
}

/**
 * Converts CSS string to an array of objects containing class names and their corresponding Tailwind CSS classes.
 * @param cssString The CSS string to convert.
 * @returns An array of objects with className and tailwindClasses.
 */
export function convertCssToTailwind(cssString: string): ConvertedClass[] {
  try {
    const ast = parse(cssString, {
      parseValue: true,
      parseRulePrelude: true,
    });

    const results: ConvertedClass[] = [];

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
                  switch (pseudoClassValue) {
                    case 'hover':
                      pseudoClassPrefix = 'hover:';
                      break;
                    case 'focus':
                      pseudoClassPrefix = 'focus:';
                      break;
                    case 'active':
                      pseudoClassPrefix = 'active:';
                      break;
                    case 'visited':
                      pseudoClassPrefix = 'visited:';
                      break;
                    case 'focus-visible':
                      pseudoClassPrefix = 'focus:visible:';
                      break;
                    case 'focus-within':
                      pseudoClassPrefix = 'focus:within:';
                      break;
                    case 'first':
                      pseudoClassPrefix = 'first:';
                      break;
                    case 'last':
                      pseudoClassPrefix = 'last:';
                      break;
                    case 'disabled':
                      pseudoClassPrefix = 'disabled:';
                      break;
                    case 'checked':
                      pseudoClassPrefix = 'checked:';
                      break;
                    case 'group-hover':
                      pseudoClassPrefix = 'group-hover:';
                      break;
                    case 'group-focus':
                      pseudoClassPrefix = 'group-focus:';
                      break;
                    default:
                      // For other pseudo-classes that don't have direct Tailwind equivalents
                      pseudoClassPrefix = `${pseudoClassValue}:`;
                      break;
                  }
                }
              });

              if (className) {
                const tailwindClasses: string[] = [];

                if (rule.block && rule.block.children) {
                  rule.block.children.forEach((childNode: CssNode) => {
                    if (childNode.type === 'Declaration') {
                      const decl = childNode as Declaration;
                      const property = decl.property;
                      // Properly extract the value string from the CSS AST using generate
                      const value = generate(decl.value);

                      const tailwindClassFn = cssToTailwindMap[property];
                      if (tailwindClassFn) {
                        const tailwindClass = tailwindClassFn(value);
                        if (tailwindClass) {
                          // Apply the pseudo-class prefix to the tailwind class
                          const prefixedClass = pseudoClassPrefix ? `${pseudoClassPrefix}${tailwindClass}` : tailwindClass;
                          tailwindClasses.push(prefixedClass);
                        }
                        else {
                          // If no direct mapping found, add a comment or placeholder
                          tailwindClasses.push(`/* ${property}: ${value} */`);
                        }
                      }
                      else {
                        // Property not mapped, add a comment
                        tailwindClasses.push(`/* ${property}: ${value} */`);
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
