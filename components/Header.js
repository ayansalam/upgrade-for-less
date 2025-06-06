import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header style={{ padding: 16, background: '#f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link href="/">
          <span style={{ fontWeight: 700, fontSize: 20, color: '#6366f1', cursor: 'pointer' }}>Upgrade for Less</span>
        </Link>
        <Link href="/dashboard" style={{ marginLeft: 24 }}>Dashboard</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16 }}>Logged in as {user.email}</span>
            <button onClick={handleLogout} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link href="/login">
            <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Login</button>
          </Link>
        )}
      </div>
    </header>
  );
} 