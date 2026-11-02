import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuestPortal } from './pages/GuestPortal';
import { AdminPortal } from './pages/AdminPortal';
import { SuperAdminPortal } from './pages/SuperAdminPortal';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Notifications } from './components/layout/Notifications';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#FAFAF8] text-[#1C1917] flex flex-col font-sans">
        {/* Route Engine with RBAC Role Protection */}
        <Routes>
          {/* 1. Public Guest Direct Booking Engine */}
          <Route path="/" element={<GuestPortal />} />
          <Route path="/book" element={<GuestPortal />} />

          {/* 2. Unified Login Gateway */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Protected Hotel Admin PMS Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['HOTEL_ADMIN', 'SUPER_ADMIN']}>
                <AdminPortal />
              </ProtectedRoute>
            }
          />

          {/* 4. Protected SaaS Super Admin Platform */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminPortal />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Notifications */}
        <Notifications />
      </div>
    </HashRouter>
  );
};

export default App;
