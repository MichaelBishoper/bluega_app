import React from "react";

export default function ProfileAvatar({ name, size = 80 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: size / 2,
        fontWeight: "700",
      }}
    >
      {initial}
    </div>
  );
}