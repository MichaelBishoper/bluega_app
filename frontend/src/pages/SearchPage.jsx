import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../utils/api";

export default function SearchPage({
  query,
  onSelectAlbum,
  onSelectPlaylist,
  onSelectUser,
}) {
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchSearch = async () => {
      try {
        const [usersRes, albumsRes, playlistsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users`),
          axios.get(`${API_URL}/api/albums`),
          axios.get(`${API_URL}/api/playlists`),
        ]);

        const q = query.toLowerCase();

        setUsers(
          usersRes.data.filter((u) =>
            u.username?.toLowerCase().includes(q)
          )
        );

        setAlbums(
          albumsRes.data.filter((a) =>
            a.title?.toLowerCase().includes(q)
          )
        );

        setPlaylists(
          playlistsRes.data.filter((p) =>
            (
              p.playlistName ||
              p.title ||
              p.name ||
              ""
            ).toLowerCase().includes(q)
          )
        );
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="search-page">

      {/* USERS */}
      <section className="search-section">
        <h2>Users</h2>

        <div className="row users-row">
          {users.length === 0 && <p>No users</p>}

          {users.map((u) => (
            <div
              key={u.id}
              className="user-card"
              onClick={() => onSelectUser?.(u.id)}
            >
              <span>{u.username}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ALBUMS */}
      <section className="search-section">
        <h2>Albums</h2>

        <div className="row albums-row">
          {albums.length === 0 && <p>No albums</p>}

          {albums.map((album) => (
            <div
              key={album.id}
              className="album-card"
              onClick={() => onSelectAlbum?.(album.id)}
            >
              <img
                src={album.imgUrl || "/placeholder-album.png"}
                alt={album.title}
                onError={(e) => {
                  e.target.src = "/placeholder-album.png";
                }}
              />
              <span>{album.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PLAYLISTS */}
      <section className="search-section">
        <h2>Playlists</h2>

        <div className="row playlists-row">
          {playlists.length === 0 && <p>No playlists</p>}

          {playlists.map((p) => (
            <div
              key={p.id}
              className="playlist-card"
              onClick={() => onSelectPlaylist?.(p)}
            >
              <img
                src="/placeholder-playlist.png"
                alt={p.playlistName || p.title}
              />
              <span>{p.playlistName || p.title}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
