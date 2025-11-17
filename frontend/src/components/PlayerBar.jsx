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
  // ✅ Pull functions and states from updated MusicContext
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
  } = useMusic();

  // ✅ Fallback cover and details if no song playing
  const songCover =
    currentSong?.cover ||
    currentSong?.image ||
    "https://placehold.co/45x45/4361ee/ffffff?text=♫";
  const songTitle = currentSong?.title || "No Song Playing";
  const songArtist = currentSong?.artist || "—";

  // ✅ Convert progress (0–100) to seconds display
  const formatTime = (ratio) => {
    if (!ratio || isNaN(ratio)) return "0:00";
    const minutes = Math.floor(ratio / 60);
    const seconds = Math.floor(ratio % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // ✅ Handle progress bar seek
  const handleSeek = (e) => {
    seek(parseFloat(e.target.value));
  };

  // ✅ Handle volume changes
  const handleVolumeChange = (e) => {
    setVolumeLevel(parseFloat(e.target.value));
  };

  // Mock like state for UI (not implemented in context yet)
  const [isLiked, setIsLiked] = React.useState(false);
  const toggleLike = () => setIsLiked(!isLiked);

  return (
    <div className="player-bar">
      {/* LEFT: Song Info */}
      <div className="player-left">
        <img
          src={songCover}
          alt={songTitle}
          className="song-cover"
          onError={(e) =>
            (e.target.src = "https://placehold.co/45x45/4361ee/ffffff?text=♫")
          }
        />
        <div className="song-text">
          <h4>{songTitle}</h4>
          <p>{songArtist}</p>
        </div>
      </div>

      {/* CENTER: Controls + Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className="icon-btn"
            onClick={prev}
            disabled={!currentSong}
            aria-label="Previous Song"
          >
            <SkipBack size={20} />
          </button>

          <button
            className="play-btn"
            onClick={togglePlay}
            disabled={!currentSong}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={22} fill="#fff" />
            ) : (
              <Play size={22} fill="#fff" />
            )}
          </button>

          <button
            className="icon-btn"
            onClick={next}
            disabled={!currentSong}
            aria-label="Next Song"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-container">
          {/* we don’t have duration/time tracking yet in context, so show 0:00 */}
          <span className="time-current">{formatTime(0)}</span>
          <input
            type="range"
            className="progress-bar"
            min="0"
            max="100"
            step="0.5"
            value={progress}
            onChange={handleSeek}
            disabled={!currentSong}
            aria-label="Seek track position"
          />
          <span className="time-total">{formatTime(0)}</span>
        </div>
      </div>

      {/* RIGHT: Volume & Extras */}
      <div className="player-right">
        <button
          className="icon-btn"
          onClick={toggleLike}
          disabled={!currentSong}
          aria-label={isLiked ? "Unlike Song" : "Like Song"}
        >
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
          aria-label={isLooping ? "Disable Repeat" : "Enable Repeat"}
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
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  );
}
