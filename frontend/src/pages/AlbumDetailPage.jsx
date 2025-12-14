import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/PlaylistPage.css"; // reuse CSS
import { useMusic } from "../data/Music";

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { playSong, togglePlay, currentSong, isPlaying } = useMusic();

  // 🔹 TEMP DUMMY ALBUMS (AMAN, BACKEND NYUSUL)
  const albums = Array.from({ length: 25 }).map((_, i) => ({
    id: i.toString(), // ⚠️ STRING biar match params
    title: `New Album ${i + 1}`,
    artist: "Unknown Artist",
    image: null,
    songs: [
      {
        id: `s-${i}-1`,
        title: "Sample Song 1",
        artist: "Unknown",
        image: "",
        src: "",
      },
      {
        id: `s-${i}-2`,
        title: "Sample Song 2",
        artist: "Unknown",
        image: "",
        src: "",
      },
    ],
  }));

  // 🔹 FIND ALBUM (SAFE)
  const album = albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="playlistPage-container">
        <button onClick={() => navigate("/albums")}>← Back</button>
        <p>Album not found</p>
      </div>
    );
  }

  const songs = album.songs || [];

  const isCurrent = (song) =>
    song && currentSong && song.id === currentSong.id;

  const handlePlayPause = () => {
    if (!songs.length) return;

    const firstSong = songs[0];

    if (isCurrent(firstSong)) {
      togglePlay();
    } else {
      playSong(firstSong, album, true);
    }
  };

  return (
    <div className="playlistPage-container">

      {/* HEADER */}
      <div className="playlistPage-banner">

        <button
          className="playlistPage-back"
          onClick={() => navigate("/albums")}
        >
          ← Back
        </button>

        <div className="playlistPage-playControl">
          <button
            className="playlistPage-playBtn"
            onClick={handlePlayPause}
          >
            {isCurrent(songs[0]) && isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        <div className="playlistPage-cover">
          {!album.image && <div className="album-placeholder">＋</div>}
        </div>

        <div className="playlistPage-info">
          <h1 className="playlist-title-display">{album.title}</h1>
          <p className="playlistPage-artistSmall">{album.artist}</p>
        </div>
      </div>

      {/* SONG LIST */}
      <div className="playlistPage-songs">
        <h2>Songs</h2>

        {songs.length ? (
          songs.map((song, index) => (
            <div
              key={song.id}
              className={`playlistPage-songRow ${
                isCurrent(song) ? "active" : ""
              }`}
              onClick={() => playSong(song, album, true)}
            >
              <span className="playlistPage-index">{index + 1}</span>

              <div className="playlistPage-songImg" />

              <div className="playlistPage-songInfo">
                <p className="playlistPage-title">{song.title}</p>
                <p className="playlistPage-artistSmall">{song.artist}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="playlistPage-noSongs">
            Album ini belum ada lagu
          </p>
        )}
      </div>
    </div>
  );
}
