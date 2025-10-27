"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { generateScenesFromScript } from "@/lib/scene-generator";
import { findAssetById, suggestAssets } from "@/lib/assets";
import type { Scene, SceneAsset, StoryboardState } from "@/lib/types";
import { safeJsonParse } from "@/lib/utils";
import { WORD_LIMIT } from "@/lib/constants";

const STORAGE_KEY = "storyvid-storyboard-state";

type StoryboardAction =
  | { type: "hydrate"; payload: StoryboardState }
  | { type: "set-script"; payload: { script: string } }
  | { type: "start-generating" }
  | { type: "set-scenes"; payload: { scenes: Scene[] } }
  | { type: "set-active"; payload: { id: string } }
  | { type: "update-scene"; payload: { id: string; data: Partial<Scene> } }
  | { type: "reorder-scenes"; payload: { scenes: Scene[] } }
  | { type: "assign-asset"; payload: { id: string; asset?: SceneAsset } }
  | { type: "set-warnings"; payload: { warnings: string[] } };

const defaultScenes = generateScenesFromScript("");

const defaultState: StoryboardState = {
  scenes: defaultScenes,
  activeSceneId: defaultScenes[0]?.id ?? null,
  script: "",
  warnings: [],
  isGenerating: false,
  lastUpdated: Date.now()
};

function reducer(state: StoryboardState, action: StoryboardAction): StoryboardState {
  switch (action.type) {
    case "hydrate":
      return { ...action.payload, isGenerating: false };
    case "set-script":
      return {
        ...state,
        script: action.payload.script,
        warnings: buildWarnings(action.payload.script),
        lastUpdated: Date.now()
      };
    case "start-generating":
      return { ...state, isGenerating: true };
    case "set-scenes":
      return {
        ...state,
        scenes: action.payload.scenes,
        activeSceneId: action.payload.scenes[0]?.id ?? null,
        isGenerating: false,
        lastUpdated: Date.now()
      };
    case "set-active":
      return {
        ...state,
        activeSceneId: action.payload.id,
        lastUpdated: Date.now()
      };
    case "update-scene":
      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.payload.id ? { ...scene, ...action.payload.data } : scene
        ),
        lastUpdated: Date.now()
      };
    case "reorder-scenes":
      return {
        ...state,
        scenes: action.payload.scenes,
        lastUpdated: Date.now()
      };
    case "assign-asset":
      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.payload.id ? { ...scene, asset: action.payload.asset } : scene
        ),
        lastUpdated: Date.now()
      };
    case "set-warnings":
      return { ...state, warnings: action.payload.warnings, lastUpdated: Date.now() };
    default:
      return state;
  }
}

function buildWarnings(script: string): string[] {
  const warnings: string[] = [];
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  if (wordCount > WORD_LIMIT) {
    warnings.push(`Script is ${wordCount} words. Consider trimming below ${WORD_LIMIT} for best results.`);
  }
  if (!script.trim()) {
    warnings.push("Add a script to unlock AI-assisted scene generation.");
  }
  return warnings;
}

export function useStoryboard() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [isHydrated, setIsHydrated] = useState(false);
  const persistTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = safeJsonParse<StoryboardState>(window.localStorage.getItem(STORAGE_KEY));
    if (cached) {
      dispatch({ type: "hydrate", payload: cached });
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    if (persistTimer.current !== null) {
      window.clearTimeout(persistTimer.current);
      persistTimer.current = null;
    }
    persistTimer.current = window.setTimeout(() => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...state,
          isGenerating: false
        })
      );
      persistTimer.current = null;
    }, 600);
    return () => {
      if (persistTimer.current !== null) {
        window.clearTimeout(persistTimer.current);
        persistTimer.current = null;
      }
    };
  }, [state, isHydrated]);

  const setScript = useCallback((script: string) => {
    dispatch({ type: "set-script", payload: { script } });
  }, []);

  const setActiveScene = useCallback((id: string) => {
    dispatch({ type: "set-active", payload: { id } });
  }, []);

  const updateScene = useCallback((id: string, data: Partial<Scene>) => {
    dispatch({ type: "update-scene", payload: { id, data } });
  }, []);

  const reorderScenes = useCallback((scenes: Scene[]) => {
    dispatch({ type: "reorder-scenes", payload: { scenes } });
  }, []);

  const assignAsset = useCallback((sceneId: string, asset?: SceneAsset) => {
    dispatch({ type: "assign-asset", payload: { id: sceneId, asset } });
  }, []);

  const generateScenes = useCallback(async () => {
    dispatch({ type: "start-generating" });
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      const scenes = generateScenesFromScript(state.script);
      dispatch({ type: "set-scenes", payload: { scenes } });
    } catch (error) {
      console.error("Scene generation failed", error);
      dispatch({
        type: "set-warnings",
        payload: { warnings: ["Scene generation failed. Please adjust your script and try again."] }
      });
      dispatch({ type: "set-scenes", payload: { scenes: state.scenes } });
    }
  }, [state.script, state.scenes]);

  const autoIllustrate = useCallback(
    (sceneId?: string) => {
      if (sceneId) {
        const scene = state.scenes.find((item) => item.id === sceneId);
        if (!scene) return;
        const suggestion = suggestAssets(scene.keywords)[0];
        if (suggestion) {
          assignAsset(sceneId, suggestion);
        }
        return;
      }
      state.scenes.forEach((scene) => {
        const suggestion = suggestAssets(scene.keywords)[0];
        if (suggestion) {
          assignAsset(scene.id, suggestion);
        }
      });
    },
    [assignAsset, state.scenes]
  );

  const activeScene = useMemo(() => {
    if (!state.activeSceneId) return state.scenes[0] ?? null;
    return state.scenes.find((scene) => scene.id === state.activeSceneId) ?? state.scenes[0] ?? null;
  }, [state.activeSceneId, state.scenes]);

  return {
    state,
    isHydrated,
    activeScene,
    setScript,
    generateScenes,
    setActiveScene,
    updateScene,
    reorderScenes,
    assignAsset,
    autoIllustrate,
    findAsset: findAssetById
  };
}
