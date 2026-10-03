import React from "react";
import {
  Calendar,
  CheckSquare,
  MessageSquareWarning,
  Users,
  MapPin,
  TrendingUp,
  ArrowRight,
  Clock,
  Plus,
  AlertTriangle,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { useCampaign } from "../context/CampaignContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { formatNumber, formatDate } from "../lib/utils";

export const DashboardPage: React.FC = () => {
  const {
    stats,
    activities,
    tasks,
    issues,
    team,
    setCurrentPage,
    setActiveModal,
    updateTaskStatus,
  } = useCampaign();

  const voterReachPercent = Math.min(
    100,
    Math.round((stats.registeredVotersReached / stats.registeredVotersTarget) * 100)
  );

  const wardReachPercent = Math.round(
    (stats.wardsCoveredCount / stats.totalWardsCount) * 100
  );

  const upcomingActivities = activities
    .filter((a) => a.status === "Scheduled")
    .slice(0, 3);

  const pendingUrgentIssues = issues
    .filter((i) => i.status !== "Resolved")
    .sort((a, b) => (a.priority === "Urgent" ? -1 : 1))
    .slice(0, 3);

  const pendingTasks = tasks.filter((t) => t.status !== "Done").slice(0, 4);

  // Sub-county mobilization sample coverage breakdown
  const wardBreakdown = [
    { name: "Kasarani", coverage: 82, status: "High Mobilization", color: "bg-emerald-600" },
    { name: "Embakasi East", coverage: 76, status: "High Mobilization", color: "bg-emerald-600" },
    { name: "Westlands", coverage: 68, status: "Medium Mobilization", color: "bg-emerald-700" },
    { name: "Kibra", coverage: 64, status: "Medium Mobilization", color: "bg-emerald-700" },
    { name: "Dagoretti North", coverage: 55, status: "Active Outreach", color: "bg-zinc-700" },
    { name: "Starehe", coverage: 49, status: "Scheduled Blitz", color: "bg-zinc-800" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Campaign Command Banner */}
      <div className="rounded-2xl bg-zinc-950 text-white p-5 sm:p-6 shadow-md border border-zinc-800 relative overflow-hidden">
        {/* Subtle decorative background graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-950/60 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>General Election Campaign HQ · {stats.countyName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {stats.candidateName} Gubernatorial Campaign
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Field operations center coordinating {stats.wardsCoveredCount} of {stats.totalWardsCount} electoral wards across {stats.countyName}.
            </p>
          </div>

          {/* Countdown & Quick Action button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-center min-w-[120px]">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {stats.daysToElection}
              </div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Days to Polls
              </div>
            </div>

            <Button
              variant="default"
              size="md"
              onClick={() => setActiveModal("new-activity")}
              className="flex items-center gap-1.5 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Rally</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Voter Outreach */}
        <Card className="hover:border-zinc-300 transition-colors">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Voter Contact</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {formatNumber(stats.registeredVotersReached)}
            </div>
            <div className="space-y-1">
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full"
                  style={{ width: `${voterReachPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>{voterReachPercent}% of target</span>
                <span>{formatNumber(stats.registeredVotersTarget)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Wards Mobilized */}
        <Card className="hover:border-zinc-300 transition-colors">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Ward Coverage</span>
              <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {stats.wardsCoveredCount} <span className="text-sm font-normal text-zinc-500">/ {stats.totalWardsCount}</span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full"
                  style={{ width: `${wardReachPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>{wardReachPercent}% county wards</span>
                <span className="text-emerald-700 font-medium">85 total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Planned Activities */}
        <Card className="hover:border-zinc-300 transition-colors">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Trail</span>
              <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {activities.filter((a) => a.status === "Scheduled").length}{" "}
              <span className="text-sm font-normal text-zinc-500">Events</span>
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center justify-between">
              <span>{activities.filter((a) => a.status === "Completed").length} Completed rallies</span>
              <button
                onClick={() => setCurrentPage("activities")}
                className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
              >
                View Trail →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Community Issues */}
        <Card className="hover:border-zinc-300 transition-colors">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Citizen Issues</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-900">
                <MessageSquareWarning className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-zinc-950">
              {issues.filter((i) => i.status !== "Resolved").length}{" "}
              <span className="text-sm font-normal text-zinc-500">Open</span>
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center justify-between">
              <span className="text-emerald-800 font-medium">
                {issues.filter((i) => i.manifestoPledge).length} Pledged in Manifesto
              </span>
              <button
                onClick={() => setCurrentPage("issues")}
                className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
              >
                Track →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Left Column (Upcoming Activities & Urgent Issues) + Right Column (Quick Actions, Tasks, Ward Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activities & Issues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Campaign Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  Upcoming Campaign Trail (Next 72 Hours)
                </CardTitle>
                <CardDescription>
                  Scheduled rallies, market tours, and town hall dialogues
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("activities")}
                className="text-xs text-emerald-800 hover:text-emerald-950"
              >
                View All ({activities.length})
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-zinc-100 p-0">
              {upcomingActivities.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No upcoming activities scheduled. Click "+ Schedule Rally" to add one.
                </div>
              ) : (
                upcomingActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 hover:bg-zinc-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                        <span className="text-emerald-800 font-semibold">{act.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{act.subCounty}</span>
                        <span aria-hidden="true">·</span>
                        <span>{act.ward}</span>
                      </div>
                      <h4 className="font-semibold text-zinc-950 text-sm leading-snug">
                        {act.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {formatDate(act.date)} at {act.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-zinc-400" />
                          Exp. {formatNumber(act.expectedTurnout)} attendees
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage("activities")}
                        className="text-xs h-8"
                      >
                        Inspect Trail
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Urgent Community Issues Needing Attention */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-700" />
                  Grassroots Grievances Requiring Candidate Briefing
                </CardTitle>
                <CardDescription>
                  Local issues logged by field teams from community wananchi
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("issues")}
                className="text-xs text-emerald-800 hover:text-emerald-950"
              >
                All Issues ({issues.length})
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-zinc-100 p-0">
              {pendingUrgentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 hover:bg-zinc-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant={issue.priority === "Urgent" ? "destructive" : "warning"}
                      >
                        {issue.priority}
                      </Badge>
                      <span className="text-zinc-500 font-medium">{issue.category}</span>
                      <span className="text-zinc-400" aria-hidden="true">·</span>
                      <span className="text-zinc-600 font-medium">{issue.subCounty} ({issue.ward})</span>
                    </div>

                    <h4 className="font-semibold text-zinc-950 text-sm leading-snug">
                      {issue.title}
                    </h4>

                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                      Reported by {issue.reportedBy} · Affecting ~{formatNumber(issue.affectedEstCitizens)} wananchi
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Badge variant={issue.manifestoPledge ? "success" : "secondary"}>
                      {issue.manifestoPledge ? "Pledged in Manifesto" : "Under Review"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Launch, Field Tasks, Sub-County Status */}
        <div className="space-y-6">
          {/* Quick Launchpad */}
          <Card className="bg-zinc-50/80 border-zinc-200">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-600">
                Quick Action Dispatch
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("new-activity")}
                className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-300"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold">New Activity</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("new-task")}
                className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-300"
              >
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold">Assign Task</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("new-issue")}
                className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-300"
              >
                <MessageSquareWarning className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold">Log Issue</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModal("new-team")}
                className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-300"
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold">Add Member</span>
              </Button>
            </CardContent>
          </Card>

          {/* Operational Tasks Quick Checklist */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3.5">
              <CardTitle className="text-sm font-bold text-zinc-950 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                Operational Tasks
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage("tasks")}
                className="text-xs text-emerald-800"
              >
                All ({tasks.length})
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-zinc-100 p-0 text-xs">
              {pendingTasks.map((t) => (
                <div key={t.id} className="p-3 flex items-start gap-2.5 hover:bg-zinc-50">
                  <input
                    type="checkbox"
                    checked={t.status === "Done"}
                    onChange={(e) =>
                      updateTaskStatus(t.id, e.target.checked ? "Done" : "In Progress")
                    }
                    className="w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{t.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span>{t.assignedTo}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-800 font-semibold">{t.priority} Priority</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sub-County Mobilization Index */}
          <Card>
            <CardHeader className="py-3.5">
              <CardTitle className="text-sm font-bold text-zinc-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Sub-County Ground Index
              </CardTitle>
              <CardDescription>Ground penetration & voter mobilization reach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              {wardBreakdown.map((wb) => (
                <div key={wb.name} className="space-y-1">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-900">{wb.name}</span>
                    <span className="text-emerald-800 font-bold">{wb.coverage}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${wb.color}`}
                      style={{ width: `${wb.coverage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
