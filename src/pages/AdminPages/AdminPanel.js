import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext"; // ✅ use context instead of hook
import Spinner from "../../components/Spinner/Spinner";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { loading, user, isAuthenticated, isAdmin } = useAuthContext();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate("/"); // Redirect if not an admin
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  if (loading) return <Spinner /> ;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: Admin</p>
    </div>
  );
};

export default AdminPanel;
