import {
  IconFileStack,
  IconHome,
  IconSearch,
  IconBell,
  IconCreditCard,
  IconMessageCircle,
  IconBrain,
  IconHeart,
  IconEye,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconCalendarEvent,
  IconChevronRight,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Button,
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Progress,
  Box,
  SimpleGrid,
  Paper,
  Title,
  ThemeIcon,
} from "@mantine/core";
import { useLoading } from "@/hooks/useLoading";
import { useTenantOperations } from "@/apis/tenantApi";
import StatisticsCard from "@/components/shared/Dashboard/StatisticsCard";
import {
  ActivityItemSkeleton,
  StatCardSkeleton,
} from "@/components/skeletons/DashboardSkeletons";
import { ErrorState } from "@/components/ErrorState";
import Header from "@/components/shared/Dashboard/Header";
import EnhancedRecommendations from "@/components/dashboard/EnhancedRecommendation";

interface UserTypes {
  firstName: string;
}

interface DashboardStats {
  activeApplications: number;
  viewedProperties: number;
  savedProperties: number;
}

// Helper functions for activity formatting
const formatActivityType = (activityType: string): string => {
  const activityMap: Record<string, string> = {
    property_application_submitted: "Application submitted",
    property_liked: "Property liked",
    screening_completed: "Screening completed",
    lease_signed: "Lease signed",
    lease_activated: "Lease activated",
    onboarding_completed: "Onboarding completed",
  };
  return activityMap[activityType] || activityType.replace(/_/g, " ");
};

const getActivityStatus = (activityType: string): string => {
  const statusMap: Record<string, string> = {
    property_application_submitted: "pending",
    property_liked: "completed",
    screening_completed: "completed",
    lease_signed: "completed",
    lease_activated: "completed",
    onboarding_completed: "completed",
  };
  return statusMap[activityType] || "completed";
};

