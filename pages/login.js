import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (user) return null;

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>Login / Signup</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        theme="light"
      />
    </div>
  );
} 