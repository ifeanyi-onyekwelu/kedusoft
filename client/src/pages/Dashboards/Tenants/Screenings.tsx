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
  NumberInput,
  Textarea,
  FileInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  IconBell,
  IconCheck,
  IconClock,
  IconX,
  IconEye,
  IconUpload,
  IconSearch,
  IconRefresh,
  IconFileText,
  IconShieldCheck,
  IconShieldX,
  IconProgress,
  IconUserCheck,
  IconArrowLeft,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenantOperations } from "@/apis/tenantApi.tsx";
import UniversalStatCard from "../../../components/shared/Dashboard/UniversalStatCard.tsx";
import EmptyState from "../../../components/EmptyState.tsx";
import { BrandedLoader } from "@/components/LoadingSpinner.tsx";
import { toast } from "react-hot-toast";

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

interface StatisticItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  filterKey?: string | null;
}

const ScreeningCard: React.FC<{
  screening: Screening;
  onViewDetails: (screening: Screening) => void;
  onUpdateScreening: (screening: Screening) => void;
}> = ({ screening, onViewDetails, onUpdateScreening }) => {
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
        return <IconProgress size={16} />;
      case "completed":
        return <IconFileText size={16} />;
      case "approved":
        return <IconShieldCheck size={16} />;
      case "rejected":
        return <IconShieldX size={16} />;
      default:
        return <IconClock size={16} />;
    }
  };

  const canUpdate =
      screening.status === "pending" || screening.status === "in_progress";

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
            <div>
              <Text fw={600} size="lg" className="text-gray-900">
                {screening.application.property.title}
              </Text>
              <Text size="sm" className="text-gray-600">
                {screening.application.property.address}
              </Text>
              <Text size="sm" className="text-gray-500">
                Landlord: {screening.application.landlord.first_name}{" "}
                {screening.application.landlord.last_name}
              </Text>
            </div>
            <Badge
                color={getStatusColor(screening.status)}
                leftSection={getStatusIcon(screening.status)}
                variant="light"
                size="lg"
            >
              {screening.status.replace("_", " ").toUpperCase()}
            </Badge>
          </Group>

          <Text size="sm" className="text-gray-500">
            Requested: {new Date(screening.created_at).toLocaleDateString()}
          </Text>

          {screening.status === "completed" && screening.result && (
              <Badge
                  color={screening.result === "approved" ? "green" : "red"}
                  variant="filled"
                  size="sm"
                  fullWidth
              >
                {screening.result === "approved" ? "APPROVED" : "REJECTED"}
                {screening.result_notes && (
                    <Text size="xs" mt={4}>
                      {screening.result_notes}
                    </Text>
                )}
              </Badge>
          )}

          {screening.status === "pending" && (
              <Badge color="yellow" variant="light" size="sm" fullWidth>
                <IconBell size={12} className="mr-1" />
                Action Required: Please complete your screening information
              </Badge>
          )}

          <Group justify="flex-end" gap="sm">
            <Button
                variant="subtle"
                size="xs"
                leftSection={<IconEye size={14} />}
                onClick={() => onViewDetails(screening)}
            >
              View
            </Button>
            {canUpdate && (
                <Button
                    size="xs"
                    leftSection={<IconUpload size={14} />}
                    onClick={() => onUpdateScreening(screening)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </Button>
            )}
          </Group>
        </Stack>
      </Paper>
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
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>
                Status:
              </Text>
              <Badge
                  color={
                    screening.status === "approved"
                        ? "green"
                        : screening.status === "rejected"
                            ? "red"
                            : "blue"
                  }
                  mt="xs"
              >
                {screening.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <div>
              <Text size="sm" fw={500}>
                Requested Date:
              </Text>
              <Text size="sm" className="text-gray-600" mt="xs">
                {new Date(screening.created_at).toLocaleDateString()}
              </Text>
            </div>
          </Group>

          <div>
            <Text size="sm" fw={500}>
              Property Details:
            </Text>
            <Text size="sm" className="text-gray-600" mt="xs">
              {screening.application.property.title}
            </Text>
            <Text size="xs" className="text-gray-500">
              {screening.application.property.address}
            </Text>
          </div>

          <div>
            <Text size="sm" fw={500}>
              Landlord:
            </Text>
            <Text size="sm" className="text-gray-600" mt="xs">
              {screening.application.landlord.first_name}{" "}
              {screening.application.landlord.last_name}
            </Text>
          </div>

          {screening.income && (
              <div>
                <Text size="sm" fw={500}>
                  Monthly Income:
                </Text>
                <Text size="sm" className="text-gray-600" mt="xs">
                  ${screening.income.toLocaleString()}
                </Text>
              </div>
          )}

          {screening.employment_status && (
              <div>
                <Text size="sm" fw={500}>
                  Employment Status:
                </Text>
                <Text size="sm" className="text-gray-600" mt="xs">
                  {screening.employment_status}
                </Text>
              </div>
          )}

          {screening.previous_rental_history && (
              <div>
                <Text size="sm" fw={500}>
                  Rental History:
                </Text>
                <Text size="sm" className="text-gray-600" mt="xs">
                  {screening.previous_rental_history}
                </Text>
              </div>
          )}

          {screening.references && (
              <div>
                <Text size="sm" fw={500}>
                  References:
                </Text>
                <Text size="sm" className="text-gray-600" mt="xs">
                  {screening.references}
                </Text>
              </div>
          )}

          {screening.landlord_notes && (
              <div>
                <Text size="sm" fw={500}>
                  Landlord Notes:
                </Text>
                <Text size="sm" className="text-gray-600" mt="xs">
                  {screening.landlord_notes}
                </Text>
              </div>
          )}

          {screening.result_notes && (
              <Paper withBorder p="md" bg={screening.result === "approved" ? "green.0" : "red.0"}>
                <Text fw={600} size="sm">
                  {screening.result === "approved" ? "✓ Approved" : "✗ Rejected"}
                </Text>
                <Text size="sm" mt={4}>
                  {screening.result_notes}
                </Text>
              </Paper>
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
      toast.success("Screening information updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update screening information");
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
                placeholder="Describe your previous rental experience"
                value={formData.previous_rental_history}
                onChange={(e) =>
                    setFormData({
                      ...formData,
                      previous_rental_history: e.target.value,
                    })
                }
                rows={3}
                required
            />

            <Textarea
                label="References"
                placeholder="Provide contact information for references"
                value={formData.references}
                onChange={(e) =>
                    setFormData({ ...formData, references: e.target.value })
                }
                rows={3}
                required
            />

            <FileInput
                label="Additional Documents"
                placeholder="Upload documents (pay stubs, employment letter, etc.)"
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
              <Button type="submit" loading={loading} className="bg-blue-600 hover:bg-blue-700">
                Update Screening
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
  );
};

const TenantScreenings: React.FC = () => {
  const { getAllScreenings } = useTenantOperations();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [filteredScreenings, setFilteredScreenings] = useState<Screening[]>([]);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);

  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] = useDisclosure(false);

  const navigate = useNavigate();

  const fetchScreenings = async () => {
    setLoading(true);
    try {
      const response = await getAllScreenings();
      const screeningsData = response.data || [];
      setScreenings(screeningsData);

      // Calculate statistics
      const totalScreenings = screeningsData.length;
      const pendingScreenings = screeningsData.filter(s => s.status === "pending").length;
      const inProgressScreenings = screeningsData.filter(s => s.status === "in_progress").length;
      const completedScreenings = screeningsData.filter(s => s.status === "completed").length;
      const approvedScreenings = screeningsData.filter(s => s.status === "approved").length;
      const rejectedScreenings = screeningsData.filter(s => s.status === "rejected").length;

      setStatistics([
        {
          title: "Total Screenings",
          value: totalScreenings,
          icon: <IconFileText size={24} />,
          color: "#3b82f6",
          filterKey: null,
        },
        {
          title: "Pending",
          value: pendingScreenings,
          icon: <IconClock size={24} />,
          color: "#f59e0b",
          filterKey: "pending",
        },
        {
          title: "In Progress",
          value: inProgressScreenings,
          icon: <IconProgress size={24} />,
          color: "#0ea5e9",
          filterKey: "in_progress",
        },
        {
          title: "Completed",
          value: completedScreenings,
          icon: <IconCheck size={24} />,
          color: "#10b981",
          filterKey: "completed",
        },
        {
          title: "Approved",
          value: approvedScreenings,
          icon: <IconShieldCheck size={24} />,
          color: "#22c55e",
          filterKey: "approved",
        },
        {
          title: "Rejected",
          value: rejectedScreenings,
          icon: <IconShieldX size={24} />,
          color: "#ef4444",
          filterKey: "rejected",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch screenings");
      console.error("Failed to fetch screenings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  // Filter and sort screenings
  useEffect(() => {
    let filtered = screenings;

    // Apply status filter
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter(
          (screening) => screening.status === filterStatus
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
          (screening) =>
              screening.application.property.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
              screening.application.property.address
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
              `${screening.application.landlord.first_name} ${screening.application.landlord.last_name}`
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
          return a.application.property.title.localeCompare(b.application.property.title);
        default:
          return 0;
      }
    });

    setFilteredScreenings(filtered);
  }, [screenings, filterStatus, searchQuery, sortBy]);

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

  const handleViewDetails = (screening: Screening) => {
    setSelectedScreening(screening);
    openDetails();
  };

  const handleUpdateScreening = (screening: Screening) => {
    setSelectedScreening(screening);
    openUpdate();
  };

  const handleScreeningUpdated = () => {
    fetchScreenings();
  };

  if (loading && screenings.length === 0) {
    return <BrandedLoader inDashboard={true} label="Loading screenings..." />;
  }

  if (!screenings || screenings.length === 0) {
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
                  <IconUserCheck size={40} stroke={1.5} className="text-blue-600" />
                </ThemeIcon>
                <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                  <IconShieldCheck size={16} className="text-amber-500" />
                </div>
              </Box>

              <Stack gap="xs" align="center" className="text-center">
                <Title
                    order={2}
                    className="text-slate-900 tracking-tight font-extrabold"
                >
                  No Screenings Found
                </Title>
                <Text
                    size="lg"
                    className="text-slate-500 leading-relaxed font-medium"
                >
                  You haven't been invited for screening yet, your screening invites will appear here.
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
                Screening Requests
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                Manage and track your property screening applications
              </p>
            </div>
            <Button
                leftSection={<IconRefresh size={16} />}
                onClick={fetchScreenings}
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
                    ]}
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-[100px]"
                />
              </Group>
            </Paper>
          </motion.div>

          {/* Screenings Grid */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
          >
            {filteredScreenings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredScreenings.map((screening) => (
                      <ScreeningCard
                          key={screening.id}
                          screening={screening}
                          onViewDetails={handleViewDetails}
                          onUpdateScreening={handleUpdateScreening}
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
                          <IconUserCheck
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
                              : "No screenings found"}
                        </h2>
                        <p className="text-gray-500 mt-3 leading-relaxed">
                          {searchQuery || filterStatus
                              ? "We couldn't find any screenings matching your current filters. Try using different keywords."
                              : "Your screening requests will appear here once you apply for properties."}
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
        </div>
      </div>
  );
};

export default TenantScreenings;