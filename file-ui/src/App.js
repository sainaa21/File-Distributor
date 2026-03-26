import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5002";

function App() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  // 🔹 Upload with progress
  const uploadFile = async () => {
    if (!file) return setMessage("⚠️ Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/api/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (p) => {
          const percent = Math.round((p.loaded * 100) / p.total);
          setProgress(percent);
        },
      });

      setMessage("✅ Upload successful!");
      setFileId(res.data.fileId);
      setFiles([...files, { id: res.data.fileId, name: file.name }]);
      setProgress(0);
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  // 🔹 Download
  const downloadFile = async (id) => {
    try {
      const res = await axios.get(`${API}/api/files/download/${id}`, {
        responseType: "blob",
      });

      // create file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      // optional: set filename
      link.setAttribute("download", "downloaded-file");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log("Download error:", err.response?.data || err.message);
      setMessage("❌ Download failed");
    }
  };

  // 🔹 Delete
  const deleteFile = async (id) => {
    try {
      await axios.delete(`${API}/api/files/delete/${id}`);
      setFiles(files.filter((f) => f.id !== id));
      setMessage("🗑 Deleted");
    } catch {
      setMessage("❌ Delete failed");
    }
  };

  // 🔹 Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  // 🔹 Hover effect
  useEffect(() => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.onmouseenter = () => {
        btn.style.transform = "scale(1.05)";
      };
      btn.onmouseleave = () => {
        btn.style.transform = "scale(1)";
      };
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>📂 File Distributor</h1>

        {/* Drag Drop */}
        <div
          style={styles.dropZone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {file ? file.name : "Drag & Drop File Here"}
        </div>

        {/* File Picker */}
        <label style={styles.fileLabel}>
          Choose File
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Progress */}
        {progress > 0 && (
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        )}

        <button style={styles.uploadBtn} onClick={uploadFile}>
          Upload
        </button>

        <p>{message}</p>

        {/* File List */}
        <h3 style={{ marginTop: "20px" }}>📂 Files</h3>

        <div style={styles.fileList}>
          {files.map((f) => (
            <div key={f.id} style={styles.fileItem}>
              <span>{f.name}</span>
              <div>
                <button onClick={() => downloadFile(f.id)}>⬇</button>
                <button onClick={() => deleteFile(f.id)}>❌</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #1a0000, #330000, #4d0000, #660000)",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "16px",
    width: "400px",
    color: "#fff",
  },
  dropZone: {
    border: "2px dashed #fff",
    padding: "20px",
    textAlign: "center",
    marginBottom: "10px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  fileLabel: {
    display: "block",
    padding: "10px",
    background: "#ff4d4d",
    textAlign: "center",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  uploadBtn: {
    width: "100%",
    padding: "10px",
    background: "#ff1a75",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  progressBar: {
    height: "8px",
    background: "#444",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  progressFill: {
    height: "100%",
    background: "#ff4d4d",
    borderRadius: "10px",
  },
  fileList: {
    marginTop: "10px",
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.1)",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "5px",
  },
};

export default App;