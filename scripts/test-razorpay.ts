import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.error("❌ Razorpay ENV variables missing");
  process.exit(1);
}

console.log("🔑 Using Razorpay key:", key_id);

const razorpay = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

async function testCreateOrder() {
  console.log("Testing Razorpay order creation...");

  try {
    const order = await razorpay.orders.create({
      amount: 5000, // ₹50
      currency: 'INR',
      receipt: 'test_' + Date.now(),
    });

    console.log("✅ Order created successfully:", {
      orderId: order.id,
      amount: Number(order.amount) / 100, // Convert paise to rupees for display
      currency: order.currency,
      receipt: order.receipt
    });

  } catch (error: any) {
    console.error("❌ Order creation failed:", error.message);
    process.exit(1);
  }
}

testCreateOrder(); 