import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AddSongPageNext() {
    const location = useLocation();
    const state = location.state;
    if (!state) {
        return <p>Error: No album information provided.</p>;
    }

    const { songCount, albumId, userId } = state;

    const [songs, setSongs] = useState(
        Array.from({ length: songCount }, () => ({
            name: "",
            file: null,
            uploaded: false
        }))
    );

    const handleNameChange = (i, value) => {
        const updated = [...songs];
        updated[i].name = value;
        setSongs(updated);
    };

    const handleFileChange = (i, file) => {
        const updated = [...songs];
        updated[i].file = file;
        setSongs(updated);
    };

    const uploadSingleSong = async (i) => {
        const song = songs[i];

        if (!song.name || !song.file) {
            alert("Please enter name and choose a file.");
            return;
        }

        const formData = new FormData();

        // Backend wants:
        // songData = JSON string
        formData.append("songData", JSON.stringify({ name: song.name }));

        // audio = the file
        formData.append("audio", song.file);

        const order = i + 1;

        await axios.post(
            `http://localhost:8080/api/albums/${albumId}/songs`,
            formData,
            {
                params: {
                    order: order,
                    userId: userId
                },
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        const updated = [...songs];
        updated[i].uploaded = true;
        setSongs(updated);

        alert(`Uploaded song ${order}`);
    };

    return (
        <div className="add-songs-to-album">
            {songs.map((song, index) => (
                <div key={index} style={{ marginBottom: "25px" }}>
                    <h3>Song {index + 1}</h3>

                    <label>Name:</label>
                    <input
                        type="text"
                        value={song.name}
                        disabled={song.uploaded}
                        onChange={(e) =>
                            handleNameChange(index, e.target.value)
                        }
                    />

                    <br />

                    <label>Upload Audio:</label>
                    <input
                        type="file"
                        accept="audio/*"
                        disabled={song.uploaded}
                        onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                        }
                    />

                    <br />

                    <button
                        onClick={() => uploadSingleSong(index)}
                        disabled={song.uploaded}
                        style={{
                            marginTop: "10px",
                            backgroundColor: song.uploaded ? "gray" : "blue",
                            color: "white",
                            padding: "5px 12px"
                        }}
                    >
                        {song.uploaded ? "Uploaded ✓" : "Upload Song"}
                    </button>
                </div>
            ))}
        </div>
    );
}
