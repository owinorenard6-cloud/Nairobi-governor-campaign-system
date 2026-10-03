import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { useCampaign } from "../../context/CampaignContext";
import { TeamRole, TeamStatus } from "../../types";
import { subCountyList } from "../../data/mockData";

interface NewTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTeamMemberModal: React.FC<NewTeamMemberModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTeamMember, selectedSubCounty } = useCampaign();

  const [name, setName] = useState("");
  const [role, setRole] = useState<TeamRole>("Sub-County Coordinator");
  const [subCounty, setSubCounty] = useState(
    selectedSubCounty !== "All Sub-Counties" ? selectedSubCounty : "Kasarani"
  );
  const [phone, setPhone] = useState("+254 7");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<TeamStatus>("Active in Field");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTeamMember({
      name: name.trim(),
      role,
      subCounty,
      phone: phone.trim() || "+254 700 000 000",
      email:
        email.trim() ||
        `${name.trim().toLowerCase().replace(/\s+/g, ".")}@mwangi2027.co.ke`,
      status,
      activeTasksCount: 0,
    });

    setName("");
    setPhone("+254 7");
    setEmail("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Campaign Team Member"
      description="Onboard field coordinators, youth leaders, ward leads, or logistics directors."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kennedy Omondi"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Campaign Role
            </label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamRole)}
            >
              <option value="Sub-County Coordinator">Sub-County Coordinator</option>
              <option value="Youth League Mobilizer">Youth League Mobilizer</option>
              <option value="Women League Coordinator">Women League Coordinator</option>
              <option value="Field Operations Lead">Field Operations Lead</option>
              <option value="Campaign Director">Campaign Director</option>
              <option value="Media & Press Secretary">Media & Press Secretary</option>
              <option value="Logistics & Fleet Officer">Logistics & Fleet Officer</option>
              <option value="Legal & Polling Agent Lead">Legal & Polling Agent Lead</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Assigned Sub-County
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Phone Number (KE Format)
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 712 345 678"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lead@campaign.co.ke"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 mb-1">
            Current Deployment Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as TeamStatus)}
          >
            <option value="Active in Field">Active in Field (Ground Mobilization)</option>
            <option value="At Secretariat HQ">At Secretariat HQ (Command Center)</option>
            <option value="On Standby">On Standby (Rapid Response Team)</option>
          </Select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default" size="sm">
            Add to Campaign Roster
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
