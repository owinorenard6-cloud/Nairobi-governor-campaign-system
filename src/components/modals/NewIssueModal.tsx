import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { useCampaign } from "../../context/CampaignContext";
import { IssueCategory, IssuePriority, IssueStatus } from "../../types";
import { subCountyList } from "../../data/mockData";

interface NewIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewIssueModal: React.FC<NewIssueModalProps> = ({ isOpen, onClose }) => {
  const { addIssue, team, selectedSubCounty } = useCampaign();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IssueCategory>("Water & Sanitation");
  const [subCounty, setSubCounty] = useState(
    selectedSubCounty !== "All Sub-Counties" ? selectedSubCounty : "Westlands"
  );
  const [ward, setWard] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("High");
  const [assignedTo, setAssignedTo] = useState(team[0]?.name || "Dennis Kiprop");
  const [affectedEstCitizens, setAffectedEstCitizens] = useState("5000");
  const [manifestoPledge, setManifestoPledge] = useState(false);
  const [actionTakenNotes, setActionTakenNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reportedBy.trim()) return;

    addIssue({
      title: title.trim(),
      category,
      subCounty,
      ward: ward.trim() || `${subCounty} Ward`,
      reportedBy: reportedBy.trim(),
      dateReported: new Date().toISOString().split("T")[0],
      status: "Reported" as IssueStatus,
      priority,
      assignedTo,
      manifestoPledge,
      actionTakenNotes: actionTakenNotes.trim() || "Received from community delegation. Field assessment pending.",
      affectedEstCitizens: parseInt(affectedEstCitizens, 10) || 1000,
    });

    setTitle("");
    setWard("");
    setReportedBy("");
    setActionTakenNotes("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Log Community Issue / Grievance"
      description="Record issues brought by local community delegations, elders, youth groups, or traders."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Issue Summary <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lack of piped water in Kasarani Ward 4"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
            >
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Roads & Feeder Bridges">Roads & Feeder Bridges</option>
              <option value="Market Stalls & Lighting">Market Stalls & Lighting</option>
              <option value="Youth Employment & Boda Boda">Youth Employment & Boda Boda</option>
              <option value="Health Centers & Clinics">Health Centers & Clinics</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Education & Bursaries">Education & Bursaries</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Priority Urgency
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as IssuePriority)}
            >
              <option value="Urgent">Urgent (Immediate Talking Point)</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Sub-County
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
              Ward Name
            </label>
            <Input
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="e.g. Kangemi Ward, Utawala"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Reported By (Group/Leader) <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              placeholder="e.g. Market Traders Association"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Estimated Citizens Affected
            </label>
            <Input
              type="number"
              value={affectedEstCitizens}
              onChange={(e) => setAffectedEstCitizens(e.target.value)}
              placeholder="15000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Assigned Field Lead
          </label>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            {team.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name} ({m.role})
              </option>
            ))}
          </Select>
        </div>

        {/* Manifesto inclusion switch */}
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-800">
            <input
              type="checkbox"
              checked={manifestoPledge}
              onChange={(e) => setManifestoPledge(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700"
            />
            <span className="font-semibold text-emerald-950">
              Candidate Manifesto Pledge (Adopt as official campaign pillar)
            </span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Action Plan / Ground Assessment Notes
          </label>
          <Textarea
            value={actionTakenNotes}
            onChange={(e) => setActionTakenNotes(e.target.value)}
            placeholder="Interim support, town hall agenda item, civil engineer inspection..."
            rows={2}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Save Community Issue
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
