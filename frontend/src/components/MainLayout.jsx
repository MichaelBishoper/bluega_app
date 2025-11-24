import React, { useRef, useState } from "react";
import "../css/Mainlayout.css";
import "../css/Playerbar.css";
import { useMusic } from "../data/Music";
import { followingUsers } from "../data/Following";

export default function MainLayout({
  playlists = [],
  onSelect,
  onSelectSong,
  isPanelOpen,
  isPanelCollapsed,
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
    recentHistory,
  } = useMusic();

  const shiftClass =
    isPanelOpen ? (isPanelCollapsed ? "shifted-collapsed" : "shifted") : "";

  const handleSeek = (e) => seek(Number(e.target.value));
  const handleVolume = (e) => setVolumeLevel(parseFloat(e.target.value));

  /* ================================================================
      SLIDER SYSTEM → translateX (NOT scrollBy)
      Each row slides in increments of 5 cards → like Spotify
  ================================================================ */
  const CARD_WIDTH = 170; // 150px + padding/gap
  const VISIBLE_CARDS = 5;

  const recommendedRef = useRef(null);
  const recentRef = useRef(null);

  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);

  const slideRow = (ref, indexSetter, index, totalLength, direction) => {
    const maxIndex = Math.ceil(totalLength / VISIBLE_CARDS) - 1;

    let newIndex = index + (direction === "right" ? 1 : -1);

    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;

    indexSetter(newIndex);

    const offset = newIndex * CARD_WIDTH * VISIBLE_CARDS;

    if (ref.current) {
      ref.current.style.transform = `translateX(-${offset}px)`;
    }
  };

  const recentSongs =
    recentHistory.length > 0 ? recentHistory : songs.slice(0, 5);

  return (
    <div className={`mainlayout-wrapper ${shiftClass}`}>
      <div className="mainlayout-container">

        {/* ===================================================== */}
        {/* ROW 1 — YOUR PLAYLIST */}
        {/* ===================================================== */}
        <div className="playlist-section">
          <h2>Your Playlist</h2>

          <div className="mainlayout-grid">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className="mainlayout-card"
                onClick={() => onSelect(playlist)}
                tabIndex={0}
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

        {/* ===================================================== */}
        {/* ROW 2 — FOLLOWING */}
        {/* ===================================================== */}
        <div className="playlist-section">
          <h2>Following</h2>

          <div className="mainlayout-grid">
            {followingUsers.map((user, index) => (
              <div key={index} className="following-item">
                <img
                  src={user.image}
                  className="following-avatar"
                  alt={user.name}
                />
                <div className="following-name">{user.name}</div>
              </div>
            ))}
          </div>
        </div>

{/* ===================================================== */}
{/* ROW 3 — RECOMMENDED (ALL SONGS FIXED + CORRECT SLIDING) */}
{/* ===================================================== */}

<div className="playlist-section">
  <h2>Recommended For You</h2>

  <div className="scroll-wrapper">
    <button
      className="scroll-btn left"
      onClick={() => {
        slideRow(
          recommendedRef,
          setRecommendedIndex,
          recommendedIndex,
          6,             // only 6 recommended songs
          "left"
        );
      }}
    >
      ◀
    </button>

    <div className="scroll-row" ref={recommendedRef}>
      {songs.slice(0, 6).map((song, index) => (
        <div
          key={index}
          className="mainlayout-card"
          onClick={() => onSelectSong(song)}
          tabIndex={0}
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
    </div>

    <button
      className="scroll-btn right"
      onClick={() => {
        slideRow(
          recommendedRef,
          setRecommendedIndex,
          recommendedIndex,
          6,            // only 6 recommended songs
          "right"
        );
      }}
    >
      ▶
    </button>
  </div>
</div>


        {/* ===================================================== */}
        {/* ROW 4 — RECENTLY PLAYED */}
        {/* ===================================================== */}
        <div className="playlist-section">
          <h2>Recently Played</h2>

          <div className="scroll-wrapper">
            <button
              className="scroll-btn left"
              onClick={() =>
                slideRow(
                  recentRef,
                  setRecentIndex,
                  recentIndex,
                  recentSongs.length,
                  "left"
                )
              }
            >
              ◀
            </button>

            <div className="scroll-row" ref={recentRef}>
              {recentSongs.map((song, index) => (
                <div
                  key={index}
                  className="mainlayout-card"
                  onClick={() => playSong(song)}
                  tabIndex={0}
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
            </div>

            <button
              className="scroll-btn right"
              onClick={() =>
                slideRow(
                  recentRef,
                  setRecentIndex,
                  recentIndex,
                  recentSongs.length,
                  "right"
                )
              }
            >
              ▶
            </button>
          </div>
        </div>

        {/* ===================================================== */}
        {/* PLAYER BAR */}
        {/* ===================================================== */}
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
