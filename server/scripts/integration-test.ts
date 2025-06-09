import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import { supabase } from '../utils/supabase';

const execAsync = promisify(exec);

async function runIntegrationTest() {
  console.log('🚀 Starting integration test...\n');

  // 1. Verify environment
  console.log('Step 1: Verifying environment...');
  try {
    await execAsync('npx ts-node scripts/verify-env.ts');
    console.log('✅ Environment verified\n');
  } catch (error) {
    console.error('❌ Environment verification failed');
    process.exit(1);
  }

  // 2. Check if ngrok is running
  console.log('Step 2: Checking ngrok...');
  try {
    const { stdout } = await execAsync('curl -s http://127.0.0.1:4040/api/tunnels');
    const tunnels = JSON.parse(stdout);
    const webhookUrl = tunnels.tunnels[0]?.public_url;
    
    if (webhookUrl) {
      console.log(`✅ Ngrok is running at ${webhookUrl}`);
      console.log(`🔔 Update your Razorpay webhook URL to: ${webhookUrl}/api/razorpay/webhook\n`);
    } else {
      throw new Error('No active tunnels found');
    }
  } catch (error) {
    console.error('❌ Ngrok is not running. Please start ngrok with:');
    console.log('ngrok http 3001\n');
  }

  // 3. Create a test payment
  console.log('Step 3: Creating test payment...');
  try {
    const startTime = new Date();
    await execAsync('npx ts-node scripts/test-payment.ts');
    
    // Monitor for webhook events
    console.log('👀 Monitoring for webhook events...');
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while (attempts < maxAttempts) {
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .gt('created_at', startTime.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (payments && payments.length > 0) {
        console.log('✅ Payment recorded in database:', {
          payment_id: payments[0].payment_id,
          status: payments[0].status,
          amount: `${payments[0].currency} ${(payments[0].amount/100).toFixed(2)}`
        });
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts === maxAttempts) {
      console.log('⚠️ No webhook events detected within 30 seconds');
    }
  } catch (error) {
    console.error('❌ Test payment failed:', error);
  }

  // 4. Show monitoring dashboard
  console.log('\nStep 4: Running monitoring dashboard...');
  try {
    await execAsync('npx ts-node scripts/monitor-webhooks.ts');
  } catch (error) {
    console.error('❌ Monitoring failed:', error);
  }

  console.log('\n📋 Integration Test Summary:');
  console.log('1. Verify your webhook URL is configured in Razorpay Dashboard');
  console.log('2. Check server logs for webhook events');
  console.log('3. Verify payment entries in Supabase');
  console.log('4. Check your email for confirmation');
  console.log('\n🧪 Test Card Details:');
  console.log('Success: 4111 1111 1111 1111');
  console.log('Failure: Use past expiry date');
}

runIntegrationTest().catch(error => {
  logger.error('Integration test failed', { error });
  process.exit(1);
}); 