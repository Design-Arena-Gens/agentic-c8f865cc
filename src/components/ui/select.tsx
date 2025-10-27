import type { SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  isInvalid?: boolean;
};

export function Select({ className, isInvalid = false, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deepPurple/40",
        isInvalid ? "border-coral" : "border-slate-200",
        className
      )}
      {...props}
    />
  );
}
