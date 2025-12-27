import {
  Text,
  Group,
  Grid,
  Badge,
  ActionIcon,
  Button,
  Stack,
  Divider,
  Box,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconUser,
  IconHome,
  IconMapPin,
  IconCurrencyNaira,
  IconExternalLink,
  IconCircleNumber1,
  IconCircleNumber2,
  IconCircleNumber3,
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
      fetchApplicationDetails();
    } catch (error) {
      showNotification("error", "Error", "Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteForScreening = async () => {
    setActionLoading(true);
    try {
      await withLoading(createScreening(applicationId!, { bio_data: {} }));
      notifications.show({
        title: "Success",
        message: "Tenant invited for screening",
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

  if (loading)
    return <LoadingSpinner fullScreen label="Loading application details" />;
  if (!application) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: "blue",
      "screening-invited": "yellow",
      "in-progress": "orange",
      completed: "green",
      approved: "green",
      rejected: "red",
      failed: "red",
      "lease-created": "teal",
    };
    return colors[status] || "gray";
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    step,
  }: {
    icon: any;
    title: string;
    step: number;
  }) => (
    <Group gap="sm" mb="xl">
      <Box style={{ color: "#290665", opacity: 0.4 }}>
        {step === 1 && <IconCircleNumber1 size={28} />}
        {step === 2 && <IconCircleNumber2 size={28} />}
        {step === 3 && <IconCircleNumber3 size={28} />}
      </Box>
      <Text fw={800} size="sm" tt="uppercase" lts="1.5px" c="#290665">
        {title}
      </Text>
    </Group>
  );

  const DetailItem = ({ label, value }: { label: string; value: any }) => (
    <Box mb="lg">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={4}>
        {label}
      </Text>
      <Text size="sm" fw={600} c="#1A1A1A">
        {value || "—"}
      </Text>
    </Box>
  );

  return (
    <Box style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      {/* 1. TOP NAV & STATUS */}
      <Group
        justify="space-between"
        mb={60}
        pb="xl"
        style={{ borderBottom: "1px solid #f1f3f5" }}
      >
        <Group gap="xl">
          <ActionIcon
            variant="light"
            size="xl"
            radius="md"
            color="gray"
            onClick={() => navigate(-1)}
          >
            <IconArrowLeft size={22} />
          </ActionIcon>
          <Stack gap={2}>
            <Title
              order={1}
              fw={900}
              style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}
            >
              Application Review
            </Title>
            <Text c="dimmed" size="sm" fw={500}>
              Reference: {applicationId?.toUpperCase()}
            </Text>
          </Stack>
        </Group>

        <Badge
          color={getStatusColor(application.status)}
          size="xl"
          variant="filled"
          radius="sm"
          px="xl"
          h={45}
        >
          {application.status?.replace("-", " ")}
        </Badge>
      </Group>

      <Grid gutter={80}>
        {/* LEFT COLUMN: PRIMARY INFO */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap={60}>
            {/* SECTION: APPLICANT */}
            <Box>
              <Group justify="space-between" align="center" mb="xl">
                <SectionHeader
                  icon={IconUser}
                  title="Applicant Identity"
                  step={1}
                />
                <Button
                  variant="outline"
                  color="#290665"
                  size="xs"
                  radius="md"
                  rightSection={<IconExternalLink size={14} />}
                  onClick={() =>
                    navigate(
                      `/property-owner/applications/applicants/${application.applicant.id}`
                    )
                  }
                >
                  View Dossier
                </Button>
              </Group>

              <Box
                style={{ borderLeft: "3px solid #f1f3f5", paddingLeft: "24px" }}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <DetailItem
                      label="Full Legal Name"
                      value={`${application.applicant.firstName} ${application.applicant.lastName}`}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <DetailItem
                      label="Email Address"
                      value={application.applicant.email}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <DetailItem
                      label="Primary Phone"
                      value={application.applicant.phone_number}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <DetailItem
                      label="Current Occupation"
                      value={application.applicant.occupation}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>

            {/* SECTION: PROPERTY */}
            <Box>
              <SectionHeader
                icon={IconHome}
                title="Property Assignment"
                step={2}
              />
              <Box
                style={{ borderLeft: "3px solid #f1f3f5", paddingLeft: "24px" }}
              >
                <Text size="xl" fw={800} mb={6} c="#290665">
                  {application.property?.name}
                </Text>
                <Group gap={6} mb="2rem">
                  <IconMapPin size={16} color="#adb5bd" />
                  <Text size="sm" c="dimmed" fw={500}>
                    {[
                      application.property?.street,
                      application.property?.city,
                      application.property?.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </Group>

                <Grid gutter="xl">
                  <Grid.Col span={3}>
                    <DetailItem
                      label="Bedrooms"
                      value={application.property?.bedrooms}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <DetailItem
                      label="Bathrooms"
                      value={application.property?.bathrooms}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <DetailItem
                      label="Total Area"
                      value={`${formatAmount(
                        application.property?.size_sqft
                      )} sqft`}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <DetailItem
                      label="Furnishing"
                      value={
                        application.property?.furnished
                          ? "Fully Furnished"
                          : "Unfurnished"
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>

            {/* SECTION: MESSAGE */}
            {application.message && (
              <Box>
                <SectionHeader
                  icon={IconUser}
                  title="Personal Statement"
                  step={3}
                />
                <Box
                  p="xl"
                  style={{
                    backgroundColor: "#F8F9FE",
                    borderRadius: "12px",
                    borderLeft: "4px solid #290665",
                  }}
                >
                  <Text
                    size="sm"
                    c="#4A4A4A"
                    style={{ lineHeight: 1.6, fontStyle: "italic" }}
                  >
                    "{application.message}"
                  </Text>
                </Box>
              </Box>
            )}
          </Stack>
        </Grid.Col>

        {/* RIGHT COLUMN: STICKY ACTIONS */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap={40} style={{ position: "sticky", top: "20px" }}>
            {/* ACTION CARD */}
            <Box
              p="xl"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e9ecef",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <Text
                fw={900}
                size="xs"
                tt="uppercase"
                lts="1.2px"
                mb="xl"
                c="dimmed"
              >
                Decision Center
              </Text>

              <Stack gap="md">
                {application.status === "received" && (
                  <>
                    <Button
                      color="#290665"
                      h={50}
                      radius="md"
                      fullWidth
                      loading={actionLoading}
                      onClick={handleInviteForScreening}
                    >
                      Invite for Screening
                    </Button>
                    <Button
                      variant="subtle"
                      color="red"
                      fullWidth
                      loading={actionLoading}
                      onClick={handleRejectApplication}
                    >
                      Decline Application
                    </Button>
                  </>
                )}

                {(application.status === "completed" ||
                  application.status === "approved") && (
                  <Button
                    color="green"
                    h={50}
                    radius="md"
                    fullWidth
                    onClick={() =>
                      navigate(`/property-owner/leases/create/${applicationId}`)
                    }
                  >
                    Generate Lease Agreement
                  </Button>
                )}

                {application.status === "screening-invited" && (
                  <Box
                    ta="center"
                    p="md"
                    style={{ background: "#FFF9DB", borderRadius: "8px" }}
                  >
                    <Text size="xs" fw={700} c="#E67700">
                      AWAITING TENANT RESPONSE
                    </Text>
                    <Text size="xs" c="#E67700">
                      Invitation was sent to applicant.
                    </Text>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* FINANCIAL SUMMARY */}
            <Box px="xl">
              <Group gap="xs" mb="xl">
                <IconCurrencyNaira size={20} color="#290665" />
                <Text fw={800} size="xs" tt="uppercase" lts="1px">
                  Financial Details
                </Text>
              </Group>

              <Stack gap="lg">
                <Box>
                  <Text size="xs" c="dimmed" fw={700} mb={4}>
                    EXPECTED RENT
                  </Text>
                  <Text size="26px" fw={900} c="#290665">
                    ₦{application.property?.rent_amount?.toLocaleString()}
                    <Text span size="sm" c="dimmed" fw={600} ml={4}>
                      / {application.property?.payment_structure || "year"}
                    </Text>
                  </Text>
                </Box>

                <Divider variant="dashed" />

                <Grid>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" fw={700} mb={4}>
                      CAUTION FEE
                    </Text>
                    <Text size="sm" fw={700}>
                      ₦
                      {application.property?.caution_fee?.toLocaleString() ||
                        "0"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" fw={700} mb={4}>
                      LEGAL/AGREE
                    </Text>
                    <Text size="sm" fw={700}>
                      ₦
                      {application.property?.agreement_fee?.toLocaleString() ||
                        "0"}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
