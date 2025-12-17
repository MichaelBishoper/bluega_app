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
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [usersRes, albumsRes, playlistsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users`, { headers }),
          axios.get(`${API_URL}/api/albums`, { headers }),
          axios.get(`${API_URL}/api/playlists`, { headers })
        ]);

        const q = query.toLowerCase();

        setUsers(
          usersRes.data.filter((u) => u.username?.toLowerCase().includes(q))
        );

        setAlbums(
          albumsRes.data.filter((a) => a.title?.toLowerCase().includes(q))
        );

        // Build mapping songId -> album (img) so we can show playlist cover grids
        const songAlbumMap = new Map();
        (albumsRes.data || []).forEach((album) => {
          (album.songs || []).forEach((s) => {
            songAlbumMap.set(String(s.songId), album);
          });
        });

        // playlistsRes.data may be a Page object { content: [...] } or an array
        const playlistsRaw = Array.isArray(playlistsRes.data)
          ? playlistsRes.data
          : playlistsRes.data?.content || [];

        const matchingPlaylists = playlistsRaw.filter((p) =>
          (p.playlistName || "").toLowerCase().includes(q)
        );

        // Enrich playlists with up to 4 cover images derived from their songs' albums
        const enrichedPlaylists = await Promise.all(
          matchingPlaylists.map(async (p) => {
            try {
              const plRes = await axios.get(`${API_URL}/api/playlists/${p.id}`, { headers });
              const songIds = plRes.data?.songIds || [];

              const covers = songIds
                .slice(0, 4)
                .map((sid) => songAlbumMap.get(String(sid))?.imgUrl || "")
                .filter(Boolean);

              return { ...p, covers, title: p.playlistName || "Untitled Playlist" };
            } catch (err) {
              return { ...p, covers: [], title: p.playlistName || "Untitled Playlist" };
            }
          })
        );

        setPlaylists(enrichedPlaylists);
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
    {users.map((u) => {
      const uid = u.id || u._id || (u._id && u._id.$oid) || u.username;
      return (
        <div
          key={uid}
          onClick={() => {
            onSelectUser(uid); // navigate to profile/:id
          }}
        >
          <SearchUserAvatar name={u.username} />
        </div>
      );
    })}
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
      {playlists.map((p) => {
        const covers = p.covers || [];
        return (
          <div
            key={p.id}
            className="mainlayout-card"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectPlaylist(p)}
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

            <div className="mainlayout-title">
              {p.title || p.playlistName || "Untitled Playlist"}
            </div>
          </div>
        );
      })}
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
