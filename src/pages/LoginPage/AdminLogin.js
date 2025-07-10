import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useAuthContext } from "../../context/AuthContext";


const AdminLoginPage = () => {
  const { fetchAuth } = useAuthContext(); // ✅ get context
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passShow, setPassShow] = useState(false);

  const [EmailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);

  const focusemail = useRef(null);
  const focusPass = useRef(null);

  const onBlur2 = () => {
    const email = formData.email.trim();
    setFormData({ ...formData, email });
    if (!email || !email.includes("@")) {
      setEmailError(true);
      focusemail.current?.focus();
    } else {
      setEmailError(false);
    }
  };

  const onBlur3 = () => {
    const password = formData.password.trim();
    setFormData({ ...formData, password });
    if (!password || password.length < 6) {
      setPasswordError(true);
      focusPass.current?.focus();
    } else {
      setPasswordError(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/admin_login`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        await fetchAuth("admin"); // ✅ update context after login
        nav("/admin/dashboard");  // ✅ redirect
        setFormData({ email: "", password: "" });
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Admin login failed. Please check credentials.");
    }
  };

  return (
    <section>
      <div className="form_data">
        <div className="form_heading">
          <h1>Welcome Admin Log In</h1>
          <p>Hi, we are glad you’re back. Please log in.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form_input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              onChange={handleChange}
              value={formData.email}
              onBlur={onBlur2}
              ref={focusemail}
            />
            {EmailError && (
              <p style={{ color: "red" }}>Please enter a valid email.</p>
            )}
          </div>

          <div className="form_input">
            <label htmlFor="password">Password</label>
            <div className="two">
              <input
                type={!passShow ? "password" : "text"}
                name="password"
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
                onBlur={onBlur3}
                ref={focusPass}
              />
              <div className="showpass" onClick={() => setPassShow(!passShow)}>
                {!passShow ? "Show" : "Hide"}
              </div>
            </div>
          </div>

          {PasswordError && (
            <p style={{ color: "red" }}>
              Password must be at least 6 characters.
            </p>
          )}

          <button type="submit" className="btn">Login</button>

          <p>
            Don't have an account?{" "}
            <NavLink to="/admin_register">Sign Up</NavLink>
          </p>
        </form>
      </div>
    </section>
  );
};

export default AdminLoginPage;
