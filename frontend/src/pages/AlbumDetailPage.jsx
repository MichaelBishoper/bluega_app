import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";
import "../css/PlaylistPage.css";
import { useMusic } from "../data/Music";

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const { playSong, togglePlay, currentSong, isPlaying } = useMusic();

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  //used for playlist addition
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);
  const [plistQuery, setPlistQuery] = useState("");

  // =========================
  // Fetch album + songs
  // =========================
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const albumRes = await axios.get(`${API_URL}/api/albums/${albumId}`);

        const albumData = albumRes.data;
        setAlbum(albumData);

        // guard
        if (!albumData.songs || albumData.songs.length === 0) {
          setSongs([]);
          return;
        }

        const sortedAlbumSongs = [...albumData.songs].sort(
          (a, b) => a.order - b.order
        );

        const hydratedSongs = await Promise.all(
          sortedAlbumSongs.map(async (as) => {
            const res = await axios.get(`${API_URL}/api/songs/${as.songId}`);

            return {
              ...res.data,
              order: as.order,
              albumImgUrl: albumData.imgUrl,
            };
          })
        );

        setSongs(hydratedSongs);
      } catch (err) {
        console.error("Failed to load album:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumId, API_URL]);

  useEffect(() => {
    const fetchMyPlaylists = async () => {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const userId = storedUser.id;
      if (!userId) return;

      try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(`${API_URL}/api/users/${userId}/playlists`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setMyPlaylists(res.data);
      } catch (err) {
        console.error("Failed to fetch playlists", err);
      }
    };

    fetchMyPlaylists();
  }, []);

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
  const isCurrent = (song) => song && currentSong && song.id === currentSong.id;

  const handlePlayPause = () => {
  if (!songs.length) return;

  const firstSong = {
      ...songs[0],
      albumCover: album.imgUrl,
      albumArtist: album.artist,
    };

    if (isCurrent(firstSong)) {
      togglePlay();
    } else {
      playSong(firstSong, { songs }, 0);
    }
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="playlistPage-container">
      {/* HEADER */}
      <div className="playlistPage-banner">
        <button className="playlistPage-back" onClick={() => navigate("/albums")}>
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
              className={`playlistPage-songRow ${isCurrent(song) ? "active" : ""}`}
              onClick={() =>
                playSong(
                  {
                    ...song,
                    albumCover: album.imgUrl,
                    albumArtist: album.artist,
                  },
                  album,
                  index
                )
              }
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

              <button
                className="addToPlaylistBtn"
                onClick={(e) => {
                  e.stopPropagation(); // stop song play
                  setSongToAdd(song);
                  setIsAddOpen(true);
                  setPlistQuery("");
                }}
              >
                ＋
              </button>
            </div>
          ))
        ) : (
          <p className="playlistPage-noSongs">Album ini belum ada lagu</p>
        )}
      </div>

      {isAddOpen && songToAdd && (
        <div className="modalOverlay" onClick={() => setIsAddOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h3>Add “{songToAdd.title}” to playlist</h3>

            <input
              placeholder="Search playlists..."
              value={plistQuery}
              onChange={(e) => setPlistQuery(e.target.value)}
            />

            <div className="playlistPickList">
              {myPlaylists
                .filter((p) =>
                  (p.playlistName || "")
                    .toLowerCase()
                    .includes(plistQuery.toLowerCase())
                )
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={async () => {
                      try {
                        const token = sessionStorage.getItem("token");

                        await axios.put(
                          `${API_URL}/api/playlists/${p.id}/add-song`,
                          { songId: songToAdd.id },
                          {
                            headers: token
                              ? { Authorization: `Bearer ${token}` }
                              : {},
                          }
                        );

                        setIsAddOpen(false);
                        setSongToAdd(null);
                      } catch (err) {
                        console.error("Failed to add song", err);
                      }
                    }}
                  >
                    {p.playlistName}
                  </button>
                ))}
            </div>

            <button onClick={() => setIsAddOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
