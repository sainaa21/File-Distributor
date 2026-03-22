const fs = require("fs");
const path = require("path");
const {redisClient}=require("../config/redis");
const { v4: uuidv4 } = require("uuid");
const { getReplicaNodes } = require("../utils/nodeManager");
const CHUNK_SIZE = 5 * 1024 * 1024;
async function splitFileIntoChunks(filePath) {
    const fileStream = fs.createReadStream(filePath, {
        highWaterMark: CHUNK_SIZE
    });
    let chunkIndex = 0;
    const chunks = [];
    for await (const chunk of fileStream) {
        const chunkId = uuidv4();
        const replicaNodes = await getReplicaNodes(redisClient,2);
        const chunkFileName = `${chunkId}.chunk`;

        for (const node of replicaNodes) {
            const chunkPath = path.join(
                __dirname,
                "..",
                "storage",
                node,
                chunkFileName
            );


            // write the chunk
            fs.writeFileSync(chunkPath, chunk);

        }
        chunks.push({
            chunkId,
            nodes: replicaNodes,
            order: chunkIndex
        });
        chunkIndex++;
    }
    return chunks;
}
module.exports = { splitFileIntoChunks };