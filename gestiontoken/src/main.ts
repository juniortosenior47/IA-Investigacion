import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { RedisService } from './redis/redis.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const redisService = app.get(RedisService);
  const logger = new Logger('RedisClient');

  redisService.onConnect(() => {
    logger.log('Connected to Redis');
  });
  redisService.onError((err) => {
    logger.error('Redis connection error:', err);
  });

  // Ensure Redis client is connected before starting the application
  await redisService.connect();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();