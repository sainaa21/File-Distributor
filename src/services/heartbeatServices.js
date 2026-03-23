const fs = require("fs");
const path = require("path");
const nodes = require("../config/nodes");

function startHeartBeat(redisClient) {
    setInterval(() => {
        for (const node of nodes) {

            const nodePath = path.join(__dirname, "..", node.path);

            if (fs.existsSync(nodePath)) {
                redisClient.set(`node:${node.name}`, "alive");
            } else {
                redisClient.set(`node:${node.name}`, "down");
            }
        }
    }, 5000);
}

module.exports = startHeartBeat;