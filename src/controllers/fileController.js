const path = require("path");
const { splitFileIntoChunks } = require("../services/chunkService");
const File = require("../models/File");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { reconstructFile } = require("../services/reconstructService");
const { redisClient } = require("../config/redis");
console.log("reconstructFile:", reconstructFile);
async function uploadFile(req, res) {
    try {
        const file = req.file;

        const fileId = uuidv4();

        const chunks = await splitFileIntoChunks(file.path);

        fs.unlinkSync(file.path); // delete the original uploaded file after chunking

        const fileDoc = new File({
            fileId,
            fileName: file.originalname,
            size: file.size,
            chunks
        });

        await fileDoc.save();
        await redisClient.set(
            fileId,
            JSON.stringify(fileDoc),
            { EX: 600 }
        )
        res.json({
            message: "File uploaded and distribution",
            fileId
        });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);   // show full error in terminal

        res.status(500).json({
            message: error.message   // send real error to Postman
        });
    }
}

async function downloadFile(req, res) {
    console.log("Param received:", req.params);
    const { fileId } = req.params;
    let file;

    const cached = await redisClient.get(fileId);
    if (cached) {
        console.log("Cache HIT");
        file = JSON.parse(cached);
    } else {
        console.log("Cache MISS");
        file = await File.findOne({ fileId });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        await redisClient.set(
            fileId,
            JSON.stringify(file),
            { EX: 600 }
        );
    }


    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.fileName}"`
    );
    await reconstructFile(file.chunks, res);
}

async function deleteFile(req, res) {
    const { fileId } = req.params;
    const file = await File.findOne({ fileId });
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }
    for (const chunk of file.chunks) {
        for (const node of chunk.node || chunk.nodes) {
            const chunkPath = path.join(
                __dirname,
                "../storage",
                node,
                `${chunk.chunkId}.chunk`
            );
            try {
                fs.unlinkSync(chunkPath);
            } catch (err) {
                console.log("Chunk already missing:", chunkPath);
            }
        }
    }
    await File.deleteOne({ fileId });
    await redisClient.del(fileId);
    res.json({
        message: "File deleted successfully"
    });
}
module.exports = { uploadFile, downloadFile, deleteFile };