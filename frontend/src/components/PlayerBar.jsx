// src/components/PlayerBar.jsx
import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Volume2,
  ListMusic,
  X,
} from "lucide-react";

import "../css/Playerbar.css";
import { useMusic } from "../data/Music";

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    next,
    prev,
    toggleLoop,
    isLooping,
    volume,
    setVolumeLevel,
    progress,
    seek,
    currentTime,
    duration,
    queue,
    removeFromQueue,
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const toggleQueuePanel = () => setShowQueue((prev) => !prev);

  // fallback cover
  const songCover =
    currentSong?.cover ??
    currentSong?.image ??
    "https://placehold.co/45x45/4361ee/ffffff?text=♫";

  const songTitle = currentSong?.title || "No Song Playing";
  const songArtist = currentSong?.artist || "—";

  // ---------------- TIME FORMAT HELPERS ----------------
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatTimeLeft = () => {
    if (!duration || isNaN(duration)) return "-0:00";
    return `-${formatTime(Math.max(duration - currentTime, 0))}`;
  };

  // ---------------- INTERACTIONS ----------------
  const handleSeek = (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) seek(v);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setVolumeLevel(v);
  };

  return (
    <>
      {/* ================= PLAYER BAR ================= */}
      <div className="player-bar">
        {/* LEFT — Song Info */}
        <div className="player-left">
          <img
            src={songCover}
            alt={songTitle}
            className="song-cover"
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/45x45/4361ee/ffffff?text=♫")
            }
          />

          <div className="song-text">
            <h4>{songTitle}</h4>
            <p>{songArtist}</p>
          </div>
        </div>

        {/* CENTER — Controls */}
        <div className="player-center">
          <div className="player-controls">
            <button className="icon-btn" onClick={prev}>
              <SkipBack size={20} />
            </button>

            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? (
                <Pause size={22} fill="#fff" />
              ) : (
                <Play size={22} fill="#fff" />
              )}
            </button>

            <button className="icon-btn" onClick={next}>
              <SkipForward size={20} />
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="progress-container">
            <span className="time-current">{formatTime(currentTime)}</span>

            <input
              type="range"
              className="progress-bar"
              min="0"
              max="100"
              step="0.5"
              value={progress}
              onChange={handleSeek}
            />

            <span className="time-total">{formatTimeLeft()}</span>
          </div>
        </div>

        {/* RIGHT — Actions */}
        <div className="player-right">
          {/* LIKE */}
          <button className="icon-btn" onClick={() => setIsLiked((p) => !p)}>
            <Heart
              size={18}
              fill={isLiked ? "#ef4444" : "none"}
              stroke={isLiked ? "#ef4444" : "currentColor"}
            />
          </button>

          {/* LOOP */}
          <button className="icon-btn" onClick={toggleLoop}>
            <Repeat
              size={18}
              style={{ color: isLooping ? "#1ed760" : "currentColor" }}
            />
          </button>

          {/* QUEUE BUTTON */}
          <button className="icon-btn" onClick={toggleQueuePanel}>
            <ListMusic size={20} />
          </button>

          {/* VOLUME */}
          <div className="volume-control">
            <Volume2 size={18} />
            <input
              type="range"
              className="volume-bar"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>

      {/* ================= QUEUE PANEL ================= */}
      <div className={`queue-popup ${showQueue ? "open" : ""}`}>
        <div className="queue-header">
          <h3>Queue</h3>
          <button className="close-btn" onClick={toggleQueuePanel}>
            <X size={22} />
          </button>
        </div>

        <div className="queue-list">
          {queue.length === 0 && (
            <p className="empty-text">Your queue is empty.</p>
          )}

          {queue.map((song, i) => (
            <div key={i} className="queue-item">
              <img
                src={song.cover ?? "/default-cover.png"}
                className="queue-cover"
                alt={song.title}
              />

              <div className="queue-meta">
                <div className="queue-title">{song.title}</div>
                <div className="queue-artist">{song.artist}</div>
              </div>

              <button className="remove-btn" onClick={() => removeFromQueue(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
