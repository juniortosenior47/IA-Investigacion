import { Module } from '@nestjs/common';
import { IdcsService } from './idcs.service';
import { IdcsController } from './idcs.controller';
import { RedisModule } from '../redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisModule, HttpModule, ConfigModule],
  providers: [IdcsService],
  controllers: [IdcsController],
  exports: [IdcsService] // Export IdcsService
})
export class IdcsModule {}