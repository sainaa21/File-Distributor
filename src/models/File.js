const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
    chunkId: String,
    nodes: [String],
    order: Number
});

const fileSchema = new mongoose.Schema({
    fileId: String,
    fileName: String,
    size: Number,
    chunks: [chunkSchema]
}, { timestamps: true }); 

module.exports = mongoose.model("File", fileSchema);