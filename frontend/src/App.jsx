import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/useAuthStore';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/auth/PrivateRoute';
import Table from './components/Table';
import Containers from './pages/Containers';
import Users from './pages/Users';


const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
 
function DashboardContent() {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
   if (isCheckingAuth) return <div className="spinner">...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route
            path="containers"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
               <Containers />
              </PrivateRoute>
            }
          />
          <Route index element={<Navigate to="/containers" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth?.();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}