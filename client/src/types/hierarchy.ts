import type { RecordStatus } from './directory';

export type HierarchyRole = 'AM' | 'RM' | 'DSM' | 'Agent';

export interface AgentSummaryNode {
  id: string;
  name: string;
  code: string;
  status: RecordStatus;
  avatarUrl?: string;
}

export interface HierarchyNode {
  id: string;
  positionCode: string;
  title: string;
  role: HierarchyRole;
  status: RecordStatus;
  area: string;
  occupantName?: string;
  occupantAvatar?: string;
  directAgentsCount?: number;
  agentsList?: AgentSummaryNode[];
  children?: HierarchyNode[];
}

export interface AreaSummaryMetrics {
  totalAm: number;
  totalRms: number;
  totalDsms: number;
  activeAgents: number;
  vacantPositions: number;
}