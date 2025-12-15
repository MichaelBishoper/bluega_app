import React, { useState } from "react";
import { Link } from "react-router-dom"; // for link to login page
import API_URL from "../utils/api";


export default function Signup() {
  console.log("API_URL =", API_URL);
  console.log("Signup URL =", `${API_URL}/api/users/`);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/users`, { // use endpoint POST /api/users to create new user
        method: "POST",
        mode: "cors", //OPTIONAL enable CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Registration successful. Please login.");

      setUsername(""); setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

 return (
  <div
    style={{
      maxWidth: 400,
      margin: "5rem auto",          // form turun ke tengah
      padding: "2rem",
      textAlign: "center",          // center all
    }}
  >

    {/* Logo */}
    <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
      <img
        src="picture/bluga.png"
        alt="Logo"
        style={{
          width: "75px",
          height: "75px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      />
    </Link>

    {/* Title */}
    <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Sign Up</h2>

    <form onSubmit={handleSubmit}>
      {/* Username */}
      <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
        <label style={{ fontWeight: "500" }}>Username</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "1px solid #999",
            marginTop: "0.3rem",
            boxSizing: "border-box",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "1.2rem", textAlign: "left" }}>
        <label style={{ fontWeight: "500" }}>Password</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "1px solid #999",
            marginTop: "0.3rem",
            boxSizing: "border-box",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* Button (match input size) */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "#2196f3",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600",
          boxSizing: "border-box",
        }}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      {/* Messages */}
      {message && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {/* Redirect */}
      <div style={{ marginTop: "1rem" }}>
        <p>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2196f3", fontWeight: "bold" }}>
            Login here
          </Link>
        </p>
      </div>

    </form>
  </div>
);


}
