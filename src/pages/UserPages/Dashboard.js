import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import "./Dashbord.css";
import Spinner from "../../components/Spinner/Spinner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, user, isAuthenticated, isAdmin } = useAuthContext();



  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/"); // Redirect to login page if not authenticated
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {isAdmin ? "Admin" : "Student"}</p>
      </div>
    </div>
  );
};

export default Dashboard;
