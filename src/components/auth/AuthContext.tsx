"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user was logged in
    const loggedIn = localStorage.getItem('janusforge_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('janusforge_logged_in', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('janusforge_logged_in');
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
