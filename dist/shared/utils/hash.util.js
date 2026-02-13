"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt = require("bcryptjs");
async function hashPassword(password, saltRounds = 12) {
    return bcrypt.hash(password, saltRounds);
}
async function comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
}
//# sourceMappingURL=hash.util.js.map