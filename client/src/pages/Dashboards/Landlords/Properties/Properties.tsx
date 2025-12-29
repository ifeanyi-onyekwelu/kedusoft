import { useState, useMemo } from "react";
import {
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconRefresh,
  IconChartBar,
  IconHome,
  IconCurrencyNaira,
  IconEye,
  IconMapPin,
  IconDots,
  IconEdit,
  IconTrash,
  IconFilter,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  SegmentedControl,
  Badge,
  ActionIcon,
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Card,
  Text,
  Title,
  ThemeIcon,
  Tabs,
  Grid,
  Menu,
  Pagination,
  Table,
  Box,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { useLoading } from "../../../../hooks/useLoading";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { ErrorState } from "../../../../components/ErrorState";
import formatAmount from "../../../../utils/helpers";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 8;

const LandlordProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("overview");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { loading, withLoading } = useLoading();
  const { getListedProperties } = useLandlordOperations();

  const fetchProperties = async () => {
    try {
      setError(null);
      const result = await withLoading(getListedProperties());
      setProperties(result || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch properties");
    }
  };

  useMemo(() => fetchProperties(), []);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [properties, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats Calculation
  const stats = [
    {
      label: "Portfolio Size",
      value: properties.length,
      icon: IconHome,
      color: "blue",
    },
    {
      label: "Active Revenue",
      value: properties
        .filter((p) => !p.is_available)
        .reduce((a, b) => a + b.rent_amount, 0),
      icon: IconCurrencyNaira,
      color: "teal",
    },
    {
      label: "Occupancy",
      value: `${Math.round(
        (properties.filter((p) => !p.is_available).length /
          Math.max(properties.length, 1)) *
          100
      )}%`,
      icon: IconChartBar,
      color: "indigo",
    },
  ];

  if (loading) return <LoadingSpinner fullScreen />;
  if (error)
    return (
      <ErrorState loading={loading} message={error} onRetry={fetchProperties} />
    );

  return (
    <Box p="sm" className="bg-[#FAFBFC] min-h-screen">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <Stack gap={4}>
            <Title order={2} fw={700} className="text-[#1A1C1E]">
              Property Management
            </Title>
            <Text c="dimmed" size="sm">
              Manage and track your listed assets and their performance.
            </Text>
          </Stack>
          <Button
            leftSection={<IconPlus size={18} />}
            component={Link}
            to="/property-owner/properties/add"
            size="md"
            radius="md"
          >
            List New Property
          </Button>
        </Group>

        {/* Professional Stats Row */}
        <Grid>
          {stats.map((stat) => (
            <Grid.Col key={stat.label} span={{ base: 12, sm: 4 }}>
              <Card withBorder radius="md" p="lg" shadow="xs">
                <Group justify="space-between">
                  <div>
                    <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={1}>
                      {stat.label}
                    </Text>
                    <Text size="xl" fw={800} mt={4}>
                      {typeof stat.value === "number" &&
                      stat.label.includes("Revenue")
                        ? `₦${formatAmount(stat.value)}`
                        : stat.value}
                    </Text>
                  </div>
                  <ThemeIcon
                    variant="light"
                    color={stat.color}
                    size="xl"
                    radius="md"
                  >
                    <stat.icon size={24} />
                  </ThemeIcon>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Content Section */}
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="outline"
          radius="md"
        >
          <Card withBorder radius="md" p={0} shadow="xs">
            <Box p="md" className="border-b border-gray-100">
              <Group justify="space-between">
                <Tabs.List className="border-none">
                  <Tabs.Tab
                    value="overview"
                    leftSection={<IconLayoutGrid size={16} />}
                  >
                    Portfolio
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="analytics"
                    leftSection={<IconChartBar size={16} />}
                  >
                    Performance
                  </Tabs.Tab>
                </Tabs.List>

                <Group gap="sm">
                  <TextInput
                    placeholder="Search by name or location..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    size="sm"
                    w={250}
                  />
                  <SegmentedControl
                    value={viewMode}
                    onChange={(v: any) => setViewMode(v)}
                    data={[
                      { label: "Grid", value: "grid" },
                      { label: "List", value: "table" },
                    ]}
                    size="sm"
                  />
                  <ActionIcon
                    variant="default"
                    size="lg"
                    onClick={fetchProperties}
                  >
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>

            <Tabs.Panel value="overview" p="md">
              {filteredProperties.length === 0 ? (
                <Stack align="center" py={60} gap="sm">
                  <ThemeIcon size={60} radius={60} variant="light" color="gray">
                    <IconSearch size={30} />
                  </ThemeIcon>
                  <Text fw={600}>No properties found</Text>
                  <Text size="sm" c="dimmed">
                    Try adjusting your search or filters.
                  </Text>
                </Stack>
              ) : viewMode === "grid" ? (
                <Grid gutter="lg">
                  {paginatedItems.map((p, i) => (
                    <Grid.Col
                      key={p.id}
                      span={{ base: 12, md: 6, lg: 4, xl: 3 }}
                    >
                      <PropertyGridCard property={p} index={i} />
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <PropertyTable properties={paginatedItems} />
              )}

              {/* Pagination UI */}
              {totalPages > 1 && (
                <Group justify="center" mt="xl" py="md">
                  <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                    withEdges
                    radius="md"
                  />
                </Group>
              )}
            </Tabs.Panel>
          </Card>
        </Tabs>
      </Stack>
    </Box>
  );
};

// Sub-component: Table View
const PropertyTable = ({ properties }: { properties: any[] }) => {
  const navigate = useNavigate();
  return (
    <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
      <Table.Thead className="bg-[#F8F9FA]">
        <Table.Tr>
          <Table.Th>Property Details</Table.Th>
          <Table.Th>Rent</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Verification</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {properties.map((p) => (
          <Table.Tr key={p.id}>
            <Table.Td>
              <Group gap="sm">
                <Box
                  w={50}
                  h={50}
                  bg="gray.1"
                  style={{
                    backgroundImage: `url(${p.cover_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div>
                  <Text fw={600} size="sm">
                    {p.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {p.address}, {p.city}
                  </Text>
                </div>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text fw={700} size="sm">
                ₦{formatAmount(p.rent_amount)}
              </Text>
              <Text size="xs" c="dimmed">
                per month
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge
                variant="light"
                color={p.is_available ? "teal" : "red"}
                radius="sm"
              >
                {p.is_available ? "Available" : "Rented"}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge
                color={p.verification_status === "verified" ? "blue" : "gray"}
                variant="dot"
              >
                {p.verification_status || "Unverified"}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Group gap={0} justify="flex-end">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => navigate(`/property-owner/properties/${p.id}`)}
                >
                  <IconEye size={16} />
                </ActionIcon>
                <Menu position="bottom-end" shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEdit size={14} />}>
                      Edit Details
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      color="red"
                    >
                      Remove
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

// Sub-component: Simplified Grid Card
const PropertyGridCard = ({ property, index }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        withBorder
        padding="md"
        radius="md"
        className="hover:shadow-md transition-shadow"
      >
        <Card.Section className="relative">
          <Box h={160} bg="gray.2">
            {property.cover_image && (
              <img
                src={property.cover_image}
                className="w-full h-full object-cover"
              />
            )}
          </Box>
          <Badge
            className="absolute top-2 right-2"
            color={property.is_available ? "teal" : "red"}
          >
            {property.is_available ? "Available" : "Occupied"}
          </Badge>
        </Card.Section>

        <Stack gap="xs" mt="md">
          <Text fw={700} lineClamp={1}>
            {property.name}
          </Text>
          <Group gap={4}>
            <IconMapPin size={14} className="text-gray-400" />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {property.address}
            </Text>
          </Group>

          <Group justify="space-between" mt="sm">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Monthly Rent
              </Text>
              <Text fw={800} c="blue">
                ₦{formatAmount(property.rent_amount)}
              </Text>
            </div>
            <ActionIcon
              variant="light"
              size="lg"
              radius="md"
              onClick={() =>
                navigate(`/property-owner/properties/${property.id}`)
              }
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          </Group>
        </Stack>
      </Card>
    </motion.div>
  );
};

export default LandlordProperties;
