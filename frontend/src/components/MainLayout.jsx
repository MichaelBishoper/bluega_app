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

  //added here
  const albumPlaceholder = {
  id: "add-album",
  title: "Add Album",
  artist: "",
  cover: null,
  isPlaceholder: true,
};

  /* ================================================================
      SLIDER SYSTEM → translateX (NOT scrollBy)
      Each row slides in increments of 5 cards → like Spotify
  ================================================================ */
  const CARD_WIDTH = 170; 
  const VISIBLE_CARDS = 5;

 const albumRowRef = useRef(null);
  const recentRef = useRef(null);

  const [albumPageIndex, setAlbumPageIndex] = useState(0);
  const albums = songs.slice(0, 6); // sementara dari songs ini kalo mau ganti ke album dari sini
  const albumsWithPlaceholder = [...albums, albumPlaceholder];


  const [recentIndex, setRecentIndex] = useState(0);

const slideRecentRow = (direction) => {
  const maxPage =
  Math.ceil(albumsWithPlaceholder.length / VISIBLE_CARDS) - 1;

  let nextPage =
    direction === "right"
      ? recentIndex + 1
      : recentIndex - 1;

  if (nextPage < 0) nextPage = 0;
  if (nextPage > maxPage) nextPage = maxPage;

  setRecentIndex(nextPage);

  const offset = nextPage * CARD_WIDTH * VISIBLE_CARDS;

  if (recentRef.current) {
    recentRef.current.style.transform = `translateX(-${offset}px)`;
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
{/* ROW 3 — ALBUMS */}
{/* ===================================================== */}

<div className="playlist-section">
  <h2>Albums</h2>

  <div className="scroll-wrapper">
    <button
      className="scroll-btn left"
      onClick={() => slideRecentRow("left")}
    >
      ◀
    </button>

    <div className="scroll-row" ref={albumRowRef}>
      {albumsWithPlaceholder.map((album, index) => (
        <div
          key={album.id || index}
          className={`mainlayout-card ${
            album.isPlaceholder ? "add-album" : ""
          }`}
          onClick={() => {
            if (!album.isPlaceholder) onSelectSong(album);
          }}
          tabIndex={0}
        >
          {/* COVER / PLACEHOLDER */}
          {album.isPlaceholder ? (
            <div className="album-placeholder-box">
              <span className="album-plus">+</span>
            </div>
          ) : (
            <img
              src={album.cover}
              alt={album.title}
              className="mainlayout-image"
            />
          )}

          {/* TITLE (DI BAWAH KOTAK) */}
          <p className="mainlayout-title">
            {album.isPlaceholder ? "Add Album" : album.title}
          </p>
        </div>
      ))}
    </div>

    <button
      className="scroll-btn right"
      onClick={() => slideRecentRow("right")}
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
  onClick={() => slideRecentRow("left")}
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
  onClick={() => slideRecentRow("right")}
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