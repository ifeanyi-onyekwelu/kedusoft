import React from "react";
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  ThemeIcon,
  Box,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false,
}) => {
  const getIcon = () => {
    const size = 28;
    switch (type) {
      case "danger": return <IconTrash size={size} stroke={1.5} />;
      case "success": return <IconCheck size={size} stroke={1.5} />;
      case "warning": return <IconAlertTriangle size={size} stroke={1.5} />;
      case "info": return <IconInfoCircle size={size} stroke={1.5} />;
      default: return <IconInfoCircle size={size} stroke={1.5} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "danger": return "red";
      case "success": return "green";
      case "warning": return "orange";
      default: return "blue";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false} // Cleaner look
      centered
      size="sm" // Smaller modals feel more like "dialogues"
      padding="xl"
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
        {/* Visual Identity Icon */}
        <ThemeIcon
          color={getColor()}
          variant="light"
          size={70}
          radius={100} // Circular for a softer feel
        >
          {getIcon()}
        </ThemeIcon>

        <Box>
          <Title order={3} fw={800} style={{ letterSpacing: '-0.5px' }}>
            {title}
          </Title>
          <Text size="sm" c="dimmed" mt="xs" px="md" style={{ lineHeight: 1.6 }}>
            {message}
          </Text>
        </Box>

        <Group grow w="100%" mt="lg" gap="sm">
          <Button
            variant="default"
            onClick={onClose}
            disabled={loading}
            radius="md"
            size="md"
            fw={600}
          >
            {cancelText}
          </Button>
          <Button
            color={getColor()}
            onClick={onConfirm}
            loading={loading}
            radius="md"
            size="md"
            fw={600}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
