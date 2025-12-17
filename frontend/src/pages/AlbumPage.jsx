import React, { useRef, useState, useEffect } from "react";
import "../css/Mainlayout.css";
import "../css/Playerbar.css";
import { useMusic } from "../data/Music";
import { followingUsers } from "../data/Following";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  /* =========================
     ALBUMS FROM API
  ========================= */
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("/api/albums")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch(console.error);
  }, []);

  const shiftClass =
    isPanelOpen ? (isPanelCollapsed ? "shifted-collapsed" : "shifted") : "";

  const handleSeek = (e) => seek(Number(e.target.value));
  const handleVolume = (e) => setVolumeLevel(parseFloat(e.target.value));

  /* =========================
     HELPERS
  ========================= */
  const getPlaylistCovers = (playlist) => {
    if (!playlist?.songs?.length) return [];

    return playlist.songs
      .map((s) => s.album?.imgUrl)
      .filter(Boolean)
      .slice(0, 4);
  };

  const getAlbumImage = (song) =>
    song?.album?.imgUrl ||
    song?.albumCover ||
    song?.albumImgUrl ||
    song?.imgUrl ||
    song?.cover ||
    null;

  /* =========================
     SCROLL SYSTEM
  ========================= */
  const CARD_WIDTH = 170;
  const VISIBLE_CARDS = 5;

  const albumRowRef = useRef(null);
  const recentRef = useRef(null);
  const [recentIndex, setRecentIndex] = useState(0);

  const slideRow = (ref, length, index, setIndex, dir) => {
    const maxPage = Math.ceil(length / VISIBLE_CARDS) - 1;
    let next = dir === "right" ? index + 1 : index - 1;
    next = Math.max(0, Math.min(next, maxPage));
    setIndex(next);

    if (ref.current) {
      ref.current.style.transform = `translateX(-${
        next * CARD_WIDTH * VISIBLE_CARDS
      }px)`;
    }
  };

  const recentSongs =
    recentHistory.length > 0 ? recentHistory : songs.slice(0, 5);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className={`mainlayout-wrapper ${shiftClass}`}>
      <div className="mainlayout-container">

        {/* ================= PLAYLISTS ================= */}
        <div className="playlist-section">
          <h2>Your Playlist</h2>
          <div className="mainlayout-grid">
            {playlists.map((playlist, i) => (
              <div
                key={i}
                className="mainlayout-card"
                onClick={() => onSelect(playlist)}
              >
                <div className="playlist-cover-grid">
                  {getPlaylistCovers(playlist).length ? (
                    getPlaylistCovers(playlist).map((c, j) => (
                      <div key={j} className="playlist-cover-cell">
                        <img src={c} alt="" />
                      </div>
                    ))
                  ) : (
                    <div className="playlist-cover-empty">🎵</div>
                  )}
                </div>
                <div className="mainlayout-title">{playlist.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FOLLOWING ================= */}
        <div className="playlist-section">
          <h2>Following</h2>
          <div className="mainlayout-grid">
            {followingUsers.map((u, i) => (
              <div key={i} className="following-item">
                <img src={u.image} className="following-avatar" />
                <div className="following-name">{u.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ALBUMS ================= */}
        <div className="playlist-section">
          <h2>Albums</h2>
          <div className="scroll-wrapper">
            <button
              className="scroll-btn left"
              onClick={() =>
                slideRow(albumRowRef, albums.length, 0, () => {}, "left")
              }
            >
              ◀
            </button>

            <div className="scroll-row" ref={albumRowRef}>
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="mainlayout-card"
                  onClick={() => navigate(`/album/${album.id}`)}
                >
                  <img
                    src={album.imgUrl}
                    alt={album.title}
                    className="mainlayout-image"
                  />
                  <div className="mainlayout-title">{album.title}</div>
                  <div className="mainlayout-artist">{album.artist}</div>
                </div>
              ))}
            </div>

            <button className="scroll-btn right">▶</button>
          </div>
        </div>

        {/* ================= RECENT ================= */}
        <div className="playlist-section">
          <h2>Recently Played</h2>
          <div className="scroll-wrapper">
            <button
              className="scroll-btn left"
              onClick={() =>
                slideRow(
                  recentRef,
                  recentSongs.length,
                  recentIndex,
                  setRecentIndex,
                  "left"
                )
              }
            >
              ◀
            </button>

            <div className="scroll-row" ref={recentRef}>
              {recentSongs.map((song, i) => (
                <div
                  key={i}
                  className="mainlayout-card"
                  onClick={() =>
                    playSong(song, { songs: recentSongs }, i)
                  }
                >
                  <img
                    src={getAlbumImage(song) || "https://placehold.co/150"}
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
                  recentSongs.length,
                  recentIndex,
                  setRecentIndex,
                  "right"
                )
              }
            >
              ▶
            </button>
          </div>
        </div>

        {/* ================= PLAYER ================= */}
        {currentSong && (
          <div className="player-bar">
            <div className="player-left">
              <img src={currentSong.cover} className="song-cover" />
              <div>
                <h4>{currentSong.title}</h4>
                <p>{currentSong.artist}</p>
              </div>
            </div>

            <div className="player-center">
              <button onClick={togglePlay}>
                {isPlaying ? "⏸" : "▶️"}
              </button>
              <input type="range" value={progress} onChange={handleSeek} />
            </div>

            <div className="player-right">
              🔊
              <input
                type="range"
                value={volume}
                step="0.01"
                onChange={handleVolume}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
