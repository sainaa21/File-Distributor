const { createClient } = require("redis");
const nodes = require("./nodes");
const redisClient = createClient({
    url: "redis://127.0.0.1:6379"
});
redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});
async function connectRedis() {
    await redisClient.connect();
    console.log("Redis Connected");

   for (const node of nodes) {
     await redisClient.set(`node:${node.name}`, "alive");
   }
}
module.exports = { redisClient, connectRedis };