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
  Stack,
  ThemeIcon,
  Box,
  useMatches,
  Avatar,
  ActionIcon,
  Tabs,
  Paper,
  Divider,
} from "@mantine/core";
import {
  IconSearch,
  IconRefresh,
  IconEye,
  IconChecks,
  IconClock,
  IconX,
  IconUsers,
  IconClipboardCheck,
  IconFileText,
  IconDotsVertical,
  IconCalendar,
  IconShieldCheck,
} from "@tabler/icons-react";
import EmptyState from "@/components/EmptyState";
import { BrandedLoader } from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useLandlordOperations } from "@/apis/landlordApi";
import { formatDate } from "@/utils/helpers";
import { useLoading } from "@/hooks/useLoading";
import { notifications } from "@mantine/notifications";

type ApplicationWithExtra = Application & {
  [key: string]: any;
}

const StatCard = ({ icon, label, value, change, changeType, color }: any) => (
  <Paper withBorder p="lg" radius="md" bg="white">
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Stack gap={2}>
        <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.5px">
          {label}
        </Text>
        <Text size="xl" fw={800} style={{ lineHeight: 1.2 }}>
          {value.toLocaleString()}
        </Text>
      </Stack>
      <ThemeIcon color={color} variant="light" size={42} radius="md">
        {icon}
      </ThemeIcon>
    </Group>
    {change && (
      <Group gap={6} mt="md">
        <Badge
          size="sm"
          variant="light"
          color={changeType === "increase" ? "green" : "red"}
          radius="sm"
        >
          {changeType === "increase" ? "+" : "-"}
          {change}%
        </Badge>
        <Text size="xs" c="dimmed">
          vs last month
        </Text>
      </Group>
    )}
  </Paper>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    received: "blue",
    screening_invited: "orange",
    screening: "orange",
    screening_completed: "grape",
    accepted: "green",
    rejected: "red",
    lease_created: "teal",
  };

  const labels: Record<string, string> = {
    received: "New",
    screening_invited: "Screening Invited",
    screening: "Screening Invited",
    screening_completed: "Screening Done",
    accepted: "Accepted",
    rejected: "Rejected",
    lease_created: "Lease Active",
  };

  return (
    <Badge
      color={colors[status] || "gray"}
      variant="dot"
      size="sm"
      radius="sm"
      tt="capitalize"
    >
      {labels[status] || status.replace("_", " ")}
    </Badge>
  );
};

