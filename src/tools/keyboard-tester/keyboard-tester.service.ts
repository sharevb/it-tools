// Keyboard layout definitions
export enum KeyboardLayoutEnum {
  QWERTY = 'qwerty',
  AZERTY = 'azerty',
  DVORAK = 'dvorak',
  COLEMAK = 'colemak',
}

export enum KeyboardSizeEnum {
  FULL = 'full',
  TKL = 'tkl',
  COMPACT_60 = '60',
}

export type KeyboardLayout = `${KeyboardLayoutEnum}`;
export type KeyboardSize = `${KeyboardSizeEnum}`;

export interface KeyDefinition {
  code: string;
  label: string;
  width?: number; // in key units (1 = standard key width)
  height?: number; // in key units (1 = standard key height)
  row: number;
  col: number;
}

// Grid configuration constants
const GRID_CONFIG = {
  FULL_COLUMNS: 92,
  TKL_COLUMNS: 72,
  COMPACT_60_COLUMNS: 60,
  FULL_ROWS: 28,
  TKL_ROWS: 28,
  COMPACT_60_ROWS: 22,
  ROW_OFFSET_60: 1.5, // Offset to remove function key row for 60% keyboards
} as const;

// Key row positions
const KEY_ROWS = {
  FUNCTION: 0,
  NUMBER: 1.5,
  QWERTY: 2.5,
  ASDF: 3.5,
  ZXCV: 4.5,
  BOTTOM: 5.5,
} as const;

// Key column positions for function keys
const FUNCTION_KEY_COLS = {
  ESC: 0,
  F1: 1.5,
  F2: 2.5,
  F3: 3.5,
  F4: 4.5,
  F5: 6,
  F6: 7,
  F7: 8,
  F8: 9,
  F9: 10.5,
  F10: 11.5,
  F11: 12.5,
  F12: 13.5,
} as const;

// Key widths
const KEY_WIDTHS = {
  STANDARD: 1,
  TAB: 1.5,
  CAPS: 1.75,
  SHIFT_LEFT: 2.25,
  SHIFT_RIGHT: 2.75,
  BACKSPACE: 2,
  ENTER: 2.25,
  BACKSLASH: 1.5,
  CTRL: 1.25,
  META: 1.25,
  ALT: 1.25,
  SPACE: 6.25,
  MENU: 1.25,
  NUMPAD_DOUBLE: 2,
} as const;

// Navigation key positions
const NAV_KEY_COLS = {
  PRINT_SCREEN: 15.5,
  SCROLL_LOCK: 16.5,
  PAUSE: 17.5,
} as const;

// Numpad key positions
const NUMPAD_COLS = {
  COL_1: 19,
  COL_2: 20,
  COL_3: 21,
  COL_4: 22,
} as const;

// Detect OS for platform-specific key labels
function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

// Base layout structure for different sizes
const functionKeys: KeyDefinition[] = [
  { code: 'Escape', label: 'Esc', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.ESC },
  { code: 'F1', label: 'F1', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F1 },
  { code: 'F2', label: 'F2', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F2 },
  { code: 'F3', label: 'F3', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F3 },
  { code: 'F4', label: 'F4', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F4 },
  { code: 'F5', label: 'F5', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F5 },
  { code: 'F6', label: 'F6', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F6 },
  { code: 'F7', label: 'F7', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F7 },
  { code: 'F8', label: 'F8', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F8 },
  { code: 'F9', label: 'F9', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F9 },
  { code: 'F10', label: 'F10', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F10 },
  { code: 'F11', label: 'F11', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F11 },
  { code: 'F12', label: 'F12', row: KEY_ROWS.FUNCTION, col: FUNCTION_KEY_COLS.F12 },
];

