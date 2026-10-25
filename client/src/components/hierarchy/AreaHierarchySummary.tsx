import { UserCheck, Users, Building2, GitFork, AlertCircle } from 'lucide-react';
import type { AreaSummaryMetrics } from '../../types/hierarchy';

interface AreaHierarchySummaryProps {
  metrics: AreaSummaryMetrics;
  areaName: string;
}

export default function AreaHierarchySummary({ metrics, areaName }: AreaHierarchySummaryProps) {
  const cards = [
    {
      title: 'Area Manager',
      value: metrics.totalAm,
      subtext: `${areaName} Lead`,
      icon: Building2,
      color: 'border-indigo-200 text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Regional Managers',
      value: metrics.totalRms,
      subtext: 'Active RMs',
      icon: GitFork,
      color: 'bg-blue-50/50 text-blue-600 border-blue-200',
    },
    {
      title: 'DSM Positions',
      value: metrics.totalDsms,
      subtext: 'Target Capacity',
      icon: UserCheck,
      color: 'bg-emerald-50/50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Active Agents',
      value: metrics.activeAgents,
      subtext: 'Field Force',
      icon: Users,
      color: 'bg-sky-50/50 text-sky-600 border-sky-200',
    },
    {
      title: 'Vacant Positions',
      value: metrics.vacantPositions,
      subtext: 'Open Slots',
      icon: AlertCircle,
      color: 'bg-rose-50/50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-[#660022]/30 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between"
          >
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                {card.title}
              </p>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{card.subtext}</p>
            </div>
            <div className={`p-2 rounded-lg border ${card.color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}