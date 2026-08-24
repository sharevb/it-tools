// oxlint-disable vitest/no-conditional-expect
import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { KeyDefinition, KeyboardLayout, KeyboardSize } from './keyboard-tester.service';
import {
  KeyboardLayoutEnum,
  KeyboardSizeEnum,
  getKeyboardLayout,
  getKeyLabel,
  getGridColumns,
  getGridRows,
} from './keyboard-tester.service';

describe('keyboard-tester service', () => {
  describe('getKeyboardLayout', () => {
    it('should return QWERTY full keyboard layout', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // Should include function keys
      expect(result.some((key) => key.code === 'F1')).toBe(true);
      expect(result.some((key) => key.code === 'F12')).toBe(true);

      // Should include main keys
      expect(result.some((key) => key.code === 'KeyQ')).toBe(true);
      expect(result.some((key) => key.code === 'KeyA')).toBe(true);

      // Should include navigation keys
      expect(result.some((key) => key.code === 'ArrowUp')).toBe(true);
      expect(result.some((key) => key.code === 'Home')).toBe(true);

      // Should include numpad keys
      expect(result.some((key) => key.code === 'Numpad0')).toBe(true);
      expect(result.some((key) => key.code === 'NumLock')).toBe(true);
    });

    it('should return QWERTY TKL keyboard layout', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.TKL);

      expect(result).toBeDefined();

      // Should include function keys
      expect(result.some((key) => key.code === 'F1')).toBe(true);

      // Should include navigation keys
      expect(result.some((key) => key.code === 'ArrowUp')).toBe(true);

      // Should NOT include numpad keys
      expect(result.some((key) => key.code === 'Numpad0')).toBe(false);
      expect(result.some((key) => key.code === 'NumLock')).toBe(false);
    });

    it('should return QWERTY 60% keyboard layout', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.COMPACT_60);

      expect(result).toBeDefined();

      // Should NOT include function keys
      expect(result.some((key) => key.code === 'F1')).toBe(false);

      // Should NOT include navigation keys
      expect(result.some((key) => key.code === 'ArrowUp')).toBe(false);

      // Should NOT include numpad keys
      expect(result.some((key) => key.code === 'Numpad0')).toBe(false);

      // Should include main keys
      expect(result.some((key) => key.code === 'KeyQ')).toBe(true);
      expect(result.some((key) => key.code === 'Space')).toBe(true);

      // Row positions should be adjusted (starting from lower values)
      const spaceKey = result.find((key) => key.code === 'Space');
      expect(spaceKey?.row).toBeLessThan(5.5);
    });

    it('should return AZERTY layout with correct key labels', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.AZERTY, KeyboardSizeEnum.FULL);

      // Check AZERTY-specific key mappings
      const keyQ = result.find((key) => key.code === 'KeyQ');
      const keyW = result.find((key) => key.code === 'KeyW');
      const keyA = result.find((key) => key.code === 'KeyA');
      const keyZ = result.find((key) => key.code === 'KeyZ');

      expect(keyQ?.label).toBe('A');
      expect(keyW?.label).toBe('Z');
      expect(keyA?.label).toBe('Q');
      expect(keyZ?.label).toBe('W');
    });

    it('should return DVORAK layout with correct key labels', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.DVORAK, KeyboardSizeEnum.FULL);

      // Check DVORAK-specific key mappings
      const keyQ = result.find((key) => key.code === 'KeyQ');
      const keyW = result.find((key) => key.code === 'KeyW');
      const keyE = result.find((key) => key.code === 'KeyE');

      expect(keyQ?.label).toBe("'");
      expect(keyW?.label).toBe(',');
      expect(keyE?.label).toBe('.');
    });

    it('should return COLEMAK layout with correct key labels', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.COLEMAK, KeyboardSizeEnum.FULL);

      // Check COLEMAK-specific key mappings
      const keyE = result.find((key) => key.code === 'KeyE');
      const keyR = result.find((key) => key.code === 'KeyR');
      const keyS = result.find((key) => key.code === 'KeyS');
      const keyD = result.find((key) => key.code === 'KeyD');

      expect(keyE?.label).toBe('F');
      expect(keyR?.label).toBe('P');
      expect(keyS?.label).toBe('R');
      expect(keyD?.label).toBe('S');
    });

    it('should include all required key properties', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      result.forEach((key) => {
        expect(key).toHaveProperty('code');
        expect(key).toHaveProperty('label');
        expect(key).toHaveProperty('row');
        expect(key).toHaveProperty('col');
        expect(typeof key.code).toBe('string');
        expect(typeof key.label).toBe('string');
        expect(typeof key.row).toBe('number');
        expect(typeof key.col).toBe('number');
      });
    });

    it('should have correct key widths for special keys', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      const tab = result.find((key) => key.code === 'Tab');
      const capsLock = result.find((key) => key.code === 'CapsLock');
      const shiftLeft = result.find((key) => key.code === 'ShiftLeft');
      const space = result.find((key) => key.code === 'Space');
      const backspace = result.find((key) => key.code === 'Backspace');

      expect(tab?.width).toBe(1.5);
      expect(capsLock?.width).toBe(1.75);
      expect(shiftLeft?.width).toBe(2.25);
      expect(space?.width).toBe(6.25);
      expect(backspace?.width).toBe(2);
    });

    it('should have correct heights for special numpad keys', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      const numpadAdd = result.find((key) => key.code === 'NumpadAdd');
      const numpadEnter = result.find((key) => key.code === 'NumpadEnter');

      expect(numpadAdd?.height).toBe(2);
      expect(numpadEnter?.height).toBe(2);
    });

    it('should include all number row keys', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      const numberKeys = [
        'Digit1',
        'Digit2',
        'Digit3',
        'Digit4',
        'Digit5',
        'Digit6',
        'Digit7',
        'Digit8',
        'Digit9',
        'Digit0',
      ];

      numberKeys.forEach((code) => {
        expect(result.some((key) => key.code === code)).toBe(true);
      });
    });

    it('should include all modifier keys', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      const modifierKeys = [
        'ControlLeft',
        'ControlRight',
        'ShiftLeft',
        'ShiftRight',
        'AltLeft',
        'AltRight',
        'MetaLeft',
        'MetaRight',
      ];

      modifierKeys.forEach((code) => {
        expect(result.some((key) => key.code === code)).toBe(true);
      });
    });

    it('should include all arrow keys', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.TKL);

      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

      arrowKeys.forEach((code) => {
        expect(result.some((key) => key.code === code)).toBe(true);
      });
    });

    it('should not include arrow keys in 60% layout', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.COMPACT_60);

      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

      arrowKeys.forEach((code) => {
        expect(result.some((key) => key.code === code)).toBe(false);
      });
    });
  });

  describe('getKeyLabel', () => {
    it('should return correct label for QWERTY layout', () => {
      expect(getKeyLabel('KeyQ', KeyboardLayoutEnum.QWERTY)).toBe('Q');
      expect(getKeyLabel('KeyA', KeyboardLayoutEnum.QWERTY)).toBe('A');
      expect(getKeyLabel('KeyZ', KeyboardLayoutEnum.QWERTY)).toBe('Z');
    });

    it('should return correct label for AZERTY layout', () => {
      expect(getKeyLabel('KeyQ', KeyboardLayoutEnum.AZERTY)).toBe('A');
      expect(getKeyLabel('KeyA', KeyboardLayoutEnum.AZERTY)).toBe('Q');
      expect(getKeyLabel('KeyW', KeyboardLayoutEnum.AZERTY)).toBe('Z');
      expect(getKeyLabel('KeyZ', KeyboardLayoutEnum.AZERTY)).toBe('W');
    });

    it('should return correct label for DVORAK layout', () => {
      expect(getKeyLabel('KeyQ', KeyboardLayoutEnum.DVORAK)).toBe("'");
      expect(getKeyLabel('KeyW', KeyboardLayoutEnum.DVORAK)).toBe(',');
      expect(getKeyLabel('KeyE', KeyboardLayoutEnum.DVORAK)).toBe('.');
    });

    it('should return correct label for COLEMAK layout', () => {
      expect(getKeyLabel('KeyE', KeyboardLayoutEnum.COLEMAK)).toBe('F');
      expect(getKeyLabel('KeyR', KeyboardLayoutEnum.COLEMAK)).toBe('P');
      expect(getKeyLabel('KeyS', KeyboardLayoutEnum.COLEMAK)).toBe('R');
    });

    it('should return code if key not found', () => {
      expect(getKeyLabel('UnknownKey', KeyboardLayoutEnum.QWERTY)).toBe('UnknownKey');
    });

    it('should return correct labels for special keys', () => {
      expect(getKeyLabel('Space', KeyboardLayoutEnum.QWERTY)).toBe('Space');
      expect(getKeyLabel('Enter', KeyboardLayoutEnum.QWERTY)).toBe('Enter');
      expect(getKeyLabel('Backspace', KeyboardLayoutEnum.QWERTY)).toBe('Backspace');
      expect(getKeyLabel('Tab', KeyboardLayoutEnum.QWERTY)).toBe('Tab');
    });

    it('should return correct labels for function keys', () => {
      expect(getKeyLabel('F1', KeyboardLayoutEnum.QWERTY)).toBe('F1');
      expect(getKeyLabel('F12', KeyboardLayoutEnum.QWERTY)).toBe('F12');
      expect(getKeyLabel('Escape', KeyboardLayoutEnum.QWERTY)).toBe('Esc');
    });

    it('should return correct labels for arrow keys', () => {
      expect(getKeyLabel('ArrowUp', KeyboardLayoutEnum.QWERTY)).toBe('↑');
      expect(getKeyLabel('ArrowDown', KeyboardLayoutEnum.QWERTY)).toBe('↓');
      expect(getKeyLabel('ArrowLeft', KeyboardLayoutEnum.QWERTY)).toBe('←');
      expect(getKeyLabel('ArrowRight', KeyboardLayoutEnum.QWERTY)).toBe('→');
    });

    it('should return correct labels for numpad keys', () => {
      expect(getKeyLabel('Numpad0', KeyboardLayoutEnum.QWERTY)).toBe('0');
      expect(getKeyLabel('Numpad5', KeyboardLayoutEnum.QWERTY)).toBe('5');
      expect(getKeyLabel('NumpadAdd', KeyboardLayoutEnum.QWERTY)).toBe('+');
      expect(getKeyLabel('NumpadMultiply', KeyboardLayoutEnum.QWERTY)).toBe('*');
    });

    it('should work with all keyboard layouts', () => {
      const layouts: KeyboardLayout[] = [
        KeyboardLayoutEnum.QWERTY,
        KeyboardLayoutEnum.AZERTY,
        KeyboardLayoutEnum.DVORAK,
        KeyboardLayoutEnum.COLEMAK,
      ];

      layouts.forEach((layout) => {
        const label = getKeyLabel('Space', layout);
        expect(label).toBe('Space');
      });
    });
  });

  describe('getGridColumns', () => {
    it('should return correct columns for full keyboard', () => {
      expect(getGridColumns(KeyboardSizeEnum.FULL)).toBe(92);
    });

    it('should return correct columns for TKL keyboard', () => {
      expect(getGridColumns(KeyboardSizeEnum.TKL)).toBe(72);
    });

    it('should return correct columns for 60% keyboard', () => {
      expect(getGridColumns(KeyboardSizeEnum.COMPACT_60)).toBe(60);
    });

    it('should return TKL columns for unknown size', () => {
      expect(getGridColumns('unknown' as KeyboardSize)).toBe(72);
    });
  });

  describe('getGridRows', () => {
    it('should return correct rows for full keyboard', () => {
      expect(getGridRows(KeyboardSizeEnum.FULL)).toBe(28);
    });

    it('should return correct rows for TKL keyboard', () => {
      expect(getGridRows(KeyboardSizeEnum.TKL)).toBe(28);
    });

    it('should return correct rows for 60% keyboard', () => {
      expect(getGridRows(KeyboardSizeEnum.COMPACT_60)).toBe(22);
    });

    it('should return TKL rows for unknown size', () => {
      expect(getGridRows('unknown' as KeyboardSize)).toBe(28);
    });
  });

  describe('keyDefinition structure', () => {
    it('should have valid row and column positions', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      result.forEach((key) => {
        expect(key.row).toBeGreaterThanOrEqual(0);
        expect(key.col).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid width values', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      result.forEach((key) => {
        if (key.width !== undefined) {
          expect(key.width).toBeGreaterThan(0);
          expect(key.width).toBeLessThanOrEqual(10);
        }
      });
    });

    it('should have valid height values', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      result.forEach((key) => {
        if (key.height !== undefined) {
          expect(key.height).toBeGreaterThan(0);
          expect(key.height).toBeLessThanOrEqual(3);
        }
      });
    });

    it('should have non-empty labels', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      result.forEach((key) => {
        expect(key.label.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty codes', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      result.forEach((key) => {
        expect(key.code.length).toBeGreaterThan(0);
      });
    });
  });

  describe('layout consistency', () => {
    it('should have same number of main keys across all layouts', () => {
      const qwerty = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const azerty = getKeyboardLayout(KeyboardLayoutEnum.AZERTY, KeyboardSizeEnum.FULL);
      const dvorak = getKeyboardLayout(KeyboardLayoutEnum.DVORAK, KeyboardSizeEnum.FULL);
      const colemak = getKeyboardLayout(KeyboardLayoutEnum.COLEMAK, KeyboardSizeEnum.FULL);

      expect(qwerty.length).toBe(azerty.length);
      expect(qwerty.length).toBe(dvorak.length);
      expect(qwerty.length).toBe(colemak.length);
    });

    it('should have same key codes across all layouts', () => {
      const qwerty = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const azerty = getKeyboardLayout(KeyboardLayoutEnum.AZERTY, KeyboardSizeEnum.FULL);

      const qwertyCodes = qwerty.map((k) => k.code).sort();
      const azertyCodes = azerty.map((k) => k.code).sort();

      expect(qwertyCodes).toEqual(azertyCodes);
    });

    it('should have same positions across all layouts', () => {
      const qwerty = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const dvorak = getKeyboardLayout(KeyboardLayoutEnum.DVORAK, KeyboardSizeEnum.FULL);

      qwerty.forEach((qwertyKey) => {
        const dvorakKey = dvorak.find((k) => k.code === qwertyKey.code);
        expect(dvorakKey?.row).toBe(qwertyKey.row);
        expect(dvorakKey?.col).toBe(qwertyKey.col);
      });
    });

    it('should only differ in labels between layouts', () => {
      const qwerty = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const colemak = getKeyboardLayout(KeyboardLayoutEnum.COLEMAK, KeyboardSizeEnum.FULL);

      qwerty.forEach((qwertyKey) => {
        const colemakKey = colemak.find((k) => k.code === qwertyKey.code);
        expect(colemakKey?.code).toBe(qwertyKey.code);
        expect(colemakKey?.row).toBe(qwertyKey.row);
        expect(colemakKey?.col).toBe(qwertyKey.col);
        expect(colemakKey?.width).toBe(qwertyKey.width);
        expect(colemakKey?.height).toBe(qwertyKey.height);
      });
    });
  });

  describe('size variations', () => {
    it('should have fewer keys in TKL than full', () => {
      const full = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const tkl = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.TKL);

      expect(tkl.length).toBeLessThan(full.length);
    });

    it('should have fewer keys in 60% than TKL', () => {
      const tkl = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.TKL);
      const compact = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.COMPACT_60);

      expect(compact.length).toBeLessThan(tkl.length);
    });

    it('should maintain key order within each row', () => {
      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);

      // Group keys by row
      const rowGroups = new Map<number, KeyDefinition[]>();
      result.forEach((key) => {
        if (!rowGroups.has(key.row)) {
          rowGroups.set(key.row, []);
        }
        rowGroups.get(key.row)!.push(key);
      });

      // Check that columns are in ascending order within each row
      rowGroups.forEach((keys) => {
        const cols = keys.map((k) => k.col);
        const sortedCols = [...cols].sort((a, b) => a - b);
        expect(cols).toEqual(sortedCols);
      });
    });
  });

  describe('platform-specific behavior', () => {
    beforeEach(() => {
      // Reset navigator mock before each test
      vi.unstubAllGlobals();
    });

    it('should use "Cmd" label on Mac platform', () => {
      vi.stubGlobal('navigator', {
        platform: 'MacIntel',
      });

      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const metaLeft = result.find((key) => key.code === 'MetaLeft');
      const metaRight = result.find((key) => key.code === 'MetaRight');

      expect(metaLeft?.label).toBe('Cmd');
      expect(metaRight?.label).toBe('Cmd');
    });

    it('should use "Win" label on Windows platform', () => {
      vi.stubGlobal('navigator', {
        platform: 'Win32',
      });

      const result = getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      const metaLeft = result.find((key) => key.code === 'MetaLeft');
      const metaRight = result.find((key) => key.code === 'MetaRight');

      expect(metaLeft?.label).toBe('Win');
      expect(metaRight?.label).toBe('Win');
    });

    it('should handle missing navigator gracefully', () => {
      vi.stubGlobal('navigator', undefined);

      expect(() => {
        getKeyboardLayout(KeyboardLayoutEnum.QWERTY, KeyboardSizeEnum.FULL);
      }).not.toThrow();
    });
  });
});
