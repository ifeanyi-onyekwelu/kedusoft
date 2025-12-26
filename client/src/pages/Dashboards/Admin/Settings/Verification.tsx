import {
  Button,
  Stack,
  Alert,
  Badge,
  Divider,
  Group,
  Text,
} from "@mantine/core";
import { IconCheck, IconClock, IconShield } from "@tabler/icons-react";
import { useUser } from "../../../../context/UserContext";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useLoading } from "../../../../hooks/useLoading";
import { showNotification } from "../../../../utils/helpers";

function AdminVerification() {
  const { user } = useUser();
  const { loading, startLoading, stopLoading } = useLoading();

  if (!user) return <LoadingSpinner loading={true} />;

  const verificationStatus = [
    {
      name: "Email",
      status: user.is_email_verified ? "verified" : "pending",
    },
    {
      name: "Identity",
      status: user.is_verified ? "verified" : "pending",
    },
  ];

  const handleVerify = async (type: string) => {
    try {
      startLoading();
      // TODO: Implement actual verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification("success", "Success!", `${type} verification initiated`);
    } catch (error) {
      showNotification("error", "Error", "Verification failed");
    } finally {
      stopLoading();
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "verified")
      return <IconCheck size={18} className="text-green-600" />;
    return <IconClock size={18} className="text-orange-600" />;
  };

  const getStatusColor = (status: string) => {
    return status === "verified" ? "green" : "orange";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Verification Status</h2>

      <Stack gap="xl">
        <Alert
          icon={<IconShield size={18} />}
          title="Account Security"
          color="blue"
          variant="light"
        >
          Verify your identity to unlock full platform access and ensure account
          security.
        </Alert>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Verification Overview
          </h3>
          {verificationStatus.map((item) => (
            <div key={item.name}>
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  {getStatusIcon(item.status)}
                  <div>
                    <Text fw={500}>{item.name} Verification</Text>
                  </div>
                </Group>
                <Badge color={getStatusColor(item.status)} variant="light">
                  {item.status}
                </Badge>
              </Group>
              <Divider />
            </div>
          ))}
        </div>

        <Button
          onClick={() => handleVerify("Email")}
          loading={loading}
          disabled={user.is_email_verified}
        >
          {user.is_email_verified ? "Email Verified" : "Verify Email"}
        </Button>
      </Stack>
    </div>
  );
}

export default AdminVerification;
