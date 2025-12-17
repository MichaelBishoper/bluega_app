// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileSection from "../components/ProfileSection";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";
import { getToken } from "../utils/auth";
import "../css/ProfilePage.css";

// reuse the grid CSS you already have
import "../css/PlaylistPage.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const myUserId = storedUser.id;

  const { userId: profileUserId } = useParams();

  const isMyProfile = String(profileUserId) === String(myUserId);

  const userName = storedUser.username || storedUser.name || "User";

  // ignore for now
  const albums = [];

  const token = getToken();
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // Following / Followers
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!profileUserId) {
        setFollowingUsers([]);
        setFollowers([]);
        return;
      }

      try {
        // Fetch all users then derive both lists client-side using available endpoints
        const res = await axios.get(`${API_URL}/api/users`, { headers });
        const users = Array.isArray(res.data) ? res.data : [];

        // profile user's following ids
        const profileUser = users.find((u) => String(u.id) === String(profileUserId));
        const followingIds = (profileUser && profileUser.followingids) ? profileUser.followingids : [];

        // Following: users that profileUser follows
        const following = users.filter((u) => followingIds && followingIds.includes(u.id));

        // Followers: users that follow profileUser
        const followersList = users.filter((u) => (u.followingids || []).includes(String(profileUserId)));

        setFollowingUsers(following);
        setFollowers(followersList);
      } catch (err) {
        console.error("Failed to fetch users for following/followers:", err);
        setFollowingUsers([]);
        setFollowers([]);
      }
    };

    fetchUsers();
  }, [profileUserId, headers]);

  // playlists
  const [playlists, setPlaylists] = useState([]);
  const [playlistCovers, setPlaylistCovers] = useState({}); // { [playlistId]: [imgUrl,...] }

  // =========================
  // Fetch playlists for profile user
  // =========================
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!profileUserId) return;

      try {
        const res = await axios.get(
          `${API_URL}/api/users/${profileUserId}/playlists`,
          { headers }
        );
        setPlaylists(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch user playlists:", err);
        setPlaylists([]);
      }
    };

    fetchPlaylists();
  }, [profileUserId, headers]);

  // =========================
  // Build 2x2 covers (same idea as PlaylistPage)
  // =========================
  useEffect(() => {
    if (!playlists.length) {
      setPlaylistCovers({});
      return;
    }

    const buildCovers = async () => {
      try {
        // 1) Get ALL albums once
        const albumsRes = await axios.get(`${API_URL}/api/albums`, { headers });
        const albumsData = albumsRes.data || [];

        // songId -> album
        const songAlbumMap = new Map();
        albumsData.forEach((album) => {
          (album.songs || []).forEach((s) => {
            songAlbumMap.set(String(s.songId), album);
          });
        });

        // 2) Fetch each playlist for real songIds, then map to album covers
        const coverMap = {};

        await Promise.all(
          playlists.map(async (p) => {
            const plRes = await axios.get(
              `${API_URL}/api/playlists/${p.id}`,
              { headers }
            );
            const songIds = plRes.data?.songIds || [];

            coverMap[p.id] = songIds
              .slice(0, 4)
              .map((sid) => songAlbumMap.get(String(sid))?.imgUrl || "")
              .filter(Boolean);
          })
        );

        setPlaylistCovers(coverMap);
      } catch (err) {
        console.error("Failed to build playlist covers:", err);
        setPlaylistCovers({});
      }
    };

    buildCovers();
  }, [playlists, headers]);

  return (
    <div className="user-profile-page">
      {/* header */}
      <button onClick={() => navigate("/")}>← Home</button>

      <div className="profile-header">
        <ProfileAvatar name={userName} size={90} />

        <div className="profile-header-text">
          <h1>{userName}</h1>
          {!isMyProfile && <button className="follow-btn">Follow</button>}
        </div>
      </div>

      {/* albums */}
      <ProfileSection title="Uploaded Albums">
        {albums.map((album, i) => (
          <div key={i} className="profile-card">
            <div className="profile-card-image" />
            <p className="profile-card-title">Album Name</p>
          </div>
        ))}
        {albums.length === 0 && (
          <p style={{ opacity: 0.7 }}>Albums not available yet.</p>
        )}
      </ProfileSection>

      {/* following */}
      <ProfileSection title="Following">
        {followingUsers.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Not following anyone.</p>
        ) : (
          followingUsers.map((u) => (
            <div
              key={u.id}
              className="followed-user"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${u.id}`)}
            >
              <ProfileAvatar name={u.username || u.name || "U"} size={50} />
              <span>{u.username || u.name || "User"}</span>
            </div>
          ))
        )}
      </ProfileSection>

      {/* followers */}
      <ProfileSection title="Followers">
        {followers.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No followers yet.</p>
        ) : (
          followers.map((u) => (
            <div
              key={u.id}
              className="followed-user"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${u.id}`)}
            >
              <ProfileAvatar name={u.username || u.name || "U"} size={50} />
              <span>{u.username || u.name || "User"}</span>
            </div>
          ))
        )}
      </ProfileSection>

      {/* created playlists */}
      <ProfileSection title="Created Playlists">
        {playlists.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No playlists yet.</p>
        ) : (
          playlists.map((p) => {
            const covers = playlistCovers[p.id] || [];

            return (
              <div
                key={p.id}
                className="profile-card"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // IMPORTANT: pass handover state so "/" can open PlaylistPage
                  navigate("/", {
                    state: {
                      openPage: "playlist",
                      playlistId: p.id,
                    },
                  });
                }}
              >
                <div className="playlistPage-cover">
                  {covers.length === 0 ? (
                    <div className="playlist-cover-placeholder">🎵</div>
                  ) : (
                    <div className="playlist-cover-grid">
                      {covers.slice(0, 4).map((url, index) => (
                        <div key={index} className="playlist-cover-cell">
                          <img src={url} alt={p.playlistName || "Playlist"} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="profile-card-title">
                  {p.playlistName || "My Playlist"}
                </p>
              </div>
            );
          })
        )}
      </ProfileSection>
    </div>
  );
}
