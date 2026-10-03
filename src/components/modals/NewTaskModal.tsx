import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { useCampaign } from "../../context/CampaignContext";
import { TaskCategory, TaskPriority, TaskStatus } from "../../types";
import { subCountyList } from "../../data/mockData";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask, team, selectedSubCounty } = useCampaign();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Branding & Materials");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [subCounty, setSubCounty] = useState(
    selectedSubCounty !== "All Sub-Counties" ? selectedSubCounty : "Westlands"
  );
  const [assignedTo, setAssignedTo] = useState(team[0]?.name || "Dennis Kiprop");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedMember = team.find((m) => m.name === assignedTo);

    addTask({
      title: title.trim(),
      description: description.trim() || "Operational directive for campaign field execution.",
      category,
      priority,
      status: "To Do" as TaskStatus,
      subCounty,
      assignedTo,
      assignedRole: assignedMember?.role || "Field Officer",
      dueDate,
    });

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create Campaign Task"
      description="Assign actionable field operations, logistics, or voter outreach directives."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Task Description / Title <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distribute 10,000 voter education flyers in Roysambu"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
            >
              <option value="Branding & Materials">Branding & Materials</option>
              <option value="Logistics & Transport">Logistics & Transport</option>
              <option value="Security & Protocol">Security & Protocol</option>
              <option value="Voter Mobilization">Voter Mobilization</option>
              <option value="Media & Digital Comms">Media & Digital Comms</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Priority Level
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Normal">Normal Priority</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Sub-County Target
            </label>
            <Select
              value={subCounty}
              onChange={(e) => setSubCounty(e.target.value)}
            >
              {subCountyList
                .filter((s) => s !== "All Sub-Counties")
                .map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Assignee (Team Member)
          </label>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            {team.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} · {m.role} ({m.subCounty})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Detailed Instructions
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specify delivery point, quantity, contact persons, verification standards..."
            rows={3}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Dispatch Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
