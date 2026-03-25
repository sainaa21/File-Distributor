const nodes = require("../config/nodes");
let currentNode = 0;
async function getAvailableNodes(redisClient) {
    const available = [];
    for (const node of nodes) {
        const status = await redisClient.get(`node:${node.name}`);
        if (status === "alive") {
            available.push(node.name);
        }
    }
    if (available.length === 0) {
        console.log("No nodes in Redis, initializing...");

        for (const node of nodes) {
            await redisClient.set(`node:${node.name}`, "alive");
            available.push(node.name);
        }
    }
    return available;
}
async function getReplicaNodes(redisClient, replicationFactor) {
    const availableNodes = await getAvailableNodes(redisClient);
    if (availableNodes.length === 0) {
        throw new Error("No active nodes available");
    }
    const selectedNodes = [];
    for (let i = 0; i < replicationFactor; i++) {
        const node = availableNodes[currentNode % availableNodes.length];
        selectedNodes.push(node);
        currentNode++;
    }
    return selectedNodes;
}
async function getReadableNode(chunkNodes, redisClient) {
    for (const node of chunkNodes) {
        const status = await redisClient.get(`node:${node}`);

        if (status === "alive") {
            return node; //return first healthy node
        }
    }

    throw new Error("All replicas are down");
}
module.exports = { getReplicaNodes, getReadableNode };