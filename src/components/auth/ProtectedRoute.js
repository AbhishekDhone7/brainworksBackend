import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated && !isAdmin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
