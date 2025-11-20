// Updated Music.jsx with playlist restriction (only played songs can be added)
// and prepare support for remove button UI in PlaylistPage.

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const audioRef = useRef(new Audio());

  // ------------------------------------------------------------
  // CORE PLAYER STATE
  // ------------------------------------------------------------
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const [playlist, setPlaylist] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // NEW: Tracks all songs the user has played
  const [recentHistory, setRecentHistory] = useState([]);

  // ------------------------------------------------------------
  // MASTER SONG LIST
  // ------------------------------------------------------------
  const [songs] = useState([
    { id: 101, albumId: "juicy-01", title: "Lampu Kuning", artist: "Juicy Luicy", url: "/audio/lampu_kuning.mp3", cover: "/picture/Nonfiksi.png" },
    { id: 102, albumId: "juicy-01", title: "Asing", artist: "Juicy Luicy", url: "/audio/asing.mp3", cover: "/picture/Nonfiksi.png" },
    { id: 103, albumId: "juicy-01", title: "Tampar", artist: "Juicy Luicy", url: "/audio/tampar.mp3", cover: "/picture/Nonfiksi.png" },
    { id: 104, albumId: "juicy-01", title: "Bukan Orangnya", artist: "Juicy Luicy", url: "/audio/bukan_orangnya.mp3", cover: "/picture/Nonfiksi.png" },

    { id: 201, albumId: "gorillaz-01", title: "Feel Good", artist: "Gorillaz", url: "/audio/feel_good.mp3", cover: "/picture/feel_good.png" },
    { id: 301, albumId: "arctic-01", title: "505", artist: "Arctic Monkeys", url: "/audio/505.mp3", cover: "/picture/patrick.png" },
  ]);

  // ------------------------------------------------------------
  // PLAYLIST SYSTEM
  // ------------------------------------------------------------
  const [playlists, setPlaylists] = useState([
    {
      id: "p1",
      title: "My Favorites",
      description: "Songs you love",
      image: "/picture/default_playlist.png",
      songs: [],
    },
  ]);

  // Push song into history (meaning: user played it at least once)
  const pushToRecent = (song) => {
    if (!song) return;
    setRecentHistory((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [
        { ...song, playedAt: Date.now() },
        ...filtered,
      ].slice(0, 50);
    });
  };

  // ------------------------------------------------------------
  // PLAYBACK CONTROLS
  // ------------------------------------------------------------
  const playSong = (song, list = null, index = 0) => {
    if (!song) return;
    if (list) setPlaylist(list);
    else setPlaylist(null);

    setCurrentIndex(index);
    setCurrentSong(song);

    pushToRecent(song);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  // ------------------------------------------------------------
  // PLAYLIST RESTRICTION:
  // Only songs that have been played before can be added
  // ------------------------------------------------------------
  function addSongToPlaylist(playlistId, songId) {
    const songToAdd = songs.find((s) => s.id === songId);
    if (!songToAdd) return;

    const hasPlayed = recentHistory.some((s) => s.id === songId);
    if (!hasPlayed) {
      alert("You can only add songs you have already played.");
      return;
    }

    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: pl.songs.some((s) => s.id === songId)
                ? pl.songs
                : [...pl.songs, songToAdd],
            }
          : pl
      )
    );
  }

  function removeSongFromPlaylist(playlistId, songId) {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: pl.songs.filter((s) => s.id !== songId),
            }
          : pl
      )
    );
  }

  // ------------------------------------------------------------
  // SEEK / VOLUME
  // ------------------------------------------------------------
  const seek = (percent) => {
    const audio = audioRef.current;
    if (!audio.duration) return;

    const p = Math.max(0, Math.min(100, percent));
    audio.currentTime = (p / 100) * audio.duration;

    setCurrentTime(audio.currentTime);
    setProgress(p);
  };

  const setVolumeLevel = (value) => {
    const v = Math.max(0, Math.min(1, value));
    setVolume(v);
    audioRef.current.volume = v;
  };

  const toggleLoop = () => setIsLooping((v) => !v);

  // ------------------------------------------------------------
  // NEXT / PREV
  // ------------------------------------------------------------
  const next = () => {
    const list = playlist || songs;
    if (!list.length) return;

    const i = (currentIndex + 1) % list.length;
    setCurrentIndex(i);
    setCurrentSong(list[i]);
    pushToRecent(list[i]);
  };

  const prev = () => {
    const list = playlist || songs;
    if (!list.length) return;

    const i = (currentIndex - 1 + list.length) % list.length;
    setCurrentIndex(i);
    setCurrentSong(list[i]);
    pushToRecent(list[i]);
  };

  const playRandom = () => {
    const i = Math.floor(Math.random() * songs.length);
    playSong(songs[i], songs, i);
  };

  // ------------------------------------------------------------
  // AUDIO EVENT HANDLING
  // ------------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current;

    const update = () => {
      if (!audio.duration) {
        setProgress(0);
        setCurrentTime(0);
        setDuration(0);
        return;
      }
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onMeta = () => setDuration(audio.duration || 0);

    const onEnd = () => (isLooping ? audio.play() : next());

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [isLooping]);

  // ------------------------------------------------------------
  // AUTOPLAY WHEN SONG CHANGES
  // ------------------------------------------------------------
  useEffect(() => {
    const audio = audioRef.current;

    if (!currentSong) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.src = currentSong.url;
    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    audio.volume = volume;
    audio.loop = isLooping;

    setCurrentTime(0);
    setProgress(0);
  }, [currentSong]);

  // ------------------------------------------------------------
  // RETURN CONTEXT
  // ------------------------------------------------------------
  return (
    <MusicContext.Provider
      value={{
        songs,
        playlists,

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
        prev,
        playRandom,
        toggleLoop,
        setVolumeLevel,
        seek,

        addSongToPlaylist,
        removeSongFromPlaylist,

        recentHistory,

        audioRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);