import React, { useState } from "react";
import axios from "axios";

export default function AddSongPage() {
    const [title, setTitle] = useState(""); // -> Album NAME
    const [type, setType] = useState(""); // -> Album TYPE
    const [songCount, setSongCount] = useState("");  // -> Song COUNT
    const [coverFile, setCoverFile] = useState(null); // -> Album COVER IMAGE
    const [previewUrl, setPreviewUrl] = useState(null); // -> Preview COVER IMAGE

    const userId = "6904dbd7895a745ddce4f1da";

    const handleSubmit = async (e) => {
        e.preventDefault();

        // albumData JSON
        const albumData = {
            title: title,
            type: type.toLowerCase(),
            songCount: Number(songCount)
        };

        const formData = new FormData();
        formData.append("albumData", JSON.stringify(albumData));
        if (coverFile) {
            formData.append("image", coverFile);
        }

        try {
            const res = await axios.post (
                `http://localhost:8080/api/albums?userId=${userId}`,
                formData,
                  {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Album created:", res.data);
            alert("Container album created successfully!");

            // Redirect to next page -> song upload

        } catch (err) {
            console.error(err)
            alert("Failed to create container album!")
        }   
    };

    return(
        <form className="create-container-album" onSubmit={handleSubmit}> 
            
            <label>Title: </label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <br />

            Type:
            <input type="radio" name="album" value="single"
                onChange={(e) => setType(e.target.value)} />
            Single

            <input type="radio" name="album" value="ep"
                onChange={(e) => setType(e.target.value)} />
            EP

            <input type="radio" name="album" value="lp"
                onChange={(e) => setType(e.target.value)} />
            LP
            <br />

            <label>Song Count: </label>
            <input
                type="number"
                value={songCount}
                onChange={(e) => setSongCount(e.target.value)}
            />
            <br />

            <label>Upload Cover: </label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    setCoverFile(file);

                    // Preview
                    if (file) {
                        const preview = URL.createObjectURL(file);
                        setPreviewUrl(preview);
                    }
                }}
                
            />
            <br />
            <>
                <p> Preview: </p>
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Album Cover Preview"
                        style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginTop: "10px"
                        }}
                    />
                )}
            </>
            <br />

            <button type="reset">Cancel</button>
            <button type="submit">Next</button>

        </form>
    );
}