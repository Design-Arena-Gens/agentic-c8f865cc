import { nanoid } from "nanoid";
import { ACCENT_COLORS, STOP_WORDS } from "@/lib/constants";
import type { AnimationStyle, LayoutStyle, Scene, TextPlacement } from "@/lib/types";
import { clamp, hashString, unique } from "@/lib/utils";

const SENTENCE_DELIMITER = /(?<=[.!?])\s+(?=[A-Z])/g;

const DEFAULT_LAYOUTS: LayoutStyle[] = ["hero", "split", "row", "column", "grid", "centered"];
const TEXT_PLACEMENTS: TextPlacement[] = ["left", "right", "top", "bottom", "overlay", "center"];
const ANIMATION_MAP: Record<string, AnimationStyle> = {
  energy: "bounce",
  launch: "zoom",
  growth: "slide",
  journey: "slide",
  future: "zoom",
  audience: "fade",
  idea: "bounce",
  solution: "fade",
  product: "zoom",
  story: "slide"
};

function toWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));
}

export function extractKeywords(text: string, limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const word of toWords(text)) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function createTitleFromKeywords(keywords: string[], index: number): string {
  if (keywords.length === 0) {
    return `Scene ${index + 1}`;
  }
  if (keywords.length === 1) {
    return `${capitalize(keywords[0])} Moment`;
  }
  return keywords
    .slice(0, 2)
    .map((word) => capitalize(word))
    .join(" & ");
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function determineDuration(words: number): number {
  const base = clamp(words / 3, 4, 12);
  return Math.round(base * 10) / 10;
}

function determineLayout(index: number, keywords: string[]): LayoutStyle {
  if (keywords.includes("split") || keywords.includes("compare")) return "split";
  if (keywords.includes("hero")) return "hero";
  if (keywords.includes("grid")) return "grid";
  return DEFAULT_LAYOUTS[index % DEFAULT_LAYOUTS.length];
}

function determineTextPlacement(hash: number): TextPlacement {
  return TEXT_PLACEMENTS[hash % TEXT_PLACEMENTS.length];
}

function determineAnimation(keywords: string[], hash: number): AnimationStyle {
  for (const keyword of keywords) {
    const candidate = ANIMATION_MAP[keyword];
    if (candidate) return candidate;
  }
  const styles: AnimationStyle[] = ["fade", "slide", "zoom", "bounce"];
  return styles[hash % styles.length];
}

function chooseAccentColor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

function normalizeScript(script: string): string {
  return script.replace(/\s+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

export function splitScript(script: string): string[] {
  const normalized = normalizeScript(script);
  if (!normalized) return [];
  const segments = normalized.includes("\n\n")
    ? normalized.split(/\n{2,}/)
    : normalized.split(SENTENCE_DELIMITER);
  return segments.map((segment) => segment.trim()).filter(Boolean);
}

export function generateScenesFromScript(script: string): Scene[] {
  const segments = splitScript(script);
  if (!segments.length) {
    return [
      {
        id: nanoid(),
        title: "Ignite Curiosity",
        narrative: "Hook your audience with a bold statement that frames the problem you solve.",
        keywords: ["hook", "audience", "problem"],
        duration: 6,
        layout: "hero",
        textPlacement: "center",
        animation: "fade",
        accentColor: chooseAccentColor(0)
      },
      {
        id: nanoid(),
        title: "Show the Transformation",
        narrative: "Illustrate the before-and-after journey with a confident tone and clear visuals.",
        keywords: ["transformation", "journey", "clarity"],
        duration: 7,
        layout: "split",
        textPlacement: "left",
        animation: "slide",
        accentColor: chooseAccentColor(1)
      },
      {
        id: nanoid(),
        title: "Call to Action",
        narrative: "Close with energy and invite your viewers to take the next step right now.",
        keywords: ["action", "energy", "invite"],
        duration: 5,
        layout: "centered",
        textPlacement: "bottom",
        animation: "bounce",
        accentColor: chooseAccentColor(2)
      }
    ];
  }

  return segments.map((segment, index) => {
    const words = toWords(segment);
    const keywords = unique(extractKeywords(segment, 3));
    const hash = hashString(segment + index.toString());
    const duration = determineDuration(words.length || 12);
    return {
      id: nanoid(),
      title: createTitleFromKeywords(keywords, index),
      narrative: segment,
      keywords,
      duration,
      layout: determineLayout(index, keywords),
      textPlacement: determineTextPlacement(hash),
      animation: determineAnimation(keywords, hash),
      accentColor: chooseAccentColor(index)
    } satisfies Scene;
  });
}
