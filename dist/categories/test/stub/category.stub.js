"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryStub = void 0;
const Mongoose = require("mongoose");
const mockObjectId = new Mongoose.Types.ObjectId();
const CategoryStub = () => {
    return {
        _id: mockObjectId,
        name: 'sport',
    };
};
exports.CategoryStub = CategoryStub;
//# sourceMappingURL=category.stub.js.map