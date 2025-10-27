import { forwardRef, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isInvalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isInvalid = false, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        "w-full rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-deepPurple/50",
        isInvalid ? "border-coral" : "border-slate-200",
        "placeholder:text-slate-400",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
