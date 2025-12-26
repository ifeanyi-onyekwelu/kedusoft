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

function LandlordVerification() {
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
    {
      name: "Bank Account",
      status: "pending",
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
          title="Account Verification"
          color="blue"
          variant="light"
        >
          Complete all verifications to unlock full property listing
          capabilities and build trust with tenants.
        </Alert>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Verification Progress
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

        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Next Steps</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>Verify your email address</li>
            <li>Verify your phone number</li>
            <li>Complete identity verification with government ID</li>
            <li>Add and verify your bank account for payments</li>
          </ol>
        </div>
      </Stack>
    </div>
  );
}

export default LandlordVerification;
