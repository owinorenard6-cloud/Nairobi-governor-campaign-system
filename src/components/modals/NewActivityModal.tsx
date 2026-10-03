import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { useCampaign } from "../../context/CampaignContext";
import { ActivityType, ActivityStatus } from "../../types";
import { subCountyList } from "../../data/mockData";

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewActivityModal: React.FC<NewActivityModalProps> = ({ isOpen, onClose }) => {
  const { addActivity, team, selectedSubCounty } = useCampaign();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityType>("Mega Rally");
  const [subCounty, setSubCounty] = useState(
    selectedSubCounty !== "All Sub-Counties" ? selectedSubCounty : "Westlands"
  );
  const [ward, setWard] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00 AM");
  const [expectedTurnout, setExpectedTurnout] = useState("2000");
  const [leadCoordinator, setLeadCoordinator] = useState(team[0]?.name || "Dennis Kiprop");
  const [budgetKsh, setBudgetKsh] = useState("150000");
  const [notes, setNotes] = useState("");
  const [securityCleared, setSecurityCleared] = useState(false);
  const [soundPermitSecured, setSoundPermitSecured] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) return;

    addActivity({
      title: title.trim(),
      type,
      subCounty,
      ward: ward.trim() || `${subCounty} Central Ward`,
      venue: venue.trim(),
      date,
      time,
      expectedTurnout: parseInt(expectedTurnout, 10) || 1000,
      leadCoordinator,
      securityCleared,
      soundPermitSecured,
      status: "Scheduled" as ActivityStatus,
      notes: notes.trim() || "Planned grassroots outreach mobilization.",
      budgetKsh: parseInt(budgetKsh, 10) || 50000,
    });

    // Reset and close
    setTitle("");
    setVenue("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Campaign Activity"
      description="Plan rallies, town halls, market tours, or voter registration drives."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Activity Title <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Kasarani Ward Boda Boda Empowerment Rally"
          />
        </div>

        {/* Type & Sub-County */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Activity Type
            </label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
            >
              <option value="Mega Rally">Mega Rally</option>
              <option value="Ward Town Hall">Ward Town Hall</option>
              <option value="Boda Boda Youth Forum">Boda Boda Youth Forum</option>
              <option value="Market Walkabout">Market Walkabout</option>
              <option value="Door-to-Door Drive">Door-to-Door Drive</option>
              <option value="Women League Assembly">Women League Assembly</option>
              <option value="Religious Leaders Breakfast">Religious Leaders Breakfast</option>
              <option value="Strategy Meeting">Strategy Meeting</option>
            </Select>
          </div>

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
        </div>

        {/* Ward & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Ward Name
            </label>
            <Input
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="e.g. Roysambu Central, Clay City"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Venue / Meeting Point <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Kasarani Sports Field, Market Gate A"
            />
          </div>
        </div>

        {/* Date, Time & Expected Turnout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Time
            </label>
            <Input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10:00 AM"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Expected Turnout
            </label>
            <Input
              type="number"
              value={expectedTurnout}
              onChange={(e) => setExpectedTurnout(e.target.value)}
              placeholder="2500"
            />
          </div>
        </div>

        {/* Lead Coordinator & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Lead Field Coordinator
            </label>
            <Select
              value={leadCoordinator}
              onChange={(e) => setLeadCoordinator(e.target.value)}
            >
              {team.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.role})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Budget Allocated (KES)
            </label>
            <Input
              type="number"
              value={budgetKsh}
              onChange={(e) => setBudgetKsh(e.target.value)}
              placeholder="100000"
            />
          </div>
        </div>

        {/* Clearances / Checkboxes */}
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-800">
            <input
              type="checkbox"
              checked={securityCleared}
              onChange={(e) => setSecurityCleared(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700"
            />
            <span className="font-medium">Sub-County Police Security Notified</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-800">
            <input
              type="checkbox"
              checked={soundPermitSecured}
              onChange={(e) => setSoundPermitSecured(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700"
            />
            <span className="font-medium">PA Sound Truck Permit Stamped</span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Activity Notes & Objectives
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key talking points, VIP guests, local elders present, transport arrangements..."
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Save & Schedule Activity
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
