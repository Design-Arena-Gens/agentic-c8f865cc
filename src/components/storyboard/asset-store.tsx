"use client";

import { useMemo, useState } from "react";
import { X, Search, Sparkle } from "lucide-react";
import type { SceneAsset, SvgLibrary } from "@/lib/types";
import { allAssets, getLibraries, searchAssets, suggestAssets } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AssetStoreProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: SceneAsset) => void;
  highlightKeywords: string[];
};

export function AssetStore({ isOpen, onClose, onSelect, highlightKeywords }: AssetStoreProps) {
  const [query, setQuery] = useState("");
  const libraries = getLibraries();
  const [activeLibrary, setActiveLibrary] = useState<SvgLibrary>(libraries[0]);

  const suggested = useMemo(() => suggestAssets(highlightKeywords), [highlightKeywords]);

  if (!isOpen) return null;

  const renderCard = (asset: SceneAsset) => (
    <button
      key={asset.id}
      onClick={() => onSelect(asset)}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 text-left shadow-sm transition hover:border-deepPurple/40 hover:shadow-lg"
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span>{asset.name}</span>
        <span className="rounded-full bg-deepPurple/10 px-2 py-0.5 text-[10px] text-deepPurple">{asset.library}</span>
      </div>
      <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50" style={{ color: asset.palette[0] }}>
        <div dangerouslySetInnerHTML={{ __html: asset.svg }} />
      </div>
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
        {asset.keywords.map((keyword) => (
          <span key={keyword} className="rounded-full bg-slate-100 px-2 py-0.5">#{keyword}</span>
        ))}
      </div>
    </button>
  );

  const libraryAssets = searchAssets(query, { library: activeLibrary });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6"
      role="presentation"
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-store-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-deepPurple">Asset Store</p>
            <h2 id="asset-store-title" className="text-xl font-semibold text-slate-900">
              Curated libraries powered by StoryVid
            </h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="h-10 w-10 rounded-full" aria-label="Close asset store">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-[320px_1fr] gap-6 p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <Input
                className="border-0 px-0 py-0 focus:ring-0"
                placeholder="Search visuals, e.g. product launch"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="rounded-xl border border-amber/30 bg-amber/10 p-4">
              <div className="flex items-center gap-2 text-amber">
                <Sparkle className="h-4 w-4" />
                <p className="text-sm font-semibold">Suggested for this scene</p>
              </div>
              <p className="mt-1 text-xs text-amber/80">
                Based on keywords: {highlightKeywords.length ? highlightKeywords.join(", ") : "add keywords to refine suggestions"}
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {suggested.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => onSelect(asset)}
                    className="flex items-center justify-between rounded-lg border border-transparent bg-white/80 px-3 py-2 hover:border-amber/40"
                  >
                    <span className="text-sm font-medium text-slate-700">{asset.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-amber">{asset.library}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">All categories</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {Array.from(new Set(allAssets().map((asset) => asset.category))).map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Tabs
              defaultValue={activeLibrary}
              className="flex flex-col gap-4"
            >
              <TabsList className="self-start">
                {libraries.map((library) => (
                  <TabsTrigger
                    key={library}
                    value={library}
                    onClick={() => setActiveLibrary(library)}
                  >
                    {library}
                  </TabsTrigger>
                ))}
              </TabsList>

              {libraries.map((library) => (
                <TabsContent key={library} value={library}>
                  {libraryAssets.length === 0 && library === activeLibrary ? (
                    <p className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                      No assets matched your search. Try a different keyword or clear the filters.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {(library === activeLibrary ? libraryAssets : searchAssets(query, { library })).map(renderCard)}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
