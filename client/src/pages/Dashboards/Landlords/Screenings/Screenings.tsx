import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Group,
  Text,
  Badge,
  Button,
  Stack,
  Grid,
  Tabs,
  Alert,
  Modal,
  Textarea,
  Select,
  Table,
  ActionIcon,
  Tooltip,
  Paper,
  Progress,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconEye,
  IconCheck,
  IconX,
  IconClock,
  IconBell,
  IconUser,
  IconHome,
  IconMail,
  IconPhone,
  IconCalendar,
  IconCurrencyDollar,
  IconBriefcase,
  IconFileText,
} from "@tabler/icons-react";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

interface Screening {
  id: string;
  application: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    preferred_move_in: string;
    message: string;
    property: {
      id: string;
      title: string;
      address: string;
      rent: number;
    };
    tenant: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  status: "pending" | "in_progress" | "completed" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  income?: number;
  employment_status?: string;
  previous_rental_history?: string;
  references?: string;
  landlord_notes?: string;
  result?: "approved" | "rejected";
  result_notes?: string;
  completed_at?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "yellow";
    case "in_progress":
      return "blue";
    case "completed":
      return "cyan";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <IconClock size={16} />;
    case "in_progress":
      return <IconBell size={16} />;
    case "completed":
    case "approved":
      return <IconCheck size={16} />;
    case "rejected":
      return <IconX size={16} />;
    default:
      return <IconClock size={16} />;
  }
};

