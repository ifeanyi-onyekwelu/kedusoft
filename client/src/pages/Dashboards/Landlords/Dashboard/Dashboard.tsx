import { useEffect, useState } from "react";
import { useLandlordOperations } from "../../../../apis/landlordApi";
import { Grid, Stack } from "@mantine/core";
import { DashboardHeader } from "../../../../components/dashboard/DashboardHeader";
import { LandlordStatisticsGrid } from "../../../../components/dashboard/StatisticsCards";
import { RecentApplications } from "../../../../components/dashboard/RecentApplications";
import { RecentActivities } from "../../../../components/dashboard/RecentActivities";
import { useLoading } from "../../../../hooks/useLoading";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import {
  IconHome,
  IconUsers,
  IconEye,
  IconTrendingUp,
  IconActivity,
} from "@tabler/icons-react";

// Helper functions for activity icons and colors
const getActivityIcon = (activityType: string) => {
  const iconMap: Record<string, any> = {
    property_created: IconHome,
    property_updated: IconHome,
    property_published: IconHome,
    application_rejected: IconUsers,
    screening_initiated: IconActivity,
    lease_created: IconActivity,
    lease_signed: IconActivity,
  };
  return iconMap[activityType] || IconActivity;
};

const getActivityColor = (activityType: string) => {
  const colorMap: Record<string, string> = {
    property_created: "green",
    property_updated: "blue",
    property_published: "violet",
    application_rejected: "red",
    screening_initiated: "orange",
    lease_created: "indigo",
    lease_signed: "teal",
  };
  return colorMap[activityType] || "gray";
};

