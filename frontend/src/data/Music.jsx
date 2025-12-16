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
  const audioRef = useRef(new Audio());

  /* ================= STATE ================= */

  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState(null); // album OR playlist
  const [playlistTracks, setPlaylistTracks] = useState([]); // 🔑 normalized
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const [queue, setQueue] = useState([]); // NGENTOT GW MAU TIDUR

  const [songs, setSongs] = useState([]);          // REQUIRED
  const [recentHistory, setRecentHistory] = useState([]); // REQUIRED

  /* ================= HELPERS ================= */

  const normalizeTracks = (list) => {
    if (!list) return [];

    // album
    if (Array.isArray(list.songs)) return list.songs;

    // playlist (already hydrated elsewhere)
    if (Array.isArray(list.tracks)) return list.tracks;

    return [];
  };

  /* ================= PLAY ================= */

  const playSong = useCallback((song, list = null, index = -1) => {
    if (!song) return;

    const audio = audioRef.current;
    const src = song.url || song.audioUrl;

    if (!src) {
      console.error("Song has no audio source", song);
      return;
    }

    // normalize playlist
    if (list?.songs) {
      setPlaylist(list);
      setSongs(list.songs);
      setCurrentIndex(index);
    } else {
      setPlaylist(null);
      setSongs([]);
      setCurrentIndex(-1);
    }

    setCurrentSong(song);

    // recent history (no duplicates)
    setRecentHistory((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [song, ...filtered].slice(0, 20);
    });

    audio.src = src;
    audio.volume = volume;
    audio.loop = isLooping;

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [volume, isLooping]);


  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentSong]);

  /* ================= NAV ================= */

  const next = useCallback(() => {
    if (queue.length > 0) {
      const [nextSong, ...rest] = queue;
      setQueue(rest);
      playSong(nextSong, playlist, 0);
      return;
    }

    if (!playlistTracks.length) return;

    const nextIndex = (currentIndex + 1) % playlistTracks.length;
    playSong(playlistTracks[nextIndex], playlist, nextIndex);
  }, [queue, playlistTracks, currentIndex, playSong, playlist]);

  const prev = useCallback(() => {
    if (!playlistTracks.length) return;

    const prevIndex =
      (currentIndex - 1 + playlistTracks.length) % playlistTracks.length;

    playSong(playlistTracks[prevIndex], playlist, prevIndex);
  }, [playlistTracks, currentIndex, playSong, playlist]);

  // 🔥 LEGACY ALIASES (DO NOT REMOVE YET)
const nextSong = next;
const prevSong = prev;

  /* ================= AUDIO EVENTS ================= */

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
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
  }, [next, isLooping]);

  /* ================= CONTROLS ================= */

  const seek = (percent) => {
    const audio = audioRef.current;
    if (!audio.duration) return;
    audio.currentTime = (percent / 100) * audio.duration;
  };

  const setVolumeLevel = (v) => {
    const val = Math.max(0, Math.min(1, v));
    setVolume(val);
    audioRef.current.volume = val;
  };

  const toggleLoop = () => setIsLooping((v) => !v);

  /* ================= QUEUE ================= */

  const addToQueue = (song) => song && setQueue((q) => [...q, song]);
  const removeFromQueue = (i) =>
    setQueue((q) => q.filter((_, idx) => idx !== i));
  const clearQueue = () => setQueue([]);

  /* ================= EXPORT ================= */

  return (
    <MusicContext.Provider
      value={{
        // playback
        currentSong,
        isPlaying,
        currentTime,
        duration,
        progress,

        // playlist
        playlist,
        playlistTracks,
        currentIndex,

        // controls
        playSong,
        togglePlay,
        next,
        prev,
        seek,

        // legacy
        nextSong,
        prevSong,

        // audio
        volume,
        setVolumeLevel,
        isLooping,
        toggleLoop,

        // queue
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,

        audioRef,

        songs,              // REQUIRED
        recentHistory,      // REQUIRED
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
