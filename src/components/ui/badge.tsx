import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    // Primary green badge
    default: "bg-emerald-100 text-emerald-900 border border-emerald-200",
    // Neutral grey badge
    secondary: "bg-zinc-100 text-zinc-800 border border-zinc-200",
    // Clean outline
    outline: "text-zinc-700 border border-zinc-300 bg-white",
    // Red badge
    destructive: "bg-rose-50 text-rose-800 border border-rose-200",
    // Deep green success
    success: "bg-emerald-700 text-white border-transparent",
    // Amber/warning
    warning: "bg-amber-50 text-amber-900 border border-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-tight",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
