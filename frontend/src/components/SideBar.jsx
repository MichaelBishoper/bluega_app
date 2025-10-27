import React from "react";
import { FaList, FaHome, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside
      className="w-64 bg-zinc-900 h-full pt-16 pb-20 fixed left-0 top-0 
                 flex flex-col justify-between border-r border-purple-800 z-0"
    >
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <SidebarItem icon={<FaHome />} label="Home" />
        <SidebarItem icon={<FaList />} label="Playlists" />
        <SidebarItem icon={<FaCog />} label="Settings" />
      </div>

      <div className="px-4 pb-6">
        <p className="text-xs text-gray-500">© 2025 My Music</p>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 mb-1 cursor-pointer 
                 hover:bg-purple-800/40 rounded-md transition-all"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
