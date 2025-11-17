import React, { useState, useRef } from "react";
import "../css/AlbumUpload.css";

export default function AlbumUpload() {
  const [step, setStep] = useState(1);

  const [albumName, setAlbumName] = useState("");
  const [albumType, setAlbumType] = useState("");
  const [songCount, setSongCount] = useState(1);
  const [artFile, setArtFile] = useState(null);
  const artPreviewRef = useRef(null);

  const [songs, setSongs] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  function handleArtChange(e) {
    const f = e.target.files?.[0];
    setArtFile(f || null);
    if (f && artPreviewRef.current) {
      artPreviewRef.current.src = URL.createObjectURL(f);
    }
  }

  function initSongs() {
    const n = parseInt(songCount) || 1;
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({ name: "", file: null });
    }
    setSongs(arr);
  }

  function goNextFromStep1() {
    initSongs();
    setStep(2);
  }

  function updateSongName(i, v) {
    const c = [...songs];
    c[i].name = v;
    setSongs(c);
  }

  function updateSongFile(i, f) {
    const c = [...songs];
    c[i].file = f || null;
    setSongs(c);
  }

  function handleConfirm() {
    setConfirmed(true);
    setStep(3);
  }

  function handleCancel() {
    setAlbumName("");
    setAlbumType("");
    setSongCount(1);
    setArtFile(null);
    setSongs([]);
    if (artPreviewRef.current) artPreviewRef.current.src = "";
    setConfirmed(false);
    setStep(1);
  }

  return (
    <div className="albumupload-container">
      <h2 className="au-title">Create an Album</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="au-card">
          <h3 className="au-section-title">Album Details</h3>

          <div className="au-field">
            <label>Album Name</label>
            <input
              className="au-input"
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Enter album name..."
            />
          </div>

          <div className="au-field">
            <label>Album Type</label>
            <div className="au-radio-row">
              <label>
                <input
                  type="radio"
                  name="atype"
                  checked={albumType === "single"}
                  onChange={() => setAlbumType("single")}
                />
                Single
              </label>
              <label>
                <input
                  type="radio"
                  name="atype"
                  checked={albumType === "ep"}
                  onChange={() => setAlbumType("ep")}
                />
                EP
              </label>
              <label>
                <input
                  type="radio"
                  name="atype"
                  checked={albumType === "lp"}
                  onChange={() => setAlbumType("lp")}
                />
                LP
              </label>
            </div>
          </div>

          <div className="au-field">
            <label>Song Count</label>
            <input
              className="au-input"
              type="number"
              min="1"
              value={songCount}
              onChange={(e) => setSongCount(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="au-field">
            <label>Upload Album Art</label>
            <input className="au-input-file" type="file" accept="image/*" onChange={handleArtChange} />
          </div>

          <div className="au-field">
            <label>Preview:</label>
            <div className="au-art-box">
              {artFile ? (
                <img ref={artPreviewRef} className="au-art-preview" alt="album art preview" />
              ) : (
                <div className="au-art-placeholder">No Art Selected</div>
              )}
            </div>
          </div>

          <div className="au-actions">
            <button className="au-btn" onClick={handleCancel}>Cancel</button>
            <button
              className="au-btn primary"
              disabled={!albumName || !albumType || !songCount}
              onClick={goNextFromStep1}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="au-card">
          <h3 className="au-section-title">Upload Songs</h3>
          <p className="au-desc">Fill in all songs according to the number you entered.</p>

          {songs.map((s, i) => (
            <div key={i} className="au-song-row">
              <div>
                <label>Song {i + 1} Name</label>
                <input
                  className="au-input"
                  type="text"
                  value={s.name}
                  onChange={(e) => updateSongName(i, e.target.value)}
                />
              </div>
              <div>
                <label>Upload Audio</label>
                <input
                  className="au-input-file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => updateSongFile(i, e.target.files?.[0])}
                />
              </div>
            </div>
          ))}

          <div className="au-actions">
            <button className="au-btn" onClick={() => setStep(1)}>Previous</button>
            <button className="au-btn" onClick={handleCancel}>Cancel</button>
            <button className="au-btn primary" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="au-card">
          <h3 className="au-section-title">Confirmation</h3>

          {confirmed ? (
            <>
              <p className="au-confirm-msg">Songs uploaded (mock only).</p>

              <div className="au-summary">
                <p><b>Album:</b> {albumName}</p>
                <p><b>Type:</b> {albumType}</p>
                <p><b>Total Songs:</b> {songs.length}</p>
              </div>

              <div className="au-actions">
                <button className="au-btn" onClick={handleCancel}>Done</button>
                <button className="au-btn primary" onClick={() => { setConfirmed(false); setStep(1); }}>
                  Create Another
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="au-desc">Not confirmed yet.</p>
              <div className="au-actions">
                <button className="au-btn" onClick={() => setStep(2)}>Previous</button>
                <button className="au-btn primary" onClick={handleConfirm}>Confirm</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
