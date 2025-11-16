import React from "react";
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconX,
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
    switch (type) {
      case "danger":
        return <IconTrash size={24} />;
      case "success":
        return <IconCheck size={24} />;
      case "warning":
        return <IconAlertTriangle size={24} />;
      default:
        return <IconAlertTriangle size={24} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "danger":
        return "red";
      case "success":
        return "green";
      case "warning":
        return "yellow";
      default:
        return "blue";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon color={getColor()} variant="light" size="lg">
            {getIcon()}
          </ThemeIcon>
          <Text fw={600}>{title}</Text>
        </Group>
      }
      centered
      size="md"
    >
      <Stack gap="lg">
        <Alert color={getColor()} variant="light">
          <Text size="sm">{message}</Text>
        </Alert>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            color="gray"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            color={getColor()}
            onClick={onConfirm}
            loading={loading}
            variant={type === "danger" ? "filled" : "light"}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
