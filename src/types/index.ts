export type PageView = "dashboard" | "activities" | "tasks" | "issues" | "team";

export type SubCounty =
  | "All Sub-Counties"
  | "Westlands"
  | "Kasarani"
  | "Kibra"
  | "Embakasi East"
  | "Lang'ata"
  | "Starehe"
  | "Dagoretti North"
  | "Roysambu"
  | "Kamukunji"
  | "Makadara";

export type ActivityType =
  | "Mega Rally"
  | "Ward Town Hall"
  | "Boda Boda Youth Forum"
  | "Market Walkabout"
  | "Door-to-Door Drive"
  | "Women League Assembly"
  | "Religious Leaders Breakfast"
  | "Strategy Meeting";

export type ActivityStatus = "Scheduled" | "In Progress" | "Completed" | "Postponed";

export interface CampaignActivity {
  id: string;
  title: string;
  type: ActivityType;
  subCounty: string;
  ward: string;
  venue: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  expectedTurnout: number;
  actualTurnout?: number;
  leadCoordinator: string;
  securityCleared: boolean;
  soundPermitSecured: boolean;
  status: ActivityStatus;
  notes: string;
  budgetKsh: number;
}

export type TaskPriority = "High" | "Medium" | "Normal";
export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskCategory =
  | "Logistics & Transport"
  | "Branding & Materials"
  | "Security & Protocol"
  | "Voter Mobilization"
  | "Media & Digital Comms"
  | "Legal & Compliance";

export interface CampaignTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  subCounty: string;
  assignedTo: string;
  assignedRole: string;
  dueDate: string;
  completedAt?: string;
}

export type IssueCategory =
  | "Water & Sanitation"
  | "Roads & Feeder Bridges"
  | "Market Stalls & Lighting"
  | "Youth Employment & Boda Boda"
  | "Health Centers & Clinics"
  | "Waste Management"
  | "Education & Bursaries";

export type IssueStatus = "Reported" | "Under Review" | "Pledged in Manifesto" | "Resolved";
export type IssuePriority = "Urgent" | "High" | "Normal";

export interface CommunityIssue {
  id: string;
  title: string;
  category: IssueCategory;
  subCounty: string;
  ward: string;
  reportedBy: string;
  dateReported: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignedTo: string;
  manifestoPledge: boolean;
  actionTakenNotes: string;
  affectedEstCitizens: number;
}

export type TeamRole =
  | "Campaign Director"
  | "Field Operations Lead"
  | "Sub-County Coordinator"
  | "Youth League Mobilizer"
  | "Women League Coordinator"
  | "Media & Press Secretary"
  | "Logistics & Fleet Officer"
  | "Legal & Polling Agent Lead";

export type TeamStatus = "Active in Field" | "At Secretariat HQ" | "On Standby";

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  subCounty: string;
  phone: string;
  email: string;
  status: TeamStatus;
  activeTasksCount: number;
  avatarInitials: string;
}

export interface CountyCampaignStats {
  countyName: string;
  candidateName: string;
  runningMate: string;
  electionYear: number;
  daysToElection: number;
  registeredVotersTarget: number;
  registeredVotersReached: number;
  totalWardsCount: number;
  wardsCoveredCount: number;
  activeVolunteers: number;
}
