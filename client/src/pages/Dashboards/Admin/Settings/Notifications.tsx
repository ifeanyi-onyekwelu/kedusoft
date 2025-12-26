import { Button, Stack, Switch, Divider, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

interface NotificationSettings {
  emailNotifications: boolean;
  systemAlerts: boolean;
  userActivityAlerts: boolean;
  securityAlerts: boolean;
  reportNotifications: boolean;
  maintenanceAlerts: boolean;
}

function AdminNotifications() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    systemAlerts: true,
    userActivityAlerts: true,
    securityAlerts: true,
    reportNotifications: true,
    maintenanceAlerts: true,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    try {
      startLoading();
      // TODO: Implement actual API call to save notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification("success", "Success!", "Notification settings updated");
    } catch (error) {
      showNotification("error", "Error", "Failed to update settings");
    } finally {
      stopLoading();
    }
  };

  const notificationOptions = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive important updates via email",
    },
    {
      key: "systemAlerts",
      label: "System Alerts",
      description: "Get notified about system maintenance and updates",
    },
    {
      key: "userActivityAlerts",
      label: "User Activity Alerts",
      description: "Monitor suspicious or important user activities",
    },
    {
      key: "securityAlerts",
      label: "Security Alerts",
      description: "Critical security-related notifications",
    },
    {
      key: "reportNotifications",
      label: "Report Notifications",
      description: "Get notified about user reports and issues",
    },
    {
      key: "maintenanceAlerts",
      label: "Maintenance Alerts",
      description: "Alerts about system maintenance windows",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>

      <Stack gap="xl">
        {notificationOptions.map((option) => (
          <div key={option.key}>
            <Group justify="space-between" mb="xs">
              <div>
                <Text fw={500}>{option.label}</Text>
                <Text size="sm" c="dimmed">
                  {option.description}
                </Text>
              </div>
              <Switch
                checked={settings[option.key as keyof NotificationSettings]}
                onChange={() =>
                  handleToggle(option.key as keyof NotificationSettings)
                }
              />
            </Group>
            <Divider />
          </div>
        ))}

        <Button onClick={handleSubmit} loading={loading}>
          Save Preferences
        </Button>
      </Stack>
    </div>
  );
}

export default AdminNotifications;
