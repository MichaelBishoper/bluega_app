import React from "react";

export const PlayIcon = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M5 3v18l15-9L5 3z" />
  </svg>
);

export const PauseIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);
