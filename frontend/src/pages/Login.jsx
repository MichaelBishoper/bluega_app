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
import { Navigate, Link } from "react-router-dom";
import API_URL from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in
  const token = sessionStorage.getItem("token");
  if (token) {
    // Redirect to home page if already logged in
    return <Navigate to="/" replace />;
  }

  // Temporary local account (for frontend-only testing)
  const tempAccounts = [
    { username: "user", password:"123456"} // we dont have roles in backend OK!
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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

    // we use sessionStorage to store token and user info, since we dont have real tokens from backend
    // sessionStorage.setItem("token", "temporary-token"); // in real app, use token from backend
    sessionStorage.setItem("token", "temporary-token"); // in real app, use token from backend
    sessionStorage.setItem("user", JSON.stringify(user)); // this sets the entire user object from backend to sessionStorage

    window.location.href = "/";
    return;

    } catch (err) {
      console.warn("Backend unreachable. Trying local fallback...");

      const user = tempAccounts.find(
        (acc) => acc.username === username && acc.password === password
      );

      if (user) {
        sessionStorage.setItem("token", "temporary-token");
        sessionStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/";
        return;
      }

      setError("Invalid credentials or backend not available.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div 
    style={{ 
      maxWidth: 400, 
      margin: "auto", 
      padding: "2rem",
      marginTop: "5vh",        // shift lower
      marginBottom: "5vh",     // extra space bottom
      textAlign: "center"      // center everything
    }}
  >

    {/* Centered Logo */}
    <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
      <img
        src="picture/bluga.png"
        alt="Logo"
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          cursor: "pointer",
        }}
      />
    </Link>

    <h2 style={{ marginTop: "0.5rem", fontSize: "1.8rem", fontWeight: "600" }}>
      Login
    </h2>

    <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
      
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
      padding: "0.65rem",        
      borderRadius: "10px",       
      border: "1px solid #006adbff",
      fontSize: "0.95rem",       
      marginTop: "0.3rem",
      boxSizing: "border-box"
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
      padding: "0.65rem",        
      borderRadius: "10px",       
      border: "1px solid #006adbff",
      fontSize: "0.95rem",       
      marginTop: "0.3rem",
      boxSizing: "border-box"
    }}
  />
</div>


<button
  type="submit"
  disabled={loading}
  style={{
    width: "100%",
    padding: "0.6rem",      // MATCH password input
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "8px",    // MATCH password input
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    boxSizing: "border-box"
  }}
>
  {loading ? "Logging in..." : "Login"}
</button>



      {/* Error */}
      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
      )}

      {/* Signup link */}
      <div style={{ marginTop: "1rem" }}>
        <p>
          Don't have an account? 
          <Link to="/signup" style={{ color: "#2196f3", fontWeight: "bold" }}>
            {" "}Sign up here
          </Link>
        </p>
      </div>

      {/* Info */}
      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#fff" }}>
        <p>💡 Temporary accounts you can use:</p>
        <ul style={{ textAlign: "left" }}>
          <li><b>username:</b> user | <b>Password:</b> 123456 (inline)</li>
          <li><b>username:</b> testuser | <b>Password:</b> password</li>
        </ul>
      </div>

    </form>
  </div>
);

}
