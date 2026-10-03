import React, { useState } from "react";
import {
  Landmark,
  HelpCircle,
  RotateCcw,
  Plus,
  Calendar,
  CheckSquare,
  MessageSquareWarning,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";
import { subCountyList } from "../../data/mockData";
import { Button } from "../ui/button";

export const Header: React.FC = () => {
  const {
    stats,
    updateStats,
    selectedSubCounty,
    setSelectedSubCounty,
    resetToDemoData,
    setIsTestingGuideOpen,
    setActiveModal,
  } = useCampaign();

  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isCountySelectorOpen, setIsCountySelectorOpen] = useState(false);

  const availableCounties = [
    { name: "Nairobi County", candidate: "Hon. Davis Mwangi", runningMate: "Dr. Amina Abdi" },
    { name: "Nyamira County", candidate: "Hon. Walter Nyambane", runningMate: "Eng. Grace Kemunto" },
    { name: "Nakuru County", candidate: "Hon. Sarah Chesire", runningMate: "Peter Karanja" },
    { name: "Kisumu County", candidate: "Hon. Moses Odhiambo", runningMate: "Lilian Awuor" },
    { name: "Mombasa County", candidate: "Hon. Salim Khamis", runningMate: "Fatma Omar" },
  ];

  const handleCountyChange = (county: (typeof availableCounties)[0]) => {
    updateStats({
      countyName: county.name,
      candidateName: county.candidate,
      runningMate: county.runningMate,
    });
    setIsCountySelectorOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 shadow-xs">
      {/* Top Banner for General Election Countdown & County Identifier */}
      <div className="bg-zinc-950 text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-emerald-400">Live Campaign HQ</span>
            <span className="text-zinc-400 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-zinc-300 hidden sm:inline">{stats.candidateName} for Governor & {stats.runningMate}</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <span className="font-semibold text-white">{stats.daysToElection} Days</span>
            <span className="text-zinc-500">to General Election</span>
            <button
              onClick={() => setIsTestingGuideOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-2 cursor-pointer font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & County Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-700 text-white shadow-xs">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950">
                County Campaign Manager
              </h1>
            </div>

            {/* County Selector Dropdown */}
            <div className="relative inline-block text-left mt-0.5">
              <button
                type="button"
                onClick={() => setIsCountySelectorOpen(!isCountySelectorOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
              >
                <span>{stats.countyName} Gubernatorial Secretariat</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
              </button>

              {isCountySelectorOpen && (
                <div className="origin-top-left absolute left-0 mt-1 w-64 rounded-xl shadow-lg bg-white ring-1 ring-black/5 divide-y divide-zinc-100 z-50 p-1 border border-zinc-200">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Select Prototype County
                  </div>
                  {availableCounties.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleCountyChange(c)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex flex-col transition-colors ${
                        stats.countyName === c.name
                          ? "bg-emerald-50 text-emerald-900 font-semibold"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] text-zinc-500 font-normal">
                        {c.candidate} & {c.runningMate}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sub-County Filter + Quick Action Button + Reset + Guide */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sub-County Quick Filter on Header */}
          <div className="hidden md:flex items-center gap-1.5">
            <label htmlFor="header-subcounty" className="text-xs text-zinc-500 font-medium">
              Area:
            </label>
            <select
              id="header-subcounty"
              value={selectedSubCounty}
              onChange={(e) => setSelectedSubCounty(e.target.value)}
              className="text-xs font-medium rounded-lg border border-zinc-300 bg-zinc-50/70 px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {subCountyList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action Button (Dropdown) */}
          <div className="relative">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </Button>

            {isQuickActionsOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-52 rounded-xl shadow-xl bg-white border border-zinc-200 z-50 p-1.5 divide-y divide-zinc-100"
                onClick={() => setIsQuickActionsOpen(false)}
              >
                <div className="py-1">
                  <button
                    onClick={() => setActiveModal("new-activity")}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Schedule Activity</span>
                  </button>
                  <button
                    onClick={() => setActiveModal("new-task")}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-700" />
                    <span>Create Field Task</span>
                  </button>
                  <button
                    onClick={() => setActiveModal("new-issue")}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquareWarning className="w-4 h-4 text-emerald-700" />
                    <span>Log Community Issue</span>
                  </button>
                  <button
                    onClick={() => setActiveModal("new-team")}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-700" />
                    <span>Add Team Member</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDemoData}
            title="Reset to default fictional sample data"
            className="hidden lg:flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs">Reset Data</span>
          </Button>

          {/* How to test button on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTestingGuideOpen(true)}
            title="How to test this prototype"
            className="sm:hidden text-zinc-700"
          >
            <HelpCircle className="w-5 h-5 text-emerald-700" />
          </Button>
        </div>
      </div>
    </header>
  );
};
