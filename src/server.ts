import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import createOrderRoute from './api/razorpay/create-order';

// Load environment variables first
dotenv.config();

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing required environment variables');
  console.error('Required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET');
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
  });
  next();
});

// Routes
app.use('/api/razorpay/create-order', createOrderRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    razorpay: !!process.env.RAZORPAY_KEY_ID
  });
});

const PORT = process.env.PORT || 5176;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Razorpay initialized with key: ${process.env.RAZORPAY_KEY_ID}`);
  console.log('='.repeat(50));
}); 