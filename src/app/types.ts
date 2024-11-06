export interface Launch {
  launchNo: string;
  flightNo: string;
  dateTime: string;
  rocket?: string;
  configuration?: string;
  payload?: string;
  orbit?: string;
  launchOutcome?: string;
  launchSite?: string;
  payloadMass?: number;
  payloadMassUnit?: string;
  missionDescription?: string;
  notes?: string;
}

export interface Launch {
  launchNo: string; // Changed from flightNo to match your data structure
  dateTime: string;
  payloadMass: string;
  launchOutcome: "Success" | "Failure";
  orbit: string;
  rocket: string;
}

export interface Stats {
  totalLaunches: number;
  successRate: string;
  averagePayload: string;
  payloadStdDev: string;
  heaviestPayload: string;
  totalPayload: string;
}

export interface OrbitDataItem {
  orbit: string;
  count: number;
  successRate: string;
}

export interface MissionDataItem {
  launchNo: number;
  date: string;
  payloadMass: number;
  success: boolean;
  rocket: string;
}

export interface OverviewSectionProps {
  launches: Launch[];
  stats: Stats;
}

export interface OrbitalAnalysisSectionProps {
  orbitData: OrbitDataItem[];
}

export interface MissionAnalysisSectionProps {
  launches: Launch[];
  missionData: MissionDataItem[];
}
