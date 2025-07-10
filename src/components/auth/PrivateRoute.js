import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
