"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowAny = exports.ALLOW_ANY_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ALLOW_ANY_KEY = 'allow-any';
const AllowAny = () => (0, common_1.SetMetadata)(exports.ALLOW_ANY_KEY, true);
exports.AllowAny = AllowAny;
//# sourceMappingURL=allow-any.decorator.js.map