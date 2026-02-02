import { useState } from "react";
import { runAgent } from "../api/api";

export default function DoubtPanel({ isOpen, onClose, userId, activeDoc }) {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);

    if (!isOpen) return null;

    const handleAsk = async () => {
        if (!query.trim()) return;

        const userMsg = { role: "user", text: query };
        setMessages((prev) => [...prev, userMsg]);

        const payload = {
            user_id: userId,
            document_id: activeDoc?.document_id || "no_doc",
            agent_type: "doubt",
            user_query: query,
        };

        setQuery("");

        const res = await runAgent(payload);

        const aiMsg = {
            role: "ai",
            text: res.result || res.error || "No response",
        };

        setMessages((prev) => [...prev, aiMsg]);
    };

    return (
        <div className="overlay">
            {/* ✅ Blur Background */}
            <div className="overlay-bg" onClick={onClose}></div>

            {/* ✅ Panel */}
            <div className="overlay-panel">
                <div className="overlay-top">
                    <h2>💡 Doubt Clarifier</h2>
                    <button className="close-btn" onClick={onClose}>
                        ✖
                    </button>
                </div>

                <div className="overlay-body">
                    {messages.length === 0 ? (
                        <p style={{ opacity: 0.7 }}>
                            Ask any doubt like:
                            <br />✅ React Hooks explanation
                            <br />✅ JWT flow
                            <br />✅ What is RAG
                        </p>
                    ) : (
                        messages.map((m, i) => (
                            <div key={i} className={`msg-bubble ${m.role}`}>
                                {m.text}
                            </div>
                        ))
                    )}
                </div>

                <div className="overlay-input">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask your doubt..."
                        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    />
                    <button onClick={handleAsk}>Ask</button>
                </div>
            </div>
        </div>
    );
}
