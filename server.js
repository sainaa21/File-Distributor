require("dotenv").config();
const mongoose=require("mongoose");
const app=require("./app");
const {connectRedis, redisClient}=require("./src/config/redis");
const startHeartBeat=require("./src/services/heartbeatServices");

const PORT=process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{
    console.log("MongoDB Connected");
    await connectRedis();
    console.log("Calling heartbeat...");

   startHeartBeat(redisClient);
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection failed: ",err);
});