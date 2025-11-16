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
  Paper,
  Divider,
  ActionIcon,
  Tooltip,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Timeline,
  List,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import {
  IconFileText,
  IconSignature,
  IconCalendar,
  IconHome,
  IconCurrencyDollar,
  IconUser,
  IconCheck,
  IconClock,
  IconX,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconCircleCheck,
  IconPencil,
  IconDownload,
  IconSend,
} from "@tabler/icons-react";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

interface Lease {
  id: string;
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
    phone: string;
  };
  application_id: string;
  status:
    | "draft"
    | "pending"
    | "signed_by_tenant"
    | "signed_by_landlord"
    | "active"
    | "terminated"
    | "expired";
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  security_deposit: number;
  lease_terms: string;
  special_conditions?: string;
  tenant_signed_at?: string;
  landlord_signed_at?: string;
  tenant_signature?: string;
  landlord_signature?: string;
  created_at: string;
  updated_at: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "gray";
    case "pending":
      return "yellow";
    case "signed_by_tenant":
      return "blue";
    case "signed_by_landlord":
      return "cyan";
    case "active":
      return "green";
    case "terminated":
      return "red";
    case "expired":
      return "gray";
    default:
      return "gray";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "draft":
      return <IconEdit size={16} />;
    case "pending":
      return <IconClock size={16} />;
    case "signed_by_tenant":
    case "signed_by_landlord":
      return <IconPencil size={16} />;
    case "active":
      return <IconCheck size={16} />;
    case "terminated":
      return <IconX size={16} />;
    case "expired":
      return <IconAlertCircle size={16} />;
    default:
      return <IconClock size={16} />;
  }
};

