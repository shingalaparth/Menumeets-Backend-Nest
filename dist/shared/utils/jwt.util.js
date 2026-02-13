"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = createJWT;
exports.verifyJWT = verifyJWT;
const jwt = require("jsonwebtoken");
function createJWT(payload, secret, expiresIn = '7d') {
    return jwt.sign(payload, secret, { expiresIn });
}
function verifyJWT(token, secret) {
    return jwt.verify(token, secret);
}
//# sourceMappingURL=jwt.util.js.map