import { User, ShieldAlert, ArrowRight, History, ExternalLink, UserCheck } from 'lucide-react';
import type { HierarchyNode } from '../../types/hierarchy';

interface SelectedPositionDrawerProps {
  node: HierarchyNode | null;
  onClose: () => void;
  canAssign: boolean; // True for Superadmin / AM
}

export default function SelectedPositionDrawer({ node, canAssign }: SelectedPositionDrawerProps) {
  if (!node) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6  text-slate-400 text-xs shadow-2xs">
        Select any node in the hierarchy tree to inspect position details, direct agents, and assigned leadership.
      </div>
    );
  }

  const isVacant = node.status === 'Vacant';

  return (
    <div className="bg-white border border-[#660022]/30 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-6">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Selected Position
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              isVacant
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            • {node.status}
          </span>
        </div>

        {/* Title & Code */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-900">{node.title}</h3>
          <p className="text-xs font-mono text-slate-500">{node.positionCode} ({node.area})</p>
        </div>

        {/* Occupant Card */}
        <div className="mt-4 p-3.5 bg-[#660022]/2 border border-[#660022]/60 rounded-xl flex items-center space-x-3">
          {node.occupantAvatar ? (
            <img
              src={node.occupantAvatar}
              alt={node.occupantName || 'Occupant'}
              className="w-10 h-10 rounded-full object-cover border border-[#660022]/50"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#660022]/10 flex items-center justify-center text-[#660022]">
              {isVacant ? <ShieldAlert className="w-5 h-5 text-amber-600" /> : <User className="w-5 h-5" />}
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-900">
              {isVacant ? 'No current occupant' : node.occupantName}
            </p>
            <p className="text-[11px] text-slate-500">
              {isVacant ? 'Position open for allocation' : `Assigned ${node.role}`}
            </p>
          </div>
        </div>

        {/* Direct Agents Count for DSM */}
        {node.role === 'DSM' && (
          <div className="mt-4 p-3.5 bg-[#660022]/5 border border-[#660022]/30 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#660022] font-semibold">Direct Agents</p>
              <p className="text-lg font-bold text-slate-900">{node.directAgentsCount || 0} agents</p>
            </div>
            <UserCheck className="w-5 h-5 text-[#660022]" />
          </div>
        )}

        {/* Action Links */}
        <div className="mt-5 space-y-2">
          <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#660022]/60 text-xs font-medium text-[#660022] hover:bg-[#660022]/5 transition-colors">
            <span className="flex items-center space-x-2">
              <History className="w-4 h-4 text-[#8d002f]/60" />
              <span>View action history</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8d002f]/60" />
          </button>

          {!isVacant && (
            <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#660022]/60 text-xs font-medium text-[#660022] hover:bg-[#660022]/5 transition-colors">
              <span className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-[#8d002f]/60" />
                <span>View profile</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8d002f]/60" />
            </button>
          )}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="pt-4 border-t border-slate-100">
        {isVacant ? (
          <button
            disabled={!canAssign}
            className="w-full py-2.5 px-4 bg-[#8d002f] text-white text-xs font-medium rounded-lg hover:bg-[#660022] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>Fill / Assign Position</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled={!canAssign}
            className="w-full py-2.5 px-4 bg-[#8d002f] text-white  text-xs font-medium rounded-lg hover:bg-[#660022] transition-colors disabled:opacity-50"
          >
            Reassign Position
          </button>
        )}
      </div>
    </div>
  );
}