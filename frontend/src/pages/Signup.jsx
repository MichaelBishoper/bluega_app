import React, { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
        // edit aja endpointnya yah backend :)
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setMessage("Registration successful. Please login.");
      setName(""); setEmail(""); setPassword("");
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
          <label>Name</label><br />
          <input value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit" disabled={loading}>{loading ? "Signing..." : "Sign Up"}</button>
        </div>
        {message && <div style={{color: "green"}}>{message}</div>}
        {error && <div style={{color: "red"}}>{error}</div>}
      </form>
    </div>
  );
}
