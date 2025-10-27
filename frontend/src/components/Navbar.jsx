import React, { useState } from "react";
import { FaHome, FaMusic, FaCog, FaBars, FaTimes, FaSearch, FaUser, FaCloudUploadAlt } from "react-icons/fa";
import "./Navbar.css"; // Import CSS terpisah

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎵 MyMusic</div>

\

      <div className="navbar-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search songs, artists..." />
        </div>
      </div>

      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

            <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        <a href="#"><FaHome /> Home</a>
        <a href="#"><FaMusic /> Playlists</a>
        <a href="#"><FaCog /> Settings</a>
        <a href="#"><FaUser /> Profile</a>
        <a href="#"><FaCloudUploadAlt /> Upload</a>
      </div>
    </nav>
  );
};

export default Navbar;
