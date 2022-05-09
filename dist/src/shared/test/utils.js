"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDatabase = void 0;
const clearDatabase = async (dbConnection, collection) => {
    await dbConnection.collection(collection).deleteMany({});
};
exports.clearDatabase = clearDatabase;
//# sourceMappingURL=utils.js.map