import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "../css/RightPanel.css";

export default function RightPanel({ playlist, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);

  // When playlist changes, open the panel
  useEffect(() => {
    if (playlist) {
      setVisible(true);
      setCollapsed(false);
    }
  }, [playlist]);

  // Hide the panel smoothly
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      // Only call onClose prop after transition if the panel is not visible
      if (onClose) onClose();
    }, 300); // match transition duration
  };

  // Do not render anything if no playlist is present AND the panel is not visible (i.e., transition is complete)
  if (!playlist && !visible) return null;

  return (
    <aside
      className={`right-panel ${visible ? "open" : ""} ${
        collapsed ? "collapsed" : ""
      }`}
    >
      {/* Collapse/Expand button */}
      <button
        className="right-toggle-btn"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Expand panel" : "Collapse panel"}
      >
        {/* Use ChevronRight to show the panel is collapsing to the right, and ChevronLeft to show it's expanding to the left */}
        {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Close button */}
      <button className="close-btn" onClick={handleClose} aria-label="Close panel">
        <X size={18} />
      </button>

      {/* Panel Content - use optional chaining (?.) for playlist properties */}
      <div
        className={`right-panel-content ${collapsed ? "hidden" : ""}`}
        aria-hidden={collapsed}
      >
        <img src={playlist?.image} alt={playlist?.title} className="panel-image" />
        <h2>{playlist?.title}</h2>
        <p><strong>Artist:</strong> {playlist?.artist || "Unknown"}</p>
        <p><strong>Group:</strong> {playlist?.group || "—"}</p>
        <p><strong>Description:</strong> {playlist?.description || "No description available."}</p>
      </div>
    </aside>
  );
}