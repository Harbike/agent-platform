import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SummaryCards from '../components/reception/SummaryCards';
import DirectoryTable from '../components/reception/DirectoryTable';
import ProfileDrawer from '../components/reception/ProfileDrawer';
import { mockMetrics, mockDirectoryData } from '../data/mockDirectory';
import type { DirectoryRecord } from '../types/directory';
import type { User } from '../types/auth';

interface ReceptionProps {
  currentUser: User;
  onSignOut: () => void;
}

export default function Reception({ currentUser, onSignOut }: ReceptionProps) {
  const [activeTab, setActiveTab] = useState('reception');
  
  const [selectedRecord, setSelectedRecord] = useState<DirectoryRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  

  // Handle Global Search Trigger from Header
  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('reception'); // Switch back to reception/directory view if on another tab

    const lowerQuery = query.toLowerCase();
    
    // Find matching record by name, position, or agent code
    const matchedRecord = mockDirectoryData.find(
      (record) =>
        record.name.toLowerCase().includes(lowerQuery) ||
        record.positionTitle.toLowerCase().includes(lowerQuery) ||
        record.positionCode.toLowerCase().includes(lowerQuery) ||
        record.area.toLowerCase().includes(lowerQuery)
    );

   // Set matching record or clear drawer if no match found
  setSelectedRecord(matchedRecord || null);
  };

  // Filter records if a search query is active
  const filteredRecords = searchQuery
    ? mockDirectoryData.filter(
        (record) =>
          record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.positionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.area.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockDirectoryData;

const handleTabChange = (tab: string) => {
  setSelectedRecord(null); // This automatically closes the drawer!
  setActiveTab(tab);
};

  return (
    
    <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} currentUser={currentUser} />


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSignOut={onSignOut}
          onGlobalSearch={handleGlobalSearch}
          onViewAllNotifications={() => {
            // Optional: Switch to audit log or notifications view if desired
            setActiveTab('audit-log');
          }}
        />

        {/* Dashboard Viewport */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Central Directory Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            
            {/* Interactive Breadcrumb & Page Title */}
            <div className="mb-6">
              <div className="text-xs text-slate-400 mb-1 flex items-center space-x-1.5 font-medium">
                <span>Organisation Directory</span>
    {activeTab !== 'reception' && (
      <>
                <span>/</span>
                <button 
                  onClick={() => setActiveTab('reception')}
                  className="hover:text-[#660022]/70 transition-colors"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-slate-600 capitalize">{activeTab.replace('-', ' ')}</span>
      </>
    )}
  </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'reception' ? 'Reception' : activeTab.replace('-', ' ')}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
               {activeTab === 'reception'
      ? 'Search, locate, and inspect management nodes and staff across the organisation.'
      : `Managing system parameters for ${activeTab.replace('-', ' ')}.`}
  </p>
</div>

            {activeTab === 'reception' ? (
              <>

            {/* Summary Cards */}
            <SummaryCards metrics={mockMetrics} />

            {/* Organisation Directory Table */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Organisation directory {searchQuery && <span className="text-[#660022]/80 font-normal">({filteredRecords.length} results for "{searchQuery}")</span>}
                </h2>
                {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Clear search
                      </button>
                    )}
              </div>
              <DirectoryTable
                records={filteredRecords}
                onSelectRecord=
                {setSelectedRecord}
                    selectedRecordId={selectedRecord?.id}
              />
            </div>
</>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                Module view for <span className="font-semibold text-slate-800">{activeTab}</span> is currently active.
              </div>
            )}
          </main>

          {/* Right Slide-over Profile Drawer (Opened on row click) */}
          {selectedRecord && (
            <ProfileDrawer
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            />
          )}

        </div>

      </div>

    </div>
  );
}