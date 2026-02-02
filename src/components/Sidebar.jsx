import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://book-backend-6pr3.onrender.com";
export default function Sidebar({
    docs = [],
    activeDoc,
    setActiveDoc,
    userId,        // ✅ REQUIRED
    reloadDocs,
}) {
    const [openMenu, setOpenMenu] = useState(null);

    const handleDelete = async (doc) => {
        // ✅ CLOSE MENU FIRST (important)
        setOpenMenu(null);

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmDelete) {
            return; // user cancelled → menu already closed
        }

        try {
            await axios.delete(
                `${BASE_URL}/documents/${userId}/${doc.document_id}`
            );

            // reload documents after delete
            reloadDocs();

            // optional: clear active doc if deleted
            if (activeDoc?.document_id === doc.document_id) {
                setActiveDoc(null);
            }
        } catch (err) {
            alert("Delete failed");
            console.error(err);
        }
    };


    return (
        <div className="sidebar">
            <h1 className="title">Smart <span>Doc AI</span></h1>
            <h3 className="sidebar-title">Documents</h3>

            <div className="doc-list">
                {docs.map((doc) => (
                    <div
                        key={doc.document_id}
                        className={`doc-item ${activeDoc?.document_id === doc.document_id ? "active" : ""
                            }`}
                    >
                        {/* filename */}
                        <span
                            onClick={() => setActiveDoc(doc)}
                            style={{ flex: 1, cursor: "pointer" }}
                        >
                            {doc.filename}
                        </span>

                        {/* three dots */}
                        <button
                            className="dots-btn"
                            onClick={() =>
                                setOpenMenu(
                                    openMenu === doc.document_id ? null : doc.document_id
                                )
                            }
                        >
                            ⋮
                        </button>

                        {/* dropdown */}
                        {openMenu === doc.document_id && (
                            <div className="doc-menu">
                                <button onClick={() => handleDelete(doc)}>
                                    🗑 Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
