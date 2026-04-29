"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errors_1 = require("../utils/errors");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const message = result.error.issues[0].message;
        return next(new errors_1.AppError(message, 400, "VALIDATION_ERROR"));
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
