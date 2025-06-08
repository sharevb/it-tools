export function getAllCodePoints(emoji: string): string {
  const codePoints: string[] = [];
  for (const char of emoji) {
    const codePoint = char.codePointAt(0);
    if (codePoint) {
      codePoints.push(`U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`);
    }
  }
  return codePoints.join(' ');
}

export function escapeUnicodeComplete(emoji: string): string {
  return Array.from(emoji)
    .map((char) => {
      const codePoint = char.codePointAt(0);
      return codePoint ? `\\u${codePoint.toString(16).padStart(4, '0')}` : '';
    })
    .join('');
}

export function isEmojiSupported(emoji: string): boolean {
  if (typeof document === 'undefined') {
    return true;
  } // SSR fallback

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return true;
  }

  canvas.width = 32;
  canvas.height = 32;
  ctx.textBaseline = 'top';
  ctx.font = '24px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"';

  const beforeImageData = ctx.getImageData(0, 0, 32, 32).data;
  ctx.fillText(emoji, 0, 0);
  const afterImageData = ctx.getImageData(0, 0, 32, 32).data;

  // Check if any pixels changed
  for (let i = 0; i < beforeImageData.length; i++) {
    if (beforeImageData[i] !== afterImageData[i]) {
      return true;
    }
  }
  return false;
}
