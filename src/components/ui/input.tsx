import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, isInvalid = false, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deepPurple/40",
        isInvalid ? "border-coral" : "border-slate-200",
        "placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
