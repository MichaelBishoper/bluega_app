import React from "react";
import "../css/Mainlayout.css";
import "../css/Playerbar.css";
import { useMusic } from "../data/Music";

export default function MainLayout({
  playlists = [],
  onSelect,
  onSelectSong,
  isPanelOpen,         // <-- ⭐ ADDED
  isPanelCollapsed,    // <-- ⭐ ADDED
}) {
  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    progress,
    seek,
    volume,
    setVolumeLevel,
    songs,
  } = useMusic();

  /* ======================================================
        LAYOUT SHIFT CLASS (right panel push)
     ====================================================== */
  const shiftClass =
    isPanelOpen
      ? isPanelCollapsed
        ? "shifted-collapsed"
        : "shifted"
      : "";

  const handleSeek = (e) => seek(Number(e.target.value));
  const handleVolume = (e) => setVolumeLevel(parseFloat(e.target.value));

  return (
    <div className={`mainlayout-wrapper ${shiftClass}`}>
      <div className="mainlayout-container">

        {/* ============================
            ROW 1 — YOUR PLAYLIST
           ============================ */}
        <div className="playlist-section">
          <h2>Your Playlist</h2>
          <div className="mainlayout-grid">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className="mainlayout-card"
                onClick={() => onSelect(playlist)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelect(playlist)}
              >
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="mainlayout-image"
                />
                <div className="mainlayout-title">{playlist.title}</div>
                <div className="mainlayout-artist">{playlist.artist}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================
            ROW 2 — RECENTLY PLAYED
           ============================ */}
        <div className="playlist-section">
          <h2>Recently Played</h2>

          <div className="mainlayout-grid">
            {songs.slice(0, 5).map((song, index) => (
              <div
                key={index}
                className="mainlayout-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectSong(song)}
              >
                <img
                  src={song.cover}
                  alt={song.title}
                  className="mainlayout-image"
                />
                <div className="mainlayout-title">{song.title}</div>
                <div className="mainlayout-artist">{song.artist}</div>
              </div>
            ))}

            {Array(Math.max(0, 5 - songs.length))
              .fill(null)
              .map((_, index) => (
                <div key={index} className="mainlayout-placeholder">+</div>
              ))}
          </div>
        </div>

        {/* ============================
            ROW 3 — RECOMMENDED
           ============================ */}
        <div className="playlist-section">
          <h2>Recommended for You</h2>
          <div className="mainlayout-grid">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="mainlayout-placeholder">+</div>
              ))}
          </div>
        </div>

        {/* ============================
            PLAYER BAR
           ============================ */}
        {currentSong && (
          <div className="player-bar">
            <div className="player-left">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="song-cover"
              />
              <div className="song-text">
                <h4>{currentSong.title}</h4>
                <p>{currentSong.artist}</p>
              </div>
            </div>

            <div className="player-center">
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶️"}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="progress-bar"
              />
            </div>

            <div className="player-right">
              🔊
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="volume-bar"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
