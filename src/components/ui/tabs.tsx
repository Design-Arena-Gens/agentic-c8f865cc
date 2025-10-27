"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ defaultValue, className, children }: { defaultValue: string; className?: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue);
  const contextValue = useMemo(() => ({ value, setValue }), [value]);
  return (
    <TabsContext.Provider value={contextValue}>
      <div className={clsx(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={clsx("inline-flex rounded-xl bg-slate-100 p-1 text-sm font-medium", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  ...props
}: {
  value: string;
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  const context = useTabsContext();
  const isActive = context.value === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => context.setValue(value)}
      className={clsx(
        "relative rounded-lg px-3 py-1.5 transition",
        isActive
          ? "bg-white text-deepPurple shadow-sm"
          : "text-slate-500 hover:text-deepPurple/80",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const context = useTabsContext();
  if (context.value !== value) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return context;
}
