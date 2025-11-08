import React from "react";
import { getUser, logout } from "../utils/auth";

export default function Home() {
  const user = getUser();
  return (
    <div>
      <h2>Welcome {user ? user.name : "User"}</h2>
      <p>This is Bluega.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
