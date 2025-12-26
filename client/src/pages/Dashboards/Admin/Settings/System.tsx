import {
  Button,
  Stack,
  Divider,
  Group,
  Text,
  Badge,
  Alert,
} from "@mantine/core";
import { IconServer, IconClock, IconInfoCircle } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useLoading } from "../../../../hooks/useLoading";

function AdminSystem() {
  const { loading } = useLoading();
  const [systemStatus, setSystemStatus] = useState({
    databaseStatus: "healthy",
    cacheStatus: "healthy",
    apiStatus: "operational",
    lastBackup: new Date(Date.now() - 86400000), // 1 day ago
    uptime: "99.9%",
    version: "v1.0.0",
  });

  const getStatusColor = (status: string) => {
    if (status === "healthy" || status === "operational") return "green";
    if (status === "warning") return "orange";
    return "red";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">System Settings</h2>

      <Stack gap="xl">
        <Alert
          icon={<IconServer size={18} />}
          title="System Information"
          color="blue"
          variant="light"
        >
          Monitor the health and performance of the platform infrastructure.
        </Alert>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">System Health</h3>

          <div className="space-y-4">
            {/* Database Status */}
            <Group justify="space-between">
              <div>
                <Text fw={500}>Database Status</Text>
                <Text size="sm" c="dimmed">
                  Primary database connection
                </Text>
              </div>
              <Badge color={getStatusColor(systemStatus.databaseStatus)}>
                {systemStatus.databaseStatus}
              </Badge>
            </Group>
            <Divider />

            {/* Cache Status */}
            <Group justify="space-between">
              <div>
                <Text fw={500}>Cache Status</Text>
                <Text size="sm" c="dimmed">
                  Redis cache server
                </Text>
              </div>
              <Badge color={getStatusColor(systemStatus.cacheStatus)}>
                {systemStatus.cacheStatus}
              </Badge>
            </Group>
            <Divider />

            {/* API Status */}
            <Group justify="space-between">
              <div>
                <Text fw={500}>API Status</Text>
                <Text size="sm" c="dimmed">
                  API service availability
                </Text>
              </div>
              <Badge color={getStatusColor(systemStatus.apiStatus)}>
                {systemStatus.apiStatus}
              </Badge>
            </Group>
            <Divider />

            {/* Uptime */}
            <Group justify="space-between">
              <div>
                <Text fw={500}>System Uptime</Text>
                <Text size="sm" c="dimmed">
                  Current month availability
                </Text>
              </div>
              <Badge color="green">{systemStatus.uptime}</Badge>
            </Group>
            <Divider />

            {/* Version */}
            <Group justify="space-between">
              <div>
                <Text fw={500}>Platform Version</Text>
                <Text size="sm" c="dimmed">
                  Current deployment version
                </Text>
              </div>
              <Badge>{systemStatus.version}</Badge>
            </Group>
            <Divider />

            {/* Last Backup */}
            <Group justify="space-between">
              <div>
                <Text fw={500}>Last Backup</Text>
                <Text size="sm" c="dimmed">
                  Database backup timestamp
                </Text>
              </div>
              <Text size="sm">
                {systemStatus.lastBackup.toLocaleDateString()}{" "}
                {systemStatus.lastBackup.toLocaleTimeString()}
              </Text>
            </Group>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <Group>
            <Button variant="light">View Logs</Button>
            <Button variant="light">Configure Backup</Button>
          </Group>
        </div>
      </Stack>
    </div>
  );
}

export default AdminSystem;
