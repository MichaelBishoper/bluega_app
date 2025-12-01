import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AddSongPageNext() {
    // Add this ABOVE your component or at the bottom of the file:

const styles = {
    container: {
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif"
    },
    songBlock: {
        marginBottom: "25px",
        padding: "15px",
        borderRadius: "8px",
        border: "1px solid #0334a8ad",
        backgroundColor: "#000000d0"
    },
    label: {
        fontWeight: "bold",
        display: "block",
        marginBottom: "6px",
        marginTop: "10px"
    },
    inputText: {
        width: "85%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc"
    },
    inputFile: {
        marginTop: "5px",
        marginBottom: "10px"
    },
    uploadBtn: {
        marginTop: "10px",
        color: "white",
        padding: "8px 14px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    }
};

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
        <div style={styles.container}>
            {songs.map((song, index) => (
                <div key={index} style={styles.songBlock}>
                    <h3>Song {index + 1}</h3>

                    <label style={styles.label}>Name:</label>
                    <input
                        type="text"
                        style={styles.inputText}
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
                        style={styles.inputFile}
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
