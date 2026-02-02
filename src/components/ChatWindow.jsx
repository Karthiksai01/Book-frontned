import { useState } from "react";
import { runAgent } from "../api/api";
import UploadBox from "./UploadBox";

export default function ChatWindow({
    userId,
    activeDoc,
    chat,
    setChat,
    runChatAgent,
    reloadDocs, // ✅ NEW (to refresh docs after upload)
}) {
    const [query, setQuery] = useState("");

    // ✅ Send normal RAG chat message
    const handleSend = async () => {
        if (!activeDoc) {
            alert("Select a document first!");
            return;
        }

        if (!query.trim()) return;

        setChat((prev) => [...prev, { role: "user", type: "text", text: query }]);

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
            {/* ✅ Top Bar */}
            <div className="chat-top">
                {/* ✅ Left: Filename */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ margin: 0 }}>
                        {activeDoc ? activeDoc.filename : "Select a document to start"}
                    </h3>

                    <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
                        Upload your document here
                    </p>
                </div>

                {/* ✅ Right: Upload Box */}
                <div style={{ width: "280px" }}>
                    <UploadBox userId={userId} reloadDocs={reloadDocs} />
                </div>
            </div>

            {/* ✅ Messages */}
            <div className="chat-messages">
                {chat.map((m, i) => (
                    <div key={i} className={`msg-bubble ${m.role}`}>
                        {/* ✅ Audio */}
                        {m.type === "audio" ? (
                            <>
                                <p style={{ marginBottom: "10px" }}>
                                    🎧 Voice Note Ready {m.cached ? "(Cached ✅)" : ""}
                                </p>

                                <audio controls style={{ width: "100%" }}>
                                    <source src={m.audioUrl} type="audio/mpeg" />
                                </audio>

                                <details style={{ marginTop: "10px" }}>
                                    <summary style={{ cursor: "pointer" }}>Show Script</summary>
                                    <p style={{ whiteSpace: "pre-wrap" }}>{m.script}</p>
                                </details>
                            </>
                        ) : m.type === "reference" ? (
                            <>
                                <h4 style={{ marginBottom: "10px" }}>📌 Websites</h4>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {m.websites.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.link}
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
                                            <b>{item.title}</b>
                                            <p style={{ margin: "6px 0", opacity: 0.85 }}>
                                                {item.snippet}
                                            </p>
                                            <small style={{ opacity: 0.7 }}>{item.link}</small>
                                        </a>
                                    ))}
                                </div>

                                <h4 style={{ margin: "18px 0 10px" }}>🎥 YouTube Videos</h4>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {m.youtube.map((item, idx) => {
                                        let videoId = "";

                                        if (item.includes("watch?v=")) {
                                            videoId = item.split("watch?v=")[1].split("&")[0];
                                        } else if (item.includes("youtu.be/")) {
                                            videoId = item.split("youtu.be/")[1].split("?")[0];
                                        }

                                        const thumb = videoId
                                            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                                            : "";

                                        return (
                                            <a
                                                key={idx}
                                                href={item.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    alignItems: "center",
                                                    background: "#111827",
                                                    padding: "12px",
                                                    borderRadius: "12px",
                                                    color: "white",
                                                    textDecoration: "none",
                                                    border: "1px solid #374151",
                                                }}
                                            >
                                                {thumb ? (
                                                    <img
                                                        src={thumb}
                                                        alt="thumbnail"
                                                        style={{
                                                            width: "110px",
                                                            height: "70px",
                                                            borderRadius: "10px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "110px",
                                                            height: "70px",
                                                            borderRadius: "10px",
                                                            background: "#374151",
                                                        }}
                                                    />
                                                )}

                                                <div>
                                                    <b style={{ display: "block", marginBottom: "6px" }}>
                                                        {item.title}
                                                    </b>
                                                    <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
                                                        {item.snippet}
                                                    </p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Input */}
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
