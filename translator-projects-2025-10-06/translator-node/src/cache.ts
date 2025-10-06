import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT
});

// Optional: preload initial data if desired (idempotent)
const initial: Record<string, string> = {
  "hola": "hello",
  "cómo estás": "how are you",
  "perro": "dog",
  "casa": "house"
};

(async () => {
  try {
    const pipeline = redis.pipeline();
    for (const [k, v] of Object.entries(initial)) {
      const key = `${process.env.REDIS_PREFIX || "translator:word:"}${k}`;
      pipeline.setnx(key, v);
    }
    await pipeline.exec();
  } catch (err) {
    console.error("Error preloading initial data:", err);
  }
})();
