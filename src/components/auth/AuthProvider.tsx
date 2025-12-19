"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name?: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user was logged in from localStorage
    const savedEmail = localStorage.getItem('janusforge_user_email');
    if (savedEmail) {
      const isAdmin = savedEmail === 'admin-access@janusforge.ai';
      setUser({ email: savedEmail, isAdmin });
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    const name = email.split('@')[0];
    const isAdmin = email === 'admin-access@janusforge.ai';
    const userData = { email, name, isAdmin };
    setUser(userData);
    localStorage.setItem('janusforge_user_email', email);
    localStorage.setItem('janusforge_user_isAdmin', String(isAdmin));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('janusforge_user_email');
    localStorage.removeItem('janusforge_user_isAdmin');
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
