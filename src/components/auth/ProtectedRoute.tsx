import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePmsStore } from '../../store/usePmsStore';
import { UserRole } from '../../types/hotel';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, addToast } = usePmsStore();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      addToast(
        'Authentication Required',
        `Restricted access to ${location.pathname}. Please sign in with your staff or partner credentials.`,
        'warning'
      );
    } else if (!allowedRoles.includes(currentUser.role)) {
      addToast(
        'Access Denied (RBAC Protected)',
        `Your account role (${currentUser.role}) does not have permission to access ${location.pathname}.`,
        'error'
      );
    }
  }, [currentUser, allowedRoles, location.pathname, addToast]);

  if (!currentUser) {
    // Redirect unauthenticated user to login with return target
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect user lacking permissions to their appropriate home
    if (currentUser.role === 'SUPER_ADMIN') {
      return <Navigate to="/superadmin" replace />;
    } else if (currentUser.role === 'HOTEL_ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

