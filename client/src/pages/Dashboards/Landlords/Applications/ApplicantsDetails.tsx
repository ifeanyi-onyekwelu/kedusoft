import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IconDownload,
  IconMail,
  IconPhone,
  IconIdBadge,
  IconHome,
  IconCircleCheck,
  IconCircleX,
  IconBriefcase,
  IconMapPin,
  IconArrowLeft,
  IconExternalLink,
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
  ActionIcon,
  Box,
} from "@mantine/core";
import { formatDate } from "../../../../utils/helpers";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useLoading } from "../../../../hooks/useLoading";
import { useLandlordOperations } from "../../../../apis/landlordApi";

function ApplicantDetails() {
  const { id } = useParams();
  const { loading, withLoading } = useLoading();
  const [applicantData, setApplicantData] = useState<any>(null);
  const navigate = useNavigate();
  const { getApplicant } = useLandlordOperations();

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

  if (loading || !applicantData) return <LoadingSpinner fullScreen />;

  const { applicant, applications } = applicantData;

  // Professional Data Component
  const DataField = ({ label, value, icon: Icon }: any) => (
    <Box mb="md">
      <Group gap={6} mb={2}>
        {Icon && <Icon size={14} color="#adb5bd" />}
        <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.5px">
          {label}
        </Text>
      </Group>
      <Text size="sm" fw={500} c="#1A1A1A">
        {value || "Not Specified"}
      </Text>
    </Box>
  );

  return (
    <Box style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      {/* HEADER NAVIGATION */}
      <Group justify="space-between" mb={40}>
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          px={0}
          styles={{ label: { fontWeight: 500 } }}
        >
          Back to Applicants
        </Button>
        <Group gap="md">
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconDownload size={16} />}
          >
            Export Profile
          </Button>
          <Button variant="filled" color="#290665" px="xl">
            Message Applicant
          </Button>
        </Group>
      </Group>

      {/* HERO SECTION */}
      <Group align="center" gap={30} mb={50}>
        <Avatar
          src={applicant.profile_photo}
          size={100}
          radius={100}
          styles={{ placeholder: { backgroundColor: "#f1f3f5" } }}
        >
          {applicant.firstName?.[0]}
          {applicant.lastName?.[0]}
        </Avatar>
        <Box>
          <Text
            size="xl"
            fw={800}
            style={{ fontSize: "2rem", lineHeight: 1.1 }}
            mb={8}
          >
            {applicant.firstName} {applicant.lastName}
          </Text>
          <Group gap="lg">
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
            <Badge
              variant="dot"
              color={applicant.is_active ? "green" : "gray"}
              size="sm"
            >
              {applicant.is_active ? "Active" : "Inactive"}
            </Badge>
          </Group>
        </Box>
      </Group>

      <Grid gutter={60}>
        {/* LEFT COLUMN: Deep Details */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap={40}>
            {/* EMPLOYMENT SECTION */}
            <Box>
              <Text fw={800} size="sm" tt="uppercase" lts="1px" mb="xl">
                Background & Financials
              </Text>
              <Grid>
                <Grid.Col span={6}>
                  <DataField
                    label="Occupation"
                    value={applicant.occupation}
                    icon={IconBriefcase}
                  />
                  <DataField
                    label="Current Employer"
                    value={applicant.employer_name}
                  />
                  <DataField
                    label="Employment Status"
                    value={applicant.employment_status}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DataField
                    label="Monthly Net Income"
                    value={`₦${Number(
                      applicant.monthly_income
                    ).toLocaleString()}`}
                  />
                  <DataField
                    label="Annual Gross"
                    value={`₦${Number(
                      applicant.annual_income
                    ).toLocaleString()}`}
                  />
                  <DataField
                    label="Marital Status"
                    value={applicant.marital_status}
                  />
                </Grid.Col>
              </Grid>
            </Box>

            <Divider />

            {/* APPLICATIONS SECTION */}
            <Box>
              <Text fw={800} size="sm" tt="uppercase" lts="1px" mb="xl">
                Active Rental Requests
              </Text>
              <Stack gap="xs">
                {applications.map((app: any) => (
                  <Group
                    key={app.id}
                    justify="space-between"
                    py="md"
                    style={{ borderBottom: "1px solid #f1f3f5" }}
                  >
                    <Group gap="md">
                      <IconHome size={20} color="#290665" />
                      <div>
                        <Text fw={600} size="sm">
                          {app.property?.address}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Submitted {formatDate(app.created_at)}
                        </Text>
                      </div>
                    </Group>
                    <Button
                      component={Link}
                      to={`/property-owner/applications/${app.id}/${app.property.id}`}
                      variant="subtle"
                      color="blue"
                      size="xs"
                      rightSection={<IconExternalLink size={14} />}
                    >
                      View
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid.Col>

        {/* RIGHT COLUMN: Verification & Documents */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap={40}>
            {/* VERIFICATION */}
            <Box>
              <Text fw={800} size="xs" tt="uppercase" lts="1px" mb="lg">
                Identity Status
              </Text>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Identity Verified
                  </Text>
                  {applicant.is_verified ? (
                    <IconCircleCheck color="#40C057" size={18} />
                  ) : (
                    <IconCircleX color="#FA5252" size={18} />
                  )}
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Email Verified
                  </Text>
                  {applicant.is_email_verified ? (
                    <IconCircleCheck color="#40C057" size={18} />
                  ) : (
                    <IconCircleX color="#FA5252" size={18} />
                  )}
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Member Since
                  </Text>
                  <Text size="xs" fw={700}>
                    {formatDate(applicant.joined_at)}
                  </Text>
                </Group>
              </Stack>
            </Box>

            {/* DOCUMENTS LIST */}
            <Box>
              <Text fw={800} size="xs" tt="uppercase" lts="1px" mb="lg">
                Stored Documents
              </Text>
              <Stack gap={4}>
                {[
                  { name: "Identity Card", field: applicant.identity_card },
                  { name: "National ID", field: applicant.national_id_card },
                ].map(
                  (doc, idx) =>
                    doc.field && (
                      <Group key={idx} justify="space-between" py={8}>
                        <Group gap="xs">
                          <IconIdBadge size={16} color="#adb5bd" />
                          <Text size="sm" fw={500}>
                            {doc.name}
                          </Text>
                        </Group>
                        <ActionIcon size="sm" variant="subtle" color="gray">
                          <IconDownload size={14} />
                        </ActionIcon>
                      </Group>
                    )
                )}
              </Stack>
            </Box>

            {/* LOCATION */}
            <Box>
              <Group gap={6} mb="sm">
                <IconMapPin size={14} color="#adb5bd" />
                <Text fw={800} size="xs" tt="uppercase" lts="1px">
                  Current Residence
                </Text>
              </Group>
              <Text size="sm" fw={500} lh={1.4}>
                {applicant.street_address}
                <br />
                {applicant.city}, {applicant.state}
              </Text>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default ApplicantDetails;
