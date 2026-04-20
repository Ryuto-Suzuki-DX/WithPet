/*
 * APIの戻り値の型の共通ルール
 */

export type ApiResponse<T> = {
    data: T;
    message?: string;
};

export type ApiErrorResponse = {
    message: string;
    code?: string;
};

export type PagninatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
};