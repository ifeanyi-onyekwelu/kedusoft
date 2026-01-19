import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Select,
  TextInput,
  Group,
  Paper,
  SimpleGrid,
  Badge,
  ActionIcon,
  Menu,
  Divider,
  Modal,
  Box,
  Text,
  Alert, Stack, ThemeIcon, Title,
} from "@mantine/core";
import {
  IconSearch,
  IconRefresh,
  IconCalendar,
  IconHome,
  IconEye,
  IconDownload,
  IconPhone,
  IconDotsVertical,
  IconTrendingUp,
  IconClock,
  IconCheck,
  IconX,
  IconTrash,
  IconMessage,
  IconUser,
  IconAlertCircle, IconClipboardText, IconPlus, IconIdBadge, IconIdBadge2,
} from "@tabler/icons-react";
import {
  getAllApplications,
  deleteApplication,
} from "@/apis/tenantApi.tsx";
import EmptyState from "../../../../components/EmptyState";
import { ErrorState } from "@/components/ErrorState.tsx";
import { useLoading } from "@/hooks/useLoading.tsx";
import { BrandedLoader } from "@/components/LoadingSpinner.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/utils/helpers.tsx";
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom";

// Define the Application type based on your API response
interface Application {
  application_id: string;
  status: string;
  date_applied: string;
  created_at?: string;
  property: {
    name: string;
    address: string;
    type?: string;
    category?: { name: string };
    landlord_id?: string;
  };
}

