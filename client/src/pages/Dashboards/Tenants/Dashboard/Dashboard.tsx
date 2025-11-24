import Header from "../../../../components/shared/Dashboard/Header";
import StatisticsCard from "../../../../components/shared/Dashboard/StatisticsCard";
import {
  IconFileStack,
  IconHome,
  IconSearch,
  IconBell,
  IconCreditCard,
  IconMessageCircle,
  IconBrain,
} from "@tabler/icons-react";
import AvailableForRent from "../../../../components/screens/Dashboards/AvailableForRent";
import { useTenantOperations } from "../../../../apis/tenantApi";
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
} from "@mantine/core";
import { useLoading } from "../../../../hooks/useLoading";
import { ErrorState } from "../../../../components/ErrorState";
import {
  StatCardSkeleton,
  ActivityItemSkeleton,
} from "../../../../components/skeletons/DashboardSkeletons";

interface UserTypes {
  firstName: string;
}

interface DashboardStats {
  activeApplications: number;
  viewedProperties: number;
  upcomingPayments: number;
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

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeApplications: 0,
    viewedProperties: 0,
    upcomingPayments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Loading states for each section
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const [quickActions] = useState([
    {
      title: "Recommendations",
      description: "Properties matched for you",
      icon: IconBrain,
      href: "/tenants/recommendations",
      color: "teal",
    },
    {
      title: "Search Properties",
      description: "Find your perfect home",
      icon: IconSearch,
      href: "/listings",
      color: "blue",
    },
    {
      title: "My Applications",
      description: "Track application status",
      icon: IconFileStack,
      href: "/tenants/applications",
      color: "green",
    },
    {
      title: "Messages",
      description: "Chat with landlords",
      icon: IconMessageCircle,
      href: "/tenants/messages",
      color: "violet",
    },
    {
      title: "Rent Payments",
      description: "Manage your payments",
      icon: IconCreditCard,
      href: "/tenants/payments",
      color: "orange",
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { loading, withLoading } = useLoading();
  const { getAllApplications, getRecentActivities } = useTenantOperations();

  const user = useOutletContext<UserTypes>();

  const fetchDashboardData = async () => {
    // Fetch stats
    setLoadingStats(true);
    try {
      const { status_counts } = await withLoading(getAllApplications());

      // Calculate meaningful statistics for tenants
      const stats: DashboardStats = {
        activeApplications:
          (status_counts["received"] || 0) +
          (status_counts["in-progress"] || 0),
        viewedProperties: status_counts["viewed"] || 0,
        upcomingPayments: 0,
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

      // Check if we have activities data - handle both response formats
      let activitiesArray = [];
      if (activitiesResponse?.success) {
        // Try different response formats
        activitiesArray =
          activitiesResponse.data?.activities ||
          activitiesResponse.activities ||
          [];
      }

      if (activitiesArray.length > 0) {
        // Transform API response to match UI format
        const transformedActivities = activitiesArray.map((activity: any) => ({
          action: formatActivityType(activity.activity_type),
          property:
            activity.description || activity.activity_description || "Activity",
          time: activity.time_ago || "Unknown time",
          status: getActivityStatus(activity.activity_type),
          id: activity.id,
        }));

        setRecentActivity(transformedActivities);
      } else {
        console.log("No activities found, setting empty array");
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
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Enhanced Header Section */}
      <div className="flex justify-between items-center">
        <Header name={user?.firstName || "Tenant"} />
        <Group gap="sm">
          <Button
            variant="filled"
            color="#290665"
            leftSection={<IconHome size={16} />}
            size="sm"
          >
            Find Your Next Property
          </Button>
        </Group>
      </div>

      {/* Key Statistics - More Tenant-Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStats ? (
          <>
            {[1, 2, 3, 4].map((index) => (
              <StatCardSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            <StatisticsCard
              title="Active Applications"
              value={dashboardStats.activeApplications}
              extraText={[{ label: "This month", value: "+2", color: "green" }]}
            />
            <StatisticsCard
              title="Properties Viewed"
              value={dashboardStats.viewedProperties}
              extraText={[{ label: "This week", value: "+5", color: "blue" }]}
            />
            <StatisticsCard
              title="Saved Properties"
              value={12}
              extraText={[{ label: "Favorites", value: "8", color: "violet" }]}
            />
          </>
        )}
      </div>

      {/* Quick Actions Grid */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={600} mb="md">
          Quick Actions
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              padding="md"
              radius="md"
              withBorder
              className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-white to-gray-50"
              component="a"
              onClick={() => navigate(action.href)}
            >
              <Group gap="sm" mb="xs">
                <action.icon
                  size={24}
                  color={`var(--mantine-color-${action.color}-6)`}
                />
                <Text fw={600} size="sm">
                  {action.title}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {action.description}
              </Text>
            </Card>
          ))}
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Activity */}
        <div>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={600} mb="md">
              Recent Activity
            </Text>
            <Stack gap="sm">
              {loadingActivities ? (
                <>
                  {[1, 2, 3, 4].map((index) => (
                    <ActivityItemSkeleton key={index} />
                  ))}
                </>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <Group
                    key={index}
                    justify="space-between"
                    className="p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <Text size="sm" fw={500}>
                        {activity.action}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {activity.property}
                      </Text>
                    </div>
                    <Group gap="xs">
                      <Badge
                        color={
                          activity.status === "pending" ? "orange" : "green"
                        }
                        variant="light"
                        size="sm"
                      >
                        {activity.status}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        {activity.time}
                      </Text>
                    </Group>
                  </Group>
                ))
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No recent activities
                </Text>
              )}
            </Stack>
          </Card>
        </div>
      </div>

      {/* Application Progress Summary */}
      {dashboardStats.activeApplications > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" fw={600} mb="md">
            Application Progress
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text size="sm" mb="xs">
                Documentation
              </Text>
              <Progress value={75} color="blue" size="lg" />
              <Text size="xs" c="dimmed" mt="xs">
                3 of 4 documents submitted
              </Text>
            </div>
            <div>
              <Text size="sm" mb="xs">
                Background Check
              </Text>
              <Progress value={100} color="green" size="lg" />
              <Text size="xs" c="dimmed" mt="xs">
                Completed
              </Text>
            </div>
            <div>
              <Text size="sm" mb="xs">
                Final Review
              </Text>
              <Progress value={25} color="orange" size="lg" />
              <Text size="xs" c="dimmed" mt="xs">
                Pending landlord review
              </Text>
            </div>
          </div>
        </Card>
      )}

      {/* Recommended Properties */}
      <AvailableForRent />
    </div>
  );
};

export default Dashboard;
