const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const fileController = require("../controllers/fileController");

//upload file route
router.post("/upload", upload.single("file"), fileController.uploadFile);

//download file route
router.get("/download/:filename", fileController.downloadFile);

module.exports = router;