// API Client for Janus Forge Nexus
// Connects to backend at localhost:5000

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
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
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/api/health');
  }

  // Authentication
  async authenticate(email: string, password: string): Promise<ApiResponse<{
    id: string;
    email: string;
    name: string;
    tier: string;
    tokens_remaining: number;
    purchased_tokens: number;
    isAdmin: boolean;
    token: string;
  }>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Registration
  async register(email: string, password: string, name: string): Promise<ApiResponse<{
    id: string;
    email: string;
    name: string;
    tier: string;
    tokens_remaining: number;
    purchased_tokens: number;
    token: string;
  }>> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<{
    id: string;
    email: string;
    name: string;
    tier: string;
    tokens_remaining: number;
    purchased_tokens: number;
    isAdmin: boolean;
  }>> {
    return this.request('/api/auth/me');
  }

  // Conversations
  async getConversations(page: number = 1, limit: number = 20): Promise<ApiResponse<any[]>> {
    return this.request(`/api/conversations?page=${page}&limit=${limit}`);
  }

  async createConversation(content: string, model: string = 'gpt-4'): Promise<ApiResponse<{
    id: string;
    content: string;
    user_id: string;
    is_ai: boolean;
    created_at: string;
  }>> {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ content, model }),
    });
  }

  async likeConversation(id: string): Promise<ApiResponse<{
    id: string;
    likes: number;
  }>> {
    return this.request(`/api/conversations/${id}/like`, {
      method: 'POST',
    });
  }

  async replyToConversation(id: string, content: string): Promise<ApiResponse<{
    id: string;
    content: string;
    parent_id: string;
    user_id: string;
    created_at: string;
  }>> {
    return this.request(`/api/conversations/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Daily Forge
  async getDailyForgeTopic(): Promise<ApiResponse<{
    id: string;
    title: string;
    description: string;
    created_at: string;
    positions: Array<{
      id: string;
      position: string;
      ai: string;
      votes: number;
    }>;
  }>> {
    return this.request('/api/daily-forge/current');
  }

  async submitDailyForgeVote(topicId: string, positionId: string): Promise<ApiResponse> {
    return this.request(`/api/daily-forge/${topicId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ positionId }),
    });
  }

  // Token management
  async getTokenBalance(): Promise<ApiResponse<{
    tokens_remaining: number;
    purchased_tokens: number;
    total_tokens: number;
  }>> {
    return this.request('/api/user/tokens');
  }

  // Test function for development
  async testBackendConnection(): Promise<ApiResponse> {
    return this.request('/api/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual functions for convenience
export const healthCheck = () => apiClient.healthCheck();
export const authenticate = (email: string, password: string) => apiClient.authenticate(email, password);
export const register = (email: string, password: string, name: string) => apiClient.register(email, password, name);
export const getCurrentUser = () => apiClient.getCurrentUser();
export const getConversations = (page?: number, limit?: number) => apiClient.getConversations(page, limit);
export const createConversation = (content: string, model?: string) => apiClient.createConversation(content, model);
export const likeConversation = (id: string) => apiClient.likeConversation(id);
export const replyToConversation = (id: string, content: string) => apiClient.replyToConversation(id, content);
export const fetchDailyForgeTopic = () => apiClient.getDailyForgeTopic();
export const submitDailyForgeVote = (topicId: string, positionId: string) => apiClient.submitDailyForgeVote(topicId, positionId);
export const getTokenBalance = () => apiClient.getTokenBalance();
export const testBackendConnection = () => apiClient.testBackendConnection();
