"use client";

import { useMemo } from "react";
import { AlertTriangle, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_SCRIPT_PLACEHOLDER, WORD_LIMIT } from "@/lib/constants";

type ScriptPanelProps = {
  script: string;
  onScriptChange: (value: string) => void;
  onGenerate: () => void;
  warnings: string[];
  isGenerating: boolean;
  onAutoIllustrateAll: () => void;
};

export function ScriptPanel({ script, onScriptChange, onGenerate, warnings, isGenerating, onAutoIllustrateAll }: ScriptPanelProps) {
  const wordCount = useMemo(() => (script.trim() ? script.trim().split(/\s+/).length : 0), [script]);

  return (
    <section className="relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-deepPurple">Script to storyboard</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Drop your script and let StoryVid sketch the vision</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onAutoIllustrateAll} disabled={isGenerating}>
            <Wand2 className="mr-1.5 h-4 w-4" />
            Auto-Illustrate All
          </Button>
          <Button onClick={onGenerate} disabled={isGenerating} className="relative">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Generate Scenes
              </>
            )}
          </Button>
        </div>
      </div>

      <Textarea
        value={script}
        onChange={(event) => onScriptChange(event.target.value)}
        rows={8}
        placeholder={DEFAULT_SCRIPT_PLACEHOLDER}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Word count: {wordCount} / {WORD_LIMIT}</span>
        <span>Tip: StoryVid works best with short sentences that capture one visual idea.</span>
      </div>

      {warnings.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">
          {warnings.map((warning) => (
            <p key={warning} className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {warning}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
