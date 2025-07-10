import React, { useState } from "react";
import "./header.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const HeaderDiv = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      if (isAdmin) {
        await axios.get(`${process.env.REACT_APP_API_URL}/admin/logout`, {
          withCredentials: true,
        });
        logout();
        navigate("/admin_login");
      } else if (isAuthenticated) {
        await axios.get(`${process.env.REACT_APP_API_URL}/users/logout`, {
          withCredentials: true,
        });
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="headerDiv">
        <img src="/BWlogo.png" alt="Logo" />
        <div className="header_right">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/support" className="nav-link">
            Support
          </NavLink>
          {!isAuthenticated ? (
            <NavLink to="/login" className="nav-link login-tab">
              Login
            </NavLink>
          ) : (
            <span
              onClick={handleLogout}
              className="nav-link logout-tab"
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          )}
          {isAuthenticated && (
            <div className="hamburgerIcon" onClick={toggleSidebar}>
              &#9776;
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Code Below (in Header) */}
      <div className={`sidebar right ${sidebarOpen ? "open" : ""}`}>
        <ul>
          {isAuthenticated && !isAdmin && (
            <>
              <li>
                <NavLink
                  to="/student/dashboard"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/student/upload-payment"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Upload Payment
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/student/payment-slip"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Payment Slips
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/student/profile"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Profile
                </NavLink>
              </li>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/manage-batches"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Batch Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/manage-students"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Student Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/payments"
                  className="nav-link"
                  onClick={toggleSidebar}
                >
                  Verify Payments
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default HeaderDiv;
