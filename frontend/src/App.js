// ===========================================================
//  FIXED + CLEANED App.js (FINAL FULL VERSION)
// ===========================================================
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import MainLayout from "./components/MainLayout";
import RightPanel from "./components/RightPanel";
import PlayerBar from "./components/PlayerBar";
import SongPage from "./pages/SongPage";
import ProfilePage from "./pages/ProfilePage";

import { sidebarPlaylists, samplePlaylists } from "./data/Playlist";
import { MusicProvider, useMusic } from "./data/Music";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getToken } from "./utils/auth";
import PlaylistPage from "./pages/PlaylistPage";

import "./App.css";

// ===========================================================
// PRIVATE LAYOUT
// ===========================================================
function PrivateLayout() {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, audioRef, nextSong, prevSong } =
    useMusic();

  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [activeSongPage, setActiveSongPage] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ⭐ Playlist page navigation
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "playlist"
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Right panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelManuallyClosed, setPanelManuallyClosed] = useState(false);
  const [panelMode, setPanelMode] = useState(null);

  // Audio UI
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);

  // ----------------------------------------------------------
  // AUDIO EVENTS
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // SELECT PLAYLIST → open PlaylistPage
  // ----------------------------------------------------------
  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentPlaylist(playlist);

    // Open Playlist Page
    setCurrentPage("playlist");

    // Open Right Panel (playlist details)
    setPanelMode("playlist");
    setPanelManuallyClosed(false);
    setIsPanelOpen(true);
  };

  // ----------------------------------------------------------
  // SELECT SONG
  // ----------------------------------------------------------
  const handleSelectSong = (song, playlist = null) => {
    playSong(song, playlist, true);

    setActiveSongPage(song);
    setPanelMode("song");

    setPanelManuallyClosed(false);
    setIsPanelOpen(true);
  };

  // ----------------------------------------------------------
  // SEEK BAR
  // ----------------------------------------------------------
  const handleSeek = (ratio) => {
    if (audioRef.current) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // ----------------------------------------------------------
  // LOGO CLICK → HOME
  // ----------------------------------------------------------
  const handleLogoClick = () => {
    setActiveSongPage(null);
    setCurrentPlaylist(null);
    setSelectedPlaylist(null);
    setCurrentPage("home");
    setIsPanelOpen(false);
  };

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="app-container">
      <Navbar onLogoClick={handleLogoClick} onLogout={handleLogout} />

      <div className="main-layout">

        {/* SIDEBAR */}
        <Sidebar
          playlists={sidebarPlaylists}
          onSelectPlaylist={handleSelectPlaylist}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* MAIN CONTENT */}
        <main className={`content-area ${isPanelOpen ? "panel-open" : ""}`}>

          {/* 🎵 PLAYLIST PAGE */}
          {currentPage === "playlist" && selectedPlaylist ? (
            <PlaylistPage
              playlist={selectedPlaylist}
              onBack={() => setCurrentPage("home")}
              onSelectSong={(song) =>
                handleSelectSong(song, selectedPlaylist)
              }
            />
          ) : (

            /* 🏠 HOME or SONG PAGE */
            !activeSongPage ? (
              <MainLayout
                playlists={samplePlaylists}
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
            )
          )}

          {/* AUDIO ELEMENT */}
          <audio
            ref={audioRef}
            src={currentSong?.src || ""}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleDurationLoad}
            onEnded={handleSongEnd}
            autoPlay={isPlaying}
          />
        </main>

        {/* RIGHT PANEL */}
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

      {/* PLAYER BAR */}
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
  return (
    <MusicProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
<<<<<<< Updated upstream
        <Route path="/profile" element={getToken() ? <ProfilePage /> : <Navigate to="/login" replace />} />

=======
>>>>>>> Stashed changes
        <Route
          path="/"
          element={getToken() ? <PrivateLayout /> : <Navigate to="/login" replace />}
        />
<<<<<<< Updated upstream
        <Route path="/profile" element={getToken() ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />

=======
>>>>>>> Stashed changes
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MusicProvider>
  );
}
