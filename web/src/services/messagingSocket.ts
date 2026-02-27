import { io, Socket } from "socket.io-client";

export interface MessageEvent {
  type:
    | "new_message"
    | "message_edited"
    | "message_deleted"
    | "user_typing"
    | "user_stopped_typing";
  data: any;
}

export class MessagingSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No access token found, cannot connect to messaging socket");
      return;
    }

    this.socket = io(
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
      {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
      }
    );

    this.socket.on("connect", () => {
      console.log("Connected to messaging socket");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from messaging socket");
      this.isConnected = false;
    });

    this.socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    // Listen for message events
    this.socket.on("new_message", (data: any) => {
      this.emit("new_message", data);
    });

    this.socket.on("message_edited", (data: any) => {
      this.emit("message_edited", data);
    });

    this.socket.on("message_deleted", (data: any) => {
      this.emit("message_deleted", data);
    });

    this.socket.on("user_typing", (data: any) => {
      this.emit("user_typing", data);
    });

    this.socket.on("user_stopped_typing", (data: any) => {
      this.emit("user_stopped_typing", data);
    });

    this.socket.on("messages_read", (data: any) => {
      this.emit("messages_read", data);
    });
  }

  public joinChatRoom(chatRoomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("join_room", { chat_room_id: chatRoomId });
    }
  }

  public leaveChatRoom(chatRoomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave_room", { chat_room_id: chatRoomId });
    }
  }

  public sendTypingIndicator(chatRoomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("typing", { chat_room_id: chatRoomId });
    }
  }

  public sendStoppedTypingIndicator(chatRoomId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("stopped_typing", { chat_room_id: chatRoomId });
    }
  }

  public markMessagesAsRead(chatRoomId: string, messageIds: string[]) {
    if (this.socket && this.isConnected) {
      this.socket.emit("mark_read", {
        chat_room_id: chatRoomId,
        message_ids: messageIds,
      });
    }
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  public reconnect() {
    this.disconnect();
    this.connect();
  }

  public getConnectionStatus() {
    return this.isConnected;
  }
}

// Singleton instance
export const messagingSocket = new MessagingSocketService();
