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
exports.UserEntity = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const users_role_interface_1 = require("./users.role.interface");
const regex_validation_1 = require("../../shared/utils/regex.validation");
let User = class User {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 18,
    }),
    __metadata("design:type", String)
], User.prototype, "pseudo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        unique: true,
        required: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
        lowercase: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 6 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        default: users_role_interface_1.IUserRole.USER,
        enum: users_role_interface_1.IUserRole,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: false,
        match: [regex_validation_1.urlRegex, 'Please set a valid source url'],
    }),
    __metadata("design:type", String)
], User.prototype, "picture", void 0);
User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.User = User;
exports.UserEntity = mongoose_1.SchemaFactory.createForClass(User)
    .set('timestamps', true)
    .set('versionKey', false);
exports.UserEntity.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
exports.UserEntity.methods.checkPassword = async function (plainPassword) {
    const user = this;
    return await bcrypt.compare(plainPassword, user.password);
};
//# sourceMappingURL=user.entity.js.map