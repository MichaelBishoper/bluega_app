import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import PlaylistGrid from "./components/PlaylistGrid";
import RightPanel from "./components/RightPanel";
import PlayerBar from "./components/PlayerBar";
import { samplePlaylists, sidebarPlaylists } from "./data/Playlist";
import "./App.css";

export default function App() {
  const [playlists, setPlaylists] = useState(samplePlaylists);
  const [filtered, setFiltered] = useState(samplePlaylists);
  const [current, setCurrent] = useState(samplePlaylists[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let id;
    if (isPlaying) {
      id = setInterval(() => {
        setProgress((p) => (p + 0.005 >= 1 ? 0 : p + 0.005));
      }, 400);
    }
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-black to-slate-800 text-white overflow-hidden">
      {/* Navbar (fixed at top) */}
      <Navbar onSearch={handleSearch} />

      {/* Main content area */}
      <div className="flex h-[calc(100vh-160px)] pt-16 pb-20">
        {/* Sidebar */}
        <Sidebar playlists={sidebarPlaylists} />

        {/* Main content (Playlist grid + right panel) */}
        <div className="flex flex-1 gap-6 overflow-y-auto px-6">
          <PlaylistGrid playlists={filtered} onPlay={setCurrent} />
          <RightPanel current={current} />
        </div>
      </div>

      {/* PlayerBar overlay (fixed at bottom) */}
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
