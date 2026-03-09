const fs = require("fs");
const path = require("path");

async function reconstructFile(chunks, res) {
    chunks.sort((a, b) => a.order - b.order);

    for (const chunk of chunks) {
        const chunkPath = path.join(
            __dirname,
            "../storage",
            chunk.node,
            `${chunk.chunkId}.chunk`
        );
        const data = fs.readFileSync(chunkPath);
        res.write(data);
    }
    res.end();
}
module.exports = { reconstructFile };