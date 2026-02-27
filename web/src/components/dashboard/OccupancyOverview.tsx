import { Card, Text, Grid, Progress, Group, Stack } from "@mantine/core";
import {
  IconHome,
  IconHomeCheck,
  IconHomeDollar,
  IconTool,
} from "@tabler/icons-react";

interface OccupancyData {
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  under_maintenance: number;
  available_for_rent: number;
  occupancy_rate: number;
}

interface OccupancyOverviewProps {
  data: OccupancyData | null;
  loading: boolean;
}

const OccupancyOverview = ({ data, loading }: OccupancyOverviewProps) => {
  if (loading || !data) {
    return null;
  }

  const stats = [
    {
      label: "Occupied",
      value: data.occupied_units,
      icon: IconHomeCheck,
      color: "#2f9e44",
      bgColor: "#ebfbee",
    },
    {
      label: "Vacant",
      value: data.vacant_units,
      icon: IconHome,
      color: "#f08c00",
      bgColor: "#fff4e6",
    },
    {
      label: "Available",
      value: data.available_for_rent,
      icon: IconHomeDollar,
      color: "#1971c2",
      bgColor: "#e7f5ff",
    },
    {
      label: "Maintenance",
      value: data.under_maintenance,
      icon: IconTool,
      color: "#868e96",
      bgColor: "#f8f9fa",
    },
  ];

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="sm">
        <div className="flex items-center justify-between">
          <Text size="md" fw={600}>
            Occupancy
          </Text>
          <div className="text-right">
            <Text size="lg" fw={700} c="blue">
              {data.occupancy_rate}%
            </Text>
          </div>
        </div>

        <Progress
          value={data.occupancy_rate}
          size="md"
          radius="md"
          color={
            data.occupancy_rate >= 80
              ? "green"
              : data.occupancy_rate >= 50
              ? "orange"
              : "red"
          }
        />

        <Grid gutter="xs">
          {stats.map((stat, index) => (
            <Grid.Col key={index} span={6}>
              <div className="p-2 rounded-lg border border-gray-200 bg-white">
                <Group gap="xs" mb={4}>
                  <div
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon size={14} style={{ color: stat.color }} />
                  </div>
                  <Text size="xs" c="dimmed">
                    {stat.label}
                  </Text>
                </Group>
                <Text size="lg" fw={700}>
                  {stat.value}
                </Text>
              </div>
            </Grid.Col>
          ))}
        </Grid>

        <Text size="xs" c="dimmed" ta="center" mt="xs">
          {data.total_units} total{" "}
          {data.total_units === 1 ? "property" : "properties"}
        </Text>
      </Stack>
    </Card>
  );
};

export default OccupancyOverview;
