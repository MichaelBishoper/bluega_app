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
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  playlists = [],
  onSelectPlaylist = () => {},
  onDeletePlaylist,
  onCreatePlaylist = () => {},
  isOpen: externalOpen,
  setIsOpen: externalSetOpen,
}) {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(externalOpen ?? true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sidebarRef = useRef(null);
  const startX = useRef(null);
  const currentX = useRef(null);
  const dragging = useRef(false);

  // sync external state
  useEffect(() => {
    if (externalOpen !== undefined) setIsSidebarOpen(externalOpen);
  }, [externalOpen]);

  useEffect(() => {
    if (externalSetOpen) externalSetOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  // resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // TOUCH HANDLERS
  const onTouchStart = (e) => {
    if (!isMobile) return;

    const x = e.touches[0].clientX;
    startX.current = x;
    currentX.current = x;

    const sidebarWidth = 250;

    if ((!isSidebarOpen && x < 20) || (isSidebarOpen && x < sidebarWidth)) {
      dragging.current = true;
      sidebarRef.current.style.transition = "none";
    }
  };

  const onTouchMove = (e) => {
    if (!dragging.current) return;

    const x = e.touches[0].clientX;
    currentX.current = x;
    const diff = x - startX.current;
    const sidebarWidth = 250;

    if (!sidebarRef.current) return;

    if (!isSidebarOpen) {
      sidebarRef.current.style.transform = `translateX(${Math.min(
        0,
        -sidebarWidth + diff
      )}px)`;
    } else {
      sidebarRef.current.style.transform = `translateX(${Math.max(0, diff)}px)`;
    }
  };

  const onTouchEnd = () => {
    if (!dragging.current) return;

    const diff = currentX.current - startX.current;

    if (!isSidebarOpen && diff > 80) setIsSidebarOpen(true);
    else if (isSidebarOpen && diff < -80) setIsSidebarOpen(false);

    sidebarRef.current.style.transition = "";
    sidebarRef.current.style.transform = "";
    dragging.current = false;
  };

  const FALLBACK_IMAGE_URL = "/placeholder-cover.png";

  // MENU
  const menuItems = [
    {
      icon: <Disc size={20} />,
      label: "Album",
      action: () => navigate("/albums"),
    },
    {
      icon: <Heart size={20} />,
      label: "Liked Music",
    },
    {
      icon: <PlusSquare size={20} />,
      label: "New Playlist",
      action: onCreatePlaylist,
    },
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
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="menu-item"
              onClick={item.action}
              style={{ cursor: item.action ? "pointer" : "default" }}
            >
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
            playlists.map((p) => (
              <li
                key={p.id}
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
                  </div>
                )}

                <Play size={14} className="play-icon" />

                {isSidebarOpen && (
                  <button
                    className="delete-playlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlaylist(p.id);
                    }}
                  >
                    ❌
                  </button>
                )}
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
