import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Add type declaration for req.user
declare global {
  namespace Express {
    interface Request {
      user?: any; // replace with proper user type when adding authentication
    }
  }
}

// Simple interface for error info
interface ErrorInfo {
  message: string;
  stack?: string | null;
  path?: string;
  method?: string;
}

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', err);

  // Generate a unique error ID for tracking
  const errorId = generateErrorId();

  // Prepare error info with proper typing
  const errorInfo: ErrorInfo = {
    message: err.message,
    stack: isProduction ? null : err.stack,
    path: req.path,
    method: req.method
  };

  // Log the error
  logger.error('Error occurred', {
    errorId,
    ...errorInfo,
    query: req.query,
    body: req.body
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errorId
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized Access',
      errorId
    });
  }

  if (err.name === 'RazorpayError') {
    return res.status(400).json({
      status: 'error',
      message: 'Payment Processing Error',
      errorId
    });
  }

  // Handle database connection errors
  if (err.name === 'MongoError' || err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      status: 'error',
      message: 'Database Error',
      errorId
    });
  }

  // Rate limiting errors
  if (err.name === 'TooManyRequests') {
    return res.status(429).json({
      status: 'error',
      message: 'Too Many Requests',
      errorId
    });
  }

  // Handle operational vs programmer errors
  const statusCode = (err as AppError).statusCode || 500;
  const responseBody = {
    status: 'error',
    message: isProduction ? 'An error occurred' : errorInfo.message,
    errorId,
    ...(isProduction ? {} : { stack: errorInfo.stack })
  };

  res.status(statusCode).json(responseBody);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found error handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(err);
};

// Rate limit error handler
export const rateLimitHandler = (req: Request, res: Response) => {
  const err = new AppError('Too many requests, please try again later.', 429);
  res.status(429).json({
    status: 'error',
    message: err.message,
    errorId: generateErrorId(),
  });
};

// Validation error handler
export const validationErrorHandler = (errors: any[]) => {
  const message = errors.map(err => err.msg).join(', ');
  return new AppError(message, 400);
}; 