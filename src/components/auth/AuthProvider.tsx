"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  tier: string;
  is_admin: boolean;
  stripe_customer_id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseAvailable, setSupabaseAvailable] = useState(false);
  const [usingDemoMode, setUsingDemoMode] = useState(false);

  // Check for demo user in localStorage
  const getDemoUser = (): AuthUser | null => {
    try {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        return JSON.parse(demoUser);
      }
    } catch (e) {
      console.error('Error reading demo user:', e);
    }
    return null;
  };

  const fetchUserProfile = async (supabase: any, email: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.log('User not found in users table, creating basic user record');
        // Create a basic user object from auth data
        const { data: authData } = await supabase.auth.getUser();
        setUser({
          id: authData.user?.id || '',
          email: email,
          name: email.split('@')[0],
          tier: 'free',
          is_admin: email === 'admin-access@janusforge.ai',
        });
      } else {
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Create basic user from auth
      const { data: authData } = await supabase.auth.getUser();
      setUser({
        id: authData.user?.id || '',
        email: email,
        name: email.split('@')[0],
        tier: 'free',
        is_admin: email === 'admin-access@janusforge.ai',
      });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // First check for demo user
      const demoUser = getDemoUser();
      if (demoUser) {
        setUser(demoUser);
        setUsingDemoMode(true);
        setLoading(false);
        return;
      }

      // Try to use Supabase if available
      try {
        const { createClient } = require('@/lib/supabase-client');
        const supabase = createClient();
        setSupabaseAvailable(true);

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          await fetchUserProfile(supabase, session.user.email!);
        }
      } catch (error) {
        console.log('Supabase auth initialization failed, using demo mode:', error);
        setSupabaseAvailable(false);
        setUsingDemoMode(true);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Set up auth state listener only if Supabase is available
    if (supabaseAvailable) {
      try {
        const { createClient } = require('@/lib/supabase-client');
        const supabase = createClient();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: AuthChangeEvent, session: Session | null) => {
            setSession(session);

            if (session?.user) {
              await fetchUserProfile(supabase, session.user.email!);
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.log('Failed to set up auth listener:', error);
      }
    }
  }, [supabaseAvailable]);

  const signIn = async (email: string, password: string) => {
    // First check if it's a demo credential
    const isDemoAdmin = email === 'admin-access@janusforge.ai' && password === 'MyFourKids&8Grandkid';
    const isDemoUser = email === 'cassandra@janusforge.ai' && password === 'password';

    if (isDemoAdmin || isDemoUser) {
      const demoUser: AuthUser = {
        id: 'demo-' + Date.now(),
        email: email,
        name: isDemoAdmin ? 'Admin User' : 'Cassandra Williamson',
        tier: isDemoAdmin ? 'visionary' : 'council',
        is_admin: isDemoAdmin,
      };

      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setUsingDemoMode(true);
      return { error: null };
    }

    // Try Supabase auth
    try {
      const { createClient } = require('@/lib/supabase-client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Fetch user profile
      await fetchUserProfile(supabase, email);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    // Clear demo user
    localStorage.removeItem('demo_user');
    setUsingDemoMode(false);

    // Try Supabase sign out if available
    try {
      const { createClient } = require('@/lib/supabase-client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Supabase sign out failed (may be in demo mode)');
    }

    setUser(null);
    setSession(null);
  };

  const refreshSession = async () => {
    if (usingDemoMode) {
      const demoUser = getDemoUser();
      if (demoUser) {
        setUser(demoUser);
      }
      return;
    }

    try {
      const { createClient } = require('@/lib/supabase-client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(supabase, session.user.email!);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
