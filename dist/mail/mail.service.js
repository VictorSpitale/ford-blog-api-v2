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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    constructor(mailerService, configService, mailingQueue) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.mailingQueue = mailingQueue;
    }
    async addWelcomeMailToQueue(welcomeMailInfos) {
        await this.mailingQueue.add('welcome', {
            pseudo: welcomeMailInfos.pseudo,
            mailTo: welcomeMailInfos.mailTo,
            clientUrl: this.configService.get('client_url'),
        });
    }
    async addPasswordRecoveryEmailToQueue(recoveryInfos) {
        await this.mailingQueue.add('recovery', {
            pseudo: recoveryInfos.pseudo,
            mailTo: recoveryInfos.mailTo,
            token: recoveryInfos.token,
            clientUrl: this.configService.get('client_url'),
            locale: recoveryInfos.locale,
        });
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)('mailing')),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService, Object])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map