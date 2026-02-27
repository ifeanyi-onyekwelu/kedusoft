import React, { useState, useEffect } from "react";
import {
  Button,
  Group,
  TextInput,
  Select,
  Paper,
  Badge,
  SimpleGrid,
  Stack,
  Box,
  ThemeIcon,
  Text,
  Title,
  Modal,
  Textarea,
  FileInput,
  Grid,
  Alert,
  Divider,
  Timeline,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
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
  IconEye,
  IconAlertCircle,
  IconCircleCheck,
  IconPencil,
  IconSearch,
  IconRefresh,
  IconFileCheck,
  IconFileOff,
  IconArrowLeft,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenantOperations } from "@/apis/tenantApi.tsx";
import UniversalStatCard from "../../../components/shared/Dashboard/UniversalStatCard";
import EmptyState from "../../../components/EmptyState";
import { BrandedLoader } from "@/components/LoadingSpinner.tsx";
import { toast } from "react-hot-toast";

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

interface StatisticItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  filterKey?: string | null;
}

const LeaseCard: React.FC<{
  lease: Lease;
  onViewDetails: (lease: Lease) => void;
  onSign: (lease: Lease) => void;
}> = ({ lease, onViewDetails, onSign }) => {
  const canSign =
      lease.status === "pending" || lease.status === "signed_by_landlord";
  const isActive = lease.status === "active";

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
        return <IconSignature size={16} />;
      case "active":
        return <IconFileCheck size={16} />;
      case "terminated":
        return <IconFileOff size={16} />;
      case "expired":
        return <IconAlertCircle size={16} />;
      default:
        return <IconClock size={16} />;
    }
  };

  return (
      <Paper
          shadow="sm"
          p="lg"
          radius="md"
          withBorder
          className="bg-white hover:shadow-md transition-shadow duration-300"
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div className="flex-1">
              <Group gap="xs" align="center" mb="xs">
                <IconHome size={16} className="text-gray-600" />
                <Text fw={600} size="lg" className="text-gray-900">
                  {lease.property.title}
                </Text>
              </Group>

              <Stack gap={4}>
                <Text size="sm" className="text-gray-600">
                  {lease.property.address}
                </Text>

                <Group gap="xs" align="center">
                  <IconUser size={14} className="text-gray-500" />
                  <Text size="sm" className="text-gray-500">
                    {lease.property.landlord.first_name}{" "}
                    {lease.property.landlord.last_name}
                  </Text>
                </Group>

                <Group gap="xs" align="center">
                  <IconCurrencyDollar size={14} className="text-gray-500" />
                  <Text size="sm" className="text-gray-500">
                    ${lease.monthly_rent.toLocaleString()}/month
                  </Text>
                </Group>

                <Group gap="xs" align="center">
                  <IconCalendar size={14} className="text-gray-500" />
                  <Text size="sm" className="text-gray-500">
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
                size="lg"
            >
              {lease.status.replace("_", " ").toUpperCase()}
            </Badge>
          </Group>

          {isActive && (
              <Badge color="green" variant="filled" size="sm" fullWidth>
                <IconCircleCheck size={12} className="mr-1" />
                ACTIVE LEASE
              </Badge>
          )}

          {lease.status === "pending" && (
              <Badge color="yellow" variant="light" size="sm" fullWidth>
                <IconAlertCircle size={12} className="mr-1" />
                AWAITING SIGNATURE
              </Badge>
          )}

          {lease.status === "signed_by_landlord" && (
              <Badge color="blue" variant="light" size="sm" fullWidth>
                <IconSignature size={12} className="mr-1" />
                LANDLORD SIGNED - NEEDS YOUR SIGNATURE
              </Badge>
          )}

          <Group justify="flex-end" gap="sm">
            <Button
                variant="subtle"
                size="xs"
                leftSection={<IconEye size={14} />}
                onClick={() => onViewDetails(lease)}
            >
              View
            </Button>
            {canSign && (
                <Button
                    size="xs"
                    leftSection={<IconSignature size={14} />}
                    onClick={() => onSign(lease)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign
                </Button>
            )}
          </Group>
        </Stack>
      </Paper>
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
            <Text fw={600} mb="md" className="text-gray-900">
              Property Information
            </Text>
            <Grid>
              <Grid.Col span={8}>
                <Text size="sm" fw={500}>
                  Property:
                </Text>
                <Text size="sm" className="text-gray-600">
                  {lease.property.title}
                </Text>
                <Text size="xs" className="text-gray-500">
                  {lease.property.address}
                </Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" fw={500}>
                  Monthly Rent:
                </Text>
                <Text size="sm" className="text-gray-600" fw={600}>
                  ${lease.monthly_rent.toLocaleString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Security Deposit:
                </Text>
                <Text size="sm" className="text-gray-600">
                  ${lease.security_deposit.toLocaleString()}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Lease Duration:
                </Text>
                <Text size="sm" className="text-gray-600">
                  {new Date(lease.lease_start_date).toLocaleDateString()} -{" "}
                  {new Date(lease.lease_end_date).toLocaleDateString()}
                </Text>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Landlord Information */}
          <Paper p="md" withBorder>
            <Text fw={600} mb="md" className="text-gray-900">
              Landlord Information
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Name:
                </Text>
                <Text size="sm" className="text-gray-600">
                  {lease.property.landlord.first_name}{" "}
                  {lease.property.landlord.last_name}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Email:
                </Text>
                <Text size="sm" className="text-gray-600">
                  {lease.property.landlord.email}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Phone:
                </Text>
                <Text size="sm" className="text-gray-600">
                  {lease.property.landlord.phone}
                </Text>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Lease Terms */}
          <Paper p="md" withBorder>
            <Text fw={600} mb="md" className="text-gray-900">
              Lease Terms & Conditions
            </Text>
            <Text size="sm" className="text-gray-600" style={{ whiteSpace: "pre-wrap" }}>
              {lease.lease_terms}
            </Text>
            {lease.special_conditions && (
                <>
                  <Divider my="md" />
                  <Text fw={500} size="sm" mb="xs">
                    Special Conditions:
                  </Text>
                  <Text size="sm" className="text-gray-600" style={{ whiteSpace: "pre-wrap" }}>
                    {lease.special_conditions}
                  </Text>
                </>
            )}
          </Paper>

          {/* Signature Status */}
          <Paper p="md" withBorder>
            <Text fw={600} mb="md" className="text-gray-900">
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
                    <Text size="sm" className="text-gray-600">
                      Signed on {new Date(lease.tenant_signed_at).toLocaleString()}
                    </Text>
                ) : (
                    <Text size="sm" className="text-gray-500">
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
                    <Text size="sm" className="text-gray-600">
                      Signed on{" "}
                      {new Date(lease.landlord_signed_at).toLocaleString()}
                    </Text>
                ) : (
                    <Text size="sm" className="text-gray-500">
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
                    <Text size="sm" className="text-gray-600">
                      Lease is now active
                    </Text>
                ) : (
                    <Text size="sm" className="text-gray-500">
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
      toast.error("Please provide your signature");
      return;
    }

    setLoading(true);
    try {
      await signLease(lease.id, signature.trim());
      toast.success("Lease signed successfully");
      onSign();
      onClose();
      setSignature("");
      setAdditionalDocuments([]);
    } catch  {
      toast.error("Failed to sign lease");
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
              <Text size="xs" className="text-gray-500" mt="xs">
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
              <Button type="submit" loading={loading} className="bg-green-600 hover:bg-green-700">
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
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);

  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [signOpened, { open: openSign, close: closeSign }] = useDisclosure(false);

  const navigate = useNavigate();

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const response = await getAllLeases();
      const leasesData = response.data || [];
      setLeases(leasesData);

      // Calculate statistics
      const totalLeases = leasesData.length;
      const pendingLeases = leasesData.filter(l => l.status === "pending").length;
      const signedByTenantLeases = leasesData.filter(l => l.status === "signed_by_tenant").length;
      const signedByLandlordLeases = leasesData.filter(l => l.status === "signed_by_landlord").length;
      const activeLeases = leasesData.filter(l => l.status === "active").length;
      const terminatedLeases = leasesData.filter(l => l.status === "terminated").length;
      const expiredLeases = leasesData.filter(l => l.status === "expired").length;

      setStatistics([
        {
          title: "Total Leases",
          value: totalLeases,
          icon: <IconFileText size={24} />,
          color: "#3b82f6",
          filterKey: null,
        },
        {
          title: "Pending",
          value: pendingLeases,
          icon: <IconClock size={24} />,
          color: "#f59e0b",
          filterKey: "pending",
        },
        {
          title: "Awaiting Landlord",
          value: signedByTenantLeases,
          icon: <IconSignature size={24} />,
          color: "#0ea5e9",
          filterKey: "signed_by_tenant",
        },
        {
          title: "Need My Signature",
          value: signedByLandlordLeases,
          icon: <IconSignature size={24} />,
          color: "#8b5cf6",
          filterKey: "signed_by_landlord",
        },
        {
          title: "Active",
          value: activeLeases,
          icon: <IconFileCheck size={24} />,
          color: "#10b981",
          filterKey: "active",
        },
        {
          title: "Terminated",
          value: terminatedLeases + expiredLeases,
          icon: <IconFileOff size={24} />,
          color: "#ef4444",
          filterKey: "terminated",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch leases");
      console.error("Failed to fetch leases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  // Filter and sort leases
  useEffect(() => {
    let filtered = leases;

    // Apply status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(
          (lease) => lease.status === filterStatus
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
          (lease) =>
              lease.property.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
              lease.property.address
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
              `${lease.property.landlord.first_name} ${lease.property.landlord.last_name}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "property":
          return a.property.title.localeCompare(b.property.title);
        case "rent":
          return b.monthly_rent - a.monthly_rent;
        default:
          return 0;
      }
    });

    setFilteredLeases(filtered);
  }, [leases, filterStatus, searchQuery, sortBy]);

  // Handle stat card click to filter
  const handleStatClick = (filterKey: string | null) => {
    if (filterKey === null) {
      setFilterStatus(null);
    } else if (filterKey === filterStatus) {
      setFilterStatus(null);
    } else {
      setFilterStatus(filterKey);
    }
  };

  const handleViewDetails = (lease: Lease) => {
    setSelectedLease(lease);
    openDetails();
  };

  const handleSign = (lease: Lease) => {
    setSelectedLease(lease);
    openSign();
  };

  const handleLeaseSigned = () => {
    fetchLeases();
  };

  if (loading && leases.length === 0) {
    return <BrandedLoader inDashboard={true} label="Loading leases..." />;
  }

  if (!leases || leases.length === 0) {
    return (
        <div className="px-4 py-6">
          <EmptyState>
            <Stack align="center" gap="xl" className="max-w-md">
              <Box className="relative">
                <ThemeIcon
                    size={80}
                    radius="24px"
                    variant="light"
                    color="blue"
                    className="bg-blue-50 border border-blue-100"
                >
                  <IconFileText size={40} stroke={1.5} className="text-blue-600" />
                </ThemeIcon>
                <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                  <IconSignature size={16} className="text-amber-500" />
                </div>
              </Box>

              <Stack gap="xs" align="center" className="text-center">
                <Title
                    order={2}
                    className="text-slate-900 tracking-tight font-extrabold"
                >
                  No Lease Agreements
                </Title>
                <Text
                    size="lg"
                    className="text-slate-500 leading-relaxed font-medium"
                >
                  You don't have any lease agreements yet. Apply for properties and get approved to receive lease agreements.
                </Text>
              </Stack>

              <Stack gap="sm" className="w-full sm:w-auto">
                <Button
                    onClick={() => navigate("/tenants")}
                    size="lg"
                    radius="xl"
                    className="bg-slate-900 hover:bg-slate-800 transition-all px-8"
                    leftSection={<IconArrowLeft size={18} />}
                >
                  Back to Dashboard
                </Button>
                <Button
                    onClick={() => navigate("/tenants/applications")}
                    size="md"
                    variant="light"
                >
                  View Applications
                </Button>
              </Stack>
            </Stack>
          </EmptyState>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Lease Agreements
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Manage and sign your property lease agreements
              </p>
            </div>
            <Button
                leftSection={<IconRefresh size={16} />}
                onClick={fetchLeases}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh
            </Button>
          </motion.div>

          {/* Interactive Statistics Cards */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SimpleGrid
                cols={{ base: 2, sm: 3, md: 6 }}
                spacing="lg"
                verticalSpacing="md"
            >
              <AnimatePresence>
                {statistics.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="cursor-pointer"
                        onClick={() => handleStatClick(stat.filterKey)}
                    >
                      <UniversalStatCard
                          title={stat.title}
                          value={stat.value}
                          icon={stat.icon}
                          color={stat.color}
                      />
                    </motion.div>
                ))}
              </AnimatePresence>
            </SimpleGrid>
          </motion.div>

          {/* Active Filter Badge */}
          <AnimatePresence>
            {filterStatus && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                >
                  <span className="text-sm text-gray-600">Active Filter:</span>
                  <Badge
                      size="lg"
                      rightSection={
                        <button
                            onClick={() => setFilterStatus(null)}
                            className="ml-2 hover:opacity-70"
                        >
                          <IconX size={14} />
                        </button>
                      }
                      className="bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {filterStatus.replace("_", " ").toUpperCase()}
                  </Badge>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Filters & Search Section */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Paper
                p="md"
                withBorder
                className="bg-white shadow-sm rounded-lg border-gray-200"
            >
              <Group grow>
                <TextInput
                    placeholder="Search by property, address, or landlord..."
                    rightSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    className="flex-1"
                />

                <Select
                    placeholder="Sort by"
                    data={[
                      { value: "newest", label: "Newest First" },
                      { value: "oldest", label: "Oldest First" },
                      { value: "property", label: "Property Name" },
                      { value: "rent", label: "Rent Amount" },
                    ]}
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-[100px]"
                />
              </Group>
            </Paper>
          </motion.div>

          {/* Leases Grid */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
          >
            {filteredLeases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLeases.map((lease) => (
                      <LeaseCard
                          key={lease.id}
                          lease={lease}
                          onViewDetails={handleViewDetails}
                          onSign={handleSign}
                      />
                  ))}
                </div>
            ) : (
                <Paper
                    withBorder
                    radius="md"
                    p={60}
                    className="bg-white/50 backdrop-blur-sm border-dashed"
                >
                  <EmptyState>
                    <motion.div
                        className="flex flex-col justify-center items-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <div className="relative mb-6">
                        <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center relative z-10"
                        >
                          <IconFileText
                              size={48}
                              stroke={1.5}
                              className="text-blue-500"
                          />
                        </motion.div>
                        <div className="absolute -top-2 -right-2 w-24 h-24 bg-blue-100/50 rounded-3xl blur-xl" />
                        <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-indigo-100/50 rounded-3xl blur-xl" />
                      </div>

                      <div className="max-w-sm">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                          {searchQuery || filterStatus
                              ? "No matches found"
                              : "No leases found"}
                        </h2>
                        <p className="text-gray-500 mt-3 leading-relaxed">
                          {searchQuery || filterStatus
                              ? "We couldn't find any leases matching your current filters. Try using different keywords."
                              : "Your lease agreements will appear here once you apply for and get approved for properties."}
                        </p>
                      </div>

                      <Group mt={32} gap="md">
                        {(searchQuery || filterStatus) && (
                            <Button
                                variant="subtle"
                                color="gray"
                                leftSection={<IconX size={16} />}
                                onClick={() => {
                                  setSearchQuery("");
                                  setFilterStatus(null);
                                }}
                            >
                              Clear all filters
                            </Button>
                        )}
                        <Button
                            size="md"
                            radius="md"
                            onClick={() => navigate("/tenants/applications")}
                            className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                            leftSection={<IconEye size={18} />}
                        >
                          View Applications
                        </Button>
                      </Group>
                    </motion.div>
                  </EmptyState>
                </Paper>
            )}
          </motion.div>

          {/* Modals */}
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
        </div>
      </div>
  );
};

export default TenantLeases;