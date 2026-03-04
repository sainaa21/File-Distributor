const path = require("path");
const fs = require("fs");

//upload files
exports.uploadFile = (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.json({
            message: "File uploaded successfully",
            fileName: file.filename,
            path: file.path
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//download file
exports.downloadFile = (req, res) => {
    try {
        const fileName = req.params.filename;
        const filePath = path.join(__dirname, "../../uploads", fileName);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};