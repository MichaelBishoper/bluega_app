import React from "react";

export default function ProfileSection({ title, children }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "16px" }}>{title}</h2>
      <div className="profile-grid">{children}</div>
    </div>
  );
}
