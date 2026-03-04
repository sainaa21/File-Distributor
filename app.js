const express = require("express");
const app = express();
const fileRoutes = require("./src/routes/fileRoutes");
app.use("/api/files", fileRoutes);
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "File Distributor Running"
    });
});
module.exports = app;