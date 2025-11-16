import React, { useState } from "react";
import {
  Grid,
  Container,
  Card,
  Text,
  Stack,
  Button,
  Group,
  Center,
  ThemeIcon,
  Title,
  Box,
} from "@mantine/core";
import {
  IconMessage,
  IconPlus,
  IconInbox,
  IconSend,
  IconUsers,
} from "@tabler/icons-react";
import { ChatRoomsList } from "../../../../components/messaging/ChatRoomsList";
import { ChatInterface } from "../../../../components/messaging/ChatInterface";
import { motion } from "framer-motion";

function PropertyOwnerMessages() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatSelect = (chatRoom: ChatRoom) => {
    setSelectedChat(chatRoom);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  // Mobile view logic
  if (isMobile) {
    return (
      <Container size="xl" py="md">
        {selectedChat ? (
          <ChatInterface chatRoom={selectedChat} onBack={handleBackToList} />
        ) : (
          <ChatRoomsList
            onChatSelect={handleChatSelect}
            selectedChatId={selectedChat?.id || undefined}
          />
        )}
      </Container>
    );
  }

  // Desktop view
  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <Group justify="space-between" align="center">
            <div>
              <Title order={2} mb="xs">
                Messages
              </Title>
              <Text c="dimmed" size="sm">
                Communicate with tenants and manage property inquiries
              </Text>
            </div>

            {/* Quick Stats */}
            <Group gap="lg">
              <Card padding="md" radius="md" withBorder>
                <Group gap="sm">
                  <ThemeIcon size="lg" variant="light" color="blue">
                    <IconInbox size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Active Chats
                    </Text>
                    <Text size="lg" fw={700}>
                      {/* This would be dynamic */}
                      12
                    </Text>
                  </div>
                </Group>
              </Card>

              <Card padding="md" radius="md" withBorder>
                <Group gap="sm">
                  <ThemeIcon size="lg" variant="light" color="green">
                    <IconSend size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Messages Today
                    </Text>
                    <Text size="lg" fw={700}>
                      47
                    </Text>
                  </div>
                </Group>
              </Card>

              <Card padding="md" radius="md" withBorder>
                <Group gap="sm">
                  <ThemeIcon size="lg" variant="light" color="orange">
                    <IconUsers size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Contacts
                    </Text>
                    <Text size="lg" fw={700}>
                      89
                    </Text>
                  </div>
                </Group>
              </Card>
            </Group>
          </Group>
        </div>

        {/* Main Content */}
        <Grid gutter="md">
          {/* Chat Rooms List */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <ChatRoomsList
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChat?.id || undefined}
            />
          </Grid.Col>

          {/* Chat Interface or Welcome Screen */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {selectedChat ? (
              <ChatInterface chatRoom={selectedChat} />
            ) : (
              <Card h="100%" radius="md" withBorder>
                <Center h="100%">
                  <Stack align="center" gap="xl">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ThemeIcon
                        size={120}
                        variant="light"
                        color="blue"
                        radius="xl"
                      >
                        <IconMessage size={60} />
                      </ThemeIcon>
                    </motion.div>

                    <Stack align="center" gap="md">
                      <Title order={3} ta="center">
                        Welcome to Messages
                      </Title>
                      <Text ta="center" c="dimmed" maw={400}>
                        Select a conversation from the sidebar to start
                        messaging with your tenants, or create a new
                        conversation to begin communicating about your
                        properties.
                      </Text>
                    </Stack>

                    <Group gap="sm">
                      <Button
                        variant="light"
                        leftSection={<IconMessage size={16} />}
                        size="md"
                      >
                        View All Conversations
                      </Button>
                      <Button leftSection={<IconPlus size={16} />} size="md">
                        Start New Chat
                      </Button>
                    </Group>

                    {/* Features List */}
                    <Box mt="xl">
                      <Text size="sm" c="dimmed" ta="center" mb="md">
                        Message Features:
                      </Text>
                      <Stack gap="xs" align="center">
                        <Text size="sm" c="dimmed">
                          📄 Share documents and property photos
                        </Text>
                        <Text size="sm" c="dimmed">
                          💬 Real-time messaging
                        </Text>
                        <Text size="sm" c="dimmed">
                          🏠 Property-specific conversations
                        </Text>
                        <Text size="sm" c="dimmed">
                          ✅ Read receipts and delivery status
                        </Text>
                      </Stack>
                    </Box>
                  </Stack>
                </Center>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      </motion.div>
    </div>
  );
}

export default PropertyOwnerMessages;
