import { Title, Button, Text, Grid, Progress, Skeleton } from "@mantine/core";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  name: string;
  status: string;
  monthly_rent?: number;
  monthlyRent?: number;
  views: number;
  applications: number;
  occupancy_rate?: number;
  occupancyRate?: number;
}

interface PropertyPerformanceProps {
  properties: Property[];
  loading: boolean;
}

export const PropertyPerformance = ({
  properties,
  loading,
}: PropertyPerformanceProps) => {
  const navigate = useNavigate();

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { color: string; bg: string; label: string }
    > = {
      occupied: { color: "#2f9e44", bg: "#ebfbee", label: "Occupied" },
      vacant: { color: "#f08c00", bg: "#fff4e6", label: "Vacant" },
      maintenance: { color: "#fa5252", bg: "#fff5f5", label: "Maintenance" },
      available: { color: "#1971c2", bg: "#e7f5ff", label: "Available" },
    };
    return configs[status.toLowerCase()] || configs.available;
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Title order={4} className="mb-1">
            Property Performance
          </Title>
          <Text size="xs" c="dimmed">
            Monitor your properties
          </Text>
        </div>
        <Button
          variant="light"
          size="sm"
          rightSection={<IconChevronRight size={14} />}
          onClick={() => navigate("/property-owner/properties")}
        >
          Manage
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Skeleton height={16} width="60%" mb={8} />
                  <Skeleton height={20} width={80} />
                </div>
                <Skeleton height={16} width="40%" />
              </div>
              <Grid>
                <Grid.Col span={4}>
                  <Skeleton height={12} width="100%" mb={4} />
                  <Skeleton height={14} width="60%" />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Skeleton height={12} width="100%" mb={4} />
                  <Skeleton height={14} width="60%" />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Skeleton height={12} width="100%" mb={4} />
                  <Skeleton height={8} width="100%" mb={2} />
                  <Skeleton height={12} width="40%" />
                </Grid.Col>
              </Grid>
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="space-y-3">
          {properties.map((property) => {
            const statusConfig = getStatusConfig(property.status);
            const occupancyRate =
              property.occupancy_rate || property.occupancyRate || 0;

            return (
              <div
                key={property.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer transition-all"
                onClick={() =>
                  navigate(`/property-owner/properties/${property.id}`)
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <Text size="sm" fw={600} className="mb-2 truncate">
                      {property.name}
                    </Text>
                    <div
                      className="inline-block px-3 py-1 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                      }}
                    >
                      {statusConfig.label}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <Text size="xs" c="dimmed" className="mb-1">
                      Monthly Rent
                    </Text>
                    <Text size="sm" fw={700} c="blue">
                      ₦
                      {property.monthly_rent?.toLocaleString() ||
                        property.monthlyRent?.toLocaleString()}
                    </Text>
                  </div>
                </div>

                <Grid gutter="md">
                  <Grid.Col span={4}>
                    <div className="p-3 rounded-lg bg-white">
                      <Text size="xs" c="dimmed" className="mb-2">
                        Views
                      </Text>
                      <Text size="lg" fw={600}>
                        {property.views.toLocaleString()}
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <div className="p-3 rounded-lg bg-white">
                      <Text size="xs" c="dimmed" className="mb-2">
                        Applications
                      </Text>
                      <Text size="lg" fw={600}>
                        {property.applications}
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <div className="p-3 rounded-lg bg-white">
                      <Text size="xs" c="dimmed" className="mb-2">
                        Occupancy
                      </Text>
                      <Progress
                        value={occupancyRate}
                        size="md"
                        radius="md"
                        color={occupancyRate > 0 ? "#2f9e44" : "#f08c00"}
                        className="mb-2"
                      />
                      <Text size="xs" fw={600}>
                        {occupancyRate}%
                      </Text>
                    </div>
                  </Grid.Col>
                </Grid>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#e9ecef" }}
          >
            <IconHome size={32} className="text-gray-400" />
          </div>
          <Text size="sm" fw={500} className="mb-2">
            No Properties Yet
          </Text>
          <Text size="xs" c="dimmed" className="mb-4">
            Add your first property to start tracking performance
          </Text>
          <Button
            variant="light"
            size="xs"
            onClick={() => navigate("/property-owner/properties/create")}
          >
            Add Property
          </Button>
        </div>
      )}
    </div>
  );
};
