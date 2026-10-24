import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, CheckCircle2, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import type { User as UserType } from '../../types/auth';

interface HeaderProps {
  currentUser: UserType;
  onSignOut: () => void;
  onGlobalSearch?: (query: string) => void;
  onViewAllNotifications?: () => void;
}

export default function Header({ currentUser, onSignOut, onGlobalSearch, onViewAllNotifications }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notification state management (Mock Notifications)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Agent Onboarded in Lagos', time: '10m ago', unread: true, category: 'Agent' },
    { id: 2, title: 'Vacancy Filled: Area Manager (Abuja)', time: '1h ago', unread: true, category: 'Hierarchy' },
    { id: 3, title: 'System Audit Log Exported successfully', time: '3h ago', unread: false, category: 'System' },
    { id: 4, title: 'Role permission updated for Regional Managers', time: '5h ago', unread: false, category: 'Security' },
  ]);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGlobalSearch && searchValue.trim()) {
      onGlobalSearch(searchValue.trim());
setSearchValue('');
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

 const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 bg-[#ecdfe3] border-b border-[#660022]/30 px-6 flex items-center justify-between font-sans text-white sticky top-0 z-30 shrink-0 shadow-xs">
      
      {/* Search Input (Global Directory Search) */}
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#660022]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search name, agent code, or position..."
            className="w-full bg-white/90 border border-[#660022]/60 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#660022]/40 transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 bg-[#8d002f] hover:bg-[#660022] text-white text-xs font-medium rounded-lg transition-colors shadow-xs shrink-0"
        >
          Search
        </button>
      </form>

      {/* Right Navigation & Profile Area */}
      <div className="flex items-center space-x-4 relative" ref={menuRef}>
        
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsUserMenuOpen(false);
            }}
            className="relative p-2 text-[#660022]/70  rounded-full hover:bg-[#660022]/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8d002f]"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#660022]/80 rounded-xl shadow-2xl py-2 z-50 text-xs text-[#660022]">
              <div className="px-4 py-2.5 border-b border-[#660022] font-semibold text-[#660022] flex justify-between items-center">
                <div className="flex items-center space-x-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                <span className="text-[10px] bg-[#660022] text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>
                )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#8d002f] hover:underline flex items-center space-x-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#660022] max-h-60 overflow-y-auto">
{notifications.length === 0 ? (
  <div className="p-6 text-center text-slate-400">
                    <Inbox className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-3 hover:bg-[#660022]/5 transition-colors cursor-pointer flex items-start space-x-2.5 ${n.unread ? 'bg-[#660022]/2' : ''}`}
                      onClick={() => {
                        setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                      }}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-[#8d002f]' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-[#660022] leading-snug">{n.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>{n.time}</span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px]">{n.category}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50 rounded-b-xl">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if (onViewAllNotifications) onViewAllNotifications();
                  }}
                  className="w-full py-1.5 text-xs font-medium text-[#8d002f] hover:underline flex items-center justify-center space-x-1"
                >
                  <span>View all notifications history</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Identity & Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center space-x-3 p-1.5 rounded-lg  text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt={`${currentUser.first_name} ${currentUser.last_name}`}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#660022]/20"
            />
            <div className="text-xs">
              <div className="font-medium text-[#660022]/80 flex items-center space-x-1">
                <span>{currentUser.first_name} {currentUser.last_name}</span>
                <ChevronDown className="w-3 h-3 text-[#660022]/70 ml-1" />
              </div>
              <div className="text-[10px] text-[#660022]/50">{currentUser.role}</div>
            </div>
          </button>

          {/* Clean User Settings Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#660022] rounded-xl shadow-2xl p-2 z-50 text-xs text-[#660022]">
              
              {/* Profile Summary Header */}
              <div className="p-3 bg-[#660022f3] rounded-lg border  mb-1 text-white">
                <div className="font-semibold">
                  {currentUser.first_name} {currentUser.last_name}
                </div>
                <div className="text-[11px] text-white/70 truncate mt-0.5">{currentUser.email}</div>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-white/90 text-[#660022] text-[10px] font-medium border border-blue-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {currentUser.role}
                </div>
              </div>

              {/* Action Links */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  /* Navigate to profile tab if needed */
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-[#660022] hover:bg-[#660022]/20 rounded-lg transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-[#660022]" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setIsUserMenuOpen(false)}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-[#660022] hover:bg-[#660022]/20 rounded-lg transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5 text-[#660022]" />
                <span>Account Settings</span>
              </button>

              <div className="border-t border-[#660022] my-1"></div>

              {/* Sign Out */}
              <button
                onClick={onSignOut}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-red-700 hover:bg-[#660022]/20 rounded-lg transition-colors text-left font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-red-700" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}