import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import AgentPanel from "../components/AgentPanel";
import { fetchDocuments, runAgent } from "../api/api";
import UploadBox from "../components/UploadBox";
import DoubtPanel from "../components/DoubtPanel";
export default function Dashboard() {
    const userId = "student1";

    const [docs, setDocs] = useState([]);
    const [activeDoc, setActiveDoc] = useState(null);
    const [openDoubt, setOpenDoubt] = useState(false);



    // ✅ Chat state moved here
    const [chat, setChat] = useState([]);

    const loadDocs = async () => {
        const res = await fetchDocuments(userId);
        setDocs(res.documents || []);
    };

    useEffect(() => {
        loadDocs();
    }, []);

    // ✅ Run any agent from right panel OR chat window
    const runChatAgent = async (agentType, userQuery = "") => {
        if (!activeDoc) {
            alert("Select a document first!");
            return;
        }

        const tempId = Date.now(); // unique id for replacement

        // 1️⃣ Show working message
        setChat((prev) => [
            ...prev,
            {
                id: tempId,
                role: "ai",
                type: "status",
                text: `⏳ ${agentType.toUpperCase()} agent is working...`,
            },
        ]);

        const payload = {
            user_id: userId,
            document_id: activeDoc.document_id,
            agent_type: agentType,
            user_query: userQuery || "Generate output from document",
        };

        try {
            const res = await runAgent(payload);

            // 2️⃣ Replace status with final response
            setChat((prev) =>
                prev.map((msg) => {
                    if (msg.id !== tempId) return msg;

                    // 🎧 Voice
                    if (agentType === "voice" && res?.result?.audio_url) {
                        return {
                            id: tempId,
                            role: "ai",
                            type: "audio",
                            audioUrl:
                                "http://127.0.0.1:8000" + res.result.audio_url,
                            script: res.result.script,
                            cached: res.result.cached,
                        };
                    }

                    // 📚 Reference
                    if (agentType === "reference" && res?.result?.websites) {
                        return {
                            id: tempId,
                            role: "ai",
                            type: "reference",
                            websites: Array.isArray(res.result.websites)
                                ? res.result.websites
                                : [],
                            youtube: Array.isArray(res.result.youtube)
                                ? res.result.youtube
                                : [],
                        };
                    }

                    // 🧠 Text (chat / summarize / doubt)
                    return {
                        id: tempId,
                        role: "ai",
                        type: "text",
                        text: res.result || res.error || "No response",
                    };
                })
            );
        } catch (err) {
            // 3️⃣ Error state
            setChat((prev) =>
                prev.map((msg) =>
                    msg.id === tempId
                        ? {
                            ...msg,
                            type: "error",
                            text: "❌ Agent failed. Please try again.",
                        }
                        : msg
                )
            );
        }
    };


    return (
        <div className="dashboard-layout">
            {/* ✅ Left - Docs */}
            <Sidebar
                docs={docs}
                setDocs={setDocs}     // ✅ ADD THIS LINE
                activeDoc={activeDoc}
                setActiveDoc={(doc) => {
                    setActiveDoc(doc);
                    setChat([]); // optional: clear old chat when switching docs
                }}
                userId={userId}
                reloadDocs={loadDocs}
            />


            <ChatWindow
                userId={userId}
                activeDoc={activeDoc}
                chat={chat}
                setChat={setChat}
                runChatAgent={runChatAgent}
                reloadDocs={loadDocs}   // ✅ MUST
            />

            <DoubtPanel
                isOpen={openDoubt}
                onClose={() => setOpenDoubt(false)}
                userId={userId}
                activeDoc={activeDoc}
            />
            {/* ✅ Right - Agents */}
            <AgentPanel activeDoc={activeDoc} runChatAgent={runChatAgent} onOpenDoubt={() => setOpenDoubt(true)} />
        </div>
    );
}
