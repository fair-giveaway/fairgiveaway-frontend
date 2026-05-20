/**
 * Rejection sampling ensures uniform distribution by discarding values
 * that would introduce modulo bias from Uint32 range.
 */
function cryptoRandom(max: number): number {
  if (max <= 0) return 0;

  const uint32Max = 0x100000000;
  const limit = uint32Max - (uint32Max % max);
  const arr = new Uint32Array(1);

  let value: number;
  do {
    crypto.getRandomValues(arr);
    value = arr[0];
  } while (value >= limit);

  return value % max;
}

function fisherYatesShuffle(array: string[]): string[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = cryptoRandom(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export interface DrawResult {
  primary: string[];
  secondary: string[];
}

export function selectWinners(
  participants: string[],
  primaryCount: number,
  secondaryCount: number,
): DrawResult {
  const shuffled = fisherYatesShuffle(participants);
  const primary = shuffled.slice(0, primaryCount);
  const secondary = shuffled.slice(primaryCount, primaryCount + secondaryCount);

  return { primary, secondary };
}
