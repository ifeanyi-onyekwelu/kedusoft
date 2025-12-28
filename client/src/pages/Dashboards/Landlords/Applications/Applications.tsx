import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Group,
  Pagination,
  TextInput,
  Badge,
  Card,
  Grid,
  Text,
  Title,
  Button,
  Menu,
  Tabs,
  Stack,
  ThemeIcon,
  Box,
  useMatches,
} from "@mantine/core";
import {
  IconSearch,
  IconRefresh,
  IconEye,
  IconMessage,
  IconChecks,
  IconClock,
  IconX,
  IconUsers,
  IconClipboardCheck,
  IconFileText,
  IconDotsVertical,
} from "@tabler/icons-react";
import EmptyState from "../../../../components/EmptyState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import ConfirmationModal from "../../../../components/modals/ConfirmationModal";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { formatDate } from "../../../../utils/helpers";
import { useLoading } from "../../../../hooks/useLoading";
import { notifications } from "@mantine/notifications";

// Simplified Statistics Card Component
const StatCard = ({
  icon,
  label,
  value,
  change,
  changeType,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease";
  color: string;
}) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="space-between" mb="xs">
      <ThemeIcon color={color} size={40} radius="md">
        {icon}
      </ThemeIcon>
      {change && (
        <Badge
          color={changeType === "increase" ? "green" : "red"}
          variant="light"
          size="sm"
        >
          {changeType === "increase" ? "+" : "-"}
          {change}%
        </Badge>
      )}
    </Group>
    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
      {label}
    </Text>
    <Text size="xl" fw={700}>
      {value.toLocaleString()}
    </Text>
  </Card>
);

