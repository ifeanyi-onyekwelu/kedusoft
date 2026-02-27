import { useEffect, useState, useRef } from "react"; // Added useRef
import { useParams, useNavigate } from "react-router-dom";
import {
  IconDownload,
  IconMail,
  IconPhone,
  IconHome,
  IconCircleCheck,
  IconCircleX,
  IconBriefcase,
  IconMapPin,
  IconArrowLeft,
  IconCash,
  IconCalendarEvent,
  IconUserCheck,
} from "@tabler/icons-react";
import {
  Avatar,
  Text,
  Group,
  Stack,
  Button,
  Badge,
  Divider,
  Grid,
  Box,
  Paper,
  ThemeIcon,
  Container,
} from "@mantine/core";
import { formatDate } from "@/utils/helpers";
import { BrandedLoader } from "@/components/LoadingSpinner";
import { useLoading } from "@/hooks/useLoading";
import { useLandlordOperations } from "@/apis/landlordApi";
import axiosInstance from "@/apis/axiosInstance.tsx";
import {toast} from "react-hot-toast"

function ApplicantDetails() {
  const { id } = useParams();
  const { loading, withLoading } = useLoading();
  const [applicantData, setApplicantData] = useState<any>(null);
  const [exporting, setExporting] = useState(false); // Local loading state for PDF
  const navigate = useNavigate();
  const { getApplicant } = useLandlordOperations();

  // Reference for the PDF generator
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await withLoading(getApplicant(id!));
        setApplicantData(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplicantDetails();
  }, [id]);

  const handleDownload = async () => {
    setExporting(true);
    try {
      const response = await axiosInstance.get(`/property-owner/applications/applicants/${id}/download`, { responseType: "blob"});

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `Applicant_Profile_${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5. Clean up the URL object to save memory
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (error) {
      console.log("Error exporting data", error)
      toast.error("Failed to export applicant data")
    } finally {
      setExporting(false)
    }
  }

  if (loading || !applicantData) return <BrandedLoader inDashboard={true} label="Looking for applicant..." />;

  const { applicant, applications } = applicantData;

  const DataField = ({ label, value, icon: Icon }: any) => (
    <Box p="sm" style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
      <Group gap={6} mb={4}>
        {Icon && <Icon size={14} color="#74c0fc" />}
        <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.5px">
          {label}
        </Text>
      </Group>
      <Text size="sm" fw={600} c="dark.4">
        {value || "Not Specified"}
      </Text>
    </Box>
  );

  return (
    <Box bg="#f4f6f8" p={20}>
      <Container size="xl">
        {/* TOP NAV BAR - Hidden during export if needed, but here we just trigger the function */}
        <Group justify="space-between" px={10}>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Back to Applicants
          </Button>
          <Group gap="sm">
            <Button
              variant="white"
              color="gray"
              onClick={handleDownload}
              loading={exporting}
              leftSection={<IconDownload size={16} />}
            >
              {exporting ? "Generating..." : "Export PDF"}
            </Button>
            <Button variant="filled" bg="#290665" px="xl">
              Message Applicant
            </Button>
          </Group>
        </Group>

        {/* The Ref starts here so the PDF includes all details */}
        <div ref={reportRef} style={{ padding: "10px" }}>
          {/* HERO CARD */}
          <Paper shadow="sm" radius="md" p={30} mb="xl" withBorder>
            <Group align="center" gap={30}>
              <Avatar
                src={applicant.profile_photo}
                size={120}
                radius={120}
                variant="filled"
                color="#290665"
              >
                {applicant.firstName?.[0]}
                {applicant.lastName?.[0]}
              </Avatar>
              <Box style={{ flex: 1 }}>
                <Group justify="space-between" align="flex-start">
                  <Box>
                    <Title
                      order={1}
                      style={{ fontSize: "2.2rem", fontWeight: 900 }}
                      mb={4}
                    >
                      {applicant.firstName} {applicant.lastName}
                    </Title>
                    <Group gap="xl">
                      <Group gap={6}>
                        <IconMail size={16} color="#adb5bd" />
                        <Text size="sm" fw={500}>
                          {applicant.email}
                        </Text>
                      </Group>
                      <Group gap={6}>
                        <IconPhone size={16} color="#adb5bd" />
                        <Text size="sm" fw={500}>
                          {applicant.phone_number}
                        </Text>
                      </Group>
                    </Group>
                  </Box>
                  <Badge
                    variant="light"
                    color={applicant.is_active ? "green" : "gray"}
                    size="lg"
                    radius="sm"
                    h={32}
                  >
                    {applicant.is_active ? "Active Member" : "Inactive"}
                  </Badge>
                </Group>
              </Box>
            </Group>
          </Paper>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                <Paper shadow="xs" radius="md" p="xl" withBorder>
                  <Group mb="xl">
                    <ThemeIcon variant="light" color="blue" size="lg">
                      <IconCash size={20} />
                    </ThemeIcon>
                    <Text fw={800} size="sm" tt="uppercase" lts="1px">
                      Background & Financials
                    </Text>
                  </Group>

                  <Grid>
                    <Grid.Col span={6}>
                      <DataField
                        label="Occupation"
                        value={applicant.occupation}
                        icon={IconBriefcase}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DataField
                        label="Employer"
                        value={applicant.employer_name}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DataField
                        label="Employment"
                        value={applicant.employment_status}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DataField
                        label="Marital Status"
                        value={applicant.marital_status}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DataField
                        label="Monthly Net Income"
                        value={`₦${Number(
                          applicant.monthly_income
                        ).toLocaleString()}`}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <DataField
                        label="Annual Gross"
                        value={`₦${Number(
                          applicant.annual_income
                        ).toLocaleString()}`}
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>

                <Paper shadow="xs" radius="md" p="xl" withBorder>
                  <Group mb="xl">
                    <ThemeIcon variant="light" color="grape" size="lg">
                      <IconHome size={20} />
                    </ThemeIcon>
                    <Text fw={800} size="sm" tt="uppercase" lts="1px">
                      Active Rental Requests
                    </Text>
                  </Group>

                  <Stack gap="sm">
                    {applications.map((app: any) => (
                      <Box
                        key={app.id}
                        p="md"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #f1f3f5",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Group justify="space-between">
                          <Group gap="md">
                            <Avatar radius="md" color="blue" variant="light">
                              <IconHome size={20} />
                            </Avatar>
                            <div>
                              <Text fw={700} size="sm">
                                {app.property?.address}
                              </Text>
                              <Text size="xs" c="dimmed">
                                Submitted {formatDate(app.created_at)}
                              </Text>
                            </div>
                          </Group>
                        </Group>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xl">
                <Paper shadow="xs" radius="md" p="xl" withBorder bg="#fff">
                  <Text
                    fw={800}
                    size="xs"
                    tt="uppercase"
                    lts="1px"
                    mb="lg"
                    c="dimmed"
                  >
                    Trust Score & Verification
                  </Text>
                  <Stack gap="md">
                    <VerificationRow
                      label="Identity Verified"
                      verified={applicant.is_verified}
                    />
                    <VerificationRow
                      label="Email Verified"
                      verified={applicant.is_email_verified}
                    />
                    <Divider variant="dashed" />
                    <Group justify="space-between">
                      <Group gap={8}>
                        <IconCalendarEvent size={16} color="#adb5bd" />
                        <Text size="sm" c="dimmed">
                          Member Since
                        </Text>
                      </Group>
                      <Text size="xs" fw={700}>
                        {formatDate(applicant.joined_at)}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>

                <Paper shadow="xs" radius="md" p="xl" withBorder bg="#290665">
                  <Group gap={6} mb="sm">
                    <IconMapPin size={16} color="#fff" />
                    <Text fw={800} size="xs" tt="uppercase" lts="1px" c="white">
                      Current Residence
                    </Text>
                  </Group>
                  <Text size="sm" fw={400} c="white" lh={1.6} opacity={0.9}>
                    {applicant.street_address}
                    <br />
                    {applicant.city}, {applicant.state}
                  </Text>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </div>
      </Container>
    </Box>
  );
}

const VerificationRow = ({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) => (
  <Group justify="space-between">
    <Group gap={8}>
      <IconUserCheck size={16} color={verified ? "#40C057" : "#adb5bd"} />
      <Text size="sm" c="dimmed">
        {label}
      </Text>
    </Group>
    {verified ? (
      <IconCircleCheck color="#40C057" size={18} />
    ) : (
      <IconCircleX color="#FA5252" size={18} />
    )}
  </Group>
);

const Title = ({ children, order, style, mb }: any) => (
  <Text style={style} mb={mb} size="xl" fw={900}>
    {children}
  </Text>
);

export default ApplicantDetails;
