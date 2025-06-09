import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyEnvironment() {
  const results = {
    razorpay: false,
    supabase: false,
    email: false
  };

  console.log('🔍 Verifying environment setup...\n');

  // 1. Verify Razorpay credentials
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    });
    await razorpay.orders.all({ count: 1 });
    results.razorpay = true;
    console.log('✅ Razorpay credentials verified');
  } catch (err: any) {
    console.error('❌ Razorpay verification failed:', err.message);
  }

  // 2. Verify Supabase connection
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    const { data, error } = await supabase
      .from('payments')
      .select('count(*)')
      .limit(1);
    
    if (error) throw error;
    results.supabase = true;
    console.log('✅ Supabase connection verified');
  } catch (err: any) {
    console.error('❌ Supabase verification failed:', err.message);
  }

  // 3. Verify email configuration
  if (process.env.RESEND_API_KEY) {
    results.email = true;
    console.log('✅ Email API key verified');
  } else {
    console.error('❌ Missing RESEND_API_KEY');
  }

  // 4. Check webhook secret
  if (process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.log('✅ Webhook secret is set');
  } else {
    console.error('❌ Missing RAZORPAY_WEBHOOK_SECRET');
  }

  console.log('\n📋 Environment Variables Status:');
  console.table({
    'Razorpay Integration': {
      status: results.razorpay ? '✅' : '❌',
      required: [
        'RAZORPAY_KEY_ID',
        'RAZORPAY_KEY_SECRET',
        'RAZORPAY_WEBHOOK_SECRET'
      ]
    },
    'Supabase Integration': {
      status: results.supabase ? '✅' : '❌',
      required: [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_KEY'
      ]
    },
    'Email Integration': {
      status: results.email ? '✅' : '❌',
      required: [
        'RESEND_API_KEY'
      ]
    }
  });

  // Exit with appropriate code
  if (Object.values(results).every(r => r)) {
    console.log('\n✨ All integrations verified successfully!');
    process.exit(0);
  } else {
    console.error('\n⚠️ Some verifications failed. Please check the errors above.');
    process.exit(1);
  }
}

verifyEnvironment().catch((err: Error) => {
  logger.error('Verification script failed', { error: err.message });
  process.exit(1);
}); 