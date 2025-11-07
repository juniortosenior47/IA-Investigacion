import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { IdcsModule } from '../idcs/idcs.module';

@Module({
  imports: [IdcsModule],
  controllers: [AuthController],
})
export class AuthModule {}
