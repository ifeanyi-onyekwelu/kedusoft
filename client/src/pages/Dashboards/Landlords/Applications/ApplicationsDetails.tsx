import {
  Text,
  Group,
  Grid,
  Badge,
  ActionIcon,
  Button,
  Stack,
  Box,
  Title,
  Paper,
  Container,
  ThemeIcon,
  Avatar,
  Divider,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconHome,
  IconMapPin,
  IconCurrencyNaira,
  IconExternalLink,
  IconDownload,
  IconUser,
  IconBriefcase,
  IconMail,
  IconPhone,
  IconMaximize,
  IconBed,
  IconBath,
  IconFileDescription,
  IconShieldCheck,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { useLoading } from "../../../../hooks/useLoading";
import { BrandedLoader } from "../../../../components/LoadingSpinner";
import formatAmount from "../../../../utils/helpers";
import { showNotification } from "../../../../utils/helpers";
import { TextBounds } from "html2canvas/dist/types/css/layout/text";

// Brand Colors
const PRIMARY_COLOR = "#290665";
const ACCENT_BG = "#F3F0FF"; // Light Lavender

export default function ApplicationsDetails() {
  const { applicationId, propertyId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const { loading, withLoading } = useLoading();
  const [actionLoading, setActionLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { getApplication, createScreening, rejectApplication } =
    useLandlordOperations();

  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F9FAFB", // Ensure background matches
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Application_${applicationId}.pdf`);
    } catch (err) {
      showNotification("error", "Export Failed", "Could not generate PDF");
    } finally {
      setIsExporting(false);
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
        message: "Tenant invited",
        color: "green",
      });
      fetchApplicationDetails();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Invite failed",
        color: "red",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <BrandedLoader fullScreen />;
  if (!application) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: "blue",
      "screening-invited": "yellow",
      completed: "green",
      approved: "teal",
      rejected: "red",
    };
    return colors[status] || "gray";
  };

  return (
    <Box bg="#F3F4F6" mih="100vh" py={{ base: 20, md: 40 }}>
      <Container size="xl">
        {/* HEADER SECTION */}
        <Group justify="space-between" align="flex-start" mb={40}>
          <Group gap="lg">
            <ActionIcon
              variant="white"
              size={42}
              radius="xl"
              onClick={() => navigate(-1)}
              c={PRIMARY_COLOR}
            >
              <IconArrowLeft size={22} stroke={2} />
            </ActionIcon>
            <Stack gap={2}>
              <Title order={2} fw={800} c={PRIMARY_COLOR}>
                Application Review
              </Title>
              <Text size="sm" c="dimmed" fw={500}>
                Ref: {applicationId?.split("-")[0].toUpperCase()}
              </Text>
            </Stack>
          </Group>

          <Group gap="sm">
            <Button
              variant="default"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportPDF}
              loading={isExporting}
              radius="md"
            >
              Export
            </Button>
            <Badge
              color={getStatusColor(application.status)}
              variant="filled"
              size="lg"
              radius="sm"
              py="sm"
              tt="capitalize"
            >
              {application.status?.replace("-", " ")}
            </Badge>
          </Group>
        </Group>

        <Grid gutter={30} ref={reportRef}>
          {/* LEFT CONTENT */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap={30}>
              {/* APPLICANT IDENTITY CARD */}
              <Paper
                radius="lg"
                p={{ base: 20, md: 30 }}
                shadow="sm"
                withBorder
              >
                <Group justify="space-between" mb={30} align="flex-start">
                  <Group>
                    <Avatar
                      size="lg"
                      radius="xl"
                      color="indigo"
                      name={`${application.applicant.firstName} ${application.applicant.lastName}`}
                    >
                      {application.applicant.firstName[0]}
                      {application.applicant.lastName[0]}
                    </Avatar>
                    <Box>
                      <Text fw={700} size="lg" c={PRIMARY_COLOR}>
                        {application.applicant.firstName}{" "}
                        {application.applicant.lastName}
                      </Text>
                      <Text
                        size="xs"
                        c="dimmed"
                        tt="uppercase"
                        fw={700}
                        lts={1}
                      >
                        Primary Applicant
                      </Text>
                    </Box>
                  </Group>
                  <Button
                    variant="light"
                    color="violet"
                    size="xs"
                    radius="md"
                    rightSection={<IconExternalLink size={14} />}
                    onClick={() =>
                      navigate(
                        `/property-owner/applications/applicants/${application.applicant.id}`
                      )
                    }
                  >
                    View Profile
                  </Button>
                </Group>

                <Grid gutter="lg">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DetailBlock
                      icon={IconBriefcase}
                      label="Occupation"
                      value={application.applicant.occupation}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DetailBlock
                      icon={IconMail}
                      label="Email Address"
                      value={application.applicant.email}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DetailBlock
                      icon={IconPhone}
                      label="Phone Number"
                      value={application.applicant.phone_number}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DetailBlock
                      icon={IconUser}
                      label="Marital Status"
                      value={
                        application.applicant.marital_status || "Not specified"
                      }
                    />
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* PROPERTY DETAILS CARD */}
              <Paper
                radius="lg"
                p={{ base: 20, md: 30 }}
                shadow="sm"
                withBorder
              >
                <Group justify="space-between" mb={20}>
                  <Group gap="xs">
                    <ThemeIcon
                      color="gray"
                      variant="light"
                      size="lg"
                      radius="md"
                    >
                      <IconHome size={18} />
                    </ThemeIcon>
                    <Text fw={700} c={PRIMARY_COLOR}>
                      Property Interest
                    </Text>
                  </Group>
                </Group>

                <Box mb={30}>
                  <Text
                    size="xl"
                    fw={800}
                    c={PRIMARY_COLOR}
                    style={{ lineHeight: 1.2 }}
                  >
                    {application.property?.name}
                  </Text>
                  <Group gap={6} c="dimmed" mt={5}>
                    <IconMapPin size={16} />
                    <Text size="sm" fw={500}>
                      {application.property?.street},{" "}
                      {application.property?.city}
                    </Text>
                  </Group>
                </Box>

                <Paper bg="gray.0" radius="md" p="md" withBorder>
                  <Grid gutter="md">
                    <Grid.Col span={3}>
                      <Stat
                        icon={IconBed}
                        label="Beds"
                        value={application.property?.bedrooms}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Stat
                        icon={IconBath}
                        label="Baths"
                        value={application.property?.bathrooms}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Stat
                        icon={IconMaximize}
                        label="Size"
                        value={`${formatAmount(
                          application.property?.size_sqft
                        )} sqft`}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Stat
                        icon={IconShieldCheck}
                        label="Furnished"
                        value={application.property?.furnished ? "Yes" : "No"}
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>
              </Paper>

              {/* PERSONAL STATEMENT */}
              {application.message && (
                <Paper
                  radius="lg"
                  p={30}
                  bg={ACCENT_BG}
                  shadow="sm"
                  style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                >
                  <Group gap="xs" mb="sm">
                    <IconFileDescription size={18} color={PRIMARY_COLOR} />
                    <Text
                      fw={700}
                      size="xs"
                      c={PRIMARY_COLOR}
                      tt="uppercase"
                      lts={1}
                    >
                      Personal Note
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    c="dark.5"
                    style={{ lineHeight: 1.7, fontStyle: "italic" }}
                  >
                    "{application.message}"
                  </Text>
                </Paper>
              )}
            </Stack>
          </Grid.Col>

          {/* RIGHT SIDEBAR (DECISION & FINANCIALS) */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap={20} style={{ position: "sticky", top: "20px" }}>
              {/* DECISION CENTER */}
              <Paper
                radius="lg"
                shadow="md"
                withBorder
                style={{ overflow: "hidden" }}
              >
                <Box bg={PRIMARY_COLOR} p="md">
                  <Text
                    c="white"
                    fw={700}
                    tt="uppercase"
                    size="xs"
                    lts={1.5}
                    opacity={0.9}
                  >
                    Actions
                  </Text>
                </Box>
                <Stack p="lg" gap="md">
                  {application.status === "received" && (
                    <>
                      <Button
                        fullWidth
                        size="md"
                        color={PRIMARY_COLOR}
                        leftSection={<IconCheck size={18} />}
                        loading={actionLoading}
                        onClick={handleInviteForScreening}
                      >
                        Accept & Screen
                      </Button>
                      <Button
                        fullWidth
                        variant="light"
                        color="red"
                        leftSection={<IconX size={18} />}
                        loading={actionLoading}
                        onClick={handleRejectApplication}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {["completed", "approved"].includes(application.status) && (
                    <Button
                      fullWidth
                      size="md"
                      color="teal"
                      onClick={() =>
                        navigate(
                          `/property-owner/leases/create/${applicationId}`
                        )
                      }
                    >
                      Generate Lease
                    </Button>
                  )}
                  {!["received", "completed", "approved"].includes(
                    application.status
                  ) && (
                    <Group gap="xs" justify="center" py="sm">
                      <BrandedLoader />
                      <Text size="sm" c="dimmed">
                        Processing screening...
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Paper>

              {/* FINANCIAL CARD */}
              <Paper radius="lg" p="lg" shadow="sm" withBorder>
                <Group gap="xs" mb={20}>
                  <ThemeIcon color="green" variant="light" size="md">
                    <IconCurrencyNaira size={16} />
                  </ThemeIcon>
                  <Text fw={700} size="sm" c="dark.4">
                    Financials
                  </Text>
                </Group>

                <Stack gap="md">
                  <Box>
                    <Text size="xs" c="dimmed" fw={700} mb={4} tt="uppercase">
                      Rent Value
                    </Text>
                    <Group gap={4} align="flex-end">
                      <Text>
                        ₦{application.property?.rent_amount?.toLocaleString()}
                      </Text>
                      <Text size="xs" c="dimmed" fw={600} mb={3}>
                        / {application.property?.payment_structure || "year"}
                      </Text>
                    </Group>
                  </Box>

                  <Divider />

                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="xs" c="dimmed" fw={700}>
                        CAUTION
                      </Text>
                      <Text size="sm" fw={600}>
                        ₦
                        {application.property?.caution_fee?.toLocaleString() ||
                          "0"}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="xs" c="dimmed" fw={700}>
                        LEGAL
                      </Text>
                      <Text size="sm" fw={600}>
                        ₦
                        {application.property?.agreement_fee?.toLocaleString() ||
                          "0"}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}

// ------ SUB-COMPONENTS ------

const DetailBlock = ({ icon: Icon, label, value }: any) => (
  <Group gap="md" align="flex-start" wrap="nowrap">
    <ThemeIcon
      variant="light"
      color="gray"
      size="lg"
      radius="md"
      style={{ flexShrink: 0 }}
    >
      <Icon size={18} stroke={1.5} color="#4B5563" />
    </ThemeIcon>
    <Box style={{ minWidth: 0 }}>
      <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={0.5}>
        {label}
      </Text>
      <Text
        size="sm"
        fw={600}
        c="dark.4"
        style={{ wordBreak: "break-word", lineHeight: 1.4 }}
      >
        {value || "—"}
      </Text>
    </Box>
  </Group>
);

const Stat = ({ icon: Icon, label, value }: any) => (
  <Stack gap={2} align="center">
    <Icon size={18} color="#909296" />
    <Text size="xs" c="dimmed" fw={600}>
      {label}
    </Text>
    <Text size="sm" fw={700} c="dark.6">
      {value}
    </Text>
  </Stack>
);
