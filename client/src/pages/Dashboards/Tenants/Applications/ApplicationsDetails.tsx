import {
  IconAlertCircle,
  IconArrowLeft,
  IconBath,
  IconBed,
  IconBuildingStore,
  IconCalendar,
  IconCheck,
  IconChevronRight,
  IconClipboardCheck,
  IconClock,
  IconDownload,
  IconEye,
  IconFileDescription,
  IconFileText,
  IconHome,
  IconHomeHeart,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconMessage,
  IconNotes,
  IconPhone,
  IconProgress,
  IconRuler,
  IconTrash,
  IconUpload,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTenantOperations} from "@/apis/tenantApi.tsx";
import {formatDate} from "@/utils/helpers";
import {useLoading} from "@/hooks/useLoading";
import {ErrorState} from "@/components/ErrorState";
import {BrandedLoader} from "@/components/LoadingSpinner";
import {toast} from "react-hot-toast";

// Withdrawal Confirmation Modal Component
interface WithdrawModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: Application;
  loading?: boolean;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  opened,
  onClose,
  onConfirm,
  application,
  loading = false,
}) => (
  <Modal
    opened={opened}
    onClose={onClose}
    title="Withdraw Application"
    centered
    size="md"
    radius="md"
  >
    <Stack gap="lg">
      <Alert
        icon={<IconAlertCircle size={20} />}
        title="Are you sure?"
        color="red"
        variant="light"
      >
        This action cannot be undone. You will need to submit a new application
        if you change your mind.
      </Alert>

      {application && (
        <Paper withBorder p="md" style={{ borderLeft: `4px solid #fb7185` }}>
          <Group gap="xs" mb={4}>
            <IconHomeHeart size={18} color="#fb7185" />
            <Text size="sm" fw={600}>
              {application.property?.name}
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mb={4}>
            {application.property?.address}
          </Text>
          <Group gap="xs">
            <IconCalendar size={14} color="gray" />
            <Text size="xs" c="dimmed">
              Applied:{" "}
              {formatDate(application.date_applied || application.date_applied)}
            </Text>
          </Group>
        </Paper>
      )}

      <Text size="sm" c="dimmed">
        Withdrawing your application will remove it from the landlord's view and
        you won't be able to recover it.
      </Text>

      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onClose} radius="sm">
          Cancel
        </Button>
        <Button
          color="red"
          onClick={onConfirm}
          loading={loading}
          leftSection={<IconTrash size={18} />}
          radius="sm"
        >
          Withdraw Application
        </Button>
      </Group>
    </Stack>
  </Modal>
);