const LeaseCard: React.FC<{
  lease: Lease;
  onViewDetails: (lease: Lease) => void;
  onEdit: (lease: Lease) => void;
  onSign: (lease: Lease) => void;
  onTerminate: (lease: Lease) => void;
}> = ({ lease, onViewDetails, onEdit, onSign, onTerminate }) => {
  const canEdit = lease.status === "draft";
  const canSign =
    lease.status === "pending" || lease.status === "signed_by_tenant";
  const canTerminate = lease.status === "active";
  const isActive = lease.status === "active";

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" align="center" mb="xs">
              <IconHome size={16} />
              <Text fw={600} size="lg">
                {lease.property.title}
              </Text>
            </Group>

            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                {lease.property.address}
              </Text>

              <Group gap="xs" align="center">
                <IconUser size={14} />
                <Text size="sm" c="dimmed">
                  Tenant: {lease.tenant.first_name} {lease.tenant.last_name}
                </Text>
              </Group>

              <Group gap="xs" align="center">
                <IconCurrencyDollar size={14} />
                <Text size="sm" c="dimmed">
                  Rent: ${lease.monthly_rent.toLocaleString()}/month
                </Text>
              </Group>

              <Group gap="xs" align="center">
                <IconCalendar size={14} />
                <Text size="sm" c="dimmed">
                  {new Date(lease.lease_start_date).toLocaleDateString()} -{" "}
                  {new Date(lease.lease_end_date).toLocaleDateString()}
                </Text>
              </Group>
            </Stack>
          </div>

          <Badge
            color={getStatusColor(lease.status)}
            leftSection={getStatusIcon(lease.status)}
            variant="light"
          >
            {lease.status.replace("_", " ").toUpperCase()}
          </Badge>
        </Group>

        {isActive && (
          <Alert color="green" icon={<IconCircleCheck />}>
            This lease is currently active and generating rental income.
          </Alert>
        )}

        {lease.status === "draft" && (
          <Alert color="gray" icon={<IconEdit />}>
            Draft lease - needs to be finalized and sent to tenant.
          </Alert>
        )}

        {lease.status === "signed_by_tenant" && (
          <Alert color="blue" icon={<IconPencil />}>
            Tenant has signed. Your signature is needed to activate the lease.
          </Alert>
        )}

        <Group justify="flex-end" mt="auto">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => onViewDetails(lease)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>

          {canEdit && (
            <Tooltip label="Edit Lease">
              <ActionIcon
                variant="light"
                color="yellow"
                onClick={() => onEdit(lease)}
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {canSign && (
            <Button
              size="sm"
              leftSection={<IconSignature size={16} />}
              onClick={() => onSign(lease)}
            >
              Sign Lease
            </Button>
          )}

          {canTerminate && (
            <Button
              size="sm"
              color="red"
              variant="outline"
              leftSection={<IconX size={16} />}
              onClick={() => onTerminate(lease)}
            >
              Terminate
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

const CreateLeaseModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  onCreate: () => void;
  applications: any[];
}> = ({ opened, onClose, onCreate, applications }) => {
  const { createLease } = useLandlordOperations();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      application_id: "",
      lease_start_date: null as Date | null,
      lease_end_date: null as Date | null,
      monthly_rent: 0,
      security_deposit: 0,
      lease_terms: `RESIDENTIAL LEASE AGREEMENT

This lease agreement is entered into between the Landlord and Tenant for the rental of the above-mentioned property.

TERMS AND CONDITIONS:

1. RENT: The monthly rent is as specified above, due on the first day of each month.

2. SECURITY DEPOSIT: A security deposit as specified above is required before move-in.

3. LEASE DURATION: This lease is for the term specified above.

4. USE OF PREMISES: The property shall be used solely as a private residence.

5. MAINTENANCE: Tenant agrees to maintain the property in good condition.

6. UTILITIES: Tenant is responsible for all utilities unless otherwise specified.

7. NO PETS: No pets allowed without written permission from Landlord.

8. ALTERATIONS: No alterations or improvements without Landlord's written consent.

9. TERMINATION: Either party may terminate with proper notice as required by law.

10. GOVERNING LAW: This lease is governed by local rental laws and regulations.`,
      special_conditions: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (
      !values.application_id ||
      !values.lease_start_date ||
      !values.lease_end_date
    ) {
      showNotification({
        title: "Error",
        message: "Please fill in all required fields",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      await createLease(values.application_id, {
        ...values,
        lease_start_date: values.lease_start_date,
        lease_end_date: values.lease_end_date,
      });
      showNotification({
        title: "Success",
        message: "Lease agreement created successfully",
        color: "green",
      });
      onCreate();
      onClose();
      form.reset();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to create lease agreement",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Lease Agreement"
      size="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Application"
            placeholder="Select approved application"
            data={applications.map((app) => ({
              value: app.id,
              label: `${app.tenant?.firstName} ${app.tenant?.lastName} - ${app.property?.name}`,
            }))}
            {...form.getInputProps("application_id")}
            required
          />

          <Group grow>
            <TextInput
              label="Lease Start Date"
              placeholder="YYYY-MM-DD"
              type="date"
              {...form.getInputProps("lease_start_date")}
              required
            />
            <TextInput
              label="Lease End Date"
              placeholder="YYYY-MM-DD"
              type="date"
              {...form.getInputProps("lease_end_date")}
              required
            />
          </Group>

          <Group grow>
            <NumberInput
              label="Monthly Rent"
              placeholder="Enter monthly rent amount"
              leftSection="$"
              thousandSeparator=","
              {...form.getInputProps("monthly_rent")}
              required
            />
            <NumberInput
              label="Security Deposit"
              placeholder="Enter security deposit amount"
              leftSection="$"
              thousandSeparator=","
              {...form.getInputProps("security_deposit")}
              required
            />
          </Group>

          <Textarea
            label="Lease Terms & Conditions"
            placeholder="Enter lease terms and conditions"
            {...form.getInputProps("lease_terms")}
            rows={10}
            required
          />

          <Textarea
            label="Special Conditions (Optional)"
            placeholder="Enter any special conditions or requirements"
            {...form.getInputProps("special_conditions")}
            rows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Lease Agreement
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const LeaseDetailsModal: React.FC<{
  lease: Lease | null;
  opened: boolean;
  onClose: () => void;
}> = ({ lease, opened, onClose }) => {
  if (!lease) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Lease Agreement - ${lease.property.title}`}
      size="xl"
    >
      <Stack gap="lg">
        {/* Property & Tenant Information */}
        <Grid>
          <Grid.Col span={6}>
            <Paper p="md" withBorder>
              <Text fw={600} mb="md">
                Property Information
              </Text>
              <Text size="sm" fw={500}>
                Property:
              </Text>
              <Text size="sm" c="dimmed" mb="xs">
                {lease.property.title}
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                {lease.property.address}
              </Text>

              <Text size="sm" fw={500}>
                Monthly Rent:
              </Text>
              <Text size="sm" c="dimmed" fw={600}>
                ${lease.monthly_rent.toLocaleString()}
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper p="md" withBorder>
              <Text fw={600} mb="md">
                Tenant Information
              </Text>
              <Text size="sm" fw={500}>
                Name:
              </Text>
              <Text size="sm" c="dimmed" mb="xs">
                {lease.tenant.first_name} {lease.tenant.last_name}
              </Text>

              <Text size="sm" fw={500}>
                Email:
              </Text>
              <Text size="sm" c="dimmed" mb="xs">
                {lease.tenant.email}
              </Text>

              <Text size="sm" fw={500}>
                Phone:
              </Text>
              <Text size="sm" c="dimmed">
                {lease.tenant.phone}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Lease Details */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Lease Details
          </Text>
          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Security Deposit:
              </Text>
              <Text size="sm" c="dimmed">
                ${lease.security_deposit.toLocaleString()}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Lease Duration:
              </Text>
              <Text size="sm" c="dimmed">
                {new Date(lease.lease_start_date).toLocaleDateString()} -{" "}
                {new Date(lease.lease_end_date).toLocaleDateString()}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Lease Terms */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Lease Terms & Conditions
          </Text>
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {lease.lease_terms}
          </Text>
          {lease.special_conditions && (
            <>
              <Divider my="md" />
              <Text fw={500} size="sm" mb="xs">
                Special Conditions:
              </Text>
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {lease.special_conditions}
              </Text>
            </>
          )}
        </Paper>

        {/* Signature Status */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Signature Status
          </Text>
          <Timeline
            active={
              lease.status === "active"
                ? 2
                : lease.status === "signed_by_tenant" ||
                  lease.status === "signed_by_landlord"
                ? 1
                : 0
            }
          >
            <Timeline.Item
              bullet={<IconPencil size={12} />}
              title="Landlord Signature"
              color={lease.landlord_signed_at ? "green" : "gray"}
            >
              {lease.landlord_signed_at ? (
                <Text size="sm" c="dimmed">
                  Signed on{" "}
                  {new Date(lease.landlord_signed_at).toLocaleString()}
                </Text>
              ) : (
                <Text size="sm" c="dimmed">
                  Pending signature
                </Text>
              )}
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconPencil size={12} />}
              title="Tenant Signature"
              color={lease.tenant_signed_at ? "green" : "gray"}
            >
              {lease.tenant_signed_at ? (
                <Text size="sm" c="dimmed">
                  Signed on {new Date(lease.tenant_signed_at).toLocaleString()}
                </Text>
              ) : (
                <Text size="sm" c="dimmed">
                  Pending signature
                </Text>
              )}
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconCheck size={12} />}
              title="Lease Activated"
              color={lease.status === "active" ? "green" : "gray"}
            >
              {lease.status === "active" ? (
                <Text size="sm" c="dimmed">
                  Lease is now active
                </Text>
              ) : (
                <Text size="sm" c="dimmed">
                  Waiting for both signatures
                </Text>
              )}
            </Timeline.Item>
          </Timeline>
        </Paper>
      </Stack>
    </Modal>
  );
};

const SignLeaseModal: React.FC<{
  lease: Lease | null;
  opened: boolean;
  onClose: () => void;
  onSign: () => void;
}> = ({ lease, opened, onClose, onSign }) => {
  const { signLeaseAsLandlord } = useLandlordOperations();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lease || !signature.trim()) {
      showNotification({
        title: "Error",
        message: "Please provide your signature",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      await signLeaseAsLandlord(lease.id, signature.trim());
      showNotification({
        title: "Success",
        message: "Lease signed successfully",
        color: "green",
      });
      onSign();
      onClose();
      setSignature("");
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to sign lease",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!lease) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Sign Lease - ${lease.property.title}`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Alert color="blue" icon={<IconAlertCircle />}>
            By signing this lease as the landlord, you confirm that you agree to
            all terms and conditions and authorize the tenant to occupy the
            property according to the lease agreement.
          </Alert>

          <div>
            <Text fw={500} mb="xs">
              Digital Signature
            </Text>
            <Textarea
              placeholder="Type your full legal name as your digital signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              required
              minRows={2}
            />
            <Text size="xs" c="dimmed" mt="xs">
              Your typed name serves as your legal digital signature
            </Text>
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="green">
              Sign Lease Agreement
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const LandlordLeases: React.FC = () => {
  const { getAllLeases, getAllApplications } = useLandlordOperations();
  const [leases, setLeases] = useState<Lease[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [signOpened, { open: openSign, close: closeSign }] =
    useDisclosure(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leasesResponse, applicationsResponse] = await Promise.all([
        getAllLeases(),
        getAllApplications({ status: "approved" }),
      ]);

      if (leasesResponse.success) {
        setLeases(leasesResponse.data?.leases || []);
      }

      if (applicationsResponse.success) {
        setApplications(applicationsResponse.data?.applications || []);
      }
    } catch (error) {
      console.error("Failed to load lease data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetails = (lease: Lease) => {
    setSelectedLease(lease);
    openDetails();
  };

  const handleEdit = (lease: Lease) => {
    // TODO: Implement edit functionality
    showNotification({
      title: "Info",
      message: "Edit functionality coming soon",
      color: "blue",
    });
  };

  const handleSign = (lease: Lease) => {
    setSelectedLease(lease);
    openSign();
  };

  const handleTerminate = (lease: Lease) => {
    // TODO: Implement terminate functionality
    showNotification({
      title: "Info",
      message: "Terminate functionality coming soon",
      color: "blue",
    });
  };

  const handleLeaseCreated = () => {
    loadData();
  };

  const handleLeaseSigned = () => {
    loadData();
  };

  const filterLeases = (status?: string) => {
    if (!status || status === "all") return leases;
    return leases.filter((lease) => lease.status === status);
  };

  const getTabCounts = () => {
    return {
      all: leases.length,
      draft: leases.filter((l) => l.status === "draft").length,
      pending: leases.filter((l) => l.status === "pending").length,
      signed_by_tenant: leases.filter((l) => l.status === "signed_by_tenant")
        .length,
      active: leases.filter((l) => l.status === "active").length,
      terminated: leases.filter((l) => l.status === "terminated").length,
    };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const tabCounts = getTabCounts();
  const currentLeases = filterLeases(
    activeTab === "all" ? undefined : activeTab
  );

  return (
    <Container fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>Lease Management</Title>
            <Text c="dimmed" size="sm" mt="xs">
              Create and manage lease agreements for your properties
            </Text>
          </div>
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Create Lease Agreement
          </Button>
        </Group>

        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value || "all")}
        >
          <Tabs.List>
            <Tabs.Tab value="all">All ({tabCounts.all})</Tabs.Tab>
            <Tabs.Tab value="draft" color="gray">
              Drafts ({tabCounts.draft})
            </Tabs.Tab>
            <Tabs.Tab value="pending" color="yellow">
              Pending ({tabCounts.pending})
            </Tabs.Tab>
            <Tabs.Tab value="signed_by_tenant" color="blue">
              Need My Signature ({tabCounts.signed_by_tenant})
            </Tabs.Tab>
            <Tabs.Tab value="active" color="green">
              Active ({tabCounts.active})
            </Tabs.Tab>
            <Tabs.Tab value="terminated" color="red">
              Terminated ({tabCounts.terminated})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab} pt="md">
            {currentLeases.length === 0 ? (
              <Card shadow="sm" p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <IconFileText size={48} color="#ccc" />
                  <div style={{ textAlign: "center" }}>
                    <Text size="lg" fw={500}>
                      No lease agreements found
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs">
                      {activeTab === "all"
                        ? "Create your first lease agreement to get started."
                        : `No leases with ${activeTab.replace(
                            "_",
                            " "
                          )} status.`}
                    </Text>
                    {activeTab === "all" && (
                      <Button
                        mt="md"
                        leftSection={<IconPlus size={16} />}
                        onClick={openCreate}
                      >
                        Create Lease Agreement
                      </Button>
                    )}
                  </div>
                </Stack>
              </Card>
            ) : (
              <Grid>
                {currentLeases.map((lease) => (
                  <Grid.Col key={lease.id} span={{ base: 12, md: 6, lg: 4 }}>
                    <LeaseCard
                      lease={lease}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onSign={handleSign}
                      onTerminate={handleTerminate}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Tabs.Panel>
        </Tabs>

        <CreateLeaseModal
          opened={createOpened}
          onClose={closeCreate}
          onCreate={handleLeaseCreated}
          applications={applications}
        />

        <LeaseDetailsModal
          lease={selectedLease}
          opened={detailsOpened}
          onClose={closeDetails}
        />

        <SignLeaseModal
          lease={selectedLease}
          opened={signOpened}
          onClose={closeSign}
          onSign={handleLeaseSigned}
        />
      </Stack>
    </Container>
  );
};

export default LandlordLeases;
