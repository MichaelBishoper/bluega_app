import React from "react";
import { Plus } from "lucide-react";
import "../css/MusicApp.css";

export default function MusicApp({ playlists = [], onAddNew }) {
  const totalSlots = Math.max(playlists.length, 10);
  const filledSlots = [...playlists];

  while (filledSlots.length < totalSlots) {
    filledSlots.push(null);
  }

  return (
    <div className="music-app">
      <div className="music-grid">
        {filledSlots.map((playlist, index) =>
          playlist ? (
            <div key={index} className="music-card">
              <img
                src={playlist.image || "/placeholder-cover.png"}
                alt={playlist.title}
                className="music-image"
              />
              <h3 className="music-title">{playlist.title}</h3>
              <p className="music-artist">{playlist.artist || "playlist"}</p>
            </div>
          ) : (
            <div key={index} className="music-card placeholder" onClick={onAddNew}>
              <Plus size={48} />
              <p className="music-artist">Add new</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
