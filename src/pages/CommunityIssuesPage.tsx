import React, { useState } from "react";
import {
  MessageSquareWarning,
  Plus,
  Search,
  MapPin,
  Users,
  CheckCircle2,
  Trash2,
  BookmarkCheck,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useCampaign } from "../context/CampaignContext";
import { CommunityIssue, IssueCategory, IssueStatus, IssuePriority } from "../types";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { TabsList, TabsTrigger } from "../components/ui/tabs";
import { formatNumber, formatDate } from "../lib/utils";
import { subCountyList } from "../data/mockData";

export const CommunityIssuesPage: React.FC = () => {
  const {
    issues,
    updateIssueStatus,
    toggleManifestoPledge,
    deleteIssue,
    selectedSubCounty,
    setSelectedSubCounty,
    setActiveModal,
  } = useCampaign();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");
  const [statusTab, setStatusTab] = useState<"all" | IssueStatus | "manifesto">("all");

  const filteredIssues = issues.filter((iss) => {
    if (
      selectedSubCounty !== "All Sub-Counties" &&
      iss.subCounty.toLowerCase() !== selectedSubCounty.toLowerCase()
    ) {
      return false;
    }
    if (categoryFilter !== "All Categories" && iss.category !== categoryFilter) {
      return false;
    }
    if (priorityFilter !== "All Priorities" && iss.priority !== priorityFilter) {
      return false;
    }
    if (statusTab === "manifesto" && !iss.manifestoPledge) {
      return false;
    } else if (statusTab !== "all" && statusTab !== "manifesto" && iss.status !== statusTab) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        iss.title.toLowerCase().includes(q) ||
        iss.reportedBy.toLowerCase().includes(q) ||
        iss.ward.toLowerCase().includes(q) ||
        iss.actionTakenNotes.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const manifestoPledgesCount = issues.filter((i) => i.manifestoPledge).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-emerald-700" />
            Community Issues & Grievances
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Log grassroots problems reported by wananchi delegations, market vendors, elders, and youth groups.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => setActiveModal("new-issue")}
          className="flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Community Issue</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="bg-zinc-50/70">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search issues, reported by, ward, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white text-xs sm:text-sm"
              />
            </div>

            {/* Sub-County Filter */}
            <div className="w-full sm:w-44">
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

            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white text-xs"
              >
                <option value="All Categories">All Categories</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Roads & Feeder Bridges">Roads & Feeder Bridges</option>
                <option value="Market Stalls & Lighting">Market Stalls & Lighting</option>
                <option value="Youth Employment & Boda Boda">Youth Employment & Boda Boda</option>
                <option value="Health Centers & Clinics">Health Centers & Clinics</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Education & Bursaries">Education & Bursaries</option>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="w-full sm:w-36">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white text-xs"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </Select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <TabsList>
              <TabsTrigger
                active={statusTab === "all"}
                onClick={() => setStatusTab("all")}
                badge={issues.length}
              >
                All Issues
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Reported"}
                onClick={() => setStatusTab("Reported")}
                badge={issues.filter((i) => i.status === "Reported").length}
              >
                Reported
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Under Review"}
                onClick={() => setStatusTab("Under Review")}
                badge={issues.filter((i) => i.status === "Under Review").length}
              >
                Under Review
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "manifesto"}
                onClick={() => setStatusTab("manifesto")}
                badge={manifestoPledgesCount}
              >
                Manifesto Pledges
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Resolved"}
                onClick={() => setStatusTab("Resolved")}
                badge={issues.filter((i) => i.status === "Resolved").length}
              >
                Resolved
              </TabsTrigger>
            </TabsList>

            <span className="text-xs text-zinc-500">
              Showing {filteredIssues.length} issues
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Issues Cards */}
      {filteredIssues.length === 0 ? (
        <Card className="text-center py-12 px-4">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">No community issues found</h3>
            <p className="text-xs text-zinc-500">
              No citizen grievances matched your search or filters.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveModal("new-issue")}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Log New Community Issue
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className={`hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between ${
                issue.status === "Resolved" ? "bg-zinc-50/70" : "bg-white"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                {/* Header: Priority, Category, Sub-County */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        issue.priority === "Urgent"
                          ? "destructive"
                          : issue.priority === "High"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {issue.priority}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-800">
                      {issue.category}
                    </span>
                  </div>

                  <span className="text-xs text-zinc-500 font-medium">
                    {issue.subCounty} · {issue.ward}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-zinc-950 text-base leading-snug">
                  {issue.title}
                </h3>

                {/* Citizens Affected & Reported By */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-900">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>~{formatNumber(issue.affectedEstCitizens)} Citizens Affected</span>
                  </div>
                  <div className="text-zinc-500">
                    Source: <span className="text-zinc-800 font-medium">{issue.reportedBy}</span>
                  </div>
                </div>

                {/* Action Taken / Candidate Talking Point */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-zinc-400" />
                    <span>Field Assessment & Candidate Response:</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed bg-white border border-zinc-100 p-2 rounded-md">
                    {issue.actionTakenNotes || "Assessment in progress."}
                  </p>
                </div>

                {/* Lead Assigned */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    Field Officer: <strong className="text-zinc-800">{issue.assignedTo}</strong>
                  </span>
                  <span>Reported {formatDate(issue.dateReported)}</span>
                </div>
              </CardContent>

              {/* Card Footer: Status Selector & Manifesto Toggle */}
              <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex flex-wrap items-center justify-between gap-2 rounded-b-xl">
                {/* Manifesto Toggle */}
                <button
                  type="button"
                  onClick={() => toggleManifestoPledge(issue.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    issue.manifestoPledge
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
                  }`}
                  title="Toggle inclusion in official gubernatorial manifesto"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{issue.manifestoPledge ? "In Manifesto Pledge" : "Add to Manifesto"}</span>
                </button>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value as IssueStatus)}
                    className="text-xs font-semibold rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                  >
                    <option value="Reported">Status: Reported</option>
                    <option value="Under Review">Status: Under Review</option>
                    <option value="Pledged in Manifesto">Status: Pledged in Manifesto</option>
                    <option value="Resolved">Status: Resolved</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm("Delete this issue report?")) {
                        deleteIssue(issue.id);
                      }
                    }}
                    className="text-zinc-400 hover:text-red-600 transition-colors p-1 rounded-md cursor-pointer"
                    title="Delete issue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
