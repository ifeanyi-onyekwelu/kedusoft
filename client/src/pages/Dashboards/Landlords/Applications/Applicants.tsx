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
} from "@mantine/core";
import {
  IconSearch,
  IconRefresh,
  IconEye,
  IconMessage,
  IconUser,
  IconMail,
  IconPhone,
  IconDotsVertical,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";
import EmptyState from "../../../../components/EmptyState";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { formatDate } from "../../../../utils/helpers";
import { useLoading } from "../../../../hooks/useLoading";

// Mobile Card Component for Applicants
const ApplicantCard = ({
  applicant,
  onAction,
}: {
  applicant: any;
  onAction: (action: string, id: string) => void;
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
      <Stack gap="md">
        {/* Header with Applicant Info */}
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <Avatar size={50} radius="md" color="blue">
              {applicant.firstName?.[0]}
              {applicant.lastName?.[0]}
            </Avatar>
            <Box>
              <Text size="md" fw={600}>
                {applicant.firstName} {applicant.lastName}
              </Text>
              <Text size="sm" c="dimmed">
                {applicant.email}
              </Text>
              {applicant.phone_number && (
                <Text size="sm" c="dimmed">
                  {applicant.phone_number}
                </Text>
              )}
            </Box>
          </Group>
          <Badge
            color={applicant.is_verified ? "green" : "orange"}
            variant="light"
            size="sm"
          >
            {applicant.is_verified ? "Verified" : "Unverified"}
          </Badge>
        </Group>

        {/* Stats */}
        <Grid>
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Applications
            </Text>
            <Text size="lg" fw={700} c="blue">
              {applicant.total_applications || 0}
            </Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Member Since
            </Text>
            <Text size="sm" fw={500}>
              {formatDate(applicant.joined_at)}
            </Text>
          </Grid.Col>
        </Grid>

        {/* Action Buttons */}
        <Group gap="sm" justify="space-between">
          <Group gap="sm">
            <Button
              variant="light"
              color="blue"
              size="sm"
              leftSection={<IconEye size={16} />}
              onClick={() => onAction("view", applicant.id)}
            >
              View Details
            </Button>
            <Button
              variant="light"
              color="green"
              size="sm"
              leftSection={<IconMessage size={16} />}
              onClick={() => onAction("message", applicant.id)}
            >
              Message
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};

// Desktop Table Row Component
const ApplicantTableRow = ({
  applicant,
  onAction,
}: {
  applicant: any;
  onAction: (action: string, id: string) => void;
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <Group gap="sm">
          <Avatar size={40} radius="md" color="blue">
            {applicant.firstName?.[0]}
            {applicant.lastName?.[0]}
          </Avatar>
          <Box>
            <Text size="sm" fw={500}>
              {applicant.firstName} {applicant.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {applicant.email}
            </Text>
          </Box>
        </Group>
      </td>
      <td className="p-4">
        <Text size="sm">{applicant.phone_number || "N/A"}</Text>
      </td>
      <td className="p-4">
        <Text size="sm">{applicant.occupation || "N/A"}</Text>
      </td>
      <td className="p-4">
        <Text size="sm" fw={500} c="blue">
          {applicant.total_applications || 0}
        </Text>
      </td>
      <td className="p-4">
        <Badge
          color={applicant.is_verified ? "green" : "orange"}
          variant="light"
          size="sm"
        >
          {applicant.is_verified ? "Verified" : "Unverified"}
        </Badge>
      </td>
      <td className="p-4">
        <Text size="sm">{formatDate(applicant.joined_at)}</Text>
      </td>
      <td className="p-4">
        <Group gap="sm" justify="flex-start">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              size="md"
              onClick={() => onAction("view", applicant.id)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Send Message">
            <ActionIcon
              variant="light"
              color="green"
              size="md"
              onClick={() => onAction("message", applicant.id)}
            >
              <IconMessage size={18} />
            </ActionIcon>
          </Tooltip>
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="light" color="gray" size="md">
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={() => onAction("view", applicant.id)}
              >
                View Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMail size={16} />}
                onClick={() => onAction("email", applicant.id)}
              >
                Send Email
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  );
};

function Applicants() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Record<string, number>>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [verificationFilter, setVerificationFilter] = useState<string | null>(
    null
  );
  const { loading, withLoading } = useLoading();

  // Use responsive breakpoint
  const isMobile = useMatches({
    base: true,
    sm: true,
    md: false,
  });

  const { getApplicants } = useLandlordOperations();

  const fetchApplicants = async (page = 1) => {
    try {
      const response = await withLoading(getApplicants());

      setApplicants(response.applicants || []);
      setFilteredApplicants(response.applicants || []);
      // If API returns pagination info, use it
      // if (response.pagination) {
      //   setPagination(response.pagination);
      // }
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      setApplicants([]);
      setFilteredApplicants([]);
    }
  };

  // Filter applicants based on search and verification status
  useEffect(() => {
    let filtered = applicants;

    if (searchQuery) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.firstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          applicant.lastName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          applicant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.phone_number?.includes(searchQuery)
      );
    }

    if (verificationFilter === "verified") {
      filtered = filtered.filter((applicant) => applicant.is_verified);
    } else if (verificationFilter === "unverified") {
      filtered = filtered.filter((applicant) => !applicant.is_verified);
    }

    setFilteredApplicants(filtered);
  }, [applicants, searchQuery, verificationFilter]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handlePageChange = (page: number) => {
    fetchApplicants(page);
  };

  const handleAction = async (action: string, applicantId: string) => {
    switch (action) {
      case "view":
        navigate(`/property-owner/applications/applicants/${applicantId}`);
        break;
      case "message":
        navigate(`/property-owner/messages?tenant=${applicantId}`);
        break;
      case "email":
        // Could open email modal or navigate to email composition
        const applicant = applicants.find((app) => app.id === applicantId);
        if (applicant?.email) {
          window.open(`mailto:${applicant.email}`);
        }
        break;
      default:
        console.log(`Unknown action: ${action} for applicant: ${applicantId}`);
    }
  };

  const handleRefresh = () => {
    fetchApplicants();
  };

  if (loading) return <LoadingSpinner fullScreen label="Fetching applicants" />;

  return (
    <div className="space-y-6 p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Box>
            <Title order={2} className="text-gray-900">
              All Applicants
            </Title>
            <Text size="sm" c="dimmed">
              View and manage all applicants across your properties
            </Text>
          </Box>
          <Group gap="sm">
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={handleRefresh}
              loading={loading}
              size={isMobile ? "sm" : "md"}
            >
              {isMobile ? "" : "Refresh"}
            </Button>
          </Group>
        </div>
      </div>

      {/* Main Content */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Title order={4}>Applicants ({filteredApplicants.length})</Title>
          </Group>

          {/* Search and Filter Controls */}
          <Group gap="sm" align="flex-end">
            <TextInput
              placeholder="Search applicants..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
              size={isMobile ? "sm" : "md"}
            />
            <Select
              placeholder="Verification Status"
              data={[
                { value: "all", label: "All Applicants" },
                { value: "verified", label: "Verified Only" },
                { value: "unverified", label: "Unverified Only" },
              ]}
              value={verificationFilter}
              onChange={(value) =>
                setVerificationFilter(value === "all" ? null : value)
              }
              size={isMobile ? "sm" : "md"}
              style={{ minWidth: 150 }}
            />
          </Group>

          {/* Applicants Display */}
          {filteredApplicants.length > 0 ? (
            <>
              {/* Mobile Card View */}
              {isMobile ? (
                <Stack gap="md">
                  {filteredApplicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant.id}
                      applicant={applicant}
                      onAction={handleAction}
                    />
                  ))}
                </Stack>
              ) : (
                /* Desktop Table View */
                <Box style={{ overflowX: "auto" }}>
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[200px]">
                          Applicant
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[120px]">
                          Phone
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[120px]">
                          Occupation
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[100px]">
                          Applications
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[100px]">
                          Status
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[120px]">
                          Joined
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600 min-w-[120px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplicants.map((applicant) => (
                        <ApplicantTableRow
                          key={applicant.id}
                          applicant={applicant}
                          onAction={handleAction}
                        />
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Card shadow="sm" padding="lg" radius="md" withBorder mt="md">
                  <Pagination.Root
                    total={pagination.pages}
                    onChange={handlePageChange}
                    size={isMobile ? "sm" : "md"}
                  >
                    <Group gap={5} justify="center">
                      <Pagination.First />
                      <Pagination.Previous />
                      <Pagination.Items />
                      <Pagination.Next />
                      <Pagination.Last />
                    </Group>
                  </Pagination.Root>
                </Card>
              )}
            </>
          ) : (
            <EmptyState>
              <div className="text-center py-12">
                <IconUsers size={48} className="mx-auto text-gray-400 mb-4" />
                <Title order={3} className="text-gray-700 mb-2">
                  No Applicants Found
                </Title>
                <Text c="dimmed" mb="lg">
                  {searchQuery || verificationFilter
                    ? "No applicants match your current filters"
                    : "No applicants have applied to your properties yet"}
                </Text>
                {(searchQuery || verificationFilter) && (
                  <Button
                    variant="light"
                    onClick={() => {
                      setSearchQuery("");
                      setVerificationFilter(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </EmptyState>
          )}
        </Stack>
      </Card>
    </div>
  );
}

export default Applicants;
