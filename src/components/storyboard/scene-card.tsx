"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ChangeEvent } from "react";
import { Clock, LayoutGrid, Palette, Sparkles, Wand2 } from "lucide-react";
import type { Scene } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";

const ANIMATION_LABELS: Record<Scene["animation"], string> = {
  fade: "Soft Fade",
  slide: "Slide",
  zoom: "Zoom",
  bounce: "Bounce"
};

const LAYOUT_LABELS: Record<Scene["layout"], string> = {
  hero: "Hero Highlight",
  split: "Split",
  row: "Row",
  column: "Column",
  grid: "Grid",
  centered: "Centered"
};

const TEXT_PLACEMENTS: Record<Scene["textPlacement"], string> = {
  left: "Left",
  right: "Right",
  top: "Top",
  bottom: "Bottom",
  overlay: "Overlay",
  center: "Center"
};

type SceneCardProps = {
  scene: Scene;
  isActive: boolean;
  onSelect: () => void;
  onChange: (data: Partial<Scene>) => void;
  onAutoIllustrate: () => void;
  onOpenAssetStore: () => void;
};

export function SceneCard({
  scene,
  isActive,
  onSelect,
  onChange,
  onAutoIllustrate,
  onOpenAssetStore
}: SceneCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined
  } as const;

  const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!Number.isNaN(value)) {
      onChange({ duration: Math.max(1, Math.min(30, value)) });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group perspective-card flex min-h-[260px] w-[320px] flex-col gap-3 rounded-2xl border p-4 transition-all ${
        isActive
          ? "border-deepPurple/60 bg-white shadow-xl shadow-deepPurple/15"
          : "border-slate-200/70 bg-white/90 shadow-sm hover:border-deepPurple/40"
      }`}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-deepPurple/10 text-deepPurple">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Scene</p>
            <h3 className="text-lg font-semibold text-slate-900">{scene.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(scene.duration)}
          </span>
        </div>
      </div>

      <Textarea
        value={scene.narrative}
        onChange={(event) => onChange({ narrative: event.target.value })}
        rows={5}
        className="min-h-[120px] resize-none bg-white/70"
      />

      <label className="flex flex-col gap-1 text-xs text-slate-600">
        Keywords
        <Input
          value={scene.keywords.join(", ")}
          onChange={(event) =>
            onChange({
              keywords: event.target.value
                .split(/[,\n]/)
                .map((token) => token.trim())
                .filter(Boolean)
                .slice(0, 5)
            })
          }
          placeholder="innovation, launch, customers"
        />
      </label>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <label className="flex flex-col gap-1 text-slate-600">
          Duration (s)
          <Input
            type="number"
            min={1}
            max={30}
            value={scene.duration}
            onChange={handleDurationChange}
            className="text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-slate-600">
          Layout
          <Select value={scene.layout} onChange={(event) => onChange({ layout: event.target.value as Scene["layout"] })}>
            {Object.entries(LAYOUT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-slate-600">
          Animation
          <Select
            value={scene.animation}
            onChange={(event) => onChange({ animation: event.target.value as Scene["animation"] })}
          >
            {Object.entries(ANIMATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-slate-600">
          Text Position
          <Select
            value={scene.textPlacement}
            onChange={(event) =>
              onChange({ textPlacement: event.target.value as Scene["textPlacement"] })
            }
          >
            {Object.entries(TEXT_PLACEMENTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {scene.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-deepPurple/10 px-2.5 py-1 text-xs font-medium text-deepPurple"
            >
              #{keyword}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={(event) => {
            event.stopPropagation();
            onAutoIllustrate();
          }}>
            <Wand2 className="mr-1.5 h-4 w-4" />
            Auto-Illustrate
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              onOpenAssetStore();
            }}
          >
            <Palette className="mr-1.5 h-4 w-4" />
            Assets
          </Button>
        </div>
      </div>

      {scene.asset && (
        <div className="rounded-xl border border-dashed border-teal/40 bg-teal/5 p-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-teal" />
              <span>{scene.asset.name}</span>
            </div>
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-teal">
              {scene.asset.library}
            </span>
          </div>
          <div
            className="mt-2 flex h-24 items-center justify-center rounded-lg bg-white"
            style={{ color: scene.accentColor }}
            dangerouslySetInnerHTML={{ __html: scene.asset.svg }}
          />
        </div>
      )}
    </div>
  );
}
