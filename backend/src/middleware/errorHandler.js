// ============================================
// ERROR HANDLING MIDDLEWARE
// Catches all async errors automatically
// ============================================

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler - MUST be last middleware
export const errorHandler = (error, req, res, next) => {
  console.error("Error:", error.message);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    data: null,
    message,
  });
};
