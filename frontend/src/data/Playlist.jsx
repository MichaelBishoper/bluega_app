// src/data/playlist.jsx

export const samplePlaylists = [
  {
    id: 1,
    title: "kor jem",
    image: "/picture/jere.png",
    artist: "D4VD",
    description: "Calm beats to relax and study.",
    lyrics: "🎧 Instrumental - No lyrics",
    group: "Chilled Cow",

    // 👇 REQUIRED — list of songs inside this playlist
    songs: [],
  },
  {
    id: 2,
    title: "glen praiselist",
    image: "/picture/glen.png",
    artist: "juicyluicy",
    description: "Smooth jazz for your late nights.",
    lyrics: "🎷 Instrumental - No lyrics",
    group: "Blue Note Records",

    songs: [],
  },
  {
    id: 3,
    title: "artur godzilla",
    image: "/picture/artur.png",
    artist: "mac d marco",
    description: "Classic rock hits from the 70s, 80s, and 90s.",
    lyrics: "🎸 Feel the power of rock and roll!",
    group: "Epic Records",

    songs: [],
  },
  {
    id: 4,
    title: "bruce lee",
    image: "/picture/rafa.png",
    artist: "gorilaz",
    description: "Dreamy chillwave tunes for night drives.",
    lyrics: "🌙 Synth vibes and retro soundscapes.",
    group: "Midnight Collective",

    songs: [],
  },
];

// 👇 Sidebar uses the SAME playlists
export const sidebarPlaylists = samplePlaylists;
