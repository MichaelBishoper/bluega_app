import React, { useState } from "react";
import { Link } from "react-router-dom"; // for link to login page

export default function Signup() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"; // get API URL from env or use default which is 8080
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
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label><br />
          <input value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit" disabled={loading}>{loading ? "Signing..." : "Sign Up"}</button>
        </div>

        <div> <Link to="/login">Already have an account? Login</Link></div>
        {message && <div style={{color: "green"}}>{message}</div>}
        {error && <div style={{color: "red"}}>{error}</div>}
      </form>
    </div>
  );
}
