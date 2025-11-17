import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "../css/RightPanel.css";
import { useMusic } from "../data/Music";

export default function RightPanel({
  playlist,
  selectedSong,
  onClose,
  panelManuallyClosed,
  isPanelOpen,         // ✅ FIXED: now received from App.js
}) {
  const { currentSong, isPlaying } = useMusic();

  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reopenVisible, setReopenVisible] = useState(false);

  /* ============================================================
     MODE (SONG > PLAYLIST)
  ============================================================ */
  const hasSong = currentSong !== null;
  const hasPlaylist = playlist !== null;

  const mode = hasSong ? "song" : hasPlaylist ? "playlist" : null;

  const data =
    mode === "song"
      ? currentSong
      : mode === "playlist"
      ? playlist
      : null;

  /* ============================================================
     AUTO OPEN WHEN SONG / PLAYLIST CHANGES
  ============================================================ */
  useEffect(() => {
    if (!panelManuallyClosed && data) {
      setVisible(true);
      setCollapsed(false);
      setReopenVisible(false);
    }
  }, [data, panelManuallyClosed]);

  /* ============================================================
     CLOSE ACTION
  ============================================================ */
  const handleClose = () => {
    setVisible(false);

    setTimeout(() => setReopenVisible(true), 300);

    if (onClose) onClose();
  };

  /* ============================================================
     MANUAL REOPEN
  ============================================================ */
  const handleReopen = () => {
    setVisible(true);
    setCollapsed(false);
    setReopenVisible(false);
  };

  /* ============================================================
     PANEL RENDER
  ============================================================ */
  return (
    <>
      {/* Small reopen button */}
      {reopenVisible && (
        <button className="right-panel-reopen-btn" onClick={handleReopen}>
          <ChevronLeft size={20} />
        </button>
      )}

      {data && (
        <aside
          className={`
            right-panel
            ${visible ? "open" : ""}
            ${collapsed ? "collapsed" : ""}
          `}
        >
          {/* Collapse toggle */}
          <button
            className="right-toggle-btn"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Close Button */}
          <button className="close-btn" onClick={handleClose}>
            <X size={16} />
          </button>

          {/* Panel Content */}
          <div className="panel-content">   {/* ✅ FIXED: a clean content wrapper */}
            {mode === "song" && (
              <>
                <img
                  src={data.cover || "/default-cover.jpg"}
                  className="panel-image"
                  alt={data.title}
                />
                <h2 className="panel-title">{data.title}</h2>
                <p className="panel-text">
                  <strong>Artist:</strong> {data.artist || "Unknown"}
                </p>
                <p className="panel-text">
                  <strong>Status:</strong>{" "}
                  {isPlaying ? "Now Playing 🎶" : "Paused ⏸"}
                </p>
              </>
            )}

            {mode === "playlist" && (
              <>
                <img
                  src={data.image}
                  className="panel-image"
                  alt={data.title}
                />
                <h2 className="panel-title">{data.title}</h2>

                <p className="panel-text">
                  <strong>Artist:</strong> {data.artist || "Unknown"}
                </p>

                <p className="panel-text">
                  <strong>Group:</strong> {data.group || "—"}
                </p>

                <p className="panel-text">
                  <strong>Description:</strong>{" "}
                  {data.description || "No description available."}
                </p>
              </>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
