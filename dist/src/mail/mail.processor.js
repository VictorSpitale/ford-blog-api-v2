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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let MailProcessor = class MailProcessor {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    handleWelcome(job) {
        try {
            this.mailerService
                .sendMail({
                to: job.data.mailTo,
                from: '"Ford Universe Team" <no-reply@forduniverse.com>',
                subject: 'Welcome on Ford Universe !',
                template: 'welcome',
                context: {
                    name: job.data.pseudo,
                    url: job.data.clientUrl,
                },
            })
                .then(() => null)
                .catch(() => null);
        }
        catch (e) { }
    }
    handleRecovery(job) {
        try {
            const subject = job.data.locale === 'fr'
                ? 'Réinitialisation de mot de passe'
                : 'Password recovery';
            this.mailerService
                .sendMail({
                to: job.data.mailTo,
                from: '"Ford Universe Team" <no-reply@forduniverse.com>',
                subject,
                template: `passwordRecovery-${job.data.locale}`,
                context: {
                    name: job.data.pseudo,
                    link: `${job.data.clientUrl}/${job.data.locale}/recovery/${job.data.token}`,
                },
            })
                .then(() => null)
                .catch(() => null);
        }
        catch (e) { }
    }
    async handleContact(job) {
        await this.mailerService.sendMail({
            to: this.configService.get('email.to'),
            from: job.data.email,
            template: 'contact',
            subject: `Ford Blog : Message de ${job.data.name} | ${job.data.email}`,
            context: {
                message: job.data.message,
            },
        });
    }
};
__decorate([
    (0, bull_1.Process)('welcome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MailProcessor.prototype, "handleWelcome", null);
__decorate([
    (0, bull_1.Process)('recovery'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MailProcessor.prototype, "handleRecovery", null);
__decorate([
    (0, bull_1.Process)('contact'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailProcessor.prototype, "handleContact", null);
MailProcessor = __decorate([
    (0, bull_1.Processor)('mailing'),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], MailProcessor);
exports.MailProcessor = MailProcessor;
//# sourceMappingURL=mail.processor.js.map