// src/pages/SongPage.jsx
import React from "react";
import "../css/SongPage.css";
import { Play, Pause } from "lucide-react";
import { useMusic } from "../data/Music";

export default function SongPage({ playlistSongs = [] }) {
  const {
    playSong,
    togglePlay,
    songs,
    recentHistory,
    currentSong,
    isPlaying
  } = useMusic();

  /* =====================================================
     PROTECT AGAINST NULL
  ===================================================== */
  if (!currentSong) return <div className="songpage-container" />;

  /* =====================================================
     RECENTLY PLAYED
     - Always newest first
     - Fallback to first 10 songs
  ===================================================== */
  const recentSongs =
    recentHistory.length > 0
      ? [...recentHistory].slice(0, 10)
      : songs.slice(0, 10);

  /* =====================================================
     RIGHT PANEL OPEN
  ===================================================== */
  const openRightPanel = () => {
    if (typeof window.openRightPanel === "function") {
      window.openRightPanel();
    }
  };

  /* =====================================================
     UNIVERSAL PLAY HANDLER
  ===================================================== */
  const handlePlayClick = (selected) => {
    if (!selected) return;

    if (currentSong?.url === selected.url) {
      togglePlay();
    } else {
      playSong(selected);
    }

    openRightPanel();
  };

  /* =====================================================
     CHECK IF SONG IS CURRENT
  ===================================================== */
  const isCurrent = (song) => song?.url === currentSong?.url;

  return (
    <div className="songpage-container">

      {/* =====================
          TOP BANNER
      ====================== */}
      <div className="song-banner large">
        <div className="song-top-row horizontal">
          <div className="song-info">
            <h1 className="song-title">{currentSong.title}</h1>
            <p className="song-artist">{currentSong.artist}</p>
          </div>

          <img
            src={currentSong.cover ?? "/default-cover.png"}
            alt={currentSong.title}
            className="song-cover-right"
          />
        </div>

        <div className="song-banner-actions">
          <div className="left-actions">
            <button className="action-btn">+ Add</button>
            <button className="action-btn">❤ Like</button>
          </div>

          <button
            className={`song-play-btn ${isCurrent(currentSong) && isPlaying ? "playing" : ""}`}
            onClick={() => handlePlayClick(currentSong)}
          >
            {isCurrent(currentSong) ? (
              isPlaying ? <Pause size={26} /> : <Play size={26} />
            ) : (
              <Play size={26} />
            )}
          </button>
        </div>
      </div>

      {/* =====================
          BOTTOM SECTIONS
      ====================== */}
      <div className="banner-bottom">

        {/* ---------------------
            RECENTLY PLAYED
        ---------------------- */}
        <div className="recently-played">
          <h3>Recently Played</h3>

          <div className="recently-list">
            {recentSongs.map((item, i) => (
              <div
                key={i}
                className={`recent-item ${isCurrent(item) ? "active" : ""}`}
                onClick={() => handlePlayClick(item)}
              >
                <img
                  src={item.cover ?? "/default-cover.png"}
                  alt={item.title}
                  className="recent-cover"
                />

                <div className="recent-info">
                  <div className="recent-title">{item.title}</div>
                  <div className="recent-artist">{item.artist}</div>
                </div>

                <div className="recent-icon-area">
                  {isCurrent(item) ? (
                    isPlaying ? <Pause size={18} /> : <Play size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------
            SONG LIST FROM PLAYLIST
        ---------------------- */}
        <div className="banner-right">
          <h3>Songs</h3>

          <div className="song-list">
            {playlistSongs.length === 0 && <p>No songs available.</p>}

            {playlistSongs.map((ps, i) => (
              <div
                key={i}
                className={`song-item ${isCurrent(ps) ? "active" : ""}`}
                onClick={() => handlePlayClick(ps)}
              >
                <span className="track-number">{i + 1}</span>
                <span className="track-title">{ps.title}</span>

                <span className="track-icon">
                  {isCurrent(ps) ? (
                    isPlaying ? <Pause size={18} /> : <Play size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
