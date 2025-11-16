import React from "react";
import {
  Paper,
  Title,
  Grid,
  Group,
  Text,
  Progress,
  Card,
  Badge,
  Stack,
  Table,
  Select,
  ThemeIcon,
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
  AreaChart,
  Area,
} from "recharts";
import {
  IconHome,
  IconCurrencyNaira,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
  IconMapPin,
  IconStar,
  IconWifi,
  IconCar,
  IconShield,
  IconDroplet,
  IconBolt,
} from "@tabler/icons-react";
import { PropertyAnalytics as PropertyAnalyticsType } from "../../../hooks/useEnhancedPropertyOperations";

interface PropertyAnalyticsProps {
  analytics: PropertyAnalyticsType;
  period: string;
  onPeriodChange: (period: string) => void;
}

const COLORS = ["#339af0", "#51cf66", "#ffd43b", "#ff6b6b", "#845ef7"];

const PropertyAnalytics: React.FC<PropertyAnalyticsProps> = ({
  analytics,
  period,
  onPeriodChange,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "parking":
        return <IconCar size={16} />;
      case "security":
        return <IconShield size={16} />;
      case "internet":
        return <IconWifi size={16} />;
      case "water supply":
        return <IconDroplet size={16} />;
      case "generator":
        return <IconBolt size={16} />;
      default:
        return <IconHome size={16} />;
    }
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Title order={3}>Property Analytics</Title>
        <Select
          value={period}
          onChange={(value) => onPeriodChange(value || "6months")}
          data={[
            { value: "1month", label: "Last Month" },
            { value: "3months", label: "Last 3 Months" },
            { value: "6months", label: "Last 6 Months" },
            { value: "1year", label: "Last Year" },
          ]}
          w={150}
        />
      </Group>

      <Grid>
        {/* Revenue Trend */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              Revenue Trends
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.revenue_by_month}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#339af0"
                  fill="#339af0"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        {/* Occupancy Rate */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              Occupancy Trends
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.occupancy_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Occupancy Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#51cf66"
                  strokeWidth={3}
                  dot={{ fill: "#51cf66", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        {/* Top Performing Properties */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              Top Performing Properties
            </Title>
            <Stack gap="sm">
              {analytics.property_performance.map((property, index) => (
                <Card key={property.property_id} p="sm" withBorder>
                  <Group justify="space-between" align="flex-start">
                    <div style={{ flex: 1 }}>
                      <Group gap="xs" mb="xs">
                        <Badge variant="light" color="blue" size="sm">
                          #{index + 1}
                        </Badge>
                        <Text fw={500} size="sm">
                          {property.name}
                        </Text>
                      </Group>

                      <Group gap="md">
                        <div>
                          <Text size="xs" c="dimmed">
                            Revenue
                          </Text>
                          <Text fw={500} size="sm">
                            {formatCurrency(property.revenue)}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">
                            Occupancy
                          </Text>
                          <Text fw={500} size="sm">
                            {property.occupancy_rate}%
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="dimmed">
                            Rating
                          </Text>
                          <Group gap={4}>
                            <IconStar size={14} style={{ color: "#ffd43b" }} />
                            <Text fw={500} size="sm">
                              {property.avg_rating}
                            </Text>
                          </Group>
                        </div>
                      </Group>
                    </div>

                    <ThemeIcon
                      variant="light"
                      color={
                        index === 0 ? "yellow" : index === 1 ? "gray" : "orange"
                      }
                      size="sm"
                    >
                      <IconTrendingUp size={14} />
                    </ThemeIcon>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Market Insights */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              Market Insights
            </Title>

            {/* Average Rent by Type */}
            <Card mb="md" withBorder>
              <Text fw={500} size="sm" mb="sm">
                Average Rent by Property Type
              </Text>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={analytics.market_insights.avg_rent_by_type}>
                  <XAxis dataKey="type" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Avg Rent",
                    ]}
                  />
                  <Bar dataKey="avg_rent" fill="#339af0" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Popular Amenities */}
            <Card withBorder>
              <Text fw={500} size="sm" mb="sm">
                Popular Amenities
              </Text>
              <Stack gap="xs">
                {analytics.market_insights.popular_amenities.map(
                  (amenity, index) => (
                    <Group key={amenity.amenity} justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon
                          size="sm"
                          variant="light"
                          color={COLORS[index % COLORS.length]}
                        >
                          {getAmenityIcon(amenity.amenity)}
                        </ThemeIcon>
                        <Text size="sm">{amenity.amenity}</Text>
                      </Group>
                      <Badge variant="light" size="sm">
                        {amenity.count} properties
                      </Badge>
                    </Group>
                  )
                )}
              </Stack>
            </Card>
          </Paper>
        </Grid.Col>

        {/* Location Performance */}
        <Grid.Col span={12}>
          <Paper p="md" withBorder>
            <Title order={4} mb="md">
              Location Performance
            </Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Group gap="xs">
                      <IconMapPin size={16} />
                      <Text>City</Text>
                    </Group>
                  </Table.Th>
                  <Table.Th>Average Rent</Table.Th>
                  <Table.Th>Market Demand</Table.Th>
                  <Table.Th>Performance</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {analytics.market_insights.location_performance.map(
                  (location) => (
                    <Table.Tr key={location.city}>
                      <Table.Td>
                        <Text fw={500}>{location.city}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{formatCurrency(location.avg_rent)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Progress
                            value={location.demand}
                            size="sm"
                            w={100}
                            color={
                              location.demand > 70
                                ? "green"
                                : location.demand > 50
                                ? "yellow"
                                : "red"
                            }
                          />
                          <Text size="sm">{location.demand}%</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon
                            size="sm"
                            variant="light"
                            color={
                              location.demand > 70
                                ? "green"
                                : location.demand > 50
                                ? "yellow"
                                : "red"
                            }
                          >
                            {location.demand > 60 ? (
                              <IconTrendingUp size={14} />
                            ) : (
                              <IconTrendingDown size={14} />
                            )}
                          </ThemeIcon>
                          <Badge
                            variant="light"
                            color={
                              location.demand > 70
                                ? "green"
                                : location.demand > 50
                                ? "yellow"
                                : "red"
                            }
                            size="sm"
                          >
                            {location.demand > 70
                              ? "High"
                              : location.demand > 50
                              ? "Medium"
                              : "Low"}
                          </Badge>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  )
                )}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default PropertyAnalytics;