const navigationKeys: KeyDefinition[] = [
  { code: 'PrintScreen', label: 'PrtSc', row: KEY_ROWS.FUNCTION, col: NAV_KEY_COLS.PRINT_SCREEN },
  { code: 'ScrollLock', label: 'ScrLk', row: KEY_ROWS.FUNCTION, col: NAV_KEY_COLS.SCROLL_LOCK },
  { code: 'Pause', label: 'Pause', row: KEY_ROWS.FUNCTION, col: NAV_KEY_COLS.PAUSE },
  { code: 'Insert', label: 'Ins', row: KEY_ROWS.NUMBER, col: NAV_KEY_COLS.PRINT_SCREEN },
  { code: 'Home', label: 'Home', row: KEY_ROWS.NUMBER, col: NAV_KEY_COLS.SCROLL_LOCK },
  { code: 'PageUp', label: 'PgUp', row: KEY_ROWS.NUMBER, col: NAV_KEY_COLS.PAUSE },
  { code: 'Delete', label: 'Del', row: KEY_ROWS.QWERTY, col: NAV_KEY_COLS.PRINT_SCREEN },
  { code: 'End', label: 'End', row: KEY_ROWS.QWERTY, col: NAV_KEY_COLS.SCROLL_LOCK },
  { code: 'PageDown', label: 'PgDn', row: KEY_ROWS.QWERTY, col: NAV_KEY_COLS.PAUSE },
  { code: 'ArrowUp', label: '↑', row: KEY_ROWS.ZXCV, col: NAV_KEY_COLS.SCROLL_LOCK },
  { code: 'ArrowLeft', label: '←', row: KEY_ROWS.BOTTOM, col: NAV_KEY_COLS.PRINT_SCREEN },
  { code: 'ArrowDown', label: '↓', row: KEY_ROWS.BOTTOM, col: NAV_KEY_COLS.SCROLL_LOCK },
  { code: 'ArrowRight', label: '→', row: KEY_ROWS.BOTTOM, col: NAV_KEY_COLS.PAUSE },
];

const numpadKeys: KeyDefinition[] = [
  { code: 'NumLock', label: 'Num', row: KEY_ROWS.NUMBER, col: NUMPAD_COLS.COL_1 },
  { code: 'NumpadDivide', label: '/', row: KEY_ROWS.NUMBER, col: NUMPAD_COLS.COL_2 },
  { code: 'NumpadMultiply', label: '*', row: KEY_ROWS.NUMBER, col: NUMPAD_COLS.COL_3 },
  { code: 'NumpadSubtract', label: '-', row: KEY_ROWS.NUMBER, col: NUMPAD_COLS.COL_4 },
  { code: 'Numpad7', label: '7', row: KEY_ROWS.QWERTY, col: NUMPAD_COLS.COL_1 },
  { code: 'Numpad8', label: '8', row: KEY_ROWS.QWERTY, col: NUMPAD_COLS.COL_2 },
  { code: 'Numpad9', label: '9', row: KEY_ROWS.QWERTY, col: NUMPAD_COLS.COL_3 },
  {
    code: 'NumpadAdd',
    label: '+',
    width: KEY_WIDTHS.STANDARD,
    height: 2,
    row: KEY_ROWS.QWERTY,
    col: NUMPAD_COLS.COL_4,
  },
  { code: 'Numpad4', label: '4', row: KEY_ROWS.ASDF, col: NUMPAD_COLS.COL_1 },
  { code: 'Numpad5', label: '5', row: KEY_ROWS.ASDF, col: NUMPAD_COLS.COL_2 },
  { code: 'Numpad6', label: '6', row: KEY_ROWS.ASDF, col: NUMPAD_COLS.COL_3 },
  { code: 'Numpad1', label: '1', row: KEY_ROWS.ZXCV, col: NUMPAD_COLS.COL_1 },
  { code: 'Numpad2', label: '2', row: KEY_ROWS.ZXCV, col: NUMPAD_COLS.COL_2 },
  { code: 'Numpad3', label: '3', row: KEY_ROWS.ZXCV, col: NUMPAD_COLS.COL_3 },
  {
    code: 'NumpadEnter',
    label: 'Enter',
    width: KEY_WIDTHS.STANDARD,
    height: 2,
    row: KEY_ROWS.ZXCV,
    col: NUMPAD_COLS.COL_4,
  },
  { code: 'Numpad0', label: '0', width: KEY_WIDTHS.NUMPAD_DOUBLE, row: KEY_ROWS.BOTTOM, col: NUMPAD_COLS.COL_1 },
  { code: 'NumpadDecimal', label: '.', row: KEY_ROWS.BOTTOM, col: NUMPAD_COLS.COL_3 },
];

