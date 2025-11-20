// src/components/PlayerBar.jsx
import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Volume2,
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
  } = useMusic();

  const songCover =
    currentSong?.cover ||
    currentSong?.image ||
    "https://placehold.co/45x45/4361ee/ffffff?text=♫";
  const songTitle = currentSong?.title || "No Song Playing";
  const songArtist = currentSong?.artist || "—";

  // Convert seconds → MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // NEW: time left (duration - currentTime)
  const formatTimeLeft = () => {
    if (!duration || isNaN(duration)) return "-0:00";
    const remaining = Math.max(duration - currentTime, 0);
    return `-${formatTime(remaining)}`;
  };

  const handleSeek = (e) => seek(parseFloat(e.target.value));
  const handleVolumeChange = (e) => setVolumeLevel(parseFloat(e.target.value));

  const [isLiked, setIsLiked] = React.useState(false);
  const toggleLike = () => setIsLiked(!isLiked);

  return (
    <div className="player-bar">
      {/* LEFT SECTION — Song Info */}
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

      {/* CENTER SECTION — Controls + Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button className="icon-btn" onClick={prev} disabled={!currentSong}>
            <SkipBack size={20} />
          </button>

          <button
            className="play-btn"
            onClick={togglePlay}
            disabled={!currentSong}
          >
            {isPlaying ? (
              <Pause size={22} fill="#fff" />
            ) : (
              <Play size={22} fill="#fff" />
            )}
          </button>

          <button className="icon-btn" onClick={next} disabled={!currentSong}>
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
            disabled={!currentSong}
          />

          {/* RIGHT SIDE: TIME LEFT */}
          <span className="time-total">{formatTimeLeft()}</span>
        </div>
      </div>

      {/* RIGHT SECTION — Like, Loop, Volume */}
      <div className="player-right">
        <button className="icon-btn" onClick={toggleLike} disabled={!currentSong}>
          <Heart
            size={18}
            fill={isLiked ? "var(--accent-color, #ef4444)" : "none"}
            stroke={isLiked ? "var(--accent-color, #ef4444)" : "currentColor"}
          />
        </button>

        <button
          className="icon-btn"
          onClick={toggleLoop}
          disabled={!currentSong}
        >
          <Repeat
            size={18}
            style={{
              color: isLooping
                ? "var(--primary-color, #1ed760)"
                : "currentColor",
            }}
          />
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
  );
}
