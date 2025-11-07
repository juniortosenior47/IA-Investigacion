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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    redis;
    logger = new common_1.Logger(RedisService_1.name);
    constructor(redis) {
        this.redis = redis;
    }
    async setToken(clientId, userId, token, ttlSeconds = 3600) {
        const key = `token:${clientId}:${userId}`;
        await this.redis.set(key, token, 'EX', ttlSeconds);
        this.logger.log(`Set token for ${key} with TTL ${ttlSeconds}s`);
    }
    async getToken(clientId, userId) {
        const key = `token:${clientId}:${userId}`;
        this.logger.log(`Get token for ${key}`);
        return this.redis.get(key);
    }
    async delToken(clientId, userId) {
        const key = `token:${clientId}:${userId}`;
        this.logger.log(`Delete token for ${key}`);
        await this.redis.del(key);
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
//# sourceMappingURL=redis.service.js.map