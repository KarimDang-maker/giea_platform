const { Queue } = require("bullmq");
const redisConnection = require("./redis.config");

const notificationQueue = new Queue(
    "notificationQueue",
    {
        connection: redisConnection,
        defaultJobOptions: {
            attempts : 5,
            backoff : {
                type : "exponential",
                delay : 1000
            }
        }
    }
);

module.exports = notificationQueue;