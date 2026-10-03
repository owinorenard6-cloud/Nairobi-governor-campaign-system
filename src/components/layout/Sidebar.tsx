import React from "react";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  MessageSquareWarning,
  Users,
  Vote,
  ShieldCheck,
  MapPin,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";
import { PageView } from "../../types";
import { cn } from "../../lib/utils";

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    stats,
    activities,
    tasks,
    issues,
    team,
    setIsTestingGuideOpen,
    resetToDemoData,
  } = useCampaign();

  const navItems: { id: PageView; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "activities",
      label: "Activities",
      icon: Calendar,
      count: activities.filter((a) => a.status === "Scheduled").length,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      count: tasks.filter((t) => t.status !== "Done").length,
    },
    {
      id: "issues",
      label: "Community Issues",
      icon: MessageSquareWarning,
      count: issues.filter((i) => i.status !== "Resolved").length,
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      count: team.length,
    },
  ];

  const voterPercent = Math.min(
    100,
    Math.round((stats.registeredVotersReached / stats.registeredVotersTarget) * 100)
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-950 text-white shrink-0 border-r border-zinc-800 min-h-[calc(100vh-80px)]">
      {/* Campaign Brand Badge */}
      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Gubernatorial Ops
            </div>
            <div className="text-xs text-zinc-300 font-medium">
              {stats.candidateName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Campaign Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group",
                isActive
                  ? "bg-emerald-700 text-white shadow-xs font-semibold"
                  : "text-zinc-300 hover:bg-zinc-800/70 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-emerald-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    isActive
                      ? "bg-emerald-900/90 text-emerald-200"
                      : "bg-zinc-800 text-zinc-300"
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Campaign Target Progress Mini Card */}
        <div className="pt-6 px-1">
          <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Voter Mobilization</span>
              <span className="text-emerald-400 font-bold">{voterPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${voterPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                {stats.wardsCoveredCount}/{stats.totalWardsCount} Wards
              </span>
              <span className="text-zinc-300">
                {(stats.registeredVotersReached / 1000).toFixed(0)}k target reach
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer Info & Testing Guide Link */}
      <div className="p-3 border-t border-zinc-800 space-y-1">
        <button
          onClick={() => setIsTestingGuideOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-emerald-400 hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>How to Test Prototype</span>
        </button>
        <button
          onClick={resetToDemoData}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sample Data</span>
        </button>
        <div className="px-3 pt-2 text-[10px] text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Simulated Data Only · No Real Info</span>
        </div>
      </div>
    </aside>
  );
};
