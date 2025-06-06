import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [payments, setPayments] = useState([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!loading && user) {
      async function fetchPayments() {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) console.error(error);
        else setPayments(data);
      }
      fetchPayments();
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <h1>Billing Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Payment ID</th>
            <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Amount (₹)</th>
            <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Status</th>
            <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.razorpay_payment_id}</td>
              <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.amount / 100}</td>
              <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{p.status}</td>
              <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 