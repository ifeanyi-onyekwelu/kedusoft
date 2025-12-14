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
  Alert,
} from "@mantine/core";
import {
  IconSearch,
  IconRefresh,
  IconCalendar,
  IconHome,
  IconEye,
  IconDownload,
  IconMail,
  IconPhone,
  IconDotsVertical,
  IconTrendingUp,
  IconClock,
  IconCheck,
  IconX,
  IconTrash,
  IconMessage,
  IconUser,
  IconAlertCircle,
} from "@tabler/icons-react";
import {
  getAllApplications,
  deleteApplication,
} from "../../../../apis/tenantApi";
import EmptyState from "../../../../components/EmptyState";
import { ErrorState } from "../../../../components/ErrorState";
import { useLoading } from "../../../../hooks/useLoading";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../../../../utils/helpers";

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
    p="md"
    withBorder
    className="border-l-4 transition-all duration-300 hover:shadow-md"
    style={{ borderLeftColor: color }}
  >
    <Group justify="space-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </Group>
  </Paper>
);

// Enhanced Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: {
      color: "orange",
      icon: <IconClock size={14} />,
      label: "Pending Review",
    },
    "under-review": {
      color: "blue",
      icon: <IconTrendingUp size={14} />,
      label: "Under Review",
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
    viewed: {
      color: "gray",
      icon: <IconEye size={14} />,
      label: "Viewed",
    },
    sent: {
      color: "indigo",
      icon: <IconMail size={14} />,
      label: "Sent",
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
    viewed: 0,
    rejected: 0,
    pending: 0,
    "under-review": 0,
    accepted: 0,
    sent: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");

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

      console.log("Applications Response:", applications);

      setStatusCounts(status_counts);
      setApplications(applications);
    } catch (error) {
      setError("Failed to fetch applications. Please try again later.");
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
      title: "Under Review",
      value: statusCounts["under-review"],
      icon: <IconClock size={20} className="text-orange-600" />,
      color: "#f59e0b",
    },
    {
      title: "Pending Review",
      value: statusCounts.pending,
      icon: <IconEye size={20} className="text-gray-600" />,
      color: "#6b7280",
    },
  ];

  if (loading) {
    return (
      <LoadingSpinner
        label="Fetching applications please wait...."
        fullScreen
      />
    );
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

      {/* Statistics Cards */}
      <SimpleGrid cols={4} spacing="lg">
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
                { value: "pending", label: "Pending Review" },
                { value: "under-review", label: "Under Review" },
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
