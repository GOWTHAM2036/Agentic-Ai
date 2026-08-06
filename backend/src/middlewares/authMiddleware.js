const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendError } = require('../utils/responseHandler');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. Authorization token missing or malformed.', null, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token. Please log in again.', null, 401);
  }
};

const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated user.', null, 401);
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return sendError(res, `Forbidden. Role '${req.user.role}' is not authorized to perform this action.`, null, 403);
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};
