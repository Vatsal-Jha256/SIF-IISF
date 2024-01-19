import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import Logo from "./../img/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <NavLink className="logo" to="/">
          <img src={Logo} alt="" className="logo-icon" />
        </NavLink>

        <div className="nav-elements">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/chatbot">Chat</NavLink>
            </li>
            <li>
              <NavLink to="/login" className="nav-btn">
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
