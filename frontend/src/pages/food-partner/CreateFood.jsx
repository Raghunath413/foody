import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api, { errorMessage } from "../../api/axios.js";
import "../../styles/create-food.css";

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export default function CreateFood() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Video preview URL banana / saaf karna
    useEffect(() => {
        if (!file) return setPreview("");
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    function onFileChange(e) {
        const f = e.target.files?.[0];
        setError("");
        if (!f) return setFile(null);
        if (!f.type.startsWith("video/")) {
            setError("Please select a valid video file");
            return setFile(null);
        }
        if (f.size > 100 * 1024 * 1024) {
            setError("Video must be under 100 MB");
            return setFile(null);
        }
        setFile(f);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file) return setError("Please choose a video");

        setError("");
        setLoading(true);
        try {
            // 1) Backend se short-lived upload signature lo
            const { data: auth } = await api.get("/food/upload-auth");

            // 2) Video browser se seedha ImageKit par upload karo
            const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".mp4";
            const ikForm = new FormData();
            ikForm.append("file", file);
            ikForm.append("fileName", `${crypto.randomUUID()}${ext}`);
            ikForm.append("folder", "/food-view");
            ikForm.append("publicKey", auth.publicKey);
            ikForm.append("signature", auth.signature);
            ikForm.append("expire", String(auth.expire));
            ikForm.append("token", auth.token);

            const { data: uploaded } = await axios.post(IMAGEKIT_UPLOAD_URL, ikForm, {
                onUploadProgress: (p) => p.total && setProgress(Math.round((p.loaded * 100) / p.total)),
            });

            // 3) Sirf URL + details apne backend ko bhejo
            await api.post("/food", {
                name,
                description,
                video: uploaded.url,
                videoFileId: uploaded.fileId,
            });
            navigate("/food-partner/dashboard");
        } catch (err) {
            if (err?.response?.status === 401) return navigate("/food-partner/login");
            setError(errorMessage(err));
        } finally {
            setLoading(false);
            setProgress(0);
        }
    }

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <div className="create-food-header">
                    <Link to="/food-partner/dashboard" className="back-link">← Back</Link>
                    <h1>Create food reel</h1>
                    <p>Upload a short video, give it a name, and add a description.</p>
                </div>

                <form onSubmit={handleSubmit} className="create-food-form">
                    <label className={`file-drop ${file ? "has-file" : ""}`}>
                        <input type="file" accept="video/*" onChange={onFileChange} hidden />
                        {preview ? (
                            <video src={preview} className="file-preview" controls muted playsInline />
                        ) : (
                            <div className="file-drop-inner">
                                <span className="file-drop-icon">🎬</span>
                                <strong>Tap to upload video</strong>
                                <small>MP4, WebM, MOV • up to 100 MB</small>
                            </div>
                        )}
                    </label>
                    {file && (
                        <div className="file-meta">
                            <span>{file.name}</span>
                            <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                            <button type="button" onClick={() => setFile(null)}>Remove</button>
                        </div>
                    )}

                    <label>
                        Name
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spicy Paneer Wrap" required />
                    </label>
                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Ingredients, taste, price..."
                        />
                    </label>

                    {error && <p className="form-error">{error}</p>}
                    {loading && (
                        <div className="progress">
                            <div className="progress-bar" style={{ width: `${progress}%` }} />
                            <span>{progress < 100 ? `Uploading ${progress}%` : "Processing..."}</span>
                        </div>
                    )}

                    <button className="btn btn-primary" disabled={loading || !file || !name.trim()}>
                        {loading ? "Saving..." : "Save food"}
                    </button>
                </form>
            </div>
        </div>
    );
}
