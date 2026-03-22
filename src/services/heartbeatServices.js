console.log("🔥 Heartbeat file loaded");
const nodes = require("../config/nodes");
function startHeartBeat(redisClient) {
    console.log("🔥 Heartbeat started");
    setInterval(async () => {
        for (const node of nodes) {
            try {
                const nodePath=path.join(
                    __dirname,
                    "..",
                    "storage",
                    node
                );
                console.log("Checking path:", nodePath);
                await fs.promises.access(nodePath);
                await redisClient.set(`node:${node}`, "alive");
            } catch (err) {
                await redisClient.set(`node:${node}`, "down");
            }
        }
    }, 5000);
}
module.exports = startHeartBeat;