import { Card, Text, Stack, Grid, Badge, Group } from "@mantine/core";
import {
  IconTrendingUp,
  IconCircleCheck,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";

interface RevenueChartData {
  monthly_trend: Array<{
    month: string;
    month_short: string;
    revenue: number;
  }>;
  property_breakdown: Array<{
    property_id: string;
    property_name: string;
    revenue: number;
  }>;
  payment_status: {
    paid: number;
    pending: number;
    failed: number;
  };
}

interface RevenueChartProps {
  data: RevenueChartData | null;
  loading: boolean;
}

const RevenueChart = ({ data, loading }: RevenueChartProps) => {
  if (loading || !data) {
    return null;
  }

  // Get last 6 months for display
  const last6Months = data.monthly_trend.slice(-6);
  const maxRevenue = Math.max(...last6Months.map((m) => m.revenue), 1);

  // Calculate total collection status
  const totalPayments =
    data.payment_status.paid +
    data.payment_status.pending +
    data.payment_status.failed;

  const collectionRate =
    totalPayments > 0
      ? Math.round((data.payment_status.paid / totalPayments) * 100)
      : 0;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div>
            <Text size="lg" fw={600}>
              Revenue Trend
            </Text>
            <Text size="xs" c="dimmed">
              Last 6 months
            </Text>
          </div>
          <Badge
            size="lg"
            variant="light"
            color={collectionRate >= 80 ? "green" : "orange"}
            leftSection={<IconTrendingUp size={16} />}
          >
            {collectionRate}% Collected
          </Badge>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {last6Months.map((month, index) => {
            const barHeight = (month.revenue / maxRevenue) * 100;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <Text size="xs" fw={600} c={barHeight > 0 ? "blue" : "dimmed"}>
                  ₦{(month.revenue / 1000).toFixed(0)}k
                </Text>
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80"
                  style={{
                    height: `${Math.max(barHeight, 5)}%`,
                    backgroundColor: barHeight > 0 ? "#1971c2" : "#e9ecef",
                  }}
                />
                <Text size="xs" c="dimmed">
                  {month.month_short}
                </Text>
              </div>
            );
          })}
        </div>

        {/* Payment Status */}
        <div className="pt-3 border-t border-gray-200">
          <Text size="sm" fw={600} mb="sm">
            Payment Collection Status
          </Text>
          <Grid>
            <Grid.Col span={4}>
              <div className="text-center p-3 rounded-lg bg-green-50">
                <Group gap="xs" justify="center" mb={4}>
                  <IconCircleCheck size={16} className="text-green-600" />
                  <Text size="xs" c="dimmed">
                    Paid
                  </Text>
                </Group>
                <Text size="lg" fw={700} c="green">
                  {data.payment_status.paid}
                </Text>
              </div>
            </Grid.Col>
            <Grid.Col span={4}>
              <div className="text-center p-3 rounded-lg bg-orange-50">
                <Group gap="xs" justify="center" mb={4}>
                  <IconClock size={16} className="text-orange-600" />
                  <Text size="xs" c="dimmed">
                    Pending
                  </Text>
                </Group>
                <Text size="lg" fw={700} c="orange">
                  {data.payment_status.pending}
                </Text>
              </div>
            </Grid.Col>
            <Grid.Col span={4}>
              <div className="text-center p-3 rounded-lg bg-red-50">
                <Group gap="xs" justify="center" mb={4}>
                  <IconAlertCircle size={16} className="text-red-600" />
                  <Text size="xs" c="dimmed">
                    Failed
                  </Text>
                </Group>
                <Text size="lg" fw={700} c="red">
                  {data.payment_status.failed}
                </Text>
              </div>
            </Grid.Col>
          </Grid>
        </div>

        {/* Top Properties */}
        {data.property_breakdown.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <Text size="sm" fw={600} mb="sm">
              Top Revenue Properties
            </Text>
            <Stack gap="xs">
              {data.property_breakdown.slice(0, 3).map((property, index) => (
                <div
                  key={property.property_id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <Group gap="xs">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {index + 1}
                    </div>
                    <Text size="sm" fw={500} className="truncate max-w-[200px]">
                      {property.property_name}
                    </Text>
                  </Group>
                  <Text size="sm" fw={600} c="blue">
                    ₦{property.revenue.toLocaleString()}
                  </Text>
                </div>
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default RevenueChart;
