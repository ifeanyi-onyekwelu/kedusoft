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
  FileInput,
  Textarea,
  ThemeIcon,
  Timeline,
  Box,
  List,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
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
  IconDownload,
  IconUpload,
  IconEye,
  IconAlertCircle,
  IconCircleCheck,
  IconPencil,
} from "@tabler/icons-react";
import { useTenantOperations } from "../../../../apis/tenantApi";
import { BrandedLoader } from "../../../../components/LoadingSpinner";

interface Lease {
  id: string;
  property: {
    id: string;
    title: string;
    address: string;
    rent: number;
    landlord: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
  status:
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
  onSign: (lease: Lease) => void;
}> = ({ lease, onViewDetails, onSign }) => {
  const canSign =
    lease.status === "pending" || lease.status === "signed_by_landlord";
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
                  Landlord: {lease.property.landlord.first_name}{" "}
                  {lease.property.landlord.last_name}
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
            This lease is currently active. You are renting this property.
          </Alert>
        )}

        {lease.status === "pending" && (
          <Alert color="yellow" icon={<IconAlertCircle />}>
            Lease agreement is ready for your signature.
          </Alert>
        )}

        {lease.status === "signed_by_landlord" && (
          <Alert color="blue" icon={<IconPencil />}>
            Landlord has signed. Your signature is needed to activate the lease.
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

          {canSign && (
            <Button
              size="sm"
              leftSection={<IconSignature size={16} />}
              onClick={() => onSign(lease)}
            >
              Sign Lease
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
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
                {lease.property.title}
              </Text>
              <Text size="xs" c="dimmed">
                {lease.property.address}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="sm" fw={500}>
                Monthly Rent:
              </Text>
              <Text size="sm" c="dimmed" fw={600}>
                ${lease.monthly_rent.toLocaleString()}
              </Text>
            </Grid.Col>
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

        {/* Landlord Information */}
        <Paper p="md" withBorder>
          <Text fw={600} mb="md">
            Landlord Information
          </Text>
          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Name:
              </Text>
              <Text size="sm" c="dimmed">
                {lease.property.landlord.first_name}{" "}
                {lease.property.landlord.last_name}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Email:
              </Text>
              <Text size="sm" c="dimmed">
                {lease.property.landlord.email}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500}>
                Phone:
              </Text>
              <Text size="sm" c="dimmed">
                {lease.property.landlord.phone}
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
  const { signLease } = useTenantOperations();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);

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
      await signLease(lease.id, signature.trim());
      showNotification({
        title: "Success",
        message: "Lease signed successfully",
        color: "green",
      });
      onSign();
      onClose();
      setSignature("");
      setAdditionalDocuments([]);
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
            By signing this lease, you agree to all terms and conditions
            outlined in the lease agreement. Please review the document
            carefully before proceeding.
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

          <FileInput
            label="Additional Documents (Optional)"
            placeholder="Upload any additional documents"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            value={additionalDocuments}
            onChange={setAdditionalDocuments}
          />

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

const TenantLeases: React.FC = () => {
  const { getAllLeases } = useTenantOperations();
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [signOpened, { open: openSign, close: closeSign }] =
    useDisclosure(false);

  const loadLeases = async () => {
    try {
      setLoading(true);
      const response = await getAllLeases();
      if (response.success) {
        setLeases(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load leases:", error);
      showNotification({
        title: "Error",
        message: "Failed to load lease agreements",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeases();
  }, []);

  const handleViewDetails = (lease: Lease) => {
    setSelectedLease(lease);
    openDetails();
  };

  const handleSign = (lease: Lease) => {
    setSelectedLease(lease);
    openSign();
  };

  const handleLeaseSigned = () => {
    loadLeases();
  };

  const filterLeases = (status?: string) => {
    if (!status || status === "all") return leases;
    return leases.filter((lease) => lease.status === status);
  };

  const getTabCounts = () => {
    return {
      all: leases.length,
      pending: leases.filter((l) => l.status === "pending").length,
      signed_by_tenant: leases.filter((l) => l.status === "signed_by_tenant")
        .length,
      signed_by_landlord: leases.filter(
        (l) => l.status === "signed_by_landlord"
      ).length,
      active: leases.filter((l) => l.status === "active").length,
      terminated: leases.filter((l) => l.status === "terminated").length,
    };
  };

  const getOverviewStats = () => {
    const total = leases.length;
    const pending = leases.filter((l) => l.status === "pending").length;
    const needSignature = leases.filter(
      (l) => l.status === "pending" || l.status === "signed_by_landlord"
    ).length;
    const active = leases.filter((l) => l.status === "active").length;
    const completed = leases.filter(
      (l) => l.status === "terminated" || l.status === "expired"
    ).length;

    return { total, pending, needSignature, active, completed };
  };

  if (loading) {
    return <BrandedLoader />;
  }

  const tabCounts = getTabCounts();
  const currentLeases = filterLeases(
    activeTab === "all" ? undefined : activeTab
  );
  const stats = getOverviewStats();

  return (
    <Container fluid>
      <Stack gap="xl">
        <div>
          <Title order={2}>Lease Agreements</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Manage your property lease agreements and signatures
          </Text>
        </div>

        {/* Overview Stats */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Total Leases
              </Text>
              <Text fw={700} size="xl">
                {stats.total}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Need Signature
              </Text>
              <Text fw={700} size="xl" c="orange">
                {stats.needSignature}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
            <Paper p="md" withBorder>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Active Leases
              </Text>
              <Text fw={700} size="xl" c="green">
                {stats.active}
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
                Completed
              </Text>
              <Text fw={700} size="xl" c="gray">
                {stats.completed}
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
            <Tabs.Tab value="signed_by_landlord" color="blue">
              Need My Signature ({tabCounts.signed_by_landlord})
            </Tabs.Tab>
            <Tabs.Tab value="signed_by_tenant" color="cyan">
              Awaiting Landlord ({tabCounts.signed_by_tenant})
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
                        ? "You don't have any lease agreements yet."
                        : `No leases with ${activeTab.replace(
                            "_",
                            " "
                          )} status.`}
                    </Text>
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
                      onSign={handleSign}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Tabs.Panel>
        </Tabs>

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

export default TenantLeases;