// QWERTY Layout
function getQwertyKeys(): KeyDefinition[] {
  const metaLabel = isMac() ? 'Cmd' : 'Win';

  return [
    // Number row
    { code: 'Backquote', label: '`', row: KEY_ROWS.NUMBER, col: 0 },
    { code: 'Digit1', label: '1', row: KEY_ROWS.NUMBER, col: 1 },
    { code: 'Digit2', label: '2', row: KEY_ROWS.NUMBER, col: 2 },
    { code: 'Digit3', label: '3', row: KEY_ROWS.NUMBER, col: 3 },
    { code: 'Digit4', label: '4', row: KEY_ROWS.NUMBER, col: 4 },
    { code: 'Digit5', label: '5', row: KEY_ROWS.NUMBER, col: 5 },
    { code: 'Digit6', label: '6', row: KEY_ROWS.NUMBER, col: 6 },
    { code: 'Digit7', label: '7', row: KEY_ROWS.NUMBER, col: 7 },
    { code: 'Digit8', label: '8', row: KEY_ROWS.NUMBER, col: 8 },
    { code: 'Digit9', label: '9', row: KEY_ROWS.NUMBER, col: 9 },
    { code: 'Digit0', label: '0', row: KEY_ROWS.NUMBER, col: 10 },
    { code: 'Minus', label: '-', row: KEY_ROWS.NUMBER, col: 11 },
    { code: 'Equal', label: '=', row: KEY_ROWS.NUMBER, col: 12 },
    { code: 'Backspace', label: 'Backspace', width: KEY_WIDTHS.BACKSPACE, row: KEY_ROWS.NUMBER, col: 13 },

    // QWERTY row
    { code: 'Tab', label: 'Tab', width: KEY_WIDTHS.TAB, row: KEY_ROWS.QWERTY, col: 0 },
    { code: 'KeyQ', label: 'Q', row: KEY_ROWS.QWERTY, col: 1.5 },
    { code: 'KeyW', label: 'W', row: KEY_ROWS.QWERTY, col: 2.5 },
    { code: 'KeyE', label: 'E', row: KEY_ROWS.QWERTY, col: 3.5 },
    { code: 'KeyR', label: 'R', row: KEY_ROWS.QWERTY, col: 4.5 },
    { code: 'KeyT', label: 'T', row: KEY_ROWS.QWERTY, col: 5.5 },
    { code: 'KeyY', label: 'Y', row: KEY_ROWS.QWERTY, col: 6.5 },
    { code: 'KeyU', label: 'U', row: KEY_ROWS.QWERTY, col: 7.5 },
    { code: 'KeyI', label: 'I', row: KEY_ROWS.QWERTY, col: 8.5 },
    { code: 'KeyO', label: 'O', row: KEY_ROWS.QWERTY, col: 9.5 },
    { code: 'KeyP', label: 'P', row: KEY_ROWS.QWERTY, col: 10.5 },
    { code: 'BracketLeft', label: '[', row: KEY_ROWS.QWERTY, col: 11.5 },
    { code: 'BracketRight', label: ']', row: KEY_ROWS.QWERTY, col: 12.5 },
    { code: 'Backslash', label: '\\', width: KEY_WIDTHS.BACKSLASH, row: KEY_ROWS.QWERTY, col: 13.5 },

    // ASDF row
    { code: 'CapsLock', label: 'Caps', width: KEY_WIDTHS.CAPS, row: KEY_ROWS.ASDF, col: 0 },
    { code: 'KeyA', label: 'A', row: KEY_ROWS.ASDF, col: 1.75 },
    { code: 'KeyS', label: 'S', row: KEY_ROWS.ASDF, col: 2.75 },
    { code: 'KeyD', label: 'D', row: KEY_ROWS.ASDF, col: 3.75 },
    { code: 'KeyF', label: 'F', row: KEY_ROWS.ASDF, col: 4.75 },
    { code: 'KeyG', label: 'G', row: KEY_ROWS.ASDF, col: 5.75 },
    { code: 'KeyH', label: 'H', row: KEY_ROWS.ASDF, col: 6.75 },
    { code: 'KeyJ', label: 'J', row: KEY_ROWS.ASDF, col: 7.75 },
    { code: 'KeyK', label: 'K', row: KEY_ROWS.ASDF, col: 8.75 },
    { code: 'KeyL', label: 'L', row: KEY_ROWS.ASDF, col: 9.75 },
    { code: 'Semicolon', label: ';', row: KEY_ROWS.ASDF, col: 10.75 },
    { code: 'Quote', label: "'", row: KEY_ROWS.ASDF, col: 11.75 },
    { code: 'Enter', label: 'Enter', width: KEY_WIDTHS.ENTER, row: KEY_ROWS.ASDF, col: 12.75 },

    // ZXCV row
    { code: 'ShiftLeft', label: 'Shift', width: KEY_WIDTHS.SHIFT_LEFT, row: KEY_ROWS.ZXCV, col: 0 },
    { code: 'KeyZ', label: 'Z', row: KEY_ROWS.ZXCV, col: 2.25 },
    { code: 'KeyX', label: 'X', row: KEY_ROWS.ZXCV, col: 3.25 },
    { code: 'KeyC', label: 'C', row: KEY_ROWS.ZXCV, col: 4.25 },
    { code: 'KeyV', label: 'V', row: KEY_ROWS.ZXCV, col: 5.25 },
    { code: 'KeyB', label: 'B', row: KEY_ROWS.ZXCV, col: 6.25 },
    { code: 'KeyN', label: 'N', row: KEY_ROWS.ZXCV, col: 7.25 },
    { code: 'KeyM', label: 'M', row: KEY_ROWS.ZXCV, col: 8.25 },
    { code: 'Comma', label: ',', row: KEY_ROWS.ZXCV, col: 9.25 },
    { code: 'Period', label: '.', row: KEY_ROWS.ZXCV, col: 10.25 },
    { code: 'Slash', label: '/', row: KEY_ROWS.ZXCV, col: 11.25 },
    { code: 'ShiftRight', label: 'Shift', width: KEY_WIDTHS.SHIFT_RIGHT, row: KEY_ROWS.ZXCV, col: 12.25 },

    // Bottom row
    { code: 'ControlLeft', label: 'Ctrl', width: KEY_WIDTHS.CTRL, row: KEY_ROWS.BOTTOM, col: 0 },
    { code: 'MetaLeft', label: metaLabel, width: KEY_WIDTHS.META, row: KEY_ROWS.BOTTOM, col: 1.25 },
    { code: 'AltLeft', label: 'Alt', width: KEY_WIDTHS.ALT, row: KEY_ROWS.BOTTOM, col: 2.5 },
    { code: 'Space', label: 'Space', width: KEY_WIDTHS.SPACE, row: KEY_ROWS.BOTTOM, col: 3.75 },
    { code: 'AltRight', label: 'Alt', width: KEY_WIDTHS.ALT, row: KEY_ROWS.BOTTOM, col: 10 },
    { code: 'MetaRight', label: metaLabel, width: KEY_WIDTHS.META, row: KEY_ROWS.BOTTOM, col: 11.25 },
    { code: 'ContextMenu', label: 'Menu', width: KEY_WIDTHS.MENU, row: KEY_ROWS.BOTTOM, col: 12.5 },
    { code: 'ControlRight', label: 'Ctrl', width: KEY_WIDTHS.CTRL, row: KEY_ROWS.BOTTOM, col: 13.75 },
  ];
}

