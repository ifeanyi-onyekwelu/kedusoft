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
  RingProgress,
} from "@mantine/core";
import {
  IconEye,
  IconTrendingUp,
  IconCalendar,
  IconArrowLeft,
  IconDownload,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { notifications } from "@mantine/notifications";

function PropertyViewsAnalytics() {
  const navigate = useNavigate();
  const { getPropertyViewsStatistics, getListedProperties } =
    useLandlordOperations();

  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "year"
  >("month");
  const [loading, setLoading] = useState(true);
  const [viewsData, setViewsData] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  // Helper function to get date ranges
  const getDateRanges = (range: string) => {
    const now = new Date();
    const currentPeriodStart = new Date();

    switch (range) {
      case "today":
        currentPeriodStart.setHours(0, 0, 0, 0);
        break;
      case "week":
        const dayOfWeek = now.getDay();
        currentPeriodStart.setDate(now.getDate() - dayOfWeek);
        currentPeriodStart.setHours(0, 0, 0, 0);
        break;
      case "month":
        currentPeriodStart.setDate(1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        break;
      case "year":
        currentPeriodStart.setMonth(0, 1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        break;
    }

    return {
      start: currentPeriodStart,
      end: now,
    };
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ranges = getDateRanges(dateRange);
      const [viewsStats, propertiesList] = await Promise.all([
        getPropertyViewsStatistics({
          start_date: ranges.start.toISOString().split("T")[0],
          end_date: ranges.end.toISOString().split("T")[0],
        }),
        getListedProperties(),
      ]);

      console.log("Fetched views stats:", viewsStats);
      console.log("Fetched properties list:", propertiesList);

      setViewsData(viewsStats);
      setProperties(Array.isArray(propertiesList) ? propertiesList : []);
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
    // TODO: Implement export functionality
    notifications.show({
      title: "Export Started",
      message: "Your analytics report is being generated...",
      color: "blue",
    });
  };

  if (loading) {
    return (
      <LoadingSpinner fullScreen label="Fetching property view analytics" />
    );
  }

  const totalViews = viewsData?.total_views || 0;
  const uniqueViewers = viewsData?.unique_viewers || 0;
  const conversionRate =
    totalViews > 0 ? (uniqueViewers / totalViews) * 100 : 0;

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
            <Title order={2}>Property Views Analytics</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Detailed insights into your property viewing statistics
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
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Total Views
              </Text>
              <IconEye size={20} color="#f08c00" />
            </Group>
            <Text size="xl" fw={700} mb={4}>
              {totalViews.toLocaleString()}
            </Text>
            <Badge color="orange" variant="light" size="sm">
              All Properties
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Unique Viewers
              </Text>
              <IconEye size={20} color="#1971c2" />
            </Group>
            <Text size="xl" fw={700} mb={4}>
              {uniqueViewers.toLocaleString()}
            </Text>
            <Badge color="blue" variant="light" size="sm">
              Distinct Users
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Avg. Views per Property
              </Text>
              <IconTrendingUp size={20} color="#2f9e44" />
            </Group>
            <Text size="xl" fw={700} mb={4}>
              {properties.length > 0
                ? viewsData?.average_views_per_property.toLocaleString()
                : 0}
            </Text>
            <Badge color="green" variant="light" size="sm">
              Average
            </Badge>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack align="center" gap="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Engagement Rate
              </Text>
              <RingProgress
                size={100}
                thickness={12}
                sections={[{ value: conversionRate, color: "#7950f2" }]}
                label={
                  <Text size="lg" fw={700} ta="center">
                    {conversionRate.toFixed(1)}%
                  </Text>
                }
              />
              <Badge color="violet" variant="light" size="sm">
                Unique/Total
              </Badge>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Property-wise Breakdown */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Views by Property
        </Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Property</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Total Views</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {properties.length > 0 ? (
              properties.map((property) => (
                <Table.Tr key={property.id}>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {property.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {property?.address || "N/A"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconEye size={16} />
                      <Text>{property.views_count || 0}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() =>
                        navigate(`/property-owner/properties/${property.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" c="dimmed" py="xl">
                    No properties found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}

export default PropertyViewsAnalytics;
