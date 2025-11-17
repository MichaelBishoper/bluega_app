// src/data/Music.jsx
import React, { createContext, useContext, useRef, useState, useEffect } from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 🆕 Recently Played
  const [recentHistory, setRecentHistory] = useState([]);

  // 🆕 Master Songs (UPLOAD SONG FROM HERE BRO)
  const [songs] = useState([
    {
      id: 1,
      title: "Lampu Kuning",
      artist: "Juicy Luicy",
      url: "/audio/lampu_kuning.mp3",
      cover: "https://i.imgur.com/2m4d1WO.jpeg",
    },
    {
      id: 2,
      title: "Feel Good",
      artist: "Gorillaz",
      url: "/audio/feel_good.mp3",
      cover: "https://i.imgur.com/Nv1J3rD.jpeg",
    },
    {
      id: 3,
      title: "505",
      artist: "Arctic Monkeys",
      url: "/audio/505.mp3",
      cover: "https://i.imgur.com/Nv1J3rD.jpeg",
    },
  ]);

  // 🎛 Track progress
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // 🎵 Autoplay when current song changes
  useEffect(() => {
    if (!currentSong) return;

    const audio = audioRef.current;
    audio.src = currentSong.url;
    audio.load();

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => console.warn("Autoplay blocked"));
  }, [currentSong]);

  // 🔊 Sync volume + loop
  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.loop = isLooping;
  }, [volume, isLooping]);

  // ⏭ Auto-next when song ends
  useEffect(() => {
    const audio = audioRef.current;
    audio.onended = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };
  }, [isLooping, currentSong, playlist, currentIndex]);

  // ▶️ Main Play Function (FINAL VERSION)
  const playSong = (song, list = songs, index = 0) => {
    if (!song) return;

    // Set current song & playlist
    setCurrentSong(song);
    setPlaylist(list);
    setCurrentIndex(index);
    setIsPlaying(true);

    // ⭐ Add to Recently Played (sorted newest first)
    setRecentHistory(prev => {
      const filtered = prev.filter(item => item.id !== song.id);
      return [{ ...song, playedAt: Date.now() }, ...filtered].slice(0, 50);
    });
  };

  // ▶️ Toggle Play
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // ⏭ Next / Prev / Random
  const next = () => {
    const list = playlist || songs;
    const nextIndex = (currentIndex + 1) % list.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(list[nextIndex]);
  };

  const prev = () => {
    const list = playlist || songs;
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(list[prevIndex]);
  };

  const playRandom = () => {
    const random = songs[Math.floor(Math.random() * songs.length)];
    playSong(random);
  };

  // 🎚 Controls
  const toggleLoop = () => setIsLooping(!isLooping);

  const setVolumeLevel = (value) => {
    const newVol = Math.max(0, Math.min(1, value));
    setVolume(newVol);
    audioRef.current.volume = newVol;
  };

  const seek = (value) => {
    const audio = audioRef.current;
    if (!audio.duration) return;

    audio.currentTime = (value / 100) * audio.duration;
    setCurrentTime(audio.currentTime);
    setProgress(value);
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        recentHistory, // ⭐ Recently Played (sorted)
        currentSong,
        isPlaying,
        currentTime,
        duration,
        progress,
        volume,
        isLooping,
        playSong,
        togglePlay,
        next,
        prev,
        toggleLoop,
        setVolumeLevel,
        seek,
        playRandom,
        audioRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
