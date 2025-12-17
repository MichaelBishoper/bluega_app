import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import API_URL from "../utils/api";
import "../css/SearchPage.css";
import SearchUserAvatar from "../components/SearchUserAvatar";

export default function SearchPage({
  query,
  onSelectAlbum,
  onSelectPlaylist,
  onSelectUser,
}) {
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const albumRowRef = useRef(null);
  const playlistRowRef = useRef(null);

  // 🔥 SCROLL FUNCTION (FIX ESLINT)
  const scrollRow = (ref, direction) => {
    if (!ref?.current) return;

    const scrollAmount = 320; // satu kartu + gap
    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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
            (p.playlistName || "").toLowerCase().includes(q)
          )
        );
      } catch (err) {
        console.error("Search error", err);
      }
    };

    fetchSearch();
  }, [query]);

  const scroll = (ref, dir) => {
    if (!ref.current) return;
    const amount = dir === "left" ? -300 : 300;
    ref.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="search-page">

     {/* USERS */}
{/* USERS */}
{/* USERS */}
<section className="playlist-section">
  <h2>Users</h2>

  <div className="scroll-row">
    {users.map((u) => (
      <div
        key={u.id}
        onClick={() => {
          onSelectUser(u.id);   // ✅ useState flow
        }}
      >
        <SearchUserAvatar name={u.username} />
      </div>
    ))}
  </div>
</section>




      {/* ALBUMS */}
      <section className="search-section">
        <div className="playlist-section">
  <h2>Albums</h2>

  <div className="scroll-wrapper">
    <button
      className="scroll-btn left"
      onClick={() => scrollRow(albumRowRef, "left")}
    >
      ◀
    </button>

    <div className="scroll-row" ref={albumRowRef}>
      {albums.map(album => (
        <div
          key={album.id}
          className="mainlayout-card"
          onClick={() => onSelectAlbum(album.id)}
        >
          <img
            src={album.imgUrl || "/placeholder-album.png"}
            className="mainlayout-image"
            alt={album.title}
          />
          <div className="mainlayout-title">{album.title}</div>
        </div>
      ))}
    </div>

    <button
      className="scroll-btn right"
      onClick={() => scrollRow(albumRowRef, "right")}
    >
      ▶
    </button>
  </div>
</div>
      </section>

      {/* PLAYLISTS */}
      <section className="search-section">
        <div className="playlist-section">
  <h2>Playlists</h2>

  <div className="scroll-wrapper">
    <button
      className="scroll-btn left"
      onClick={() => scrollRow(playlistRowRef, "left")}
    >
      ◀
    </button>

    <div className="scroll-row" ref={playlistRowRef}>
      {playlists.map(p => (
        <div
          key={p.id}
          className="mainlayout-card"
          onClick={() => onSelectPlaylist(p)}
        >
          <img
            src="/placeholder-playlist.png"
            className="mainlayout-image"
            alt={p.playlistName}
          />
          <div className="mainlayout-title">
            {p.playlistName || "Untitled Playlist"}
          </div>
        </div>
      ))}
    </div>

    <button
      className="scroll-btn right"
      onClick={() => scrollRow(playlistRowRef, "right")}
    >
      ▶
    </button>
  </div>
</div>

      </section>

    </div>
  );
}
