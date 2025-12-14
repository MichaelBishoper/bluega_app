import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddSongPageNext() {

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
    const state = location.state || {};
    const { songCount = 0, albumId, userId } = state;
    // Album Artist State
    const [albumArtist, setAlbumArtist] = useState("");

    const [songs, setSongs] = useState(
        Array.from({ length: songCount }, () => ({
            title: "",
            file: null,
            uploaded: false
        }))
    );

        useEffect(() => {
        const fetchAlbum = async () => {
            try {
            const res = await axios.get(
                `http://localhost:8080/api/albums/${albumId}`
            );
            setAlbumArtist(res.data.artist);
            } catch (err) {
            console.error("Failed to fetch album:", err);
            }
        };

        fetchAlbum();
        }, [albumId]);


        if (!state) {
        return <p>Error: No album information provided.</p>;
    }



    const handleTitleChange = (i, value) => {
        const updated = [...songs];
        updated[i].title = value;
        setSongs(updated);
    };

    const handleFileChange = (i, file) => {
        const updated = [...songs];
        updated[i].file = file;
        setSongs(updated);
    };

    const uploadSingleSong = async (i) => {
        const song = songs[i];

        if (!song.title || !song.file) {
            alert("Please enter a title and choose a file.");
            return;
        }

        const formData = new FormData();

        // Backend wants:
        // songData = JSON string
        
        formData.append(
        "songData",
            JSON.stringify({
                title: song.title,
                artist: albumArtist
            })
        );

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
                            handleTitleChange(index, e.target.value)
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
