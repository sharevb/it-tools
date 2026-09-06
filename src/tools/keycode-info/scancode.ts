interface KeyMapping {
  key: string;
  code: string;
  scancode: number | null;
}

//
// Comprehensive baseMap: KeyboardEvent.code -> approximate PC Set 1 scancode (hex)
// This map targets the common physical keys. Values chosen are the typical Set 1 scancodes.
//
const baseMap: Record<string, KeyMapping> = {
  // Letters
  KeyA: { key: 'a', code: 'KeyA', scancode: 0x1e },
  KeyB: { key: 'b', code: 'KeyB', scancode: 0x30 },
  KeyC: { key: 'c', code: 'KeyC', scancode: 0x2e },
  KeyD: { key: 'd', code: 'KeyD', scancode: 0x20 },
  KeyE: { key: 'e', code: 'KeyE', scancode: 0x12 },
  KeyF: { key: 'f', code: 'KeyF', scancode: 0x21 },
  KeyG: { key: 'g', code: 'KeyG', scancode: 0x22 },
  KeyH: { key: 'h', code: 'KeyH', scancode: 0x23 },
  KeyI: { key: 'i', code: 'KeyI', scancode: 0x17 },
  KeyJ: { key: 'j', code: 'KeyJ', scancode: 0x24 },
  KeyK: { key: 'k', code: 'KeyK', scancode: 0x25 },
  KeyL: { key: 'l', code: 'KeyL', scancode: 0x26 },
  KeyM: { key: 'm', code: 'KeyM', scancode: 0x32 },
  KeyN: { key: 'n', code: 'KeyN', scancode: 0x31 },
  KeyO: { key: 'o', code: 'KeyO', scancode: 0x18 },
  KeyP: { key: 'p', code: 'KeyP', scancode: 0x19 },
  KeyQ: { key: 'q', code: 'KeyQ', scancode: 0x10 },
  KeyR: { key: 'r', code: 'KeyR', scancode: 0x13 },
  KeyS: { key: 's', code: 'KeyS', scancode: 0x1f },
  KeyT: { key: 't', code: 'KeyT', scancode: 0x14 },
  KeyU: { key: 'u', code: 'KeyU', scancode: 0x16 },
  KeyV: { key: 'v', code: 'KeyV', scancode: 0x2f },
  KeyW: { key: 'w', code: 'KeyW', scancode: 0x11 },
  KeyX: { key: 'x', code: 'KeyX', scancode: 0x2d },
  KeyY: { key: 'y', code: 'KeyY', scancode: 0x15 },
  KeyZ: { key: 'z', code: 'KeyZ', scancode: 0x2c },

  // Digits (top row)
  Digit1: { key: '1', code: 'Digit1', scancode: 0x02 },
  Digit2: { key: '2', code: 'Digit2', scancode: 0x03 },
  Digit3: { key: '3', code: 'Digit3', scancode: 0x04 },
  Digit4: { key: '4', code: 'Digit4', scancode: 0x05 },
  Digit5: { key: '5', code: 'Digit5', scancode: 0x06 },
  Digit6: { key: '6', code: 'Digit6', scancode: 0x07 },
  Digit7: { key: '7', code: 'Digit7', scancode: 0x08 },
  Digit8: { key: '8', code: 'Digit8', scancode: 0x09 },
  Digit9: { key: '9', code: 'Digit9', scancode: 0x0a },
  Digit0: { key: '0', code: 'Digit0', scancode: 0x0b },

  // Function keys
  Escape: { key: 'Escape', code: 'Escape', scancode: 0x01 },
  F1: { key: 'F1', code: 'F1', scancode: 0x3b },
  F2: { key: 'F2', code: 'F2', scancode: 0x3c },
  F3: { key: 'F3', code: 'F3', scancode: 0x3d },
  F4: { key: 'F4', code: 'F4', scancode: 0x3e },
  F5: { key: 'F5', code: 'F5', scancode: 0x3f },
  F6: { key: 'F6', code: 'F6', scancode: 0x40 },
  F7: { key: 'F7', code: 'F7', scancode: 0x41 },
  F8: { key: 'F8', code: 'F8', scancode: 0x42 },
  F9: { key: 'F9', code: 'F9', scancode: 0x43 },
  F10: { key: 'F10', code: 'F10', scancode: 0x44 },
  F11: { key: 'F11', code: 'F11', scancode: 0x57 },
  F12: { key: 'F12', code: 'F12', scancode: 0x58 },

  // Editing/navigation
  PrintScreen: { key: 'PrintScreen', code: 'PrintScreen', scancode: 0x37 },
  ScrollLock: { key: 'ScrollLock', code: 'ScrollLock', scancode: 0x46 },
  Pause: { key: 'Pause', code: 'Pause', scancode: 0x45 },

  Insert: { key: 'Insert', code: 'Insert', scancode: 0x52 },
  Home: { key: 'Home', code: 'Home', scancode: 0x47 },
  PageUp: { key: 'PageUp', code: 'PageUp', scancode: 0x49 },
  Delete: { key: 'Delete', code: 'Delete', scancode: 0x53 },
  End: { key: 'End', code: 'End', scancode: 0x4f },
  PageDown: { key: 'PageDown', code: 'PageDown', scancode: 0x51 },

  // Arrow keys (usually on extended set)
  ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', scancode: 0x48 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', scancode: 0x50 },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', scancode: 0x4b },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', scancode: 0x4d },

  // Whitespace / control
  Space: { key: ' ', code: 'Space', scancode: 0x39 },
  Enter: { key: 'Enter', code: 'Enter', scancode: 0x1c },
  Backspace: { key: 'Backspace', code: 'Backspace', scancode: 0x0e },
  Tab: { key: 'Tab', code: 'Tab', scancode: 0x0f },

  // Modifiers
  CapsLock: { key: 'CapsLock', code: 'CapsLock', scancode: 0x3a },
  ShiftLeft: { key: 'Shift', code: 'ShiftLeft', scancode: 0x2a },
  ShiftRight: { key: 'Shift', code: 'ShiftRight', scancode: 0x36 },
  ControlLeft: { key: 'Control', code: 'ControlLeft', scancode: 0x1d },
  ControlRight: { key: 'Control', code: 'ControlRight', scancode: 0x1d }, // extended in some sets
  AltLeft: { key: 'Alt', code: 'AltLeft', scancode: 0x38 },
  AltRight: { key: 'Alt', code: 'AltRight', scancode: 0x38 }, // extended variants exist
  MetaLeft: { key: 'Meta', code: 'MetaLeft', scancode: 0xe05b },
  MetaRight: { key: 'Meta', code: 'MetaRight', scancode: 0xe05c },

  // Symbols / punctuation (US-centric approximations)
  Minus: { key: '-', code: 'Minus', scancode: 0x0c },
  Equal: { key: '=', code: 'Equal', scancode: 0x0d },
  BracketLeft: { key: '[', code: 'BracketLeft', scancode: 0x1a },
  BracketRight: { key: ']', code: 'BracketRight', scancode: 0x1b },
  Backslash: { key: '\\', code: 'Backslash', scancode: 0x2b },
  Semicolon: { key: ';', code: 'Semicolon', scancode: 0x27 },
  Quote: { key: "'", code: 'Quote', scancode: 0x28 },
  Backquote: { key: '`', code: 'Backquote', scancode: 0x29 },
  Comma: { key: ',', code: 'Comma', scancode: 0x33 },
  Period: { key: '.', code: 'Period', scancode: 0x34 },
  Slash: { key: '/', code: 'Slash', scancode: 0x35 },

  // Numpad
  Numpad0: { key: '0', code: 'Numpad0', scancode: 0x52 },
  Numpad1: { key: '1', code: 'Numpad1', scancode: 0x4f },
  Numpad2: { key: '2', code: 'Numpad2', scancode: 0x50 },
  Numpad3: { key: '3', code: 'Numpad3', scancode: 0x51 },
  Numpad4: { key: '4', code: 'Numpad4', scancode: 0x4b },
  Numpad5: { key: '5', code: 'Numpad5', scancode: 0x4c },
  Numpad6: { key: '6', code: 'Numpad6', scancode: 0x4d },
  Numpad7: { key: '7', code: 'Numpad7', scancode: 0x47 },
  Numpad8: { key: '8', code: 'Numpad8', scancode: 0x48 },
  Numpad9: { key: '9', code: 'Numpad9', scancode: 0x49 },
  NumpadMultiply: { key: '*', code: 'NumpadMultiply', scancode: 0x37 },
  NumpadAdd: { key: '+', code: 'NumpadAdd', scancode: 0x4e },
  NumpadSubtract: { key: '-', code: 'NumpadSubtract', scancode: 0x4a },
  NumpadDecimal: { key: '.', code: 'NumpadDecimal', scancode: 0x53 },
  NumpadDivide: { key: '/', code: 'NumpadDivide', scancode: 0xe035 },

  // Media / browser keys (best-effort approximate extended codes)
  MediaTrackNext: { key: 'MediaTrackNext', code: 'MediaTrackNext', scancode: 0xe019 },
  MediaTrackPrevious: { key: 'MediaTrackPrevious', code: 'MediaTrackPrevious', scancode: 0xe010 },
  MediaStop: { key: 'MediaStop', code: 'MediaStop', scancode: 0xe024 },
  MediaPlayPause: { key: 'MediaPlayPause', code: 'MediaPlayPause', scancode: 0xe022 },
  VolumeMute: { key: 'VolumeMute', code: 'VolumeMute', scancode: 0xe020 },
  VolumeDown: { key: 'VolumeDown', code: 'VolumeDown', scancode: 0xe012 },
  VolumeUp: { key: 'VolumeUp', code: 'VolumeUp', scancode: 0xe013 },

  // Intl variants (placeholders for layouts that remap keys)
  IntlBackslash: { key: '\\', code: 'IntlBackslash', scancode: 0x56 },
  IntlYen: { key: '¥', code: 'IntlYen', scancode: 0x7d },
};

