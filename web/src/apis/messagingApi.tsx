import axiosInstance from "./axiosInstance";

export const useMessagingOperations = () => {
  // Get all chat rooms for current user
  const getChatRooms = async (
    page: number = 1,
    perPage: number = 20
  ): Promise<ChatRoomsResponse> => {
    try {
      const response = await axiosInstance.get(`/messaging/chat-rooms`, {
        params: { page, per_page: perPage },
      });
      console.log("Chat room response", response);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  };

  // Create or get existing chat room
  const createOrGetChatRoom = async (
    participantId: string,
    propertyId?: string
  ): Promise<{ chat_room_id: string }> => {
    try {
      const response = await axiosInstance.post(`/messaging/chat-rooms`, {
        participant_id: participantId,
        property_id: propertyId,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating/getting chat room:", error);
      throw error;
    }
  };

  // Get messages for a specific chat room
  const getMessages = async (
    chatRoomId: string,
    page: number = 1,
    perPage: number = 50
  ): Promise<MessagesResponse> => {
    try {
      const response = await axiosInstance.get(
        `/messaging/chat-rooms/${chatRoomId}/messages`,
        {
          params: { page, per_page: perPage },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  };

  // Send a text message
  const sendMessage = async (
    chatRoomId: string,
    content: string
  ): Promise<Message> => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("message_type", "text");

      const response = await axiosInstance.post(
        `/messaging/chat-rooms/${chatRoomId}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.message;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Send a file message
  const sendFileMessage = async (
    chatRoomId: string,
    file: File,
    content?: string
  ): Promise<Message> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (content) {
        formData.append("content", content);
      }

      const response = await axiosInstance.post(
        `/messaging/chat-rooms/${chatRoomId}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.message;
    } catch (error) {
      console.error("Error sending file message:", error);
      throw error;
    }
  };

  // Edit a message
  const editMessage = async (
    messageId: string,
    content: string
  ): Promise<Message> => {
    try {
      const response = await axiosInstance.put(
        `/messaging/messages/${messageId}`,
        {
          content,
        }
      );
      return response.data.data.message;
    } catch (error) {
      console.error("Error editing message:", error);
      throw error;
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/messaging/messages/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (
    chatRoomId: string
  ): Promise<{ marked_read: number }> => {
    try {
      const response = await axiosInstance.post(
        `/messaging/chat-rooms/${chatRoomId}/mark-read`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  };

  return {
    getChatRooms,
    createOrGetChatRoom,
    getMessages,
    sendMessage,
    sendFileMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
  };
};
