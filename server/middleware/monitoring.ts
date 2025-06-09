import { Request, Response, NextFunction } from 'express';
import { monitoring } from '../utils/monitoring';
import { logger } from '../utils/logger';

interface RequestWithTiming extends Request {
  startTime?: number;
}

export const monitoringMiddleware = (req: RequestWithTiming, res: Response, next: NextFunction) => {
  // Add request start time
  req.startTime = Date.now();

  // Track request
  monitoring.trackRequest();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Track response
  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || 0);

    // Log response
    logger.info('Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });

    // Track response in monitoring
    monitoring.trackResponse();

    // Track slow responses
    if (duration > 1000) {
      logger.warn('Slow response detected', {
        method: req.method,
        path: req.path,
        duration,
      });
    }
  });

  // Track errors
  res.on('error', (error) => {
    logger.error('Response error', {
      method: req.method,
      path: req.path,
      error: error.message,
    });

    monitoring.trackError(error);
  });

  next();
};

// Middleware to track payment-specific metrics
export const paymentMonitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log payment request
  logger.info('Payment request received', {
    method: req.method,
    path: req.path,
    amount: req.body?.amount,
    currency: req.body?.currency,
  });

  // Override response methods to track payment status
  const originalJson = res.json;
  res.json = function(body: any) {
    // Log payment response
    logger.info('Payment response', {
      method: req.method,
      path: req.path,
      status: body?.status,
      duration: Date.now() - startTime,
    });

    return originalJson.call(this, body);
  };

  next();
};

// Middleware to track webhook metrics
export const webhookMonitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log webhook request
  logger.info('Webhook received', {
    event: req.body?.event,
    contains: req.body?.contains,
  });

  // Override response methods to track webhook processing
  const originalJson = res.json;
  res.json = function(body: any) {
    // Log webhook response
    logger.info('Webhook processed', {
      event: req.body?.event,
      status: body?.status,
      duration: Date.now() - startTime,
    });

    return originalJson.call(this, body);
  };

  next();
}; 