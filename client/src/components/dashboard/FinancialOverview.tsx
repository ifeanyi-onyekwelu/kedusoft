import {
  Grid,
  Text,
  Group,
  Stack,
  RingProgress,
  Card,
  Box,
  Divider,
} from "@mantine/core";
import {
  IconCash,
  IconWallet,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown,
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
      label: "Revenue Collected",
      value: data.revenue_this_month,
      icon: IconCash,
      subtext: `${collectionRate}% of target`,
      trend: "neutral",
    },
    {
      label: "Expected Revenue",
      value: data.expected_revenue,
      icon: IconWallet,
      subtext: `${data.active_leases_count} active leases`,
      trend: "neutral",
    },
    {
      label: "Outstanding Rent",
      value: data.outstanding_rent,
      icon: IconAlertCircle,
      subtext: "Requires follow-up",
      isWarning: data.outstanding_rent > 0,
    },
    {
      label: "Net Profit",
      value: Math.abs(data.net_profit),
      icon: data.net_profit >= 0 ? IconTrendingUp : IconTrendingDown,
      subtext: `${profitMargin}% margin`,
      isProfit: true,
      profitValue: data.net_profit,
    },
  ];

  return (
    <Stack gap="lg">
      {/* Top Layer: Executive Stats */}
      <Grid gutter="md">
        {financialCards.map((card, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <Card
              padding="xl"
              radius="md"
              style={{
                backgroundColor: "white",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.05)",
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.5px">
                  {card.label}
                </Text>
                <card.icon
                  size={18}
                  color={card.isWarning ? "#dc2626" : "#290665"}
                  style={{ opacity: 0.7 }}
                />
              </Group>

              <Text
                size="xl"
                fw={900}
                style={{ fontSize: "1.6rem", color: "#111" }}
              >
                ₦{card.value.toLocaleString()}
              </Text>

              <Text
                size="xs"
                fw={500}
                mt={4}
                c={card.isWarning ? "red.7" : "dimmed"}
              >
                {card.subtext}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Bottom Layer: Detailed Analysis Card */}
      <Card
        padding="xl"
        radius="md"
        style={{
          backgroundColor: "white",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.05)",
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap="xs" style={{ flex: 1 }}>
            <div>
              <Text size="lg" fw={800} c="#290665">
                Financial Health Analysis
              </Text>
              <Text size="xs" c="dimmed">
                Detailed monthly performance breakdown
              </Text>
            </div>

            <Grid mt="md">
              <Grid.Col span={6}>
                <Box
                  p="md"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                >
                  <Text size="xs" c="dimmed" fw={600} mb={4}>
                    Income Generated
                  </Text>
                  <Text size="md" fw={700} c="green.8">
                    ₦{data.revenue_this_month.toLocaleString()}
                  </Text>
                </Box>
              </Grid.Col>
              <Grid.Col span={6}>
                <Box
                  p="md"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                >
                  <Text size="xs" c="dimmed" fw={600} mb={4}>
                    Operating Expenses
                  </Text>
                  <Text size="md" fw={700} c="red.8">
                    ₦{data.total_expenses.toLocaleString()}
                  </Text>
                </Box>
              </Grid.Col>
            </Grid>

            <Divider my="sm" variant="dashed" />

            <Group justify="space-between">
              <Text size="xs" fw={700} c="dimmed">
                PROFIT MARGIN
              </Text>
              <Text
                size="sm"
                fw={800}
                c={data.net_profit >= 0 ? "violet.8" : "red.8"}
              >
                {data.net_profit >= 0 ? "+" : "-"}
                {profitMargin}%
              </Text>
            </Group>
          </Stack>

          {/* Clean Performance Ring */}
          <Stack
            align="center"
            gap={0}
            pl="xl"
            style={{ borderLeft: "1px solid #f1f3f5" }}
          >
            <RingProgress
              size={130}
              thickness={12}
              roundCaps
              sections={[{ value: Number(collectionRate), color: "#290665" }]}
              label={
                <Stack gap={0} align="center">
                  <Text size="xl" fw={900} style={{ lineHeight: 1 }}>
                    {collectionRate}%
                  </Text>
                  <Text size="10px" c="dimmed" fw={700}>
                    COLLECTED
                  </Text>
                </Stack>
              }
            />
            <Text size="xs" c="dimmed" fw={600} mt="xs">
              Revenue Realization
            </Text>
          </Stack>
        </Group>
      </Card>
    </Stack>
  );
};
