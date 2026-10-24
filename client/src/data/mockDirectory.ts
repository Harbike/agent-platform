// Full profile details of Mockup Data - pending backup integration

import type { DirectoryRecord, SummaryMetrics } from "../types/directory";

//Define base filled & target capacity counts
const BASE_METRICS = {
  totalAreas: 14,
  amsFilled: 11,
  rmsFilled: 28,
  dsmsFilled: 162,
  agentsCount: 480,
};

// Compute Target Capacities based strictly on AM count
// Target RMs = totalAreas * 2
const rmsTarget = BASE_METRICS.totalAreas * 2;

// Target DSMs = total Target RMs * 6
const dsmsTarget = rmsTarget * 6;

// Automatically compute derived vacancies
const calculatedAmVacant = BASE_METRICS.totalAreas - BASE_METRICS.amsFilled;
const calculatedRmVacant = rmsTarget - BASE_METRICS.rmsFilled;
const calculatedDsmVacant = dsmsTarget - BASE_METRICS.dsmsFilled;

export const mockMetrics: SummaryMetrics = {
  areasAndAMs: {
    totalAreas: BASE_METRICS.totalAreas,
    amsFilled: BASE_METRICS.amsFilled,
    amVacant: calculatedAmVacant,
  },
  rmsCount: {
    filled: BASE_METRICS.rmsFilled,
    target: rmsTarget,
    vacant: calculatedRmVacant,
  },
  dsmsCount: {
    filled: BASE_METRICS.dsmsFilled,
    target: dsmsTarget,
    vacant: calculatedDsmVacant,
  },
  agentsCount: BASE_METRICS.agentsCount,
  vacantPositions: {
    total: calculatedAmVacant + calculatedRmVacant + calculatedDsmVacant, // Dynamic total sum
    byRole: {
      rm: calculatedRmVacant,
      dsm: calculatedDsmVacant,
      am: calculatedAmVacant,
    },
  },
};

export const mockDirectoryData: DirectoryRecord[] = [
  {
    id: "1",
    name: "Chinedu Okoro",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    type: "Agent",
    positionCode: "AG-LAG-014",
    positionTitle: "Agent",
    area: "Lagos",
    currentDsm: "Fatima Bello",
    status: "Active",
    email: "chinedu.okoro@amp.org",
    reportingChain: [
      { name: "Fatima Bello", role: "DSM", area: "Lagos", status: "Active" },
      {
        name: "Ibrahim Yusuf",
        role: "Regional Manager",
        area: "South West",
        status: "Active",
      },
      {
        name: "Amina Okafor",
        role: "Area Manager",
        area: "Lagos",
        status: "Active",
      },
    ],
  },
  {
    id: "2",
    name: "Fatima Bello",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    type: "Manager",
    positionCode: "DSM-LAG-002",
    positionTitle: "DSM",
    area: "Lagos",
    currentDsm: "Ibrahim Yusuf",
    status: "Active",
    email: "fatima.bello@amp.org",
    reportingChain: [
      {
        name: "Ibrahim Yusuf",
        role: "Regional Manager",
        area: "South West",
        status: "Active",
      },
      {
        name: "Amina Okafor",
        role: "Area Manager",
        area: "Lagos",
        status: "Active",
      },
    ],
  },
  {
    id: "3",
    name: "Babatunde Adeyemi",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    type: "Manager",
    positionCode: "RM-OWE-01",
    positionTitle: "Manager",
    area: "Owerri",
    currentDsm: "Amina Okafor",
    status: "Active",
    email: "babatunde.a@amp.org",
    reportingChain: [
      {
        name: "Amina Okafor",
        role: "Area Manager",
        area: "Lagos",
        status: "Active",
      },
    ],
  },
  {
    id: "4",
    name: "DSM - Abuja Central",
    type: "Manager",
    positionCode: "DSM-ABJ-02",
    positionTitle: "DSM",
    area: "Abuja",
    currentDsm: "Aisha Mohammed",
    status: "Vacant",
    email: "vacant@amp.org",
    reportingChain: [
      {
        name: "Aisha Mohammed",
        role: "Regional Manager",
        area: "North",
        status: "Active",
      },
    ],
  },
  {
    id: "5",
    name: "Ngozi Eze",
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80",
    type: "Agent",
    positionCode: "AG-OWE-009",
    positionTitle: "Agent",
    area: "Owerri",
    currentDsm: "Fatima Bello",
    status: "Active",
    email: "ngozi.eze@amp.org",
    reportingChain: [
      {
        name: "Babatunde Adeyemi",
        role: "RM",
        area: "Owerri",
        status: "Active",
      },
    ],
  },
];
