"use client";

import { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles as SparklesIcon } from "lucide-react";
import { ScriptPanel } from "@/components/storyboard/script-panel";
import { SceneCard } from "@/components/storyboard/scene-card";
import { PreviewCanvas } from "@/components/storyboard/preview-canvas";
import { AssetStore } from "@/components/storyboard/asset-store";
import { useStoryboard } from "@/lib/use-storyboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allAssets } from "@/lib/assets";

export function StoryboardApp() {
  const {
    state,
    activeScene,
    setScript,
    generateScenes,
    setActiveScene,
    updateScene,
    reorderScenes,
    assignAsset,
    autoIllustrate
  } = useStoryboard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    })
  );

  const [assetStoreSceneId, setAssetStoreSceneId] = useState<string | null>(null);

  const timelineLength = useMemo(
    () => state.scenes.reduce((acc, scene) => acc + scene.duration, 0),
    [state.scenes]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = state.scenes.findIndex((scene) => scene.id === active.id);
    const newIndex = state.scenes.findIndex((scene) => scene.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const sorted = arrayMove(state.scenes, oldIndex, newIndex);
    reorderScenes(sorted);
  };

  const openAssetStore = (sceneId: string) => setAssetStoreSceneId(sceneId);
  const closeAssetStore = () => setAssetStoreSceneId(null);

  const assetScene = state.scenes.find((scene) => scene.id === assetStoreSceneId) ?? null;

  return (
    <div className="flex flex-col gap-8">
      <ScriptPanel
        script={state.script}
        onScriptChange={setScript}
        onGenerate={generateScenes}
        warnings={state.warnings}
        isGenerating={state.isGenerating}
        onAutoIllustrateAll={() => autoIllustrate()}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal">Timeline</p>
              <h2 className="text-xl font-semibold text-slate-900">Scene timeline &amp; AI refinements</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <Badge className="bg-teal/10 text-teal">{state.scenes.length} scenes</Badge>
              <Badge className="bg-coral/10 text-coral">{timelineLength.toFixed(1)}s total</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => reorderScenes(state.scenes.slice().reverse())}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" /> Reverse Order
              </Button>
            </div>
          </header>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={state.scenes} strategy={rectSortingStrategy}>
              <div className="scrollbar-thin -mx-2 flex gap-4 overflow-x-auto px-2 pb-2">
                {state.scenes.map((scene) => (
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    isActive={scene.id === activeScene?.id}
                    onSelect={() => setActiveScene(scene.id)}
                    onChange={(data) => updateScene(scene.id, data)}
                    onAutoIllustrate={() => autoIllustrate(scene.id)}
                    onOpenAssetStore={() => openAssetStore(scene.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-coral">Live preview canvas</p>
              <h2 className="text-xl font-semibold text-slate-900">Motion-ready scene layout</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => autoIllustrate(activeScene?.id)}>
              <SparklesIcon className="mr-1.5 h-4 w-4" /> Refresh Illustration
            </Button>
          </div>

          <PreviewCanvas scene={activeScene ?? null} />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Asset libraries curated • {allAssets().length} illustrated SVGs.
            </span>
            <span>
              Drag cards to reorder, double-click accessories to personalize.
            </span>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {state.warnings.length === 0 && state.script && !state.isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="rounded-3xl border border-amber/40 bg-amber/10 p-5 text-sm text-amber/90"
          >
            Tip: Scenes are editable in real time. Adjust text, timing, and layouts — your changes stay saved in the browser.
          </motion.div>
        )}
      </AnimatePresence>

      <AssetStore
        isOpen={Boolean(assetScene)}
        onClose={closeAssetStore}
        onSelect={(asset) => {
          if (!assetScene) return;
          assignAsset(assetScene.id, asset);
          closeAssetStore();
        }}
        highlightKeywords={assetScene?.keywords ?? []}
      />
    </div>
  );
}
