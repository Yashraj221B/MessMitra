import { ApiResponse, PaginatedResponse } from '../types/response.types';

export const successResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (
  message: string,
  error?: any
): ApiResponse => {
  return {
    success: false,
    message,
    error
  };
};

export const paginatedResponse = <T>(
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => {
  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
