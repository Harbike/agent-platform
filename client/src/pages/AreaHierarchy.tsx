import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import AreaHierarchySummary from '../components/hierarchy/AreaHierarchySummary';
import SelectedPositionDrawer from '../components/hierarchy/SelectedPositionDrawer';
import { mockHierarchyDataByArea } from '../data/mockHierarchyData';
import type { HierarchyNode } from '../types/hierarchy';

export default function AreaHierarchy() {
  // Simulate active user role (Change to 'AM' or 'RM' to test permissions)
  const [currentUserRole] = useState<'SUPERADMIN' | 'AM' | 'RM' | 'DSM'>('SUPERADMIN');
  
  const [areas, setAreas] = useState(['Lagos', 'Owerri', 'Abuja']);
  const [selectedArea, setSelectedArea] = useState('Lagos');
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
//   const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(
//     mockHierarchyDataByArea['Lagos']?.root || null
//   );

  // Modal State for "+ Add Area"
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');

  const currentAreaGroup = mockHierarchyDataByArea[selectedArea] || mockHierarchyDataByArea['Lagos'];

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    const trimmed = newAreaName.trim();
    if (!areas.includes(trimmed)) {
      setAreas([...areas, trimmed]);
      setSelectedArea(trimmed);
    }
    setNewAreaName('');
    setIsAddAreaOpen(false);
  };

  const isSuperadmin = currentUserRole === 'SUPERADMIN';

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header & Read-Only Indicator */}

      {/* Area Selector Tabs + Superadmin + Add Area Button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 mr-2">Select area:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => {
                setSelectedArea(area);
                setSelectedNode(mockHierarchyDataByArea[area]?.root || null);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedArea === area
                  ? 'bg-[#8d002f] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-[#660022]/10'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Superadmin + Add Area CTA */}
        {isSuperadmin && (
          <button
            onClick={() => setIsAddAreaOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#8d002f] hover:bg-[#660022] text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Area</span>
          </button>
        )}
      </div>

      {/* Summary Metrics Bar */}
      <AreaHierarchySummary metrics={currentAreaGroup.metrics} areaName={selectedArea} />

      {/* Main Hierarchy & Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Interactive Hierarchy Canvas (3 Columns) */}
        <div className="lg:col-span-3 bg-white border border-[#660022]/30 rounded-2xl p-6 shadow-2xs overflow-x-auto min-h-125">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#660022]/10">
            <span className="text-xs font-semibold text-slate-700">
              Showing all positions in <strong className="text-slate-900">{selectedArea}</strong>
            </span>
            <div className="flex items-center space-x-4 text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Vacant</span>
              </span>
            </div>
          </div>

          {/* Node Render Tree */}
          <div className="flex flex-col items-center space-y-8">
            {/* AM Node */}
            <div
              onClick={() => setSelectedNode(currentAreaGroup.root)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all w-72 text-center bg-white ${
                selectedNode?.id === currentAreaGroup.root.id
                  ? 'border-[#8d002f]/60 ring-2 ring-[#8d002f]/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={currentAreaGroup.root.occupantAvatar}
                  alt={currentAreaGroup.root.occupantName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left flex-1">
                  <h4 className="text-xs font-bold text-slate-900">{currentAreaGroup.root.occupantName}</h4>
                  <p className="text-[11px] text-slate-500">{currentAreaGroup.root.title}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
            </div>

            {/* Connecting Connector Line */}
            <div className="w-0.5 h-6 bg-[#660022]/50"></div>

            {/* Regional Managers Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {currentAreaGroup.root.children?.map((rmNode) => (
                <div key={rmNode.id} className="flex flex-col items-center space-y-6">
                  {/* RM Card */}
                  <div
                    onClick={() => setSelectedNode(rmNode)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all w-full bg-white ${
                      selectedNode?.id === rmNode.id
                        ? 'border-[#8d002f]/60 ring-2 ring-[#8d002f]/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#660022]/10 text-[#660022]/80 flex items-center justify-center text-xs font-bold">
                        RM
                      </div>
                      <div className="text-left flex-1">
                        <h4 className="text-xs font-bold text-slate-900">{rmNode.occupantName}</h4>
                        <p className="text-[11px] text-slate-500">{rmNode.title}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="w-0.5 h-6 bg-[#660022]/50"></div>

                  {/* DSM Row under RM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {rmNode.children?.map((dsmNode) => {
                      const isVacant = dsmNode.status === 'Vacant';
                      return (
                        <div
                          key={dsmNode.id}
                          onClick={() => setSelectedNode(dsmNode)}
                          className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all bg-white ${
                            selectedNode?.id === dsmNode.id
                              ? 'border-[#8d002f]/60 ring-2 ring-[#8d002f]/20 shadow-md'
                              : isVacant
                              ? 'border-amber-200 bg-amber-50/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-semibold text-slate-500">
                              {dsmNode.positionCode}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                isVacant
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {dsmNode.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2.5">
                            {dsmNode.occupantAvatar ? (
                              <img
                                src={dsmNode.occupantAvatar}
                                alt={dsmNode.occupantName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#660022]/10 flex items-center justify-center text-[#660022]">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                {isVacant ? 'Vacant Slot' : dsmNode.occupantName}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {dsmNode.directAgentsCount ? `${dsmNode.directAgentsCount} agents` : 'Open DSM'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Position Side Drawer (1 Column) */}
        <div className="lg:col-span-1">
          <SelectedPositionDrawer
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            canAssign={isSuperadmin || currentUserRole === 'AM'}
          />
        </div>
      </div>

      {/* Add Area Modal (Superadmin Only) */}
      {isAddAreaOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Coverage Area</h3>
              <button
                onClick={() => setIsAddAreaOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddArea} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Area Name
                </label>
                <input
                  type="text"
                  required
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="e.g. Port Harcourt, Kano"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8d002f]/40"
                />
              </div>

              <div className="p-3 bg-[#660022]/10 border border-[#660022]/50 rounded-xl text-[11px] text-[#660022]/80">
                <p className="font-semibold mb-0.5">Target Allocation Rule Applied:</p>
                <p>Creating this area automatically derives 1 AM, 2 RMs, and 12 DSM targets.</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddAreaOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8d002f] hover:bg-[#660022] text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Create Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}