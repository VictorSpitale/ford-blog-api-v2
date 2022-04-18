"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initE2eWithGuards = void 0;
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../app.module");
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const superagent_1 = require("./superagent");
const request = require("supertest");
const cookieParser = require("cookie-parser");
const mail_service_1 = require("../../mail/mail.service");
const mail_service_mock_1 = require("./mocks/mail.service.mock");
async function getInitConst(moduleFixture) {
    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    await app.init();
    const dbConnection = moduleFixture
        .get(database_service_1.DatabaseService)
        .getDbHandle();
    const httpServer = app.getHttpServer();
    const httpRequest = (0, superagent_1.getRequest)(request(httpServer));
    return {
        app,
        dbConnection,
        httpRequest,
        moduleFixture,
    };
}
async function initE2eWithGuards() {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [app_module_1.AppModule],
    })
        .overrideProvider(mail_service_1.MailService)
        .useClass(mail_service_mock_1.MailServiceMock)
        .compile();
    return Object.assign({}, (await getInitConst(moduleFixture)));
}
exports.initE2eWithGuards = initE2eWithGuards;
//# sourceMappingURL=init.e2e.js.map