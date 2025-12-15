import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";


import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import MainLayout from "./components/MainLayout";
import RightPanel from "./components/RightPanel";
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
import AlbumPage from "./pages/AlbumPage"
import AlbumDetailPage from "./pages/AlbumDetailPage";

import "./App.css";
import API_URL from "./utils/api";

// Base URL of your Spring Boot playlist API
const PLAYLISTS_API_BASE = `${API_URL}/api/playlists`;
const USERS_API_BASE = `${API_URL}/api/users`;

// change host/port if your backend is different

// Convert backend playlist object to the shape frontend uses
const mapBackendToFrontend = (p) => ({
  id: p.id,                             // MongoDB/id from backend
  title: p.playlistName || "Untitled",  // backend field playlistName                 
  image: "",                      
  artist: "",                      
  songs: [],                         
});


// ===========================================================
// PRIVATE LAYOUT
// ===========================================================
function PrivateLayout() {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, audioRef, nextSong, prevSong } =
    useMusic();

    const location = useLocation();
const isAlbumsPage = location.pathname === "/albums";
const isAlbumDetailPage = location.pathname.startsWith("/albums/");

  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser.id; //Controls re-mounting of PrivateLayout on login change.

  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [activeSongPage, setActiveSongPage] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    const token = getToken();

    if (!userId) {
      console.warn("No userId found in sessionStorage.");
      setUserPlaylists([]);
      return;
    }

    axios
      .get(`${USERS_API_BASE}/${userId}/playlists`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const data = res.data; // List<Playlists>
        const list = Array.isArray(data) ? data : [];
        setUserPlaylists(list.map(mapBackendToFrontend));
      })
      .catch((err) => {
        console.error(
          "Failed to load playlists from backend, using empty list",
          err
        );
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
  const deletePlaylist = async (playlistId) => {
    try {
      const token = getToken();

      await axios.delete(`${PLAYLISTS_API_BASE}/${playlistId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error("Failed to delete playlist on server, removing locally anyway", err);
    }

    setUserPlaylists((prev) => prev.filter((p) => p.id !== playlistId));

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
      setCurrentPlaylist(null);
      setCurrentPage("home");
    }
  };


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleDurationLoad = () => {
    if (audioRef.current) {
      setSongDuration(Math.floor(audioRef.current.duration));
    }
  };

  const handleSongEnd = () => {
    nextSong();
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentPlaylist(playlist);

    setCurrentPage("playlist");

    setPanelMode("playlist");
    setPanelManuallyClosed(false);
    setIsPanelOpen(true);
  };

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

  const handleCreatePlaylist = async () => {
    const baseName = "New Playlist";
    const token = getToken();

    // Local fallback if backend fails
    const fallbackCreate = () => {
      const newPlaylist = {
        id: `pl-${Date.now()}`,
        title: baseName,
        description: "New playlist (local only)",
        image: "",
        artist: "",
        songs: [],
      };

      setUserPlaylists((prev) => [newPlaylist, ...prev]);
      setSelectedPlaylist(newPlaylist);
      setCurrentPlaylist(newPlaylist);
      setCurrentPage("playlist");
      setPanelMode("playlist");
      setPanelManuallyClosed(false);
      setIsPanelOpen(true);
    };

    if (!userId) {
      console.warn("No userId found in sessionStorage, creating local-only playlist");
      fallbackCreate();
      return;
    }

    try {
      const res = await axios.post(
        `${USERS_API_BASE}/${userId}/playlists`,
        {
          playlistName: baseName,
          songIds: [],
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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
      console.error("Failed to create playlist on server, using local fallback", err);
      fallbackCreate();
    }
  };


  const handleLogoClick = () => {
    setActiveSongPage(null);
    setCurrentPlaylist(null);
    setSelectedPlaylist(null);
    setCurrentPage("home");
    setIsPanelOpen(false);
    navigate("/");
  };

  const handleLogout = () => logout(); // changes add here
  const updatePlaylistName = async (playlistId, newName) => {
  const trimmed = newName.trim();
  if (!trimmed) return;

  try {
    const token = getToken();

    const res = await axios.put(
      `${PLAYLISTS_API_BASE}/${playlistId}/rename`,
      { newName: trimmed }, // backend expects key "newName"
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    const updated = mapBackendToFrontend(res.data);

    setUserPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? updated : p))
    );

    setSelectedPlaylist((prev) =>
      prev && prev.id === playlistId ? updated : prev
    );

    setCurrentPlaylist((prev) =>
      prev && prev.id === playlistId ? updated : prev
    );
  } catch (err) {
    console.error("Failed to rename playlist on server", err);
  }
  };  




  return (
    <div className="app-container">
      <Navbar onLogoClick={handleLogoClick} onLogout={handleLogout} />

      <div className="main-layout">
<Sidebar
  playlists={userPlaylists}
  onSelectPlaylist={handleSelectPlaylist}
  onCreatePlaylist={handleCreatePlaylist}
  onDeletePlaylist={deletePlaylist}   // ✅ tambahkan ini
  isOpen={isSidebarOpen}
  setIsOpen={setIsSidebarOpen}
/>

<main className={`content-area ${isPanelOpen ? "panel-open" : ""}`}>

{isAlbumDetailPage ? (
  <AlbumDetailPage />

) : isAlbumsPage ? (
  <AlbumPage />

  ) : currentPage === "playlist" && selectedPlaylist ? (

    <PlaylistPage
      playlist={selectedPlaylist}
      onBack={() => setCurrentPage("home")}
      onSelectSong={(song) => handleSelectSong(song, selectedPlaylist)}
      updatePlaylistName={updatePlaylistName}
      onAddSong={(playlistId) => {
        const newSong = {
          id: `s-${Date.now()}`,
          title: "Added Song",
          artist: "Unknown",
          image: "",
          src: "",
        };

        setUserPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? { ...p, songs: [...(p.songs || []), newSong] }
              : p
          )
        );

        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
          const updated = {
            ...selectedPlaylist,
            songs: [...(selectedPlaylist.songs || []), newSong],
          };
          setSelectedPlaylist(updated);
          setCurrentPlaylist(updated);
        }
      }}
      onRemoveSong={(playlistId, songId) => {
        setUserPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? { ...p, songs: (p.songs || []).filter((s) => s.id !== songId) }
              : p
          )
        );

        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
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


        <RightPanel
          playlist={currentPlaylist}
          selectedSong={currentSong}
          panelMode={panelMode}
          isPanelOpen={isPanelOpen}
          panelManuallyClosed={panelManuallyClosed}
          onClose={() => {
            setIsPanelOpen(false);
            setPanelManuallyClosed(true);
          }}
        />
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

// ===========================================================
// ROUTES
// ===========================================================
export default function App() {
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}"); // get user object from sessionStorage
  const userId = storedUser.id; // get userId from stored user object
  return (
    <MusicProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* FIXED: removed conflicts */}
         <Route
          path="/profile"
          element={getToken() ? <ProfilePage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/"
          element={
            getToken() ? (
              <PrivateLayout key={userId || "no-user"} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
          <Route path="/add-song" element={<AddSongPage />} />
        <Route path="/add-song/next" element={<AddSongPageNext />} />
        <Route
  path="/albums"
  element={
    getToken() ? (
      <PrivateLayout key={userId || "no-user"} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
<Route
  path="/albums/:albumId"
  element={
    getToken() ? (
      <PrivateLayout key={userId || "no-user"} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MusicProvider>
  );
}
