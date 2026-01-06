import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Title,
  Text,
  Select,
  Group,
  Stack,
  Badge,
  Table,
  Button,
  Card,
  Progress,
} from "@mantine/core";
import {
  IconCurrencyNaira,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconArrowLeft,
  IconDownload,
  IconReceipt,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { BrandedLoader } from "../../../../components/LoadingSpinner";
import { notifications } from "@mantine/notifications";

function TransactionAnalytics() {
  const navigate = useNavigate();
  const { getTransactionStatistics } = useLandlordOperations();

  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "year"
  >("month");
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);

  // Helper function to get date ranges
  const getDateRanges = (range: string) => {
    const now = new Date();
    const currentPeriodStart = new Date();
    const previousPeriodStart = new Date();
    const previousPeriodEnd = new Date();

    switch (range) {
      case "today":
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setDate(now.getDate() - 1);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setDate(now.getDate() - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case "week":
        const dayOfWeek = now.getDay();
        currentPeriodStart.setDate(now.getDate() - dayOfWeek);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setDate(currentPeriodStart.getDate() - 7);
        previousPeriodEnd.setDate(currentPeriodStart.getDate() - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case "month":
        currentPeriodStart.setDate(1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setMonth(now.getMonth() - 1, 1);
        previousPeriodEnd.setMonth(now.getMonth(), 0);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case "year":
        currentPeriodStart.setMonth(0, 1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setFullYear(now.getFullYear() - 1, 0, 1);
        previousPeriodEnd.setFullYear(now.getFullYear() - 1, 11, 31);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
    }

    return {
      current: { start: currentPeriodStart, end: now },
      previous: { start: previousPeriodStart, end: previousPeriodEnd },
    };
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ranges = getDateRanges(dateRange);
      const [currentStats, previousStats] = await Promise.all([
        getTransactionStatistics({
          start_date: ranges.current.start.toISOString().split("T")[0],
          end_date: ranges.current.end.toISOString().split("T")[0],
        }),
        getTransactionStatistics({
          start_date: ranges.previous.start.toISOString().split("T")[0],
          end_date: ranges.previous.end.toISOString().split("T")[0],
        }),
      ]);

      setTransactionData({
        current: currentStats,
        previous: previousStats,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load analytics data",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    notifications.show({
      title: "Export Started",
      message: "Your transaction report is being generated...",
      color: "blue",
    });
  };

  if (loading) {
    return <BrandedLoader />;
  }

  const currentBalance = transactionData?.current?.total_balance || 0;
  const previousBalance = transactionData?.previous?.total_balance || 0;
  const balanceChange =
    previousBalance > 0
      ? ((currentBalance - previousBalance) / previousBalance) * 100
      : 0;

  const currentTransactions = transactionData?.current?.total_transactions || 0;
  const previousTransactions =
    transactionData?.previous?.total_transactions || 0;
  const transactionsChange =
    previousTransactions > 0
      ? ((currentTransactions - previousTransactions) / previousTransactions) *
        100
      : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate("/property-owner")}
          >
            Back to Dashboard
          </Button>
          <div>
            <Title order={2}>Transaction Analytics</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Detailed insights into your financial transactions
            </Text>
          </div>
        </Group>

        <Group>
          <Select
            value={dateRange}
            onChange={(value: any) => setDateRange(value)}
            data={[
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "year", label: "This Year" },
            ]}
            leftSection={<IconCalendar size={18} />}
            w={150}
          />
          <Button
            leftSection={<IconDownload size={18} />}
            onClick={handleExport}
          >
            Export Report
          </Button>
        </Group>
      </Group>

      {/* Summary Cards */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Total Balance
              </Text>
              <IconCurrencyNaira size={20} color="#7950f2" />
            </Group>
            <Text size="xl" fw={700} mb={8}>
              ₦{currentBalance.toLocaleString()}
            </Text>
            <Group gap="xs">
              {balanceChange >= 0 ? (
                <IconTrendingUp size={16} color="#2f9e44" />
              ) : (
                <IconTrendingDown size={16} color="#fa5252" />
              )}
              <Text size="sm" c={balanceChange >= 0 ? "green" : "red"} fw={500}>
                {balanceChange >= 0 ? "+" : ""}
                {balanceChange.toFixed(1)}%
              </Text>
              <Text size="sm" c="dimmed">
                vs. previous period
              </Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Total Transactions
              </Text>
              <IconReceipt size={20} color="#1971c2" />
            </Group>
            <Text size="xl" fw={700} mb={8}>
              {currentTransactions.toLocaleString()}
            </Text>
            <Group gap="xs">
              {transactionsChange >= 0 ? (
                <IconTrendingUp size={16} color="#2f9e44" />
              ) : (
                <IconTrendingDown size={16} color="#fa5252" />
              )}
              <Text
                size="sm"
                c={transactionsChange >= 0 ? "green" : "red"}
                fw={500}
              >
                {transactionsChange >= 0 ? "+" : ""}
                {transactionsChange.toFixed(1)}%
              </Text>
              <Text size="sm" c="dimmed">
                vs. previous period
              </Text>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Average Transaction
              </Text>
              <IconCurrencyNaira size={20} color="#f08c00" />
            </Group>
            <Text size="xl" fw={700} mb={8}>
              ₦
              {currentTransactions > 0
                ? Math.round(
                    currentBalance / currentTransactions
                  ).toLocaleString()
                : 0}
            </Text>
            <Badge color="orange" variant="light" size="sm">
              Per Transaction
            </Badge>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Transaction Breakdown */}
      <Paper shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Title order={3} mb="md">
          Transaction Breakdown by Purpose
        </Title>
        <Stack gap="md">
          {transactionData?.current?.purpose_breakdown ? (
            Object.entries(transactionData.current.purpose_breakdown).map(
              ([purpose, amount]: [string, any]) => {
                const percentage =
                  currentBalance > 0 ? (amount / currentBalance) * 100 : 0;
                return (
                  <div key={purpose}>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" fw={500} tt="capitalize">
                        {purpose.replace(/_/g, " ")}
                      </Text>
                      <Text size="sm" fw={600}>
                        ₦{amount.toLocaleString()} ({percentage.toFixed(1)}%)
                      </Text>
                    </Group>
                    <Progress value={percentage} color="violet" size="md" />
                  </div>
                );
              }
            )
          ) : (
            <Text ta="center" c="dimmed" py="xl">
              No transaction data available
            </Text>
          )}
        </Stack>
      </Paper>

      {/* Period Comparison */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Period Comparison
        </Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Metric</Table.Th>
              <Table.Th>Current Period</Table.Th>
              <Table.Th>Previous Period</Table.Th>
              <Table.Th>Change</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Text fw={500}>Total Balance</Text>
              </Table.Td>
              <Table.Td>₦{currentBalance.toLocaleString()}</Table.Td>
              <Table.Td>₦{previousBalance.toLocaleString()}</Table.Td>
              <Table.Td>
                <Badge color={balanceChange >= 0 ? "green" : "red"}>
                  {balanceChange >= 0 ? "+" : ""}
                  {balanceChange.toFixed(1)}%
                </Badge>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Text fw={500}>Transactions</Text>
              </Table.Td>
              <Table.Td>{currentTransactions}</Table.Td>
              <Table.Td>{previousTransactions}</Table.Td>
              <Table.Td>
                <Badge color={transactionsChange >= 0 ? "green" : "red"}>
                  {transactionsChange >= 0 ? "+" : ""}
                  {transactionsChange.toFixed(1)}%
                </Badge>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}

export default TransactionAnalytics;
