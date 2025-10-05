import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

const initialCache: Record<string, string> = {
  "hola": "hello",
  "cómo estás": "how are you",
  "perro": "dog",
  "casa": "house"
};

(async () => {
  for (const [key, value] of Object.entries(initialCache)) {
    const exists = await redis.exists(key);
    if (!exists) {
      await redis.set(key, value);
    }
  }
})();
