import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testPayment() {
  try {
    // 1. Create order
    logger.info('Creating test order...');
    const orderResponse = await fetch('http://localhost:3001/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 9900, // ₹99.00
        currency: 'INR',
        receipt: `test_${Date.now()}`
      })
    });

    if (!orderResponse.ok) {
      throw new Error(`Failed to create order: ${orderResponse.statusText}`);
    }

    const orderData = await orderResponse.json();
    logger.info('Order created successfully', { orderId: orderData.id });

    // 2. Print test payment instructions
    console.log('\n🧪 Test Payment Instructions:');
    console.log('1. Use these test card details:');
    console.log('   - Card Number: 4111 1111 1111 1111');
    console.log('   - Expiry: Any future date (e.g., 12/25)');
    console.log('   - CVV: Any 3 digits (e.g., 123)');
    console.log('   - Name: Any name\n');

    console.log('2. Monitor these locations:');
    console.log('   - Server logs for webhook events');
    console.log('   - Supabase payments table');
    console.log('   - Your email for confirmation');
    console.log('   - Razorpay Dashboard → Webhooks → Recent Deliveries\n');

    // 3. Start webhook monitoring
    console.log('👀 Monitoring webhook events (Ctrl+C to stop)...');
    
    // Keep the script running to see webhook events
    process.stdin.resume();

  } catch (error) {
    logger.error('Test failed', { error });
    process.exit(1);
  }
}

testPayment(); 