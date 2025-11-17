import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";
import "../css/Navbar.css";
import { logout } from "../utils/auth";

export default function Navbar({ onLogoClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div
        className="navbar-left"
        onClick={onLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/picture/bluga.png"
          alt="Bluega Logo"
          className="navbar-logo"
        />
        <h1 className="navbar-title">Bluega</h1>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search songs, artists..." />
        </div>
      </div>

      {/* Right Section → jadi logout */}
      <div className="navbar-right">
    <button
      className="logout-btn"
      onClick={logout}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "16px"
      }}
    >
          <FaUser />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
