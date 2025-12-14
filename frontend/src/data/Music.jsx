// src/data/Music.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

const MusicContext = createContext();
export const useMusic = () => useContext(MusicContext);

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const [playlist, setPlaylist] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [queue, setQueue] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  /* ---------------- QUEUE ---------------- */

  const addToQueue = useCallback((song) => {
    if (song) setQueue((q) => [...q, song]);
  }, []);

  const removeFromQueue = useCallback(
    (index) => setQueue((q) => q.filter((_, i) => i !== index)),
    []
  );

  const clearQueue = useCallback(() => setQueue([]), []);

  /* ---------------- RECENT ---------------- */

  const pushToRecent = useCallback((song) => {
    setRecentHistory((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [{ ...song, playedAt: Date.now() }, ...filtered].slice(0, 50);
    });
  }, []);

  /* ---------------- PLAY ---------------- */

  const playSong = useCallback(
    (song, list = null, index = 0) => {
      if (!song) return;
      setPlaylist(list);
      setCurrentIndex(index);
      setCurrentSong(song);
      pushToRecent(song);
    },
    [pushToRecent]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentSong, isPlaying]);

  /* ---------------- NAV ---------------- */

  const next = useCallback(() => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue((q) => q.slice(1));
      playSong(nextSong, playlist, 0);
      return;
    }

    if (!playlist?.songs?.length) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const nextIndex = (currentIndex + 1) % playlist.songs.length;
    playSong(playlist.songs[nextIndex], playlist, nextIndex);
  }, [queue, playlist, currentIndex, playSong]);

  const prev = useCallback(() => {
    if (!playlist?.songs?.length) return;

    const prevIndex =
      (currentIndex - 1 + playlist.songs.length) % playlist.songs.length;

    playSong(playlist.songs[prevIndex], playlist, prevIndex);
  }, [playlist, currentIndex, playSong]);

  const nextSong = next; // legacy alias

  /* ---------------- CONTROLS ---------------- */

  const seek = useCallback((percent) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;

    const p = Math.max(0, Math.min(100, percent));
    audio.currentTime = (p / 100) * audio.duration;
  }, []);

  const setVolumeLevel = useCallback((v) => {
    const val = Math.max(0, Math.min(1, v));
    setVolume(val);
    audioRef.current.volume = val;
  }, []);

  const toggleLoop = useCallback(() => setIsLooping((v) => !v), []);

  /* ---------------- AUDIO EVENTS ---------------- */

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isLooping, next]);

  /* ---------------- LOAD SONG ---------------- */

  useEffect(() => {
    const audio = audioRef.current;

    if (!currentSong) {
      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      return;
    }

    const src = currentSong.url || currentSong.audioUrl;
    if (!src) return console.error("Song has no audio source", currentSong);

    audio.src = src;
    audio.load();
    audio.volume = volume;
    audio.loop = isLooping;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentSong, volume, isLooping]);

  /* ---------------- EXPORT ---------------- */

  return (
    <MusicContext.Provider
      value={{
        songs,   
        currentSong,
        isPlaying,
        currentTime,
        progress,
        volume,
        isLooping,

        playlist,
        currentIndex,

        playSong,
        togglePlay,
        next,
        nextSong,
        prev,

        seek,
        setVolumeLevel,
        toggleLoop,

        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,

        recentHistory,
        audioRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
