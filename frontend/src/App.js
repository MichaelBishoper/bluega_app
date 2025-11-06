import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import PlaylistGrid from "./components/PlaylistGrid";
import RightPanel from "./components/RightPanel";
import PlayerBar from "./components/PlayerBar";
import { sidebarPlaylists, samplePlaylists } from "./data/Playlist";
import "./App.css";

export default function App() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Animate progress bar
  useEffect(() => {
    let id;
    if (isPlaying) {
      id = setInterval(() => {
        setProgress((p) => (p + 0.005 >= 1 ? 0 : p + 0.005));
      }, 400);
    }
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleSelectPlaylist = (playlist) => {
    setCurrent(playlist);
    setIsPanelOpen(true);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar />

      {/* Main layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar playlists={sidebarPlaylists} onSelectPlaylist={handleSelectPlaylist} />

        {/* Main Content */}
        <main className="content-area">
          <h2 className="section-title">Your Playlist</h2>
          <PlaylistGrid playlists={samplePlaylists} onSelect={handleSelectPlaylist} />
        </main>

        {/* Right Panel */}
        {current && (
          <RightPanel
            playlist={current}
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>

      {/* Player Bar */}
      <PlayerBar
        current={current}
        isPlaying={isPlaying}
        onToggle={() => setIsPlaying(!isPlaying)}
        progress={progress}
        onSeek={(v) => setProgress(Number(v))}
      />
    </div>
  );
}
