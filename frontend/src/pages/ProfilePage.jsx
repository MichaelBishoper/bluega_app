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

  // Logged-in user ("me") from sessionStorage
  const initialStoredUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [me, setMe] = useState(initialStoredUser);
  const myUserId = me?.id;

  // Route param: which profile are we viewing?
  const { userId: profileUserId } = useParams();

  const isMyProfile = String(profileUserId) === String(myUserId);

  const token = getToken();
  const headers = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // Profile user object (the user being viewed)
  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Following / Followers lists
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followers, setFollowers] = useState([]);

  // Playlists + cover grid
  const [playlists, setPlaylists] = useState([]);
  const [playlistCovers, setPlaylistCovers] = useState({}); // { [playlistId]: [imgUrl,...] }

  // Albums (ignore for now per your original file)
  const albums = [];

  // ---------- Helpers ----------
  const normalizeId = (v) => (v == null ? "" : String(v));

  const myFollowingIds = (me?.followingids || []).map(normalizeId);
  const isFollowing = myFollowingIds.includes(normalizeId(profileUserId));

  const userName =
    profileUser?.username ||
    profileUser?.name ||
    "User";

  // ---------- Fetch my latest user (so follow state is correct) ----------
  useEffect(() => {
    const fetchMe = async () => {
      if (!myUserId) return;
      try {
        const res = await axios.get(`${API_URL}/api/users/${myUserId}`, {
          headers,
        });
        setMe(res.data);
      } catch (err) {
        console.error("Failed to refresh current user:", err);
      }
    };

    fetchMe();
  }, [myUserId, headers]);

  // ---------- Fetch profile user + following/followers from /api/users (single call) ----------
  useEffect(() => {
    const fetchUsers = async () => {
      if (!profileUserId) {
        setProfileUser(null);
        setFollowingUsers([]);
        setFollowers([]);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);

      try {
        const res = await axios.get(`${API_URL}/api/users`, { headers });
        const users = Array.isArray(res.data) ? res.data : [];

        // Set the profile user object (THIS is what was missing)
        const pu = users.find((u) => normalizeId(u.id) === normalizeId(profileUserId));
        setProfileUser(pu || null);

        // profile user's following ids
        const followingIds = (pu?.followingids || []).map(normalizeId);

        // Following: users that profileUser follows
        const following = users.filter((u) => followingIds.includes(normalizeId(u.id)));

        // Followers: users that follow profileUser
        const followersList = users.filter((u) =>
          (u.followingids || []).map(normalizeId).includes(normalizeId(profileUserId))
        );

        setFollowingUsers(following);
        setFollowers(followersList);
      } catch (err) {
        console.error("Failed to fetch users for profile/following/followers:", err);
        setProfileUser(null);
        setFollowingUsers([]);
        setFollowers([]);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUsers();
  }, [profileUserId, headers]);

  // ---------- Fetch playlists for profile user ----------
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

  // ---------- Build 2x2 covers for each playlist ----------
  useEffect(() => {
    if (!playlists.length) {
      setPlaylistCovers({});
      return;
    }

    const buildCovers = async () => {
      try {
        // Get ALL albums once
        const albumsRes = await axios.get(`${API_URL}/api/albums`, { headers });
        const albumsData = albumsRes.data || [];

        // songId -> album
        const songAlbumMap = new Map();
        albumsData.forEach((album) => {
          (album.songs || []).forEach((s) => {
            songAlbumMap.set(normalizeId(s.songId), album);
          });
        });

        const coverMap = {};

        await Promise.all(
          playlists.map(async (p) => {
            const plRes = await axios.get(
              `${API_URL}/api/playlists/${p.id}`,
              { headers }
            );
            const songIds = (plRes.data?.songIds || []).map(normalizeId);

            coverMap[p.id] = songIds
              .slice(0, 4)
              .map((sid) => songAlbumMap.get(normalizeId(sid))?.imgUrl || "")
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

  // ---------- Follow / Unfollow ----------
  const handleToggleFollow = async () => {
    if (!myUserId || !profileUserId || isMyProfile) return;

    try {
      if (isFollowing) {
        await axios.put(
          `${API_URL}/api/users/${myUserId}/unfollow/${profileUserId}`,
          {},
          { headers }
        );

        // update local me state
        setMe((prev) => ({
          ...prev,
          followingids: (prev.followingids || []).filter(
            (id) => normalizeId(id) !== normalizeId(profileUserId)
          ),
        }));
      } else {
        await axios.put(
          `${API_URL}/api/users/${myUserId}/follow/${profileUserId}`,
          {},
          { headers }
        );

        setMe((prev) => ({
          ...prev,
          followingids: [...(prev.followingids || []), normalizeId(profileUserId)],
        }));
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  if (loadingProfile) {
    return <div className="user-profile-page">Loading...</div>;
  }

  return (
    <div className="user-profile-page">
      {/* header */}
      <button onClick={() => navigate("/")}>← Home</button>

      <div className="profile-header">
        <ProfileAvatar name={userName} size={90} />

        <div className="profile-header-text">
          <h1>{userName}</h1>

          {!isMyProfile && (
            <button className="follow-btn" onClick={handleToggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
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
