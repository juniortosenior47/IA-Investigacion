"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IdcsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdcsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const axios_2 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let IdcsService = IdcsService_1 = class IdcsService {
    redisClient;
    http;
    config;
    logger = new common_1.Logger(IdcsService_1.name);
    constructor(redisClient, http, config) {
        this.redisClient = redisClient;
        this.http = http;
        this.config = config;
    }
    async fetchClientToken(clientId, clientSecret) {
        const tokenUrl = this.config.get('idcs.tokenUrl') || '';
        const clientBase64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const res = await axios_1.default.post(tokenUrl, 'grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${clientBase64}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token, expires_in } = res.data;
        // Guarda en Redis para este "clientId" con TTL
        await this.redisClient.set(`token:${clientId}:system`, access_token, 'EX', expires_in);
        this.logger.log(`Stored token for app ${clientId} (ttl: ${expires_in}s)`);
        this.logger.debug(`token (trimmed)=${access_token?.slice(0, 8)}...`);
        return { access_token, expires_in };
    }
    async getTokenForApp(clientId, clientSecret) {
        const cached = await this.redisClient.get(`token:${clientId}:system`);
        if (cached) {
            this.logger.log(`Token cache hit for app ${clientId}`);
            return cached;
        }
        const t = await this.fetchClientToken(clientId, clientSecret);
        return t.access_token;
    }
    async listUsers(clientId, clientSecret) {
        const token = await this.getTokenForApp(clientId, clientSecret);
        const idcsUserUrl = this.config.get('idcs.usersUrl');
        const res = await axios_1.default.get(`${idcsUserUrl}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        this.logger.log(`Listed users for app ${clientId} (count=${res.data?.Resources?.length ?? 'unknown'})`);
        return res.data;
    }
    async createUser(clientId, clientSecret, payload) {
        const token = await this.getTokenForApp(clientId, clientSecret);
        const idcsUserUrl = this.config.get('idcs.usersUrl');
        const res = await axios_1.default.post(`${idcsUserUrl}`, payload, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        this.logger.log(`Created user for app ${clientId} id=${res.data.id}`);
        return res.data;
    }
    async updateUser(clientId, clientSecret, userId, payload) {
        const token = await this.getTokenForApp(clientId, clientSecret);
        const idcsUserUrl = this.config.get('idcs.usersUrl');
        const res = await axios_1.default.put(`${idcsUserUrl}/${userId}`, payload, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        this.logger.log(`Updated user for app ${clientId} id=${userId}`);
        return res.data;
    }
    async deleteUser(clientId, clientSecret, userId) {
        const token = await this.getTokenForApp(clientId, clientSecret);
        const idcsUserUrl = this.config.get('idcs.usersUrl');
        const res = await axios_1.default.delete(`${idcsUserUrl}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        this.logger.log(`Deleted user for app ${clientId} id=${userId}`);
        return { success: true };
    }
};
exports.IdcsService = IdcsService;
exports.IdcsService = IdcsService = IdcsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default,
        axios_2.HttpService,
        config_1.ConfigService])
], IdcsService);
//# sourceMappingURL=idcs.service.js.map