import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuthContext();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passShow, setPassShow] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);

  const focusemail = useRef(null);
  const focusPass = useRef(null);

  const validateEmail = (email) => email.trim() !== "" && email.includes("@");
  const validatePassword = (password) => password.trim().length >= 6;

  const onBlur2 = () => {
    const email = formData.email.trim();
    setFormData({ ...formData, email });
    setEmailError(!validateEmail(email));
    if (!validateEmail(email)) focusemail.current?.focus();
  };

  const onBlur3 = () => {
    const password = formData.password.trim();
    setFormData({ ...formData, password });
    setPasswordError(!validatePassword(password));
    if (!validatePassword(password)) focusPass.current?.focus();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.user) {
        login(res.data.user, false); // ✅ false = not admin
        setFormData({ email: "", password: "" });
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Login failed. Please check credentials.");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/student/dashboard");
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <section>
      <div className="form_data">
        <div className="form_heading">
          <h1>Welcome to Student Log In</h1>
          <p>Hi, we are glad you're back. Please login.</p>
        </div>

        <form onSubmit={loginUser}>
          <div className="form_input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={onBlur3}
                ref={focusPass}
              />
              <div className="showpass" onClick={() => setPassShow(!passShow)}>
                {passShow ? "Hide" : "Show"}
              </div>
            </div>
          </div>

          {PasswordError && (
            <p style={{ color: "red" }}>
              Password must be at least 6 characters.
            </p>
          )}

          <button type="submit" className="btn">
            Login
          </button>

          <p>
            Don't have an account?{" "}
            <NavLink to="/register">Sign Up</NavLink>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
