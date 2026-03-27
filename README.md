
# 🚀 Distributed File Storage System

A full-stack **Distributed File Storage System** that efficiently handles large file uploads by splitting them into chunks and distributing them across multiple storage nodes. The system ensures reliability through replication, fast access using caching, and scalability using Docker.

---

## 📌 Features

* 📂 **Chunk-Based File Storage**
  Splits large files into smaller chunks for efficient storage.

* 🔁 **Replication & Fault Tolerance**
  Each chunk is stored across multiple nodes to ensure data availability.

* ⚡ **Redis Caching**
  Improves performance by caching file metadata for faster retrieval.

* 🧠 **Dynamic Node Management**
  Nodes are monitored using heartbeat to detect active/inactive nodes.

* 🐳 **Dockerized Architecture**
  Backend, MongoDB, and Redis run in isolated containers using Docker Compose.

* 🌐 **Modern React Frontend**

  * Drag & Drop Upload
  * File Listing
  * Download & Delete
  * Upload History
  * Search & File Preview

---

## 🛠 Tech Stack

| Layer    | Technology             |
| -------- | ---------------------- |
| Frontend | React, CSS             |
| Backend  | Node.js, Express.js    |
| Database | MongoDB                |
| Cache    | Redis                  |
| DevOps   | Docker, Docker Compose |
| Others   | Multer, UUID           |

---

## 🧠 System Architecture

```
Frontend (React)
        ↓
Backend (Node.js + Express)
        ↓
----------------------------
| MongoDB (metadata)       |
| Redis (cache + nodes)    |
| Storage Nodes (chunks)   |
----------------------------
```

---

## 📁 Project Structure

```
file-distributor/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── config/
│   ├── models/
│   └── routes/
│
├── storage/
│   ├── node1/
│   ├── node2/
│   └── node3/
│
├── docker-compose.yml
├── Dockerfile
└── file-ui/   (React frontend)
```

---

## ⚙️ How It Works

1. User uploads a file via frontend
2. Backend splits file into chunks
3. Chunks are distributed across multiple nodes
4. Metadata is stored in MongoDB
5. Redis caches file information
6. File is reconstructed during download

---

## 🚀 Getting Started

### 🔹 Prerequisites

* Docker installed
* Node.js (for frontend)

---

### 🔹 Run Backend (Docker)

```bash
docker compose up --build
```

---

### 🔹 Run Frontend

```bash
cd file-ui
npm install
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint                    | Description   |
| ------ | --------------------------- | ------------- |
| POST   | /api/files/upload           | Upload file   |
| GET    | /api/files/download/:fileId | Download file |
| DELETE | /api/files/delete/:fileId   | Delete file   |
| GET    | /api/files/all              | Get all files |

---

## 🔥 Key Highlights

* Simulates a **real distributed storage system**
* Implements **chunking + replication**
* Uses **Docker for orchestration**
* Includes **modern UI + backend integration**
* Demonstrates **system design concepts**

---

## 🚀 Future Enhancements

* 🔐 User Authentication (JWT)
* ☁️ Cloud Storage (AWS S3)
* ⚖️ Load Balancing & Consistent Hashing
* 📊 File Analytics Dashboard

---

## 👩‍💻 Author

**Saina S. Kumar**
