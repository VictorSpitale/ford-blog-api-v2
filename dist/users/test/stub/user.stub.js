"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStubWithoutPasswordAndDates = exports.UserStubWithoutPassword = exports.UserStub = void 0;
const users_role_interface_1 = require("../../entities/users.role.interface");
const Mongoose = require("mongoose");
const mockObjectId = new Mongoose.Types.ObjectId();
const mockDate = '2016-05-18T16:00:00Z';
const UserStub = () => {
    return {
        _id: mockObjectId,
        pseudo: 'JohnDoe',
        role: users_role_interface_1.IUserRole.USER,
        password: 'password',
        email: 'john@doe.fr',
        createdAt: mockDate,
        updatedAt: mockDate,
    };
};
exports.UserStub = UserStub;
const UserStubWithoutPassword = () => {
    return {
        _id: mockObjectId,
        pseudo: 'JohnDoe',
        role: users_role_interface_1.IUserRole.USER,
        email: 'john@doe.fr',
        createdAt: mockDate,
        updatedAt: mockDate,
    };
};
exports.UserStubWithoutPassword = UserStubWithoutPassword;
const UserStubWithoutPasswordAndDates = () => {
    return {
        _id: mockObjectId,
        pseudo: 'JohnDoe',
        role: users_role_interface_1.IUserRole.USER.toString(),
        email: 'john@doe.fr',
    };
};
exports.UserStubWithoutPasswordAndDates = UserStubWithoutPasswordAndDates;
//# sourceMappingURL=user.stub.js.map