// Mobile Card Component for Applications
const ApplicationCard = ({
  application,
  onAction,
}: {
  application: any;
  onAction: (action: string, id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: "blue",
      under_review: "yellow",
      screening: "orange",
      approved: "green",
      rejected: "red",
      lease_created: "teal",
    };
    return colors[status] || "gray";
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text size="sm" fw={600}>
              {application.tenant?.firstName} {application.tenant?.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {application.property?.name}
            </Text>
          </Box>
          <Badge color={getStatusColor(application.status)} variant="light" size="sm">
            {application.status.replace("_", " ").toUpperCase()}
          </Badge>
        </Group>

        <Group gap="xs">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconEye size={16} />}
            onClick={() => onAction("view", application.id)}
            flex={1}
          >
            View
          </Button>
          <Button
            variant="light"
            color="green"
            size="sm"
            leftSection={<IconChecks size={16} />}
            onClick={() => onAction("approve", application.id)}
            flex={1}
          >
            Approve
          </Button>
          <Button
            variant="light"
            color="red"
            size="sm"
            leftSection={<IconX size={16} />}
            onClick={() => onAction("reject", application.id)}
            flex={1}
          >
            Reject
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

// Desktop Table Row Component
const ApplicationTableRow = ({
  application,
  onAction,
}: {
  application: any;
  onAction: (action: string, id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: "blue",
      under_review: "yellow",
      screening: "orange",
      approved: "green",
      rejected: "red",
      lease_created: "teal",
    };
    return colors[status] || "gray";
  };

  return (
    <tr className="hover:bg-blue-50 transition-colors border-b border-gray-100">
      <td className="p-4">
        <Box>
          <Text size="sm" fw={600} className="text-gray-900">
            {application.tenant?.firstName} {application.tenant?.lastName}
          </Text>
          <Text size="xs" c="dimmed">
            {application.tenant?.email}
          </Text>
        </Box>
      </td>
      <td className="p-4">
        <Text size="sm" fw={500} className="text-gray-900" lineClamp={1}>
          {application.property?.name}
        </Text>
      </td>
      <td className="p-4">
        <Badge
          color={getStatusColor(application.status)}
          variant="light"
          size="sm"
        >
          {application.status.replace("_", " ").toUpperCase()}
        </Badge>
      </td>
      <td className="p-4">
        <Text size="sm" c="dimmed">
          {formatDate(application.created_at)}
        </Text>
      </td>
      <td className="p-4">
        <Group gap="sm" justify="flex-start">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconEye size={16} />}
            onClick={() => onAction("view", application.id)}
          >
            View
          </Button>
          <Button
            variant="light"
            color="green"
            size="sm"
            leftSection={<IconChecks size={16} />}
            onClick={() => onAction("approve", application.id)}
          >
            Approve
          </Button>
          <Button
            variant="light"
            color="red"
            size="sm"
            leftSection={<IconX size={16} />}
            onClick={() => onAction("reject", application.id)}
          >
            Reject
          </Button>
        </Group>
      </td>
    </tr>
  );
};

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Record<string, number>>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [stats, setStats] = useState<Record<string, number>>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    screening: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [confirmationModal, setConfirmationModal] = useState<{
    opened: boolean;
    title: string;
    message: string;
    type: "danger" | "warning" | "success" | "info";
    confirmText: string;
    action: (() => Promise<void>) | null;
  }>({
    opened: false,
    title: "",
    message: "",
    type: "warning",
    confirmText: "Confirm",
    action: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const { loading, withLoading } = useLoading();

  // Use responsive breakpoint
  const isMobile = useMatches({
    base: true,
    sm: true,
    md: false,
  });

  const {
    getAllApplications,
    getApplicationStats,
    rejectApplication,
    approveApplication,
  } = useLandlordOperations();

  const fetchApplications = async (page = 1) => {
    const { applications } = await withLoading(
      getAllApplications({
        page,
        limit: pagination.limit,
        status: statusFilter || undefined,
      })
    );

    setApplications(applications);
    setFilteredApplications(applications);
    setPagination({
      page,
      limit: pagination.limit,
      total: applications["total"] || 0,
      pages: applications["pages"] || 1,
    });
  };

  const fetchStats = async () => {
    const response = await getApplicationStats();
    setStats(response);
  };

  const fetchAll = async () => {
    await Promise.all([fetchApplications(), fetchStats()]);
  };

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications;

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.tenant?.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.tenant?.lastName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.tenant?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.property?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  useEffect(() => {
    fetchAll();
  }, []);

  const handlePageChange = (page: number) => {
    fetchApplications(page);
  };

  const showConfirmation = (
    title: string,
    message: string,
    type: "danger" | "warning" | "success" | "info",
    confirmText: string,
    action: () => Promise<void>
  ) => {
    setConfirmationModal({
      opened: true,
      title,
      message,
      type,
      confirmText,
      action,
    });
  };

  const handleConfirmAction = async () => {
    if (confirmationModal.action) {
      setActionLoading(true);
      try {
        await confirmationModal.action();
        setConfirmationModal({ ...confirmationModal, opened: false });
        await fetchAll(); // Refresh data
      } catch (error) {
        console.error("Action failed:", error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAction = async (action: string, applicationId: string) => {
    const application = applications.find((app) => app.id === applicationId);
    if (!application) return;

    switch (action) {
      case "view":
        navigate(
          `/property-owner/applications/${applicationId}/${application.property_id}`
        );
        break;

      case "reject":
        showConfirmation(
          "Reject Application",
          `Are you sure you want to reject ${application.tenant?.firstName} ${application.tenant?.lastName}'s application? This action cannot be undone.`,
          "warning",
          "Reject Application",
          async () => {
            await rejectApplication(applicationId);
            notifications.show({
              title: "Application Rejected",
              message: `${application.tenant?.firstName} ${application.tenant?.lastName}'s application has been rejected.`,
              color: "green",
            });
            await fetchApplications(pagination.page);
          }
        );
        break;

      case "approve":
        showConfirmation(
          "Approve Application",
          `Are you sure you want to approve ${application.tenant?.firstName} ${application.tenant?.lastName}'s application for ${application.property?.name}?`,
          "success",
          "Approve Application",
          async () => {
            try {
              await approveApplication(applicationId, {
                notes: "Application approved",
              });

              notifications.show({
                title: "Application Approved",
                message: `${application.tenant?.firstName} ${application.tenant?.lastName}'s application has been approved.`,
                color: "green",
              });

              await fetchApplications(pagination.page);
            } catch (error) {
              notifications.show({
                title: "Error",
                message: "Failed to approve application. Please try again.",
                color: "red",
              });
              console.error("Error approving application:", error);
            }
          }
        );
        break;

      default:
        console.log(`Unknown action: ${action} for application: ${applicationId}`);
    }
  };

  const handleTabChange = (value: string | null) => {
    const tabValue = value || "all";
    setActiveTab(tabValue);
    setStatusFilter(tabValue === "all" ? null : tabValue);
  };

  const handleRefresh = () => {
    fetchAll();
  };

  if (loading)
    return <LoadingSpinner fullScreen label="Fetching applications" />;

  return (
    <div className="space-y-6 p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Box>
            <Title order={2} className="text-gray-900">
              Applications Management
            </Title>
            <Text size="sm" c="dimmed">
              Manage and track all property applications
            </Text>
          </Box>
          <Group gap="sm">
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={handleRefresh}
              loading={loading}
              size={isMobile ? "sm" : "md"}
            >
              {isMobile ? "" : "Refresh"}
            </Button>
          </Group>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconUsers size={20} />}
            label="Total Applications"
            value={stats.total}
            change={12}
            changeType="increase"
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconClock size={20} />}
            label="Pending Review"
            value={stats.pending}
            change={5}
            changeType="decrease"
            color="yellow"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconChecks size={20} />}
            label="Approved"
            value={stats.approved}
            change={8}
            changeType="increase"
            color="green"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconClipboardCheck size={20} />}
            label="In Screening"
            value={stats.screening}
            change={3}
            changeType="increase"
            color="orange"
          />
        </Grid.Col>
      </Grid>

      {/* Main Content - Full Width */}
      <div>
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          {/* Filters and Search */}
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Title order={4}>Applications</Title>
              </Group>

              {/* Search Controls */}
              <Group gap="sm" align="flex-end">
                <TextInput
                  placeholder="Search applications..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, minWidth: 200 }}
                  size={isMobile ? "sm" : "md"}
                />
              </Group>

              {/* Status Tabs */}
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tabs.List>
                  <Tabs.Tab value="all">All ({stats.total})</Tabs.Tab>
                  <Tabs.Tab value="received">
                    Received ({stats.received || stats.total})
                  </Tabs.Tab>
                  <Tabs.Tab value="screening">
                    Screening ({stats.screening})
                  </Tabs.Tab>
                  <Tabs.Tab value="approved">
                    Approved ({stats.approved})
                  </Tabs.Tab>
                  <Tabs.Tab value="rejected">
                    Rejected ({stats.rejected})
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </Stack>
          </Card>

          {/* Applications Display */}
          {loading ? (
            <LoadingSpinner label="Fetching Applications" />
          ) : filteredApplications.length > 0 ? (
            <>
              {/* Mobile Card View */}
              {isMobile ? (
                <Stack gap="md">
                  {filteredApplications.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onAction={handleAction}
                    />
                  ))}
                </Stack>
              ) : (
                /* Desktop Table View */
                <Card shadow="sm" padding={0} radius="md" withBorder>
                  <Box style={{ overflowX: "auto" }}>
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Applicant
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Property
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Status
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Date
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((application) => (
                          <ApplicationTableRow
                            key={application.id}
                            application={application}
                            onAction={handleAction}
                          />
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Card>
              )}

              {/* Pagination */}
              <Card padding="lg" radius="md" withBorder mt="md">
                <Pagination.Root
                  total={pagination.pages}
                  onChange={handlePageChange}
                  size={isMobile ? "sm" : "md"}
                >
                  <Group gap={5} justify="center">
                    <Pagination.First />
                    <Pagination.Previous />
                    <Pagination.Items />
                    <Pagination.Next />
                    <Pagination.Last />
                  </Group>
                </Pagination.Root>
              </Card>
            </>
          ) : (
            <EmptyState>
              <div className="text-center py-12">
                <IconFileText
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <Title order={3} className="text-gray-700 mb-2">
                  No Applications Found
                </Title>
                <Text c="dimmed" mb="lg">
                  {searchQuery || statusFilter
                    ? "No applications match your current filters"
                    : "You haven't received any applications yet"}
                </Text>
                {(searchQuery || statusFilter) && (
                  <Button
                    variant="light"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter(null);
                      setActiveTab("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </EmptyState>
          )}
        </Card>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        opened={confirmationModal.opened}
        onClose={() =>
          setConfirmationModal({ ...confirmationModal, opened: false })
        }
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
        loading={actionLoading}
      />
    </div>
  );
}

export default Applications;
