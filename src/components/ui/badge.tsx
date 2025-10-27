import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        "bg-slate-100 text-slate-700",
        className
      )}
      {...props}
    />
  );
}
