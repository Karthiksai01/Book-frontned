import { useState } from "react";
import { runAgent } from "../api/api";
import UploadBox from "./UploadBox";

export default function ChatWindow({
    userId,
    activeDoc,
    chat = [],
    setChat,
    reloadDocs,
}) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    /* ===========================
       ✅ SEND DOCUMENT CHAT
    ============================ */
    const handleSend = async () => {
        if (!activeDoc) {
            alert("Select a document first!");
            return;
        }

        if (!query.trim()) return;

        const userMessage = { role: "user", type: "text", text: query };

        setChat((prev) => [...prev, userMessage]);
        setQuery("");
        setLoading(true);

        try {
            const res = await runAgent({
                user_id: userId,
                document_id: activeDoc.document_id,
                agent_type: "chat",
                user_query: userMessage.text,
            });

            setChat((prev) => [
                ...prev,
                {
                    role: "ai",
                    type: "text",
                    text: res?.result || res?.error || "No response",
                },
            ]);
        } catch (err) {
            setChat((prev) => [
                ...prev,
                {
                    role: "ai",
                    type: "text",
                    text: "❌ Something went wrong.",
                },
            ]);
        }

        setLoading(false);
    };

    /* ===========================
       ✅ SAFE YOUTUBE ID PARSER
    ============================ */
    const extractYoutubeId = (link) => {
        if (!link || typeof link !== "string") return "";

        try {
            if (link.includes("watch?v=")) {
                return link.split("watch?v=")[1]?.split("&")[0] || "";
            }

            if (link.includes("youtu.be/")) {
                return link.split("youtu.be/")[1]?.split("?")[0] || "";
            }
        } catch {
            return "";
        }

        return "";
    };

    return (
        <div className="chat-window">
            {/* ================= TOP BAR ================= */}
            <div className="chat-top">
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: 0 }}>
                        {activeDoc ? activeDoc.filename : "Select a document to start"}
                    </h3>

                    <p style={{ margin: 0, fontSize: "12px", opacity: 0.6 }}>
                        Upload your document here
                    </p>
                </div>

                <div style={{ width: "280px" }}>
                    <UploadBox userId={userId} reloadDocs={reloadDocs} />
                </div>
            </div>

            {/* ================= CHAT AREA ================= */}
            <div className="chat-messages">
                {Array.isArray(chat) &&
                    chat.map((m, i) => (
                        <div key={i} className={`msg-bubble ${m.role}`}>
                            {/* ===== AUDIO MESSAGE ===== */}
                            {m.type === "audio" ? (
                                <>
                                    <p>
                                        🎧 Voice Note {m.cached ? "(Cached ✅)" : ""}
                                    </p>

                                    <audio controls style={{ width: "100%" }}>
                                        <source src={m.audioUrl} type="audio/mpeg" />
                                    </audio>

                                    <details style={{ marginTop: "10px" }}>
                                        <summary>Show Script</summary>
                                        <p style={{ whiteSpace: "pre-wrap" }}>
                                            {m.script}
                                        </p>
                                    </details>
                                </>
                            ) : m.type === "reference" ? (
                                <>
                                    {/* ===== Websites ===== */}
                                    <h4>📌 Websites</h4>

                                    {Array.isArray(m.websites) &&
                                        m.websites.map((item, idx) => {
                                            const link =
                                                typeof item?.link === "string"
                                                    ? item.link
                                                    : item?.url || "";

                                            return (
                                                <a
                                                    key={idx}
                                                    href={link || "#"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "12px",
                                                        background: "#1f2937",
                                                        padding: "12px",
                                                        borderRadius: "10px",
                                                        color: "white",
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <b>{item?.title || "Open Website"}</b>
                                                    <p
                                                        style={{
                                                            margin: "6px 0",
                                                            opacity: 0.8,
                                                        }}
                                                    >
                                                        {item?.snippet || ""}
                                                    </p>
                                                    <small>{link}</small>
                                                </a>
                                            );
                                        })}

                                    {/* ===== YouTube ===== */}
                                    <h4 style={{ marginTop: "20px" }}>
                                        🎥 YouTube Videos
                                    </h4>

                                    {Array.isArray(m.youtube) &&
                                        m.youtube.map((item, idx) => {
                                            const link =
                                                typeof item?.link === "string"
                                                    ? item.link
                                                    : item?.url || "";

                                            const videoId = extractYoutubeId(link);

                                            const thumbnail = videoId
                                                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                                                : "";

                                            return (
                                                <a
                                                    key={idx}
                                                    href={link || "#"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        display: "flex",
                                                        gap: "12px",
                                                        alignItems: "center",
                                                        marginBottom: "12px",
                                                        background: "#111827",
                                                        padding: "12px",
                                                        borderRadius: "12px",
                                                        color: "white",
                                                        textDecoration: "none",
                                                        border: "1px solid #374151",
                                                    }}
                                                >
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
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
                                                                background: "#374151",
                                                                borderRadius: "10px",
                                                            }}
                                                        />
                                                    )}

                                                    <div>
                                                        <b>{item?.title || "YouTube Video"}</b>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                opacity: 0.8,
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            {item?.snippet || ""}
                                                        </p>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                </>
                            ) : (
                                <p style={{ whiteSpace: "pre-wrap" }}>
                                    {m.text}
                                </p>
                            )}
                        </div>
                    ))}

                {loading && (
                    <div className="msg-bubble ai">
                        <p>⏳ Generating response...</p>
                    </div>
                )}
            </div>

            {/* ================= INPUT ================= */}
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
