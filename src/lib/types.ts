export type AnimationStyle = "fade" | "slide" | "zoom" | "bounce";

export type LayoutStyle = "row" | "column" | "grid" | "centered" | "split" | "hero";

export type TextPlacement = "top" | "bottom" | "left" | "right" | "center" | "overlay";

export interface SceneAsset {
  id: string;
  name: string;
  svg: string;
  library: SvgLibrary;
  category: string;
  keywords: string[];
  palette: string[];
}

export type SvgLibrary = "Aurora" | "FeatherForge" | "Lumen" | "MotionWave";

export interface Scene {
  id: string;
  title: string;
  narrative: string;
  keywords: string[];
  duration: number;
  layout: LayoutStyle;
  textPlacement: TextPlacement;
  animation: AnimationStyle;
  accentColor: string;
  asset?: SceneAsset;
}

export interface StoryboardState {
  scenes: Scene[];
  activeSceneId: string | null;
  script: string;
  warnings: string[];
  isGenerating: boolean;
  lastUpdated: number;
}
