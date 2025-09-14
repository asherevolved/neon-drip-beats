import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      // Use a more efficient query with timeout
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    // Try to sign up then immediately sign in.
    // Note: If your Supabase project requires email confirmations, the immediate sign-in may fail
    // and the user will still need to confirm via email. For fully bypassing confirmation, a
    // server-side admin user creation (using the service_role key) is required.
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    // If signUp returned a session (some Supabase configs allow instant sign in), we're done.
    if (data?.session) {
      toast({
        title: "Success",
        description: "Account created and signed in",
      });
      return { error: null };
    }

    // Otherwise attempt to sign in immediately (works when email confirm is not enforced)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      // Inform the user that confirmation may be required depending on Supabase settings
      toast({
        title: "Check your email",
        description: "A confirmation link may have been sent. If you don't receive it, contact the site owner.",
      });
      return { error: signInError };
    }

    toast({
      title: "Success",
      description: "Account created and signed in",
    });

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Success",
      description: "Signed out successfully",
    });
    // Redirect to home page after sign out
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}