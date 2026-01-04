import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return user.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <Outlet />;
}
