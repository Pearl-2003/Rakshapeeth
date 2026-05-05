import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {


  const token = localStorage.getItem(`${role}Token`);
    console.log("Checking role:", role);
    console.log("Token found:", token);
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      // Token expired
      localStorage.removeItem(`${role}Token`);
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem(`${role}Token`);
    return <Navigate to="/login" replace />;
  }

  return children;
}