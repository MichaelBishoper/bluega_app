// ===========================================================
//  FIXED + CLEANED App.js (FINAL VERSION)
// ===========================================================
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import MainLayout from "./components/MainLayout";
import RightPanel from "./components/RightPanel";
import PlayerBar from "./components/PlayerBar";
import SongPage from "./pages/SongPage";
import AlbumUpload from "./pages/AlbumUpload";

import { sidebarPlaylists, samplePlaylists } from "./data/Playlist";
import { MusicProvider, useMusic } from "./data/Music";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getToken } from "./utils/auth";

import "./App.css";


// ===========================================================
// PRIVATE LAYOUT (AFTER LOGIN)
// ===========================================================
function PrivateLayout() {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, audioRef, nextSong, prevSong } =
    useMusic();

  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [activeSongPage, setActiveSongPage] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ⭐ MAIN FIX: use only ONE STATE to control the panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // prevent auto-opening after user manually closes panel
  const [panelManuallyClosed, setPanelManuallyClosed] = useState(false);

  // "playlist" or "song"
  const [panelMode, setPanelMode] = useState(null);

  // Audio UI tracking
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);

  // ----------------------------------------------------------
  // AUDIO EVENTS
  // ----------------------------------------------------------
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(Math.floor(audioRef.current.currentTime));
  };

  const handleDurationLoad = () => {
    if (audioRef.current) setSongDuration(Math.floor(audioRef.current.duration));
  };

  const handleSongEnd = () => {
    nextSong();
  };

  // ----------------------------------------------------------
  // PLAYLIST SELECTED
  // ----------------------------------------------------------
  const handleSelectPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);

    setPanelMode("playlist");
    setPanelManuallyClosed(false);
    setIsPanelOpen(true);         // ⭐ push content immediately

    if (playlist.songs?.length > 0) {
      playSong(playlist.songs[0], playlist, true);
      setActiveSongPage(null);
    }
  };

  // ----------------------------------------------------------
  // SONG SELECTED
  // ----------------------------------------------------------
  const handleSelectSong = (song, playlist = null) => {
    playSong(song, playlist, true);

    setActiveSongPage(song);
    setPanelMode("song");

    setPanelManuallyClosed(false);
    setIsPanelOpen(true);         // ⭐ ensure it ALWAYS pushes content
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
          {!activeSongPage ? (
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
            />
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
        <Route path="/upload-album" element={<AlbumUpload />} />
        <Route
          path="/"
          element={getToken() ? <PrivateLayout /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MusicProvider>
  );
}
