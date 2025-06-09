import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

// Log Razorpay initialization
console.log('🔐 Initializing Razorpay with key:', key_id);

const razorpay = new Razorpay({
  key_id: key_id || '',
  key_secret: key_secret || '',
});

router.post('/', async (req, res) => {
  console.log("📝 POST /api/razorpay/create-order");
  console.log("📥 req.body =", req.body);

  if (!key_id || !key_secret) {
    console.error("❌ Razorpay credentials missing");
    return res.status(500).json({ error: "Missing Razorpay credentials" });
  }

  try {
    const { amount, planId } = req.body;

    if (!amount || typeof amount !== 'number') {
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({ error: 'Invalid amount' });
    }

    console.log(`📝 Creating order for planId=${planId}, amount=${amount}`);

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${planId}_${Date.now()}`,
    });

    console.log('✅ Order created successfully:', order);

    return res.status(200).json(order);
  } catch (err: any) {
    console.error('❌ Razorpay error:', err.message);
    return res.status(500).json({ error: 'Order creation failed', message: err.message });
  }
});

export default router; 