"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegex = exports.urlPattern = void 0;
exports.urlPattern = 'https:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{2,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
exports.urlRegex = new RegExp(exports.urlPattern);
//# sourceMappingURL=regex.validation.js.map