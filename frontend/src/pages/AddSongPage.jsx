import React, { useState } from "react";
import axios from "axios";
import API_URL from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../css/AddSongPage.css";

export default function AddSongPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [type, setType] = useState("");
  const [songCount, setSongCount] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser?.id;

  const getCountLimits = (t) => {
    if (t === "ep") return { min: 2, max: 5 };
    if (t === "lp") return { min: 6, max: 20 };
    return null; // single
  };

  const limits = getCountLimits(type);

  if (!userId) {
    alert("You must be logged in to upload an album.");
    navigate("/login");
    return;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type) {
      alert("Please select album type.");
      return;
    }

    const finalCount = type === "single" ? 1 : Number(songCount);

    if (type === "ep" || type === "lp") {
      const { min, max } = getCountLimits(type);
      if (!Number.isInteger(finalCount) || finalCount < min || finalCount > max) {
        alert(`Song count for ${type.toUpperCase()} must be ${min}-${max}.`);
        return;
      }
    }

    const albumData = {
      title,
      artist,
      type: type.toLowerCase(),
      songCount: finalCount,
    };

    const formData = new FormData();
    formData.append("albumData", JSON.stringify(albumData));
    if (coverFile) formData.append("image", coverFile);

    try {
      // IMPORTANT: do NOT force multipart header; axios will add boundary
      const res = await axios.post(
        `${API_URL}/api/albums?userId=${userId}`,
        formData
      );

      const createdAlbumId = res?.data?.id;

      if (!createdAlbumId) {
        alert("Album create request succeeded but no album id returned.");
        return;
      }

      alert("Container album created successfully!");

      navigate("/add-song/next", {
        state: {
          songCount: finalCount,
          albumId: createdAlbumId,
          userId,
        },
      });
    } catch (err) {
      console.error(err);

      const status = err.response?.status;
      const data = err.response?.data;

      // Optional: if backend returns an album id even on error, try cleanup
      const maybeAlbumId = data?.id || data?.albumId;
      if (maybeAlbumId) {
        try {
          await axios.delete(`${API_URL}/api/albums/${maybeAlbumId}`);
        } catch (_) {
          // ignore cleanup failure
        }
      }

      alert(`Failed to create container album!${status ? ` (HTTP ${status})` : ""}`);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <form className="create-container-album" onSubmit={handleSubmit}>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <img
          src="picture/bluga.png"
          alt="Logo"
          style={{
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", textAlign: "center", fontWeight: "600" }}>
        Upload Your Album
      </h2>

      <label>Title: </label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <br />

      <label>Artist: </label>
      <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} required />
      <br />

      Type:
      <input type="radio" name="album" value="single" required onChange={(e) => setType(e.target.value)} />
      Single
      <input type="radio" name="album" value="ep" required onChange={(e) => setType(e.target.value)} />
      EP
      <input type="radio" name="album" value="lp" required onChange={(e) => setType(e.target.value)} />
      LP
      <br />

      {(type === "ep" || type === "lp") && (
        <>
          <label>Song Count: </label>
          <input
            type="number"
            min={limits.min}
            max={limits.max}
            step="1"
            value={songCount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") return setSongCount("");
              const num = Number(val);
              if (Number.isInteger(num)) setSongCount(val);
            }}
            required
          />
          <small>Allowed: {limits.min} – {limits.max}</small>
          <br />
        </>
      )}

      <label>Upload Cover: (Size 3000 x 3000)</label>
      <input
        type="file"
        accept="image/*"
        required
        onChange={(e) => {
          const file = e.target.files[0];
          setCoverFile(file);
          if (file) setPreviewUrl(URL.createObjectURL(file));
        }}
      />
      <br />

      <p>Preview:</p>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Album Cover Preview"
          style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px", marginTop: "10px" }}
        />
      )}
      <br />

      <button type="button" onClick={handleCancel}>
        Back to MainLayout (Abandon)
      </button>

      <button type="submit" disabled={!userId}>
        Next
      </button>
    </form>
  );
}
