import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css"; // Optional: for custom styling

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="back-home">Go to Home</Link>
    </div>
  );
};

export default ErrorPage;
