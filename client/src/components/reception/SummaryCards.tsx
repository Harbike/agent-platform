import {  UserCheck, Users, AlertCircle, GitFork, Building2 } from 'lucide-react';
import type { SummaryMetrics } from '../../types/directory';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
  activeFilter?: string | null;
  onSelectFilter?: (filterType: string | null) => void;
}

export default function SummaryCards({ metrics, activeFilter, onSelectFilter }: SummaryCardsProps) {
  const cards = [
    {
      id: 'areas',
      title: 'Areas & AMs',
      value: `${metrics.areasAndAMs.amsFilled} / ${metrics.areasAndAMs.totalAreas}`,
      subtext: `${metrics.areasAndAMs.amVacant} Vacant Area(s)`,
      icon: Building2,
      accent: 'border-l-indigo-500 text-indigo-600 bg-indigo-50/50',
    },
    {
      id: 'rms',
      title: 'Regional Managers',
      value: `${metrics.rmsCount.filled} / ${metrics.rmsCount.target}`,
      subtext: `${metrics.rmsCount.vacant} Vacant RM Slot(s)`,
      icon: GitFork,
      accent: 'border-l-blue-500 text-blue-600 bg-blue-50/50',
    },
    {
      id: 'dsms',
      title: 'District Sales Mgrs',
      value: `${metrics.dsmsCount.filled} / ${metrics.dsmsCount.target}`,
      subtext: `${metrics.dsmsCount.vacant} Vacant DSM Slot(s)`,
      icon: UserCheck,
      accent: 'border-l-emerald-500 text-emerald-600 bg-emerald-50/50',
    },
    {
      id: 'agents',
      title: 'Field Agents',
      value: metrics.agentsCount,
      subtext: 'Total Active Agents',
      icon: Users,
      accent: 'border-l-sky-500 text-sky-600 bg-sky-50/50',
    },
    {
      id: 'vacancies',
      title: 'Vacant Positions',
      value: metrics.vacantPositions.total,
      subtext: `${metrics.areasAndAMs.amVacant} AMs + Unassigned Roles`, // Custom render for breakdown badge
      icon: AlertCircle,
      accent: 'border-l-rose-500 text-rose-600 bg-rose-50/50',
      isVacantCard: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div 
          key={card.id}
            onClick={() => onSelectFilter && onSelectFilter(isSelected ? null : card.id)}
            className={`cursor-pointer transition-all duration-200 p-4 rounded-2xl border bg-white shadow-xs hover:shadow-md border-l-4 ${card.accent} ${
              isSelected ? 'ring-2 ring-amber-500 ring-offset-1 bg-amber-50/20' : 'hover:shadow-sm border-slate-200'
            }`}
          >

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              
              <div className={`p-2 rounded-lg ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</div>

            {/* Vacant Positions Breakdown Badges */}
            {card.isVacantCard ? (
              <div className="flex items-center -ml-3 gap-0.5 mt-2 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-600">
                <span className="bg-rose-100 text-rose-700 px-1 py-0.2 rounded font-bold">
                  {metrics.vacantPositions.byRole.rm}
                </span>{' '}
                RM
                <span className="text-slate-300">·</span>
                <span className="bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-bold">
                  {metrics.vacantPositions.byRole.dsm}
                </span>{' '}
                DSM
                <span className="text-slate-300">·</span>
                <span className="bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-bold">
                  {metrics.vacantPositions.byRole.am}
                </span>{' '}
                AM
              </div>
            ) : (
              <div className="text-xs text-slate-500">{card.subtext}</div>
            )}
          </div>
        );
      })}
         
    </div>
  );
}