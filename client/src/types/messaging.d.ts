interface ChatRoom {
  id: string;
  participant: {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
    user_type: string;
  };
  property?: {
    id: string;
    name: string;
    address: string;
    cover_image?: string;
  };
  last_message?: {
    id: string;
    content: string;
    message_type: string;
    sender_name: string;
    timestamp: string;
    is_own_message: boolean;
  };
  unread_count: number;
  created_at: string;
  last_message_at?: string;
}

interface Message {
  id: string;
  content: string;
  message_type: "text" | "file" | "image" | "document";
  file_path?: string;
  file_name?: string;
  file_size?: string;
  file_type?: string;
  metadata?: Record<string, any>;
  sender: {
    id: string;
    name: string;
    profile_picture?: string;
    user_type: string;
  };
  is_own_message: boolean;
  is_read: boolean;
  is_edited: boolean;
  edited_at?: string;
  timestamp: string;
}

interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface ChatRoomsResponse {
  chat_rooms: ChatRoom[];
  pagination: PaginationInfo;
}

interface MessagesResponse {
  messages: Message[];
  chat_room: {
    id: string;
    participant: {
      id: string;
      name: string;
      user_type: string;
    };
  };
  pagination: PaginationInfo;
}
