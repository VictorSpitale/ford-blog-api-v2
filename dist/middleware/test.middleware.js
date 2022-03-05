"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
function test(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}
exports.test = test;
//# sourceMappingURL=test.middleware.js.map