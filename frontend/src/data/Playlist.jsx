export const samplePlaylists = [
  {
    id: 1,
    title: "kor jem",
    image: "/picture/jere.png",
    group: "Chilled Cow",

    // 👇 REQUIRED — list of songs inside this playlist
    songs: [],
  },
  {
    id: 2,
    title: "glen praiselist",
    image: "/picture/glen.png",
    group: "Blue Note Records",

    songs: [],
  },
  {
    id: 3,
    title: "artur godzilla",
    image: "/picture/artur.png",
    group: "Epic Records",

    songs: [],
  },
  {
    id: 4,
    title: "bruce lee",
    image: "/picture/rafa.png",
    group: "Midnight Collective",

    songs: [],
  },
];

// 👇 Sidebar uses the SAME playlists
export const sidebarPlaylists = samplePlaylists;
