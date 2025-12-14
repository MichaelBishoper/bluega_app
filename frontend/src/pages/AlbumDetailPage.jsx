import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PlaylistPage.css";
import { useMusic } from "../data/Music";

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const { playSong, togglePlay, currentSong, isPlaying } = useMusic();

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch album + songs
  // =========================
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const albumRes = await axios.get(
          `http://localhost:8080/api/albums/${albumId}`
        );

        const songsRes = await axios.get(
          `http://localhost:8080/api/albums/${albumId}/songs`
        );

        setAlbum(albumRes.data);
        setSongs(songsRes.data || []);
      } catch (err) {
        console.error("Failed to load album:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumId]);

  // =========================
  // Guards
  // =========================
  if (loading) {
    return <p style={{ padding: "20px" }}>Loading album...</p>;
  }

  if (!album) {
    return (
      <div className="playlistPage-container">
        <button onClick={() => navigate("/albums")}>← Back</button>
        <p>Album not found</p>
      </div>
    );
  }

  // =========================
  // Player helpers
  // =========================
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

  // =========================
  // Render
  // =========================
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
            disabled={!songs.length}
          >
            {isCurrent(songs[0]) && isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        <div className="playlistPage-cover">
          {album.imgUrl ? (
            <img src={album.imgUrl} alt={album.title} />
          ) : (
            <div className="album-placeholder">＋</div>
          )}
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
              onClick={() => playSong(
                {
                  ...song,
                  albumCover: album.imgUrl,
                  albumArtist: album.artist,
                },
                album,
                index
              )}
            >
              <span className="playlistPage-index">
                {song.order ?? index + 1}
              </span>

              <div className="playlistPage-songImg">
                <img src={album.imgUrl} alt={song.title} />
              </div>

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
