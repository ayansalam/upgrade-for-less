import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedExample() {
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
      <h1>Protected Content</h1>
      <p>You have access because you are logged in and have a successful payment.</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Get user from Supabase session cookie (for SSR)
  // For production, use supabase.auth.getUser() with cookies from context.req.headers.cookie
  // Here, we assume user_id is available in query for demo
  const userId = context.query.user_id || null;
  if (!userId) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'captured')
    .limit(1);
  if (error || data.length === 0) {
    return {
      redirect: { destination: '/payment-required', permanent: false },
    };
  }
  return { props: {} };
} 