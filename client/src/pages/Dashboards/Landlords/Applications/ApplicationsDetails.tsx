import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Grid,
  Badge,
  ActionIcon,
  Button,
  Stack,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconUser,
  IconHome,
  IconMapPin,
  IconCurrencyNaira,
  IconBriefcase,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { useLoading } from "../../../../hooks/useLoading";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import formatAmount from "../../../../utils/helpers";
import { showNotification } from "../../../../utils/helpers";

export default function ApplicationsDetails() {
  const { applicationId, propertyId } = useParams();

  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const { loading, withLoading } = useLoading();
  const [actionLoading, setActionLoading] = useState(false);
  const { getApplication, createScreening, rejectApplication } =
    useLandlordOperations();

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId, propertyId]);

  const fetchApplicationDetails = async () => {
    try {
      const { application } = await withLoading(
        getApplication(propertyId!, applicationId!)
      );

      setApplication(application);
    } catch (error) {
      showNotification(
        "error",
        "Error!",
        "Failed to fetch application details"
      );
    }
  };

  const handleRejectApplication = async () => {
    setActionLoading(true);
    try {
      await withLoading(rejectApplication(application.id));
    } catch (error) {
      showNotification("error", "Error", "Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteForScreening = async () => {
    setActionLoading(true);
    try {
      // Use the createScreening API function
      await withLoading(
        createScreening(applicationId!, {
          bio_data: {}, // Add any required screening data here
        })
      );
      notifications.show({
        title: "Success",
        message: "Tenant invited for screening successfully",
        color: "green",
      });
      fetchApplicationDetails();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to invite for screening",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading application details" />;
  }

  if (!application) {
    return (
      <Container size="lg" py="xl">
        <Text>Application not found</Text>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "blue";
      case "screening-invited":
        return "yellow";
      case "in-progress":
        return "orange";
      case "completed":
      case "approved":
        return "green";
      case "rejected":
      case "failed":
        return "red";
      case "lease-created":
        return "teal";
      default:
        return "gray";
    }
  };

  return (
    <Container size="lg" py="xl">
      <Group
        justify="space-between"
        mb="xl"
        style={{ flexWrap: "wrap", gap: "1rem" }}
      >
        <Group>
          <ActionIcon variant="light" onClick={() => navigate(-1)}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <div>
            <Title order={2}>Application Details</Title>
            <Text c="dimmed">Review and manage this rental application</Text>
          </div>
        </Group>

        <Group>
          <Badge
            color={getStatusColor(application.status)}
            size="lg"
            variant="light"
          >
            {application.status}
          </Badge>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          {/* Tenant Information */}
          <Paper p="lg" mb="md" withBorder>
            <Group
              justify="space-between"
              mb="md"
              style={{ flexWrap: "wrap", gap: "0.5rem" }}
            >
              <Group>
                <IconUser size={20} />
                <Title order={3}>Applicant Information</Title>
              </Group>
              <Button
                variant="light"
                size="sm"
                onClick={() =>
                  navigate(
                    `/property-owner/applications/applicants/${application.applicant.id}`
                  )
                }
              >
                View Full Profile
              </Button>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Full Name
                </Text>
                <Text size="sm" fw={500}>
                  {application.applicant.firstName}{" "}
                  {application.applicant.lastName}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Email
                </Text>
                <Text size="sm" fw={500}>
                  {application.applicant?.email}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Phone Number
                </Text>
                <Text size="sm" fw={500}>
                  {application.applicant.phone_number || "Not provided"}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Date of Birth
                </Text>
                <Text size="sm" fw={500}>
                  {application.applicant.date_of_birth
                    ? new Date(
                        application.applicant.date_of_birth
                      ).toLocaleDateString()
                    : "Not provided"}
                </Text>
              </Grid.Col>
            </Grid>

            {/* Address Information */}
            {(application.applicant.street ||
              application.applicant.city ||
              application.applicant.state) && (
              <>
                <Divider my="md" />
                <Group mb="xs">
                  <IconMapPin size={16} />
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Current Address
                  </Text>
                </Group>
                <Text size="sm" fw={500}>
                  {[
                    application.applicant.street_address,
                    application.applicant.city,
                    application.applicant.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </>
            )}

            {/* Employment Information */}
            {(application.applicant.employment_status ||
              application.applicant.employer_name ||
              application.applicant.monthly_income) && (
              <>
                <Divider my="md" />
                <Group mb="xs">
                  <IconBriefcase size={16} />
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Employment Details
                  </Text>
                </Group>
                <Grid>
                  {application.applicant.employment_status && (
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Text size="xs" c="dimmed" mb="xs">
                        Employment Status
                      </Text>
                      <Text size="sm" fw={500}>
                        {application.applicant.employment_status}
                      </Text>
                    </Grid.Col>
                  )}
                  {application.applicant.employer_name && (
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Text size="xs" c="dimmed" mb="xs">
                        Employer
                      </Text>
                      <Text size="sm" fw={500}>
                        {application.applicant.employer_name}
                      </Text>
                    </Grid.Col>
                  )}
                  {application.applicant.monthly_income && (
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Text size="xs" c="dimmed" mb="xs">
                        Monthly Income
                      </Text>
                      <Text size="sm" fw={500}>
                        ₦{application.applicant.monthly_income.toLocaleString()}
                      </Text>
                    </Grid.Col>
                  )}
                </Grid>
              </>
            )}
          </Paper>

          {/* Property Information */}
          <Paper p="lg" mb="md" withBorder>
            <Group mb="md">
              <IconHome size={20} />
              <Title order={3}>Property Information</Title>
            </Group>

            <Grid>
              <Grid.Col span={12}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Property Title
                </Text>
                <Text size="lg" fw={600}>
                  {application.property?.name}
                </Text>
              </Grid.Col>

              <Grid.Col span={12}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Address
                </Text>
                <Text size="sm" fw={500}>
                  {[
                    application.property?.street,
                    application.property?.city,
                    application.property?.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Bedrooms
                </Text>
                <Text size="sm" fw={500}>
                  {application.property?.bedrooms || "N/A"}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Bathrooms
                </Text>
                <Text size="sm" fw={500}>
                  {application.property?.bathrooms || "N/A"}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Size (sqft)
                </Text>
                <Text size="sm" fw={500}>
                  {formatAmount(application.property?.size_sqft) || "N/A"}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Furnished
                </Text>
                <Text size="sm" fw={500}>
                  {application.property?.furnished ? "Yes" : "No"}
                </Text>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Application Details */}
          <Paper p="lg" withBorder>
            <Group mb="md">
              <IconInfoCircle size={20} />
              <Title order={3}>Application Details</Title>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Application Date
                </Text>
                <Text size="sm" fw={500}>
                  {new Date(application.created_at).toLocaleDateString()}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Current Status
                </Text>
                <Badge
                  color={getStatusColor(application.status)}
                  variant="light"
                >
                  {application.status}
                </Badge>
              </Grid.Col>

              {application.message && (
                <Grid.Col span={12}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                    Message from Tenant
                  </Text>
                  <Text size="sm" fw={500}>
                    {application.message}
                  </Text>
                </Grid.Col>
              )}
            </Grid>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          {/* Quick Actions */}
          <Paper p="lg" mb="md" withBorder>
            <Title order={4} mb="md">
              Quick Actions
            </Title>

            <Stack gap="sm">
              {application.status === "received" && (
                <>
                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    loading={actionLoading}
                    onClick={handleInviteForScreening}
                  >
                    Invite for Screening
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    fullWidth
                    loading={actionLoading}
                    onClick={handleRejectApplication}
                  >
                    Reject Application
                  </Button>
                </>
              )}

              {application.status === "screening-invited" && (
                <Button variant="light" color="orange" fullWidth disabled>
                  Screening Invitation Sent
                </Button>
              )}

              {application.status === "rejected" && (
                <Button variant="light" color="red" fullWidth disabled>
                  Application Rejected
                </Button>
              )}

              {(application.status === "completed" ||
                application.status === "approved") && (
                <Button
                  variant="light"
                  color="green"
                  fullWidth
                  onClick={() =>
                    navigate(`/property-owner/leases/create/${applicationId}`)
                  }
                >
                  Create Lease Agreement
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Financial Information */}
          <Paper p="lg" withBorder>
            <Group mb="md">
              <IconCurrencyNaira size={20} />
              <Title order={4}>Financial Details</Title>
            </Group>

            <Stack gap="md">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                  Monthly Rent
                </Text>
                <Text size="lg" fw={700} c="black">
                  ₦{application.property?.rent_amount?.toLocaleString()}
                </Text>
                {application.property?.payment_structure && (
                  <Text size="xs" c="dimmed" mt="xs">
                    Paid {application.property.payment_structure}
                  </Text>
                )}
              </div>

              {application.property?.caution_fee && (
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                    Caution Fee
                  </Text>
                  <Text size="sm" fw={500}>
                    ₦{application.property.caution_fee.toLocaleString()}
                  </Text>
                </div>
              )}

              {application.property?.agreement_fee && (
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs">
                    Agreement Fee
                  </Text>
                  <Text size="sm" fw={500}>
                    ₦{application.property.agreement_fee.toLocaleString()}
                  </Text>
                </div>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
