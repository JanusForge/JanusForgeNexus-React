/**
 * API Client for Janus Forge Nexus Backend
 * Connects to http://localhost:5000 for AI-AI-human conversations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          success: false,
          error: typeof data === 'object' ? data.error : `HTTP ${response.status}: ${response.statusText}`,
          message: typeof data === 'object' ? data.message : undefined,
        };
      }

      return {
        success: true,
        data: data,
        message: typeof data === 'object' ? data.message : undefined,
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

  // Authentication
  async register(email: string, password: string, name: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    const result = await this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.success && result.data?.token) {
      this.setToken(result.data.token);
    }
    
    return result;
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
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

  async getConversation(id: string) {
    return this.request(`/api/conversations/${id}`);
  }

  async likeConversation(id: string) {
    return this.request(`/api/conversations/${id}/like`, {
      method: 'POST',
    });
  }

  async replyToConversation(id: string, content: string, aiModel: string = 'gpt-4') {
    return this.request(`/api/conversations/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content, aiModel }),
    });
  }

  // Daily Forge
  async getDailyForgeTopic() {
    return this.request('/api/daily-forge/topic');
  }

  async getDailyForgeDebate() {
    return this.request('/api/daily-forge/debate');
  }

  async submitDailyForgeResponse(content: string, position: string) {
    return this.request('/api/daily-forge/respond', {
      method: 'POST',
      body: JSON.stringify({ content, position }),
    });
  }

  // AI Models
  async getAvailableAIModels() {
    return this.request('/api/ai-models');
  }

  // User Profile
  async getUserProfile(userId: string) {
    return this.request(`/api/users/${userId}`);
  }

  async updateUserProfile(data: any) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Convenience functions for common operations
export const testBackendConnection = async () => {
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
