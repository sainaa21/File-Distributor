const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const fileController = require("../controllers/fileController");

//upload file route
router.post("/upload", upload.single("file"), fileController.uploadFile);

//download file route
router.get("/download/:fileId", fileController.downloadFile);

//delete file route
router.delete("/delete/:fileId", fileController.deleteFile);
module.exports = router;