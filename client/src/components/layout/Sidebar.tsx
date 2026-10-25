import React, { useState } from 'react';
import type { User } from '../../types/auth';
import {
  Building2,
  GitFork,
  Users,
  UserCheck,
  ShieldCheck,
  FileText,
  UserIcon,
  Settings,
  ChevronDown, 
  ChevronRight
} from "lucide-react";
// import type { DirectoryRecord } from '../../types/directory';
import Logo from "../../assets/logo.png";


interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
    hasSub?: boolean;
  }

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  };

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
}: SidebarProps) {
  
  // the manager tab is closed at default
const [isManagersOpen, setIsManagersOpen] = useState(false);

const managerSubItems = [
  { id: 'managers-am', label: 'Area Managers (AM)', roles: ['Superadmin', 'Area Manager'] },
  { id: 'managers-rm', label: 'Regional Managers (RM)', roles: ['Superadmin', 'Area Manager', 'Regional Manager'] },
  { id: 'managers-dsm', label: 'District Managers (DSM)', roles: ['Superadmin', 'Area Manager', 'Regional Manager', 'DSM'] },
].filter(sub => sub.roles.includes(currentUser.role));

//main navigation items
const baseNavigationItems: NavItem[] = [
    { id: "reception", label: "Reception", icon: Building2, roles: ['Superadmin', 'Area Manager', 'Regional Manager', 'DSM', 'Agent'] },
    { id: "hierarchy", label: "Area Hierarchy", icon: GitFork, roles: ['Superadmin', 'Area Manager', 'Regional Manager', 'DSM', 'Agent'] },
    { id: "agents", label: "Agents", icon: Users, roles: ['Superadmin', 'Area Manager', 'Regional Manager', 'DSM', 'Agents'] },
    { id: "managers", label: "Managers", icon: UserCheck, roles: ['Superadmin', 'Area Manager', 'Regional Manager', 'DSM'], hasSub: true },
    { id: "admin", label: "Admin", icon: ShieldCheck, roles: ['Superadmin'] },
    { id: "audit", label: "Audit log", icon: FileText, roles: ['Superadmin'] },
    { id: "profile", label: "My profile", icon: UserIcon, roles: ['Superadmin', 'Area Manager', 'Regional Manager', 'DSM', 'Agent'] },
  ].filter(item => item.roles.includes(currentUser.role));

  const navItems: NavItem[] =
    currentUser?.role === "Superadmin"
      ? [
          ...baseNavigationItems,
          { id: "system-admin", label: "System Admin", icon: Settings, roles: ['Superadmin'] },
        ]
      : baseNavigationItems;

  return (
    <aside className="w-64 bg-[#ecdfe36b] text-[#660022] flex flex-col shrink-0 min-h-screen border-r border-[#660022]/70 font-sans">
      {/* Brand Header */}
      <div className="p-6 flex items-center space-x-3 border-b border-slate-400/50">
        <div className="w-8 h-8 flex items-center justify-center font-bold text-sm">
          <img src={Logo} alt="AMP LOGO" className="w-8 h-8 object-contain" />
        </div>
        <span className="font-semibold text-md tracking-tight text-[#660022]">
          Agent Management Platform
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          // const isActive = activeTab === item.id;
          const isManagerActive = activeTab.startsWith('managers');

            if (item.hasSub) {
              return (
                <div key={item.id} className="space-y-1">
                  {/* Parent Managers Item */}
                  <button
                  onClick={() => setIsManagersOpen(!isManagersOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isManagerActive ? 'bg-[#660022] text-white' : 'hover:bg-[#660022]/10 text-[#660022]'
                  }`}
                >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isManagersOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Sub-level accordion under Managers */}
                  {isManagersOpen && (
                    <div className="pl-7 space-y-1 border-l-2 border-[#660022]/40 ml-4 py-1">
                      {managerSubItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                            activeTab === sub.id
                              ? 'text-white bg-[#8d002f] font-semibold'
                              : 'text-[#660022] hover:text-[#660022] hover:bg-[#660022]/10'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === item.id ? 'bg-[#660022] text-white' : 'hover:bg-[#660022]/10 text-[#660022]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

 
      {/* Footer info */}
      <div className="p-4 border-t border-slate-400/50 text-[11px] text-[#660022] shrink-0 mt-auto">
        <p>© {new Date().getFullYear()} Harbike</p>
        <p className="text-[10px] text-[#660022] mt-0.5">
          AMP Enterprise Edition
        </p>
      </div>
    </aside>
  );
}
