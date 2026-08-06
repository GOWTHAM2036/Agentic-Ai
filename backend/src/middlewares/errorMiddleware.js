const logger = require('../utils/logger');
const { sendError } = require('../utils/responseHandler');

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return sendError(res, message, err.errors || null, statusCode);
};

const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found`, null, 404);
};

module.exports = {
  errorMiddleware,
  notFoundHandler
};
