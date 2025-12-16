import React, { useState, useEffect } from "react";
import "../css/PlaylistPage.css";
import { useMusic } from "../data/Music";
import axios from "axios";
import API_URL from "../utils/api";

export default function PlaylistPage({
  playlist,
  onBack,
  onRemoveSong,
  updatePlaylistName,
}) {
  // 🔥 GLOBAL MUSIC STATE (SATU SUMBER KEBENARAN)
  const { playSong, togglePlay, currentSong, isPlaying } = useMusic();

  // LOCAL UI STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync title
  useEffect(() => {
    if (playlist) setEditedName(playlist.title);
  }, [playlist]);

  // =========================
  // Fetch playlist + hydrate songs
  // =========================
  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      if (!playlist?.id) return;

      setLoading(true);

      try {
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1) Get playlist (songIds only)
        const plRes = await axios.get(
          `${API_URL}/api/playlists/${playlist.id}`,
          { headers }
        );

        const songIds = plRes.data?.songIds || [];
        if (!songIds.length) {
          setSongs([]);
          return;
        }

        // 2) Get ALL albums 
        const albumsRes = await axios.get(`${API_URL}/api/albums`, { headers });
        const albums = albumsRes.data || [];

        // Build map: songId -> album (img + artist)
        const songAlbumMap = new Map();
        albums.forEach((album) => {
          (album.songs || []).forEach((s) => {
            songAlbumMap.set(String(s.songId), album);
          });
        });

        // 3) Hydrate songs
        const hydrated = await Promise.all(
          songIds.map(async (sid) => {
            const sRes = await axios.get(
              `${API_URL}/api/songs/${sid}`,
              { headers }
            );

            const song = sRes.data;
            const album = songAlbumMap.get(String(sid));

            return {
              ...song,
              albumCover: album?.imgUrl || "",
              albumArtist: album?.artist || "",
            };
          })
        );

        setSongs(hydrated);
      } catch (err) {
        console.error("Failed to load playlist songs:", err);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistSongs();
  }, [playlist?.id]);

  if (!playlist) {
    return <div className="playlistPage-container">Loading playlist...</div>;
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
      playSong(firstSong, { songs }, 0);
    }
  };

  const handleSelect = (song, index) => {
    if (isCurrent(song)) {
      togglePlay();
    } else {
      playSong(song, { songs }, index);
    }
  };

  const saveTitle = () => {
    const trimmed = editedName.trim();
    if (!trimmed) return;

    updatePlaylistName(playlist.id, trimmed);
    setIsEditing(false);
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="playlistPage-container">
      {/* HEADER */}
      <div className="playlistPage-banner">
        <button className="playlistPage-back" onClick={onBack}>
          ← Back
        </button>

        <div className="playlistPage-playControl">
          <button
            className={`playlistPage-playBtn ${
              isCurrent(songs[0]) && isPlaying ? "playing" : ""
            }`}
            onClick={handlePlayPause}
            disabled={!songs.length}
          >
            {isCurrent(songs[0]) && isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        {/* PLAYLIST COVER GRID (unchanged CSS) */}
        <div className="playlistPage-cover">
          {songs.length === 0 ? (
            <div className="playlist-cover-placeholder">🎵</div>
          ) : (
            <div className="playlist-cover-grid">
              {songs.slice(0, 4).map((song, index) => (
                <div key={index} className="playlist-cover-cell">
                  {song.albumCover ? (
                    <img src={song.albumCover} alt={song.title} />
                  ) : (
                    <div className="playlist-cover-empty">🎶</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="playlistPage-info">
          {isEditing ? (
            <div className="edit-title-container">
              <input
                className="edit-title-input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
              />
              <button onClick={saveTitle}>Save</button>
              <button
                onClick={() => {
                  setEditedName(playlist.title);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1 className="playlist-title-display">
              {playlist.title}
              <span className="edit-icon" onClick={() => setIsEditing(true)}>
                ✏️
              </span>
            </h1>
          )}
        </div>
      </div>

      {/* SONG LIST */}
      <div className="playlistPage-songs">
        <h2>Songs</h2>

        {loading ? (
          <p className="playlistPage-noSongs">Loading songs...</p>
        ) : songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={song.id}
              className={`playlistPage-songRow ${
                isCurrent(song) ? "active" : ""
              }`}
              onClick={() => handleSelect(song, index)}
            >
              <span className="playlistPage-index">{index + 1}</span>

              <div className="playlistPage-songImg">
                <img src={song.albumCover} alt={song.title} />
              </div>

              <div className="playlistPage-songInfo">
                <p className="playlistPage-title">{song.title}</p>
                <p className="playlistPage-artistSmall">
                  {song.artist || song.albumArtist}
                </p>
              </div>

              <button
                className="playlistPage-removeBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSong(playlist.id, song.id);
                }}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="playlistPage-noSongs">
            This playlist has no songs yet.
          </p>
        )}
      </div>
    </div>
  );
}
