// ===========================================================
//  FIXED + CLEANED App.js (FINAL)
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

  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelManuallyClosed, setPanelManuallyClosed] = useState(false);
  const [panelMode, setPanelMode] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);

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

  const handleLogoClick = () => {
    setActiveSongPage(null);
    setCurrentPlaylist(null);
    setSelectedPlaylist(null);
    setCurrentPage("home");
    setIsPanelOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <Navbar onLogoClick={handleLogoClick} onLogout={handleLogout} />

      <div className="main-layout">
        <Sidebar
          playlists={sidebarPlaylists}
          onSelectPlaylist={handleSelectPlaylist}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className={`content-area ${isPanelOpen ? "panel-open" : ""}`}>
          {currentPage === "playlist" && selectedPlaylist ? (
            <PlaylistPage
              playlist={selectedPlaylist}
              onBack={() => setCurrentPage("home")}
              onSelectSong={(song) =>
                handleSelectSong(song, selectedPlaylist)
              }
            />
          ) : !activeSongPage ? (
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
          )}

          <audio
            ref={audioRef}
            src={currentSong?.src || ""}
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
          element={getToken() ? <PrivateLayout /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MusicProvider>
  );
}
