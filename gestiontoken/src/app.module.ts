import { Module } from '@nestjs/common';
import { IdcsModule } from './idcs/idcs.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    RedisModule,
    IdcsModule,
    AuthModule,
  ],
})
export class AppModule {}