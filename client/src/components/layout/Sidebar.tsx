import {
  Building2,
  GitFork,
  Users,
  UserCheck,
  MapPin,
  ShieldCheck,
  FileText,
  UserIcon,
  Settings,
} from "lucide-react";
// import type { DirectoryRecord } from '../../types/directory';
import Logo from "../../assets/logo.png";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
    email?: string;
  };
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
}: SidebarProps) {
  const baseNavigationItems = [
    { id: "reception", label: "Reception", icon: Building2 },
    { id: "hierarchy", label: "Area Hierarchy", icon: GitFork },
    { id: "agents", label: "Agents", icon: Users },
    { id: "managers", label: "Managers", icon: UserCheck },
    { id: "areas", label: "Areas", icon: MapPin },
    { id: "admin", label: "Admin", icon: ShieldCheck },
    { id: "audit", label: "Audit log", icon: FileText },
    { id: "profile", label: "My profile", icon: UserIcon },
  ];

  const navItems =
    currentUser?.role === "Superadmin"
      ? [
          ...baseNavigationItems,
          { id: "system-admin", label: "System Admin", icon: Settings },
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
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium  transition-all ${
                isActive
                  ? "bg-[#660022]/20 text-[#660022] border-l-2 border-[#660022] rounded-l-none"
                  : "text-[#660022] hover:bg-[#660022]/90 hover:text-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-[#660022]" : "text-[#660022]  hover:text-slate-50"}`}
              />
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
