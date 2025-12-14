import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Badge,
} from "@mantine/core";
import { IconMessage, IconUsers, IconPlus } from "@tabler/icons-react";
import { ChatRoomsList } from "../components/messaging/ChatRoomsList";
import { ChatInterface } from "../components/messaging/ChatInterface";
import { useMessagingOperations } from "../apis/messagingApi";
import { MessagingSocketService } from "../services/messagingSocket";
import { useUser } from "../context/UserContext";

// Type definitions
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

export const MessagingPage: React.FC = () => {
  const { user, token } = useUser();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagingOps = useMessagingOperations();

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      const socketService = new MessagingSocketService();

      // Listen for new messages to update room list
      socketService.on("new_message", (_message: any) => {
        loadChatRooms(); // Refresh rooms to update last message and unread count
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [token]);

  // Load chat rooms
  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const response = await messagingOps.getChatRooms();
      setChatRooms(response.chat_rooms);
    } catch (err: any) {
      setError(err.message || "Failed to load chat rooms");
    } finally {
      setLoading(false);
    }
  };

  // Load chat rooms on mount
  useEffect(() => {
    loadChatRooms();
  }, []);

  // Handle room selection
  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  // Handle new chat room creation
  const handleCreateChatRoom = async (
    propertyId: string,
    participantId: string
  ) => {
    try {
      const response = await messagingOps.createOrGetChatRoom(
        participantId,
        propertyId
      );
      await loadChatRooms(); // Refresh the list
      setSelectedRoomId(response.chat_room_id); // Select the new room
    } catch (err: any) {
      setError(err.message || "Failed to create chat room");
    }
  };

  // Handle message read
  const handleMarkAsRead = async (roomId: string) => {
    try {
      await messagingOps.markMessagesAsRead(roomId);
      // Update the room's unread count in local state
      setChatRooms((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, unread_count: 0 } : room
        )
      );
    } catch (err: any) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  const selectedRoom = chatRooms.find((room) => room.id === selectedRoomId);
  const totalUnreadCount = chatRooms.reduce(
    (sum, room) => sum + room.unread_count,
    0
  );

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Loading messages...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Paper p="md" withBorder>
          <Group justify="space-between">
            <Group>
              <IconMessage size={24} />
              <Title order={2}>Messages</Title>
              {totalUnreadCount > 0 && (
                <Badge color="red" variant="filled">
                  {totalUnreadCount} unread
                </Badge>
              )}
            </Group>
            <Group>
              <Text size="sm" c="dimmed">
                {user?.role === "landlord" ? "Tenant" : "Landlord"}{" "}
                Communication
              </Text>
            </Group>
          </Group>
        </Paper>

        {/* Error Display */}
        {error && (
          <Paper p="md" withBorder bg="red.0">
            <Text c="red">{error}</Text>
            <Button
              size="xs"
              variant="outline"
              color="red"
              mt="xs"
              onClick={() => {
                setError(null);
                loadChatRooms();
              }}
            >
              Retry
            </Button>
          </Paper>
        )}

        {/* Main Content */}
        <Grid>
          {/* Chat Rooms List */}
          <Grid.Col span={4}>
            <Paper p="md" withBorder h="70vh">
              <Stack gap="md" h="100%">
                <Group justify="space-between">
                  <Title order={4}>
                    <Group gap="xs">
                      <IconUsers size={18} />
                      <span>Conversations</span>
                    </Group>
                  </Title>
                  {user?.role === "tenant" && (
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => {
                        // In a real app, this would open a property selection modal
                        console.log("Create new conversation");
                      }}
                    >
                      New
                    </Button>
                  )}
                </Group>

                {/* <ChatRoomsList
                  rooms={chatRooms}
                  selectedRoomId={selectedRoomId}
                  onRoomSelect={handleRoomSelect}
                  loading={loading}
                /> */}
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Chat Interface */}
          <Grid.Col span={8}>
            <Paper p="md" withBorder h="70vh">
              {selectedRoom ? (
                <ChatInterface
                  chatRoom={{
                    ...selectedRoom,
                    participant: selectedRoom.participant,
                  }}
                />
              ) : (
                <Stack align="center" justify="center" h="100%" gap="md">
                  <IconMessage size={48} color="gray" />
                  <Text size="lg" c="dimmed" ta="center">
                    Select a conversation to start messaging
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    {chatRooms.length === 0
                      ? "No conversations yet. Messages will appear here when you start chatting about properties."
                      : "Choose a conversation from the list to view messages."}
                  </Text>
                </Stack>
              )}
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Footer Info */}
        <Paper p="sm" withBorder bg="gray.0">
          <Text size="xs" c="dimmed" ta="center">
            Messages are secured and encrypted. Only you and the other party can
            see this conversation.
            {user?.role === "landlord" &&
              " Use this system to communicate with potential tenants about your properties."}
            {user?.role === "tenant" &&
              " Use this system to ask questions about properties you're interested in."}
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
};
