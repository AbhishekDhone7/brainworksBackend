import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "../LoginPage/Login.css";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setcPassShow] = useState(false);

  const [NameError, setNameError] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const [cpasswordError, setcpasswordError] = useState(false);

  const focusName = useRef(null);
  const focusemail = useRef(null);
  const focusPass = useRef(null);
  const focuscPass = useRef(null);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onBlur1 = (e) => {
    setFormData({ ...formData, name: formData.name.trim() });
    if (formData.name === "") {
      setNameError(true);
      focusName.current.focus();
    } else {
      setNameError(false);
    }
    // console.log(formData.name)
  };
  const onBlur2 = (e) => {
    setFormData({ ...formData, email: formData.email.trim() });
    if (formData.email === "") {
      setEmailError(true);
      focusemail.current.focus();
    } else if (!formData.email.includes("@")) {
      setEmailError(true);
      focusemail.current.focus();
    } else {
      setEmailError(false);
    }
  };
  const onBlur3 = (e) => {
    setFormData({ ...formData, password: formData.password.trim() });
    if (formData.password === "") {
      setPasswordError(true);
      focusPass.current.focus();
    } else if (formData.password.length < 6) {
      setPasswordError(true);
      focusPass.current.focus();
    } else {
      setPasswordError(false);
    }
  };
  const onBlur4 = (e) => {
    if (formData.cpassword === "") {
      setcpasswordError(true);
      focuscPass.current.focus();
    } else if (!(formData.password === formData.cpassword)) {
      setcpasswordError(true);
      focuscPass.current.focus();
    } else {
      setcpasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, formData);
      // console.log(res);
      if (res.data.status === 201) {
        alert("user Registration Done");
        setFormData({
          ...formData,
          name: "",
          email: "",
          password: "",
          cpassword: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section>
      <div className="form_data">
        <div className="form_heading">
          <h1>Student Sign Up</h1>
          <p>
            We are glad that you will be using Book Your Show to manage Your{" "}
            <br /> Booking! We hope that You will like it.
          </p>
        </div>
        <form autoComplete="off">
          <div className="form_input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Your Name"
              onChange={handleChange}
              value={formData.name}
              onBlur={onBlur1}
              ref={focusName}
            />
          </div>
          {NameError && (
            <p style={{ color: "red" }}>Please Enter valid Name.</p>
          )}
          <div className="form_input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email Address"
              onChange={handleChange}
              value={formData.email}
              onBlur={onBlur2}
              ref={focusemail}
            />
          </div>
          {EmailError && (
            <p style={{ color: "red" }}>Please Enter valid Email.</p>
          )}
          <div className="form_input">
            <label htmlFor="password">Password</label>
            <div className="two">
              <input
                type={!passShow ? "password" : "text"}
                name="password"
                id="password"
                placeholder="Enter Your Password"
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
              Please Check Your Password Enter an valid Passward, Passward must
              be at least 6 characters
            </p>
          )}
          <div className="form_input">
            <label htmlFor="cpassword">Confirm Password</label>
            <div className="two">
              <input
                type={!cpassShow ? "password" : "text"}
                name="cpassword"
                id="cpassword"
                placeholder="Please Confirm Your Password"
                onChange={handleChange}
                value={formData.cpassword}
                onBlur={onBlur4}
                ref={focuscPass}
              />
              <div
                className="showpass"
                onClick={() => setcPassShow(!cpassShow)}
              >
                {!cpassShow ? "Show" : "Hide"}
              </div>
            </div>
          </div>
          {cpasswordError && (
            <p style={{ color: "red" }}>
              Please Check Your Password and Confirm Passward.
            </p>
          )}
          <button className="btn" onClick={handleSubmit}>
            Sign Up
          </button>
          <p>
            Alredy have an account? <NavLink to="/">Log in</NavLink>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
