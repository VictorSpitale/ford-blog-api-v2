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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mail_service_1 = require("./mail.service");
const allow_any_decorator_1 = require("../auth/decorators/allow-any.decorator");
const Contact_dto_1 = require("./dto/Contact.dto");
let MailController = class MailController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async contactMail(contactDto) {
        return this.mailService.addContactEmailToQueue(contactDto);
    }
};
__decorate([
    (0, common_1.Post)('/contact'),
    (0, swagger_1.ApiOperation)({ summary: 'Send contact email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, allow_any_decorator_1.AllowAny)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Contact_dto_1.ContactDto]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "contactMail", null);
MailController = __decorate([
    (0, common_1.Controller)('mail'),
    (0, swagger_1.ApiTags)('Mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map