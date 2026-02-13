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
export declare function parsePagination(params: PaginationParams): {
    page: number;
    limit: number;
    skip: number;
};
export declare function buildPaginatedResult<T>(data: T[], totalItems: number, page: number, limit: number): PaginatedResult<T>;