const ActionButtons = ({ application, onAction }: any) => {
  return (
    <Group gap="xs" wrap="nowrap">
      <Button
        variant="subtle"
        size="xs"
        color="gray"
        leftSection={<IconEye size={14} />}
        onClick={() => onAction("view", application.id)}
      >
        View
      </Button>

      {/* Logic: received -> invite for screening */}
      {application.status === "received" && (
        <Button
          variant="light"
          size="xs"
          color="orange"
          leftSection={<IconShieldCheck size={14} />}
          onClick={() => onAction("invite", application.id)}
        >
          Invite to Screen
        </Button>
      )}

      {/* Logic: screening_invited -> show status */}
      {application.status === "screening_invited" && (
        <Button
          variant="light"
          size="xs"
          color="gray"
          disabled
          leftSection={<IconClock size={14} />}
        >
          Invited
        </Button>
      )}

      {/* Logic: screening done -> show approve */}
      {application.status === "screening_completed" && (
        <Button
          variant="light"
          size="xs"
          color="green"
          leftSection={<IconChecks size={14} />}
          onClick={() => onAction("approve", application.id)}
        >
          Approve
        </Button>
      )}

      {/* Default dots menu for secondary actions */}
      <Menu position="bottom-end" withinPortal shadow="md">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Manage Application</Menu.Label>
          <Menu.Item
            color="red"
            leftSection={<IconX size={14} />}
            onClick={() => onAction("reject", application.id)}
          >
            Reject Application
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

const ApplicationCard = ({ application, onAction }: any) => (
  <Card withBorder padding="md" radius="md" mb="sm">
    <Group justify="space-between" mb="xs">
      <StatusBadge status={application.status} />
      <Group gap={4} c="dimmed">
        <IconCalendar size={14} />
        <Text size="xs">{formatDate(application.created_at)}</Text>
      </Group>
    </Group>

    <Group gap="sm" mb="md">
      <Avatar color="blue" radius="xl" size="md">
        {application.tenant?.firstName?.[0]}
      </Avatar>
      <Box>
        <Text size="sm" fw={700}>
          {application.tenant?.firstName} {application.tenant?.lastName}
        </Text>
        <Text size="xs" c="dimmed" lineClamp={1}>
          {application.property?.name}
        </Text>
      </Box>
    </Group>

    <Divider mb="md" variant="dashed" />

    <ActionButtons application={application} onAction={onAction} />
  </Card>
);

const ApplicationTableRow = ({ application, onAction }: any) => (
  <Box
    style={(theme) => ({
      display: "grid",
      gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 2fr",
      alignItems: "center",
      padding: "16px",
      borderBottom: `1px solid ${theme.colors.gray[2]}`,
      transition: "background-color 0.2s ease",
      "&:hover": { backgroundColor: theme.colors.gray[0] },
    })}
  >
    <Group gap="sm">
      <Avatar radius="xl" color="blue" variant="light">
        {application.tenant?.firstName?.[0]}
      </Avatar>
      <Box>
        <Text size="sm" fw={600} c="dark.4">
          {application.tenant?.firstName} {application.tenant?.lastName}
        </Text>
        <Text size="xs" c="dimmed">
          {application.tenant?.email}
        </Text>
      </Box>
    </Group>

    <Text size="sm" fw={500} truncate>
      {application.property?.name}
    </Text>

    <StatusBadge status={application.status} />

    <Text size="sm" c="dimmed">
      {formatDate(application.created_at)}
    </Text>

    <Group justify="flex-end">
      <ActionButtons application={application} onAction={onAction} />
    </Group>
  </Box>
);

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithExtra[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithExtra[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    received: 0,
    under_review: 0,
    tour_scheduled: 0,
    accepted: 0,
    rejected: 0,
    screening: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);
  const { loading, withLoading } = useLoading();

  const isMobile = useMatches({ base: true, sm: true, md: false });

  const [confirmationModal, setConfirmationModal] = useState<any>({
    opened: false,
    title: "",
    message: "",
    type: "warning",
    confirmText: "Confirm",
    action: null,
  });

  const {
    getAllApplications,
    getApplicationStats,
    rejectApplication,
    approveApplication,
    inviteForScreening,
  } = useLandlordOperations();

  const fetchApplications = async (page = 1) => {
    const data = await withLoading(
      getAllApplications({
        page,
        limit: pagination.limit,
        status: statusFilter || undefined,
      })
    );

    if (data) {
      setApplications(data.applications || []);
      setFilteredApplications(data.applications || []);
      setPagination({
        page,
        limit: pagination.limit,
        total: data.total || 0,
        pages: data.pages || 1,
      });
    }
  };

  const fetchStats = async () => {
    const response = await getApplicationStats();
    setStats(response);
  };

  const fetchAll = async () => {
    await Promise.all([fetchApplications(), fetchStats()]);
  };

  useEffect(() => {
    let filtered = applications;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.tenant?.firstName?.toLowerCase().includes(query) ||
          app.tenant?.lastName?.toLowerCase().includes(query) ||
          app.tenant?.email?.toLowerCase().includes(query) ||
          app.property?.name?.toLowerCase().includes(query)
      );
    }
    setFilteredApplications(filtered);
  }, [applications, searchQuery]);

  useEffect(() => {
    fetchAll();
  }, [statusFilter]);

  const handlePageChange = (page: number) => fetchApplications(page);

  const handleAction = async (action: string, applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    if (action === "view") {
      navigate(
        `/property-owner/applications/${applicationId}/${app.property_id}`
      );
      return;
    }

    // Dynamic Configuration based on workflow
    const config: Record<string, any> = {
      invite: {
        title: "Invite for Screening",
        message: `Send background check invitation to ${app.tenant?.firstName}?`,
        type: "warning",
        confirmText: "Send Invitation",
        handler: () => inviteForScreening(applicationId),
      },
      approve: {
        title: "Approve Application",
        message: `Are you sure you want to approve ${app.tenant?.firstName}'s application for ${app.property?.name}?`,
        type: "success",
        confirmText: "Approve",
        handler: () =>
          approveApplication(applicationId, {
            notes: "Approved after screening",
          }),
      },
      reject: {
        title: "Reject Application",
        message: `Are you sure you want to decline this application?`,
        type: "danger",
        confirmText: "Reject",
        handler: () => rejectApplication(applicationId),
      },
    };

    const selected = config[action];
    if (!selected) return;

    setConfirmationModal({
      opened: true,
      title: selected.title,
      message: selected.message,
      type: selected.type,
      confirmText: selected.confirmText,
      action: async () => {
        await selected.handler();
        notifications.show({
          title: "Success",
          message: `Application has been updated.`,
          color: "green",
        });
        await fetchAll();
      },
    });
  };

  const handleConfirmAction = async () => {
    if (confirmationModal.action) {
      setActionLoading(true);
      try {
        await confirmationModal.action();
        setConfirmationModal({ ...confirmationModal, opened: false });
      } catch (error) {
        console.error("Action failed:", error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // if (loading || !applications || !applications.length) return <BrandedLoader inDashboard={true} label="Fetching applications..." />

  return (
    <div className="space-y-6 p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <Box>
          <Title order={2} fw={800} c="dark.6">
            Applications
          </Title>
          <Text size="sm" c="dimmed">
            Review and manage incoming tenant applications
          </Text>
        </Box>
        <Button
          leftSection={<IconRefresh size={16} />}
          variant="white"
          onClick={fetchAll}
          loading={loading}
        >
          Refresh
        </Button>
      </Group>

      {/* Stats */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconUsers size={20} />}
            label="Total"
            value={stats.total}
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconClock size={20} />}
            label="New / Pending"
            value={stats.received}
            color="yellow"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconClipboardCheck size={20} />}
            label="In Screening"
            value={stats.screening}
            color="orange"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={<IconChecks size={20} />}
            label="Approved"
            value={stats.accepted}
            color="green"
          />
        </Grid.Col>
      </Grid>

      {/* Main List */}
      <Paper withBorder radius="md" bg="white">
        <Stack gap={0}>
          {/* Toolbar */}
          <Box p="md">
            <Grid align="center">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  placeholder="Search by name, email or property..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Tabs
                  value={activeTab}
                  onChange={(v) => {
                    setActiveTab(v || "all");
                    setStatusFilter(v === "all" ? null : v);
                  }}
                >
                  <Tabs.List
                    justify={isMobile ? "center" : "flex-end"}
                    style={{ borderBottom: "none" }}
                  >
                    <Tabs.Tab value="all">All</Tabs.Tab>
                    <Tabs.Tab value="received">New</Tabs.Tab>
                    <Tabs.Tab value="screening">Screening</Tabs.Tab>
                    <Tabs.Tab value="approved">Approved</Tabs.Tab>
                    <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </Grid.Col>
            </Grid>
          </Box>

          <Divider />

          {/* Content */}
          <Box p={isMobile ? "md" : 0}>
            { filteredApplications.length > 0 ? (
              <>
                {isMobile ? (
                  <Stack gap="sm">
                    {filteredApplications.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        onAction={handleAction}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box style={{ overflowX: "auto" }}>
                    <Box style={{ minWidth: 900 }}>
                      <Box
                        bg="gray.0"
                        style={(theme) => ({
                          display: "grid",
                          gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 2fr",
                          padding: "12px 16px",
                          borderBottom: `1px solid ${theme.colors.gray[2]}`,
                        })}
                      >
                        {[
                          "Applicant",
                          "Property",
                          "Status",
                          "Date",
                          "Actions",
                        ].map((h) => (
                          <Text
                            key={h}
                            size="xs"
                            fw={700}
                            c="dimmed"
                            tt="uppercase"
                            ta={h === "Actions" ? "right" : "left"}
                          >
                            {h}
                          </Text>
                        ))}
                      </Box>
                      {filteredApplications.map((app) => (
                        <ApplicationTableRow
                          key={app.id}
                          application={app}
                          onAction={handleAction}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box py={100}>
                <EmptyState>
                  <Stack align="center" gap="xs">
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      variant="light"
                      color="gray"
                    >
                      <IconFileText size={30} />
                    </ThemeIcon>
                    <Title order={4}>No applications found</Title>
                    <Text c="dimmed" size="sm">
                      Try adjusting your search or filters
                    </Text>
                  </Stack>
                </EmptyState>
              </Box>
            )}
          </Box>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box p="md" style={{ borderTop: "1px solid #eee" }}>
              <Group justify="center">
                <Pagination
                  total={pagination.pages}
                  value={pagination.page}
                  onChange={handlePageChange}
                  radius="md"
                />
              </Group>
            </Box>
          )}
        </Stack>
      </Paper>

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