// AZERTY Layout (French)
function getAzertyKeys(): KeyDefinition[] {
  const keys = getQwertyKeys();
  const replacements: Record<string, string> = {
    KeyQ: 'A',
    KeyW: 'Z',
    KeyA: 'Q',
    KeyZ: 'W',
    KeyM: ',',
    Comma: ';',
    Semicolon: 'M',
    Period: ':',
    Slash: '!',
  };

  return keys.map((key) => {
    const newLabel = replacements[key.code];
    if (newLabel) {
      return { ...key, label: newLabel };
    }
    return key;
  });
}

// DVORAK Layout
function getDvorakKeys(): KeyDefinition[] {
  const keys = getQwertyKeys();
  const replacements: Record<string, string> = {
    KeyQ: "'",
    KeyW: ',',
    KeyE: '.',
    KeyR: 'P',
    KeyT: 'Y',
    KeyY: 'F',
    KeyU: 'G',
    KeyI: 'C',
    KeyO: 'R',
    KeyP: 'L',
    BracketLeft: '/',
    BracketRight: '=',
    KeyA: 'A',
    KeyS: 'O',
    KeyD: 'E',
    KeyF: 'U',
    KeyG: 'I',
    KeyH: 'D',
    KeyJ: 'H',
    KeyK: 'T',
    KeyL: 'N',
    Semicolon: 'S',
    Quote: '-',
    KeyZ: ';',
    KeyX: 'Q',
    KeyC: 'J',
    KeyV: 'K',
    KeyB: 'X',
    KeyN: 'B',
    KeyM: 'M',
    Comma: 'W',
    Period: 'V',
    Slash: 'Z',
  };

  return keys.map((key) => {
    const newLabel = replacements[key.code];
    if (newLabel) {
      return { ...key, label: newLabel };
    }
    return key;
  });
}

