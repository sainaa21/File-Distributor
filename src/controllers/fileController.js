const { splitFileIntoChunks } = require("../services/chunkService");
const File = require("../models/File");
const fs=require("fs");
const { v4: uuidv4 } = require("uuid");
const { reconstructFile } = require("../services/reconstructService");
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
    const file = await File.findOne({ fileId });

    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.fileName}`
    );
    await reconstructFile(file.chunks, res);
}
module.exports = { uploadFile, downloadFile };