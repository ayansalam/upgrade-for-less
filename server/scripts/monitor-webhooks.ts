import { supabase } from '../utils/supabase';
import { logger } from '../utils/logger';

async function monitorWebhooks() {
  try {
    console.log('🔍 Starting webhook monitoring...\n');

    // 1. Check recent payments
    const { data: recentPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (paymentsError) throw paymentsError;

    console.log('Recent Payments:');
    console.table(recentPayments?.map(p => ({
      payment_id: p.payment_id,
      status: p.status,
      amount: `${p.currency} ${(p.amount/100).toFixed(2)}`,
      created_at: new Date(p.created_at).toLocaleString()
    })));

    // 2. Check payment statuses distribution
    const { data: statusCounts, error: statusError } = await supabase
      .from('payments')
      .select('status, count(*)')
      .group('status');

    if (statusError) throw statusError;

    console.log('\nPayment Status Distribution:');
    console.table(statusCounts);

    // 3. Check for failed webhooks
    const { data: failedPayments, error: failedError } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'failed')
      .order('created_at', { ascending: false })
      .limit(5);

    if (failedError) throw failedError;

    if (failedPayments?.length) {
      console.log('\n⚠️ Recent Failed Payments:');
      console.table(failedPayments.map(p => ({
        payment_id: p.payment_id,
        amount: `${p.currency} ${(p.amount/100).toFixed(2)}`,
        created_at: new Date(p.created_at).toLocaleString()
      })));
    }

    console.log('\n✅ Monitoring complete!');
    process.exit(0);

  } catch (error) {
    logger.error('Monitoring failed', { error });
    process.exit(1);
  }
}

monitorWebhooks(); 