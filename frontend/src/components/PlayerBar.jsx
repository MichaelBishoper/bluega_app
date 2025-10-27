import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

export default function PlayerBar() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full h-20 z-50
                 bg-gradient-to-r from-indigo-800 to-purple-900 
                 flex items-center justify-between px-8 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <img
          src="https://via.placeholder.com/60"
          alt="cover"
          className="rounded-md"
        />
        <div>
          <h3 className="font-semibold text-sm">Song Title</h3>
          <p className="text-xs text-gray-300">Artist Name</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <FaStepBackward className="cursor-pointer text-lg hover:text-purple-300" />
        <FaPlay className="cursor-pointer text-2xl hover:text-purple-300" />
        <FaStepForward className="cursor-pointer text-lg hover:text-purple-300" />
      </div>

      <div className="text-sm text-gray-400">03:25 / 04:50</div>
    </div>
  );
}
