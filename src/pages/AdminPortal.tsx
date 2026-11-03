import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePmsStore } from '../store/usePmsStore';
import { TapeChart } from '../components/tape-chart/TapeChart';
import { FrontDeskManager } from '../components/check-in/FrontDeskManager';
import { PosManager } from '../components/pos/PosManager';
import { ChannelSimulationCenter } from '../components/channel-manager/ChannelSimulationCenter';
import { HousekeepingManager } from '../components/housekeeping/HousekeepingManager';
import { GuestCrmManager } from '../components/crm/GuestCrmManager';
import { NightAuditAndReports } from '../components/reports/NightAuditAndReports';
import { ExecutiveAnalytics } from '../components/analytics/ExecutiveAnalytics';
import { GuestFolioModal } from '../components/folio/GuestFolioModal';
import { Navbar } from '../components/layout/Navbar';
import { AppSidebar } from '../components/layout/AppSidebar';
import { SqliteManagerModal } from '../components/database/SqliteManagerModal';

export const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    reservations, 
    checkDatabaseStatus, 
    syncWithSqliteBackend 
  } = usePmsStore();

  const [activeTab, setActiveTab] = useState<string>('tape-chart');
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  useEffect(() => {
    // Initial health check and sync with local SQLite server
    checkDatabaseStatus();
    syncWithSqliteBackend();
  }, []);

  const pendingCheckIns = reservations.filter((r) => r.status === 'Confirmed').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAFAF8] text-[#1C1917] font-sans select-none">
      {/* 1. Persistent Responsive Navbar */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* 2. Main Layout Body with Responsive Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCheckIns={pendingCheckIns}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onOpenBookingEngine={() => navigate('/book')}
          onOpenDbModal={() => setShowDbModal(true)}
        />

        {/* 3. Main Operational Viewport */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FAFAF8]">
          {activeTab === 'tape-chart' && (
            <TapeChart onSelectReservation={(resId) => setSelectedReservationId(resId)} />
          )}

          {activeTab === 'front-desk' && (
            <FrontDeskManager onOpenFolio={(resId) => setSelectedReservationId(resId)} />
          )}

          {activeTab === 'pos' && (
            <PosManager />
          )}

          {activeTab === 'channel-manager' && (
            <ChannelSimulationCenter />
          )}

          {activeTab === 'housekeeping' && (
            <HousekeepingManager />
          )}

          {activeTab === 'crm' && (
            <GuestCrmManager />
          )}

          {activeTab === 'reports' && (
            <NightAuditAndReports />
          )}

          {activeTab === 'kpi' && (
            <ExecutiveAnalytics />
          )}
        </main>
      </div>

      {/* Global Interactive Guest Folio & Settlement Modal */}
      {selectedReservationId && (
        <GuestFolioModal
          reservationId={selectedReservationId}
          onClose={() => setSelectedReservationId(null)}
        />
      )}

      {/* SQLite Database Manager Modal */}
      {showDbModal && <SqliteManagerModal onClose={() => setShowDbModal(false)} />}
    </div>
  );
};
