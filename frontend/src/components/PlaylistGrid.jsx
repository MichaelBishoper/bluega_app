import React from "react";
import "../css/PlaylistGrid.css";

export default function PlaylistGrid({ playlists }) {
  return (
    <div className="playlist-container">
      {/* Row 1: Your Playlist */}
      <div className="playlist-section">
      
        <div className="playlist-grid">
          {playlists.map((playlist, index) => (
            <div key={index} className="playlist-card">
              <img
                src={playlist.image}
                alt={playlist.title}
                className="playlist-image"
              />
              <div className="playlist-title">{playlist.title}</div>
              <div className="playlist-artist">{playlist.artist}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Recently Played */}
      <div className="playlist-section">
        <h2>Recently Played</h2>
        <div className="playlist-grid">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="placeholder-card">
                +
              </div>
            ))}
        </div>
      </div>

      {/* Row 3: Recommended for You */}
      <div className="playlist-section">
        <h2>Recommended for You</h2>
        <div className="playlist-grid">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="placeholder-card">
                +
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
