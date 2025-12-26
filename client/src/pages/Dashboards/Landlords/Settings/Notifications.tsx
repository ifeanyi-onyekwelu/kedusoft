import { Button, Stack, Switch, Divider, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

interface NotificationSettings {
  emailNotifications: boolean;
  applicationAlerts: boolean;
  maintenanceAlerts: boolean;
  tenantMessages: boolean;
  paymentNotifications: boolean;
  propertyAlerts: boolean;
  weeklyReport: boolean;
}

function LandlordNotifications() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    applicationAlerts: true,
    maintenanceAlerts: true,
    tenantMessages: true,
    paymentNotifications: true,
    propertyAlerts: true,
    weeklyReport: true,
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
      description: "Receive updates and alerts via email",
    },
    {
      key: "applicationAlerts",
      label: "Application Alerts",
      description: "Get notified about new tenant applications",
    },
    {
      key: "maintenanceAlerts",
      label: "Maintenance Requests",
      description: "Notifications for maintenance requests from tenants",
    },
    {
      key: "tenantMessages",
      label: "Tenant Messages",
      description: "Receive notifications when tenants send messages",
    },
    {
      key: "paymentNotifications",
      label: "Payment Notifications",
      description: "Get alerted about rent payments and overdue amounts",
    },
    {
      key: "propertyAlerts",
      label: "Property Alerts",
      description: "Alerts about property-related activities and events",
    },
    {
      key: "weeklyReport",
      label: "Weekly Report",
      description: "Receive a summary of property activities weekly",
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

export default LandlordNotifications;
