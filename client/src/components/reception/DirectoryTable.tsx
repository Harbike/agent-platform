import { useState } from "react";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import type { DirectoryRecord, RecordStatus } from "../../types/directory";

interface DirectoryTableProps {
  records: DirectoryRecord[];
  onSelectRecord: (record: DirectoryRecord) => void;
  selectedRecordId?: string;
}

export default function DirectoryTable({
  records,
  onSelectRecord,
  selectedRecordId,
}: DirectoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter Logic
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.positionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.positionTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = selectedArea === "All" || r.area === selectedArea;
    const matchesStatus =
      selectedStatus === "All" || r.status === selectedStatus;

    return matchesSearch && matchesArea && matchesStatus;
  });

  // SORT ALPHABETICALLY BY NAME
  const sortedAndFilteredRecords = [...filteredRecords].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Vacant":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Directory Filter Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#660022]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, or position"
            className="w-full bg-white/90 border border-[#660022] rounded-lg pl-10 pr-4 py-2 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#660022]/60 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#660022]/40"
          >
            <option value="All">Area: All</option>
            <option value="Lagos">Lagos</option>
            <option value="Owerri">Owerri</option>
            <option value="Abuja">Abuja</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#660022]/40"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Vacant">Vacant</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedArea("All");
              setSelectedStatus("All");
            }}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              <th className="py-3.5 px-5">Name</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Agent code or position title</th>
              <th className="py-3.5 px-4">Area</th>
              <th className="py-3.5 px-4">Reporting Line</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {sortedAndFilteredRecords.map((record) => {
              const isSelected = selectedRecordId === record.id;
              return (
                <tr
                  key={record.id}
                  onClick={() => onSelectRecord(record)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50/60" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3.5 px-5 font-medium text-slate-900 flex items-center space-x-3">
                    {record.avatarUrl ? (
                      <img
                        src={record.avatarUrl}
                        alt={record.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span>{record.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{record.type}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {record.positionCode}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{record.area}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {record.positionTitle === "DSM"
                      ? record.reportingChain?.[0]?.name || "RM Assigned" // For DSMs, display their RM
                      : record.positionTitle === "AM"
                        ? "Executive / HQ"
                        : record.positionTitle === "Manager" ||
                            record.positionTitle === "RM"
                          ? record.reportingChain?.[0]?.name || "N/A"
                          : record.positionTitle === "DSM"
                            ? record.reportingChain?.[0]?.name || "RM"
                            : record.currentDsm || "Direct Supervisor"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(
                        record.status,
                      )}`}
                    >
                      • {record.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing 1–{filteredRecords.length} of {records.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-md bg-[#8d002f] text-white font-medium flex items-center justify-center text-xs">
            1
          </button>
          <button className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