// Modern Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Paper
    p="lg"
    withBorder
    radius="md"
    className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    style={{
      background: `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
      borderColor: "#f1f3f5", // Very subtle border
    }}
  >
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <div>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" lts="0.5px" mb={4}>
          {title}
        </Text>
        <Text size="xl" fw={800} c="dark">
          {value}
        </Text>
      </div>

      <Box
        className="flex items-center justify-center rounded-xl"
        style={{
          width: 44,
          height: 44,
          backgroundColor: `${color}12`, // Very soft tint
          color: color,
        }}
      >
        {/* Cloning the icon to ensure it inherits the color correctly */}
        {icon}
      </Box>
    </Group>

    {/* Optional: A very thin accent line at the bottom instead of the side */}
    <Box
      mt="md"
      h={2}
      className="rounded-full opacity-40"
      style={{ backgroundColor: color, width: "25%" }}
    />
  </Paper>
);

// Enhanced Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    "under-review": {
      color: "blue",
      icon: <IconClock size={14} />,
      label: "Under Review",
    },
    screening: {
      color: "blue",
      icon: <IconIdBadge size={14} />,
      label: "screening",
    },
    accepted: {
      color: "green",
      icon: <IconCheck size={14} />,
      label: "Approved",
    },
    rejected: {
      color: "red",
      icon: <IconX size={14} />,
      label: "Rejected",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: "gray",
    icon: <IconClock size={14} />,
    label: status,
  };

  return (
    <Badge
      leftSection={config.icon}
      color={config.color}
      variant="light"
      size="md"
      radius="sm"
    >
      {config.label}
    </Badge>
  );
};

// Withdrawal Confirmation Modal
interface WithdrawModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: Application | null;
  loading?: boolean;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  opened,
  onClose,
  onConfirm,
  application,
  loading = false,
}) => (
  <Modal
    opened={opened}
    onClose={onClose}
    title="Withdraw Application"
    centered
    size="md"
  >
    <Box className="space-y-4">
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Are you sure?"
        color="red"
        variant="light"
      >
        This action cannot be undone. You will need to submit a new application
        if you change your mind.
      </Alert>

      {application && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text size="sm" fw={500}>
            {application.property.name}
          </Text>
          <Text size="sm" c="dimmed">
            {application.property.address}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Applied: {formatDate(application.date_applied)}
          </Text>
        </div>
      )}

      <Text size="sm" c="dimmed">
        Withdrawing your application will remove it from the landlord's view and
        you won't be able to recover it.
      </Text>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="red"
          onClick={onConfirm}
          loading={loading}
          leftSection={<IconTrash size={16} />}
        >
          Withdraw Application
        </Button>
      </Group>
    </Box>
  </Modal>
);

// Application Card Component for Mobile
const ApplicationCard = ({
  application,
  onWithdraw,
  onContact,
}: {
  application: Application;
  onWithdraw: (app: Application) => void;
  onContact: (app: Application, method: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {application.property.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
          <IconHome size={14} />
          {application.property.address}
        </p>
        <p className="text-gray-500 text-xs flex items-center gap-1">
          <IconCalendar size={14} />
          Applied {formatDate(application.date_applied)}
        </p>
      </div>
      <Menu position="bottom-end" withArrow>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Application Actions</Menu.Label>
          <Menu.Item
            leftSection={<IconEye size={16} />}
            component="a"
            href={`/tenants/applications/${application.application_id}`}
          >
            View Details
          </Menu.Item>
          <Menu.Item leftSection={<IconDownload size={16} />}>
            Download PDF
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Contact</Menu.Label>
          <Menu.Item
            leftSection={<IconMessage size={16} />}
            onClick={() => onContact(application, "message")}
          >
            Send Message
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPhone size={16} />}
            onClick={() => onContact(application, "call")}
          >
            Call Owner
          </Menu.Item>
          <Menu.Item
            leftSection={<IconUser size={16} />}
            onClick={() => onContact(application, "profile")}
          >
            View Owner Profile
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger Zone</Menu.Label>
          <Menu.Item
            leftSection={<IconTrash size={16} />}
            color="red"
            onClick={() => onWithdraw(application)}
          >
            Withdraw Application
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>

    <Divider my="sm" />

    <div className="flex justify-between items-center">
      <StatusBadge status={application.status} />
      <Group gap="xs">
        <Button
          size="xs"
          variant="light"
          component="a"
          href={`/tenants/applications/${application.application_id}`}
        >
          View Details
        </Button>
      </Group>
    </div>
  </motion.div>
);

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    rejected: 0,
    "under-review": 0,
    screening: 0,
    accepted: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const navigate = useNavigate()

  // Modal states
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const { withLoading, loading } = useLoading();

  const fetchApplications = async () => {
    setError(null);
    try {
      const response = await withLoading(getAllApplications());
      const { applications, status_counts } = response;

      setStatusCounts(status_counts);
      setApplications(applications);
    } catch {
      toast.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const sortedAndFilteredApplications = useMemo(() => {
    let filtered = applications;

    // Apply status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(
        (app) => app.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.property.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting - use date_applied instead of created_at
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.date_applied).getTime() -
            new Date(a.date_applied).getTime()
          );
        case "oldest":
          return (
            new Date(a.date_applied).getTime() -
            new Date(b.date_applied).getTime()
          );
        case "property":
          return a.property.name.localeCompare(b.property.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, filterStatus, searchQuery, sortBy]);

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!selectedApplication) return;

    try {
      await withLoading(deleteApplication(selectedApplication.application_id));

      // Remove application from list
      setApplications((prev) =>
        prev.filter(
          (app) => app.application_id !== selectedApplication.application_id
        )
      );

      // Close modal and reset
      setWithdrawModalOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      toast.error("Failed to withdraw applications. Please try again later.");
      console.error("Failed to withdraw application:", error);
    }
  };

  // Handle contact actions
  const handleContact = (application: Application, method: string) => {
    switch (method) {
      case "message":
        // TODO: Implement send message functionality
        console.log("Send message to:", application.property.landlord_id);
        break;
      case "call":
        // TODO: Implement call functionality
        console.log("Call owner of:", application.property.name);
        break;
      case "profile":
        // TODO: Navigate to owner profile
        console.log("View profile of:", application.property.landlord_id);
        break;
      default:
        break;
    }
  };

  // Open withdrawal confirmation
  const openWithdrawModal = (application: Application) => {
    setSelectedApplication(application);
    setWithdrawModalOpen(true);
  };

  const statistics = [
    {
      title: "Applied",
      value: applications.length,
      icon: <IconTrendingUp size={20} className="text-blue-600" />,
      color: "#3b82f6",
    },
    {
      title: "Approved",
      value: statusCounts.accepted,
      icon: <IconCheck size={20} className="text-green-600" />,
      color: "#10b981",
    },
    {
      title: "Screening",
      value: statusCounts.screening,
      icon: <IconIdBadge2 size={20} className="text-orange-600" />,
      color: "#f59e0b",
    },
    {
      title: "Under Review",
      value: statusCounts["under-review"],
      icon: <IconEye size={20} className="text-gray-600" />,
      color: "#6b7280",
    },
  ];

  if (loading) {
    return <BrandedLoader inDashboard={true} label="Getting your applications..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchApplications}
        loading={loading}
      />
    );
  }

  if (!applications || !applications.length) {
    return (
        <div className="px-4 py-6">
          <EmptyState>
            <Stack align="center" gap="xl" className="max-w-md">
              {/* Icon Composition: Swapped for File/Application focus */}
              <Box className="relative">
                <ThemeIcon
                    size={80}
                    radius="24px"
                    variant="light"
                    color="indigo"
                    className="bg-indigo-50 border border-indigo-100"
                >
                  <IconClipboardText size={40} stroke={1.5} className="text-indigo-600" />
                </ThemeIcon>
                <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                  <IconPlus size={16} className="text-emerald-500" stroke={3} />
                </div>
              </Box>

              {/* Text Content */}
              <Stack gap="xs" align="center" className="text-center">
                <Title
                    order={2}
                    className="text-slate-900 tracking-tight font-extrabold"
                >
                  No Applications Yet
                </Title>
                <Text
                    size="lg"
                    className="text-slate-500 leading-relaxed font-medium"
                >
                  Your property journey starts here. Once you find a place you love,
                  your application progress will appear in this dashboard.
                </Text>
              </Stack>

              {/* Action Area */}
              <Stack gap="sm" className="w-full sm:w-auto">
                <Button
                    onClick={() => navigate("/listings")}
                    size="lg"
                    radius="xl"
                    className="bg-slate-900 hover:bg-slate-800 transition-all px-8"
                    leftSection={<IconSearch size={18} />}
                >
                  Browse Properties
                </Button>
                <Text
                    size="xs"
                    className="text-slate-400 font-bold uppercase tracking-widest text-center"
                >
                  Find your next dream home
                </Text>
              </Stack>
            </Stack>
          </EmptyState>
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Withdrawal Confirmation Modal */}
      <WithdrawModal
        opened={withdrawModalOpen}
        onClose={() => {
          setWithdrawModalOpen(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleWithdraw}
        application={selectedApplication}
        loading={loading}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600">
            Manage and track your property applications
          </p>
        </div>
        <Button
          leftSection={<IconRefresh size={16} />}
          variant="outline"
          onClick={fetchApplications}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {statistics.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </SimpleGrid>

      {/* Filters Section */}
      <Paper p="md" withBorder className="bg-gray-50/50">
        <Group>
          <TextInput
            placeholder="Search properties or addresses..."
            rightSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className="flex-1 min-w-[200px]"
          />

          <Group>
            <Select
              placeholder="Filter by status"
              data={[
                { value: "all", label: "All Statuses" },
                { value: "received", label: "Received" },
                { value: "under-review", label: "Under Received" },
                { value: "screening", label: "Screening" },
                { value: "accepted", label: "Accepted" },
                { value: "rejected", label: "Rejected" },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              clearable
              className="w-[180px]"
            />

            <Select
              placeholder="Sort by"
              data={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "property", label: "Property Name" },
              ]}
              value={sortBy}
              onChange={setSortBy}
              className="w-[150px]"
            />
          </Group>
        </Group>
      </Paper>

      {/* Applications List */}
      <Paper withBorder className="overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Property
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Address
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Date Applied
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {sortedAndFilteredApplications.map((application, index) => (
                  <motion.tr
                    key={application.application_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.property.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {application.property.category?.name || "Residential"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {application.property.address}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(application.date_applied)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="p-4">
                      <Group>
                        <Button
                          size="xs"
                          variant="light"
                          component="a"
                          href={`/tenants/applications/${application.application_id}`}
                        >
                          View Details
                        </Button>
                        <Menu position="bottom-end" withArrow>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Label>Application Actions</Menu.Label>
                            <Menu.Item
                              leftSection={<IconEye size={16} />}
                              component="a"
                              href={`/tenants/applications/${application.application_id}`}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item leftSection={<IconDownload size={16} />}>
                              Download PDF
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Contact</Menu.Label>
                            <Menu.Item
                              leftSection={<IconMessage size={16} />}
                              onClick={() =>
                                handleContact(application, "message")
                              }
                            >
                              Send Message
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconPhone size={16} />}
                              onClick={() => handleContact(application, "call")}
                            >
                              Call Owner
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconUser size={16} />}
                              onClick={() =>
                                handleContact(application, "profile")
                              }
                            >
                              View Owner Profile
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Danger Zone</Menu.Label>
                            <Menu.Item
                              leftSection={<IconTrash size={16} />}
                              color="red"
                              onClick={() => openWithdrawModal(application)}
                            >
                              Withdraw Application
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {sortedAndFilteredApplications.map((application) => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  onWithdraw={openWithdrawModal}
                  onContact={handleContact}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Empty State */}
        {sortedAndFilteredApplications.length === 0 && (
            <div className="py-12">
              <EmptyState>
                <motion.div
                    className="space-y-4 flex flex-col justify-center items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <IconHome size={32} className="text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    No Applications Found
                  </h2>
                  <p className="text-gray-500 max-w-md">
                    {searchQuery || filterStatus
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "You haven't submitted any applications yet. Start by browsing available properties."}
                  </p>
                  <Group>
                    {(searchQuery || filterStatus) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("");
                              setFilterStatus(null);
                            }}
                        >
                          Clear Filters
                        </Button>
                    )}
                    <Button component="a" href="/listings">
                      Browse Properties
                    </Button>
                  </Group>
                </motion.div>
              </EmptyState>
            </div>
        )}
      </Paper>
    </div>
  );
}

export default Applications;
