const nodes = ["node1", "node2", "node3"];
let currentNode = 0;
function getReplicaNodes(replicationFactor) {
    const selectedNodes = [];
    for (let i = 0; i < replicationFactor; i++) {
        selectedNodes.push(nodes[currentNode]);
        currentNode = (currentNode + 1) % nodes.length;
    }
    return selectedNodes;
}
module.exports = { getReplicaNodes };