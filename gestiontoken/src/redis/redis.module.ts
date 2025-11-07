import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('redis.host');
        const redisPort = configService.get<number>('redis.port');
        return createClient({ url: `redis://${redisHost}:${redisPort}` });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}