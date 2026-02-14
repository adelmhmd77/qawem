// src/utils/AdminProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  // If not admin logged in → redirect to admin login
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}