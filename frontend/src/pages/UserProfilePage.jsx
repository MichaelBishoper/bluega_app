import React from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileSection from "../components/ProfileSection";
import "../css/UserProfilePage.css";

export default function UserProfilePage() {
  const userName = "Korleanhater";

  //DUMMYDATA YA
  const albums = [1, 2, 3];
  const playlists = [1, 2];
  const followedUsers = [1, 2, 3];

  return (
    <div className="user-profile-page">

      {/*header */}
      <div className="profile-header">
        <ProfileAvatar name={userName} size={90} />

        <div className="profile-header-text">
          <h1>{userName}</h1>
          <button className="follow-btn">Follow</button>
        </div>
      </div>

      {/* albums*/}
      <ProfileSection title="Uploaded Albums">
  {albums.map((album, i) => (
    <div key={i} className="profile-card">
      <div className="profile-card-image" />
      <p className="profile-card-title">Album Name</p>
    </div>
  ))}
</ProfileSection>

      {/* followedusers */}
      <ProfileSection title="Followed Users">
        {followedUsers.map((_, i) => (
          <div key={i} className="followed-user">
            <ProfileAvatar name={`U${i}`} size={50} />
            <span>User {i + 1}</span>
          </div>
        ))}
      </ProfileSection>

      {/* createdplaylis*/}
      <ProfileSection title="Created Playlists">
  {playlists.map((playlist, i) => (
    <div key={i} className="profile-card">
      <div className="profile-card-image" />
      <p className="profile-card-title">My Playlist</p>
    </div>
  ))}
</ProfileSection>

    </div>
  );
}
