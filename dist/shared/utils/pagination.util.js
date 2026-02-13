"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = parsePagination;
exports.buildPaginatedResult = buildPaginatedResult;
function parsePagination(params) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
function buildPaginatedResult(data, totalItems, page, limit) {
    return {
        data,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            limit,
        },
    };
}
//# sourceMappingURL=pagination.util.js.map