import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PaymentRequired() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h1>🔒 Payment Required</h1>
      <p>You need to complete a payment to access this page.</p>
      <a href="/" style={{ color: '#6366f1', textDecoration: 'underline', fontSize: 18 }}>Go to Home</a>
    </div>
  );
} 