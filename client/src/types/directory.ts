// Mockup Data - pending backup integration
export type RecordType = "Agent" | "Manager";
export type RecordStatus = "Active" | "Inactive" | "Vacant";

export interface DirectoryRecord {
  id: string;
  name: string;
  avatarUrl?: string;
  type: RecordType;
  positionCode: string;
  positionTitle: string;
  area: string;
  currentDsm: string;
  status: RecordStatus;
  email: string;
  reportingChain: {
    name: string;
    role: string;
    area: string;
    status: "Active" | "Inactive";
  }[];
}

export interface SummaryMetrics {
  areasAndAMs: {
    totalAreas: number;
    amsFilled: number;
    amVacant: number;
  };
  rmsCount: {
    filled: number;
    target: number;
    vacant: number;
  };
  dsmsCount: {
    filled: number;
    target: number;
    vacant: number;
  };
  agentsCount: number;
  vacantPositions: {
    total: number;
    byRole: {
      rm: number;
      dsm: number;
      am: number;
    };
  };
}
