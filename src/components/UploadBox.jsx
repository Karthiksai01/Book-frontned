import { useState, useEffect } from "react";
import { uploadDoc } from "../api/api";

export default function UploadBox({ userId, reloadDocs }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Auto clear status after 5 seconds
    useEffect(() => {
        if (!status) return;

        const timer = setTimeout(() => {
            setStatus("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [status]);

    const handleUpload = async () => {
        if (!file) {
            setStatus("❌ Please select a file first.");
            return;
        }

        try {
            setLoading(true);
            setStatus("⏳ Uploading...");

            const res = await uploadDoc(userId, file);

            if (res?.error) {
                setStatus("❌ " + res.error);
                return;
            }

            setStatus("✅ Uploaded successfully!");

            // refresh document list
            if (reloadDocs) await reloadDocs();

            // clear file input
            setFile(null);
        } catch (err) {
            console.error(err);
            setStatus("❌ Upload failed. Check backend console.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="upload-topbar">
            <input
                className="upload-file"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                    setFile(e.target.files[0]);
                    setStatus("");
                }}
            />

            <button className="upload-btn" onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>

            {status && <p className="upload-status">{status}</p>}
        </div>
    );
}
