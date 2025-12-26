import { Stack, Alert, Badge, Divider, Group, Text } from "@mantine/core";
import { IconCheck, IconClock, IconShield } from "@tabler/icons-react";
import { useUser } from "../../../../context/UserContext";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { showNotification } from "../../../../utils/helpers";

function TenantVerification() {
  const { user } = useUser();

  if (!user) return <LoadingSpinner loading={true} />;

  const verificationStatus = [
    {
      name: "Email",
      status: user.is_email_verified ? "verified" : "pending",
    },
    // {
    //   name: "Phone",
    //   status: user.phone_verified ? "verified" : "pending",
    //   date: user.phone_verified_at,
    // },
    {
      name: "Identity",
      status: user.is_verified ? "verified" : "pending",
      // date: user.identity_verified_at,
    },
  ];

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
          title="Verify Your Identity"
          color="blue"
          variant="light"
        >
          Complete verification to increase your credibility and access more
          properties. Landlords are more likely to approve applications from
          verified tenants.
        </Alert>

        <div>
          <h3 className="font-semibold mb-4 text-gray-800">
            Verification Status
          </h3>
          {verificationStatus.map((item) => (
            <div key={item.name}>
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  {getStatusIcon(item.status)}
                  <div>
                    <Text fw={500}>{item.name} Verification</Text>
                    {/* {item.date && (
                      <Text size="sm" c="dimmed">
                        Verified on {new Date(item.date).toLocaleDateString()}
                      </Text>
                    )} */}
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
          <h3 className="font-semibold mb-3 text-gray-800">
            Benefits of Verification
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ Increase chances of application approval</li>
            <li>✓ Build trust with landlords</li>
            <li>✓ Access premium properties</li>
            <li>✓ Priority processing for your applications</li>
          </ul>
        </div>
      </Stack>
    </div>
  );
}

export default TenantVerification;
