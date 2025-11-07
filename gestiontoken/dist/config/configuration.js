"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    idcs: {
        baseUrl: process.env.IDCS_BASE_URL || 'https://idcs.example.com',
        tokenUrl: process.env.IDCS_TOKEN_URL || '',
        usersUrl: process.env.IDCS_USERS_URL || '',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379)
    }
});
//# sourceMappingURL=configuration.js.map