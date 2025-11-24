import {
  IconArrowLeft,
  IconMapPin,
  IconHome,
  IconUser,
  IconCalendar,
  IconCheck,
  IconX,
  IconProgress,
  IconEye,
  IconDownload,
  IconUpload,
  IconMessage,
  IconPhone,
  IconMail,
  IconFileText,
  IconAlertCircle,
  IconClipboardCheck,
  IconBuildingStore,
  IconBed,
  IconBath,
  IconRuler,
  IconTrash,
} from "@tabler/icons-react";
import {
  Badge,
  Card,
  Group,
  Text,
  Timeline,
  ThemeIcon,
  Stack,
  Grid,
  Alert,
  Tabs,
  Paper,
  ActionIcon,
  Tooltip,
  Button,
  Image,
  Divider,
  SimpleGrid,
  RingProgress,
  Center,
  Modal,
  Box,
} from "@mantine/core";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getApplication, deleteApplication } from "../../../../apis/tenantApi";
import { formatDate } from "../../../../utils/helpers";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorState } from "../../../../components/ErrorState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

// Withdrawal Confirmation Modal Component
interface WithdrawModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  application: any;
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
  >
    <Box className="space-y-4">
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Are you sure?"
        color="red"
        variant="light"
      >
        This action cannot be undone. You will need to submit a new application
        if you change your mind.
      </Alert>

      {application && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text size="sm" fw={500}>
            {application.property?.name}
          </Text>
          <Text size="sm" c="dimmed">
            {application.property?.address}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Applied:{" "}
            {formatDate(application.date_applied || application.created_at)}
          </Text>
        </div>
      )}

      <Text size="sm" c="dimmed">
        Withdrawing your application will remove it from the landlord's view and
        you won't be able to recover it.
      </Text>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="red"
          onClick={onConfirm}
          loading={loading}
          leftSection={<IconTrash size={16} />}
        >
          Withdraw Application
        </Button>
      </Group>
    </Box>
  </Modal>
);

function ApplicationsDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { id: applicationId } = params;
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();

  // Withdraw modal states
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const fetchApplicationDetails = async () => {
    try {
      const response = await withLoading(getApplication(applicationId!));
      console.log("Application Details Response:", response);
      setApplication(response.application || response);
    } catch (error: any) {
      setError(error.message || "Failed to fetch application details");
    }
  };

  const handleWithdrawApplication = async () => {
    if (!applicationId) return;

    setWithdrawLoading(true);
    try {
      await withLoading(deleteApplication(applicationId));

      // Show success message (you can add a toast notification here)
      console.log("Application withdrawn successfully");

      // Redirect back to applications list
      navigate("/tenants/applications");
    } catch (error: any) {
      console.error("Failed to withdraw application:", error);
      setError(error.message || "Failed to withdraw application");
    } finally {
      setWithdrawLoading(false);
      setWithdrawModalOpen(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (loading) {
    return <LoadingSpinner label="Loading application details..." />;
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      pending: { color: "orange", text: "Pending Review" },
      "in-progress": { color: "blue", text: "Under Review" },
      "under-review": { color: "blue", text: "Under Review" },
      accepted: { color: "green", text: "Approved" },
      approved: { color: "green", text: "Approved" },
      rejected: { color: "red", text: "Rejected" },
      screened: { color: "indigo", text: "Screened" },
      unscreened: { color: "violet", text: "Screening Required" },
      viewed: { color: "gray", text: "Viewed" },
    };

    const config = statusConfig[status?.toLowerCase()] || {
      color: "gray",
      text: status,
    };

    return (
      <Badge color={config.color} variant="light" size="lg">
        {config.text}
      </Badge>
    );
  };

  const getTimelineData = () => {
    const baseTimeline = [
      {
        title: "Application Submitted",
        description: `Applied on ${formatDate(
          application.date_applied || application.created_at
        )}`,
        icon: IconClipboardCheck,
        color: "#0ea5e9",
        completed: true,
      },
      {
        title: "Application Viewed",
        description: application.viewed_at
          ? `Viewed on ${formatDate(application.viewed_at)}`
          : "Waiting for landlord to view",
        icon: IconEye,
        color: application.viewed_at ? "#0ea5e9" : "gray",
        completed: !!application.viewed_at,
      },
      {
        title: "Under Review",
        description: "Landlord reviewing your application",
        icon: IconProgress,
        color: ["under-review", "in-progress", "accepted", "rejected"].includes(
          application.status
        )
          ? "#0ea5e9"
          : "gray",
        completed: [
          "under-review",
          "in-progress",
          "accepted",
          "rejected",
        ].includes(application.status),
      },
      {
        title: "Final Decision",
        description:
          application.status === "accepted" || application.status === "approved"
            ? "Application approved!"
            : application.status === "rejected"
            ? "Application rejected"
            : "Awaiting final decision",
        icon:
          application.status === "accepted" || application.status === "approved"
            ? IconCheck
            : application.status === "rejected"
            ? IconX
            : IconProgress,
        color:
          application.status === "accepted" || application.status === "approved"
            ? "green"
            : application.status === "rejected"
            ? "red"
            : "gray",
        completed: ["accepted", "approved", "rejected"].includes(
          application.status
        ),
      },
    ];

    return baseTimeline;
  };

  const getNextSteps = () => {
    const steps = [];

    if (application.status === "pending") {
      steps.push({
        title: "Wait for Review",
        description:
          "Your application is waiting to be reviewed by the landlord",
        action: null,
      });
    }

    if (
      application.status === "under-review" ||
      application.status === "in-progress"
    ) {
      steps.push({
        title: "Under Review",
        description: "The landlord is currently reviewing your application",
        action: null,
      });
    }

    if (
      application.status === "accepted" ||
      application.status === "approved"
    ) {
      steps.push({
        title: "Congratulations!",
        description:
          "Your application has been approved. Next steps will be communicated soon.",
        action: {
          label: "View Property",
          link: `/properties/${application.property?.id}`,
          color: "green",
        },
      });
    }

    if (application.status === "rejected") {
      steps.push({
        title: "Explore Other Options",
        description: "Don't give up! Check out other available properties",
        action: {
          label: "Browse Properties",
          link: "/listings",
          color: "blue",
        },
      });
    }

    // Always show contact option
    steps.push({
      title: "Contact Landlord",
      description: "Have questions? Reach out to the property owner",
      action: {
        label: "Send Message",
        link: "#contact",
        color: "blue",
      },
    });

    return steps;
  };

  const getProgressPercentage = () => {
    const completedSteps = getTimelineData().filter(
      (item) => item.completed
    ).length;
    const totalSteps = getTimelineData().length;
    return (completedSteps / totalSteps) * 100;
  };

  const PropertyDetailsCard = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Property Details
        </Text>
        <ActionIcon
          component={Link}
          to={`/listings/${application.property?.id}`}
          variant="light"
          size="lg"
          target="_blank"
        >
          <IconEye size={20} />
        </ActionIcon>
      </Group>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Property Image */}
        <div className="flex-shrink-0">
          {application?.property?.cover_image ? (
            <Image
              src={application.property.cover_image}
              alt={application.property.name}
              radius="md"
              className="object-cover h-36"
            />
          ) : (
            <div className="w-70 h-50 bg-gray-100 rounded-lg flex items-center justify-center">
              <IconHome size={48} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1">
          <Group gap="xs" mb="sm">
            <IconMapPin size={18} className="text-gray-500" />
            <Text size="lg" fw={500}>
              {application.property?.name}
            </Text>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            {application.property?.address}
          </Text>

          {/* Property Features */}
          <SimpleGrid cols={3} spacing="md" mb="md">
            <div className="text-center">
              <Group justify="center" gap="xs" mb={4}>
                <IconBed size={18} className="text-blue-600" />
                <Text size="lg" fw={600}>
                  {application.property?.bedrooms || "N/A"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Bedrooms
              </Text>
            </div>

            <div className="text-center">
              <Group justify="center" gap="xs" mb={4}>
                <IconBath size={18} className="text-green-600" />
                <Text size="lg" fw={600}>
                  {application.property?.bathrooms || "N/A"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Bathrooms
              </Text>
            </div>

            <div className="text-center">
              <Group justify="center" gap="xs" mb={4}>
                <IconRuler size={18} className="text-orange-600" />
                <Text size="lg" fw={600}>
                  {application.property?.size_sqft ||
                  application.property?.square_feet
                    ? `${
                        application.property.size_sqft ||
                        application.property.square_feet
                      } sqft`
                    : "N/A"}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Size
              </Text>
            </div>
          </SimpleGrid>

          {/* Additional Details */}
          <SimpleGrid cols={2} spacing="sm">
            <Group gap="xs">
              <Text size="sm" fw={500}>
                Type:
              </Text>
              <Text size="sm" c="dimmed">
                {application?.category?.name}
              </Text>
            </Group>

            <Group gap="xs">
              <Text size="sm" fw={500}>
                Furnished:
              </Text>
              <Text size="sm" c="dimmed">
                {application.property?.furnished
                  ? application.property.furnished.charAt(0).toUpperCase() +
                    application.property.furnished.slice(1)
                  : "No"}
              </Text>
            </Group>

            {application.property?.parking_type && (
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Parking:
                </Text>
                <Text size="sm" c="dimmed">
                  {application.property.parking_type}
                </Text>
              </Group>
            )}

            {application.property?.year_built && (
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Year Built:
                </Text>
                <Text size="sm" c="dimmed">
                  {application.property.year_built}
                </Text>
              </Group>
            )}
          </SimpleGrid>

          {/* Rent Information */}
          {application.property?.rent_amount && (
            <Paper withBorder p="md" mt="md" className="bg-blue-50/50">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500} c="#fb7185">
                    Rent
                  </Text>
                  <Text size="xl" fw={700} c="#fb7185">
                    ${application.property.rent_amount.toLocaleString()}
                  </Text>
                </div>
                {application.property?.payment_structure && (
                  <Badge color="#fb7185" variant="light">
                    {application.property.payment_structure}
                  </Badge>
                )}
              </Group>
            </Paper>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Withdrawal Confirmation Modal */}
      <WithdrawModal
        opened={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onConfirm={handleWithdrawApplication}
        application={application}
        loading={withdrawLoading}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b rounded-lg mb-6">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                component={Link}
                to="/tenants/applications"
                variant="subtle"
                leftSection={<IconArrowLeft size={20} />}
                color="#fb7185"
              >
                Back to Applications
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h1>
                <p className="text-sm text-gray-600">
                  Application ID: {application?.application_id}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {getStatusBadge(application.status)}
              <RingProgress
                size={60}
                thickness={4}
                roundCaps
                sections={[{ value: getProgressPercentage(), color: "blue" }]}
                label={
                  <Center>
                    <Text size="xs" c="blue" fw={700}>
                      {Math.round(getProgressPercentage())}%
                    </Text>
                  </Center>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-window mx-auto">
        <Grid>
          {/* Main Content */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
              {/* Property Overview */}
              <PropertyDetailsCard />

              {/* Application Progress */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Application Progress
                  </Text>
                  <Badge
                    color={
                      application.status === "accepted" ||
                      application.status === "approved"
                        ? "green"
                        : application.status === "rejected"
                        ? "red"
                        : "blue"
                    }
                    variant="light"
                    size="lg"
                  >
                    {application.status === "accepted" ||
                    application.status === "approved"
                      ? "Approved"
                      : application.status === "rejected"
                      ? "Rejected"
                      : "In Progress"}
                  </Badge>
                </Group>

                <Timeline
                  active={getTimelineData().findIndex(
                    (item) => !item.completed
                  )}
                  bulletSize={24}
                  color="#0ea5e9"
                >
                  {getTimelineData().map((item, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon
                          size={24}
                          variant={item.completed ? "filled" : "light"}
                          color={item.color}
                          radius="xl"
                        >
                          {item.icon &&
                            React.createElement(item.icon, { size: 12 })}
                        </ThemeIcon>
                      }
                      title={item.title}
                    >
                      <Text size="sm" c="dimmed" mt={4}>
                        {item.description}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>

              {/* Application Details Tabs */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Tabs defaultValue="details">
                  <Tabs.List>
                    <Tabs.Tab
                      value="details"
                      leftSection={<IconFileText size={16} />}
                    >
                      Application Details
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="documents"
                      leftSection={<IconUpload size={16} />}
                    >
                      Documents
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="communication"
                      leftSection={<IconMessage size={16} />}
                    >
                      Contact
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="details" pt="md">
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                      <Stack gap="md">
                        <div>
                          <Text size="sm" c="dimmed" mb={4}>
                            Date Applied
                          </Text>
                          <Group gap="xs">
                            <IconCalendar size={16} className="text-gray-500" />
                            <Text size="sm" fw={500}>
                              {formatDate(
                                application.date_applied ||
                                  application.created_at
                              )}
                            </Text>
                          </Group>
                        </div>

                        <div>
                          <Text size="sm" c="dimmed" mb={4}>
                            Last Updated
                          </Text>
                          <Text size="sm" fw={500}>
                            {formatDate(application.updated_at)}
                          </Text>
                        </div>
                      </Stack>

                      <Stack gap="md">
                        <div>
                          <Text size="sm" c="dimmed" mb={4}>
                            Application Status
                          </Text>
                          {getStatusBadge(application.status)}
                        </div>

                        {application.viewed_at && (
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>
                              Date Viewed
                            </Text>
                            <Text size="sm" fw={500}>
                              {formatDate(application.viewed_at)}
                            </Text>
                          </div>
                        )}
                      </Stack>
                    </SimpleGrid>

                    {application.message && (
                      <Paper withBorder p="md" mt="md" className="bg-gray-50">
                        <Text size="sm" c="dimmed" mb={4}>
                          Your Message to Landlord
                        </Text>
                        <Text size="sm">{application.message}</Text>
                      </Paper>
                    )}
                  </Tabs.Panel>

                  <Tabs.Panel value="documents" pt="md">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500} mb={4}>
                            Application Documents
                          </Text>
                          <Text size="sm" c="dimmed">
                            Upload additional documents to support your
                            application
                          </Text>
                        </div>
                        <Button
                          leftSection={<IconUpload size={16} />}
                          variant="light"
                        >
                          Upload Document
                        </Button>
                      </Group>

                      <Divider />

                      {application.documents &&
                      application.documents.length > 0 ? (
                        <Stack gap="xs">
                          {application.documents.map(
                            (doc: any, index: number) => (
                              <Paper key={doc.id || index} p="sm" withBorder>
                                <Group justify="space-between">
                                  <Group gap="sm">
                                    <IconFileText
                                      size={20}
                                      className="text-blue-600"
                                    />
                                    <div>
                                      <Text size="sm" fw={500}>
                                        {doc.name || `Document ${index + 1}`}
                                      </Text>
                                      <Text size="xs" c="dimmed">
                                        {doc.uploaded_at
                                          ? `Uploaded ${formatDate(
                                              doc.uploaded_at
                                            )}`
                                          : "Recently uploaded"}
                                      </Text>
                                    </div>
                                  </Group>
                                  <ActionIcon variant="light" color="blue">
                                    <IconDownload size={16} />
                                  </ActionIcon>
                                </Group>
                              </Paper>
                            )
                          )}
                        </Stack>
                      ) : (
                        <Paper p="xl" withBorder className="text-center">
                          <IconFileText
                            size={48}
                            className="text-gray-400 mx-auto mb-3"
                          />
                          <Text size="sm" c="dimmed">
                            No documents uploaded yet
                          </Text>
                          <Text size="xs" c="dimmed" mt={4}>
                            Upload supporting documents to improve your
                            application
                          </Text>
                        </Paper>
                      )}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="communication" pt="md">
                    <Stack gap="md">
                      <Alert
                        icon={<IconAlertCircle size={16} />}
                        color="blue"
                        variant="light"
                        title="Contact Information"
                      >
                        Use the information below to contact the property owner
                        directly.
                      </Alert>

                      {application.landlord ||
                      application.property?.landlord ? (
                        <Paper p="md" withBorder>
                          <Group justify="space-between" align="flex-start">
                            <div>
                              <Text fw={600} mb="xs">
                                Property Owner
                              </Text>
                              <Text size="sm" mb="xs">
                                {application.landlord?.name ||
                                  application.property?.landlord?.name ||
                                  "Landlord"}
                              </Text>
                              {application.landlord?.email ||
                              application.property?.landlord?.email ? (
                                <Group gap="xs" mb={4}>
                                  <IconMail
                                    size={14}
                                    className="text-gray-500"
                                  />
                                  <Text size="sm" c="dimmed">
                                    {application.landlord?.email ||
                                      application.property?.landlord?.email}
                                  </Text>
                                </Group>
                              ) : null}
                              {application.landlord?.phone ||
                              application.property?.landlord?.phone ? (
                                <Group gap="xs">
                                  <IconPhone
                                    size={14}
                                    className="text-gray-500"
                                  />
                                  <Text size="sm" c="dimmed">
                                    {application.landlord?.phone ||
                                      application.property?.landlord?.phone}
                                  </Text>
                                </Group>
                              ) : null}
                            </div>
                            <Group gap="xs">
                              {(application.landlord?.phone ||
                                application.property?.landlord?.phone) && (
                                <Tooltip label="Call landlord">
                                  <ActionIcon
                                    variant="light"
                                    color="blue"
                                    component="a"
                                    href={`tel:${
                                      application.landlord?.phone ||
                                      application.property?.landlord?.phone
                                    }`}
                                  >
                                    <IconPhone size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              )}
                              {(application.landlord?.email ||
                                application.property?.landlord?.email) && (
                                <Tooltip label="Email landlord">
                                  <ActionIcon
                                    variant="light"
                                    color="blue"
                                    component="a"
                                    href={`mailto:${
                                      application.landlord?.email ||
                                      application.property?.landlord?.email
                                    }`}
                                  >
                                    <IconMail size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              )}
                              <Tooltip label="Send message">
                                <ActionIcon variant="light" color="blue">
                                  <IconMessage size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Group>
                        </Paper>
                      ) : (
                        <Paper p="md" withBorder className="text-center">
                          <IconUser
                            size={32}
                            className="text-gray-400 mx-auto mb-3"
                          />
                          <Text size="sm" c="dimmed">
                            Contact information not available
                          </Text>
                        </Paper>
                      )}
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              {/* Next Steps */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={600} mb="md">
                  Next Steps
                </Text>
                <Stack gap="md">
                  {getNextSteps().map((step, index) => (
                    <div key={index}>
                      <Text size="sm" fw={500} mb="xs">
                        {step.title}
                      </Text>
                      <Text size="xs" c="dimmed" mb="sm">
                        {step.description}
                      </Text>
                      {step.action && (
                        <Button
                          component={Link}
                          to={step.action.link}
                          color={step.action.color}
                          variant="light"
                          fullWidth
                          size="sm"
                        >
                          {step.action.label}
                        </Button>
                      )}
                    </div>
                  ))}
                </Stack>
              </Card>

              {/* Quick Actions */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={600} mb="md">
                  Quick Actions
                </Text>
                <Stack gap="sm">
                  <Button
                    component={Link}
                    to={`/properties/${application.property?.id}`}
                    leftSection={<IconEye size={16} />}
                    variant="light"
                    fullWidth
                  >
                    View Property Details
                  </Button>

                  <Button
                    component={Link}
                    to="/listings"
                    leftSection={<IconBuildingStore size={16} />}
                    variant="light"
                    fullWidth
                  >
                    Browse Similar Properties
                  </Button>

                  <Button
                    leftSection={<IconDownload size={16} />}
                    variant="light"
                    fullWidth
                  >
                    Download Application PDF
                  </Button>

                  {(application.landlord?.phone ||
                    application.property?.landlord?.phone) && (
                    <Button
                      component="a"
                      href={`tel:${
                        application.landlord?.phone ||
                        application.property?.landlord?.phone
                      }`}
                      leftSection={<IconPhone size={16} />}
                      variant="light"
                      color="green"
                      fullWidth
                    >
                      Call Landlord
                    </Button>
                  )}

                  {/* Withdraw Application Button */}
                  <Button
                    leftSection={<IconTrash size={16} />}
                    variant="light"
                    color="red"
                    fullWidth
                    onClick={() => setWithdrawModalOpen(true)}
                  >
                    Withdraw Application
                  </Button>
                </Stack>
              </Card>

              {/* Application Summary */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={600} mb="md">
                  Application Summary
                </Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Status
                    </Text>
                    {getStatusBadge(application.status)}
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Date Applied
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(
                        application.date_applied || application.created_at
                      )}
                    </Text>
                  </Group>
                  {application.viewed_at && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Date Viewed
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatDate(application.viewed_at)}
                      </Text>
                    </Group>
                  )}
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Last Updated
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatDate(application.updated_at)}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Property Type
                    </Text>
                    <Text size="sm" fw={500}>
                      {application?.category?.name}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}

export default ApplicationsDetails;
