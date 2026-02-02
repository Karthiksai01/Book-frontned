import { useState } from "react";
import { runAgent } from "../api/api";
import UploadBox from "./UploadBox";

export default function ChatWindow({
    userId,
    activeDoc,
    chat,
    setChat,
    reloadDocs,
}) {
    const [query, setQuery] = useState("");

    // =========================
    // 🔹 Normal Chat (RAG)
    // =========================
    const handleSend = async () => {
        if (!activeDoc) {
            alert("Select a document first!");
            return;
        }

        if (!query.trim()) return;

        setChat((prev) => [
            ...prev,
            { role: "user", type: "text", text: query },
        ]);

        const payload = {
            user_id: userId,
            document_id: activeDoc.document_id,
            agent_type: "chat",
            user_query: query,
        };

        setQuery("");

        const res = await runAgent(payload);

        setChat((prev) => [
            ...prev,
            {
                role: "ai",
                type: "text",
                text: res.result || res.error || "No response",
            },
        ]);
    };

    return (
        <div className="chat-window">
            {/* ========================= */}
            {/* 🔹 Top Bar */}
            {/* ========================= */}
            <div className="chat-top">
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ margin: 0 }}>
                        {activeDoc
                            ? activeDoc.filename
                            : "Select a document to start"}
                    </h3>

                    <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
                        Upload your document here
                    </p>
                </div>

                <div style={{ width: "280px" }}>
                    <UploadBox userId={userId} reloadDocs={reloadDocs} />
                </div>
            </div>

            {/* ========================= */}
            {/* 🔹 Messages */}
            {/* ========================= */}
            <div className="chat-messages">
                {chat.map((m, i) => (
                    <div key={i} className={`msg-bubble ${m.role}`}>
                        {/* ========================= */}
                        {/* 🔹 Audio Response */}
                        {/* ========================= */}
                        {m.type === "audio" ? (
                            <>
                                <p style={{ marginBottom: "10px" }}>
                                    🎧 Voice Note Ready {m.cached ? "(Cached ✅)" : ""}
                                </p>

                                <audio controls style={{ width: "100%" }}>
                                    <source src={m.audioUrl} type="audio/mpeg" />
                                </audio>

                                <details style={{ marginTop: "10px" }}>
                                    <summary style={{ cursor: "pointer" }}>
                                        Show Script
                                    </summary>
                                    <p style={{ whiteSpace: "pre-wrap" }}>{m.script}</p>
                                </details>
                            </>
                        ) : m.type === "reference" ? (
                            <>
                                {/* ========================= */}
                                {/* 🔹 Website Links */}
                                {/* ========================= */}
                                <h4 style={{ marginBottom: "10px" }}>📌 Websites</h4>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {m.websites?.length > 0 ? (
                                        m.websites.map((url, idx) => (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    background: "#1f2937",
                                                    padding: "12px",
                                                    borderRadius: "10px",
                                                    color: "white",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                {url}
                                            </a>
                                        ))
                                    ) : (
                                        <p>No websites found.</p>
                                    )}
                                </div>

                                {/* ========================= */}
                                {/* 🔹 YouTube Links */}
                                {/* ========================= */}
                                <h4 style={{ margin: "18px 0 10px" }}>
                                    🎥 YouTube Videos
                                </h4>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {m.youtube?.length > 0 ? (
                                        m.youtube.map((url, idx) => (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    background: "#111827",
                                                    padding: "12px",
                                                    borderRadius: "12px",
                                                    color: "white",
                                                    textDecoration: "none",
                                                    border: "1px solid #374151",
                                                }}
                                            >
                                                {url}
                                            </a>
                                        ))
                                    ) : (
                                        <p>No YouTube videos found.</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* ========================= */}
            {/* 🔹 Input */}
            {/* ========================= */}
            <div className="chat-input">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask something from your document..."
                    disabled={!activeDoc}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />
                <button onClick={handleSend} disabled={!activeDoc}>
                    Send
                </button>
            </div>
        </div>
    );
}
