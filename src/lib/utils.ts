export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function randomFromHash(hash: number, min: number, max: number): number {
  const normalized = (Math.sin(hash) + 1) / 2;
  return Math.round(min + normalized * (max - min));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatDuration(seconds: number): string {
  return `${seconds.toFixed(1)}s`;
}

export function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Failed to parse JSON", error);
    return null;
  }
}
