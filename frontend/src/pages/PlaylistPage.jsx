import React, { useState, useEffect } from "react";
import "../css/PlaylistPage.css";
import { useMusic } from "../data/Music";

export default function PlaylistPage({
  playlist,
  onBack,
  onSelectSong,
  onAddSong,
  onRemoveSong,
  updatePlaylistName,
}) {
  // 🔥 GLOBAL MUSIC STATE (SATU SUMBER KEBENARAN)
  const {
    playSong,
    togglePlay,
    currentSong,
    isPlaying,
  } = useMusic();

  // LOCAL UI STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  // Sync title when playlist changes
  useEffect(() => {
    if (playlist) {
      setEditedName(playlist.title);
    }
  }, [playlist]);

  if (!playlist) {
    return <div className="playlistPage-container">Loading playlist...</div>;
  }

  const songs = playlist.songs || [];

  // Check current song
  const isCurrent = (song) =>
    song && currentSong && song.id === currentSong.id;

  // ▶️ PLAY / ⏸ PAUSE (SAMA KAYAK SONGPAGE)
  const handlePlayPause = () => {
    if (!songs.length) return;

    const firstSong = songs[0];

    if (isCurrent(firstSong)) {
      togglePlay();
    } else {
      playSong(firstSong, playlist, true);
    }
  };

  const handleSelect = (song) => {
    if (isCurrent(song)) {
      togglePlay();
    } else {
      playSong(song, playlist, true);
    }
  };

  const saveTitle = () => {
    const trimmed = editedName.trim();
    if (!trimmed) return;

    updatePlaylistName(playlist.id, trimmed);
    setIsEditing(false);
  };

  return (
    <div className="playlistPage-container">

      {/* HEADER */}
      <div className="playlistPage-banner">

        <button className="playlistPage-back" onClick={onBack}>
          ← Back
        </button>

        <div className="playlistPage-playControl">
          <button
            className={`playlistPage-playBtn ${
              isCurrent(songs[0]) && isPlaying ? "playing" : ""
            }`}
            onClick={handlePlayPause}
          >
            {isCurrent(songs[0]) && isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        <img
          src={playlist.image}
          alt={playlist.title}
          className="playlistPage-cover"
        />

        <div className="playlistPage-info">
          {isEditing ? (
            <div className="edit-title-container">
              <input
                type="text"
                className="edit-title-input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
              />

              <button className="edit-save-btn" onClick={saveTitle}>
                Save
              </button>

              <button
                className="edit-cancel-btn"
                onClick={() => {
                  setEditedName(playlist.title);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1 className="playlist-title-display">
              {playlist.title}
              <span
                className="edit-icon"
                onClick={() => setIsEditing(true)}
              >
                ✏️
              </span>
            </h1>
          )}
        </div>
      </div>

      {/* SONG LIST */}
      <div className="playlistPage-songs">
        <h2>Songs</h2>

        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={song.id}
              className={`playlistPage-songRow ${
                isCurrent(song) ? "active" : ""
              }`}
              onClick={() => handleSelect(song)}
            >
              <span className="playlistPage-index">{index + 1}</span>

              <img
                src={song.image}
                alt={song.title}
                className="playlistPage-songImg"
              />

              <div className="playlistPage-songInfo">
                <p className="playlistPage-title">{song.title}</p>
                <p className="playlistPage-artistSmall">{song.artist}</p>
              </div>

              <button
                className="playlistPage-removeBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSong(playlist.id, song.id);
                }}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="playlistPage-noSongs">
            This playlist has no songs yet.
          </p>
        )}
      </div>

      <button
        className="playlistPage-addBtn"
        onClick={() => onAddSong(playlist.id)}
      >
        + Add Song
      </button>

    </div>
  );
}
