import React, { useState } from "react";
import "./Account.css";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Account() {
  const baseUrl = "https://2ce2-34-168-38-112.ngrok-free.app";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // New state to track whether the user is on the login or register page
  const [isRegister, setIsRegister] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (!/\d/.test(formData.password)) {
      setError("Password must contain at least one numeric digit");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Send the login or register request to the server based on isRegister state
      const endpoint = isRegister ? "/api/register" : "/api/login";
      const response = await axios.post(baseUrl + endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
      });

      // Check the response from the server
      if (response.data.success) {
        setSuccessMessage(
          isRegister ? "Registration Successful!" : "Login Successful!"
        );
        setError(null);
      } else {
        setError(response.data.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while processing your request");
      setSuccessMessage(null);
    }
  };

  const toggleView = () => {
    // Toggle between login and register views
    setIsRegister((prev) => !prev);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="login-container">
      <p className="login-title">{isRegister ? "Register" : "Log In"}</p>
      <p className="login-prompt">
        {isRegister
          ? "Create an account and start conversing with Narad"
          : "Log in and start conversing with Narad"}
      </p>
      <form onSubmit={handleFormSubmit} className="login-form">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-child"
          placeholder="Email ID"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="form-child"
          placeholder="Password"
          required
        />
        <NavLink className="form-check">Forgot Password</NavLink>
        <button type="submit" className="form-btn">
          {isRegister ? "Register" : "Log In"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="login-divider"></div>
      <p className="form-check" onClick={toggleView}>
        {isRegister ? "Already have an account? Log in" : "Create an Account"}
      </p>
    </div>
  );
}

export default Account;
