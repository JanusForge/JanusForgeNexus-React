// WebSocket client for Janus Forge Nexus
// Handles real-time AI-AI-human discourse updates

import { API_CONFIG } from './config';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = API_CONFIG.WS.MAX_RECONNECT_ATTEMPTS;
  private reconnectInterval = API_CONFIG.WS.RECONNECT_INTERVAL;
  private listeners: Map<string, Function[]> = new Map();
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    // Initialize WebSocket connection only on client side to avoid Next.js build errors
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        console.log(`Connecting to WebSocket at: ${API_CONFIG.WS_URL}`);
        this.ws = new WebSocket(API_CONFIG.WS_URL);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected successfully');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.emit(message.type, message.data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.ws = null;
          this.connectionPromise = null;
          this.scheduleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts} in ${this.reconnectInterval}ms`);
      setTimeout(() => {
        this.connect().catch(() => {
          // Connection failed, logic will retry via onclose -> scheduleReconnect
        });
      }, this.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached. Please refresh the page.');
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for event ${event}:`, error);
        }
      });
    }
  }

  send(event: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, data }));
    } else {
      console.warn('⚠️ WebSocket not connected, message not sent:', event);
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionPromise = null;
    this.listeners.clear();
  }
}

// Create and export a singleton instance for the entire application
export const websocketClient = new WebSocketClient();
