import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();

  // ❌ Not logged in → go to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed → go to dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Access granted
  return children;
}