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

  /* ===================================================== */
  /* ALBUMS (API SOURCE – SINGLE SOURCE OF TRUTH) */
  /* ===================================================== */
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/albums")
      .then((res) => res.json())
      .then(setAlbums)
      .catch(console.error);
  }, []);

  /* ===================================================== */
  /* HELPERS */
  /* ===================================================== */
  const shiftClass =
    isPanelOpen ? (isPanelCollapsed ? "shifted-collapsed" : "shifted") : "";

  const handleSeek = (e) => seek(Number(e.target.value));
  const handleVolume = (e) => setVolumeLevel(parseFloat(e.target.value));

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

  /* ===================================================== */
  /* SLIDER SYSTEM */
  /* ===================================================== */
  const CARD_WIDTH = 170;
  const VISIBLE_CARDS = 5;

  const albumRowRef = useRef(null);
  const recentRowRef = useRef(null);

  const [albumIndex, setAlbumIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);

  const slideRow = (ref, indexSetter, index, total, direction) => {
    const maxPage = Math.ceil(total / VISIBLE_CARDS) - 1;
    let next = direction === "right" ? index + 1 : index - 1;
    next = Math.max(0, Math.min(next, maxPage));

    indexSetter(next);

    if (ref.current) {
      ref.current.style.transform = `translateX(-${
        next * CARD_WIDTH * VISIBLE_CARDS
      }px)`;
    }
  };

  const recentSongs =
    recentHistory.length > 0 ? recentHistory : songs.slice(0, 5);

  /* ===================================================== */
  /* RENDER */
  /* ===================================================== */
  return (
    <div className={`mainlayout-wrapper ${shiftClass}`}>
      <div className="mainlayout-container">

        {/* ================= YOUR PLAYLIST ================= */}
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
                <div className="playlist-cover-grid">
                  {getPlaylistCovers(playlist).length ? (
                    getPlaylistCovers(playlist).map((cover, i) => (
                      <div key={i} className="playlist-cover-cell">
                        <img src={cover} alt="" />
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
            {followingUsers.map((user) => (
              <div key={user.id} className="following-item">
                <img src={user.image} className="following-avatar" alt={user.name} />
                <div className="following-name">{user.name}</div>
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
                slideRow(albumRowRef, setAlbumIndex, albumIndex, albums.length, "left")
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
                  tabIndex={0}
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

            <button
              className="scroll-btn right"
              onClick={() =>
                slideRow(albumRowRef, setAlbumIndex, albumIndex, albums.length, "right")
              }
            >
              ▶
            </button>
          </div>
        </div>

        {/* ================= RECENTLY PLAYED ================= */}
        <div className="playlist-section">
          <h2>Recently Played</h2>

          <div className="scroll-wrapper">
            <button
              className="scroll-btn left"
              onClick={() =>
                slideRow(
                  recentRowRef,
                  setRecentIndex,
                  recentIndex,
                  recentSongs.length,
                  "left"
                )
              }
            >
              ◀
            </button>

            <div className="scroll-row" ref={recentRowRef}>
              {recentSongs.map((song, index) => (
                <div
                  key={index}
                  className="mainlayout-card"
                  onClick={() =>
                    playSong(song, { songs: recentSongs }, index)
                  }
                >
                  <img
                    src={getAlbumImage(song) || "https://placehold.co/150x150?text=♫"}
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
                  recentRowRef,
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

        {/* ================= PLAYER BAR ================= */}
        {currentSong && (
          <div className="player-bar">
            <div className="player-left">
              <img
                src={getAlbumImage(currentSong)}
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
