import { Button, Text, Title, Stack, Box, Paper, Center } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

export function ErrorState({ message, loading, onRetry }: ErrorStateProps) {
  return (
    <Center py={100}>
      <Stack align="center" gap="md">
        <Box
          className="rounded-2xl flex items-center justify-center"
          style={{ width: 80, height: 80, backgroundColor: "#FEF2F2" }}
        >
          <IconAlertCircle size={40} color="#EF4444" stroke={1.5} />
        </Box>

        <Stack gap={4} align="center">
          <Title order={3} fw={800} c="gray.9">
            Connection Issue
          </Title>
          <Text c="dimmed" size="sm" ta="center" maw={320}>
            {message ||
              "We encountered an error while trying to load your properties. Please check your internet connection."}
          </Text>
        </Stack>

        {onRetry && (
          <Button
            variant="light"
            color="red"
            radius="md"
            leftSection={<IconRefresh size={18} />}
            onClick={onRetry}
            loading={loading}
            className="mt-2"
          >
            Try Refreshing
          </Button>
        )}
      </Stack>
    </Center>
  );
}