const LandlordDashboard = () => {
  // Use the landlord operations hook
  const {
    getListedProperties,
    getTransactionStatistics,
    getApplicationStats,
    getPropertyViewsStatistics,
    getAllApplications,
    getPropertiesPerformance,
    getRecentActivities,
    getFinancialOverview,
    getOccupancyStats,
    getTenantSummary,
    getRevenueChart,
  } = useLandlordOperations();

  // Date range state
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "year"
  >("week");
  // const [currentStats, setCurrentStats] = useState<any>(null);
  // const [previousStats, setPreviousStats] = useState<any>(null);

  const [statistics, setStatistics] = useState<
    Array<{
      title: string;
      value: number;
      icon: any;
      color: "blue" | "green" | "orange" | "violet";
      change: string;
      trend: "up" | "down" | "neutral";
      link?: string;
    }>
  >([
    {
      title: "Total Properties",
      value: 0,
      icon: IconHome,
      color: "blue" as const,
      change: "+0%",
      trend: "neutral" as const,
    },
    {
      title: "Total Applications",
      value: 0,
      icon: IconUsers,
      color: "green" as const,
      change: "+0%",
      trend: "neutral" as const,
    },
    {
      title: "Property Views",
      value: 0,
      icon: IconEye,
      color: "orange" as const,
      change: "+0%",
      trend: "neutral" as const,
    },
    {
      title: "Total Balance",
      value: 0,
      icon: IconTrendingUp,
      color: "violet" as const,
      change: "+0%",
      trend: "neutral" as const,
    },
  ]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  // Loading states for individual widgets
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const { loading } = useLoading();

  // Helper function to get date ranges
  const getDateRanges = (range: string) => {
    const now = new Date();
    const currentPeriodStart = new Date();
    const previousPeriodStart = new Date();
    const previousPeriodEnd = new Date();

    switch (range) {
      case "today":
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setDate(now.getDate() - 1);
        previousPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodEnd.setDate(now.getDate() - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case "week":
        const dayOfWeek = now.getDay();
        currentPeriodStart.setDate(now.getDate() - dayOfWeek);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setDate(currentPeriodStart.getDate() - 7);
        previousPeriodEnd.setDate(currentPeriodStart.getDate() - 1);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case "month":
        currentPeriodStart.setDate(1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setMonth(now.getMonth() - 1, 1);
        previousPeriodEnd.setMonth(now.getMonth(), 0);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
      case "year":
        currentPeriodStart.setMonth(0, 1);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart.setFullYear(now.getFullYear() - 1, 0, 1);
        previousPeriodEnd.setFullYear(now.getFullYear() - 1, 11, 31);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;
    }

    return {
      current: { start: currentPeriodStart, end: now },
      previous: { start: previousPeriodStart, end: previousPeriodEnd },
    };
  };

  // Calculate percentage change
  const calculateChange = (
    current: number,
    previous: number
  ): { change: string; trend: "up" | "down" | "neutral" } => {
    if (previous === 0) {
      if (current > 0) return { change: "+100%", trend: "up" };
      return { change: "0%", trend: "neutral" };
    }

    const percentChange = ((current - previous) / previous) * 100;
    const sign = percentChange >= 0 ? "+" : "";
    const trend =
      percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral";

    return {
      change: `${sign}${Math.round(percentChange)}%`,
      trend,
    };
  };

  const fetchProperties = async () => {
    const properties = await getListedProperties();

    return Array.isArray(properties)
      ? properties.length
      : Array.isArray(properties)
      ? properties.length
      : 0;
  };

  const fetchAllData = async () => {
    // Get date ranges for comparison
    const ranges = getDateRanges(dateRange);

    try {
      // Fetch current period data with date filtering
      const [
        propertiesCount,
        currentTransactionStats,
        currentApplicationStats,
        currentViewsStats,
        previousTransactionStats,
        previousApplicationStats,
        previousViewsStats,
      ] = await Promise.all([
        fetchProperties(),
        getTransactionStatistics({
          start_date: ranges.current.start.toISOString().split("T")[0],
          end_date: ranges.current.end.toISOString().split("T")[0],
        }),
        getApplicationStats({
          start_date: ranges.current.start.toISOString().split("T")[0],
          end_date: ranges.current.end.toISOString().split("T")[0],
        }),
        getPropertyViewsStatistics({
          start_date: ranges.current.start.toISOString().split("T")[0],
          end_date: ranges.current.end.toISOString().split("T")[0],
        }),
        getTransactionStatistics({
          start_date: ranges.previous.start.toISOString().split("T")[0],
          end_date: ranges.previous.end.toISOString().split("T")[0],
        }),
        getApplicationStats({
          start_date: ranges.previous.start.toISOString().split("T")[0],
          end_date: ranges.previous.end.toISOString().split("T")[0],
        }),
        getPropertyViewsStatistics({
          start_date: ranges.previous.start.toISOString().split("T")[0],
          end_date: ranges.previous.end.toISOString().split("T")[0],
        }),
      ]);

      // Calculate dynamic changes with real data
      const propertyChange = { change: "0%", trend: "neutral" as const }; // Properties don't change by period
      const applicationChange = calculateChange(
        currentApplicationStats?.total || 0,
        previousApplicationStats?.total || 0
      );
      const viewsChange = calculateChange(
        currentViewsStats?.total_views || 0,
        previousViewsStats?.total_views || 0
      );
      const balanceChange = calculateChange(
        currentTransactionStats?.total_balance || 0,
        previousTransactionStats?.total_balance || 0
      );
      // Update statistics with real data and calculated changes
      setStatistics([
        {
          title: "Total Properties",
          value: propertiesCount,
          icon: IconHome,
          color: "blue" as const,
          change: propertyChange.change,
          trend: propertyChange.trend,
          link: "/property-owner/properties",
        },
        {
          title: "Total Applications",
          value: currentApplicationStats?.total || 0,
          icon: IconUsers,
          color: "green" as const,
          change: applicationChange.change,
          trend: applicationChange.trend,
          link: "/property-owner/applications",
        },
        {
          title: "Property Views",
          value: currentViewsStats?.total_views || 0,
          icon: IconEye,
          color: "orange" as const,
          change: viewsChange.change,
          trend: viewsChange.trend,
          link: "/property-owner/analytics/views",
        },
        {
          title: "Total Balance",
          value: currentTransactionStats?.total_balance || 0,
          icon: IconTrendingUp,
          color: "violet" as const,
          change: balanceChange.change,
          trend: balanceChange.trend,
          link: "/property-owner/analytics/transactions",
        },
      ]);

      // Fetch widget data with individual loading states
      await Promise.all([fetchRecentActivities(), fetchRecentApplications()]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Handle error state if needed
    }
  };

  const fetchFinancialOverview = async () => {
    // Removed - not needed in simplified dashboard
  };

  const fetchPropertyPerformance = async () => {
    // Removed - not needed in simplified dashboard
  };

  const fetchRecentActivities = async () => {
    setLoadingActivities(true);
    try {
      const activitiesResponse = await getRecentActivities({
        limit: 10,
        days: 30,
      });

      // Transform API response to match UI format
      const transformedActivities =
        activitiesResponse.activities?.map((activity: any) => ({
          id: activity.id,
          type: activity.activity_type,
          message: activity.description,
          time: activity.time_ago,
          icon: getActivityIcon(activity.activity_type),
          color: getActivityColor(activity.activity_type),
        })) || [];

      setRecentActivities(transformedActivities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setRecentActivities([]); // Set empty array on error
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchRecentApplications = async () => {
    setLoadingApplications(true);
    try {
      const applicationsResponse = await getAllApplications({ limit: 5 });
      setRecentApplications(applicationsResponse.applications || []);
    } catch (error) {
      console.error("Error fetching recent applications:", error);
      setRecentApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateRange]); // Re-fetch when date range changes

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50">
      <div className="p-6 space-y-3">
        {/* Header with Date Range Selector */}
        <DashboardHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Statistics Cards */}
        <LandlordStatisticsGrid statistics={statistics} />

        {/* Main Content Grid */}
        <Grid>
          {/* Left Side - Applications */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
              <RecentApplications
                applications={recentApplications}
                loading={loadingApplications}
              />
            </Stack>
          </Grid.Col>

          {/* Right Side - Recent Activities */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <RecentActivities
              activities={recentActivities}
              loading={loadingActivities}
            />
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
};

export default LandlordDashboard;
