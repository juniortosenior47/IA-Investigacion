"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdcsModule = void 0;
const common_1 = require("@nestjs/common");
const idcs_service_1 = require("./idcs.service");
const idcs_controller_1 = require("./idcs.controller");
const redis_module_1 = require("../redis/redis.module");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let IdcsModule = class IdcsModule {
};
exports.IdcsModule = IdcsModule;
exports.IdcsModule = IdcsModule = __decorate([
    (0, common_1.Module)({
        imports: [redis_module_1.RedisModule, axios_1.HttpModule, config_1.ConfigModule],
        providers: [idcs_service_1.IdcsService],
        controllers: [idcs_controller_1.IdcsController]
    })
], IdcsModule);
//# sourceMappingURL=idcs.module.js.map