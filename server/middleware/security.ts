import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { rateLimitHandler } from './errorHandler';

// Rate limiting configuration
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // Limit each IP to 100 requests per windowMs
  handler: rateLimitHandler,
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600, // 10 minutes
};

// Custom security headers
const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add CSP in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' https://checkout.razorpay.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://api.razorpay.com; " +
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; " +
      "font-src 'self' data:; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none'; " +
      "block-all-mixed-content; " +
      "upgrade-insecure-requests;"
    );
  }

  next();
};

// Request sanitization middleware
const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Function to recursively sanitize an object
  const sanitizeObject = (obj: any): any => {
    if (!obj) return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Remove any keys containing sensitive information
        if (!key.toLowerCase().includes('password') &&
            !key.toLowerCase().includes('token') &&
            !key.toLowerCase().includes('secret')) {
          sanitized[key] = sanitizeObject(value);
        }
      }
      return sanitized;
    }

    // If it's a string, sanitize it
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/data:/gi, '') // Remove data: protocol
        .trim();
    }

    return obj;
  };

  // Sanitize body, query, and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

// Payload size limiter
const payloadSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1MB

  if (contentLength > MAX_PAYLOAD_SIZE) {
    return res.status(413).json({
      status: 'error',
      message: 'Payload too large',
    });
  }

  next();
};

// Combine all security middleware
export const securityMiddleware = [
  // Third-party security middleware
  helmet({
    contentSecurityPolicy: false, // We handle this in securityHeaders
  }),
  cors(corsOptions),
  rateLimiter,

  // Custom security middleware
  securityHeaders,
  sanitizeRequest,
  payloadSizeLimit,
];

// Webhook-specific security middleware
export const webhookSecurityMiddleware = [
  // Specific rate limiter for webhooks
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 webhook requests per minute
    handler: rateLimitHandler,
  }),
  
  // Skip CORS for webhooks
  cors({ origin: '*' }),
  
  // Verify webhook signature
  (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing webhook signature',
      });
    }
    next();
  },
  
  // Larger payload size limit for webhooks
  (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const MAX_WEBHOOK_SIZE = 5 * 1024 * 1024; // 5MB

    if (contentLength > MAX_WEBHOOK_SIZE) {
      return res.status(413).json({
        status: 'error',
        message: 'Webhook payload too large',
      });
    }

    next();
  },
]; 