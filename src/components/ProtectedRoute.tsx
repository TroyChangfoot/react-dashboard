import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute() {
  const authed = isAuthenticated();

  return authed ? <Outlet /> : <Navigate to="/login" replace />;
}
