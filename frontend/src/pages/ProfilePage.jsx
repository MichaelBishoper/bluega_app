import React from "react";


export default function ProfilePage() {
return (
<div className="profile-container">
{/* === BANNER === */}
<div className="profile-banner"></div>


{/* === PROFILE INFO === */}
<div className="profile-info">
<img
src="https://via.placeholder.com/140"
alt="pfp"
className="profile-picture"
/>
<div>
<h2 className="profile-username">Your Username</h2>
</div>
</div>


{/* === SECTION: ALBUMS === */}
<section className="section">
<div className="section-header">
<h3>Albums</h3>
<button className="section-button">+ Upload Album</button>
</div>


<div className="grid">
{/* Existing album */}
<div className="card">
<div className="card-img" />
<p className="card-title">My First Album</p>
<p className="card-sub">1 Song</p>
</div>


{/* Upload placeholder */}
<div className="card placeholder">
<span>+</span>
</div>
</div>
</section>


{/* === SECTION: PLAYLISTS === */}
<section className="section">
<div className="section-header">
<h3>Your Playlists</h3>
<button className="section-button">+ New Playlist</button>
</div>


<div className="grid">
<div className="card">
<div className="card-img" />
<p className="card-title">Workout Corei3</p>
<p className="card-sub">12 Songs</p>
</div>


<div className="card placeholder">
<span>+</span>
</div>
</div>
</section>
</div>
);
}