import {
  Button,
  Stack,
  Switch,
  Divider,
  Group,
  Text,
  Alert,
} from "@mantine/core";
import { IconLock, IconShield } from "@tabler/icons-react";
import { useState } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: boolean;
  loginAlerts: boolean;
  newDeviceAlerts: boolean;
  locationAlerts: boolean;
}

function AdminSecurity() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: true,
    loginAlerts: true,
    newDeviceAlerts: true,
    locationAlerts: true,
  });

  const handleToggle = (key: keyof SecuritySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    try {
      startLoading();
      // TODO: Implement actual API call to save security settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification("success", "Success!", "Security settings updated");
    } catch (error) {
      showNotification("error", "Error", "Failed to update settings");
    } finally {
      stopLoading();
    }
  };

  const securityOptions = [
    {
      key: "twoFactorAuth",
      label: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
    },
    {
      key: "sessionTimeout",
      label: "Session Timeout",
      description: "Automatically logout after 30 minutes of inactivity",
    },
    {
      key: "loginAlerts",
      label: "Login Alerts",
      description: "Get notified of login attempts from new locations",
    },
    {
      key: "newDeviceAlerts",
      label: "New Device Alerts",
      description: "Receive alerts when accessing from a new device",
    },
    {
      key: "locationAlerts",
      label: "Location Alerts",
      description: "Get alerted about unusual login locations",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Security & Privacy</h2>

      <Stack gap="xl">
        <Alert
          icon={<IconShield size={18} />}
          title="Important"
          color="orange"
          variant="light"
        >
          Administrator accounts require enhanced security measures. Enable
          two-factor authentication for maximum protection.
        </Alert>

        {securityOptions.map((option) => (
          <div key={option.key}>
            <Group justify="space-between" mb="xs">
              <div>
                <Text fw={500}>{option.label}</Text>
                <Text size="sm" c="dimmed">
                  {option.description}
                </Text>
              </div>
              <Switch
                checked={settings[option.key as keyof SecuritySettings]}
                onChange={() =>
                  handleToggle(option.key as keyof SecuritySettings)
                }
              />
            </Group>
            <Divider />
          </div>
        ))}

        <Button onClick={handleSubmit} loading={loading}>
          Save Security Settings
        </Button>
      </Stack>
    </div>
  );
}

export default AdminSecurity;
