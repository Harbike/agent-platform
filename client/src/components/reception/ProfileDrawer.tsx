import { X, ExternalLink, GitCommit } from 'lucide-react';
import type { DirectoryRecord } from '../../types/directory';

interface ProfileDrawerProps {
  record: DirectoryRecord | null;
  onClose: () => void;
  onViewAuditLog?: (recordId: string) => void;
}

export default function ProfileDrawer({ record, onClose, onViewAuditLog }: ProfileDrawerProps) {
  if (!record) return null;

  // Dynamic drawer title based on record type
  const getDrawerTitle = () => {
    if (record.status === 'Vacant') return 'Position Details';
    return `${record.type} Details`;
  };

  return (
    <aside className="w-80 lg:w-96 bg-white border-l border-slate-200/80 h-full flex flex-col justify-between shadow-xl font-sans shrink-0 overflow-y-auto">
      
      <div>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {getDrawerTitle()}
          </span>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="p-6 border-b border-slate-100 text-center">
          {record.avatarUrl ? (
            <img
              src={record.avatarUrl}
              alt={record.name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-slate-100 shadow-sm mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl font-semibold">
              {record.name.charAt(0)}
            </div>
          )}
          <h3 className="text-lg font-bold text-slate-900">{record.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{record.positionTitle}</p>
        </div>

        {/* Core Metadata */}
        <div className="p-6 space-y-4 text-xs border-b border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-400">Area / Location</span>
            <span className="font-medium text-slate-800">{record.area}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Record Code</span>
            <span className="font-mono text-slate-800">{record.positionCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="font-medium text-emerald-600">{record.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Reporting Manager</span>
            <span className="font-medium text-slate-800">{record.currentDsm}</span>
          </div>
        </div>

        {/* Reporting Chain */}
        <div className="p-6">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Reporting Chain
          </h4>
          <div className="space-y-4 relative pl-3 border-l-2 border-slate-200">
            {record.reportingChain.map((chain, index) => (
              <div key={index} className="relative flex items-start space-x-3">
                <GitCommit className="w-4 h-4 text-[#660022] absolute -left-4.75 top-0.5 bg-white rounded-full" />
                <div>
                  <div className="text-xs font-medium text-slate-900">{chain.name}</div>
                  <div className="text-[11px] text-slate-500">{chain.role} · {chain.area}</div>
                </div>
              </div>
            ))}
          </div>

{/* Audit Trail Link */}
          <button
          onClick={() => onViewAuditLog && onViewAuditLog(record.id)}
          className="mt-6 flex items-center space-x-1.5 text-xs text-[#660022] hover:underline font-medium">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View full history log</span>
          </button>
        </div>
      </div>

    </aside>
  );
}