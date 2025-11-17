// src/components/MusicPlayer.jsx
import React, { useRef, useEffect, useState } from "react";
import { useMusic } from "../data/Music";

export default function MusicPlayer() {
  const { currentTrack } = useMusic();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        // autoplay may be blocked by browser; just keep paused
      });
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  return (
    <div>
      <h3>Player</h3>
      {currentTrack ? (
        <>
          <div>
            <strong>{currentTrack.title}</strong> — {currentTrack.artist}
          </div>
          <audio ref={audioRef} controls>
            <source src={currentTrack.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </>
      ) : (
        <div>No track selected</div>
      )}
    </div>
  );
}
