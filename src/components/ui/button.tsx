import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "dark";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variants = {
      // Primary: Emerald green with white text
      default: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm active:bg-emerald-900",
      // Secondary: Soft light grey surface with dark text
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300",
      // Outline: White background with light grey border
      outline: "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100",
      // Ghost: Transparent with hover
      ghost: "text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200",
      // Destructive: Crimson with white text
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      // Dark: Solid black with white text
      dark: "bg-zinc-950 text-white hover:bg-zinc-900 active:bg-black shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9.5 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
