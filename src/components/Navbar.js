import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Globle.css";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuthContext();
  const navigate = useNavigate();


  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-link">Home</NavLink>

      {!isAuthenticated && (
        <>
          <NavLink to="/login" className="nav-link">Login</NavLink>
          <NavLink to="/register" className="nav-link">Register</NavLink>
        </>
      )}

      {isAuthenticated && !isAdmin && (
        <>
          <NavLink to="/student/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/student/upload-payment" className="nav-link">Upload Payment</NavLink>
          <NavLink to="/student/payment-slip" className="nav-link">Payment Slips</NavLink>
          <NavLink to="/student/profile" className="nav-link">Profile</NavLink>
        </>
      )}

      {isAuthenticated && isAdmin && (
        <>
          <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/admin/manage-batches" className="nav-link">Batch Management</NavLink>
          <NavLink to="/admin/manage-students" className="nav-link">Student Management</NavLink>
          <NavLink to="/admin/payments" className="nav-link">Verify Payments</NavLink>
        </>
      )}

      <NavLink to="/about" className="nav-link">About</NavLink>
      <NavLink to="/support" className="nav-link">Support</NavLink>

    </nav>
  );
};

export default Navbar;
