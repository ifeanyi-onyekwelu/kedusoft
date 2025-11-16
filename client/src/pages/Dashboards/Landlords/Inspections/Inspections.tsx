import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Table,
  Badge,
  Modal,
  TextInput,
  Select,
  Textarea,
  Stack,
  Grid,
  Card,
  ActionIcon,
  Menu,
} from "@mantine/core";
import {
  IconPlus,
  IconCalendar,
  IconDownload,
  IconFilter,
  IconDots,
  IconEdit,
  IconTrash,
  IconCheck,
  IconEye,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";

interface Inspection {
  id: string;
  property_name: string;
  property_address: string;
  inspector_name?: string;
  inspection_type: "move_in" | "move_out" | "routine" | "maintenance";
  scheduled_date: string;
  scheduled_time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
}

function Inspections() {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [opened, setOpened] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    property: "",
    inspectorName: "",
    inspectionType: "routine",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: Fetch actual inspections from backend when endpoint is available
      setInspections([]);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load inspections",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInspection = async () => {
    // TODO: Implement actual API call when endpoint is available
    notifications.show({
      title: "Inspection Scheduled",
      message: "Property inspection has been scheduled successfully",
      color: "green",
    });
    setOpened(false);
    setFormData({
      property: "",
      inspectorName: "",
      inspectionType: "routine",
      scheduledDate: "",
      scheduledTime: "",
      notes: "",
    });
  };

  const handleUpdateStatus = (status: string) => {
    notifications.show({
      title: "Status Updated",
      message: `Inspection marked as ${status}`,
      color: "blue",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "move_in":
        return "green";
      case "move_out":
        return "orange";
      case "routine":
        return "blue";
      case "maintenance":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "in_progress":
        return "blue";
      case "scheduled":
        return "cyan";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const scheduledCount = inspections.filter(
    (i) => i.status === "scheduled"
  ).length;
  const completedCount = inspections.filter(
    (i) => i.status === "completed"
  ).length;
  const upcomingCount = inspections.filter((i) => {
    const inspectionDate = new Date(i.scheduled_date);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return (
      inspectionDate >= today &&
      inspectionDate <= nextWeek &&
      i.status === "scheduled"
    );
  }).length;

  return (
    <div className="p-6">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Property Inspections</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Schedule and manage property inspection visits
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setOpened(true)}
          >
            Schedule Inspection
          </Button>
          <Button variant="light" leftSection={<IconDownload size={18} />}>
            Export
          </Button>
        </Group>
      </Group>

      {/* Summary Cards */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Upcoming
              </Text>
              <IconCalendar size={20} color="#1971c2" />
            </Group>
            <Text size="xl" fw={700}>
              {upcomingCount}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Next 7 days
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Scheduled
              </Text>
              <IconCalendar size={20} color="#0c8599" />
            </Group>
            <Text size="xl" fw={700}>
              {scheduledCount}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Awaiting visit
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Completed
              </Text>
              <IconCheck size={20} color="#2f9e44" />
            </Group>
            <Text size="xl" fw={700}>
              {completedCount}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              This month
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                Total Inspections
              </Text>
              <IconEye size={20} color="#7950f2" />
            </Group>
            <Text size="xl" fw={700}>
              {inspections.length}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              All time
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Inspections Table */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Scheduled Inspections</Title>
          <Button variant="subtle" leftSection={<IconFilter size={18} />}>
            Filter
          </Button>
        </Group>

        {inspections.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>Property</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Inspector</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {inspections.map((inspection) => (
                <Table.Tr key={inspection.id}>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {new Date(
                          inspection.scheduled_date
                        ).toLocaleDateString()}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {inspection.scheduled_time}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {inspection.property_name}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {inspection.property_address}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getTypeColor(inspection.inspection_type)}>
                      {inspection.inspection_type.replace("_", " ")}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {inspection.inspector_name || "Not assigned"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(inspection.status)}>
                      {inspection.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEye size={16} />}>
                          View Details
                        </Menu.Item>
                        <Menu.Item leftSection={<IconEdit size={16} />}>
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconCheck size={16} />}
                          onClick={() => handleUpdateStatus("completed")}
                        >
                          Mark as Completed
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={16} />}
                        >
                          Cancel
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <EmptyState>
            <IconCalendar size={48} className="text-gray-400 mb-4" />
            <Text size="lg" fw={600} mb="xs">
              No Inspections Scheduled
            </Text>
            <Text size="sm" c="dimmed" mb="lg">
              Schedule your first property inspection to get started
            </Text>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setOpened(true)}
            >
              Schedule Inspection
            </Button>
          </EmptyState>
        )}
      </Paper>

      {/* Schedule Inspection Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text fw={600}>Schedule Property Inspection</Text>}
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Property"
            placeholder="Select property to inspect"
            data={[]}
            searchable
            required
            value={formData.property}
            onChange={(value) =>
              setFormData({ ...formData, property: value || "" })
            }
          />

          <Select
            label="Inspection Type"
            placeholder="Select inspection type"
            data={[
              { value: "move_in", label: "Move-In Inspection" },
              { value: "move_out", label: "Move-Out Inspection" },
              { value: "routine", label: "Routine Inspection" },
              { value: "maintenance", label: "Maintenance Inspection" },
            ]}
            required
            value={formData.inspectionType}
            onChange={(value) =>
              setFormData({ ...formData, inspectionType: value || "routine" })
            }
          />

          <TextInput
            label="Inspector Name (Optional)"
            placeholder="Name of the inspector"
            value={formData.inspectorName}
            onChange={(e) =>
              setFormData({ ...formData, inspectorName: e.target.value })
            }
          />

          <TextInput
            label="Inspection Date"
            type="date"
            leftSection={<IconCalendar size={18} />}
            required
            value={formData.scheduledDate}
            onChange={(e) =>
              setFormData({ ...formData, scheduledDate: e.target.value })
            }
          />

          <TextInput
            label="Inspection Time"
            type="time"
            required
            value={formData.scheduledTime}
            onChange={(e) =>
              setFormData({ ...formData, scheduledTime: e.target.value })
            }
          />

          <Textarea
            label="Notes (Optional)"
            placeholder="Any additional notes or instructions"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleInspection}>
              Schedule Inspection
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default Inspections;
