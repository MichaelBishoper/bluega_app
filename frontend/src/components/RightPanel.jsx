import React from "react";

export default function RightPanel({ current }) {
  return (
    <div className="w-80 bg-black/60 p-4 text-white">
      <h3 className="mb-4">YOUR PLAYLIST</h3>
      {current ? (
        <div>
          <img src={current.cover} alt="big" className="w-full h-48 object-cover rounded-md mb-3" />
          <div className="font-semibold">{current.title}</div>
          <div className="text-sm text-gray-300">{current.subtitle}</div>
        </div>
      ) : (
        <div className="text-gray-400">No playlist selected</div>
      )}
    </div>
  );
}
