"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TIER_CONFIGS, UserTier, TOKEN_PACKAGES } from '@/config/tiers';

interface User {
  id: string;
  email: string;
  name?: string;
  tier: UserTier;
  isAdmin: boolean;
  tokens_used: number;
  tokens_remaining: number;
  purchased_tokens: number; // Tokens from add-on packages
  max_ai_models: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing';
  token_packages?: Array<{
    packageId: string;
    tokens: number;
    purchasedAt: string;
    expiresAt: string;
    used: number;
  }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  useTokens: (count: number, purpose: string) => boolean;
  getRemainingTokens: () => number;
  purchaseTokenPackage: (packageId: string) => Promise<{ success: boolean; error?: string }>;
  upgradeTier: (newTier: UserTier) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, error: 'Not implemented' }),
  logout: () => {},
  register: async () => ({ success: false, error: 'Not implemented' }),
  refreshUser: async () => {},
  useTokens: () => false,
  getRemainingTokens: () => 0,
  purchaseTokenPackage: async () => ({ success: false, error: 'Not implemented' }),
  upgradeTier: async () => ({ success: false, error: 'Not implemented' }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock API - replace with real backend
  const mockAPI = {
    login: async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Demo admin
      if (email === 'admin-access@janusforge.ai') {
        return {
          success: true,
          user: {
            id: 'admin-1',
            email,
            name: 'Admin User',
            tier: 'admin',
            isAdmin: true,
            tokens_used: 0,
            tokens_remaining: TIER_CONFIGS.admin.monthly_tokens,
            purchased_tokens: 0,
            max_ai_models: TIER_CONFIGS.admin.max_ai_models,
            token_packages: [],
          }
        };
      }
      
      // Demo tier users
      const demoUsers = {
        'free@example.com': { tier: 'free' as UserTier, name: 'Free User' },
        'basic@example.com': { tier: 'basic' as UserTier, name: 'Basic User' },
        'pro@example.com': { tier: 'pro' as UserTier, name: 'Pro User' },
        'enterprise@example.com': { tier: 'enterprise' as UserTier, name: 'Enterprise User' },
      };
      
      const tier = demoUsers[email as keyof typeof demoUsers]?.tier || 'free';
      const name = demoUsers[email as keyof typeof demoUsers]?.name || email.split('@')[0];
      
      return {
        success: true,
        user: {
          id: `demo-${Date.now()}`,
          email,
          name,
          tier,
          isAdmin: false,
          tokens_used: Math.floor(Math.random() * 20),
          tokens_remaining: TIER_CONFIGS[tier].monthly_tokens,
          purchased_tokens: tier === 'pro' ? 500 : 0,
          max_ai_models: TIER_CONFIGS[tier].max_ai_models,
          token_packages: tier === 'pro' ? [{
            packageId: 'token-500',
            tokens: 500,
            purchasedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            used: 150,
          }] : [],
        }
      };
    },
    
    register: async (email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        user: {
          id: `new-${Date.now()}`,
          email,
          name,
          tier: 'free',
          isAdmin: false,
          tokens_used: 0,
          tokens_remaining: TIER_CONFIGS.free.monthly_tokens,
          purchased_tokens: 0,
          max_ai_models: TIER_CONFIGS.free.max_ai_models,
          token_packages: [],
        }
      };
    },
    
    purchaseTokens: async (userId: string, packageId: string): Promise<{ success: boolean; tokens?: number; error?: string }> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const pkg = TOKEN_PACKAGES.find(p => p.id === packageId);
      if (!pkg) {
        return { success: false, error: 'Package not found' };
      }
      
      // In reality, this would process payment via Stripe
      console.log(`Processing payment of $${pkg.price} for ${pkg.tokens} tokens`);
      
      return {
        success: true,
        tokens: pkg.tokens,
      };
    },
    
    upgradeTier: async (userId: string, newTier: UserTier): Promise<{ success: boolean; error?: string }> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In reality, this would update Stripe subscription
      console.log(`Upgrading user to ${newTier} tier at $${TIER_CONFIGS[newTier].price}/month`);
      
      return { success: true };
    },
    
    useTokens: async (userId: string, tokenCount: number, purpose: string): Promise<{ success: boolean; remaining?: number; error?: string }> => {
      // In reality, this would check token balance and deduct
      return { success: true, remaining: 100 }; // Mock
    },
    
    getCurrentUser: async (): Promise<User | null> => {
      const saved = localStorage.getItem('janusforge_user');
      if (!saved) return null;
      
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    },
  };

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await mockAPI.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await mockAPI.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('janusforge_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await mockAPI.register(email, password, name);
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('janusforge_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('janusforge_user');
    window.location.href = '/';
  };

  const refreshUser = async () => {
    // In reality, fetch fresh user data from backend
    const saved = localStorage.getItem('janusforge_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  const useTokens = (count: number, purpose: string): boolean => {
    if (!user) return false;
    
    const totalTokens = user.tokens_remaining + user.purchased_tokens;
    if (totalTokens < count) {
      console.log(`Insufficient tokens: need ${count}, have ${totalTokens}`);
      return false;
    }
    
    // Update user state (in reality, call backend)
    let remaining = user.tokens_remaining;
    let purchased = user.purchased_tokens;
    
    // Use monthly tokens first
    if (remaining >= count) {
      remaining -= count;
    } else {
      const fromMonthly = remaining;
      const fromPurchased = count - fromMonthly;
      remaining = 0;
      purchased -= fromPurchased;
    }
    
    const updatedUser = {
      ...user,
      tokens_used: user.tokens_used + count,
      tokens_remaining: remaining,
      purchased_tokens: purchased,
    };
    
    setUser(updatedUser);
    localStorage.setItem('janusforge_user', JSON.stringify(updatedUser));
    
    console.log(`Used ${count} tokens for: ${purpose}`);
    return true;
  };

  const getRemainingTokens = (): number => {
    if (!user) return 0;
    return user.tokens_remaining + user.purchased_tokens;
  };

  const purchaseTokenPackage = async (packageId: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    setIsLoading(true);
    try {
      const result = await mockAPI.purchaseTokens(user.id, packageId);
      
      if (result.success && result.tokens) {
        const packageData = TOKEN_PACKAGES.find(p => p.id === packageId);
        const updatedUser = {
          ...user,
          purchased_tokens: user.purchased_tokens + result.tokens,
          token_packages: [
            ...(user.token_packages || []),
            {
              packageId,
              tokens: result.tokens,
              purchasedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              used: 0,
            }
          ],
        };
        
        setUser(updatedUser);
        localStorage.setItem('janusforge_user', JSON.stringify(updatedUser));
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Purchase failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeTier = async (newTier: UserTier) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    setIsLoading(true);
    try {
      const result = await mockAPI.upgradeTier(user.id, newTier);
      
      if (result.success) {
        const updatedUser = {
          ...user,
          tier: newTier,
          max_ai_models: TIER_CONFIGS[newTier].max_ai_models,
          // Reset monthly tokens for new tier
          tokens_used: 0,
          tokens_remaining: TIER_CONFIGS[newTier].monthly_tokens,
        };
        
        setUser(updatedUser);
        localStorage.setItem('janusforge_user', JSON.stringify(updatedUser));
        
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Upgrade failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      refreshUser,
      useTokens,
      getRemainingTokens,
      purchaseTokenPackage,
      upgradeTier,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
