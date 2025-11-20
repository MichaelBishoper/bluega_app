import React from "react";
import "../css/PlaylistPage.css";

export default function PlaylistPage({
  playlist,
  onBack,
  onSelectSong,
  onAddSong,
  onRemoveSong,
}) {
  if (!playlist) {
    return <div className="playlistPage-container">Loading playlist...</div>;
  }

  const songs = playlist.songs || [];

  // Restrict playing songs ONLY inside the playlist
  const handleSelect = (song) => {
    if (!songs.some((s) => s.id === song.id)) return;
    onSelectSong(song);
  };

  return (
    <div className="playlistPage-container">
      {/* TOP BANNER */}
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
          <h1>{playlist.title}</h1>
          <p className="playlistPage-desc">{playlist.description}</p>
          {playlist.artist && (
            <p className="playlistPage-artist">{playlist.artist}</p>
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

              {/* REMOVE SONG BUTTON */}
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

      {/* ADD SONG BUTTON */}
      <button
        className="playlistPage-addBtn"
        onClick={() => onAddSong(playlist.id)}
      >
        + Add Song
      </button>
    </div>
  );
}
