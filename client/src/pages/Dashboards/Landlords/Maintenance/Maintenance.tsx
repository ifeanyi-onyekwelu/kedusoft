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
  IconTool,
  IconCalendar,
  IconDownload,
  IconFilter,
  IconDots,
  IconEdit,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";

interface MaintenanceRequest {
  id: string;
  property_name: string;
  tenant_name?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

function Maintenance() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [opened, setOpened] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    property: "",
    tenant: "",
    title: "",
    description: "",
    priority: "medium",
    scheduledDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: Fetch actual maintenance requests from backend when endpoint is available
      setRequests([]);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load maintenance requests",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    // TODO: Implement actual API call when endpoint is available
    notifications.show({
      title: "Request Created",
      message: "Maintenance request has been created successfully",
      color: "green",
    });
    setOpened(false);
    setFormData({
      property: "",
      tenant: "",
      title: "",
      description: "",
      priority: "medium",
      scheduledDate: "",
    });
  };

  const handleUpdateStatus = (status: string) => {
    // TODO: Implement API call to update status when endpoint is available
    notifications.show({
      title: "Status Updated",
      message: `Maintenance request marked as ${status}`,
      color: "blue",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      case "low":
        return "blue";
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
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "in_progress"
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === "completed"
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Maintenance Requests</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage property maintenance and repair requests
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setOpened(true)}
          >
            Create Request
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
                Pending
              </Text>
              <IconTool size={20} color="#f08c00" />
            </Group>
            <Text size="xl" fw={700}>
              {pendingCount}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Awaiting action
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed" fw={500}>
                In Progress
              </Text>
              <IconTool size={20} color="#1971c2" />
            </Group>
            <Text size="xl" fw={700}>
              {inProgressCount}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Being worked on
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
                Total Requests
              </Text>
              <IconTool size={20} color="#7950f2" />
            </Group>
            <Text size="xl" fw={700}>
              {requests.length}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              All time
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Maintenance Requests Table */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>Maintenance Requests</Title>
          <Button variant="subtle" leftSection={<IconFilter size={18} />}>
            Filter
          </Button>
        </Group>

        {requests.length > 0 ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Property</Table.Th>
                <Table.Th>Issue</Table.Th>
                <Table.Th>Tenant</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {requests.map((request) => (
                <Table.Tr key={request.id}>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(request.created_at).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {request.property_name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={500}>
                        {request.title}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {request.description}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{request.tenant_name || "N/A"}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(request.status)}>
                      {request.status.replace("_", " ")}
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
                          Delete
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
            <IconTool size={48} className="text-gray-400 mb-4" />
            <Text size="lg" fw={600} mb="xs">
              No Maintenance Requests
            </Text>
            <Text size="sm" c="dimmed" mb="lg">
              Create your first maintenance request to get started
            </Text>
            <Button
              leftSection={<IconPlus size={18} />}
              onClick={() => setOpened(true)}
            >
              Create Request
            </Button>
          </EmptyState>
        )}
      </Paper>

      {/* Create Request Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text fw={600}>Create Maintenance Request</Text>}
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Property"
            placeholder="Select property"
            data={[]}
            searchable
            required
            value={formData.property}
            onChange={(value) =>
              setFormData({ ...formData, property: value || "" })
            }
          />

          <Select
            label="Tenant (Optional)"
            placeholder="Select tenant"
            data={[]}
            searchable
            value={formData.tenant}
            onChange={(value) =>
              setFormData({ ...formData, tenant: value || "" })
            }
          />

          <TextInput
            label="Issue Title"
            placeholder="e.g., Leaking faucet in bathroom"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Textarea
            label="Description"
            placeholder="Provide detailed description of the issue"
            rows={4}
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Select
            label="Priority"
            placeholder="Select priority level"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
            required
            value={formData.priority}
            onChange={(value) =>
              setFormData({ ...formData, priority: value || "medium" })
            }
          />

          <TextInput
            label="Scheduled Date (Optional)"
            type="date"
            leftSection={<IconCalendar size={18} />}
            value={formData.scheduledDate}
            onChange={(e) =>
              setFormData({ ...formData, scheduledDate: e.target.value })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest}>Create Request</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default Maintenance;