// Status Timeline Component
const StatusTimeline = ({ application }: { application: Application }) => {
  const getTimelineData = () => {
    return [
      {
        title: "Application Submitted",
        description: `Applied on ${formatDate(
            application.date_applied || application.date_applied
        )}`,
        icon: IconClipboardCheck,
        color: "#fb7185",
        completed: true,
      },
      {
        title: "Application Viewed",
        description: application.date_viewed
            ? `Viewed on ${formatDate(application.date_viewed)}`
            : "Awaiting landlord review",
        icon: IconEye,
        color: application.date_viewed ? "#10b981" : "gray",
        completed: !!application.date_viewed,
      },
      {
        title: "Under Review",
        description: "Landlord is reviewing your application",
        icon: IconProgress,
        color: ["under-review", "in-progress", "accepted", "rejected"].includes(
            application.status
        )
            ? "#f59e0b"
            : "gray",
        completed: [
          "under-review",
          "tour-scheduled",
          "accepted",
          "rejected",
        ].includes(application.status),
      },
      {
        title: "Final Decision",
        description:
            application.status === "accepted"
                ? "Congratulations! Application approved"
                : application.status === "rejected"
                    ? "Application was not approved"
                    : "Awaiting final decision",
        icon:
            application.status === "accepted"
                ? IconCheck
                : application.status === "rejected"
                    ? IconX
                    : IconProgress,
        color:
            application.status === "accepted"
                ? "#10b981"
                : application.status === "rejected"
                    ? "#ef4444"
                    : "gray",
        completed: ["accepted", "approved", "rejected"].includes(
            application.status
        ),
      },
    ];
  };

  const timelineData = getTimelineData();
  const completedCount = timelineData.filter((item) => item.completed).length;
  const totalSteps = timelineData.length;

  return (
    <Stack gap="md">
      <Group justify="space-between" mb="sm">
        <Text fw={600}>Application Progress</Text>
        <Badge color="blue" variant="light">
          {completedCount} of {totalSteps} steps
        </Badge>
      </Group>

      <Progress.Root size={24}>
        <Progress.Section
          value={(completedCount / totalSteps) * 100}
          color="#fb7185"
        >
          <Progress.Label>
            {Math.round((completedCount / totalSteps) * 100)}%
          </Progress.Label>
        </Progress.Section>
      </Progress.Root>

      <Stack gap="lg" mt="md">
        {timelineData.map((item, index) => (
          <Group
            key={index}
            gap="md"
            wrap="nowrap"
            style={{ position: "relative" }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Center
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: item.completed ? item.color : "#f8f9fa",
                  border: `2px solid ${
                    item.completed ? item.color : "#e9ecef"
                  }`,
                  color: item.completed ? "white" : "#adb5bd",
                  zIndex: 2,
                  position: "relative",
                }}
              >
                {React.createElement(item.icon, { size: 20 })}
              </Center>
              {index < timelineData.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    left: 19,
                    width: 2,
                    height: 24,
                    backgroundColor: item.completed ? item.color : "#e9ecef",
                    zIndex: 1,
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <Text fw={600} size="sm" mb={2}>
                {item.title}
              </Text>
              <Text size="sm" c="dimmed">
                {item.description}
              </Text>
            </div>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};

// Property Details Component
const PropertyDetailsCard = ({ application }: { application: Application }) => (
  <Card withBorder padding="xl" radius="md">
    <Stack gap="lg">
      {/*<Group justify="space-between">*/}
      {/*  <div>*/}
      {/*    <Text size="lg" fw={700} mb={4}>*/}
      {/*      Property Details*/}
      {/*    </Text>*/}
      {/*    <Text size="sm" c="dimmed">*/}
      {/*      Your selected rental property*/}
      {/*    </Text>*/}
      {/*  </div>*/}
      {/*  <ActionIcon*/}
      {/*    component={Link}*/}
      {/*    to={`/listings/${application.property?.id}`}*/}
      {/*    variant="subtle"*/}
      {/*    size="lg"*/}
      {/*    color="blue"*/}
      {/*    radius="md"*/}
      {/*  >*/}
      {/*    <IconEye size={22} />*/}
      {/*  </ActionIcon>*/}
      {/*</Group>*/}

      <Card.Section>
        {application?.property?.cover_image ? (
          <Image
            src={application.property.cover_image}
            alt={application.property.name}
            height={220}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Center
            style={{
              height: 220,
              backgroundColor: "#f8f9fa",
              display: "flex",
              flexDirection: "column",
              gap: "md",
            }}
          >
            <IconHome size={64} color="#d1d5db" />
            <Text c="dimmed" size="sm">
              No property image available
            </Text>
          </Center>
        )}
      </Card.Section>

      <Stack gap="md">
        <div>
          <Text size="xl" fw={700} mb={2}>
            {application.property?.name}
          </Text>
          <Group gap="xs">
            <IconMapPin size={18} color="#6b7280" />
            <Text size="sm" c="dimmed">
              {application.property?.address}
            </Text>
          </Group>
        </div>

        <Paper withBorder p="md" radius="sm">
          <SimpleGrid cols={3} spacing="md">
            <div style={{ textAlign: "center" }}>
              <Group justify="center" gap="xs" mb={2}>
                <IconBed size={20} color="#3b82f6" />
                <Text size="xl" fw={700}>
                  {application.property?.bedrooms || "-"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Bedrooms
              </Text>
            </div>

            <div style={{ textAlign: "center" }}>
              <Group justify="center" gap="xs" mb={2}>
                <IconBath size={20} color="#10b981" />
                <Text size="xl" fw={700}>
                  {application.property?.bathrooms || "-"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Bathrooms
              </Text>
            </div>

            <div style={{ textAlign: "center" }}>
              <Group justify="center" gap="xs" mb={2}>
                <IconRuler size={20} color="#f59e0b" />
                <Text size="xl" fw={700}>
                  {application.property?.size_sqft ||
                  application.property?.size_sqft
                    ? `${
                        application.property.size_sqft ||
                        application.property.size_sqft
                      }`
                    : "-"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Sq ft
              </Text>
            </div>
          </SimpleGrid>
        </Paper>

        {application.property?.rent_amount && (
          <Paper
            withBorder
            p="lg"
            radius="sm"
            style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
          >
            <Group justify="space-between" align="center">
              <div>
                <Text size="sm" c="#dc2626" fw={600} mb={4}>
                  Rent
                </Text>
                <Text size="28px" fw={800} c="#dc2626">
                  ${application.property.rent_amount.toLocaleString()}
                </Text>
              </div>
              {application.property?.payment_structure && (
                <Badge
                  color="red"
                  variant="light"
                  size="lg"
                  radius="sm"
                  style={{ fontWeight: 600 }}
                >
                  {application.property.payment_structure}
                </Badge>
              )}
            </Group>
          </Paper>
        )}
      </Stack>
    </Stack>
  </Card>
);

// Application Info Card
const ApplicationInfoCard = ({ application }: { application: Application }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      received: { color: "orange", text: "received" },
      "tour-scheduled": { color: "blue", text: "Tour Scheduled" },
      "under-review": { color: "blue", text: "Under Review" },
      accepted: { color: "green", text: "Accepted" },
      rejected: { color: "red", text: "Rejected" },
      screening: { color: "indigo", text: "Screening" },
      viewed: { color: "gray", text: "Viewed" },
    };

    const config = statusConfig[status?.toLowerCase()] || {
      color: "gray",
      text: status,
    };

    return (
      <Badge
        color={config.color}
        size="lg"
        radius="sm"
        style={{ fontWeight: 600 }}
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Text size="lg" fw={700}>
            Application Information
          </Text>
          {getStatusBadge(application.status)}
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Stack gap="md">
            <div>
              <Group gap="xs" mb={4}>
                <IconClipboardCheck size={18} color="#6b7280" />
                <Text size="sm" fw={600}>
                  Application ID
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {application?.application_id}
              </Text>
            </div>

            <div>
              <Group gap="xs" mb={4}>
                <IconCalendar size={18} color="#6b7280" />
                <Text size="sm" fw={600}>
                  Date Applied
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {formatDate(application.date_applied || application.date_applied)}
              </Text>
            </div>

            <div>
              <Group gap="xs" mb={4}>
                <IconClock size={18} color="#6b7280" />
                <Text size="sm" fw={600}>
                  Last Updated
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {formatDate(application.updated_at)}
              </Text>
            </div>
          </Stack>

          <Stack gap="md">
            {application.date_viewed && (
              <div>
                <Group gap="xs" mb={4}>
                  <IconEye size={18} color="#6b7280" />
                  <Text size="sm" fw={600}>
                    Date Viewed
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {formatDate(application.date_viewed)}
                </Text>
              </div>
            )}

            <div>
              <Group gap="xs" mb={4}>
                <IconHome size={18} color="#6b7280" />
                <Text size="sm" fw={600}>
                  Property Type
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {application?.property.category?.name || "Not specified"}
              </Text>
            </div>

            {application.property?.furnished && (
              <div>
                <Group gap="xs" mb={4}>
                  <IconBed size={18} color="#6b7280" />
                  <Text size="sm" fw={600}>
                    Furnishing
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {application.property.furnished.charAt(0).toUpperCase() +
                    application.property.furnished.slice(1)}
                </Text>
              </div>
            )}
          </Stack>
        </SimpleGrid>

        {application.message && (
          <Paper
            withBorder
            p="md"
            radius="sm"
            style={{ backgroundColor: "#f0f9ff" }}
          >
            <Group gap="xs" mb={8}>
              <IconNotes size={18} color="#0ea5e9" />
              <Text size="sm" fw={600} c="#0ea5e9">
                Your Message to Landlord
              </Text>
            </Group>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              {application.message}
            </Text>
          </Paper>
        )}
      </Stack>
    </Card>
  );
};

function ApplicationsDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { id: applicationId } = params;
  const [application, setApplication] = useState<Application>(null);
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();
  const { deleteApplication, getApplication, downloadApplication} = useTenantOperations()

  // Withdraw modal states
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const fetchApplicationDetails = async () => {
    try {
      const response = await withLoading(getApplication(applicationId!));

      console.log("application response", response);
      setApplication(response.application || response);
    } catch (error) {
      setError(error.message || "Failed to fetch application details");
    }
  };

  const handleWithdrawApplication = async () => {
    if (!applicationId) return;

    setWithdrawLoading(true);
    try {
      await withLoading(deleteApplication(applicationId));
      navigate("/tenants/applications");
    } catch (error) {
      console.error("Failed to withdraw application:", error);
      setError(error.message || "Failed to withdraw application");
    } finally {
      setWithdrawLoading(false);
      setWithdrawModalOpen(false);
    }
  };

  const handleDownloadApplication = async () => {
    try {
      const response = await withLoading(downloadApplication(applicationId))
      console.log(response);

      const blob = await response

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `application_${application?.application_id || applicationId}.pdf`;

      // Append to DOM, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to download application:", error);
      toast.error("Failed to download application");
    }
  }

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (loading) {
    return <BrandedLoader inDashboard={true} label="Fetching application details..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        loading={loading}
        onRetry={fetchApplicationDetails}
      />
    );
  }

  if (!application) {
    return (
      <ErrorState
        message="Application not found"
        onRetry={fetchApplicationDetails}
        loading={loading}
      />
    );
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      {/* Withdrawal Confirmation Modal */}
      <WithdrawModal
        opened={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onConfirm={handleWithdrawApplication}
        application={application}
        loading={withdrawLoading}
      />

      {/* Header */}
      <Box
        style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}
      >
        <Container size="xl" py="lg">
          <Group justify="space-between" wrap="wrap" gap="md">
            <Group gap="md">
              <Button
                component={Link}
                to="/tenants/applications"
                variant="light"
                leftSection={<IconArrowLeft size={20} />}
                color="#fb7185"
                size="sm"
                radius="md"
              >
                Back to Applications
              </Button>
              <div>
                <Group gap="xs">
                  <IconFileDescription size={16} color="#6b7280" />
                  <Text size="sm" c="dimmed">
                    Application ID: {application?.application_id}
                  </Text>
                </Group>
              </div>
            </Group>
            <Group gap="md">
              <RingProgress
                size={80}
                thickness={6}
                sections={[
                  {
                    value: 100,
                    color: [
                      "viewed",
                      "under-review",
                      "tour-scheduled",
                      "accepted",
                      "approved",
                      "rejected",
                    ].includes(application.status)
                      ? 50
                      : ["accepted", "approved", "rejected"].includes(
                          application.status
                        )
                      ? 100
                      : 25,
                    color: "#fb7185",
                  },
                ]}
                label={
                  <Center>
                    <Text size="lg" c="#fb7185" fw={800}>
                      {[
                        "viewed",
                        "under-review",
                        "tour-scheduled",
                        "accepted",
                        "approved",
                        "rejected",
                      ].includes(application.status)
                        ? 50
                        : ["accepted", "approved", "rejected"].includes(
                            application.status
                          )
                        ? 100
                        : 25}
                      %
                    </Text>
                  </Center>
                }
              />
            </Group>
          </Group>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Main Content */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="xl">
              {/* Property Overview */}
              <PropertyDetailsCard application={application} />

              {/* Application Progress */}
              <Card withBorder padding="xl" radius="md">
                <StatusTimeline application={application} />
              </Card>

              {/* Application Details */}
              <ApplicationInfoCard application={application} />

              {/* Documents Section */}
              <Card withBorder padding="xl" radius="md">
                <Stack gap="lg">
                  <Group justify="space-between">
                    <div>
                      <Text size="lg" fw={700} mb={4}>
                        Supporting Documents
                      </Text>
                      <Text size="sm" c="dimmed">
                        Upload additional documents to strengthen your
                        application
                      </Text>
                    </div>
                    <Button
                      leftSection={<IconUpload size={18} />}
                      color="blue"
                      radius="md"
                    >
                      Upload New
                    </Button>
                  </Group>

                  <Divider />

                  {(application as any).documents && (application as any).documents.length > 0 ? (
                    <Stack gap="md">
                      {(application as any).documents.map((doc: any, index: number) => (
                        <Paper
                          key={doc.id || index}
                          withBorder
                          p="md"
                          radius="sm"
                          style={{ transition: "all 0.2s" }}
                          className="hover:border-blue-300"
                        >
                          <Group justify="space-between">
                            <Group gap="md">
                              <Center
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 8,
                                  backgroundColor: "#eff6ff",
                                }}
                              >
                                <IconFileText size={24} color="#3b82f6" />
                              </Center>
                              <div>
                                <Text fw={600} size="sm">
                                  {doc.name || `Document ${index + 1}`}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {doc.uploaded_at
                                    ? `Uploaded ${formatDate(doc.uploaded_at)}`
                                    : "Recently uploaded"}
                                </Text>
                              </div>
                            </Group>
                            <Button
                              variant="light"
                              color="blue"
                              leftSection={<IconDownload size={16} />}
                              size="sm"
                              radius="sm"
                            >
                              Download
                            </Button>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Center
                      style={{
                        height: 200,
                        border: "2px dashed #d1d5db",
                        borderRadius: 8,
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <Stack align="center" gap="md">
                        <IconFileText size={48} color="#9ca3af" />
                        <div>
                          <Text c="dimmed" ta="center" mb={4}>
                            No documents uploaded yet
                          </Text>
                          <Text size="sm" c="dimmed" ta="center">
                            Upload supporting documents to improve your
                            application
                          </Text>
                        </div>
                      </Stack>
                    </Center>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              {/* Contact Information */}
              <Card withBorder padding="xl" radius="md">
                <Stack gap="lg">
                  <div>
                    <Text size="lg" fw={700} mb={4}>
                      Contact Information
                    </Text>
                    <Text size="sm" c="dimmed">
                      Reach out to the property owner
                    </Text>
                  </div>

                  {application.landlord || application.property?.landlord ? (
                    <Stack gap="md">
                      <Paper withBorder p="lg" radius="sm">
                        <Stack gap="md">
                          <div>
                            <Text fw={700} mb={8}>
                              Listed By
                            </Text>
                            <Text size="sm" mb={12}>
                              {`${application.landlord?.firstName} ${application.landlord?.lastName}`}
                            </Text>
                          </div>

                          <Stack gap="sm">
                            {(application.landlord?.email ||
                              application.property?.landlord?.email) && (
                              <Group gap="md">
                                <Center
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    backgroundColor: "#f0f9ff",
                                  }}
                                >
                                  <IconMail size={20} color="#0ea5e9" />
                                </Center>
                                <div style={{ flex: 1 }}>
                                  <Text size="xs" c="dimmed">
                                    Email
                                  </Text>
                                  <Text size="sm" fw={500}>
                                    {application.landlord?.email ||
                                      application.property?.landlord?.email}
                                  </Text>
                                </div>
                              </Group>
                            )}

                            {(application.landlord?.phone_number) && (
                              <Group gap="md">
                                <Center
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    backgroundColor: "#f0fdf4",
                                  }}
                                >
                                  <IconPhone size={20} color="#10b981" />
                                </Center>
                                <div style={{ flex: 1 }}>
                                  <Text size="xs" c="dimmed">
                                    Phone
                                  </Text>
                                  <Text size="sm" fw={500}>
                                    {application.landlord?.phone_number}
                                  </Text>
                                </div>
                              </Group>
                            )}
                          </Stack>
                        </Stack>
                      </Paper>

                      <Group grow>
                        {application.landlord?.phone_number && (
                          <Button
                            variant="light"
                            color="green"
                            leftSection={<IconPhone size={18} />}
                            component="a"
                            href={`tel:${
                              application.landlord?.phone_number
                            }`}
                            radius="sm"
                          >
                            Call
                          </Button>
                        )}
                        <Button
                          variant="light"
                          color="blue"
                          leftSection={<IconMessage size={18} />}
                          radius="sm"
                        >
                          Message
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Paper withBorder p="xl" radius="sm">
                      <Stack align="center" gap="md">
                        <IconUser size={48} color="#9ca3af" />
                        <div>
                          <Text c="dimmed" ta="center">
                            Contact information not available
                          </Text>
                        </div>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Card>

              {/* Quick Actions */}
              <Card withBorder padding="xl" radius="md">
                <Stack gap="lg">
                  <Text size="lg" fw={700}>
                    Quick Actions
                  </Text>
                  <Stack gap="sm">
                    <Button
                      component={Link}
                      to={`/listings/${application.property?.id}`}
                      variant="light"
                      color="blue"
                      leftSection={<IconEye size={18} />}
                      rightSection={<IconChevronRight size={16} />}
                      radius="sm"
                      style={{ padding: "0 16px" }}
                    >
                      View Property Details
                    </Button>

                    <Button
                      component={Link}
                      to="/listings"
                      variant="light"
                      color="gray"
                      leftSection={<IconBuildingStore size={18} />}
                      rightSection={<IconChevronRight size={16} />}
                      radius="sm"
                      style={{ padding: "0 16px" }}
                    >
                      Browse Properties
                    </Button>

                    <Button
                      variant="light"
                      color="blue"
                      leftSection={<IconDownload size={18} />}
                      fullWidth
                      radius="sm"
                      style={{ padding: "0 16px" }}
                      onClick={handleDownloadApplication}
                    >
                      Download Application PDF
                    </Button>

                    <Divider />

                    <Button
                      variant="light"
                      color="red"
                      leftSection={<IconTrash size={18} />}
                      fullWidth
                      radius="sm"
                      style={{ padding: "0 16px" }}
                      onClick={() => setWithdrawModalOpen(true)}
                    >
                      Withdraw Application
                    </Button>
                  </Stack>
                </Stack>
              </Card>

              {/* Help Section */}
              <Card
                withBorder
                padding="xl"
                radius="md"
                style={{ backgroundColor: "#f0f9ff" }}
              >
                <Stack gap="md">
                  <Group gap="sm">
                    <IconInfoCircle size={24} color="#0ea5e9" />
                    <Text size="lg" fw={700} c="#0c4a6e">
                      Need Help?
                    </Text>
                  </Group>
                  <Text size="sm" c="#0369a1">
                    If you have questions about your application status or need
                    assistance, our support team is here to help.
                  </Text>
                  <Button variant="light" color="blue" fullWidth radius="sm">
                    Contact Support
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}

export default ApplicationsDetails;
