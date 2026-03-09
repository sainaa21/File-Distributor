const nodes = ["node1", "node2", "node3"];
let currentNode = 0;
function getNextNode() {
    const node = nodes[currentNode];
    currentNode = (currentNode + 1) % nodes.length;
    return node;
}
module.exports = { getNextNode };