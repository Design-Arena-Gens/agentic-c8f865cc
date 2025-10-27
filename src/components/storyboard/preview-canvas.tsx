"use client";

import { useMemo } from "react";
import type { Scene } from "@/lib/types";
import { hashString, randomFromHash } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const ANIMATION_CLASS: Record<Scene["animation"], string> = {
  fade: "animate-fadeIn",
  slide: "animate-slideUp",
  zoom: "animate-zoomIn",
  bounce: "animate-bounceIn"
};

type PreviewCanvasProps = {
  scene: Scene | null;
};

export function PreviewCanvas({ scene }: PreviewCanvasProps) {
  const computed = useMemo(() => {
    if (!scene) return null;
    const hash = hashString(scene.id + scene.title);
    const illustrationScale = randomFromHash(hash, 75, 110) / 100;
    const illustrationRotation = randomFromHash(hash + 23, -8, 8);
    const blobPosition = {
      top: `${randomFromHash(hash + 9, 10, 40)}%`,
      left: `${randomFromHash(hash + 14, 10, 60)}%`
    };
    return {
      illustrationScale,
      illustrationRotation,
      blobPosition
    };
  }, [scene]);

  if (!scene) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 text-center text-slate-500">
        <Sparkles className="mb-2 h-6 w-6" />
        <p className="max-w-sm text-sm">Generate scenes to see a live preview of your storyboard with motion and layout guidance.</p>
      </div>
    );
  }

  const textAlignClass = getTextAlignment(scene.textPlacement);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
      <div className="absolute inset-0 light-grid-overlay" />
      <div
        className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-deepPurple/15 blur-3xl"
        style={{ opacity: 0.8 }}
      />
      <div
        className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber/20 blur-3xl"
        style={{ opacity: 0.6 }}
      />

      <div className="relative z-10 flex h-full w-full flex-col gap-4 p-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500">
          <span>StoryVid Scene Preview</span>
          <span>Layout · {scene.layout}</span>
        </div>

        <div className={`relative flex flex-1 items-center justify-center ${getLayoutClass(scene.layout)}`}>
          {scene.asset && (
            <div
              className={`relative flex items-center justify-center rounded-[1.75rem] bg-white/80 p-6 shadow-xl ${ANIMATION_CLASS[scene.animation]}`}
              style={{
                transform: `scale(${computed?.illustrationScale ?? 1}) rotate(${computed?.illustrationRotation ?? 0}deg)`,
                color: scene.accentColor
              }}
            >
              <div className="scene-grid-bg absolute inset-0 rounded-[1.5rem] opacity-40" />
              <div className="relative h-48 w-64 max-w-full" dangerouslySetInnerHTML={{ __html: scene.asset.svg }} />
            </div>
          )}

          <article
            className={`max-w-[420px] rounded-3xl bg-white/85 p-6 shadow-lg backdrop-blur-sm transition ${ANIMATION_CLASS[scene.animation]} ${textAlignClass}`}
            style={{ borderTop: `6px solid ${scene.accentColor}` }}
          >
            <h2 className="text-2xl font-semibold text-slate-900">{scene.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{scene.narrative}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {scene.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-slate-100 px-2 py-1">
                  #{keyword}
                </span>
              ))}
            </div>
          </article>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Animation: {scene.animation.toUpperCase()}</span>
          <span>Text position: {scene.textPlacement}</span>
          <span>Accent: {scene.accentColor}</span>
        </div>
      </div>
    </div>
  );
}

function getLayoutClass(layout: Scene["layout"]): string {
  switch (layout) {
    case "row":
      return "flex-row gap-8";
    case "column":
      return "flex-col gap-6";
    case "grid":
      return "grid grid-cols-2 gap-6";
    case "split":
      return "flex-row gap-6 items-stretch";
    case "hero":
      return "flex-row gap-10";
    case "centered":
    default:
      return "flex-col items-center gap-6 text-center";
  }
}

function getTextAlignment(placement: Scene["textPlacement"]): string {
  switch (placement) {
    case "left":
      return "text-left self-start";
    case "right":
      return "text-right self-end";
    case "top":
      return "self-start";
    case "bottom":
      return "self-end";
    case "overlay":
      return "backdrop-blur-md";
    case "center":
    default:
      return "text-center self-center";
  }
}
