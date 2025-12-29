import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Group,
  Pagination,
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Card,
  Grid,
  Text,
  Title,
  Button,
  Menu,
  Tooltip,
  Avatar,
  Stack,
  Box,
  useMatches,
  Divider,
  Paper,
} from "@mantine/core";
import {
  IconSearch,
  IconRefresh,
  IconEye,
  IconMessage,
  IconMail,
  IconDotsVertical,
  IconUsers,
  IconCalendarEvent,
  IconBriefcase,
  IconCircleCheckFilled,
  IconAlertCircle,
} from "@tabler/icons-react";
import EmptyState from "../../../../components/EmptyState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { formatDate } from "../../../../utils/helpers";
import { useLoading } from "../../../../hooks/useLoading";

const ApplicantCard = ({
  applicant,
  onAction,
}: {
  applicant: any;
  onAction: (action: string, id: string) => void;
}) => {
  return (
    <Paper p="md" radius="md" withBorder style={{ backgroundColor: "#fff" }}>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="sm">
            <Avatar size={45} radius="md" color="indigo" variant="light">
              {applicant.firstName?.[0]}
              {applicant.lastName?.[0]}
            </Avatar>
            <Box>
              <Text size="sm" fw={700} c="gray.9">
                {applicant.firstName} {applicant.lastName}
              </Text>
              <Text size="xs" c="dimmed">
                {applicant.email}
              </Text>
            </Box>
          </Group>
          <Badge
            variant="dot"
            color={applicant.is_verified ? "green" : "orange"}
            size="sm"
          >
            {applicant.is_verified ? "Verified" : "Pending"}
          </Badge>
        </Group>

        <Divider variant="dashed" />

        <Grid gutter="xs">
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed" fw={500}>
              Total Applications
            </Text>
            <Text size="sm" fw={600}>
              {applicant.total_applications || 0}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed" fw={500}>
              Member Since
            </Text>
            <Text size="sm" fw={600}>
              {formatDate(applicant.joined_at)}
            </Text>
          </Grid.Col>
        </Grid>

        <Button.Group>
          <Button
            fullWidth
            variant="light"
            color="indigo"
            size="xs"
            leftSection={<IconEye size={14} />}
            onClick={() => onAction("view", applicant.id)}
          >
            View
          </Button>
          <Button
            fullWidth
            variant="light"
            color="gray"
            size="xs"
            leftSection={<IconMessage size={14} />}
            onClick={() => onAction("message", applicant.id)}
          >
            Chat
          </Button>
        </Button.Group>
      </Stack>
    </Paper>
  );
};

