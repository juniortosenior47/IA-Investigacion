import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class IdcsService {
  private readonly logger = new Logger(IdcsService.name);
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async fetchClientToken(clientId: string, clientSecret: string): Promise<{ access_token: string; expires_in: number }> {
    const tokenUrl = this.config.get<string>('idcs.tokenUrl') || '';
    const clientBase64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${clientBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = res.data;
    // Guarda en Redis para este "clientId" con TTL
    await this.redisClient.set(`token:${clientId}:system`, access_token, 'EX', expires_in);

    this.logger.log(`Stored token for app ${clientId} (ttl: ${expires_in}s)`);
    this.logger.debug(`token (trimmed)=${access_token?.slice(0,8)}...`);
    return { access_token, expires_in };
  }

  async getTokenForApp(clientId: string, clientSecret: string) {
    const cached = await this.redisClient.get(`token:${clientId}:system`);

    if (cached) {
      this.logger.log(`Token cache hit for app ${clientId}`);
      return cached;
    }

    const t = await this.fetchClientToken(clientId, clientSecret);
    return t.access_token;
  }

  async listUsers(clientId: string, clientSecret: string) {
    const token = await this.getTokenForApp(clientId, clientSecret);
    const idcsUserUrl = this.config.get<string>('idcs.usersUrl');
    const res = await axios.get(`${idcsUserUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.logger.log(`Listed users for app ${clientId} (count=${res.data?.Resources?.length ?? 'unknown'})`);
    return res.data;
  }

  async createUser(clientId: string, clientSecret: string, payload: any) {
    const token = await this.getTokenForApp(clientId, clientSecret);
    const idcsUserUrl = this.config.get<string>('idcs.usersUrl');
    const res = await axios.post(`${idcsUserUrl}`, payload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    this.logger.log(`Created user for app ${clientId} id=${res.data.id}`);
    return res.data;
  }

  async updateUser(clientId: string, clientSecret: string, userId: string, payload: any) {
    const token = await this.getTokenForApp(clientId, clientSecret);
    const idcsUserUrl = this.config.get<string>('idcs.usersUrl');
    const res = await axios.put(`${idcsUserUrl}/${userId}`, payload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    this.logger.log(`Updated user for app ${clientId} id=${userId}`);
    return res.data;
  }

  async deleteUser(clientId: string, clientSecret: string, userId: string) {
    const token = await this.getTokenForApp(clientId, clientSecret);
    const idcsUserUrl = this.config.get<string>('idcs.usersUrl');
    const res = await axios.delete(`${idcsUserUrl}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.logger.log(`Deleted user for app ${clientId} id=${userId}`);
    return { success: true };
  }
}
