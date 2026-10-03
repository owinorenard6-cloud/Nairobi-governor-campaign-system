import React from "react";
import { cn } from "../../lib/utils";

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80 text-zinc-600 text-xs sm:text-sm font-medium",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  badge?: number | string;
  className?: string;
}

export function TabsTrigger({
  active,
  onClick,
  children,
  badge,
  className,
}: TabsTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer select-none",
        active
          ? "bg-white text-zinc-950 shadow-xs font-semibold"
          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50",
        className
      )}
    >
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "px-1.5 py-0.2 text-[10px] rounded-full font-semibold",
            active
              ? "bg-emerald-100 text-emerald-800"
              : "bg-zinc-200 text-zinc-700"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
