import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/AlbumPage.css";

export default function AlbumPage() {
  const navigate = useNavigate();

  const openAlbum = (id) => {
    navigate(`/albums/${id}`);
  };

  const albums = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    name: `New Album ${i + 1}`,
    image: null,
  }));

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
            {album.image ? (
              <img src={album.image} alt={album.name} />
            ) : (
              <div className="album-plus">＋</div>
            )}
          </div>

          {/* NAMA ALBUM */}
          <div className="album-name">{album.name}</div>

        </div>
      ))}
    </div>

  </div>
);

}
