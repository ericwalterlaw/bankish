import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  const token = localStorage.getItem("bankToken");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
