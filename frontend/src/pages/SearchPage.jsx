import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";

export default function SearchPage({ query }) {
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) return;

    const fetchSearch = async () => {
      try {
        const [usersRes, albumsRes, playlistsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users`),
          axios.get(`${API_URL}/api/albums`),
          axios.get(`${API_URL}/api/playlists`)
        ]);

        const q = query.toLowerCase();

        setUsers(
          usersRes.data.filter(u =>
            u.username?.toLowerCase().includes(q)
          )
        );

        setAlbums(
          albumsRes.data.filter(a =>
            a.title?.toLowerCase().includes(q)
          )
        );

        setPlaylists(
          playlistsRes.data.filter(p =>
            p.playlistName?.toLowerCase().includes(q)
          )
        );
      } catch (err) {
        console.error("Search error", err);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="search-page">

{/* USERS */}
<div className="row users-row">
  {users.map(u => (
    <div className="user-card" key={u.id}>
      <img
        src={u.imgUrl || "/default-user.png"}
        alt={u.username}
      />
      <span>{u.username}</span>
    </div>
  ))}
</div>

{/* ALBUMS */}
<section className="search-section">
  <h2>Albums</h2>

  <div className="row albums-row">
    {albums.length === 0 && <p>No albums</p>}

    {albums.map((album) => (
      <div
        key={album.id}
        className="album-card"
        onClick={() => navigate(`/albums/${album.id}`)}
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
<div className="row playlists-row">
  {playlists.map(p => (
    <div className="playlist-card" key={p.id}>
      <img
        src="/placeholder-playlist.png"
        alt={p.playlistName}
      />
      <span>{p.playlistName}</span>
    </div>
  ))}
</div>

</div> 
  
  );
}
