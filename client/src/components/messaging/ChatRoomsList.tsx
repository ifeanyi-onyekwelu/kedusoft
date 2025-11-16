import React, { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Group,
  Text,
  TextInput,
  Button,
  Avatar,
  Badge,
  ActionIcon,
  Loader,
  Center,
  Box,
  ScrollArea,
  Tooltip,
  Modal,
  Select,
  Divider,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconMessage,
  IconUser,
  IconHome,
} from "@tabler/icons-react";
import { useMessagingOperations } from "../../apis/messagingApi";
import { useLandlordOperations } from "../../apis/landlordApi";
import { notifications } from "@mantine/notifications";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface ChatRoomsListProps {
  onChatSelect: (chatRoom: ChatRoom) => void;
  selectedChatId?: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
  user_type: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  cover_image?: string;
}

export const ChatRoomsList: React.FC<ChatRoomsListProps> = ({
  onChatSelect,
  selectedChatId,
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const { getChatRooms, createOrGetChatRoom } = useMessagingOperations();
  const { getListedProperties } = useLandlordOperations();

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const response = await getChatRooms();
      setChatRooms(response.chat_rooms);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load chat rooms",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsersAndProperties = async () => {
    try {
      setLoadingUsers(true);

      // Load properties for context
      try {
        const propertiesResponse = await getListedProperties();
        if (
          propertiesResponse &&
          propertiesResponse.data &&
          propertiesResponse.data.properties
        ) {
          setProperties(propertiesResponse.data.properties);
        }
      } catch (error) {
        console.warn("Could not load properties:", error);
      }

      // Load tenants/users - simplified for now
      // In a real app, you'd have an endpoint to get potential chat partners
      // For now, we'll skip this and rely on property-based connections
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load users and properties",
        color: "red",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateChat = async () => {
    if (!selectedUser) {
      notifications.show({
        title: "Error",
        message: "Please select a user to chat with",
        color: "red",
      });
      return;
    }

    try {
      setCreatingChat(true);
      const response = await createOrGetChatRoom(
        selectedUser,
        selectedProperty || undefined
      );

      // Find the created/existing chat room
      await loadChatRooms();

      // Find and select the chat room
      const chatRoom = chatRooms.find(
        (room) => room.id === response.chat_room_id
      );
      if (chatRoom) {
        onChatSelect(chatRoom);
      }

      setNewChatModalOpen(false);
      setSelectedUser("");
      setSelectedProperty("");

      notifications.show({
        title: "Success",
        message: "Chat room created successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create chat room",
        color: "red",
      });
    } finally {
      setCreatingChat(false);
    }
  };

  const filteredChatRooms = chatRooms.filter(
    (room) =>
      room.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.property?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLastMessagePreview = (chatRoom: ChatRoom) => {
    if (!chatRoom.last_message) {
      return "No messages yet";
    }

    const { content, message_type, sender_name } = chatRoom.last_message;

    if (message_type === "text") {
      return content;
    } else if (message_type === "image") {
      return `${sender_name} sent an image`;
    } else {
      return `${sender_name} sent a file`;
    }
  };

  return (
    <>
      <Card h="100%" p={10} radius="md" withBorder>
        {/* Header */}
        <Card.Section p="md" bg="gray.0" withBorder>
          <Group justify="space-between">
            <Group>
              <IconMessage size={20} />
              <Text fw={600}>Messages</Text>
            </Group>
            <Tooltip label="Start new conversation">
              <ActionIcon
                variant="filled"
                color="blue"
                onClick={() => {
                  setNewChatModalOpen(true);
                  loadUsersAndProperties();
                }}
              >
                <IconPlus size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Card.Section>

        {/* Search */}
        <Card.Section p="md" withBorder>
          <TextInput
            placeholder="Search conversations..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </Card.Section>

        {/* Chat Rooms List */}
        <ScrollArea h="calc(100vh - 200px)" type="scroll" scrollbarSize={6}>
          {loading ? (
            <Center p="xl">
              <Loader size="md" />
            </Center>
          ) : filteredChatRooms.length === 0 ? (
            <Center p="xl">
              <Stack align="center" gap="md">
                <IconMessage size={48} color="gray" />
                <Text c="dimmed" ta="center">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </Text>
                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    setNewChatModalOpen(true);
                    loadUsersAndProperties();
                  }}
                >
                  Start new conversation
                </Button>
              </Stack>
            </Center>
          ) : (
            <Stack gap={0}>
              {filteredChatRooms.map((chatRoom) => (
                <motion.div
                  key={chatRoom.id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    p="md"
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #f1f3f4",
                      backgroundColor:
                        selectedChatId === chatRoom.id
                          ? "#e3f2fd"
                          : "transparent",
                    }}
                    onClick={() => onChatSelect(chatRoom)}
                  >
                    <Group align="start" wrap="nowrap">
                      <Avatar
                        src={chatRoom.participant.profile_picture}
                        alt={chatRoom.participant.name}
                        size="md"
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Group justify="space-between" mb="xs">
                          <Text fw={600} size="sm" truncate>
                            {chatRoom.participant.name}
                          </Text>
                          {chatRoom.last_message && (
                            <Text size="xs" c="dimmed">
                              {formatDistanceToNow(
                                new Date(chatRoom.last_message.timestamp),
                                { addSuffix: true }
                              )}
                            </Text>
                          )}
                        </Group>

                        {chatRoom.property && (
                          <Group gap="xs" mb="xs">
                            <IconHome size={12} />
                            <Text size="xs" c="blue" truncate>
                              {chatRoom.property.name}
                            </Text>
                          </Group>
                        )}

                        <Group justify="space-between" align="center">
                          <Text
                            size="xs"
                            c="dimmed"
                            lineClamp={1}
                            style={{ flex: 1 }}
                          >
                            {getLastMessagePreview(chatRoom)}
                          </Text>

                          {chatRoom.unread_count > 0 && (
                            <Badge size="sm" color="blue" variant="filled">
                              {chatRoom.unread_count > 99
                                ? "99+"
                                : chatRoom.unread_count}
                            </Badge>
                          )}
                        </Group>
                      </div>
                    </Group>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Card>

      {/* New Chat Modal */}
      <Modal
        opened={newChatModalOpen}
        onClose={() => {
          setNewChatModalOpen(false);
          setSelectedUser("");
          setSelectedProperty("");
        }}
        title="Start New Conversation"
        size="md"
      >
        <Stack>
          <Select
            label="Select User"
            placeholder="Choose someone to chat with"
            value={selectedUser}
            onChange={(value) => setSelectedUser(value || "")}
            data={users.map((user) => ({
              value: user.id,
              label: `${user.first_name} ${user.last_name} (${user.email})`,
            }))}
            searchable
            required
            leftSection={<IconUser size={16} />}
            disabled={loadingUsers}
          />

          <Select
            label="Property Context (Optional)"
            placeholder="Select a property for context"
            value={selectedProperty}
            onChange={(value) => setSelectedProperty(value || "")}
            data={properties.map((property) => ({
              value: property.id,
              label: `${property.name} - ${property.address}`,
            }))}
            searchable
            leftSection={<IconHome size={16} />}
            disabled={loadingUsers}
          />

          <Divider />

          <Group justify="end">
            <Button
              variant="subtle"
              onClick={() => {
                setNewChatModalOpen(false);
                setSelectedUser("");
                setSelectedProperty("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateChat}
              loading={creatingChat}
              disabled={!selectedUser}
            >
              Start Chat
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
