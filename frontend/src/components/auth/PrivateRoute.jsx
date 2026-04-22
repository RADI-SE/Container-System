import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

export default function PrivateRoute({ children, allowedRoles }) {
 
  const user = useAuthStore((state) => state.user);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
 
  if (isCheckingAuth) return <div>Loading...</div>;
 
  if (!user) return <Navigate to="/login" replace />;
 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}