import React from "react";
import { FaUser } from "react-icons/fa";
import "../css/ProfilePage.css";

export default function ProfilePage({ playlists, onSelectPlaylist }) {
  return (
    <div className="profile-wrapper">

      {/* USER HEADER */}
      <div className="profile-header">
        <div className="profile-icon">
          <FaUser size={60} />
        </div>

        <div className="profile-texts">
          <h1 className="profile-name">Your Profile</h1>
          <p className="profile-subtitle">All playlists you create will appear here.</p>
        </div>
      </div>
    
        {playlists?.map((pl) => (
          <div key={pl.id} className="profile-card" onClick={() => onSelectPlaylist(pl)}>
            <img
              src={pl.image || "https://via.placeholder.com/200"}
              alt={pl.title}
            />
            <div className="profile-card-title">{pl.title}</div>
          </div>
        ))}
      </div>
  );
}