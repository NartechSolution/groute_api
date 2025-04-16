import { Queue } from "bullmq";
import IORedis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "173.249.56.16";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;

// Connection to Redis
export const connection = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    if (times > 3) {
      return null;
    }
    return Math.min(times * 50, 2000);
  },
});

// Default job options
export const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "fixed",
    delay: 5000,
  },
};

// Queues

export const sendEmailQueue = new Queue("send-email", {
  connection: connection,
  defaultJobOptions: defaultJobOptions,
});
