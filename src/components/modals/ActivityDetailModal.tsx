import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { CampaignActivity } from "../../types";
import { useCampaign } from "../../context/CampaignContext";
import { formatNumber, formatDate } from "../../lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface ActivityDetailModalProps {
  activity: CampaignActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  const { checkInAttendance, deleteActivity, updateActivity } = useCampaign();
  const [actualInput, setActualInput] = useState<string>("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  if (!activity) return null;

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(actualInput, 10);
    if (!isNaN(count) && count >= 0) {
      checkInAttendance(activity.id, count);
      setIsCheckingIn(false);
      setActualInput("");
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this activity from the campaign trail?")) {
      deleteActivity(activity.id);
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={activity.title}
      description={`${activity.type} · ${activity.subCounty}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600">Status:</span>
            <Badge
              variant={
                activity.status === "Completed"
                  ? "success"
                  : activity.status === "In Progress"
                  ? "warning"
                  : "default"
              }
            >
              {activity.status}
            </Badge>
          </div>
          <div className="text-xs text-zinc-500">
            Budget: <span className="font-semibold text-zinc-900">KES {formatNumber(activity.budgetKsh)}</span>
          </div>
        </div>

        {/* Core Logistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Date & Time</span>
            </div>
            <div className="font-semibold text-zinc-900 text-sm">
              {formatDate(activity.date)}
            </div>
            <div className="text-zinc-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{activity.time}</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-zinc-200 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Location & Ward</span>
            </div>
            <div className="font-semibold text-zinc-900 text-sm">
              {activity.venue}
            </div>
            <div className="text-zinc-600">
              {activity.ward} · {activity.subCounty}
            </div>
          </div>
        </div>

        {/* Turnout & Mobilization Stats */}
        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Crowd & Voter Mobilization Turnout</span>
            </div>
            {activity.actualTurnout !== undefined ? (
              <span className="text-xs font-semibold text-emerald-800">
                Verified Turnout
              </span>
            ) : (
              <span className="text-xs text-emerald-700">Projected</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-emerald-800">Target Expected</div>
              <div className="text-lg font-bold text-emerald-950">
                {formatNumber(activity.expectedTurnout)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-emerald-800">Actual Turnout</div>
              <div className="text-lg font-bold text-emerald-900">
                {activity.actualTurnout !== undefined
                  ? formatNumber(activity.actualTurnout)
                  : "Pending Post-Rally Audit"}
              </div>
            </div>
          </div>

          {/* Quick Check-in action */}
          {!isCheckingIn ? (
            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActualInput(
                    activity.actualTurnout ? String(activity.actualTurnout) : String(activity.expectedTurnout)
                  );
                  setIsCheckingIn(true);
                }}
                className="text-xs border-emerald-600 text-emerald-900 hover:bg-emerald-100"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                {activity.actualTurnout ? "Update Turnout Count" : "Check-in Actual Attendance"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAttendanceSubmit} className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center gap-2">
              <Input
                type="number"
                value={actualInput}
                onChange={(e) => setActualInput(e.target.value)}
                placeholder="Enter verified attendees"
                className="h-8 text-xs bg-white"
                autoFocus
              />
              <Button type="submit" size="sm" variant="default" className="h-8 text-xs">
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => setIsCheckingIn(false)}
              >
                Cancel
              </Button>
            </form>
          )}
        </div>

        {/* Operational Protocols */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-900">Protocols & Security:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                activity.securityCleared
                  ? "bg-zinc-100 border-zinc-200 text-emerald-800"
                  : "bg-zinc-100 border-zinc-200 text-zinc-500"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{activity.securityCleared ? "Police Escort Cleared" : "Police Notification Pending"}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                activity.soundPermitSecured
                  ? "bg-zinc-100 border-zinc-200 text-emerald-800"
                  : "bg-zinc-100 border-zinc-200 text-zinc-500"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activity.soundPermitSecured ? "PA Sound Permit Stamped" : "Sound Permit Required"}</span>
            </span>
          </div>
        </div>

        {/* Notes & Briefing */}
        <div>
          <div className="text-xs font-semibold text-zinc-900 mb-1">Field Briefing:</div>
          <div className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-lg border border-zinc-200 leading-relaxed">
            {activity.notes || "No additional briefing notes provided."}
          </div>
        </div>

        {/* Lead Coordinator */}
        <div className="text-xs text-zinc-500">
          Lead Field Officer: <span className="font-semibold text-zinc-900">{activity.leadCoordinator}</span>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete Activity
          </Button>

          <div className="flex items-center gap-2">
            {activity.status !== "Completed" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  updateActivity(activity.id, { status: "Completed" });
                  onClose();
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800"
              >
                Mark Completed
              </Button>
            )}
            <Button type="button" variant="default" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