const layoutOverrides: Record<string, Partial<Record<string, KeyMapping>>> = {
  QWERTY: {},

  AZERTY: {
    KeyA: { key: 'q', code: 'KeyA', scancode: baseMap.KeyQ.scancode },
    KeyZ: { key: 'w', code: 'KeyZ', scancode: baseMap.KeyW.scancode },
    KeyQ: { key: 'a', code: 'KeyQ', scancode: baseMap.KeyA.scancode },
    KeyM: { key: ';', code: 'KeyM', scancode: baseMap.Semicolon.scancode },
    Digit1: { key: '&', code: 'Digit1', scancode: baseMap.Digit1.scancode },
    Digit2: { key: 'é', code: 'Digit2', scancode: baseMap.Digit2.scancode },
    Digit3: { key: '"', code: 'Digit3', scancode: baseMap.Digit3.scancode },
    Digit4: { key: "'", code: 'Digit4', scancode: baseMap.Digit4.scancode },
    Digit5: { key: '(', code: 'Digit5', scancode: baseMap.Digit5.scancode },
    Digit6: { key: '-', code: 'Digit6', scancode: baseMap.Digit6.scancode },
    Digit7: { key: 'è', code: 'Digit7', scancode: baseMap.Digit7.scancode },
    Digit8: { key: '_', code: 'Digit8', scancode: baseMap.Digit8.scancode },
    Digit9: { key: 'ç', code: 'Digit9', scancode: baseMap.Digit9.scancode },
    Digit0: { key: 'à', code: 'Digit0', scancode: baseMap.Digit0.scancode },
    Minus: { key: ')', code: 'Minus', scancode: baseMap.Minus.scancode },
    Equal: { key: '=', code: 'Equal', scancode: baseMap.Equal.scancode },
    Semicolon: { key: 'm', code: 'Semicolon', scancode: baseMap.KeyM.scancode },
    Quote: { key: 'ù', code: 'Quote', scancode: baseMap.Quote.scancode },
    Backslash: { key: '*', code: 'Backslash', scancode: baseMap.Backslash.scancode },
    IntlBackslash: { key: '<', code: 'IntlBackslash', scancode: baseMap.IntlBackslash.scancode },
  },

  QWERTZ: {
    KeyY: { key: 'z', code: 'KeyY', scancode: baseMap.KeyZ.scancode },
    KeyZ: { key: 'y', code: 'KeyZ', scancode: baseMap.KeyY.scancode },
    BracketLeft: { key: 'ü', code: 'BracketLeft', scancode: baseMap.BracketLeft.scancode },
    BracketRight: { key: '+', code: 'BracketRight', scancode: baseMap.BracketRight.scancode },
    Semicolon: { key: 'ö', code: 'Semicolon', scancode: baseMap.Semicolon.scancode },
    Quote: { key: 'ä', code: 'Quote', scancode: baseMap.Quote.scancode },
    Backslash: { key: '#', code: 'Backslash', scancode: baseMap.Backslash.scancode },
    IntlBackslash: { key: '<', code: 'IntlBackslash', scancode: baseMap.IntlBackslash.scancode },
  },

  DVORAK: {
    KeyQ: { key: "'", code: 'KeyQ', scancode: baseMap.Quote.scancode },
    KeyW: { key: ',', code: 'KeyW', scancode: baseMap.Comma.scancode },
    KeyE: { key: '.', code: 'KeyE', scancode: baseMap.Period.scancode },
    KeyR: { key: 'p', code: 'KeyR', scancode: baseMap.KeyP.scancode },
    KeyT: { key: 'y', code: 'KeyT', scancode: baseMap.KeyY.scancode },
    KeyY: { key: 'f', code: 'KeyY', scancode: baseMap.KeyF.scancode },
    KeyU: { key: 'g', code: 'KeyU', scancode: baseMap.KeyG.scancode },
    KeyI: { key: 'c', code: 'KeyI', scancode: baseMap.KeyC.scancode },
    KeyO: { key: 'r', code: 'KeyO', scancode: baseMap.KeyR.scancode },
    KeyP: { key: 'l', code: 'KeyP', scancode: baseMap.KeyL.scancode },
    KeyA: { key: 'a', code: 'KeyA', scancode: baseMap.KeyA.scancode },
    KeyS: { key: 'o', code: 'KeyS', scancode: baseMap.KeyO.scancode },
    KeyD: { key: 'e', code: 'KeyD', scancode: baseMap.KeyE.scancode },
    KeyF: { key: 'u', code: 'KeyF', scancode: baseMap.KeyU.scancode },
    KeyG: { key: 'i', code: 'KeyG', scancode: baseMap.KeyI.scancode },
    KeyH: { key: 'd', code: 'KeyH', scancode: baseMap.KeyD.scancode },
    KeyJ: { key: 'h', code: 'KeyJ', scancode: baseMap.KeyH.scancode },
    KeyK: { key: 't', code: 'KeyK', scancode: baseMap.KeyT.scancode },
    KeyL: { key: 'n', code: 'KeyL', scancode: baseMap.KeyN.scancode },
    Semicolon: { key: 's', code: 'Semicolon', scancode: baseMap.KeyS.scancode },
    Quote: { key: '-', code: 'Quote', scancode: baseMap.Minus.scancode },
    KeyZ: { key: ';', code: 'KeyZ', scancode: baseMap.Semicolon.scancode },
    KeyX: { key: 'q', code: 'KeyX', scancode: baseMap.KeyQ.scancode },
    KeyC: { key: 'j', code: 'KeyC', scancode: baseMap.KeyJ.scancode },
    KeyV: { key: 'k', code: 'KeyV', scancode: baseMap.KeyK.scancode },
    KeyB: { key: 'x', code: 'KeyB', scancode: baseMap.KeyX.scancode },
    KeyN: { key: 'b', code: 'KeyN', scancode: baseMap.KeyB.scancode },
    KeyM: { key: 'm', code: 'KeyM', scancode: baseMap.KeyM.scancode },
    Comma: { key: 'w', code: 'Comma', scancode: baseMap.KeyW.scancode },
    Period: { key: 'v', code: 'Period', scancode: baseMap.KeyV.scancode },
    Slash: { key: 'z', code: 'Slash', scancode: baseMap.KeyZ.scancode },
  },

  JIS: {
    // Top row
    Backquote: { key: '半角/全角', code: 'Backquote', scancode: 0x29 },
    Digit1: { key: '1', code: 'Digit1', scancode: 0x02 },
    Digit2: { key: '2', code: 'Digit2', scancode: 0x03 },
    Digit3: { key: '3', code: 'Digit3', scancode: 0x04 },
    Digit4: { key: '4', code: 'Digit4', scancode: 0x05 },
    Digit5: { key: '5', code: 'Digit5', scancode: 0x06 },
    Digit6: { key: '6', code: 'Digit6', scancode: 0x07 },
    Digit7: { key: '7', code: 'Digit7', scancode: 0x08 },
    Digit8: { key: '8', code: 'Digit8', scancode: 0x09 },
    Digit9: { key: '9', code: 'Digit9', scancode: 0x0a },
    Digit0: { key: '0', code: 'Digit0', scancode: 0x0b },
    Minus: { key: '-', code: 'Minus', scancode: 0x0c },
    Equal: { key: '^', code: 'Equal', scancode: 0x0d },
    IntlBackslash: { key: '¥', code: 'IntlBackslash', scancode: 0x7d },

    // QWERTY row
    KeyQ: { key: 'た', code: 'KeyQ', scancode: 0x10 },
    KeyW: { key: 'て', code: 'KeyW', scancode: 0x11 },
    KeyE: { key: 'い', code: 'KeyE', scancode: 0x12 },
    KeyR: { key: 'す', code: 'KeyR', scancode: 0x13 },
    KeyT: { key: 'か', code: 'KeyT', scancode: 0x14 },
    KeyY: { key: 'ん', code: 'KeyY', scancode: 0x15 },
    KeyU: { key: 'な', code: 'KeyU', scancode: 0x16 },
    KeyI: { key: 'に', code: 'KeyI', scancode: 0x17 },
    KeyO: { key: 'ら', code: 'KeyO', scancode: 0x18 },
    KeyP: { key: 'せ', code: 'KeyP', scancode: 0x19 },
    BracketLeft: { key: '@', code: 'BracketLeft', scancode: 0x1a },
    BracketRight: { key: '[', code: 'BracketRight', scancode: 0x1b },

    // Home row
    KeyA: { key: 'ち', code: 'KeyA', scancode: 0x1e },
    KeyS: { key: 'と', code: 'KeyS', scancode: 0x1f },
    KeyD: { key: 'し', code: 'KeyD', scancode: 0x20 },
    KeyF: { key: 'は', code: 'KeyF', scancode: 0x21 },
    KeyG: { key: 'き', code: 'KeyG', scancode: 0x22 },
    KeyH: { key: 'く', code: 'KeyH', scancode: 0x23 },
    KeyJ: { key: 'ま', code: 'KeyJ', scancode: 0x24 },
    KeyK: { key: 'の', code: 'KeyK', scancode: 0x25 },
    KeyL: { key: 'り', code: 'KeyL', scancode: 0x26 },
    Semicolon: { key: ';', code: 'Semicolon', scancode: 0x27 },
    Quote: { key: ':', code: 'Quote', scancode: 0x28 },
    Backslash: { key: ']', code: 'Backslash', scancode: 0x2b },

    // Bottom row
    KeyZ: { key: 'つ', code: 'KeyZ', scancode: 0x2c },
    KeyX: { key: 'さ', code: 'KeyX', scancode: 0x2d },
    KeyC: { key: 'そ', code: 'KeyC', scancode: 0x2e },
    KeyV: { key: 'ひ', code: 'KeyV', scancode: 0x2f },
    KeyB: { key: 'こ', code: 'KeyB', scancode: 0x30 },
    KeyN: { key: 'み', code: 'KeyN', scancode: 0x31 },
    KeyM: { key: 'も', code: 'KeyM', scancode: 0x32 },
    Comma: { key: ',', code: 'Comma', scancode: 0x33 },
    Period: { key: '.', code: 'Period', scancode: 0x34 },
    Slash: { key: '/', code: 'Slash', scancode: 0x35 },

    // Extra JIS keys
    NonConvert: { key: '無変換', code: 'NonConvert', scancode: 0x7b },
    Convert: { key: '変換', code: 'Convert', scancode: 0x79 },
    KanaMode: { key: 'かな', code: 'KanaMode', scancode: 0x70 },
    Eisu: { key: '英数', code: 'Eisu', scancode: 0x72 },
  },

  // 🇷🇺 Russian ЙЦУКЕН
  RUSSIAN: {
    KeyQ: { key: 'й', code: 'KeyQ', scancode: baseMap.KeyQ.scancode },
    KeyW: { key: 'ц', code: 'KeyW', scancode: baseMap.KeyW.scancode },
    KeyE: { key: 'у', code: 'KeyE', scancode: baseMap.KeyE.scancode },
    KeyR: { key: 'к', code: 'KeyR', scancode: baseMap.KeyR.scancode },
    KeyT: { key: 'е', code: 'KeyT', scancode: baseMap.KeyT.scancode },
    KeyY: { key: 'н', code: 'KeyY', scancode: baseMap.KeyY.scancode },
    KeyU: { key: 'г', code: 'KeyU', scancode: baseMap.KeyU.scancode },
    KeyI: { key: 'ш', code: 'KeyI', scancode: baseMap.KeyI.scancode },
    KeyO: { key: 'щ', code: 'KeyO', scancode: baseMap.KeyO.scancode },
    KeyP: { key: 'з', code: 'KeyP', scancode: baseMap.KeyP.scancode },
    BracketLeft: { key: 'х', code: 'BracketLeft', scancode: baseMap.BracketLeft.scancode },
    BracketRight: { key: 'ъ', code: 'BracketRight', scancode: baseMap.BracketRight.scancode },
    KeyA: { key: 'ф', code: 'KeyA', scancode: baseMap.KeyA.scancode },
    KeyS: { key: 'ы', code: 'KeyS', scancode: baseMap.KeyS.scancode },
    KeyD: { key: 'в', code: 'KeyD', scancode: baseMap.KeyD.scancode },
    KeyF: { key: 'а', code: 'KeyF', scancode: baseMap.KeyF.scancode },
    KeyG: { key: 'п', code: 'KeyG', scancode: baseMap.KeyG.scancode },
    KeyH: { key: 'р', code: 'KeyH', scancode: baseMap.KeyH.scancode },
    KeyJ: { key: 'о', code: 'KeyJ', scancode: baseMap.KeyJ.scancode },
    KeyK: { key: 'л', code: 'KeyK', scancode: baseMap.KeyK.scancode },
    KeyL: { key: 'д', code: 'KeyL', scancode: baseMap.KeyL.scancode },
    Semicolon: { key: 'ж', code: 'Semicolon', scancode: baseMap.Semicolon.scancode },
    Quote: { key: 'э', code: 'Quote', scancode: baseMap.Quote.scancode },
    KeyZ: { key: 'я', code: 'KeyZ', scancode: baseMap.KeyZ.scancode },
    KeyX: { key: 'ч', code: 'KeyX', scancode: baseMap.KeyX.scancode },
    KeyC: { key: 'с', code: 'KeyC', scancode: baseMap.KeyC.scancode },
    KeyV: { key: 'м', code: 'KeyV', scancode: baseMap.KeyV.scancode },
    KeyB: { key: 'и', code: 'KeyB', scancode: baseMap.KeyB.scancode },
    KeyN: { key: 'т', code: 'KeyN', scancode: baseMap.KeyN.scancode },
    KeyM: { key: 'ь', code: 'KeyM', scancode: baseMap.KeyM.scancode },
    Comma: { key: 'б', code: 'Comma', scancode: baseMap.Comma.scancode },
    Period: { key: 'ю', code: 'Period', scancode: baseMap.Period.scancode },
    Slash: { key: '.', code: 'Slash', scancode: baseMap.Slash.scancode },
  },

  // 🇸🇪 Nordic (Swedish/Finnish)
  NORDIC: {
    BracketLeft: { key: 'å', code: 'BracketLeft', scancode: baseMap.BracketLeft.scancode },
    Quote: { key: 'ä', code: 'Quote', scancode: baseMap.Quote.scancode },
    Semicolon: { key: 'ö', code: 'Semicolon', scancode: baseMap.Semicolon.scancode },
    IntlBackslash: { key: '<', code: 'IntlBackslash', scancode: baseMap.IntlBackslash.scancode },
    Minus: { key: '+', code: 'Minus', scancode: baseMap.Minus.scancode },
    Equal: { key: '´', code: 'Equal', scancode: baseMap.Equal.scancode },
    Backslash: { key: "'", code: 'Backslash', scancode: baseMap.Backslash.scancode },
  },
};

export function getScancode(code: string, layout: string): KeyMapping | null {
  const override = layoutOverrides[layout]?.[code];
  const base = baseMap[code];
  return override ?? base ?? null;
}
