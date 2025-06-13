// utils/asyncHandler_V1.js
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler; // ✅ Correct way to export the function
