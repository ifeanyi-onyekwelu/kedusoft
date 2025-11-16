import { useState, useEffect } from "react";
import {
  IconLayoutGrid,
  IconPlus,
  IconTrendingUp,
  IconTrendingDown,
  IconSearch,
  IconDownload,
  IconRefresh,
  IconChartBar,
  IconHome,
  IconCurrencyNaira,
  IconEye,
  IconUsers,
  IconBuildingStore,
  IconMapPin,
  IconDots,
  IconEdit,
  IconTrash,
  IconShare,
  IconSquare,
} from "@tabler/icons-react";
import {
  SegmentedControl,
  Badge,
  ActionIcon,
  TextInput,
  Select,
  RangeSlider,
  Button,
  Group,
  Stack,
  Card,
  Text,
  Title,
  ThemeIcon,
  Modal,
  Tabs,
  MultiSelect,
  Grid,
  Menu,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { useLoading } from "../../../../hooks/useLoading";
import EmptyState from "../../../../components/EmptyState";
import formatAmount from "../../../../utils/helpers";
import { ErrorState } from "../../../../components/ErrorState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { motion } from "framer-motion";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

// Professional Statistics Card
const StatisticsCard = ({
  title,
  value,
  change,
  icon,
  color,
  subtitle,
}: any) => {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Group gap="xs" mb="xs">
              <ThemeIcon size="md" variant="light" color={color} radius="md">
                {icon}
              </ThemeIcon>
              <Text size="sm" c="dimmed" fw={500}>
                {title}
              </Text>
            </Group>
            <Text size="2xl" fw={700} className="text-gray-900" mb={4}>
              {typeof value === "number" && value > 1000000
                ? `₦${(value / 1000000).toFixed(1)}M`
                : typeof value === "number" && value > 1000
                ? `${(value / 1000).toFixed(1)}K`
                : value}
            </Text>
            {subtitle && (
              <Text size="xs" c="dimmed" mb="xs">
                {subtitle}
              </Text>
            )}
            {change !== undefined && (
              <Group gap={4}>
                {change > 0 ? (
                  <IconTrendingUp size={16} className="text-green-600" />
                ) : change < 0 ? (
                  <IconTrendingDown size={16} className="text-red-600" />
                ) : null}
                <Text
                  size="sm"
                  c={change > 0 ? "green" : change < 0 ? "red" : "dimmed"}
                  fw={600}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </Text>
                <Text size="xs" c="dimmed">
                  vs last month
                </Text>
              </Group>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Clean MVP Property Card
const PropertyCard = ({
  property,
  index,
}: {
  property: any;
  index: number;
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: "green",
      occupied: "blue",
      rented: "blue",
      maintenance: "orange",
      draft: "gray",
    };
    return colors[status?.toLowerCase()] || "gray";
  };

  const status =
    property.status || (property.is_available ? "available" : "rented");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="h-full hover:shadow-md transition-shadow duration-200"
      >
        {/* Property Image */}
        <div className="relative h-48 -mx-4 -mt-4 mb-6 overflow-hidden rounded-t-md">
          {property.cover_image ? (
            <img
              src={property.cover_image}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 flex items-center justify-center">
              <IconHome size={48} className="text-white" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge size="md" variant="filled" color={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          {/* Menu */}
          <div className="absolute top-3 left-3">
            <Menu shadow="md" width={180}>
              <Menu.Target>
                <ActionIcon variant="white" size="lg">
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size={16} />}
                  onClick={() =>
                    navigate(`/property-owner/properties/${property.id}`)
                  }
                >
                  View Details
                </Menu.Item>
                <Menu.Item leftSection={<IconEdit size={16} />}>Edit</Menu.Item>
                <Menu.Item leftSection={<IconShare size={16} />}>
                  Share
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconTrash size={16} />} color="red">
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>

        <Stack gap="lg">
          {/* Property Title */}
          <div>
            <Text size="lg" fw={600} mb="xs" lineClamp={1}>
              {property.name}
            </Text>
            <Group gap={6}>
              <IconMapPin size={16} className="text-gray-500" />
              <Text size="sm" c="dimmed" lineClamp={1}>
                {property.address}, {property.city}
              </Text>
            </Group>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-md">
            <div className="text-center">
              <IconBuildingStore
                size={20}
                className="text-gray-600 mx-auto mb-1"
              />
              <Text size="xs" c="dimmed" mb={2}>
                Beds
              </Text>
              <Text size="lg" fw={600}>
                {property.bedrooms}
              </Text>
            </div>

            <div className="h-12 w-px bg-gray-300" />

            <div className="text-center">
              <IconUsers size={20} className="text-gray-600 mx-auto mb-1" />
              <Text size="xs" c="dimmed" mb={2}>
                Baths
              </Text>
              <Text size="lg" fw={600}>
                {property.bathrooms}
              </Text>
            </div>

            <div className="h-12 w-px bg-gray-300" />

            <div className="text-center">
              <IconSquare size={20} className="text-gray-600 mx-auto mb-1" />
              <Text size="xs" c="dimmed" mb={2}>
                Size
              </Text>
              <Text size="sm" fw={600}>
                {formatAmount(property.size_sqft)}
              </Text>
            </div>
          </div>

          {/* Price */}
          <div>
            <Text size="xs" c="dimmed" mb={4}>
              Monthly Rent
            </Text>
            <Text size="xl" fw={700} c="blue">
              ₦{formatAmount(property.rent_amount)}
            </Text>
          </div>

          {/* Verification Status */}
          {property.verification_status && (
            <Badge
              variant="light"
              color={
                property.verification_status === "verified" ? "teal" : "yellow"
              }
              size="md"
            >
              {property.verification_status === "verified"
                ? "✓ Verified"
                : "Pending Verification"}
            </Badge>
          )}

          {/* Action Button */}
          <Button
            component={Link}
            to={`/property-owner/properties/${property.id}`}
            variant="filled"
            fullWidth
            size="md"
            leftSection={<IconEye size={18} />}
          >
            Manage Property
          </Button>
        </Stack>
      </Card>
    </motion.div>
  );
};

// Enhanced Filters with Professional Design
const PropertyFilters = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: any) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [filters, setFilters] = useState({
    search: "",
    status: [],
    verification: [],
    priceRange: [0, 10000000] as [number, number],
    bedrooms: "",
    propertyType: "",
    location: "",
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <>
      <Card className="bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <TextInput
            placeholder="Search properties..."
            leftSection={<IconSearch size={16} />}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="flex-1 min-w-64"
          />

          <Select
            placeholder="Property Type"
            data={["Apartment", "House", "Duplex", "Commercial"]}
            value={filters.propertyType}
            onChange={(value) => handleFilterChange("propertyType", value)}
            clearable
          />

          <Select
            placeholder="Bedrooms"
            data={["1", "2", "3", "4", "5+"]}
            value={filters.bedrooms}
            onChange={(value) => handleFilterChange("bedrooms", value)}
            clearable
          />

          <ActionIcon variant="light" size="lg">
            <IconDownload size={18} />
          </ActionIcon>
        </div>
      </Card>

      <Modal opened={opened} onClose={close} title="Advanced Filters" size="lg">
        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} mb="xs">
              Price Range
            </Text>
            <RangeSlider
              min={0}
              max={10000000}
              step={100000}
              value={filters.priceRange}
              onChange={(value) => handleFilterChange("priceRange", value)}
              marks={[
                { value: 0, label: "₦0" },
                { value: 5000000, label: "₦5M" },
                { value: 10000000, label: "₦10M" },
              ]}
            />
          </div>

          <MultiSelect
            label="Status"
            placeholder="Select status"
            data={["Available", "Rented", "Maintenance"]}
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
          />

          <MultiSelect
            label="Verification Status"
            placeholder="Select verification status"
            data={["Verified", "Pending", "Rejected"]}
            value={filters.verification}
            onChange={(value) => handleFilterChange("verification", value)}
          />

          <TextInput
            label="Location"
            placeholder="Enter location"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>Apply Filters</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

// Main Component
const LandlordProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { loading, withLoading } = useLoading();
  const { getListedProperties } = useLandlordOperations();

  const fetchProperties = async () => {
    try {
      setError(null);
      const result = await withLoading(getListedProperties());
      console.log("Fetched Properties:", result);
      setProperties(result || []);
      setFilteredProperties(result || []);
    } catch (error: any) {
      setError(error.message || "Failed to fetch properties");
      notifications.show({
        title: "Error",
        message: "Failed to load properties",
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...properties];

    if (filters.search) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          property.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(
        (property) => property.property_type === filters.propertyType
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms.toString() === filters.bedrooms
      );
    }

    setFilteredProperties(filtered);
  };

  // Calculate statistics
  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.is_available).length;
  const occupiedProperties = totalProperties - availableProperties;
  const totalRevenue = properties
    .filter((p) => !p.is_available)
    .reduce((sum, p) => sum + p.rent_amount, 0);

  const statistics = [
    {
      title: "Total Properties",
      value: totalProperties,
      change: 12,
      icon: <IconHome size={20} />,
      color: "blue",
      subtitle: "Properties in portfolio",
    },
    {
      title: "Monthly Revenue",
      value: totalRevenue,
      change: 8,
      icon: <IconCurrencyNaira size={20} />,
      color: "green",
      subtitle: "From occupied properties",
    },
    {
      title: "Occupancy Rate",
      value: Math.round(
        (occupiedProperties / Math.max(totalProperties, 1)) * 100
      ),
      change: 5,
      icon: <IconTrendingUp size={20} />,
      color: "purple",
      subtitle: "Current occupancy",
    },
    {
      title: "Available Units",
      value: availableProperties,
      change: -3,
      icon: <IconBuildingStore size={20} />,
      color: "orange",
      subtitle: "Ready for rent",
    },
  ];

  if (loading)
    return <LoadingSpinner fullScreen label="Loading properties..." />;
  if (error)
    return (
      <ErrorState message={error} loading={loading} onRetry={fetchProperties} />
    );

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <Title order={2}>Properties</Title>
            <Text c="dimmed" size="sm">
              Manage your property portfolio
            </Text>
          </div>
          <Button
            component={Link}
            to="/property-owner/properties/add"
            leftSection={<IconPlus size={16} />}
          >
            Add Property
          </Button>
        </div>

        {/* Statistics */}
        <Grid>
          {statistics.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
              <StatisticsCard {...stat} />
            </Grid.Col>
          ))}
        </Grid>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value || "overview")}
        >
          <Card>
            <div className="flex justify-between items-center">
              <Tabs.List>
                <Tabs.Tab
                  value="overview"
                  leftSection={<IconLayoutGrid size={16} />}
                >
                  Property Portfolio
                </Tabs.Tab>
                <Tabs.Tab
                  value="analytics"
                  leftSection={<IconChartBar size={16} />}
                >
                  Analytics & Reports
                </Tabs.Tab>
              </Tabs.List>

              <Group gap="sm">
                <SegmentedControl
                  value={viewMode}
                  onChange={(value: string) =>
                    setViewMode(value as "grid" | "table")
                  }
                  data={[
                    { value: "grid", label: "Grid" },
                    { value: "table", label: "List" },
                  ]}
                  size="sm"
                />
                <ActionIcon variant="light" size="lg" onClick={fetchProperties}>
                  <IconRefresh size={18} />
                </ActionIcon>
              </Group>
            </div>
          </Card>

          <Tabs.Panel value="overview">
            <div className="space-y-6">
              {/* Filters */}
              <PropertyFilters onFiltersChange={handleFiltersChange} />

              {/* Properties Grid/List */}
              {filteredProperties.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredProperties.map((property, index) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left p-4 font-semibold">
                                Property
                              </th>
                              <th className="text-left p-4 font-semibold">
                                Location
                              </th>
                              <th className="text-left p-4 font-semibold">
                                Rent
                              </th>
                              <th className="text-left p-4 font-semibold">
                                Status
                              </th>
                              <th className="text-left p-4 font-semibold">
                                Verification
                              </th>
                              <th className="text-left p-4 font-semibold">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProperties.map((property, index) => (
                              <motion.tr
                                key={property.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="p-4">
                                  <div>
                                    <Text fw={600}>{property.name}</Text>
                                    <Text size="sm" c="dimmed">
                                      {property.bedrooms} beds •{" "}
                                      {property.bathrooms} baths
                                    </Text>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Text size="sm">
                                    {property.address}, {property.city}
                                  </Text>
                                </td>
                                <td className="p-4">
                                  <Text fw={600} c="green">
                                    ₦{formatAmount(property.rent_amount)}
                                  </Text>
                                </td>
                                <td className="p-4">
                                  <StatusBadgeComponent
                                    status={
                                      property.is_available
                                        ? "available"
                                        : "rented"
                                    }
                                  />
                                </td>
                                <td className="p-4">
                                  <StatusBadgeComponent
                                    status={
                                      property.verification_status || "pending"
                                    }
                                  />
                                </td>
                                <td className="p-4">
                                  <Button
                                    component={Link}
                                    to={`/property-owner/properties/${property.id}`}
                                    variant="light"
                                    size="sm"
                                  >
                                    Manage
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <EmptyState>
                  <div className="text-center space-y-4">
                    <ThemeIcon
                      size={80}
                      variant="light"
                      color="blue"
                      className="mx-auto"
                    >
                      <IconHome size={40} />
                    </ThemeIcon>
                    <div>
                      <Title order={3}>No Properties Yet</Title>
                      <Text c="dimmed" mt="xs">
                        Start building your property portfolio today
                      </Text>
                    </div>
                    <Button
                      component={Link}
                      to="/property-owner/properties/add"
                      size="lg"
                      leftSection={<IconPlus size={20} />}
                    >
                      Add Your First Property
                    </Button>
                  </div>
                </EmptyState>
              )}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="analytics">
            <Card>
              <Title order={3} mb="md">
                Analytics Dashboard
              </Title>
              <Text c="dimmed">
                Detailed analytics and reporting features coming soon...
              </Text>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadgeComponent = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "green";
      case "occupied":
      case "rented":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Badge color={getStatusColor(status)} variant="light">
      {status}
    </Badge>
  );
};

export default LandlordProperties;
