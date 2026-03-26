import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5002";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fetchFiles = async () => {
    const res = await axios.get(`${API}/api/files/all`);
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    setFile(e.dataTransfer.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return setMessage("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API}/api/files/upload`, formData);
      setMessage("✅ Uploaded successfully");
      setFile(null);
      fetchFiles();
    } catch {
      setMessage("❌ Upload failed");
    }
  };

  const downloadFile = async (id, name) => {
    const res = await axios.get(`${API}/api/files/download/${id}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const deleteFile = async (id) => {
    await axios.delete(`${API}/api/files/delete/${id}`);
    fetchFiles();
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🚀 File Distributor</h1>

        {/* Drag & Drop */}
        <div
          className={`drop-zone ${dragActive ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <p>Drag & Drop file here</p>
          <span>or</span>

          <label className="custom-file">
            Choose File
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>

          {file && <div className="file-box">📄 {file.name}</div>}
        </div>

        <button className="upload-btn" onClick={uploadFile}>
          Upload
        </button>

        <p className="message">{message}</p>

        {/* File List */}
        <div className="file-list">
          <h3>📂 Files</h3>

          {files.map((f) => (
            <div className="file-item" key={f.fileId}>
              <span>{f.fileName}</span>

              <div className="actions">
                <button
                  className="download"
                  onClick={() => downloadFile(f.fileId, f.fileName)}
                >
                  ⬇
                </button>
                <button
                  className="delete"
                  onClick={() => deleteFile(f.fileId)}
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="history">
          <h3>📜 History</h3>
          {files.map((f) => (
            <div key={f.fileId}>
              {f.fileName} — {new Date(f.createdAt).toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;