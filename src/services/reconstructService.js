const fs = require("fs");
const path = require("path");
const { redisClient } = require("../config/redis");

async function reconstructFile(chunks, res) {
    chunks.sort((a, b) => a.order - b.order);

    for (const chunk of chunks) {

        let chunkData = null;

        const nodes= chunk.nodes || [chunk.node]
        for(const node of nodes) {

            const status=await redisClient.get(`node:${node}`);
            if(status!=="alive"){
                continue;
            }
            const chunkPath = path.join(
                __dirname,
                "..",
                "storage",
                node,
                `${chunk.chunkId}.chunk`
            );

            if (fs.existsSync(chunkPath)) {
                chunkData = fs.readFileSync(chunkPath);
                break;
            }
        }

        if (!chunkData) {
            throw new Error("Chunk missing from all replicas");
        }

        res.write(chunkData);
    }

    res.end();
}

module.exports = { reconstructFile };