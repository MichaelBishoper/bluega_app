import React, { useState, useEffect } from "react";
import {
  Home,
  ListMusic,
  Settings,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../css/SideBar.css";

export default function Sidebar({ playlists, onSelectPlaylist, onToggle }) {
  const [isOpen, setIsOpen] = useState(true);
  const FALLBACK_IMAGE_URL = "/placeholder-cover.png"; // make sure it’s in /public

  // Notify parent whenever sidebar state changes
  useEffect(() => {
    if (onToggle) onToggle(isOpen);
  }, [isOpen, onToggle]);

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* Header + Toggle Button */}
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="menu">
        <ul>
          <li className="menu-item">
            <Home size={18} />
            {isOpen && <span>Home</span>}
          </li>
          <li className="menu-item">
            <ListMusic size={18} />
            {isOpen && <span>Library</span>}
          </li>
          <li className="menu-item">
            <Settings size={18} />
            {isOpen && <span>Settings</span>}
          </li>
        </ul>
      </nav>

      {/* Playlist Section */}
      <section className="playlist-section">
        {isOpen && <h3>Your Playlists</h3>}
        <ul className="playlist-list">
          {playlists.map((p, i) => (
            <li key={i} className="playlist-item" onClick={() => onSelectPlaylist(p)}>
              <img
                src={p.image}
                alt={p.title}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE_URL;
                  e.currentTarget.onError = null;
                }}
              />
              {isOpen && (
                <div className="playlist-info">
                  <span className="playlist-title">{p.title}</span>
                  {p.artist && <span className="playlist-artist">{p.artist}</span>}
                </div>
              )}
              <Play size={14} className="play-icon" />
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      {isOpen && <footer className="footer">© 2025 My Music</footer>}
    </aside>
  );
}
