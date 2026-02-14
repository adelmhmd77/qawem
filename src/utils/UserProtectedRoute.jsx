// src/utils/UserProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function UserProtectedRoute() {
  const memberId = localStorage.getItem("memberId");

  // If no memberId → redirect to login
  if (!memberId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}