"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStubWithoutPasswordAndDates = exports.UserStubWithoutPassword = exports.UserStub = exports.adminStub = exports.mockDate = void 0;
const users_role_interface_1 = require("../../entities/users.role.interface");
const Mongoose = require("mongoose");
const mockObjectId = new Mongoose.Types.ObjectId();
exports.mockDate = '2016-05-18T16:00:00Z';
const authId = new Mongoose.Types.ObjectId();
const adminStub = () => {
    return {
        email: 'admin@doe.fr',
        _id: authId,
        password: 'password',
        pseudo: 'adminDoe',
        role: users_role_interface_1.IUserRole.ADMIN,
        createdAt: exports.mockDate,
        updatedAt: exports.mockDate,
    };
};
exports.adminStub = adminStub;
const UserStub = (role = users_role_interface_1.IUserRole.USER, id = mockObjectId) => {
    return {
        _id: id,
        pseudo: 'JohnDoe',
        role,
        password: 'password',
        email: 'john@doe.fr',
        createdAt: exports.mockDate,
        updatedAt: exports.mockDate,
    };
};
exports.UserStub = UserStub;
const UserStubWithoutPassword = () => {
    return {
        _id: mockObjectId,
        pseudo: 'JohnDoe',
        role: users_role_interface_1.IUserRole.USER,
        email: 'john@doe.fr',
        createdAt: exports.mockDate,
        updatedAt: exports.mockDate,
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