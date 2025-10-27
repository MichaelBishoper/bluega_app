// --- Primary Playlists (e.g., for a main content area) ---
export const samplePlaylists = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `playlist_name_${i + 1}`,
  subtitle: "playlist",
  // Uses 'cover' property and a dynamic path for covers
  cover: `/covers/cover_${(i % 6) + 1}.jpg`,
}));

// --- Sidebar Playlists (e.g., for a navigation sidebar) ---
export const sidebarPlaylists = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `playlist_name_${i + 1}`,
  subtitle: "playlist",
  // Uses 'thumb' property and a dynamic path for thumbnails
  thumb: `/covers/thumb_${(i % 6) + 1}.jpg`,
}));

