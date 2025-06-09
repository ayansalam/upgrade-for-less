import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import createOrderRouter from './razorpay/create-order';
import webhookRouter from './razorpay/webhook';

const app = express();

// Enable CORS
app.use(cors());

// Custom middleware to preserve raw body for webhook signature verification
const rawBodySaver = (req: express.Request, _res: express.Response, buf: Buffer, encoding: BufferEncoding) => {
  if (buf && buf.length) {
    // Store raw body for signature verification
    (req as any).rawBody = buf.toString(encoding || 'utf8');
  }
};

// Configure body parsers based on route
// 1. Raw body parser for Razorpay webhooks
app.use('/api/razorpay/webhook', 
  bodyParser.raw({ 
    type: 'application/json',
    verify: rawBodySaver
  })
);

// 2. JSON parser for all other routes
app.use(bodyParser.json());

// Mount Razorpay routes
app.use('/api/razorpay/create-order', createOrderRouter);
app.use('/api/razorpay/webhook', webhookRouter);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app; 