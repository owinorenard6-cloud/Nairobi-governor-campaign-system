import React from "react";
import {
  CheckCircle2,
  Calendar,
  CheckSquare,
  MessageSquareWarning,
  Users,
  Smartphone,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Dialog } from "../ui/dialog";
import { useCampaign } from "../../context/CampaignContext";
import { Button } from "../ui/button";

export const TestingGuideModal: React.FC = () => {
  const { isTestingGuideOpen, setIsTestingGuideOpen, resetToDemoData } = useCampaign();

  const testingSteps = [
    {
      page: "1. Dashboard Navigation & County Switcher",
      icon: Sparkles,
      action: "Test Overview & Stats",
      instructions:
        "Check the live countdown to election day, ward mobilization progress, and upcoming rallies. Click the County Switcher under the title to toggle between Nairobi, Nyamira, Nakuru, or Kisumu to test multi-county versatility.",
    },
    {
      page: "2. Activities Management",
      icon: Calendar,
      action: "Schedule & Verify Rallies",
      instructions:
        "Switch to Activities tab. Use the sub-county filter (e.g. 'Kasarani' or 'Embakasi East'). Click '+ New Activity' to schedule a campaign rally or town hall. On an existing activity, click 'Check-in Attendance' to log actual voter turnout and observe target reach increase automatically.",
    },
    {
      page: "3. Operational Tasks",
      icon: CheckSquare,
      action: "Manage Field Workflow",
      instructions:
        "Switch to Tasks tab. Notice the 'To Do', 'In Progress', and 'Done' columns or view modes. Click quick status buttons to move tasks between stages (e.g. mark Kasarani sound permit Done). Click '+ Add Task' to dispatch an operational assignment to a team member.",
    },
    {
      page: "4. Community Issues Tracker",
      icon: MessageSquareWarning,
      action: "Log Wananchi Grievances",
      instructions:
        "Switch to Community Issues tab. Filter by category (e.g. 'Water & Sanitation'). Click '+ Log Community Issue' to register a ward problem. Use the status dropdown on any card (e.g. 'Pledged in Manifesto' or 'Resolved') and click 'Add to Manifesto' to toggle candidate commitment.",
    },
    {
      page: "5. Team & Field Coordinators",
      icon: Users,
      action: "Directory & Assignments",
      instructions:
        "Switch to Team tab. Browse campaign leads and ward coordinators. Filter by role or search by name. Click '+ Add Member' to onboard a new volunteer lead, and test the simulated phone/email contact triggers.",
    },
    {
      page: "6. Mobile Screen Testing",
      icon: Smartphone,
      action: "Responsive Bottom Navigation",
      instructions:
        "Resize browser window or open Chrome DevTools Device Mode (iPhone / Android). Test the thumb-friendly bottom navigation bar, card layouts, touch-friendly buttons, and responsive modal drawers.",
    },
  ];

  return (
    <Dialog
      isOpen={isTestingGuideOpen}
      onClose={() => setIsTestingGuideOpen(false)}
      title="Prototype Testing Guide"
      description="Follow these guided steps to verify all functional modules of County Campaign Manager."
      maxWidth="xl"
    >
      <div className="space-y-4 text-sm">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-xs text-emerald-900">
              Interactive Prototype Sandbox
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              All forms, status toggles, filters, and records persist in browser storage. Fictional sample data is used so you can safely test creating, updating, and filtering records.
            </p>
          </div>
        </div>

        <div className="space-y-3 divide-y divide-zinc-100">
          {testingSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="pt-3 first:pt-0">
                <div className="flex items-center gap-2 font-semibold text-zinc-950">
                  <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{step.page}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 pl-8 leading-relaxed">
                  {step.instructions}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetToDemoData();
              setIsTestingGuideOpen(false);
            }}
            className="w-full sm:w-auto text-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsTestingGuideOpen(false)}
            className="w-full sm:w-auto text-xs"
          >
            Got it, Let me Test
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
