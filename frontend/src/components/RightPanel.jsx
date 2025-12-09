import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../css/RightPanel.css";
import { useMusic } from "../data/Music";

export default function RightPanel({
  playlist,
  selectedSong,
  onClose,
  panelManuallyClosed,
  isPanelOpen,
}) {
  const { currentSong, isPlaying } = useMusic();

  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reopenVisible, setReopenVisible] = useState(false);

  const hasSong = currentSong !== null;
  const hasPlaylist = playlist !== null;

  const mode = hasSong ? "song" : hasPlaylist ? "playlist" : null;
  const data =
    mode === "song"
      ? currentSong
      : mode === "playlist"
      ? playlist
      : null;

  /* Sync with parent state */
  useEffect(() => {
    if (isPanelOpen) {
      setVisible(true);
      setCollapsed(false);
      setReopenVisible(false);
    } else {
      setVisible(false);
      setTimeout(() => setReopenVisible(true), 300);
    }
  }, [isPanelOpen]);

  /* Auto open on data change */
  useEffect(() => {
    if (data && !panelManuallyClosed) {
      setVisible(true);
      setCollapsed(false);
      setReopenVisible(false);
    }
  }, [data, panelManuallyClosed]);

  /* Close */
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setReopenVisible(true), 300);
    if (onClose) onClose();
  };

  const handleReopen = () => {
    setVisible(true);
    setCollapsed(false);
    setReopenVisible(false);
  };

  return (
    <>
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
          {/* Collapse Button */}
          <button
            className="right-toggle-btn"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* CLOSE BUTTON (VISIBLE) */}
          <button className="close-btn" onClick={handleClose}>
            X
          </button>

          {/* Click side area close */}
          {!collapsed && (
            <button className="panel-close-area" onClick={handleClose} />
          )}

          <div className="panel-content">
            {mode === "song" && (
              <>
                <img
                  src={data.cover || "/default-cover.jpg"}
                  className="panel-image"
                  alt={data.title}
                />

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

              </>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
