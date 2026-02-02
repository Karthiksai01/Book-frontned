import axios from "axios";

const BASE_URL = "https://book-backend-6pr3.onrender.com";

// ✅ Upload Document
export const uploadDoc = async (userId, file) => {
    const formData = new FormData();
    formData.append("user_id", userId); // ✅ must match backend Form(...)
    formData.append("file", file);      // ✅ must match backend UploadFile

    const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
};
// ✅ Get Documents List
export const fetchDocuments = async (userId) => {
    const res = await axios.get(`${BASE_URL}/documents/${userId}`);
    return res.data;
};

// ✅ Run Agent (chat/summarize/voice/reference)
export const runAgent = async (payload) => {
    const res = await axios.post(`${BASE_URL}/agent`, payload);
    return res.data;
};

// ✅ Get History (optional)
export const fetchHistory = async (userId, documentId) => {
    const res = await axios.get(`${BASE_URL}/history/${userId}/${documentId}`);
    return res.data;
};
