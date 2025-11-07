import { Injectable, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import config from '../config/configuration';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  public async connect(): Promise<void> {
    await this.redis.connect();
  }

  public onConnect(callback: () => void) {
    this.redis.on('connect', callback);
  }

  public onError(callback: (err: any) => void) {
    this.redis.on('error', callback);
  }

  async setToken(clientId: string, userId: string, token: string, ttlSeconds = 3600) {
    const key = `token:${clientId}:${userId}`;
    await this.redis.set(key, token, 'EX', ttlSeconds);
    this.logger.log(`Set token for ${key} with TTL ${ttlSeconds}s`);
  }

  async getToken(clientId: string, userId: string) {
    const key = `token:${clientId}:${userId}`;
    this.logger.log(`Get token for ${key}`);
    return this.redis.get(key);
  }

  async delToken(clientId: string, userId: string) {
    const key = `token:${clientId}:${userId}`;
    this.logger.log(`Delete token for ${key}`);
    await this.redis.del(key);
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}