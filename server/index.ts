import dotenv from 'dotenv';
import path from 'path';

// Log the exact path we're looking for the .env file
const envPath = path.resolve(__dirname, '.env');
console.log("📂 Looking for .env at:", envPath);

// Try to load .env file
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("❌ Error loading .env:", result.error.message);
} else {
  console.log("✅ Loaded .env successfully from:", envPath);
}

console.log("🔑 KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("🔐 SECRET:", process.env.RAZORPAY_KEY_SECRET ? "***" : "undefined");

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import { securityMiddleware } from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { monitoringMiddleware, paymentMonitoringMiddleware, webhookMonitoringMiddleware } from './middleware/monitoring';
import { webhookRouter } from './routes/webhook';
import { paymentRouter } from './routes/payment';
import { monitoring } from './utils/monitoring';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('combined', { stream }));
app.use(monitoringMiddleware);
app.use(securityMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes with specific monitoring
app.use('/api/razorpay/webhook', webhookMonitoringMiddleware, webhookRouter);
app.use('/api/razorpay', paymentMonitoringMiddleware, paymentRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  const healthStatus = monitoring.getHealthStatus();
  res.status(healthStatus.status === 'healthy' ? 200 : 503).json({
    status: healthStatus.status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    ...healthStatus.details,
  });
});

// Metrics endpoint (protected)
app.get('/metrics', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.METRICS_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json(monitoring.getMetrics());
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  logger.info(`✨ Server running on http://localhost:${port}`);
  logger.info('🌍 Environment:', {
    nodeEnv: process.env.NODE_ENV,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID?.slice(0, 8) + '...',
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Unhandled rejections and exceptions
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection:', reason);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

export default app; 