import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useCampaign } from "../context/CampaignContext";
import { CampaignTask, TaskStatus, TaskPriority, TaskCategory } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { TabsList, TabsTrigger } from "../components/ui/tabs";
import { formatDate } from "../lib/utils";
import { subCountyList } from "../data/mockData";

export const TasksPage: React.FC = () => {
  const {
    tasks,
    updateTaskStatus,
    deleteTask,
    selectedSubCounty,
    setSelectedSubCounty,
    setActiveModal,
  } = useCampaign();

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [statusTab, setStatusTab] = useState<"all" | TaskStatus>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const filteredTasks = tasks.filter((tsk) => {
    if (
      selectedSubCounty !== "All Sub-Counties" &&
      tsk.subCounty.toLowerCase() !== selectedSubCounty.toLowerCase()
    ) {
      return false;
    }
    if (priorityFilter !== "All Priorities" && tsk.priority !== priorityFilter) {
      return false;
    }
    if (categoryFilter !== "All Categories" && tsk.category !== categoryFilter) {
      return false;
    }
    if (statusTab !== "all" && tsk.status !== statusTab) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        tsk.title.toLowerCase().includes(q) ||
        tsk.description.toLowerCase().includes(q) ||
        tsk.assignedTo.toLowerCase().includes(q) ||
        tsk.assignedRole.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === "To Do");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "In Progress");
  const doneTasks = filteredTasks.filter((t) => t.status === "Done");

  const renderTaskCard = (task: CampaignTask) => (
    <Card
      key={task.id}
      className={`hover:border-zinc-300 transition-all shadow-xs ${
        task.status === "Done" ? "bg-zinc-50/70 opacity-80" : "bg-white"
      }`}
    >
      <CardContent className="p-4 space-y-2.5">
        {/* Top: Category & Priority */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            {task.category}
          </span>
          <Badge
            variant={
              task.priority === "High"
                ? "destructive"
                : task.priority === "Medium"
                ? "warning"
                : "secondary"
            }
          >
            {task.priority} Priority
          </Badge>
        </div>

        {/* Title */}
        <h4
          className={`font-semibold text-sm leading-snug text-zinc-950 ${
            task.status === "Done" ? "line-through text-zinc-500" : ""
          }`}
        >
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Assignee & Location */}
        <div className="pt-1 flex items-center justify-between text-xs text-zinc-600 border-t border-zinc-100">
          <div>
            <span className="font-semibold text-zinc-900">{task.assignedTo}</span>
            <span className="text-zinc-400 text-[11px] block">{task.subCounty}</span>
          </div>
          <div className="text-right text-[11px] text-zinc-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
        </div>

        {/* Status Advance Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 gap-2">
          <button
            onClick={() => deleteTask(task.id)}
            className="text-zinc-400 hover:text-red-600 transition-colors p-1 rounded-md cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {task.status !== "To Do" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateTaskStatus(task.id, "To Do")}
                className="text-[11px] h-7 px-2 text-zinc-600"
              >
                ← Back
              </Button>
            )}

            {task.status === "To Do" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTaskStatus(task.id, "In Progress")}
                className="text-[11px] h-7 px-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
              >
                Start Task →
              </Button>
            )}

            {task.status === "In Progress" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => updateTaskStatus(task.id, "Done")}
                className="text-[11px] h-7 px-2 bg-emerald-700 hover:bg-emerald-800"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Mark Done
              </Button>
            )}

            {task.status === "Done" && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-700" />
            Field Operations & Tasks
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Operational directives for logistics convoys, sound permits, branding, and ward mobilization.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => setActiveModal("new-task")}
          className="flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
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
                placeholder="Search tasks, descriptions, or assignees..."
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

            {/* Priority Filter */}
            <div className="w-full sm:w-40">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white text-xs"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Normal">Normal Priority</option>
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
                <option value="Branding & Materials">Branding & Materials</option>
                <option value="Logistics & Transport">Logistics & Transport</option>
                <option value="Security & Protocol">Security & Protocol</option>
                <option value="Voter Mobilization">Voter Mobilization</option>
                <option value="Media & Digital Comms">Media & Digital Comms</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
              </Select>
            </div>
          </div>

          {/* Status Tabs and View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <TabsList>
              <TabsTrigger
                active={statusTab === "all"}
                onClick={() => setStatusTab("all")}
                badge={tasks.length}
              >
                All Tasks
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "To Do"}
                onClick={() => setStatusTab("To Do")}
                badge={tasks.filter((t) => t.status === "To Do").length}
              >
                To Do
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "In Progress"}
                onClick={() => setStatusTab("In Progress")}
                badge={tasks.filter((t) => t.status === "In Progress").length}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                active={statusTab === "Done"}
                onClick={() => setStatusTab("Done")}
                badge={tasks.filter((t) => t.status === "Done").length}
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">
                {filteredTasks.length} tasks matching
              </span>
              <div className="hidden sm:flex border border-zinc-200 bg-white rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                    viewMode === "kanban"
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  Columns
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                    viewMode === "list"
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban / Multi-column board (or List) */}
      {filteredTasks.length === 0 ? (
        <Card className="text-center py-12 px-4">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-900 text-base">No tasks found</h3>
            <p className="text-xs text-zinc-500">
              No field operational tasks matched your filter criteria.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveModal("new-task")}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Dispatch New Task
            </Button>
          </div>
        </Card>
      ) : viewMode === "kanban" && statusTab === "all" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: To Do */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                <h3 className="font-bold text-zinc-900 text-sm">To Do</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                {todoTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {todoTasks.length === 0 ? (
                <div className="p-4 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-400">
                  No tasks waiting to start
                </div>
              ) : (
                todoTasks.map(renderTaskCard)
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-bold text-zinc-900 text-sm">In Progress</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressTasks.length === 0 ? (
                <div className="p-4 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-400">
                  No active tasks in progress
                </div>
              ) : (
                inProgressTasks.map(renderTaskCard)
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="font-bold text-zinc-900 text-sm">Completed</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                {doneTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {doneTasks.length === 0 ? (
                <div className="p-4 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-400">
                  No completed tasks yet
                </div>
              ) : (
                doneTasks.map(renderTaskCard)
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(renderTaskCard)}
        </div>
      )}
    </div>
  );
};
