"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
dotenv.config();
let ApiKeyGuard = class ApiKeyGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const apikey = req.header('x-api-key') || req.query.api_key;
        const expected = process.env.API_KEY_MANAGEMENT;
        if (!expected) {
            throw new common_1.UnauthorizedException('API key not configured on server');
        }
        if (apikey && apikey === expected)
            return true;
        throw new common_1.UnauthorizedException('Invalid API key');
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)()
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map