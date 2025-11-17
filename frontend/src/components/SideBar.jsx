import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Heart,
  PlusSquare,
  Disc,
  Play,
  ChevronLeft,
} from "lucide-react";
import "../css/SideBar.css";

export default function Sidebar({
  playlists = [],
  onSelectPlaylist = () => {},

  isOpen: externalOpen,
  setIsOpen: externalSetOpen,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(externalOpen ?? true);

  useEffect(() => {
    if (externalOpen !== undefined) setIsSidebarOpen(externalOpen);
  }, [externalOpen]);

  useEffect(() => {
    if (externalSetOpen) externalSetOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sidebarRef = useRef(null);
  const startX = useRef(null);
  const currentX = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ============================
  // TOUCH START
  // ============================
  const onTouchStart = (e) => {
    if (!isMobile) return;

    const x = e.touches[0].clientX;
    startX.current = x;
    currentX.current = x;

    const sidebarWidth = 250;

    if (!isSidebarOpen && x < 20) {
      dragging.current = true;
    } else if (isSidebarOpen && x < sidebarWidth) {
      dragging.current = true;
    }

    if (dragging.current && sidebarRef.current) {
      sidebarRef.current.style.transition = "none"; // stop smooth animation while dragging
    }
  };

  // ============================
  // TOUCH MOVE
  // ============================
  const onTouchMove = (e) => {
    if (!dragging.current) return;

    const x = e.touches[0].clientX;
    currentX.current = x;
    const diff = x - startX.current;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const sidebarWidth = 250;

    if (!isSidebarOpen) {
      const translate = Math.min(0, -sidebarWidth + diff);
      sidebar.style.transform = `translateX(${translate}px)`;
    }

    if (isSidebarOpen) {
      const translate = Math.max(0, diff);
      sidebar.style.transform = `translateX(${translate}px)`;
    }
  };

  // ============================
  // TOUCH END
  // ============================
  const onTouchEnd = () => {
    if (!dragging.current) return;

    const diff = (currentX.current ?? 0) - (startX.current ?? 0);

    if (!isSidebarOpen && diff > 80) setIsSidebarOpen(true);
    else if (isSidebarOpen && diff < -80) setIsSidebarOpen(false);

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.style.transition = ""; // restore CSS transitions
      sidebar.style.transform = ""; // reset so CSS handles state
    }

    dragging.current = false;
  };

  const FALLBACK_IMAGE_URL = "/placeholder-cover.png";

  const menuItems = [
    { icon: <Disc size={20} />, label: "Album" },
    { icon: <Heart size={20} />, label: "Liked Music" },
    { icon: <PlusSquare size={20} />, label: "Add Playlist" },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="menu">
        <ul>
          {menuItems.map((item, i) => (
            <li key={i} className="menu-item">
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </li>
          ))}
        </ul>
      </nav>

      <section className="playlist-section">
        {isSidebarOpen && <h3>Your Playlists</h3>}
        <ul className="playlist-list">
          {playlists.length > 0 ? (
            playlists.map((p, i) => (
              <li
                key={i}
                className="playlist-item"
                onClick={() => onSelectPlaylist(p)}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE_URL;
                  }}
                />
                {isSidebarOpen && (
                  <div className="playlist-info">
                    <span className="playlist-title">{p.title}</span>
                    {!!p.artist && (
                      <span className="playlist-artist">{p.artist}</span>
                    )}
                  </div>
                )}
                <Play size={14} className="play-icon" />
              </li>
            ))
          ) : (
            <li className="no-playlist">
              {isSidebarOpen ? "No playlists yet" : ""}
            </li>
          )}
        </ul>
      </section>
    </aside>
  );
}
