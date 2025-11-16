import { Grid, Text, Badge, Group, Stack, RingProgress } from "@mantine/core";
import {
  IconCash,
  IconWallet,
  IconAlertCircle,
  IconTrendingUp,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";

interface FinancialOverviewProps {
  data: {
    revenue_this_month: number;
    expected_revenue: number;
    outstanding_rent: number;
    total_expenses: number;
    net_profit: number;
    active_leases_count: number;
  };
}

export const FinancialOverview = ({ data }: FinancialOverviewProps) => {
  const profitMargin =
    data.expected_revenue > 0
      ? ((data.net_profit / data.expected_revenue) * 100).toFixed(1)
      : 0;

  const collectionRate =
    data.expected_revenue > 0
      ? ((data.revenue_this_month / data.expected_revenue) * 100).toFixed(1)
      : 0;

  const financialCards = [
    {
      label: "Revenue This Month",
      value: data.revenue_this_month,
      icon: IconCash,
      color: "#2f9e44",
      bgColor: "#ebfbee",
      borderColor: "#69db7c",
      badge: "Collected",
      badgeColor: "green",
      subtext: `${collectionRate}% of expected`,
    },
    {
      label: "Expected Revenue",
      value: data.expected_revenue,
      icon: IconWallet,
      color: "#1971c2",
      bgColor: "#e7f5ff",
      borderColor: "#74c0fc",
      badge: "Expected",
      badgeColor: "blue",
      subtext: `${data.active_leases_count} active lease${
        data.active_leases_count !== 1 ? "s" : ""
      }`,
    },
    {
      label: "Outstanding Rent",
      value: data.outstanding_rent,
      icon: IconAlertCircle,
      color: "#f08c00",
      bgColor: "#fff4e6",
      borderColor: "#ffc078",
      badge: "Overdue",
      badgeColor: "orange",
      subtext: "Requires attention",
    },
    {
      label: "Net Profit",
      value: Math.abs(data.net_profit),
      icon: IconTrendingUp,
      color: data.net_profit >= 0 ? "#7950f2" : "#fa5252",
      bgColor: data.net_profit >= 0 ? "#f3f0ff" : "#fff5f5",
      borderColor: data.net_profit >= 0 ? "#b197fc" : "#ffc9c9",
      badge: `${profitMargin}%`,
      badgeColor: data.net_profit >= 0 ? "violet" : "red",
      badgeIcon:
        data.net_profit >= 0 ? (
          <IconArrowUpRight size={12} />
        ) : (
          <IconArrowDownRight size={12} />
        ),
      subtext: `After ₦${data.total_expenses.toLocaleString()} expenses`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Financial Cards */}
      <Grid>
        {financialCards.map((card, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <div
              className="h-full p-5 rounded-xl border-2 hover:shadow-lg transition-all cursor-default"
              style={{
                backgroundColor: card.bgColor,
                borderColor: card.borderColor,
              }}
            >
              <Group justify="space-between" mb="md">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ backgroundColor: "white" }}
                >
                  <card.icon size={24} style={{ color: card.color }} />
                </div>
                <Badge
                  variant="filled"
                  size="sm"
                  style={{
                    backgroundColor: card.color,
                    color: "white",
                  }}
                  leftSection={card.badgeIcon}
                >
                  {card.badge}
                </Badge>
              </Group>
              <Text size="xs" fw={500} c="dimmed" mb={6}>
                {card.label}
              </Text>
              <Text size="xl" fw={700} mb={4} style={{ color: card.color }}>
                ₦{card.value.toLocaleString()}
              </Text>
              <Text size="xs" c="dimmed">
                {card.subtext}
              </Text>
            </div>
          </Grid.Col>
        ))}
      </Grid>

      {/* Summary Card with Progress */}
      <div className="p-6 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap="md" style={{ flex: 1 }}>
            <div>
              <Text size="lg" fw={600} mb={4}>
                Financial Health Summary
              </Text>
              <Text size="xs" c="dimmed">
                Overview of your financial performance
              </Text>
            </div>
            <Grid>
              <Grid.Col span={6}>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>
                    Collection Rate
                  </Text>
                  <Text size="lg" fw={700} c="green">
                    {collectionRate}%
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>
                    Profit Margin
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    c={data.net_profit >= 0 ? "violet" : "red"}
                  >
                    {profitMargin}%
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>
                    Total Income
                  </Text>
                  <Text size="md" fw={600}>
                    ₦{data.revenue_this_month.toLocaleString()}
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Text size="xs" c="dimmed" mb={4}>
                    Total Expenses
                  </Text>
                  <Text size="md" fw={600}>
                    ₦{data.total_expenses.toLocaleString()}
                  </Text>
                </div>
              </Grid.Col>
            </Grid>
          </Stack>

          {/* Collection Rate Ring Progress */}
          <div className="text-center pl-6 border-l border-gray-200">
            <RingProgress
              size={140}
              thickness={14}
              roundCaps
              sections={[
                {
                  value: parseFloat(collectionRate as string),
                  color:
                    parseFloat(collectionRate as string) >= 80
                      ? "#2f9e44"
                      : parseFloat(collectionRate as string) >= 50
                      ? "#f08c00"
                      : "#fa5252",
                },
              ]}
              label={
                <div className="text-center">
                  <Text size="xs" c="dimmed" mb={4}>
                    Collection
                  </Text>
                  <Text size="xl" fw={700}>
                    {collectionRate}%
                  </Text>
                </div>
              }
            />
            <Text size="xs" c="dimmed" mt="md">
              Overall Performance
            </Text>
          </div>
        </Group>
      </div>
    </div>
  );
};
