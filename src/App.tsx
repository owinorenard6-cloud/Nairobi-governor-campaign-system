import React from "react";
import { CampaignProvider, useCampaign } from "./context/CampaignContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { TestingGuideModal } from "./components/layout/TestingGuideModal";

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { TasksPage } from "./pages/TasksPage";
import { CommunityIssuesPage } from "./pages/CommunityIssuesPage";
import { TeamPage } from "./pages/TeamPage";

// Global Creation Modals
import { NewActivityModal } from "./components/modals/NewActivityModal";
import { NewTaskModal } from "./components/modals/NewTaskModal";
import { NewIssueModal } from "./components/modals/NewIssueModal";
import { NewTeamMemberModal } from "./components/modals/NewTeamMemberModal";

const CampaignAppContent: React.FC = () => {
  const { currentPage, activeModal, setActiveModal, setIsTestingGuideOpen } = useCampaign();

  const renderActivePage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "activities":
        return <ActivitiesPage />;
      case "tasks":
        return <TasksPage />;
      case "issues":
        return <CommunityIssuesPage />;
      case "team":
        return <TeamPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-950 flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Header */}
      <Header />

      {/* Main Content Area: Sidebar + Page Container */}
      <div className="flex-1 flex flex-row">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderActivePage()}

          {/* Simple Clean Prototype Footer */}
          <footer className="mt-12 pt-6 border-t border-zinc-200/80 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-800">County Campaign Manager</span>
              <span aria-hidden="true">·</span>
              <span>Gubernatorial Field Operations Prototype</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTestingGuideOpen(true)}
                className="hover:text-emerald-800 underline underline-offset-2 cursor-pointer font-medium"
              >
                Testing Guide
              </button>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-400">Simulated Data · No external APIs</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals */}
      <NewActivityModal
        isOpen={activeModal === "new-activity"}
        onClose={() => setActiveModal("none")}
      />
      <NewTaskModal
        isOpen={activeModal === "new-task"}
        onClose={() => setActiveModal("none")}
      />
      <NewIssueModal
        isOpen={activeModal === "new-issue"}
        onClose={() => setActiveModal("none")}
      />
      <NewTeamMemberModal
        isOpen={activeModal === "new-team"}
        onClose={() => setActiveModal("none")}
      />
      <TestingGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <CampaignProvider>
      <CampaignAppContent />
    </CampaignProvider>
  );
}
