import type { User } from '../types/auth';
// import React, { useState } from 'react';
// import { 
//   UserPlus, 
//   ArrowRightLeft, 
//   UserX, 
//   Filter, 
//   Search, 
//   ShieldCheck, 
//   CheckCircle2, 
//   AlertCircle,
//   X 
// } from 'lucide-react';

interface ManagersProps {
  activeTab: string;
  currentUser: User;
}

export interface ManagerRecord {
  id: string;
  name: string;
  email: string;
  level: 'AM' | 'RM' | 'DSM';
  title: string;
  area: string;
  region?: string;
  district?: string;
  status: 'Active' | 'Vacant' | 'Inactive';
  assignedAgentsCount: number;
}

// Initial Mock Data reflecting structure


// const initialManagers: ManagerRecord[] = [
//   { id: 'MGR-101', name: 'Adebayo Ogunlesi', email: 'a.ogunlesi@amp.com', level: 'AM', title: 'Area Manager', area: 'Lagos', status: 'Active', assignedAgentsCount: 48 },
//   { id: 'MGR-102', name: 'Chidi Mokeme', email: 'c.mokeme@amp.com', level: 'RM', title: 'Regional Manager', area: 'Lagos', region: 'Ikeja Zone', status: 'Active', assignedAgentsCount: 24 },
//   { id: 'MGR-103', name: 'Fatima Kyari', email: 'f.kyari@amp.com', level: 'RM', title: 'Regional Manager', area: 'Lagos', region: 'Lekki/Island Zone', status: 'Active', assignedAgentsCount: 24 },
//   { id: 'MGR-104', name: 'Emeka Nwosu', email: 'e.nwosu@amp.com', level: 'DSM', title: 'District Sales Manager', area: 'Lagos', region: 'Ikeja Zone', district: 'Ikeja Central', status: 'Active', assignedAgentsCount: 8 },
//   { id: 'MGR-105', name: 'Bisi Akande', email: 'b.akande@amp.com', level: 'DSM', title: 'District Sales Manager', area: 'Lagos', region: 'Ikeja Zone', district: 'Maryland', status: 'Active', assignedAgentsCount: 8 },
//   { id: 'MGR-106', name: 'Vacant Slot', email: '-', level: 'DSM', title: 'District Sales Manager', area: 'Lagos', region: 'Lekki/Island Zone', district: 'Victoria Island', status: 'Vacant', assignedAgentsCount: 0 },
// ];

export default function Managers({ activeTab, currentUser }: ManagersProps) {
  // Derive effective management level from activeTab
  const effectiveLevel = 
    activeTab === 'managers-am' ? 'AM' :
    activeTab === 'managers-rm' ? 'RM' :
activeTab === 'managers-dsm' ? 'DSM' : 'ALL';

const levelLabels: Record<string, string> = {
    'AM': 'Area Managers (AM)',
    'RM': 'Regional Managers (RM)',
    'DSM': 'District Managers (DSM)',
    'ALL': 'All Managers',
  };

 return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {levelLabels[effectiveLevel]}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Viewing Level Scope: <span className="font-semibold text-[#660022]">{effectiveLevel}</span> | User Role: <span className="font-semibold text-slate-700">{currentUser.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}