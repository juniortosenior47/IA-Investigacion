import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apikey = req.header('x-api-key') || req.query.api_key;
    const expected = process.env.API_KEY_MANAGEMENT;
    if (!expected) {
      throw new UnauthorizedException('API key not configured on server');
    }
    if (apikey && apikey === expected) return true;
    throw new UnauthorizedException('Invalid API key');
  }
}
