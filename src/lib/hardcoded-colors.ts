// Finds colour values written by hand in source code, so every screen keeps
// using the named theme tokens in src/app/globals.css. Used by
// hardcoded-colors.test.ts, which checks every file in src/.

// "#fff", "#263a31" or "#263a314d", not part of a URL such as "/products#top".
const HEX_COLOUR =
  /(?<![\w/&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/gi;

// The start of a CSS colour function: "rgba(", "oklch("...
// Also inside Tailwind values such as "shadow-[0_8px_rgba(...)]".
const COLOUR_FUNCTION =
  /(?<![a-z0-9-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/gi;

// "text-[#263a31] rgb(0 0 0)" -> ["#263a31", "rgb("]
export function findHardcodedColors(source: string): string[] {
  return [
    ...(source.match(HEX_COLOUR) ?? []),
    ...(source.match(COLOUR_FUNCTION) ?? []),
  ];
}
