// Error handling utility functions

export class AppError extends Error {
  code?: string;
  statusCode?: number;

  constructor(
    message: string,
    code?: string,
    statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const errorHandler = {
  /**
   * Handle and format errors for display
   */
  handleError: (error: unknown): string => {
    if (error instanceof AppError) {
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  },

  /**
   * Log error to console (can be extended to send to error tracking service)
   */
  logError: (error: unknown, context?: string): void => {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    
    // In production, you might want to send to error tracking service like Sentry
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { contexts: { custom: { context } } });
    // }
  },

  /**
   * Create a user-friendly error message
   */
  getUserMessage: (error: unknown): string => {
    const message = errorHandler.handleError(error);
    
    // Map common errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'Network error': 'Unable to connect. Please check your internet connection.',
      'Unauthorized': 'Your session has expired. Please log in again.',
      'Not found': 'The requested resource was not found.',
      'Validation error': 'Please check your input and try again.',
    };
    
    return errorMap[message] || message;
  },
};

export default errorHandler;
