import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_URL from "../utils/api";

export default function AddSongPageNext() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || null;
  const albumId = state?.albumId;
  const userId = state?.userId;
  const songCount = Number(state?.songCount || 0);

  const [albumArtist, setAlbumArtist] = useState("");
  const [warning, setWarning] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [songs, setSongs] = useState(() =>
    Array.from({ length: songCount }, () => ({
      title: "",
      file: null,
      uploaded: false,
      uploading: false,
      error: "",
    }))
  );

  // keep hooks un-conditional
  useEffect(() => {
    setSongs(
      Array.from({ length: songCount }, () => ({
        title: "",
        file: null,
        uploaded: false,
        uploading: false,
        error: "",
      }))
    );
  }, [songCount]);

  useEffect(() => {
    if (!albumId) return;

    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/albums/${albumId}`);
        setAlbumArtist(res.data.artist);
      } catch (err) {
        console.error("Failed to fetch album:", err);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const uploadedCount = useMemo(() => songs.filter((s) => s.uploaded).length, [songs]);
  const allUploaded = songCount > 0 && uploadedCount === songCount;

  const handleTitleChange = (i, value) => {
    const updated = [...songs];
    updated[i].title = value;
    updated[i].error = "";
    setSongs(updated);
  };

  const handleFileChange = (i, file) => {
    const updated = [...songs];
    updated[i].file = file;
    updated[i].error = "";
    setSongs(updated);
  };

  const uploadSingleSong = async (i) => {
    setWarning("");

    const song = songs[i];
    if (!song.title || !song.file) {
      alert("Please enter a title and choose a file.");
      return;
    }

    const updatedStart = [...songs];
    updatedStart[i].uploading = true;
    updatedStart[i].error = "";
    setSongs(updatedStart);

    const formData = new FormData();
    formData.append("songData", JSON.stringify({ title: song.title, artist: albumArtist }));
    formData.append("audio", song.file);

    const order = i + 1;

    try {
      await axios.post(`${API_URL}/api/albums/${albumId}/songs`, formData, {
        params: { order, userId },
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = [...songs];
      updated[i].uploaded = true;
      updated[i].uploading = false;
      updated[i].error = "";
      setSongs(updated);
    } catch (err) {
      console.error(err);

      const updated = [...songs];
      updated[i].uploaded = false;
      updated[i].uploading = false;
      updated[i].error = "Upload failed. Fix and retry.";
      setSongs(updated);

      setWarning("At least one song upload failed. You must upload all songs before finishing the album.");
    }
  };

  const deleteContainerAlbum = async () => {
    await axios.delete(`${API_URL}/api/albums/${albumId}`);
  };

  const backToEditAlbum = async () => {
    const ok = window.confirm(
      "Go back to edit album?\n\nThis will delete the container album. Already-uploaded audio may remain in S3 if backend does not clean it up."
    );
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deleteContainerAlbum();
      navigate("/add-song"); // change if needed
    } catch (err) {
      console.error(err);
      alert("Failed to delete container album. Cannot go back safely.");
    } finally {
      setIsDeleting(false);
    }
  };

  const abandonToMainLayout = async () => {
    const ok = window.confirm(
      "Abandon upload?\n\nThis will delete the container album. Already-uploaded audio may remain in S3 if backend does not clean it up."
    );
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deleteContainerAlbum();
    } catch (err) {
      console.error(err);
      // still go home
    } finally {
      setIsDeleting(false);
      navigate("/");
    }
  };

  const finishAlbum = () => {
    if (!allUploaded) {
      setWarning("You must upload all songs before finishing the album.");
      return;
    }
    alert("Album complete!");
    navigate("/");
  };

  if (!state || !albumId || !userId || !songCount) {
    return <p>Error: No album information provided.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
        <button onClick={backToEditAlbum} disabled={isDeleting}>
          Back to Edit Album
        </button>

        <button onClick={abandonToMainLayout} disabled={isDeleting}>
          Back to MainLayout (Abandon)
        </button>

        <button onClick={finishAlbum} disabled={!allUploaded || isDeleting}>
          Finish Album ({uploadedCount}/{songCount})
        </button>
      </div>

      {warning && (
        <div style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ffcc00", background: "#fff3cd", color: "#000", marginBottom: "15px" }}>
          {warning}
        </div>
      )}

      {songs.map((song, index) => (
        <div key={index} style={{ marginBottom: "25px", padding: "15px", borderRadius: "8px", border: "1px solid #0334a8ad", backgroundColor: "#000000d0" }}>
          <h3>Song {index + 1}</h3>

          <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px", marginTop: "10px" }}>Name:</label>
          <input
            type="text"
            style={{ width: "85%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            value={song.title}
            disabled={song.uploaded || song.uploading || isDeleting}
            onChange={(e) => handleTitleChange(index, e.target.value)}
          />

          <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px", marginTop: "10px" }}>Upload Audio:</label>
          <input
            type="file"
            accept="audio/*"
            disabled={song.uploaded || song.uploading || isDeleting}
            onChange={(e) => handleFileChange(index, e.target.files[0])}
          />

          {song.error && <div style={{ color: "yellow", marginTop: "8px" }}>{song.error}</div>}

          <button
            onClick={() => uploadSingleSong(index)}
            disabled={song.uploaded || song.uploading || isDeleting}
            style={{
              marginTop: "10px",
              backgroundColor: song.uploaded ? "gray" : "blue",
              color: "white",
              padding: "5px 12px",
              cursor: song.uploaded ? "not-allowed" : "pointer",
            }}
          >
            {song.uploaded ? "Uploaded ✓" : song.uploading ? "Uploading..." : "Upload Song"}
          </button>
        </div>
      ))}
    </div>
  );
}
