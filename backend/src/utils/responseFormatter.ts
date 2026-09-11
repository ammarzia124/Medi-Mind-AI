/**
 * Response formatting utilities
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Creates a success response
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Creates an error response
 */
export function errorResponse(message: string, error?: string): ApiResponse<null> {
  return {
    success: false,
    message,
    error,
  };
}

/**
 * Creates a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  }
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

/**
 * Creates a created response (201)
 */
export function createdResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || 'Resource created successfully',
  };
}

/**
 * Creates a no content response (204)
 */
export function noContentResponse(): ApiResponse<null> {
  return {
    success: true,
    data: null,
  };
}
