import React, { useState, useEffect } from "react";
import "../css/PlaylistPage.css";

export default function PlaylistPage({
  playlist,
  onBack,
  onSelectSong,
  onAddSong,
  onRemoveSong,
  updatePlaylistName,
}) {
  // Hooks (always run)
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  // Sync input when switching playlists
  useEffect(() => {
    if (playlist) {
      setEditedName(playlist.title);
    }
  }, [playlist]);

  // Loading protection
  if (!playlist) {
    return <div className="playlistPage-container">Loading playlist...</div>;
  }

  const songs = playlist.songs || [];

  const handleSelect = (song) => {
    if (!songs.some((s) => s.id === song.id)) return;
    onSelectSong(song);
  };

  const saveTitle = () => {
    const trimmed = editedName.trim();
    if (trimmed === "") return;

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

        <img
          src={playlist.image}
          alt={playlist.title}
          className="playlistPage-cover"
        />

        <div className="playlistPage-info">

          {/* TITLE EDIT MODE */}
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
            <div key={song.id} className="playlistPage-songRow">

              <span className="playlistPage-index">{index + 1}</span>

              <img
                src={song.image}
                alt={song.title}
                className="playlistPage-songImg"
                onClick={() => handleSelect(song)}
              />

              <div
                className="playlistPage-songInfo"
                onClick={() => handleSelect(song)}
              >
                <p className="playlistPage-title">{song.title}</p>
                <p className="playlistPage-artistSmall">{song.artist}</p>
              </div>

              <button
                className="playlistPage-removeBtn"
                onClick={() => onRemoveSong(playlist.id, song.id)}
              >
                ✕
              </button>

            </div>
          ))
        ) : (
          <p className="playlistPage-noSongs">This playlist has no songs yet.</p>
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
