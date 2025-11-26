import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import "../css/Navbar.css";
import { logout } from "../utils/auth";

export default function Navbar({ onLogoClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
    const handleProfileClick = () => {
          navigate("/profile");
  };

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

      {/* Right Section */}
      <div className="navbar-right">
        <button
          className="profile-icon-btn"
          onClick={handleProfileClick}
          aria-label="Profile"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 18,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
            cursor: "pointer"
          }}
        >
          <FaUser />
        </button>

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
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
