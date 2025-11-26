import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AddSongPageNext() {
    const { state } = useLocation();
    const { songCount, albumId, userId } = state;

    const [songs, setSongs] = useState(
        Array.from({ length: songCount }, () => ({
            name: "",
            file: null
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (let i = 0; i < songs.length; i++) {
            const formData = new FormData();
            formData.append("name", songs[i].name);
            formData.append("file", songs[i].file);

            const order = i + 1;

            await axios.post(
                `http://localhost:8080/api/albums/${albumId}`,
                formData,
                {
                    params: {
                        userId: userId,
                        order: order
                    },
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
        }
        alert("Songs uploaded!");
    };

    return (
        <form className="add-songs-to-album" onSubmit={handleSubmit}>
            {songs.map((song, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                    <h3>Song {index + 1}</h3>

                    <label>Name:</label>
                    <input
                        type="text"
                        value={song.name}
                        onChange={(e) =>
                            handleNameChange(index, e.target.value)
                        }
                    />

                    <br />

                    <label>Upload Audio:</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                        }
                    />
                </div>
            ))}

            <button type="submit">Upload All Songs</button>
        </form>
    );
}
