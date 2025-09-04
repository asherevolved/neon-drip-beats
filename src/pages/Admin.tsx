import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { Loader2 } from 'lucide-react';

export default function Admin() {
  const { user, loading, isAdmin } = useAuth();

  console.log('Admin page render:', { user: !!user, loading, isAdmin });

  // Show loading while checking auth
  if (loading) {
    console.log('Admin page: showing loading state');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    console.log('Admin page: no user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    console.log('Admin page: user not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin page: rendering admin dashboard');
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/10" />
      <div className="relative z-10">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <AdminTabs />
        </main>
      </div>
    </div>
  );
}