const getActivityIcon = (activityType: string) => {
  const iconMap: Record<string, any> = {
    property_application_submitted: IconFileStack,
    property_liked: IconHeart,
    screening_completed: IconCheck,
    lease_signed: IconCheck,
    lease_activated: IconCheck,
    onboarding_completed: IconCheck,
  };
  return iconMap[activityType] || IconClock;
};

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeApplications: 0,
    viewedProperties: 0,
    savedProperties: 12,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quickActions = [
    {
      title: "Smart Recommendations",
      description: "Properties matched for you",
      icon: IconBrain,
      href: "/tenants/recommendations",
      color: "#4285F4",
      bgColor: "linear-gradient(135deg, #F0F7FF 0%, #E3F2FD 100%)",
    },
    {
      title: "Browse Properties",
      description: "Search available homes in your area",
      icon: IconSearch,
      href: "/listings",
      color: "#34A853",
      bgColor: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
    },
    {
      title: "My Applications",
      description: "Track all your rental applications",
      icon: IconFileStack,
      href: "/tenants/applications",
      color: "#FBBC05",
      bgColor: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
    },
    {
      title: "Messages",
      description: "Communicate with property owners",
      icon: IconMessageCircle,
      href: "/tenants/messages",
      color: "#9C27B0",
      bgColor: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
    },
    {
      title: "Payment Center",
      description: "Manage rent and view payment history",
      icon: IconCreditCard,
      href: "/tenants/payments",
      color: "#EA4335",
      bgColor: "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
    },
  ];

  const navigate = useNavigate();
  const { loading, withLoading } = useLoading();
  const { getAllApplications, getRecentActivities } = useTenantOperations();
  const user = useOutletContext<UserTypes>();

  const fetchDashboardData = async () => {
    // Fetch stats
    setLoadingStats(true);
    try {
      const { status_counts } = await withLoading(getAllApplications());
      const stats: DashboardStats = {
        activeApplications:
          (status_counts["received"] || 0) +
          (status_counts["in-progress"] || 0),
        viewedProperties: status_counts["viewed"] || 0,
        savedProperties: 12, // Mock data for now
      };
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }

    // Fetch recent activities
    setLoadingActivities(true);
    try {
      const activitiesResponse = await withLoading(
        getRecentActivities({
          limit: 10,
          days: 30,
        })
      );

      let activitiesArray = [];
      if (activitiesResponse?.success) {
        activitiesArray =
          activitiesResponse.data?.activities ||
          activitiesResponse.activities ||
          [];
      }

      if (activitiesArray.length > 0) {
        const transformedActivities = activitiesArray.map((activity: any) => ({
          action: formatActivityType(activity.activity_type),
          property:
            activity.description || activity.activity_description || "Activity",
          time: activity.time_ago || "Unknown time",
          status: getActivityStatus(activity.activity_type),
          id: activity.id,
          icon: getActivityIcon(activity.activity_type),
        }));
        setRecentActivity(transformedActivities);
      } else {
        setRecentActivity([]);
      }
    } catch (error) {
      console.error("Failed to fetch recent activities:", error);
      setRecentActivity([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error)
    return (
      <ErrorState
        message={error}
        loading={loading}
        onRetry={fetchDashboardData}
      />
    );

  return (
    <Box p="lg" style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      {/* Header Section */}
      <Group justify="space-between" align="flex-start" mb="xl">
        <Header name={user?.firstName || "Tenant"} />
        <Button
          variant="filled"
          color="#4285F4"
          leftSection={<IconSearch size={18} />}
          size="md"
          radius="md"
          style={{
            fontWeight: 600,
            backgroundColor: "#4285F4",
            padding: "10px 24px",
            fontSize: "15px",
            boxShadow: "0 2px 8px rgba(66, 133, 244, 0.3)",
          }}
          onClick={() => navigate("/listings")}
        >
          Find Your Perfect Home
        </Button>
      </Group>

      {/* Key Statistics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
        {loadingStats ? (
          <>
            {[1, 2, 3].map((index) => (
              <StatCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <StatisticsCard
              title="Active Applications"
              value={dashboardStats.activeApplications}
              extraText={[{ label: "This month", value: "+2", color: "green" }]}
              icon={IconFileStack}
              trend="up"
              href="/tenants/applications"
            />
            <StatisticsCard
              title="Properties Viewed"
              value={dashboardStats.viewedProperties}
              extraText={[{ label: "This week", value: "+5", color: "blue" }]}
              icon={IconEye}
              trend="up"
              href="/tenants/history"
            />
            <StatisticsCard
              title="Saved Properties"
              value={dashboardStats.savedProperties}
              extraText={[{ label: "Favorites", value: "8", color: "violet" }]}
              icon={IconHeart}
              trend="neutral"
              href="/tenants/favorites"
            />
          </>
        )}
      </SimpleGrid>

      {/* Quick Actions */}
      <Box mb="xl">
        <Title
          order={3}
          mb="md"
          style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1A1A1A" }}
        >
          Quick Actions
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Paper
                key={index}
                withBorder
                radius="md"
                p="lg"
                style={{
                  background: action.bgColor,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => navigate(action.href)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.08)";
                }}
              >
                <Box style={{ flex: 1 }}>
                  <Group gap="sm" mb="md" align="flex-start">
                    <ThemeIcon
                      size={44}
                      radius="md"
                      style={{
                        backgroundColor: `${action.color}20`,
                        color: action.color,
                        border: `1px solid ${action.color}40`,
                      }}
                    >
                      <Icon size={22} />
                    </ThemeIcon>
                  </Group>
                  <Text fw={700} size="md" mb={4} style={{ color: "#1A1A1A" }}>
                    {action.title}
                  </Text>
                  <Text
                    size="sm"
                    c="dimmed"
                    style={{ lineHeight: 1.4, marginBottom: 12 }}
                  >
                    {action.description}
                  </Text>
                </Box>
                <Group justify="space-between" align="center" mt="auto">
                  <Text size="xs" fw={600} style={{ color: action.color }}>
                    Go to page
                  </Text>
                  <IconChevronRight size={16} color={action.color} />
                </Group>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* Two Column Layout for Activities and Progress */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="xl">
        {/* Recent Activity */}
        <Card
          withBorder
          radius="md"
          p="lg"
          style={{
            backgroundColor: "white",
            border: "1px solid #E0E0E0",
            height: "100%",
          }}
        >
          <Group justify="space-between" mb="md">
            <Title
              order={3}
              style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1A1A1A" }}
            >
              Recent Activity
            </Title>
            <Button
              variant="subtle"
              size="sm"
              color="blue"
              rightSection={<IconChevronRight size={14} />}
              onClick={() => navigate("/tenants/activity")}
              style={{ fontWeight: 500 }}
            >
              View All
            </Button>
          </Group>

          <Stack gap="md">
            {loadingActivities ? (
              <>
                {[1, 2, 3, 4].map((index) => (
                  <ActivityItemSkeleton key={index} />
                ))}
              </>
            ) : recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => {
                const ActivityIcon = activity.icon;
                return (
                  <Paper
                    key={index}
                    withBorder
                    p="sm"
                    radius="sm"
                    style={{
                      border: "1px solid #F0F0F0",
                      backgroundColor:
                        activity.status === "pending" ? "#FFFBF5" : "#F8FBF8",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() =>
                      activity.id &&
                      navigate(`/tenants/activity/${activity.id}`)
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        activity.status === "pending" ? "#FFF8F0" : "#F0F9F0";
                      e.currentTarget.style.borderColor =
                        activity.status === "pending" ? "#FFE0B2" : "#C8E6C9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        activity.status === "pending" ? "#FFFBF5" : "#F8FBF8";
                      e.currentTarget.style.borderColor = "#F0F0F0";
                    }}
                  >
                    <Group gap="sm" align="flex-start" wrap="nowrap">
                      <ThemeIcon
                        size={36}
                        radius="md"
                        variant="light"
                        color={
                          activity.status === "pending" ? "orange" : "green"
                        }
                      >
                        <ActivityIcon size={18} />
                      </ThemeIcon>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Group justify="space-between" mb={2} wrap="nowrap">
                          <Text
                            size="sm"
                            fw={600}
                            style={{ color: "#1A1A1A" }}
                            truncate
                          >
                            {activity.action}
                          </Text>
                          <Badge
                            size="sm"
                            radius="sm"
                            variant="light"
                            color={
                              activity.status === "pending" ? "orange" : "green"
                            }
                            style={{
                              fontWeight: 600,
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {activity.status}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" truncate>
                          {activity.property}
                        </Text>
                        <Text
                          size="xs"
                          c="dimmed"
                          mt={2}
                          style={{ fontSize: "11px" }}
                        >
                          {activity.time}
                        </Text>
                      </Box>
                    </Group>
                  </Paper>
                );
              })
            ) : (
              <Paper
                withBorder
                p="xl"
                radius="md"
                style={{
                  backgroundColor: "#F9F9F9",
                  border: "2px dashed #E0E0E0",
                  textAlign: "center",
                }}
              >
                <IconClock
                  size={48}
                  color="#999"
                  style={{ marginBottom: 16, opacity: 0.5 }}
                />
                <Text size="md" fw={500} c="dimmed" mb="xs">
                  No recent activities
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Start exploring properties to see your activity here
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  leftSection={<IconSearch size={14} />}
                  onClick={() => navigate("/listings")}
                >
                  Browse Properties
                </Button>
              </Paper>
            )}
          </Stack>
        </Card>

        {/* Application Progress Summary */}
        <Card
          withBorder
          radius="md"
          p="lg"
          style={{
            backgroundColor: "white",
            border: "1px solid #E0E0E0",
            height: "100%",
          }}
        >
          <Title
            order={3}
            mb="md"
            style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1A1A1A" }}
          >
            Application Progress
          </Title>

          <Stack gap="lg">
            {dashboardStats.activeApplications > 0 ? (
              <>
                <Box>
                  <Group justify="space-between" mb="xs" align="center">
                    <Group gap="xs">
                      <ThemeIcon
                        size={28}
                        radius="sm"
                        color="#4285F4"
                        variant="light"
                      >
                        <IconFileStack size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} style={{ color: "#1A1A1A" }}>
                        Documentation
                      </Text>
                    </Group>
                    <Text size="sm" fw={700} style={{ color: "#4285F4" }}>
                      75%
                    </Text>
                  </Group>
                  <Progress
                    value={75}
                    color="#4285F4"
                    size="lg"
                    radius="sm"
                    style={{
                      backgroundColor: "#E3F2FD",
                      marginBottom: 4,
                    }}
                  />
                  <Text size="xs" c="dimmed">
                    3 of 4 documents submitted
                  </Text>
                </Box>

                <Box>
                  <Group justify="space-between" mb="xs" align="center">
                    <Group gap="xs">
                      <ThemeIcon
                        size={28}
                        radius="sm"
                        color="#34A853"
                        variant="light"
                      >
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} style={{ color: "#1A1A1A" }}>
                        Background Check
                      </Text>
                    </Group>
                    <Text size="sm" fw={700} style={{ color: "#34A853" }}>
                      100%
                    </Text>
                  </Group>
                  <Progress
                    value={100}
                    color="#34A853"
                    size="lg"
                    radius="sm"
                    style={{
                      backgroundColor: "#E8F5E9",
                      marginBottom: 4,
                    }}
                  />
                  <Text size="xs" c="dimmed">
                    Completed - All clear
                  </Text>
                </Box>

                <Box>
                  <Group justify="space-between" mb="xs" align="center">
                    <Group gap="xs">
                      <ThemeIcon
                        size={28}
                        radius="sm"
                        color="#FF6B35"
                        variant="light"
                      >
                        <IconAlertCircle size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} style={{ color: "#1A1A1A" }}>
                        Landlord Review
                      </Text>
                    </Group>
                    <Text size="sm" fw={700} style={{ color: "#FF6B35" }}>
                      25%
                    </Text>
                  </Group>
                  <Progress
                    value={25}
                    color="#FF6B35"
                    size="lg"
                    radius="sm"
                    style={{
                      backgroundColor: "#FFF3E0",
                      marginBottom: 4,
                    }}
                  />
                  <Text size="xs" c="dimmed">
                    Pending landlord review
                  </Text>
                </Box>

                <Button
                  fullWidth
                  variant="light"
                  color="blue"
                  size="md"
                  mt="lg"
                  leftSection={<IconFileStack size={18} />}
                  rightSection={<IconChevronRight size={16} />}
                  onClick={() => navigate("/tenants/applications")}
                  style={{
                    fontWeight: 600,
                    border: "1px solid #E3F2FD",
                  }}
                >
                  View All Applications ({dashboardStats.activeApplications})
                </Button>
              </>
            ) : (
              <Paper
                withBorder
                p="xl"
                radius="md"
                style={{
                  backgroundColor: "#F0F9FF",
                  border: "2px dashed #BAE6FD",
                  textAlign: "center",
                }}
              >
                <IconFileStack
                  size={48}
                  color="#0284C7"
                  style={{ marginBottom: 16, opacity: 0.5 }}
                />
                <Text size="md" fw={600} style={{ color: "#0369A1" }} mb="xs">
                  No Active Applications
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Start applying to properties to track your progress here
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  leftSection={<IconSearch size={14} />}
                  onClick={() => navigate("/listings")}
                >
                  Find Properties
                </Button>
              </Paper>
            )}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Enhanced Smart Recommendations */}
      <EnhancedRecommendations
        user={user}
        applicationsCount={dashboardStats.activeApplications}
        viewedProperties={dashboardStats.viewedProperties}
      />
    </Box>
  );
};

export default Dashboard;
