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
    queue,
    removeFromQueue,
    audioRef,
  } = useMusic();

  const [showQueue, setShowQueue] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const toggleQueuePanel = () => setShowQueue((p) => !p);

  /* ================= SAFE DERIVED VALUES ================= */

  const duration = audioRef?.current?.duration || 0;

  const songCover =
    currentSong?.albumCover ||
    currentSong?.cover ||
    "https://placehold.co/45x45/4361ee/ffffff?text=♫";

  const songTitle = currentSong?.title ?? "No Song Playing";

  const songArtist =
    currentSong?.artist ??
    currentSong?.albumArtist ??
    "—";

  /* ================= TIME FORMAT ================= */

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

  /* ================= INTERACTIONS ================= */

  const handleSeek = (e) => {
    const v = Number(e.target.value);
    if (!isNaN(v)) seek(v);
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    if (!isNaN(v)) setVolumeLevel(v);
  };

  /* ================= RENDER ================= */

  return (
    <>
      <div className="player-bar">
        {/* LEFT */}
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

        {/* CENTER */}
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

          <div className="progress-container">
            <span className="time-current">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              className="progress-bar"
              min="0"
              max="100"
              step="0.5"
              value={progress}
              onChange={handleSeek}
            />

            <span className="time-total">
              {formatTimeLeft()}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="player-right">
          <button className="icon-btn" onClick={() => setIsLiked((p) => !p)}>
            <Heart
              size={18}
              fill={isLiked ? "#ef4444" : "none"}
              stroke={isLiked ? "#ef4444" : "currentColor"}
            />
          </button>

          <button className="icon-btn" onClick={toggleLoop}>
            <Repeat
              size={18}
              style={{ color: isLooping ? "#1ed760" : "currentColor" }}
            />
          </button>

          <button className="icon-btn" onClick={toggleQueuePanel}>
            <ListMusic size={20} />
          </button>

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

      {/* QUEUE */}
      <div className={`queue-popup ${showQueue ? "open" : ""}`}>
        <div className="queue-header">
          <h3>Queue</h3>
          <button className="close-btn" onClick={toggleQueuePanel}>
            <X size={22} />
          </button>
        </div>

        <div className="queue-list">
          {!queue?.length && (
            <p className="empty-text">Your queue is empty.</p>
          )}

          {queue?.map((song, i) => (
            <div key={i} className="queue-item">
              <img
                src={song.cover || song.albumCover || "/default-cover.png"}
                className="queue-cover"
                alt={song.title}
              />

              <div className="queue-meta">
                <div className="queue-title">{song.title}</div>
                <div className="queue-artist">{song.artist}</div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromQueue(i)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
