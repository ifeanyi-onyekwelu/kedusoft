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
} from "@mantine/core";
import { Button } from "../../../../components/Button";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getApplication } from "../../../../apis/tenantApi";
import { formatDate } from "../../../../utils/helpers";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorState } from "../../../../components/ErrorState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";

function ApplicationsDetails() {
  const params = useParams();
  const { id: applicationId } = params;
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();

  const fetchApplicationDetails = async () => {
    try {
      const response = await withLoading(getApplication(applicationId!));
      console.log("Response", response);
      setApplication(response);
    } catch (error: any) {
      setError(error.message || "Failed to fetch application details");
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  if (!application) {
    return (
      <ErrorState
        message={error!}
        loading={loading}
        onRetry={fetchApplicationDetails}
      />
    );
  }

  if (error)
    return (
      <ErrorState
        message={error}
        loading={loading}
        onRetry={fetchApplicationDetails}
      />
    );

  if (loading) return <LoadingSpinner />;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      pending: { color: "gray", text: "Pending Review" },
      "in-progress": { color: "yellow", text: "Under Review" },
      accepted: { color: "green", text: "Approved" },
      approved: { color: "green", text: "Approved" },
      rejected: { color: "red", text: "Rejected" },
      screened: { color: "blue", text: "Screened" },
      unscreened: { color: "violet", text: "Screening Required" },
    };

    const config = statusConfig[status?.toLowerCase()] || {
      color: "gray",
      text: status,
    };

    return (
      <Badge color={config.color} variant="light">
        {config.text}
      </Badge>
    );
  };

  const getTimelineData = () => {
    const timeline = [
      {
        title: "Application Submitted",
        description: `Applied on ${formatDate(application.created_at)}`,
        icon: IconClipboardCheck,
        color: "blue",
        completed: true,
      },
      {
        title: "Under Review",
        description: "Landlord reviewing your application",
        icon: IconEye,
        color: "yellow",
        completed: application.status !== "received",
      },
      {
        title: "Screening Process",
        description: ["screening-completed", "screening-in-progress"].includes(
          application.status
        )
          ? `Screening ${application.status}`
          : "Awaiting screening",
        icon: IconUser,
        color: "violet",
        completed: [
          "screening-completed",
          "approved",
          "lease-sent",
          "lease-signed",
        ].includes(application.status),
      },
      {
        title: "Final Decision",
        description:
          application.status === "approved"
            ? "Application approved!"
            : application.status === "rejected"
            ? "Application rejected"
            : "Awaiting final decision",
        icon:
          application.status === "approved"
            ? IconCheck
            : application.status === "rejected"
            ? IconX
            : IconProgress,
        color:
          application.status === "approved"
            ? "green"
            : application.status === "rejected"
            ? "red"
            : "gray",
        completed: [
          "approved",
          "rejected",
          "lease-sent",
          "lease-signed",
        ].includes(application.status),
      },
    ];

    return timeline;
  };

  const getNextSteps = () => {
    const steps = [];

    if (application.status === "received") {
      steps.push({
        title: "Wait for Review",
        description: "Your application is being reviewed by the landlord",
        action: null,
      });
    }

    if (application.status === "screening-requested") {
      steps.push({
        title: "Complete Screening",
        description: "Provide additional information to speed up the process",
        action: {
          label: "Start Screening",
          link: `/tenants/applications/${application.id}/screening`,
          color: "blue",
        },
      });
    }

    if (application.status === "lease-sent") {
      steps.push({
        title: "Review Lease",
        description: "Your lease agreement is ready for review and signing",
        action: {
          label: "View Lease",
          link: `/tenants/leases`,
          color: "green",
        },
      });
    }

    if (application.status === "approved") {
      steps.push({
        title: "Sign Lease Agreement",
        description: "Review and sign your lease to secure the property",
        action: {
          label: "View Lease",
          link: `/tenants/leases`,
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

    return steps;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/tenants/applications"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IconArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h1>
                <p className="text-sm text-gray-600">
                  ID: {application?.application_id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Grid>
          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="lg">
              {/* Property Overview Card */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {application?.property?.cover_image ? (
                      <img
                        src={application.property.cover_image}
                        alt={application.property.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconHome size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Group justify="space-between" mb="sm">
                      <Text size="xl" fw={600}>
                        {application.property?.name}
                      </Text>
                      <ActionIcon
                        component={Link}
                        to={`/properties/${application.property?.id}`}
                        variant="light"
                        size="lg"
                      >
                        <IconEye size={20} />
                      </ActionIcon>
                    </Group>
                    <Group gap="xs" mb="sm">
                      <IconMapPin size={16} className="text-gray-500" />
                      <Text size="sm" c="dimmed">
                        {application.property?.address}
                      </Text>
                    </Group>
                    <Group gap="xl">
                      <div className="text-center">
                        <Text size="lg" fw={600}>
                          {application.property?.bedrooms}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Bedrooms
                        </Text>
                      </div>
                      <div className="text-center">
                        <Text size="lg" fw={600}>
                          {application.property?.bathrooms}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Bathrooms
                        </Text>
                      </div>
                      {application.property?.monthly_rent && (
                        <div className="text-center">
                          <Text size="lg" fw={600}>
                            $
                            {application.property.monthly_rent.toLocaleString()}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Monthly Rent
                          </Text>
                        </div>
                      )}
                    </Group>
                  </div>
                </div>
              </Card>

              {/* Application Progress */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Application Progress
                  </Text>
                  <Badge
                    color={
                      application.status === "approved"
                        ? "green"
                        : application.status === "rejected"
                        ? "red"
                        : "blue"
                    }
                    variant="light"
                    size="lg"
                  >
                    {application.status === "approved"
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
                >
                  {getTimelineData().map((item, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon
                          size={24}
                          variant={item.completed ? "filled" : "light"}
                          color={item.color}
                        >
                          {item.icon &&
                            React.createElement(item.icon, { size: 12 })}
                        </ThemeIcon>
                      }
                      title={item.title}
                    >
                      <Text size="sm" c="dimmed">
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
                      Details
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
                      Messages
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="details" pt="md">
                    <Grid>
                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>
                              Date Applied
                            </Text>
                            <Group gap="xs">
                              <IconCalendar
                                size={16}
                                className="text-gray-500"
                              />
                              <Text size="sm">
                                {formatDate(application.created_at)}
                              </Text>
                            </Group>
                          </div>

                          {application.preferred_move_in && (
                            <div>
                              <Text size="sm" c="dimmed" mb={4}>
                                Preferred Move-in Date
                              </Text>
                              <Group gap="xs">
                                <IconCalendar
                                  size={16}
                                  className="text-gray-500"
                                />
                                <Text size="sm">
                                  {formatDate(application.preferred_move_in)}
                                </Text>
                              </Group>
                            </div>
                          )}
                        </Stack>
                      </Grid.Col>

                      <Grid.Col span={6}>
                        <Stack gap="sm">
                          <div>
                            <Text size="sm" c="dimmed" mb={4}>
                              Last Updated
                            </Text>
                            <Text size="sm">
                              {formatDate(application.updated_at)}
                            </Text>
                          </div>

                          <div>
                            <Text size="sm" c="dimmed" mb={4}>
                              Current Status
                            </Text>
                            <Text size="sm" tt="capitalize">
                              {application.status || "Pending review"}
                            </Text>
                          </div>
                        </Stack>
                      </Grid.Col>
                    </Grid>

                    {application.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <Text size="sm" c="dimmed" mb={2}>
                          Your Message
                        </Text>
                        <Text size="sm">{application.message}</Text>
                      </div>
                    )}
                  </Tabs.Panel>

                  <Tabs.Panel value="documents" pt="md">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Upload additional documents to support your
                          application
                        </Text>
                        <Button
                          icon={<IconUpload size={16} />}
                          variant="outlined"
                          label="Upload Document"
                        />
                      </Group>

                      {application.documents &&
                      application.documents.length > 0 ? (
                        <Stack gap="xs">
                          {application.documents.map((doc: any) => (
                            <Paper key={doc.id} p="sm" withBorder>
                              <Group justify="space-between">
                                <Group gap="sm">
                                  <IconFileText size={20} />
                                  <div>
                                    <Text size="sm" fw={500}>
                                      {doc.name}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                      Uploaded {formatDate(doc.uploaded_at)}
                                    </Text>
                                  </div>
                                </Group>
                                <ActionIcon variant="light">
                                  <IconDownload size={16} />
                                </ActionIcon>
                              </Group>
                            </Paper>
                          ))}
                        </Stack>
                      ) : (
                        <Text size="sm" c="dimmed" ta="center" py="xl">
                          No documents uploaded yet
                        </Text>
                      )}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="communication" pt="md">
                    <Stack gap="md">
                      <Alert
                        icon={<IconAlertCircle size={16} />}
                        color="blue"
                        variant="light"
                      >
                        Direct messaging with landlords coming soon. For now,
                        use the contact information provided.
                      </Alert>

                      {application.landlord && (
                        <Paper p="md" withBorder>
                          <Group justify="space-between">
                            <div>
                              <Text fw={600} mb="xs">
                                Property Owner
                              </Text>
                              <Text size="sm">{application.landlord.name}</Text>
                            </div>
                            <Group gap="xs">
                              <Tooltip label="Call landlord">
                                <ActionIcon
                                  variant="light"
                                  color="blue"
                                  component="a"
                                  href={`tel:${application.landlord.phone}`}
                                >
                                  <IconPhone size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Email landlord">
                                <ActionIcon
                                  variant="light"
                                  color="blue"
                                  component="a"
                                  href={`mailto:${application.landlord.email}`}
                                >
                                  <IconMail size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Group>
                        </Paper>
                      )}
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
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
                          to={step.action.link}
                          color={step.action.color}
                          variant="outlined"
                          label={step.action.label}
                        />
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
                    to={`/properties/${application.property?.id}`}
                    icon={<IconEye size={16} />}
                    variant="outlined"
                    label="View Property"
                  />
                  {application.status === "screening-requested" && (
                    <Button
                      to={`/tenants/applications/${application.id}/screening`}
                      icon={<IconUser size={16} />}
                      color="violet"
                      variant="outlined"
                      label="Complete Screening"
                    />
                  )}

                  {application.status === "approved" && (
                    <Button
                      to="/tenants/leases"
                      icon={<IconCheck size={16} />}
                      color="green"
                      variant="outlined"
                      label="View Lease Agreement"
                    />
                  )}

                  <Button
                    to="/listings"
                    icon={<IconBuildingStore size={16} />}
                    variant="outlined"
                    label="Browse Properties"
                  />
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
                    <Text size="sm" tt="capitalize">
                      {application.status}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Applied
                    </Text>
                    <Text size="sm">{formatDate(application.created_at)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Last Updated
                    </Text>
                    <Text size="sm">{formatDate(application.updated_at)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Property Type
                    </Text>
                    <Text size="sm">
                      {application.property?.property_type || "Residential"}
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
