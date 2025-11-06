import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Volume2,
} from "lucide-react";
// Corrected import path assuming the CSS file is in the same directory
import "../css/Playerbar.css";

export default function PlayerBar({ current, isPlaying, onToggle }) {
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);

  // Time Calculation Logic
  // Assuming a total song duration of 5 minutes (300 seconds)
  const totalDuration = 300; 
  const currentTimeSec = Math.floor(progress * totalDuration);
  
  // Utility to format seconds into M:SS string
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  // Animate progress bar
  useEffect(() => {
    let id;
    if (isPlaying) {
      id = setInterval(() => {
        // Increment progress. Reset to 0 if it reaches 1.
        setProgress((p) => (p + 0.005 >= 1 ? 0 : p + 0.005));
      }, 400);
    }
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <div className="player-bar">
      {/* LEFT: song info */}
      <div className="player-left">
        {current ? (
          <>
            <img 
              src={current.image} 
              alt={current.title} 
              className="song-cover" 
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/45x45/4361ee/ffffff?text=♫"; }}
            />
            <div className="song-text">
              <h4>{current.title}</h4>
              <p>{current.artist}</p>
            </div>
          </>
        ) : (
          <>
            <img src="https://placehold.co/45x45/4361ee/ffffff?text=♫" alt="no song" className="song-cover" />
            <div className="song-text">
              <h4>Jazz Nights</h4>
              <p>Smooth Ensemble</p>
            </div>
          </>
        )}
      </div>

      {/* CENTER: controls + progress */}
      <div className="player-center">
        <div className="player-controls">
          <SkipBack size={20} className="icon-btn" />
          <button className="play-btn" onClick={onToggle} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={22} fill="#fff" /> : <Play size={22} fill="#fff" />}
          </button>
          <SkipForward size={20} className="icon-btn" />
        </div>

        {/* PROGRESS CONTAINER: Holds time markers and the bar */}
        <div className="progress-container">
          <span className="time-current">{formatTime(currentTimeSec)}</span>
          <input
            type="range"
            className="progress-bar"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            aria-label="Song progress"
            style={{ 
                // Inline style for the progress fill
                background: `linear-gradient(to right, #fff 0%, #fff ${progress * 100}%, rgba(255, 255, 255, 0.3) ${progress * 100}%, rgba(255, 255, 255, 0.3) 100%)`
            }}
          />
          <span className="time-total">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* RIGHT: like + repeat + volume */}
      <div className="player-right">
        <button
          className={`icon-btn ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
          aria-label={liked ? "Unlike song" : "Like song"}
        >
          <Heart size={18} fill={liked ? '#ff5c8a' : 'none'} stroke={liked ? '#ff5c8a' : 'currentColor'} />
        </button>
        <button className="icon-btn" aria-label="Toggle repeat">
          <Repeat size={18} />
        </button>
        <div className="volume-control">
          <Volume2 size={18} />
          <input type="range" className="volume-bar" aria-label="Volume control" />
        </div>
      </div>
    </div>
  );
}
