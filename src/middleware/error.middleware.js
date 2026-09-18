import { sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  return sendError(
    res,
    err.message || 'Internal Server Error',
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};