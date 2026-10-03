import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PageView,
  CampaignActivity,
  CampaignTask,
  CommunityIssue,
  TeamMember,
  CountyCampaignStats,
  TaskStatus,
  IssueStatus,
  ActivityStatus,
} from "../types";
import {
  initialActivities,
  initialTasks,
  initialCommunityIssues,
  initialTeamMembers,
  initialCountyStats,
} from "../data/mockData";

interface CampaignContextType {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedSubCounty: string;
  setSelectedSubCounty: (subCounty: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stats: CountyCampaignStats;
  updateStats: (partial: Partial<CountyCampaignStats>) => void;
  
  // Activities
  activities: CampaignActivity[];
  addActivity: (activity: Omit<CampaignActivity, "id">) => void;
  updateActivity: (id: string, updates: Partial<CampaignActivity>) => void;
  deleteActivity: (id: string) => void;
  checkInAttendance: (id: string, count: number) => void;

  // Tasks
  tasks: CampaignTask[];
  addTask: (task: Omit<CampaignTask, "id">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<CampaignTask>) => void;
  deleteTask: (id: string) => void;

  // Issues
  issues: CommunityIssue[];
  addIssue: (issue: Omit<CommunityIssue, "id">) => void;
  updateIssueStatus: (id: string, status: IssueStatus) => void;
  toggleManifestoPledge: (id: string) => void;
  updateIssue: (id: string, updates: Partial<CommunityIssue>) => void;
  deleteIssue: (id: string) => void;

  // Team
  team: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, "id" | "avatarInitials">) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Helpers & Reset
  resetToDemoData: () => void;
  isTestingGuideOpen: boolean;
  setIsTestingGuideOpen: (open: boolean) => void;
  activeModal: "none" | "new-activity" | "new-task" | "new-issue" | "new-team";
  setActiveModal: (modal: "none" | "new-activity" | "new-task" | "new-issue" | "new-team") => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVITIES: "ccm_activities_v1",
  TASKS: "ccm_tasks_v1",
  ISSUES: "ccm_issues_v1",
  TEAM: "ccm_team_v1",
  STATS: "ccm_stats_v1",
};

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>("dashboard");
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>("All Sub-Counties");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isTestingGuideOpen, setIsTestingGuideOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<"none" | "new-activity" | "new-task" | "new-issue" | "new-team">("none");

  // Load from localStorage or use initial mock data
  const [stats, setStats] = useState<CountyCampaignStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : initialCountyStats;
    } catch {
      return initialCountyStats;
    }
  });

  const [activities, setActivities] = useState<CampaignActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [tasks, setTasks] = useState<CampaignTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [issues, setIssues] = useState<CommunityIssue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
      return saved ? JSON.parse(saved) : initialCommunityIssues;
    } catch {
      return initialCommunityIssues;
    }
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
      return saved ? JSON.parse(saved) : initialTeamMembers;
    } catch {
      return initialTeamMembers;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch {
      // ignore
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
    } catch {
      // ignore
    }
  }, [team]);

  const updateStats = (partial: Partial<CountyCampaignStats>) => {
    setStats((prev) => ({ ...prev, ...partial }));
  };

  // Activity Handlers
  const addActivity = (act: Omit<CampaignActivity, "id">) => {
    const newAct: CampaignActivity = {
      ...act,
      id: `act-${Date.now()}`,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const updateActivity = (id: string, updates: Partial<CampaignActivity>) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  const checkInAttendance = (id: string, count: number) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, actualTurnout: count, status: "Completed" as ActivityStatus } : act
      )
    );
    // increment voter reach stats
    setStats((prev) => ({
      ...prev,
      registeredVotersReached: prev.registeredVotersReached + count,
    }));
  };

  // Task Handlers
  const addTask = (tsk: Omit<CampaignTask, "id">) => {
    const newTask: CampaignTask = {
      ...tsk,
      id: `tsk-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((tsk) =>
        tsk.id === id
          ? {
              ...tsk,
              status,
              completedAt: status === "Done" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : tsk
      )
    );
  };

  const updateTask = (id: string, updates: Partial<CampaignTask>) => {
    setTasks((prev) =>
      prev.map((tsk) => (tsk.id === id ? { ...tsk, ...updates } : tsk))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((tsk) => tsk.id !== id));
  };

  // Issue Handlers
  const addIssue = (iss: Omit<CommunityIssue, "id">) => {
    const newIssue: CommunityIssue = {
      ...iss,
      id: `iss-${Date.now()}`,
    };
    setIssues((prev) => [newIssue, ...prev]);
  };

  const updateIssueStatus = (id: string, status: IssueStatus) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, status } : iss))
    );
  };

  const toggleManifestoPledge = (id: string) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === id ? { ...iss, manifestoPledge: !iss.manifestoPledge } : iss
      )
    );
  };

  const updateIssue = (id: string, updates: Partial<CommunityIssue>) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, ...updates } : iss))
    );
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((iss) => iss.id !== id));
  };

  // Team Handlers
  const addTeamMember = (member: Omit<TeamMember, "id" | "avatarInitials">) => {
    const initials = member.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now()}`,
      avatarInitials: initials || "KE",
    };
    setTeam((prev) => [newMember, ...prev]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteTeamMember = (id: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const resetToDemoData = () => {
    setStats(initialCountyStats);
    setActivities(initialActivities);
    setTasks(initialTasks);
    setIssues(initialCommunityIssues);
    setTeam(initialTeamMembers);
    setSelectedSubCounty("All Sub-Counties");
    setSearchQuery("");
    try {
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.ISSUES);
      localStorage.removeItem(STORAGE_KEYS.TEAM);
    } catch {
      // ignore
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedSubCounty,
        setSelectedSubCounty,
        searchQuery,
        setSearchQuery,
        stats,
        updateStats,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        checkInAttendance,
        tasks,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        issues,
        addIssue,
        updateIssueStatus,
        toggleManifestoPledge,
        updateIssue,
        deleteIssue,
        team,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        resetToDemoData,
        isTestingGuideOpen,
        setIsTestingGuideOpen,
        activeModal,
        setActiveModal,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
