import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckSquare,
  Shield,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useCampaign } from "../context/CampaignContext";
import { TeamMember, TeamRole, TeamStatus } from "../types";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { TabsList, TabsTrigger } from "../components/ui/tabs";
import { subCountyList } from "../data/mockData";

export const TeamPage: React.FC = () => {
  const {
    team,
    deleteTeamMember,
    selectedSubCounty,
    setSelectedSubCounty,
    setActiveModal,
    tasks,
  } = useCampaign();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All Roles");
  const [statusTab, setStatusTab] = useState<"all" | TeamStatus>("all");
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);

  const filteredTeam = team.filter((m) => {
    if (
      selectedSubCounty !== "All Sub-Counties" &&
      m.subCounty.toLowerCase() !== selectedSubCounty.toLowerCase()
    ) {
      return false;
    }
    if (roleFilter !== "All Roles" && m.role !== roleFilter) {
      return false;
    }
    if (statusTab !== "all" && m.status !== statusTab) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subCounty.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleSimulatedContact = (name: string, phone: string) => {
    setContactFeedback(`Contacting ${name} via Field Dispatch (${phone})...`);
    setTimeout(() => {
      setContactFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            Campaign Team & Ward Coordinators
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Secretariat leads, sub-county field directors, women league leads, and youth mobilizers.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => setActiveModal("new-team")}
          className="flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </Button>
      </div>

      {/* Simulated notification feedback */}
      {contactFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
          <span>{contactFeedback}</span>
          <button
            onClick={() => setContactFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <Card className="bg-zinc-50/70">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search staff by name, role, email, or sub-county..."
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

            {/* Role Filter */}
            <div className="w-full sm:w-52">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white text-xs"
              >
                <option value="All Roles">All Campaign Roles</option>
                <option value="Campaign Director">Campaign Director</option>
                <option value="Field Operations Lead">Field Operations Lead</option>
                <option value="Sub-County Coordinator">Sub-County Coordinator</option>
                <option value="Youth League Mobilizer">Youth League Mobilizer</option>
                <option value="Women League Coordinator">Women League Coordinator</option>
                <option value="Media & Press Secretary">Media & Press Secretary</option>
                <option value="Logistics & Fleet Officer">Logistics & Fleet Officer</option>
                <option value="Legal & Polling Agent Lead">Legal & Polling Agent Lead</option>
              </Select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <TabsList>
              <TabsTrigger
                active={statusTab === "all"}
                onClick={() => setStatusTab("all")}
                badge={team.length}
              >
                All Members
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Active in Field"}
                onClick={() => setStatusTab("Active in Field")}
                badge={team.filter((m) => m.status === "Active in Field").length}
              >
                Active in Field
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "At Secretariat HQ"}
                onClick={() => setStatusTab("At Secretariat HQ")}
                badge={team.filter((m) => m.status === "At Secretariat HQ").length}
              >
                At HQ
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "On Standby"}
                onClick={() => setStatusTab("On Standby")}
                badge={team.filter((m) => m.status === "On Standby").length}
              >
                On Standby
              </TabsTrigger>
            </TabsList>

            <span className="text-xs text-zinc-500">
              Showing {filteredTeam.length} campaign leaders
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Team Cards Grid */}
      {filteredTeam.length === 0 ? (
        <Card className="text-center py-12 px-4">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">No team members found</h3>
            <p className="text-xs text-zinc-500">
              No staff or volunteer coordinators matched your filters.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveModal("new-team")}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Campaign Member
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeam.map((member) => {
            const memberTasksCount = tasks.filter(
              (t) => t.assignedTo.toLowerCase() === member.name.toLowerCase() && t.status !== "Done"
            ).length;

            return (
              <Card
                key={member.id}
                className="hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top: Avatar, Name, Role & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {member.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-zinc-950 text-sm leading-tight truncate">
                          {member.name}
                        </h4>
                        <div className="text-xs text-emerald-800 font-semibold truncate mt-0.5">
                          {member.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Remove ${member.name} from the team?`)) {
                          deleteTeamMember(member.id);
                        }
                      }}
                      className="text-zinc-400 hover:text-red-600 transition-colors p-1 rounded-md cursor-pointer shrink-0"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Operational Details */}
                  <div className="space-y-1.5 text-xs text-zinc-600 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Coverage:</span>
                      <span className="font-semibold text-zinc-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        {member.subCounty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Deployment:</span>
                      <Badge
                        variant={
                          member.status === "Active in Field"
                            ? "default"
                            : member.status === "At Secretariat HQ"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Active Tasks:</span>
                      <span className="font-bold text-zinc-900">
                        {memberTasksCount} assigned
                      </span>
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="space-y-1.5 text-xs pt-1">
                    <button
                      onClick={() => handleSimulatedContact(member.name, member.phone)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-50/70 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-950 transition-colors text-left cursor-pointer border border-zinc-200/60"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{member.phone}</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-700">
                        Call / SMS
                      </span>
                    </button>

                    <div className="flex items-center gap-2 px-2 py-1 text-zinc-500 text-[11px] truncate">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </CardContent>

                {/* Bottom Actions */}
                <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between rounded-b-xl">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveModal("new-task")}
                    className="w-full text-xs h-8 flex items-center justify-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Assign Field Task</span>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
