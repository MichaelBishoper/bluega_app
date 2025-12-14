import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AlbumPage.css";

export default function AlbumPage() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const openAlbum = (id) => {
    navigate(`/albums/${id}`);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/albums");
        setAlbums(res.data);
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return <h2 className="album-page-title">Loading albums…</h2>;
  }

  return (
    <div className="album-page">

      {/* JUDUL PAGE */}
      <h1 className="album-page-title">Albums</h1>

      {/* GRID ALBUM */}
      <div className="album-grid">
        {albums.map((album) => (
          <div key={album.id} className="album-item">

            {/* KOTAK ALBUM */}
            <div
              className="album-card"
              onClick={() => openAlbum(album.id)}
            >
              {album.imgUrl ? (
                <img src={album.imgUrl} alt={album.name} />
              ) : (
                <div className="album-plus">＋</div>
              )}
            </div>

            {/* NAMA ALBUM */}
            <div className="album-name">
              {album.name || album.title}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
