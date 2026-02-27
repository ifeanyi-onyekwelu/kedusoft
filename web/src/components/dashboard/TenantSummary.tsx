import { Card, Text, Stack, Badge, Progress, Group } from "@mantine/core";
import { IconUsers, IconCalendarEvent } from "@tabler/icons-react";

interface TenantSummaryData {
  active_tenants: number;
  expiring_leases_30_days: number;
  expiring_leases_60_days: number;
  expiring_leases_90_days: number;
  lease_expiration_timeline: Array<{
    lease_id: string;
    property_name: string;
    tenant_name: string;
    end_date: string;
    days_remaining: number;
  }>;
}

interface TenantSummaryProps {
  data: TenantSummaryData | null;
  loading: boolean;
}

const TenantSummary = ({ data, loading }: TenantSummaryProps) => {
  if (loading || !data) {
    return null;
  }

  const getPriorityColor = (days: number) => {
    if (days <= 30) return { color: "red", bgColor: "#fff5f5", text: "Urgent" };
    if (days <= 60)
      return { color: "orange", bgColor: "#fff4e6", text: "Soon" };
    return { color: "yellow", bgColor: "#fff9db", text: "Upcoming" };
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            Tenant Summary
          </Text>
          <Badge
            size="lg"
            variant="light"
            color="blue"
            leftSection={<IconUsers size={16} />}
          >
            {data.active_tenants} Active
          </Badge>
        </Group>

        {/* Lease Expiration Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-red-200 bg-red-50">
            <Text size="xs" c="dimmed" mb={4}>
              Next 30 Days
            </Text>
            <Text size="xl" fw={700} c="red">
              {data.expiring_leases_30_days}
            </Text>
            <Text size="xs" c="dimmed">
              expiring
            </Text>
          </div>
          <div className="p-3 rounded-lg border border-orange-200 bg-orange-50">
            <Text size="xs" c="dimmed" mb={4}>
              31-60 Days
            </Text>
            <Text size="xl" fw={700} c="orange">
              {data.expiring_leases_60_days}
            </Text>
            <Text size="xs" c="dimmed">
              expiring
            </Text>
          </div>
          <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
            <Text size="xs" c="dimmed" mb={4}>
              61-90 Days
            </Text>
            <Text size="xl" fw={700} style={{ color: "#fab005" }}>
              {data.expiring_leases_90_days}
            </Text>
            <Text size="xs" c="dimmed">
              expiring
            </Text>
          </div>
        </div>

        {/* Lease Expiration Timeline */}
        {data.lease_expiration_timeline.length > 0 ? (
          <div className="pt-3 border-t border-gray-200">
            <Group gap="xs" mb="sm">
              <IconCalendarEvent size={16} className="text-gray-600" />
              <Text size="sm" fw={600}>
                Upcoming Expirations
              </Text>
            </Group>
            <Stack gap="xs">
              {data.lease_expiration_timeline.slice(0, 5).map((lease) => {
                const priorityStyle = getPriorityColor(lease.days_remaining);
                return (
                  <div
                    key={lease.lease_id}
                    className="p-3 rounded-lg border-l-4"
                    style={{
                      backgroundColor: priorityStyle.bgColor,
                      borderLeftColor: priorityStyle.color,
                      borderTop: `1px solid ${priorityStyle.color}20`,
                      borderRight: `1px solid ${priorityStyle.color}20`,
                      borderBottom: `1px solid ${priorityStyle.color}20`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Text size="sm" fw={600} className="truncate mb-1">
                          {lease.property_name}
                        </Text>
                        <Text size="xs" c="dimmed" className="truncate">
                          Tenant: {lease.tenant_name}
                        </Text>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge
                          size="xs"
                          variant="filled"
                          color={priorityStyle.color}
                        >
                          {lease.days_remaining}d
                        </Badge>
                        <Text size="xs" c="dimmed" className="mt-1">
                          {new Date(lease.end_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </Text>
                      </div>
                    </div>
                    <Progress
                      value={100 - (lease.days_remaining / 90) * 100}
                      size="xs"
                      color={priorityStyle.color}
                      className="mt-2"
                    />
                  </div>
                );
              })}
            </Stack>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <Text size="sm" c="dimmed">
              No lease expirations in the next 90 days
            </Text>
          </div>
        )}

        {data.lease_expiration_timeline.length > 5 && (
          <Text size="xs" c="dimmed" ta="center">
            +{data.lease_expiration_timeline.length - 5} more leases expiring
            soon
          </Text>
        )}
      </Stack>
    </Card>
  );
};

export default TenantSummary;
