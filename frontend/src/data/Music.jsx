// src/data/Music.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

/**
 * Music context — manages a single Audio instance, queue, playlist fallback,
 * progress, time, volume, loop, next/prev, and exposes a nextSong alias
 * to avoid legacy runtime errors.
 *
 * Assumes songs have a `url` string field.
 */

const MusicContext = createContext();
export const useMusic = () => useContext(MusicContext);

export function MusicProvider({ children }) {
  const audioRef = useRef(new Audio());

  // CORE
  const [songs] = useState([
    // keep your sample songs here or replace with your real list
    {
      id: 101,
      albumId: "juicy-01",
      title: "Lampu Kuning",
      artist: "Juicy Luicy",
      url: "/audio/lampu_kuning.mp3",
      cover: "/picture/Nonfiksi.png",
    },
    {
      id: 102,
      albumId: "juicy-01",
      title: "Asing",
      artist: "Juicy Luicy",
      url: "/audio/asing.mp3",
      cover: "/picture/Nonfiksi.png",
    },
    {
      id: 103,
      albumId: "juicy-01",
      title: "Tampar",
      artist: "Juicy Luicy",
      url: "/audio/tampar.mp3",
      cover: "/picture/Nonfiksi.png",
    },
    {
      id: 104,
      albumId: "juicy-01",
      title: "Bukan orangnya",
      artist: "Juicy Luicy",
      url: "/audio/bukan_orangnya.mp3",
      cover: "/picture/Nonfiksi.png",
    },
    {
      id: 201,
      albumId: "gorillaz-01",
      title: "Feel Good",
      artist: "Gorillaz",
      url: "/audio/feel_good.mp3",
      cover: "/picture/feel_good.png",
    },
    {
      id: 301,
      albumId: "arctic-01",
      title: "505",
      artist: "Arctic Monkeys",
      url: "/audio/505.mp3",
      cover: "/picture/patrick.png",
    },
  ]);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgress] = useState(0); // 0 - 100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1); // 0 - 1
  const [isLooping, setIsLooping] = useState(false);

  const [playlist, setPlaylist] = useState(null); // optional playlist object with .songs
  const [currentIndex, setCurrentIndex] = useState(0);

  const [recentHistory, setRecentHistory] = useState([]);

  // Queue system (FIFO)
  const [queue, setQueue] = useState([]);

  const addToQueue = useCallback((song) => {
    if (!song) return;
    setQueue((q) => [...q, song]);
  }, []);

  const removeFromQueue = useCallback((index) => {
    setQueue((q) => q.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => setQueue([]), []);

  // helper: push to recent
  const pushToRecent = useCallback((song) => {
    if (!song) return;
    setRecentHistory((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [{ ...song, playedAt: Date.now() }, ...filtered].slice(0, 50);
    });
  }, []);

  // Play a song (explicit). Accepts optional list & index for playlist fallback.
  const playSong = useCallback((song, list = null, index = 0) => {
    if (!song) return;
    setPlaylist(list ?? null);
    setCurrentIndex(index);
    setCurrentSong(song);
    pushToRecent(song);
  }, [pushToRecent]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentSong, isPlaying]);

  const setVolumeLevel = useCallback((v) => {
    const value = Math.max(0, Math.min(1, v));
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  const seek = useCallback((percent) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const p = Math.max(0, Math.min(100, percent));
    const newTime = (p / 100) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(p);
  }, []);

  const toggleLoop = useCallback(() => setIsLooping((v) => !v), []);

  // NEXT: queue-first behaviour (play first queued and remove it)
  const next = useCallback(() => {
    // if queue exists, play first queued and remove it (behaviour #1)
    if (queue.length > 0) {
      const nextQueued = queue[0];
      setQueue((q) => q.slice(1));
      playSong(nextQueued, null, 0);
      return;
    }

    // fallback to playlist or master songs
    const list = playlist?.songs || songs;
    if (!list || list.length === 0) {
      // nothing to play -> pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }
    const newIndex = (currentIndex + 1) % list.length;
    playSong(list[newIndex], playlist ? playlist.songs : list, newIndex);
  }, [queue, playlist, songs, currentIndex, playSong]);

  // PREV: playlist-based previous
  const prev = useCallback(() => {
    const list = playlist?.songs || songs;
    if (!list || list.length === 0) return;
    const newIndex = (currentIndex - 1 + list.length) % list.length;
    playSong(list[newIndex], playlist ? playlist.songs : list, newIndex);
  }, [playlist, songs, currentIndex, playSong]);

  // alias for legacy callers
  const nextSong = next;

  // AUDIO EVENT HANDLING (single place)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onLoadedMeta = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      // queue-first behaviour: handled inside next()
      next();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isLooping, next]);

  // When currentSong changes: update audio.src and attempt autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong) {
      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      setDuration(0);
      return;
    }

    // set source
    audio.src = currentSong.url;
    audio.load();

    // attempt play
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    // sync volume & loop
    audio.volume = volume;
    audio.loop = isLooping;

    // reset timers
    setCurrentTime(0);
    setProgress(0);
    setDuration(audio.duration || 0);
  }, [currentSong, volume, isLooping]);

  // ensure audio volume stays in sync if volume changes outside
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // EXPORT
  const value = {
    songs,
    playlists: [],

    currentSong,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isLooping,

    playlist,
    currentIndex,

    playSong,
    togglePlay,
    next,
    nextSong, // legacy alias — prevents "nextSong is not a function" errors
    prev,
    playRandom: useCallback(() => {
      const i = Math.floor(Math.random() * songs.length);
      playSong(songs[i], songs, i);
    }, [songs, playSong]),

    toggleLoop,
    setVolumeLevel,
    seek,

    addSongToPlaylist: () => {},
    removeSongFromPlaylist: () => {},

    recentHistory,

    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,

    audioRef,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
