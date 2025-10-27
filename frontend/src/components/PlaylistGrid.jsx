import React from "react";
import { PlayIcon } from "./Icons";

export const samplePlaylists = [
  { title: "playlist_name", image: "path/to/image.jpg" },
  // add more playlists
];

export const sidebarPlaylists = [
  { title: "playlist_name", image: "path/to/image2.jpg" },
];

export default function PlaylistGrid({ playlists, onPlay }) {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <h2 className="text-white font-semibold mb-4">YOUR PLAYLIST</h2>
      <div className="grid grid-cols-4 gap-6">
        {playlists.map((pl) => (
          <div key={pl.id} className="bg-black/40 p-3 rounded-lg hover:scale-[1.01] transition-transform">
            <img src={pl.cover} alt="cover" className="w-full h-36 object-cover rounded-sm mb-3" />
            <div className="text-sm text-gray-200">{pl.title}</div>
            <div className="text-xs text-gray-400">{pl.subtitle}</div>
            <div className="mt-2">
              <button
                onClick={() => onPlay(pl)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs"
              >
                <PlayIcon className="w-4 h-4" /> Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
