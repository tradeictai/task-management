// ============================================
// ERROR HANDLING SYSTEM
// This is how ALL errors should be handled
// ============================================

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error codes for consistency
export const ErrorCodes = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Create specific error types
export const createError = {
  validation: (message) => new AppError(message, ErrorCodes.VALIDATION_ERROR),
  unauthorized: (message = "Unauthorized") =>
    new AppError(message, ErrorCodes.UNAUTHORIZED),
  forbidden: (message = "Forbidden") =>
    new AppError(message, ErrorCodes.FORBIDDEN),
  notFound: (message = "Not found") =>
    new AppError(message, ErrorCodes.NOT_FOUND),
  conflict: (message) => new AppError(message, ErrorCodes.CONFLICT),
  server: (message = "Internal server error") =>
    new AppError(message, ErrorCodes.SERVER_ERROR),
};
