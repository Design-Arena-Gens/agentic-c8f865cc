"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-deepPurple text-white shadow-lg shadow-deepPurple/20 hover:bg-[#4c2a8f] focus-visible:ring-deepPurple",
        secondary:
          "bg-white text-deepPurple border border-deepPurple/30 hover:border-deepPurple focus-visible:ring-deepPurple/40",
        subtle:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-deepPurple/30"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={clsx(buttonVariants({ variant, size }), className)} {...props} />;
}
