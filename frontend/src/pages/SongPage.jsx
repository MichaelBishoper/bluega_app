import React, { useEffect, useRef, useState } from "react";
import "../css/SongPage.css";
import { Play, Pause, ListPlus } from "lucide-react";
import { useMusic } from "../data/Music";

export default function SongPage({ playlistSongs = [], openPanel }) {
  const {
    playSong,
    togglePlay,
    songs,
    recentHistory,
    currentSong,
    isPlaying,
    playlists,
    addSongToPlaylist,
    addToQueue,
  } = useMusic();

  const [showAddModal, setShowAddModal] = useState(false);
  const popupRef = useRef(null);
  const addBtnRef = useRef(null);

  const [localToast, setLocalToast] = useState("");

  const triggerLocalToast = (text) => {
    setLocalToast(text);
    setTimeout(() => setLocalToast(""), 2000);
  };

  // Recent Songs fallback
  const recentSongs =
    recentHistory.length > 0
      ? [...recentHistory].slice(0, 10)
      : songs.slice(0, 10);

  // Safe current check
  const isCurrent = (song) =>
    song && currentSong && song.url === currentSong.url;

  // Song must be played at least once before adding
  const hasPlayed =
    currentSong &&
    recentHistory.some((s) => s.id === currentSong.id);

  const openRightPanel = () => {
    if (typeof openPanel === "function") openPanel();
  };

  const handlePlayClick = (song) => {
    if (!song) return;

    if (isCurrent(song)) {
      togglePlay();
    } else {
      playSong(song);
    }

    openRightPanel();
  };

  // Close modal on outside / escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        addBtnRef.current &&
        !addBtnRef.current.contains(e.target)
      ) {
        setShowAddModal(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === "Escape") setShowAddModal(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Safeguard return
  if (!currentSong) {
    return <div className="songpage-container" />;
  }

  return (
    <div className="songpage-container">
      {/* BANNER */}
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

            {/* Add to Playlist */}
            <button
              ref={addBtnRef}
              className="action-btn"
              onClick={() => setShowAddModal((s) => !s)}
            >
              + Add
            </button>

            {/* Like */}
            <button className="action-btn">❤ Like</button>

            {/* Add to Queue */}
            <button
              className="action-btn"
              onClick={() => {
                addToQueue(currentSong);
                triggerLocalToast("Added to queue");
              }}
              title="Add to queue"
            >
              <ListPlus size={20} />
            </button>
          </div>

          {/* Play Button */}
          <button
            className={`song-play-btn ${
              isCurrent(currentSong) && isPlaying ? "playing" : ""
            }`}
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

      {/* ADD TO PLAYLIST POPUP */}
      {showAddModal && (
        <div className="add-popup-wrapper">
          <div className="add-popup" ref={popupRef}>
            <div className="add-popup-header">
              <strong>Add to playlist</strong>
              <div className="add-popup-sub">
                {hasPlayed ? (
                  <small>Choose playlist</small>
                ) : (
                  <small className="not-played-note">
                    You must play the song once before adding
                  </small>
                )}
              </div>
            </div>

            <div className="add-popup-list">
              {playlists.map((pl) => {
                const already = pl.songs?.some(
                  (s) => s.id === currentSong.id
                );

                return (
                  <div
                    key={pl.id}
                    className={`add-popup-item ${
                      already ? "already" : ""
                    } ${!hasPlayed ? "disabled" : ""}`}
                    onClick={() => {
                      if (!hasPlayed) return;
                      if (already) {
                        setShowAddModal(false);
                        return;
                      }
                      addSongToPlaylist(pl.id, currentSong.id);
                      setShowAddModal(false);
                    }}
                  >
                    <img
                      src={pl.image ?? "/picture/default_playlist.png"}
                      alt={pl.title}
                      className="add-popup-img"
                    />
                    <div className="add-popup-meta">
                      <div className="add-popup-title">{pl.title}</div>
                      <div className="add-popup-desc">
                        {already ? "Already in playlist" : pl.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="add-popup-close"
              onClick={() => setShowAddModal(false)}
            >
              Close
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SECTION */}
      <div className="banner-bottom">

        {/* Recently Played */}
        <div className="recently-played">
          <h3>Recently Played</h3>
          <div className="recently-list">
            {recentSongs.map((item, i) => (
              <div
                key={i}
                className={`recent-item ${
                  isCurrent(item) ? "active" : ""
                }`}
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

        {/* Playlist Songs */}
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

      {/* Toast */}
      {localToast && <div className="toast-popup">{localToast}</div>}
    </div>
  );
}
