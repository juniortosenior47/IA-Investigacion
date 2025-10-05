import redis, os

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)

initial_cache = {
    "hola": "hello",
    "cómo estás": "how are you",
    "perro": "dog",
    "casa": "house"
}

for key, value in initial_cache.items():
    if not redis_client.exists(key):
        redis_client.set(key, value)
