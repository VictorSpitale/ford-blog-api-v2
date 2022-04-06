"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initE2eWithGuards = exports.initE2eWithoutGuards = void 0;
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../app.module");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const auth_guard_mock_1 = require("./mocks/auth.guard.mock");
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const superagent_1 = require("./superagent");
const request = require("supertest");
const roles_guard_1 = require("../../auth/guards/roles.guard");
async function initE2eWithoutGuards() {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [app_module_1.AppModule],
    })
        .overrideProvider(roles_guard_1.RolesGuard)
        .useClass(auth_guard_mock_1.AuthGuardMock)
        .overrideProvider(jwt_auth_guard_1.JwtAuthGuard)
        .useClass(auth_guard_mock_1.AuthGuardMock)
        .compile();
    return Object.assign({}, (await getInitConst(moduleFixture)));
}
exports.initE2eWithoutGuards = initE2eWithoutGuards;
async function getInitConst(moduleFixture) {
    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new common_1.ValidationPipe());
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
    }).compile();
    return Object.assign({}, (await getInitConst(moduleFixture)));
}
exports.initE2eWithGuards = initE2eWithGuards;
//# sourceMappingURL=init.e2e.js.map