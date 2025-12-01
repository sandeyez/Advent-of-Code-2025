function isZeroWidth(code: number): boolean {
  return (
    (code >= 0xfe00 && code <= 0xfe0f) || // Variation selectors
    code === 0x200d // Zero Width Joiner
  );
}

function isWideChar(code: number): boolean {
  return (
    (code >= 0x1f300 && code <= 0x1f9ff) || // Emojis
    (code >= 0x1f600 && code <= 0x1f64f) || // Emoticons
    (code >= 0x2300 && code <= 0x23ff) || // Miscellaneous Technical (includes ⏭️)
    (code >= 0x2600 && code <= 0x26ff) || // Symbols
    (code >= 0x2700 && code <= 0x27bf) || // Dingbats
    (code >= 0x3000 && code <= 0x9fff) // CJK characters
  );
}

export function getTerminalLineLength(str: string): number {
  let width = 0;

  // Use for...of to properly iterate over Unicode code points
  for (const char of str) {
    const code = char.codePointAt(0) ?? 0;

    // Skip zero-width characters (variation selectors, ZWJ)
    if (isZeroWidth(code)) continue;

    width += isWideChar(code) ? 2 : 1;
  }

  return width;
}

function needsExtraSpace(line: string): boolean {
  if (line.length < 3) return false;

  const emojiCode = line[0]?.codePointAt(0) ?? 0;
  const variationCode = line[1]?.codePointAt(0) ?? 0;
  const spaceCode = line[2]?.codePointAt(0) ?? 0;

  // Check for: emoji + variation selector + space pattern
  return (
    isWideChar(emojiCode) && isZeroWidth(variationCode) && spaceCode === 0x0020 // Regular space
  );
}

export function formatTerminalLine(line: string, lineLength: number): string {
  // Some terminals don't render spaces after emoji+variation selector sequences.
  // Add an extra space for visibility, but calculate padding from original width
  // since the original space doesn't render visually.
  const displayLine = needsExtraSpace(line)
    ? line.slice(0, 3) + " " + line.slice(3)
    : line;

  const padding = Math.max(0, lineLength - getTerminalLineLength(line) - 4);
  return `| ${displayLine}${" ".repeat(padding)} |`;
}
