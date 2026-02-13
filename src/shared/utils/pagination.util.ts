/**
 * Pagination Utility — NEW (did not exist in old backend)
 * Standardizes pagination across all list endpoints.
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        limit: number;
    };
}

export function parsePagination(params: PaginationParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

export function buildPaginatedResult<T>(
    data: T[],
    totalItems: number,
    page: number,
    limit: number,
): PaginatedResult<T> {
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
