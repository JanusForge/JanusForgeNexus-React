/**
 * Production API Client for Janus Forge Nexus
 * Connects to https://janusforgenexus-backend.onrender.com
 */

// PRODUCTION BACKEND - This is what the public will use
const API_BASE_URL = 'https://janusforgenexus-backend.onrender.com';

console.log('🌐 PRODUCTION API Client configured to:', API_BASE_URL);

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
          message: data.message,
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
      };
    } catch (error) {
      console.error(`API request failed to ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Health & Status
  async healthCheck() {
    return this.request('/api/health');
  }

  async testConnection() {
    return this.request('/api/test');
  }

  async getDatabaseStatus() {
    return this.request('/api/db-status');
  }

  // Conversations
  async getConversations(page: number = 1, limit: number = 20) {
    return this.request(`/api/conversations?page=${page}&limit=${limit}`);
  }

  async createConversation(content: string, aiModel: string = 'gpt-4') {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ content, aiModel }),
    });
  }

  // Daily Forge
  async getDailyForgeTopic() {
    return this.request('/api/daily-forge/topic');
  }

  // AI Models
  async getAvailableAIModels() {
    return this.request('/api/ai-models');
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Convenience functions
export const testBackendConnection = async () => {
  console.log('🔍 Testing PRODUCTION backend connection');
  return apiClient.healthCheck();
};

export const fetchDailyForgeTopic = async () => {
  return apiClient.getDailyForgeTopic();
};

export const fetchConversations = async (page: number = 1) => {
  return apiClient.getConversations(page);
};

export const createNewConversation = async (content: string, aiModel: string = 'gpt-4') => {
  return apiClient.createConversation(content, aiModel);
};
