import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { useCampaign } from "../context/CampaignContext";
import { CampaignActivity, ActivityType, ActivityStatus } from "../types";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { TabsList, TabsTrigger } from "../components/ui/tabs";
import { formatNumber, formatDate } from "../lib/utils";
import { subCountyList } from "../data/mockData";
import { ActivityDetailModal } from "../components/modals/ActivityDetailModal";

export const ActivitiesPage: React.FC = () => {
  const {
    activities,
    selectedSubCounty,
    setSelectedSubCounty,
    setActiveModal,
  } = useCampaign();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [statusTab, setStatusTab] = useState<"all" | "Scheduled" | "Completed">("all");
  const [activeDetailItem, setActiveDetailItem] = useState<CampaignActivity | null>(null);

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    // Sub-county filter
    if (
      selectedSubCounty !== "All Sub-Counties" &&
      act.subCounty.toLowerCase() !== selectedSubCounty.toLowerCase()
    ) {
      return false;
    }
    // Type filter
    if (selectedType !== "All Types" && act.type !== selectedType) {
      return false;
    }
    // Status tab filter
    if (statusTab !== "all" && act.status !== statusTab) {
      return false;
    }
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        act.venue.toLowerCase().includes(q) ||
        act.ward.toLowerCase().includes(q) ||
        act.leadCoordinator.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            Campaign Trail & Rallies
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Coordinate mega rallies, ward town halls, market tours, and youth voter forums.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => setActiveModal("new-activity")}
          className="flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Activity</span>
        </Button>
      </div>

      {/* Control Bar: Search, Sub-county, Type, Status Tabs */}
      <Card className="bg-zinc-50/70">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by event title, venue, ward, or coordinator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white text-xs sm:text-sm"
              />
            </div>

            {/* Sub-County Filter */}
            <div className="w-full sm:w-48">
              <Select
                value={selectedSubCounty}
                onChange={(e) => setSelectedSubCounty(e.target.value)}
                className="bg-white text-xs"
              >
                {subCountyList.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </Select>
            </div>

            {/* Type Filter */}
            <div className="w-full sm:w-48">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white text-xs"
              >
                <option value="All Types">All Event Types</option>
                <option value="Mega Rally">Mega Rally</option>
                <option value="Ward Town Hall">Ward Town Hall</option>
                <option value="Boda Boda Youth Forum">Boda Boda Youth Forum</option>
                <option value="Market Walkabout">Market Walkabout</option>
                <option value="Door-to-Door Drive">Door-to-Door Drive</option>
                <option value="Women League Assembly">Women League Assembly</option>
                <option value="Religious Leaders Breakfast">Religious Leaders Breakfast</option>
              </Select>
            </div>
          </div>

          {/* Status Tabs Filter */}
          <div className="flex items-center justify-between pt-1">
            <TabsList>
              <TabsTrigger
                active={statusTab === "all"}
                onClick={() => setStatusTab("all")}
                badge={activities.length}
              >
                All Events
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Scheduled"}
                onClick={() => setStatusTab("Scheduled")}
                badge={activities.filter((a) => a.status === "Scheduled").length}
              >
                Scheduled
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Completed"}
                onClick={() => setStatusTab("Completed")}
                badge={activities.filter((a) => a.status === "Completed").length}
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <span className="text-xs text-zinc-500 hidden sm:inline">
              Showing {filteredActivities.length} of {activities.length} activities
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <Card className="text-center py-12 px-4">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">No campaign activities found</h3>
            <p className="text-xs text-zinc-500">
              No events matched your current search filters or sub-county selection. Try clearing filters or schedule a new event.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveModal("new-activity")}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Schedule New Activity
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((act) => (
            <Card
              key={act.id}
              className="hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-3">
                {/* Header Row: Type & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-emerald-800">{act.type}</span>
                    <span className="text-zinc-400" aria-hidden="true">·</span>
                    <span className="text-zinc-600 font-medium">{act.subCounty}</span>
                  </div>

                  <Badge
                    variant={
                      act.status === "Completed"
                        ? "success"
                        : act.status === "In Progress"
                        ? "warning"
                        : "default"
                    }
                  >
                    {act.status}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-bold text-zinc-950 text-base leading-snug line-clamp-2">
                  {act.title}
                </h3>

                {/* Key Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{formatDate(act.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{act.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{act.venue} ({act.ward})</span>
                  </div>
                </div>

                {/* Turnout & Clearances */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    {act.actualTurnout !== undefined ? (
                      <span className="text-emerald-900 font-bold">
                        {formatNumber(act.actualTurnout)} Attended
                      </span>
                    ) : (
                      <span>Exp. {formatNumber(act.expectedTurnout)} Turnout</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-zinc-500">
                    {act.securityCleared && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-800" title="Security Cleared">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Police OK</span>
                      </span>
                    )}
                    {act.soundPermitSecured && (
                      <span className="inline-flex items-center gap-0.5 text-zinc-700" title="PA Sound Permit Secured">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-[11px]">PA Sound</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 truncate">
                  Lead: <span className="font-medium text-zinc-800">{act.leadCoordinator}</span>
                </div>
              </CardContent>

              {/* Bottom Card Footer Actions */}
              <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between rounded-b-xl">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveDetailItem(act)}
                  className="text-xs h-8"
                >
                  View Details & Briefing
                </Button>

                <Button
                  variant={act.status === "Completed" ? "outline" : "default"}
                  size="sm"
                  onClick={() => setActiveDetailItem(act)}
                  className="text-xs h-8"
                >
                  {act.status === "Completed" ? "Update Turnout" : "Check-in Turnout"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail / Check-in Modal */}
      <ActivityDetailModal
        activity={activeDetailItem}
        isOpen={!!activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
      />
    </div>
  );
};
