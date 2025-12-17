import React from "react";
import { FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import { logout } from "../utils/auth";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onLogoClick,
}) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
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

      {/* CENTER */}
      <div className="navbar-center">
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users, albums, playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <button
          className="profile-icon-btn"
          onClick={handleProfileClick}
          aria-label="Profile"
        >
          <FaUser />
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
