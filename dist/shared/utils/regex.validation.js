"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRegex = exports.urlPattern = void 0;
exports.urlPattern = '^(https:\\/\\/(www\\.)?|\\/\\/(www\\.)?|www\\.)([0-9A-Za-z-.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(\\/(.)*)?(\\?(.)*)?$';
exports.urlRegex = new RegExp(exports.urlPattern);
//# sourceMappingURL=regex.validation.js.map