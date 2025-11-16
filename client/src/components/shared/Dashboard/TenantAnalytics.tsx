import React, { useState, useMemo } from "react";
import {
  Paper,
  Select,
  Group,
  Text,
  Progress,
  Badge,
  Grid,
  Card,
} from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  IconCalendarStats,
  IconTrendingUp,
  IconUsers,
  IconCurrencyNaira,
  IconHome,
  IconAlertTriangle,
} from "@tabler/icons-react";

interface TenantAnalyticsData {
  monthly_trends: Array<{
    month: string;
    total_tenants: number;
    new_tenants: number;
    moved_out: number;
    revenue: number;
    occupancy_rate: number;
  }>;
  payment_distribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  lease_status_distribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  revenue_trends: Array<{
    month: string;
    collected: number;
    expected: number;
    overdue: number;
  }>;
  property_performance: Array<{
    property_name: string;
    occupancy_rate: number;
    avg_rent: number;
    tenant_turnover: number;
  }>;
}

interface TenantAnalyticsProps {
  data: TenantAnalyticsData;
  loading?: boolean;
}

const TenantAnalytics: React.FC<TenantAnalyticsProps> = ({
  data,
  loading = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("tenants");

  const periodOptions = [
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "12months", label: "Last 12 Months" },
    { value: "all", label: "All Time" },
  ];

  const metricOptions = [
    { value: "tenants", label: "Tenant Count" },
    { value: "revenue", label: "Revenue" },
    { value: "occupancy", label: "Occupancy Rate" },
  ];

  const COLORS = {
    paid: "#10B981",
    unpaid: "#EF4444",
    overdue: "#F59E0B",
    partial: "#8B5CF6",
    active: "#3B82F6",
    expired: "#EF4444",
    terminated: "#6B7280",
    pending: "#F59E0B",
  };

  const filteredTrends = useMemo(() => {
    if (!data.monthly_trends) return [];

    const periodMap: Record<string, number> = {
      "3months": 3,
      "6months": 6,
      "12months": 12,
      all: data.monthly_trends.length,
    };

    const monthsToShow = periodMap[selectedPeriod] || 6;
    return data.monthly_trends.slice(-monthsToShow);
  }, [data.monthly_trends, selectedPeriod]);

  const renderMetricChart = () => {
    switch (selectedMetric) {
      case "revenue":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenue_trends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `₦${Number(value).toLocaleString()}`,
                  name === "collected"
                    ? "Collected"
                    : name === "expected"
                    ? "Expected"
                    : "Overdue",
                ]}
              />
              <Bar dataKey="collected" fill="#10B981" name="collected" />
              <Bar dataKey="expected" fill="#3B82F6" name="expected" />
              <Bar dataKey="overdue" fill="#EF4444" name="overdue" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "occupancy":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
              <Line
                type="monotone"
                dataKey="occupancy_rate"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total_tenants"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Total Tenants"
              />
              <Line
                type="monotone"
                dataKey="new_tenants"
                stroke="#10B981"
                strokeWidth={2}
                name="New Tenants"
              />
              <Line
                type="monotone"
                dataKey="moved_out"
                stroke="#EF4444"
                strokeWidth={2}
                name="Moved Out"
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Paper className="p-4">
        <Group justify="space-between" align="center">
          <div className="flex items-center gap-2">
            <IconCalendarStats size={20} className="text-blue-600" />
            <Text size="lg" fw={600}>
              Tenant Analytics
            </Text>
          </div>

          <Group gap="sm">
            <Select
              data={metricOptions}
              value={selectedMetric}
              onChange={(value) => setSelectedMetric(value || "tenants")}
              size="sm"
              w={150}
            />
            <Select
              data={periodOptions}
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value || "6months")}
              size="sm"
              w={150}
            />
          </Group>
        </Group>
      </Paper>

      {/* Main Chart */}
      <Paper className="p-6">
        <Text size="md" fw={500} mb="md">
          {metricOptions.find((opt) => opt.value === selectedMetric)?.label}{" "}
          Trends
        </Text>
        {renderMetricChart()}
      </Paper>

      {/* Distribution Charts */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper className="p-6">
            <Text size="md" fw={500} mb="md">
              Payment Status Distribution
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.payment_distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) =>
                    `${status}: ${percentage}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(data.payment_distribution || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[entry.status as keyof typeof COLORS] || "#8884d8"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper className="p-6">
            <Text size="md" fw={500} mb="md">
              Lease Status Distribution
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.lease_status_distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) =>
                    `${status}: ${percentage}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(data.lease_status_distribution || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[entry.status as keyof typeof COLORS] ||
                          "#8884d8"
                        }
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Property Performance */}
      {data.property_performance && data.property_performance.length > 0 && (
        <Paper className="p-6">
          <Text size="md" fw={500} mb="md">
            Property Performance Overview
          </Text>
          <div className="space-y-4">
            {data.property_performance.map((property, index) => (
              <Card key={index} className="p-4 border">
                <Group justify="space-between" align="center">
                  <div>
                    <Text fw={500}>{property.property_name}</Text>
                    <Text size="sm" c="dimmed">
                      Avg Rent: ₦{property.avg_rent?.toLocaleString()}
                    </Text>
                  </div>

                  <Group gap="lg">
                    <div className="text-center">
                      <Text size="xs" c="dimmed">
                        Occupancy
                      </Text>
                      <Badge
                        color={
                          property.occupancy_rate >= 90
                            ? "green"
                            : property.occupancy_rate >= 70
                            ? "yellow"
                            : "red"
                        }
                        variant="light"
                      >
                        {property.occupancy_rate}%
                      </Badge>
                    </div>

                    <div className="text-center">
                      <Text size="xs" c="dimmed">
                        Turnover
                      </Text>
                      <Badge
                        color={
                          property.tenant_turnover <= 2
                            ? "green"
                            : property.tenant_turnover <= 4
                            ? "yellow"
                            : "red"
                        }
                        variant="light"
                      >
                        {property.tenant_turnover}
                      </Badge>
                    </div>
                  </Group>
                </Group>

                <Progress
                  value={property.occupancy_rate}
                  mt="sm"
                  color={
                    property.occupancy_rate >= 90
                      ? "green"
                      : property.occupancy_rate >= 70
                      ? "yellow"
                      : "red"
                  }
                />
              </Card>
            ))}
          </div>
        </Paper>
      )}
    </div>
  );
};

export default TenantAnalytics;
