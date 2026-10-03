import React from "react";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  MessageSquareWarning,
  Users,
} from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";
import { PageView } from "../../types";
import { cn } from "../../lib/utils";

export const MobileBottomNav: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activities,
    tasks,
    issues,
  } = useCampaign();

  const navItems: { id: PageView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "activities",
      label: "Activities",
      icon: Calendar,
      badge: activities.filter((a) => a.status === "Scheduled").length,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      badge: tasks.filter((t) => t.status !== "Done").length,
    },
    {
      id: "issues",
      label: "Issues",
      icon: MessageSquareWarning,
      badge: issues.filter((i) => i.status !== "Resolved").length,
    },
    { id: "team", label: "Team", icon: Users },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 text-white border-t border-zinc-800 pb-safe shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px] cursor-pointer",
                isActive ? "text-emerald-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-zinc-400")} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-tight tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
