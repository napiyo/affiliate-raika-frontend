// Common error shape
export interface ApiError {
    success: false;
    message: string;
  }
  
  // Generic success wrapper
  export interface ApiSuccess<T> {
    success: true;
    data: T;
  }
  
  
  export type ApiResponse<T> = ApiSuccess<T> | ApiError;
  