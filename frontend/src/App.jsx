import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/useAuthStore';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/auth/PrivateRoute';
import Containers from './pages/Containers';
import Staff from './pages/Staff';
import ContainerDetails from './components/ContainerDetails';
import Inventory from './pages/Inventory';


const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function RoleHomeRedirect() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "staff") {
    return <Navigate to="/staff-containers" replace />;
  }

  return <Navigate to="/containers" replace />;
}

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
          <Route path="staff-containers" element={
            <PrivateRoute allowedRoles={["staff"]}>
              <Staff />
            </PrivateRoute>
          } />
          <Route
            path="staff-containers/:id"
            element={
              <PrivateRoute allowedRoles={["staff"]}>
                <ContainerDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="inventory"
            element={
              <PrivateRoute allowedRoles={["staff"]}>
                <Inventory />
              </PrivateRoute>
            }
          />

          <Route index element={<RoleHomeRedirect />} />
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