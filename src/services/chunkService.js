const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { getNextNode } = require("../utils/nodeManager");
const CHUNK_SIZE = 5 * 1024 * 1024;
async function splitFileIntoChunks(filePath) {
    const fileStream = fs.createReadStream(filePath, {
        highWaterMark: CHUNK_SIZE
    });
    let chunkIndex = 0;
    const chunks = [];
    for await (const chunk of fileStream) {
        const chunkId = uuidv4();
        const node = getNextNode();
        const chunkFileName = `${chunkId}.chunk`;
        const chunkPath = path.join(
            __dirname,
            "..",
            "storage",
            node,
            chunkFileName
        );
        const fsExtra = require("fs-extra");

        // ensure the directory exists
        await fsExtra.ensureDir(path.dirname(chunkPath));
console.log("Saving chunk to:", chunkPath);
        // write the chunk
        fs.writeFileSync(chunkPath, chunk);
        chunks.push({
            chunkId,
            node,
            order: chunkIndex
        });
        chunkIndex++;
    } 
    return chunks;
}
module.exports = { splitFileIntoChunks };