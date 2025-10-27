import { unique } from "@/lib/utils";
import type { SceneAsset, SvgLibrary } from "@/lib/types";

const BASE_ASSETS: SceneAsset[] = [
  {
    id: "aurora-rocket",
    name: "Aurora Launch Rocket",
    library: "Aurora",
    category: "Technology",
    keywords: ["launch", "startup", "growth", "future"],
    palette: ["#5531A7", "#FFB74D", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 12c18 12 24 36 24 60 0 18-6 36-24 36s-24-18-24-36c0-24 6-48 24-60Z" />
      <path d="M60 48v18" />
      <circle cx="60" cy="42" r="8" />
      <path d="M45 96 36 114" />
      <path d="M75 96 84 114" />
    </svg>`
  },
  {
    id: "aurora-idea",
    name: "Aurora Idea Spark",
    library: "Aurora",
    category: "Inspiration",
    keywords: ["idea", "spark", "innovation"],
    palette: ["#FFB74D", "#5531A7", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 20c22 0 40 15 40 36 0 24-19 28-20 44H40c-1-16-20-20-20-44 0-21 18-36 40-36Z" />
      <path d="M48 100h24" />
      <path d="M54 112h12" />
    </svg>`
  },
  {
    id: "feather-chart",
    name: "Feather Growth Chart",
    library: "FeatherForge",
    category: "Analytics",
    keywords: ["growth", "chart", "metrics"],
    palette: ["#2BB3B1", "#5531A7", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 96h84" />
      <path d="M30 96V60" />
      <path d="M54 96V42" />
      <path d="M78 96V24" />
      <polyline points="24,66 48,48 72,60 96,30" />
    </svg>`
  },
  {
    id: "feather-collab",
    name: "Feather Collaboration",
    library: "FeatherForge",
    category: "Team",
    keywords: ["team", "collaboration", "people"],
    palette: ["#FF6F61", "#2BB3B1", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="42" cy="42" r="18" />
      <circle cx="78" cy="42" r="18" />
      <path d="M18 102c0-18 18-30 42-30s42 12 42 30" />
    </svg>`
  },
  {
    id: "lumen-journey",
    name: "Lumen Journey Map",
    library: "Lumen",
    category: "Process",
    keywords: ["journey", "path", "process", "roadmap"],
    palette: ["#5531A7", "#FF6F61", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 90c12-24 24-36 36-36s24 12 36 36" />
      <circle cx="24" cy="90" r="10" />
      <circle cx="60" cy="54" r="10" />
      <circle cx="96" cy="90" r="10" />
      <path d="M60 18v24" />
      <path d="M54 24h12" />
    </svg>`
  },
  {
    id: "lumen-spotlight",
    name: "Lumen Spotlight",
    library: "Lumen",
    category: "Focus",
    keywords: ["focus", "highlight", "attention"],
    palette: ["#FFB74D", "#5531A7", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 102l36-72 36 72" />
      <circle cx="60" cy="42" r="10" />
      <path d="M42 102h36" />
    </svg>`
  },
  {
    id: "motionwave-cascade",
    name: "MotionWave Cascade",
    library: "MotionWave",
    category: "Motion",
    keywords: ["flow", "motion", "animation"],
    palette: ["#2BB3B1", "#FFB74D", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 54c18-24 42-24 60 0 18 24 36 24 24 0-12-24-42-24-60 0-18 24-36 24-24 0Z" />
      <path d="M30 84c12-16 30-16 42 0" />
      <path d="M48 102h24" />
    </svg>`
  },
  {
    id: "motionwave-waveform",
    name: "MotionWave Waveform",
    library: "MotionWave",
    category: "Audio",
    keywords: ["audio", "rhythm", "beat"],
    palette: ["#5531A7", "#2BB3B1", "#FFFFFF"],
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 72c6-18 18-18 24 0 6 18 18 18 24 0 6-18 18-18 24 0 6 18 18 18 24 0" />
      <path d="M18 48h84" />
    </svg>`
  }
];

export function allAssets(): SceneAsset[] {
  return BASE_ASSETS;
}

export function getLibraries(): SvgLibrary[] {
  return unique(BASE_ASSETS.map((asset) => asset.library));
}

export function findAssetById(id: string | undefined): SceneAsset | undefined {
  if (!id) return undefined;
  return BASE_ASSETS.find((asset) => asset.id === id);
}

export function searchAssets(query: string, options?: { library?: SvgLibrary; category?: string }): SceneAsset[] {
  const keywords = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  return BASE_ASSETS.filter((asset) => {
    if (options?.library && asset.library !== options.library) return false;
    if (options?.category && asset.category !== options.category) return false;
    if (keywords.length === 0) return true;
    const haystack = `${asset.name} ${asset.keywords.join(" ")}`.toLowerCase();
    return keywords.every((keyword) => haystack.includes(keyword));
  });
}

export function suggestAssets(keywords: string[]): SceneAsset[] {
  if (!keywords.length) {
    return BASE_ASSETS.slice(0, 3);
  }
  const normalized = keywords.map((word) => word.toLowerCase());
  const matches = BASE_ASSETS.filter((asset) =>
    asset.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
  );
  return matches.length ? matches.slice(0, 4) : BASE_ASSETS.slice(0, 4);
}