const ScreeningCard: React.FC<{
  screening: Screening;
  onViewDetails: (screening: Screening) => void;
  onReview: (screening: Screening) => void;
}> = ({ screening, onViewDetails, onReview }) => {
  const canReview = screening.status === "completed";

  // Calculate screening completeness score
  const getCompletenessScore = () => {
    const fields = [
      "income",
      "employment_status",
      "previous_rental_history",
      "references",
    ];
    const completedFields = fields.filter(
      (field) => screening[field as keyof Screening]
    );
    return (completedFields.length / fields.length) * 100;
  };

  const completeness = getCompletenessScore();

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" align="center" mb="xs">
              <IconUser size={16} />
              <Text fw={600} size="lg">
                {screening.application.first_name}{" "}
                {screening.application.last_name}
              </Text>
            </Group>

            <Stack gap={4}>
              <Group gap="xs" align="center">
                <IconHome size={14} />
                <Text size="sm" c="dimmed">
                  {screening.application.property.title}
                </Text>
              </Group>

              <Group gap="xs" align="center">
                <IconMail size={14} />
                <Text size="sm" c="dimmed">
                  {screening.application.email}
                </Text>
              </Group>

              <Group gap="xs" align="center">
                <IconCalendar size={14} />
                <Text size="sm" c="dimmed">
                  Applied: {new Date(screening.created_at).toLocaleDateString()}
                </Text>
              </Group>
            </Stack>
          </div>

          <Badge
            color={getStatusColor(screening.status)}
            leftSection={getStatusIcon(screening.status)}
            variant="light"
          >
            {screening.status.replace("_", " ").toUpperCase()}
          </Badge>
        </Group>

        {screening.status === "in_progress" && (
          <div>
            <Text size="sm" fw={500} mb="xs">
              Completion Progress
            </Text>
            <Progress value={completeness} size="sm" />
            <Text size="xs" c="dimmed" mt="xs">
              {completeness.toFixed(0)}% of information provided
            </Text>
          </div>
        )}

        {screening.income && (
          <Group gap="xs" align="center">
            <IconCurrencyDollar size={14} />
            <Text size="sm">
              Income:{" "}
              <Text span fw={500}>
                ${screening.income.toLocaleString()}/month
              </Text>
            </Text>
          </Group>
        )}

        {screening.employment_status && (
          <Group gap="xs" align="center">
            <IconBriefcase size={14} />
            <Text size="sm">
              Employment:{" "}
              <Text span fw={500}>
                {screening.employment_status}
              </Text>
            </Text>
          </Group>
        )}

        {screening.result && (
          <Alert
            color={screening.result === "approved" ? "green" : "red"}
            icon={screening.result === "approved" ? <IconCheck /> : <IconX />}
          >
            <Text fw={500}>
              {screening.result === "approved" ? "Approved" : "Rejected"}
            </Text>
            {screening.result_notes && (
              <Text size="sm" mt="xs">
                {screening.result_notes}
              </Text>
            )}
          </Alert>
        )}

        <Group justify="flex-end" mt="auto">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onViewDetails(screening)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>

          {canReview && (
            <Button
              size="sm"
              leftSection={<IconFileText size={16} />}
              onClick={() => onReview(screening)}
            >
              Review
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

const ScreeningDetailsModal: React.FC<{
  screening: Screening | null;
  opened: boolean;
  onClose: () => void;
}> = ({ screening, opened, onClose }) => {
  if (!screening) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Screening Details - ${screening.application.first_name} ${screening.application.last_name}`}
      size="xl"
    >
      <Stack gap="lg">
        {/* Applicant Information */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Applicant Information
          </Text>
          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Name:
              </Text>
              <Text size="sm" c="dimmed">
                {screening.application.first_name}{" "}
                {screening.application.last_name}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Email:
              </Text>
              <Text size="sm" c="dimmed">
                {screening.application.email}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Phone:
              </Text>
              <Text size="sm" c="dimmed">
                {screening.application.phone}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Preferred Move-in:
              </Text>
              <Text size="sm" c="dimmed">
                {screening.application.preferred_move_in
                  ? new Date(
                      screening.application.preferred_move_in
                    ).toLocaleDateString()
                  : "Not specified"}
              </Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="sm" fw={500}>
                Application Message:
              </Text>
              <Text size="sm" c="dimmed">
                {screening.application.message || "No message provided"}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Property Information */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Property Information
          </Text>
          <Grid>
            <Grid.Col span={8}>
              <Text size="sm" fw={500}>
                Property:
              </Text>
              <Text size="sm" c="dimmed">
                {screening.application.property.title}
              </Text>
              <Text size="xs" c="dimmed">
                {screening.application.property.address}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="sm" fw={500}>
                Rent:
              </Text>
              <Text size="sm" c="dimmed">
                ${screening.application.property.rent}/month
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Screening Information */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Screening Information
          </Text>
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Status:
                </Text>
                <Badge color={getStatusColor(screening.status)} mt="xs">
                  {screening.status.replace("_", " ").toUpperCase()}
                </Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Requested Date:
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {new Date(screening.created_at).toLocaleDateString()}
                </Text>
              </Grid.Col>
            </Grid>

            {screening.income && (
              <div>
                <Text size="sm" fw={500}>
                  Monthly Income:
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  ${screening.income.toLocaleString()}
                </Text>
              </div>
            )}

            {screening.employment_status && (
              <div>
                <Text size="sm" fw={500}>
                  Employment Status:
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {screening.employment_status}
                </Text>
              </div>
            )}

            {screening.previous_rental_history && (
              <div>
                <Text size="sm" fw={500}>
                  Previous Rental History:
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                  mt="xs"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {screening.previous_rental_history}
                </Text>
              </div>
            )}

            {screening.references && (
              <div>
                <Text size="sm" fw={500}>
                  References:
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                  mt="xs"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {screening.references}
                </Text>
              </div>
            )}

            {screening.landlord_notes && (
              <div>
                <Text size="sm" fw={500}>
                  Your Notes:
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                  mt="xs"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {screening.landlord_notes}
                </Text>
              </div>
            )}
          </Stack>
        </Paper>

        {screening.result && (
          <Alert
            color={screening.result === "approved" ? "green" : "red"}
            icon={screening.result === "approved" ? <IconCheck /> : <IconX />}
          >
            <Text fw={500}>
              Screening Result:{" "}
              {screening.result === "approved" ? "Approved" : "Rejected"}
            </Text>
            {screening.result_notes && (
              <Text size="sm" mt="xs">
                {screening.result_notes}
              </Text>
            )}
            {screening.completed_at && (
              <Text size="xs" c="dimmed" mt="xs">
                Completed:{" "}
                {new Date(screening.completed_at).toLocaleDateString()}
              </Text>
            )}
          </Alert>
        )}
      </Stack>
    </Modal>
  );
};

const ReviewScreeningModal: React.FC<{
  screening: Screening | null;
  opened: boolean;
  onClose: () => void;
  onReview: () => void;
}> = ({ screening, opened, onClose, onReview }) => {
  const { reviewScreening } = useLandlordOperations();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"approved" | "rejected">("approved");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (screening) {
      setResult("approved");
      setNotes("");
    }
  }, [screening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screening) return;

    setLoading(true);
    try {
      await reviewScreening(screening.id, { result, notes });
      showNotification({
        title: "Success",
        message: `Screening ${result} successfully`,
        color: "green",
      });
      onReview();
      onClose();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to review screening",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!screening) return null;

  const incomeToRentRatio =
    screening.income && screening.application.property.rent
      ? (screening.income / screening.application.property.rent).toFixed(2)
      : null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Review Screening - ${screening.application.first_name} ${screening.application.last_name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* Quick Assessment */}
          <Paper p="md" withBorder>
            <Text fw={600} mb="md">
              Quick Assessment
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Monthly Income:
                </Text>
                <Text size="sm" c="dimmed">
                  ${screening.income?.toLocaleString() || "Not provided"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Property Rent:
                </Text>
                <Text size="sm" c="dimmed">
                  ${screening.application.property.rent.toLocaleString()}/month
                </Text>
              </Grid.Col>
              {incomeToRentRatio && (
                <Grid.Col span={12}>
                  <Text size="sm" fw={500}>
                    Income-to-Rent Ratio:
                  </Text>
                  <Text
                    size="sm"
                    c={
                      parseFloat(incomeToRentRatio) >= 3
                        ? "green"
                        : parseFloat(incomeToRentRatio) >= 2.5
                        ? "yellow"
                        : "red"
                    }
                    fw={500}
                  >
                    {incomeToRentRatio}:1
                    {parseFloat(incomeToRentRatio) >= 3 && " ✓ Excellent"}
                    {parseFloat(incomeToRentRatio) >= 2.5 &&
                      parseFloat(incomeToRentRatio) < 3 &&
                      " ⚠ Acceptable"}
                    {parseFloat(incomeToRentRatio) < 2.5 &&
                      " ⚠ Below recommended"}
                  </Text>
                </Grid.Col>
              )}
            </Grid>
          </Paper>

          <Select
            label="Review Decision"
            value={result}
            onChange={(value) => setResult(value as "approved" | "rejected")}
            data={[
              { value: "approved", label: "Approve" },
              { value: "rejected", label: "Reject" },
            ]}
            required
          />

          <Textarea
            label="Review Notes"
            placeholder="Add notes about your decision (optional but recommended)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              color={result === "approved" ? "green" : "red"}
            >
              {result === "approved" ? "Approve" : "Reject"} Screening
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const LandlordScreenings: React.FC = () => {
  const { getAllScreenings } = useLandlordOperations();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(
    null
  );
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [reviewOpened, { open: openReview, close: closeReview }] =
    useDisclosure(false);

  const loadScreenings = async () => {
    try {
      setLoading(true);
      const response = await getAllScreenings();
      if (response.success) {
        setScreenings(response.data);
      }
    } catch (error) {
      console.error("Failed to load screenings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreenings();
  }, []);

  const handleViewDetails = (screening: Screening) => {
    setSelectedScreening(screening);
    openDetails();
  };

  const handleReview = (screening: Screening) => {
    setSelectedScreening(screening);
    openReview();
  };

  const handleScreeningReviewed = () => {
    loadScreenings();
  };

  const filterScreenings = (status?: string) => {
    if (!status || status === "all") return screenings;
    return screenings.filter((screening) => screening.status === status);
  };

  const getTabCounts = () => {
    return {
      all: screenings.length,
      pending: screenings.filter((s) => s.status === "pending").length,
      in_progress: screenings.filter((s) => s.status === "in_progress").length,
      completed: screenings.filter((s) => s.status === "completed").length,
      approved: screenings.filter((s) => s.status === "approved").length,
      rejected: screenings.filter((s) => s.status === "rejected").length,
    };
  };

  const getOverviewStats = () => {
    const total = screenings.length;
    const pending = screenings.filter((s) => s.status === "pending").length;
    const inProgress = screenings.filter(
      (s) => s.status === "in_progress"
    ).length;
    const needReview = screenings.filter(
      (s) => s.status === "completed"
    ).length;
    const approved = screenings.filter((s) => s.status === "approved").length;

    return { total, pending, inProgress, needReview, approved };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const tabCounts = getTabCounts();
  const currentScreenings = filterScreenings(
    activeTab === "all" ? undefined : activeTab
  );
  const stats = getOverviewStats();

  return (
    <Container fluid>
      <Stack gap="xl">
        <div>
          <Title order={2}>Screening Management</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Review and manage tenant screening requests for your properties
          </Text>
        </div>

        {/* Overview Stats */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Total Screenings
              </Text>
              <Text fw={700} size="xl">
                {stats.total}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Pending
              </Text>
              <Text fw={700} size="xl" c="yellow">
                {stats.pending}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                In Progress
              </Text>
              <Text fw={700} size="xl" c="blue">
                {stats.inProgress}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Need Review
              </Text>
              <Text fw={700} size="xl" c="cyan">
                {stats.needReview}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Approved
              </Text>
              <Text fw={700} size="xl" c="green">
                {stats.approved}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>

        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value || "all")}
        >
          <Tabs.List>
            <Tabs.Tab value="all">All ({tabCounts.all})</Tabs.Tab>
            <Tabs.Tab value="pending" color="yellow">
              Pending ({tabCounts.pending})
            </Tabs.Tab>
            <Tabs.Tab value="in_progress" color="blue">
              In Progress ({tabCounts.in_progress})
            </Tabs.Tab>
            <Tabs.Tab value="completed" color="cyan">
              Need Review ({tabCounts.completed})
            </Tabs.Tab>
            <Tabs.Tab value="approved" color="green">
              Approved ({tabCounts.approved})
            </Tabs.Tab>
            <Tabs.Tab value="rejected" color="red">
              Rejected ({tabCounts.rejected})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab} pt="md">
            {currentScreenings.length === 0 ? (
              <Card shadow="sm" p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <IconBell size={48} color="#ccc" />
                  <div style={{ textAlign: "center" }}>
                    <Text size="lg" fw={500}>
                      No screenings found
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs">
                      {activeTab === "all"
                        ? "No screening requests have been created yet."
                        : `No screenings with ${activeTab.replace(
                            "_",
                            " "
                          )} status.`}
                    </Text>
                  </div>
                </Stack>
              </Card>
            ) : (
              <Grid>
                {currentScreenings.map((screening) => (
                  <Grid.Col
                    key={screening.id}
                    span={{ base: 12, md: 6, lg: 4 }}
                  >
                    <ScreeningCard
                      screening={screening}
                      onViewDetails={handleViewDetails}
                      onReview={handleReview}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Tabs.Panel>
        </Tabs>

        <ScreeningDetailsModal
          screening={selectedScreening}
          opened={detailsOpened}
          onClose={closeDetails}
        />

        <ReviewScreeningModal
          screening={selectedScreening}
          opened={reviewOpened}
          onClose={closeReview}
          onReview={handleScreeningReviewed}
        />
      </Stack>
    </Container>
  );
};

export default LandlordScreenings;
