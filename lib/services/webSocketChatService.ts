import { Client, StompSubscription, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface WebSocketConfig {
  url: string;
  token?: string;
  userId?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export interface ChatWebSocketService {
  connect: (config: WebSocketConfig) => void;
  disconnect: () => void;
  subscribe: (
    conversationId: number,
    onMessage: (message: any) => void
  ) => void;
  unsubscribe: () => void;
  sendMessage: (conversationId: number, content: string) => Promise<void>;
  isConnected: () => boolean;
}

/**
 * WebSocket service for real-time chat using STOMP
 */
class WebSocketChatService implements ChatWebSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private config: WebSocketConfig | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // 2 seconds

  /**
   * Connect to WebSocket server
   */
  connect(config: WebSocketConfig): void {
    this.config = config;

    // Create STOMP client
    this.client = new Client({
      webSocketFactory: () => new SockJS(config.url) as any,

      connectHeaders: {
        ...(config.token && { Authorization: `Bearer ${config.token}` }),
        ...(config.userId && { "X-User-ID": config.userId }),
      },

      debug: (str) => {
        // console.log("[STOMP Debug]", str);
      },

      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        this.reconnectAttempts = 0;
        config.onConnect?.();
      },

      onDisconnect: () => {
        config.onDisconnect?.();
      },

      onStompError: (frame) => {
        console.error("[WebSocket] STOMP Error:", frame.headers["message"]);
        console.error("[WebSocket] Details:", frame.body);
        config.onError?.(frame);
      },

      onWebSocketError: (event) => {
        console.error("[WebSocket] WebSocket Error:", event);
        config.onError?.(event);
      },

      onWebSocketClose: (event) => {
        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(
            `[WebSocket] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
          );
        }
      },
    });

    // Activate connection
    this.client.activate();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  /**
   * Subscribe to conversation messages
   */
  subscribe(conversationId: number, onMessage: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      console.error("[WebSocket] Cannot subscribe: Not connected");
      return;
    }

    // Unsubscribe from previous conversation
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Subscribe to new conversation
    const destination = `/topic/chat/conversations/${conversationId}`;

    this.subscription = this.client.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const data = JSON.parse(message.body);
          onMessage(data);
        } catch (error) {
          console.error("[WebSocket] Failed to parse message:", error);
        }
      }
    );
  }

  /**
   * Unsubscribe from current conversation
   */
  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  /**
   * Send message to conversation
   */
  async sendMessage(conversationId: number, content: string): Promise<void> {
    if (!this.client || !this.client.connected) {
      throw new Error("WebSocket not connected");
    }

    const destination = `/app/chat/conversations/${conversationId}/send`;
    const payload = { content };

    this.client.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

// Export singleton instance
export const webSocketChatService = new WebSocketChatService();
