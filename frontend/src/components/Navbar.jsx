import React from "react";
import { FaUser, FaMusic, FaBars, FaSearch } from "react-icons/fa";
import "../css/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <FaMusic className="navbar-icon" />
        <h1 className="navbar-title">Bluega</h1>
      </div>

      {/* Center Section (Search Bar) */}
      <div className="navbar-center">
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search songs, artists..." />
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <div className="profile">
          <FaUser />
          <span>Profile</span>
        </div>
      </div>
    </nav>
  );
}