const ApplicantTableRow = ({
  applicant,
  onAction,
}: {
  applicant: any;
  onAction: (action: string, id: string) => void;
}) => {
  return (
    <Box
      component="tr"
      style={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[1]}`,
        "&:hover": { backgroundColor: theme.colors.gray[0] },
        transition: "background-color 0.2s ease",
      })}
    >
      <td style={{ padding: "16px" }}>
        <Group gap="sm">
          <Avatar size={36} radius="md" color="indigo" variant="light" fw={600}>
            {applicant.firstName?.[0]}
            {applicant.lastName?.[0]}
          </Avatar>
          <Box>
            <Text size="sm" fw={600} className="leading-tight">
              {applicant.firstName} {applicant.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {applicant.email}
            </Text>
          </Box>
        </Group>
      </td>
      <td style={{ padding: "16px" }}>
        <Text size="sm" c="gray.7">
          {applicant.phone_number || "—"}
        </Text>
      </td>
      <td style={{ padding: "16px" }}>
        <Group gap={4}>
          <IconBriefcase size={14} color="#868e96" />
          <Text size="sm" c="gray.7">
            {applicant.occupation || "N/A"}
          </Text>
        </Group>
      </td>
      <td style={{ padding: "16px" }}>
        <Badge variant="light" color="indigo" radius="sm">
          {applicant.total_applications || 0}
        </Badge>
      </td>
      <td style={{ padding: "16px" }}>
        {applicant.is_verified ? (
          <Group gap={4}>
            <IconCircleCheckFilled size={16} color="#40c057" />
            <Text size="xs" fw={500} c="green.7">
              Verified
            </Text>
          </Group>
        ) : (
          <Group gap={4}>
            <IconAlertCircle size={16} color="#fab005" />
            <Text size="xs" fw={500} c="orange.7">
              Unverified
            </Text>
          </Group>
        )}
      </td>
      <td style={{ padding: "16px" }}>
        <Group gap={4}>
          <IconCalendarEvent size={14} color="#868e96" />
          <Text size="sm" c="gray.7">
            {formatDate(applicant.joined_at)}
          </Text>
        </Group>
      </td>
      <td style={{ padding: "16px" }}>
        <Group gap="xs" justify="flex-end">
          <Tooltip label="View Details" withArrow>
            <ActionIcon
              variant="subtle"
              color="indigo"
              onClick={() => onAction("view", applicant.id)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Menu
            shadow="sm"
            width={160}
            position="bottom-end"
            transitionProps={{ transition: "pop" }}
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item
                leftSection={<IconMessage size={14} />}
                onClick={() => onAction("message", applicant.id)}
              >
                Message
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMail size={14} />}
                onClick={() => onAction("email", applicant.id)}
              >
                Send Email
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </Box>
  );
};

function Applicants() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<string | null>(
    null
  );
  const { loading, withLoading } = useLoading();
  const { getApplicants } = useLandlordOperations();
  const isMobile = useMatches({ base: true, md: false });

  const fetchApplicants = async () => {
    try {
      const response = await withLoading(getApplicants());
      setApplicants(response.applicants || []);
      setFilteredApplicants(response.applicants || []);
    } catch (error) {
      setApplicants([]);
    }
  };

  useEffect(() => {
    let filtered = applicants;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q)
      );
    }
    if (verificationFilter === "verified")
      filtered = filtered.filter((a) => a.is_verified);
    if (verificationFilter === "unverified")
      filtered = filtered.filter((a) => !a.is_verified);
    setFilteredApplicants(filtered);
  }, [applicants, searchQuery, verificationFilter]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleAction = (action: string, id: string) => {
    if (action === "view")
      navigate(`/property-owner/applications/applicants/${id}`);
    if (action === "message") navigate(`/property-owner/messages?tenant=${id}`);
    if (action === "email") {
      const app = applicants.find((a) => a.id === id);
      if (app?.email) window.open(`mailto:${app.email}`);
    }
  };

  return (
    <Box p={isMobile ? "md" : "xl"} bg="#fcfcfd" style={{ minHeight: "100vh" }}>
      {loading ? (
        <LoadingSpinner label="Loading secure data..." />
      ) : (
        <Stack gap="xl">
          {/* Header Section */}
          <Group justify="space-between" align="flex-end">
            <Box>
              <Title order={2} fw={800} style={{ letterSpacing: "-0.5px" }}>
                Applicants
              </Title>
              <Text size="sm" c="dimmed" fw={500}>
                Manage your prospective tenant directory
              </Text>
            </Box>
            <Button
              variant="white"
              color="gray"
              leftSection={<IconRefresh size={16} />}
              onClick={fetchApplicants}
              size="sm"
            >
              Refresh List
            </Button>
          </Group>

          {/* Filter Bar */}
          <Paper p="md" radius="md" withBorder shadow="none">
            <Grid align="flex-end">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <TextInput
                  placeholder="Search name, email, or phone..."
                  leftSection={<IconSearch size={18} stroke={1.5} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="filled"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  placeholder="Filter status"
                  data={[
                    { value: "all", label: "All Applicants" },
                    { value: "verified", label: "Verified Only" },
                    { value: "unverified", label: "Unverified Only" },
                  ]}
                  value={verificationFilter}
                  onChange={(v) =>
                    setVerificationFilter(v === "all" ? null : v)
                  }
                  variant="filled"
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Content Area */}
          {filteredApplicants.length > 0 ? (
            isMobile ? (
              <Stack gap="md">
                {filteredApplicants.map((app) => (
                  <ApplicantCard
                    key={app.id}
                    applicant={app}
                    onAction={handleAction}
                  />
                ))}
              </Stack>
            ) : (
              <Paper radius="md" withBorder style={{ overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <Box component="thead" bg="gray.0">
                    <tr>
                      {[
                        "Applicant",
                        "Phone",
                        "Occupation",
                        "Applications",
                        "Security Status",
                        "Joined Date",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "12px 16px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#495057",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </Box>
                  <tbody>
                    {filteredApplicants.map((app) => (
                      <ApplicantTableRow
                        key={app.id}
                        applicant={app}
                        onAction={handleAction}
                      />
                    ))}
                  </tbody>
                </table>
              </Paper>
            )
          ) : (
            <Paper
              p={50}
              radius="md"
              withBorder
              style={{ textAlign: "center", borderStyle: "dashed" }}
            >
              <IconUsers size={40} color="#adb5bd" stroke={1.5} />
              <Text fw={600} mt="md">
                No results found
              </Text>
              <Text size="sm" c="dimmed">
                Try adjusting your search or filters to find what you're looking
                for.
              </Text>
            </Paper>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default Applicants;
