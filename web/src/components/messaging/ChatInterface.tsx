import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Stack,
  Group,
  Text,
  TextInput,
  Button,
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Menu,
  Modal,
  Textarea,
  Progress,
  Tooltip,
  Box,
  ScrollArea,
  FileInput,
  Image,
  Anchor,
} from "@mantine/core";
import {
  IconSend,
  IconPaperclip,
  IconDots,
  IconEdit,
  IconTrash,
  IconDownload,
  IconFile,
  IconPhoto,
  IconFileText,
  IconCheck,
  IconCheckbox,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { useMessagingOperations } from "../../apis/messagingApi";
import { notifications } from "@mantine/notifications";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  chatRoom: ChatRoom;
  onBack?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatRoom,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    getMessages,
    sendMessage,
    sendFileMessage,
    editMessage,
    deleteMessage,
    markMessagesAsRead,
  } = useMessagingOperations();

  // Load messages
  useEffect(() => {
    loadMessages(1);
    markMessagesAsRead(chatRoom.id);
  }, [chatRoom.id]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await getMessages(chatRoom.id, pageNum);

      if (pageNum === 1) {
        setMessages(response.messages);
      } else {
        setMessages((prev) => [...response.messages, ...prev]);
      }

      setHasMore(response.pagination.has_next);
      setPage(pageNum);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load messages",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      loadMessages(page + 1);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    try {
      setSending(true);
      let sentMessage: Message;

      if (file) {
        sentMessage = await sendFileMessage(
          chatRoom.id,
          file,
          newMessage.trim() || undefined
        );
        setFile(null);
      } else {
        sentMessage = await sendMessage(chatRoom.id, newMessage.trim());
      }

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");

      notifications.show({
        title: "Message sent",
        message: "Your message has been delivered",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to send message",
        color: "red",
      });
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    try {
      const updatedMessage = await editMessage(messageId, editContent);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: updatedMessage.content,
                is_edited: true,
                edited_at: updatedMessage.edited_at,
              }
            : msg
        )
      );
      setEditingMessage(null);
      setEditContent("");

      notifications.show({
        title: "Message updated",
        message: "Your message has been updated",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update message",
        color: "red",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      notifications.show({
        title: "Message deleted",
        message: "Your message has been deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete message",
        color: "red",
      });
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const getMessageIcon = (messageType: string) => {
    switch (messageType) {
      case "image":
        return <IconPhoto size={16} />;
      case "document":
        return <IconFileText size={16} />;
      default:
        return <IconFile size={16} />;
    }
  };

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card h="100%" p={0} radius="md" withBorder>
      {/* Chat Header */}
      <Card.Section p="md" bg="gray.0" withBorder>
        <Group justify="space-between">
          <Group>
            {onBack && (
              <ActionIcon variant="subtle" onClick={onBack}>
                <IconX size={18} />
              </ActionIcon>
            )}
            <Avatar
              src={chatRoom.participant.profile_picture}
              alt={chatRoom.participant.name}
              size="md"
            />
            <div>
              <Text fw={600} size="sm">
                {chatRoom.participant.name}
              </Text>
              <Text size="xs" c="dimmed">
                {chatRoom.participant.user_type}
              </Text>
            </div>
          </Group>

          {chatRoom.property && (
            <Badge variant="light" color="blue">
              {chatRoom.property.name}
            </Badge>
          )}
        </Group>
      </Card.Section>

      {/* Messages Area */}
      <ScrollArea
        h="calc(100vh - 300px)"
        px="md"
        py="sm"
        type="scroll"
        scrollbarSize={6}
      >
        {hasMore && (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <Button
              variant="subtle"
              size="xs"
              onClick={loadMoreMessages}
              loading={loading}
            >
              Load older messages
            </Button>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: message.is_own_message
                  ? "flex-end"
                  : "flex-start",
              }}
            >
              <Group
                align="start"
                gap="xs"
                style={{
                  maxWidth: "70%",
                  flexDirection: message.is_own_message ? "row-reverse" : "row",
                }}
              >
                {!message.is_own_message && (
                  <Avatar
                    src={message.sender.profile_picture}
                    size="sm"
                    alt={message.sender.name}
                  />
                )}

                <Box
                  bg={message.is_own_message ? "blue.6" : "gray.1"}
                  c={message.is_own_message ? "white" : "dark"}
                  p="sm"
                  style={{
                    borderRadius: "12px",
                    position: "relative",
                  }}
                >
                  {/* Message Content */}
                  {message.message_type === "text" ? (
                    <Text size="sm">{message.content}</Text>
                  ) : message.message_type === "image" ? (
                    <Box>
                      <Image
                        src={message.file_path}
                        alt={message.file_name}
                        radius="md"
                        mah={200}
                        fit="cover"
                      />
                      {message.content && (
                        <Text size="sm" mt="xs">
                          {message.content}
                        </Text>
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Group gap="xs" mb={message.content ? "xs" : 0}>
                        {getMessageIcon(message.message_type)}
                        <div>
                          <Text size="sm" fw={500}>
                            {message.file_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {message.file_size &&
                              formatFileSize(message.file_size)}
                          </Text>
                        </div>
                        <Anchor
                          href={message.file_path}
                          target="_blank"
                          download={message.file_name}
                        >
                          <ActionIcon size="sm" variant="subtle">
                            <IconDownload size={14} />
                          </ActionIcon>
                        </Anchor>
                      </Group>
                      {message.content && (
                        <Text size="sm">{message.content}</Text>
                      )}
                    </Box>
                  )}

                  {/* Message Meta */}
                  <Group justify="space-between" mt="xs" gap="xs">
                    <Text
                      size="xs"
                      c={message.is_own_message ? "blue.1" : "dimmed"}
                    >
                      {formatDistanceToNow(new Date(message.timestamp), {
                        addSuffix: true,
                      })}
                      {message.is_edited && " (edited)"}
                    </Text>

                    <Group gap="xs">
                      {message.is_own_message && (
                        <Menu position="bottom-end" shadow="md">
                          <Menu.Target>
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              c={message.is_own_message ? "white" : "gray"}
                            >
                              <IconDots size={12} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {message.message_type === "text" && (
                              <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={() => {
                                  setEditingMessage(message.id);
                                  setEditContent(message.content);
                                }}
                              >
                                Edit
                              </Menu.Item>
                            )}
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}

                      {message.is_own_message && (
                        <Tooltip label={message.is_read ? "Read" : "Delivered"}>
                          <div>
                            {message.is_read ? (
                              <IconCheckbox size={12} color="blue" />
                            ) : (
                              <IconCheck size={12} />
                            )}
                          </div>
                        </Tooltip>
                      )}
                    </Group>
                  </Group>
                </Box>
              </Group>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Edit Message Modal */}
      <Modal
        opened={!!editingMessage}
        onClose={() => {
          setEditingMessage(null);
          setEditContent("");
        }}
        title="Edit Message"
        size="md"
      >
        <Stack>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.currentTarget.value)}
            placeholder="Edit your message..."
            autosize
            minRows={3}
          />
          <Group justify="end">
            <Button
              variant="subtle"
              onClick={() => {
                setEditingMessage(null);
                setEditContent("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                editingMessage && handleEditMessage(editingMessage)
              }
              disabled={!editContent.trim()}
            >
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Message Input */}
      <Card.Section p="md" withBorder>
        {file && (
          <Box bg="gray.0" p="xs" mb="xs" style={{ borderRadius: "8px" }}>
            <Group justify="space-between">
              <Group gap="xs">
                {getMessageIcon(
                  file.type.startsWith("image/") ? "image" : "file"
                )}
                <div>
                  <Text size="sm" fw={500}>
                    {file.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {(file.size / 1024).toFixed(1)} KB
                  </Text>
                </div>
              </Group>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="red"
                onClick={() => setFile(null)}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </Box>
        )}

        <Group gap="sm">
          <FileInput
            style={{ display: "none" }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <ActionIcon
            variant="subtle"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            <IconPaperclip size={18} />
          </ActionIcon>

          <TextInput
            flex={1}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={sending}
          />

          <ActionIcon
            variant="filled"
            color="blue"
            onClick={handleSendMessage}
            loading={sending}
            disabled={!newMessage.trim() && !file}
          >
            <IconSend size={18} />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
};
