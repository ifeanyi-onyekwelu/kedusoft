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
  Progress,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  FileInput,
  Notification,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconBell,
  IconCheck,
  IconClock,
  IconX,
  IconEye,
  IconUpload,
} from "@tabler/icons-react";
import { useTenantOperations } from "../../../../apis/tenantApi";
import { BrandedLoader } from "../../../../components/LoadingSpinner";

interface Screening {
  id: string;
  application: {
    id: string;
    property: {
      title: string;
      address: string;
    };
    landlord: {
      first_name: string;
      last_name: string;
    };
  };
  status: "pending" | "in_progress" | "completed" | "approved" | "rejected";
  created_at: string;
  requested_date?: string;
  income?: number;
  employment_status?: string;
  previous_rental_history?: string;
  references?: string;
  landlord_notes?: string;
  result?: "approved" | "rejected";
  result_notes?: string;
  completed_at?: string;
}

interface ScreeningFormData {
  income?: number;
  employment_status?: string;
  previous_rental_history?: string;
  references?: string;
  additional_documents?: File[];
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
  onUpdateScreening: (screening: Screening) => void;
}> = ({ screening, onViewDetails, onUpdateScreening }) => {
  const canUpdate =
    screening.status === "pending" || screening.status === "in_progress";

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Text fw={600} size="lg">
              {screening.application.property.title}
            </Text>
            <Text size="sm" c="dimmed">
              {screening.application.property.address}
            </Text>
            <Text size="sm" c="dimmed">
              Landlord: {screening.application.landlord.first_name}{" "}
              {screening.application.landlord.last_name}
            </Text>
          </div>
          <Badge
            color={getStatusColor(screening.status)}
            leftSection={getStatusIcon(screening.status)}
            variant="light"
          >
            {screening.status.replace("_", " ").toUpperCase()}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Screening requested:{" "}
          {new Date(screening.created_at).toLocaleDateString()}
        </Text>

        {screening.status === "completed" && screening.result && (
          <Alert
            color={screening.result === "approved" ? "green" : "red"}
            icon={screening.result === "approved" ? <IconCheck /> : <IconX />}
          >
            Screening{" "}
            {screening.result === "approved" ? "Approved" : "Rejected"}
            {screening.result_notes && (
              <Text size="sm" mt="xs">
                {screening.result_notes}
              </Text>
            )}
          </Alert>
        )}

        {screening.status === "pending" && (
          <Alert color="yellow" icon={<IconBell />}>
            Please complete your screening information to proceed with your
            application.
          </Alert>
        )}

        <Group justify="flex-end">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onViewDetails(screening)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>

          {canUpdate && (
            <Button
              size="sm"
              leftSection={<IconUpload size={16} />}
              onClick={() => onUpdateScreening(screening)}
            >
              Update Info
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
      title={`Screening Details - ${screening.application.property.title}`}
      size="lg"
    >
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

        <div>
          <Text size="sm" fw={500}>
            Property:
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            {screening.application.property.title}
          </Text>
          <Text size="xs" c="dimmed">
            {screening.application.property.address}
          </Text>
        </div>

        <div>
          <Text size="sm" fw={500}>
            Landlord:
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            {screening.application.landlord.first_name}{" "}
            {screening.application.landlord.last_name}
          </Text>
        </div>

        {screening.income && (
          <div>
            <Text size="sm" fw={500}>
              Income:
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              ${screening.income.toLocaleString()} per month
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
            <Text size="sm" c="dimmed" mt="xs">
              {screening.previous_rental_history}
            </Text>
          </div>
        )}

        {screening.references && (
          <div>
            <Text size="sm" fw={500}>
              References:
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              {screening.references}
            </Text>
          </div>
        )}

        {screening.landlord_notes && (
          <div>
            <Text size="sm" fw={500}>
              Landlord Notes:
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              {screening.landlord_notes}
            </Text>
          </div>
        )}

        {screening.result_notes && (
          <Alert
            color={screening.result === "approved" ? "green" : "red"}
            icon={screening.result === "approved" ? <IconCheck /> : <IconX />}
          >
            <Text fw={500}>
              {screening.result === "approved" ? "Approved" : "Rejected"}
            </Text>
            <Text size="sm" mt="xs">
              {screening.result_notes}
            </Text>
          </Alert>
        )}
      </Stack>
    </Modal>
  );
};

const UpdateScreeningModal: React.FC<{
  screening: Screening | null;
  opened: boolean;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ screening, opened, onClose, onUpdate }) => {
  const { updateScreening } = useTenantOperations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ScreeningFormData>({
    income: screening?.income || undefined,
    employment_status: screening?.employment_status || "",
    previous_rental_history: screening?.previous_rental_history || "",
    references: screening?.references || "",
    additional_documents: [],
  });

  useEffect(() => {
    if (screening) {
      setFormData({
        income: screening.income || undefined,
        employment_status: screening.employment_status || "",
        previous_rental_history: screening.previous_rental_history || "",
        references: screening.references || "",
        additional_documents: [],
      });
    }
  }, [screening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screening) return;

    setLoading(true);
    try {
      await updateScreening(screening.id, formData);
      showNotification({
        title: "Success",
        message: "Screening information updated successfully",
        color: "green",
      });
      onUpdate();
      onClose();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to update screening information",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!screening) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Update Screening - ${screening.application.property.title}`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <NumberInput
            label="Monthly Income"
            placeholder="Enter your monthly income"
            value={formData.income}
            onChange={(value) =>
              setFormData({
                ...formData,
                income: typeof value === "number" ? value : undefined,
              })
            }
            leftSection="$"
            thousandSeparator=","
            required
          />

          <TextInput
            label="Employment Status"
            placeholder="e.g., Full-time, Part-time, Self-employed"
            value={formData.employment_status}
            onChange={(e) =>
              setFormData({ ...formData, employment_status: e.target.value })
            }
            required
          />

          <Textarea
            label="Previous Rental History"
            placeholder="Describe your previous rental experience, including landlord references"
            value={formData.previous_rental_history}
            onChange={(e) =>
              setFormData({
                ...formData,
                previous_rental_history: e.target.value,
              })
            }
            rows={4}
            required
          />

          <Textarea
            label="References"
            placeholder="Provide contact information for references (employers, previous landlords, etc.)"
            value={formData.references}
            onChange={(e) =>
              setFormData({ ...formData, references: e.target.value })
            }
            rows={4}
            required
          />

          <FileInput
            label="Additional Documents"
            placeholder="Upload additional documents (pay stubs, employment letter, etc.)"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            value={formData.additional_documents}
            onChange={(files) =>
              setFormData({ ...formData, additional_documents: files || [] })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Update Screening
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const TenantScreenings: React.FC = () => {
  const { getAllScreenings, getScreeningNotifications } = useTenantOperations();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(
    null
  );
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);

  const loadScreenings = async () => {
    try {
      setLoading(true);
      const [screeningsData, notificationsData] = await Promise.all([
        getAllScreenings(),
        getScreeningNotifications(),
      ]);

      if (screeningsData.success) {
        setScreenings(screeningsData.data);
      }

      if (notificationsData.success) {
        setNotifications(notificationsData.data);
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

  const handleUpdateScreening = (screening: Screening) => {
    setSelectedScreening(screening);
    openUpdate();
  };

  const handleScreeningUpdated = () => {
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

  if (loading) {
    return <BrandedLoader />;
  }

  const tabCounts = getTabCounts();
  const currentScreenings = filterScreenings(
    activeTab === "all" ? undefined : activeTab
  );

  return (
    <Container fluid>
      <Stack gap="xl">
        <div>
          <Title order={2}>Screening Management</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Manage your property screening requests and provide required
            information
          </Text>
        </div>

        {notifications.length > 0 && (
          <Stack gap="sm">
            {notifications.map((notification, index) => (
              <Notification
                key={index}
                icon={<IconBell />}
                title="Screening Update"
                onClose={() => {
                  setNotifications((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              >
                {notification.message}
              </Notification>
            ))}
          </Stack>
        )}

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
              Completed ({tabCounts.completed})
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
                        ? "You haven't received any screening requests yet."
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
                      onUpdateScreening={handleUpdateScreening}
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

        <UpdateScreeningModal
          screening={selectedScreening}
          opened={updateOpened}
          onClose={closeUpdate}
          onUpdate={handleScreeningUpdated}
        />
      </Stack>
    </Container>
  );
};

export default TenantScreenings;
