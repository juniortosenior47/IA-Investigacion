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
var IdcsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdcsController = void 0;
const common_1 = require("@nestjs/common");
const idcs_service_1 = require("./idcs.service");
const api_key_guard_1 = require("../auth/api-key.guard");
let IdcsController = IdcsController_1 = class IdcsController {
    idcs;
    logger = new common_1.Logger(IdcsController_1.name);
    constructor(idcs) {
        this.idcs = idcs;
    }
    async getToken(clientId, clientSecret) {
        return this.idcs.getTokenForApp(clientId, clientSecret);
    }
    async users(clientId, clientSecret) {
        return this.idcs.listUsers(clientId, clientSecret);
    }
    async createUser(clientId, clientSecret, payload) {
        this.logger.log(`createUser called for app ${clientId}`);
        return this.idcs.createUser(clientId, clientSecret, payload);
    }
    async updateUser(clientId, userId, clientSecret, payload) {
        this.logger.log(`updateUser called for app ${clientId} user ${userId}`);
        return this.idcs.updateUser(clientId, clientSecret, userId, payload);
    }
    async deleteUser(clientId, userId, clientSecret) {
        this.logger.log(`deleteUser called for app ${clientId} user ${userId}`);
        return this.idcs.deleteUser(clientId, clientSecret, userId);
    }
};
exports.IdcsController = IdcsController;
__decorate([
    (0, common_1.Get)('token/:clientId'),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Query)('clientSecret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IdcsController.prototype, "getToken", null);
__decorate([
    (0, common_1.Get)('users/:clientId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Query)('clientSecret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IdcsController.prototype, "users", null);
__decorate([
    (0, common_1.Post)('users/:clientId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Query)('clientSecret')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IdcsController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:clientId/:userId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Query)('clientSecret')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], IdcsController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:clientId/:userId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Query)('clientSecret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IdcsController.prototype, "deleteUser", null);
exports.IdcsController = IdcsController = IdcsController_1 = __decorate([
    (0, common_1.Controller)('idcs'),
    __metadata("design:paramtypes", [idcs_service_1.IdcsService])
], IdcsController);
//# sourceMappingURL=idcs.controller.js.map