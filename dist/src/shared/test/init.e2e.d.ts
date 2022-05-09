/// <reference types="mongoose" />
import { TestingModule } from '@nestjs/testing';
export declare function initE2eWithGuards(): Promise<{
    app: import("@nestjs/common").INestApplication;
    dbConnection: import("mongoose").Connection;
    httpRequest: any;
    moduleFixture: TestingModule;
}>;
