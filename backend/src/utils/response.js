// ============================================
// RESPONSE FORMAT - ALWAYS USE THIS
// Frontend expects predictable responses
// ============================================

export const sendResponse = (res, statusCode, success, data, message = "") => {
  res.status(statusCode).json({
    success,
    statusCode,
    data,
    message,
  });
};

// Quick helpers for common responses
export const successResponse = (res, data, message = "", statusCode = 200) => {
  sendResponse(res, statusCode, true, data, message);
};

export const errorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  sendResponse(res, statusCode, false, null, message);
};