// COLEMAK Layout
function getColemakKeys(): KeyDefinition[] {
  const keys = getQwertyKeys();
  const replacements: Record<string, string> = {
    KeyE: 'F',
    KeyR: 'P',
    KeyT: 'G',
    KeyY: 'J',
    KeyU: 'L',
    KeyI: 'U',
    KeyO: 'Y',
    KeyP: ';',
    KeyS: 'R',
    KeyD: 'S',
    KeyF: 'T',
    KeyG: 'D',
    KeyJ: 'N',
    KeyK: 'E',
    KeyL: 'I',
    Semicolon: 'O',
    KeyN: 'K',
  };

  return keys.map((key) => {
    const newLabel = replacements[key.code];
    if (newLabel) {
      return { ...key, label: newLabel };
    }
    return key;
  });
}

export function getKeyboardLayout(layout: KeyboardLayout, size: KeyboardSize): KeyDefinition[] {
  let mainKeys: KeyDefinition[] = [];

  // Get layout-specific keys
  switch (layout) {
    case KeyboardLayoutEnum.QWERTY:
      mainKeys = getQwertyKeys();
      break;
    case KeyboardLayoutEnum.AZERTY:
      mainKeys = getAzertyKeys();
      break;
    case KeyboardLayoutEnum.DVORAK:
      mainKeys = getDvorakKeys();
      break;
    case KeyboardLayoutEnum.COLEMAK:
      mainKeys = getColemakKeys();
      break;
  }

  // Add size-specific keys and adjust positions
  switch (size) {
    case KeyboardSizeEnum.FULL:
      return [...functionKeys, ...mainKeys, ...navigationKeys, ...numpadKeys];
    case KeyboardSizeEnum.TKL:
      return [...functionKeys, ...mainKeys, ...navigationKeys];
    case KeyboardSizeEnum.COMPACT_60:
      // For 60% keyboard, adjust row positions to start from 0
      return mainKeys.map((key) => ({
        ...key,
        row: key.row - GRID_CONFIG.ROW_OFFSET_60,
      }));
    default:
      return [...functionKeys, ...mainKeys, ...navigationKeys];
  }
}

export function getKeyLabel(code: string, layout: KeyboardLayout): string {
  const keys = getKeyboardLayout(layout, 'full');
  const key = keys.find((k) => k.code === code);
  return key?.label || code;
}

// Export grid configuration for use in components
export function getGridColumns(size: KeyboardSize): number {
  switch (size) {
    case KeyboardSizeEnum.FULL:
      return GRID_CONFIG.FULL_COLUMNS;
    case KeyboardSizeEnum.TKL:
      return GRID_CONFIG.TKL_COLUMNS;
    case KeyboardSizeEnum.COMPACT_60:
      return GRID_CONFIG.COMPACT_60_COLUMNS;
    default:
      return GRID_CONFIG.TKL_COLUMNS;
  }
}

export function getGridRows(size: KeyboardSize): number {
  switch (size) {
    case KeyboardSizeEnum.FULL:
      return GRID_CONFIG.FULL_ROWS;
    case KeyboardSizeEnum.TKL:
      return GRID_CONFIG.TKL_ROWS;
    case KeyboardSizeEnum.COMPACT_60:
      return GRID_CONFIG.COMPACT_60_ROWS;
    default:
      return GRID_CONFIG.TKL_ROWS;
  }
}
