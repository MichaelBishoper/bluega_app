import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import MainLayout from "./components/MainLayout";
import PlayerBar from "./components/PlayerBar";
import SongPage from "./pages/SongPage";
import ProfilePage from "./pages/ProfilePage";
import AddSongPage from "./pages/AddSongPage";
import AddSongPageNext from "./pages/AddSongPageNext";

import { MusicProvider, useMusic } from "./data/Music";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getToken, logout } from "./utils/auth";
import PlaylistPage from "./pages/PlaylistPage";
import AlbumPage from "./pages/AlbumPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import SearchPage from "./pages/SearchPage";

import "./App.css";
import API_URL from "./utils/api";

const PLAYLISTS_API_BASE = `${API_URL}/api/playlists`;
const USERS_API_BASE = `${API_URL}/api/users`;

const mapBackendToFrontend = (p) => ({
  id: p.id,
  title: p.playlistName || "Untitled",
  image: p.image || "",
  artist: p.artist || "",
  songs: Array.isArray(p.songs) ? p.songs.map(s => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    album: s.album ? { imgUrl: s.album.imgUrl, title: s.album.title } : null,
    src: s.src,
  })) : [],
});

function PrivateLayout() {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, audioRef, nextSong, prevSong } =
    useMusic();

  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const location = useLocation();
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser.id;

  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [activeSongPage, setActiveSongPage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (!userId) {
      setUserPlaylists([]);
      return;
    }
    axios
      .get(`${USERS_API_BASE}/${userId}/playlists`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : [];
        setUserPlaylists(list.map(mapBackendToFrontend));
      })
      .catch((err) => {
        console.error("Failed to load playlists", err);
        setUserPlaylists([]);
      });
  }, [userId]);

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelManuallyClosed, setPanelManuallyClosed] = useState(false);
  const [panelMode, setPanelMode] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const deletePlaylist = async (playlistId) => {
    try {
      const token = getToken();
      await axios.delete(`${PLAYLISTS_API_BASE}/${playlistId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error("Failed to delete playlist", err);
    }
    setUserPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
      setCurrentPlaylist(null);
      setCurrentPage("home");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(Math.floor(audioRef.current.currentTime));
  };

  const handleDurationLoad = () => {
    if (audioRef.current) setSongDuration(Math.floor(audioRef.current.duration));
  };

  const handleSongEnd = () => nextSong();

  const handleSelectPlaylist = (playlist) => {
    setSearchQuery("");
    setSelectedPlaylist(playlist);
    setCurrentPlaylist(playlist);
    setCurrentPage("playlist");
    setPanelMode("playlist");
    setPanelManuallyClosed(false);
    setIsPanelOpen(true);
  };

  const openPlaylistById = async (playlistId) => {
    if (!playlistId) return;
    try {
      const res = await axios.get(`${PLAYLISTS_API_BASE}/${playlistId}`);
      handleSelectPlaylist(mapBackendToFrontend(res.data));
    } catch (err) {
      console.error("Failed to open playlist by id:", err);
    }
  };

  React.useEffect(() => {
    const s = location.state || {};
    if (s.openPage === "playlist" && s.playlistId) {
      navigate(location.pathname, { replace: true, state: {} });
      openPlaylistById(s.playlistId);
    }
  }, [location.state]);

  const handleSelectSong = (song, playlist = null) => {
    playSong(song, playlist, true);
    setActiveSongPage(song);
    setPanelMode("song");
    setPanelManuallyClosed(false);
    setIsPanelOpen(true);
  };

  const handleSeek = (ratio) => {
    if (audioRef.current) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const makeUniqueName = (base, existingTitles) => {
    if (!existingTitles.includes(base)) return base;
    let n = 1;
    while (existingTitles.includes(`${base} (${n})`)) n++;
    return `${base} (${n})`;
  };

  const handleCreatePlaylist = async () => {
    if (!userId) return;
    const token = getToken();
    const existingTitles = userPlaylists.map((p) => p.title);
    const playlistName = makeUniqueName("New Playlist", existingTitles);
    try {
      const res = await axios.post(
        `${USERS_API_BASE}/${userId}/playlists`,
        { playlistName, songIds: [] },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const backendPlaylist = mapBackendToFrontend(res.data);
      setUserPlaylists((prev) => [backendPlaylist, ...prev]);
      setSelectedPlaylist(backendPlaylist);
      setCurrentPlaylist(backendPlaylist);
      setCurrentPage("playlist");
      setPanelMode("playlist");
      setPanelManuallyClosed(false);
      setIsPanelOpen(true);
    } catch (err) {
      console.error("Failed to create playlist", err);
    }
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    setActiveSongPage(null);
    setCurrentPlaylist(null);
    setSelectedPlaylist(null);
    setSelectedAlbumId(null);
    setCurrentPage("home");
    setIsPanelOpen(false);
    navigate("/");
  };

  const handleLogout = () => logout();

  const updatePlaylistName = async (playlistId, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const token = getToken();
      const res = await axios.put(
        `${PLAYLISTS_API_BASE}/${playlistId}/rename`,
        { newName: trimmed },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const updated = mapBackendToFrontend(res.data);
      setUserPlaylists((prev) => prev.map((p) => (p.id === playlistId ? updated : p)));
      setSelectedPlaylist((prev) => (prev?.id === playlistId ? updated : prev));
      setCurrentPlaylist((prev) => (prev?.id === playlistId ? updated : prev));
    } catch (err) {
      console.error("Failed to rename playlist", err);
    }
  };

  const goAlbums = () => {
    setSearchQuery("");
    setSelectedAlbumId(null);
    setCurrentPage("albums");
    setIsPanelOpen(false);
  };

  return (
    <div className="app-container">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogoClick={handleLogoClick}
        onLogout={handleLogout}
      />

      <div className="main-layout">
        <Sidebar
          playlists={userPlaylists}
          onSelectPlaylist={handleSelectPlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          onDeletePlaylist={deletePlaylist}
          onAlbumsClick={goAlbums}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className={`content-area ${isPanelOpen ? "panel-open" : ""}`}>
          {searchQuery.trim() !== "" ? (
            <SearchPage
              query={searchQuery}
              onSelectAlbum={(id) => {
                setSearchQuery("");
                setSelectedAlbumId(id);
                setCurrentPage("albumDetail");
              }}
              onSelectPlaylist={handleSelectPlaylist}
              onSelectUser={(userId) => {
                setSearchQuery("");
                navigate(`/profile/${userId}`);
              }}
            />
          ) : currentPage === "albumDetail" && selectedAlbumId ? (
            <AlbumDetailPage
              albumId={selectedAlbumId}
              onBack={() => {
                setSelectedAlbumId(null);
                setCurrentPage("albums");
              }}
            />
          ) : currentPage === "albums" ? (
            <AlbumPage
              onSelectAlbum={(id) => {
                setSelectedAlbumId(id);
                setCurrentPage("albumDetail");
              }}
            />
          ) : currentPage === "playlist" && selectedPlaylist ? (
            <PlaylistPage
              playlist={selectedPlaylist}
              onBack={() => setCurrentPage("home")}
              onSelectSong={(song) => handleSelectSong(song, selectedPlaylist)}
              updatePlaylistName={updatePlaylistName}
              onRemoveSong={(playlistId, songId) => {
                setUserPlaylists((prev) =>
                  prev.map((p) =>
                    p.id === playlistId
                      ? { ...p, songs: (p.songs || []).filter((s) => s.id !== songId) }
                      : p
                  )
                );
                if (selectedPlaylist?.id === playlistId) {
                  const updated = {
                    ...selectedPlaylist,
                    songs: (selectedPlaylist.songs || []).filter((s) => s.id !== songId),
                  };
                  setSelectedPlaylist(updated);
                  setCurrentPlaylist(updated);
                }
              }}
            />
          ) : !activeSongPage ? (
            <MainLayout
              playlists={userPlaylists}
              onSelect={handleSelectPlaylist}
              onSelectSong={handleSelectSong}
              onSelectAlbum={(albumId) => {
                setSelectedAlbumId(albumId);
                setCurrentPage("albumDetail");
              }}
            />
          ) : (
            <SongPage
              song={activeSongPage}
              playlistSongs={currentPlaylist?.songs || []}
              onBack={() => setActiveSongPage(null)}
              openPanel={() => {
                setPanelManuallyClosed(false);
                setIsPanelOpen(true);
              }}
            />
          )}

          <audio
            ref={audioRef}
            src={currentSong?.src || undefined}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleDurationLoad}
            onEnded={handleSongEnd}
            autoPlay={isPlaying}
          />
        </main>
      </div>

      <PlayerBar
        current={currentSong}
        isPlaying={isPlaying}
        onToggle={togglePlay}
        currentTime={currentTime}
        onSeek={handleSeek}
        totalDuration={songDuration}
        onNext={nextSong}
        onPrev={prevSong}
      />
    </div>
  );
}

export default function App() {
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser.id;
  return (
    <MusicProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile/:userId"
          element={getToken() ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={
            getToken()
              ? <Navigate to={`/profile/${userId}`} replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/"
          element={
            getToken()
              ? <PrivateLayout key={userId || "no-user"} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/add-song" element={<AddSongPage />} />
        <Route path="/add-song/next" element={<AddSongPageNext />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MusicProvider>
  );
}