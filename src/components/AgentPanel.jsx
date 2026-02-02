export default function AgentPanel({ activeDoc, runChatAgent, onOpenDoubt }) {
    return (
        <div className="agent-panel">
            <h3>⚡ Agents</h3>

            {!activeDoc ? (
                <p className="agent-note">Select a document to enable agents.</p>
            ) : (
                <>
                    <div className="agent-card" onClick={() => runChatAgent("summarize")}>
                        <h4>📄 Summarizer</h4>
                        <p>Creates quick revision notes from your document.</p>
                    </div>

                    <div className="agent-card" onClick={() => runChatAgent("voice")}>
                        <h4>🎧 Voice Note</h4>
                        <p>Generates 3–4 min voice explanation from your document.</p>
                    </div>

                    <div className="agent-card" onClick={() => runChatAgent("reference")}>
                        <h4>📚 References</h4>
                        <p>Gets real websites + YouTube videos related to your topic.</p>
                    </div>

                    {/* ✅ NEW Doubt Agent */}
                    <div className="agent-card" onClick={onOpenDoubt}>
                        <h4>💬 Doubt Clarifier</h4>
                        <p>Ask doubts like a chatbot in a new panel.</p>
                    </div>
                </>
            )}
        </div>
    );
}
