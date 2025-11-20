// import React, { useState } from "react";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true); setError("");
//     try {
//                 // edit aja endpointnya yah backend :)
//       const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");
//       if (data.token) localStorage.setItem("token", data.token);
//       if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
//       // redirect to home
//       window.location.href = "/";
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email</label><br />
//           <input value={email} onChange={(e) => setEmail(e.target.value)} />
//         </div>
//         <div>
//           <label>Password</label><br />
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </div>
//         <div>
//           <button type="submit" disabled={loading}>{loading ? "Logging." : "Login"}</button>
//         </div>
//         {error && <div style={{ color: "red" }}>{error}</div>}
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState(""); // changed email to username (we login using)
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cek apakah user sudah login
  const token = localStorage.getItem("token");
  if (token) {
    // Kalau sudah login, langsung lempar ke Home
    return <Navigate to="/" replace />;
  }

  // Temporary local account (for frontend-only testing)
  const tempAccounts = [
    // { email: "admin@test.com", password: "123456", role: "admin" },
    // { email: "user@test.com", password: "akuganteng", role: "user" }

    
    { username: "user", password:"123456"} // we dont have roles in backend OK!
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const res = await fetch(`${API_URL}/api/users/login`, { // updated endpoint to /api/users/login matching backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // replaced email with username
      });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Backend login failed, trying local login...");
    }

    const user = await res.json();

    // backend does not send a token yet – create a dummy one so your app knows you're "logged in"
    localStorage.setItem("token", "temporary-token");
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "/";
    return;

    } catch (err) {
      console.warn("Backend unreachable. Trying local fallback...");

      const user = tempAccounts.find(
        (acc) => acc.username === username && acc.password === password
      );

      if (user) {
        localStorage.setItem("token", "temporary-token");
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/";
        return;
      }

      setError("Invalid credentials or backend not available.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "#4caf50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
        )}

        <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#ffffffff" }}>
          <p>💡 Temporary accounts you can use:</p>
          <ul>
            {/* <li><b>Email:</b> admin@test.com | <b>Password:</b> 123456</li> */}
            <li><b>username:</b> user | <b>Password:</b> 123456 (inline)</li>
            <li><b>username:</b> testuser | <b>Password:</b> password (if u are using Rafael's cluster use this one from the db)</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
