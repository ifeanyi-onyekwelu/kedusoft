import { Button, Stack, Switch, Divider, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

interface NotificationSettings {
  emailNotifications: boolean;
  propertyAlerts: boolean;
  applicationUpdates: boolean;
  maintenanceRequests: boolean;
  paymentReminders: boolean;
  leaseUpdates: boolean;
  newListings: boolean;
}

function TenantNotifications() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    propertyAlerts: true,
    applicationUpdates: true,
    maintenanceRequests: true,
    paymentReminders: true,
    leaseUpdates: true,
    newListings: true,
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
      key: "propertyAlerts",
      label: "Property Alerts",
      description: "Get notified about property issues and updates",
    },
    {
      key: "applicationUpdates",
      label: "Application Updates",
      description: "Status updates on your property applications",
    },
    {
      key: "maintenanceRequests",
      label: "Maintenance Requests",
      description: "Notifications about maintenance and repairs",
    },
    {
      key: "paymentReminders",
      label: "Payment Reminders",
      description: "Get reminded about upcoming rent payments",
    },
    {
      key: "leaseUpdates",
      label: "Lease Updates",
      description: "Notifications about lease changes or renewals",
    },
    {
      key: "newListings",
      label: "New Listings",
      description: "Get alerted about new properties matching your preferences",
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

export default TenantNotifications;
