import React, { useState, useEffect } from "react";
import {
  Container,
  Group,
  Title,
  Button,
  Tabs,
  Grid,
  ActionIcon,
  Menu,
  Text,
  Badge,
  Alert,
} from "@mantine/core";
import {
  IconPlus,
  IconLayoutGrid,
  IconLayoutList,
  IconChartBar,
  IconDotsVertical,
  IconFileDownload,
  IconRefresh,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useEnhancedPropertyOperations } from "../../../../hooks/useEnhancedPropertyOperations";
import { PropertyFilters } from "../../../../hooks/useEnhancedPropertyOperations";
import EnhancedStatisticsCard from "../../../../components/shared/Dashboard/EnhancedStatisticsCard";
import EnhancedPropertyFilters from "../../../../components/shared/Dashboard/EnhancedPropertyFilters";
import EnhancedPropertyTable from "../../../../components/shared/Dashboard/EnhancedPropertyTable";
import PropertyAnalytics from "../../../../components/shared/Dashboard/PropertyAnalytics";
import { BrandedLoader } from "../../../../components/LoadingSpinner";
import EmptyState from "../../../../components/EmptyState";

const LandlordProperties = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [analyticsPeriod, setAnalyticsPeriod] = useState<string>("6months");

  const {
    properties,
    allProperties,
    statistics,
    analytics,
    loading,
    error,
    currentFilters,
    applyFilters,
    clearFilters,
    exportData,
    deleteProperty,
    refresh,
  } = useEnhancedPropertyOperations();

  // Initialize data fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleFilterChange = (filters: PropertyFilters) => {
    applyFilters(filters);
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    await exportData(format);
  };

  if (loading) {
    return <BrandedLoader />;
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error Loading Properties">
          {error}
          <Button onClick={refresh} mt="md" variant="outline">
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Statistics Cards */}
            <Grid mb="xl">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <EnhancedStatisticsCard
                  title="Total Properties"
                  value={statistics.total}
                  change={{
                    value: 5,
                    percentage: 12,
                    direction: "up",
                  }}
                  period="this month"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <EnhancedStatisticsCard
                  title="Available"
                  value={statistics.available}
                  change={{
                    value: Math.round(
                      (statistics.available / Math.max(statistics.total, 1)) *
                        100
                    ),
                    percentage: Math.round(
                      (statistics.available / Math.max(statistics.total, 1)) *
                        100
                    ),
                    direction: "neutral",
                  }}
                  period="availability rate"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <EnhancedStatisticsCard
                  title="Total Revenue"
                  value={Math.round(statistics.total_revenue / 1000000)}
                  change={{
                    value: Math.abs(statistics.revenue_growth),
                    percentage: Math.abs(statistics.revenue_growth),
                    direction: statistics.revenue_growth >= 0 ? "up" : "down",
                  }}
                  period="this month"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <EnhancedStatisticsCard
                  title="Avg. Occupancy"
                  value={Math.round(statistics.avg_occupancy_rate)}
                  change={{
                    value: Math.round(statistics.avg_occupancy_rate),
                    percentage: Math.round(statistics.avg_occupancy_rate),
                    direction: "neutral",
                  }}
                  period="current rate"
                />
              </Grid.Col>
            </Grid>

            {/* Filters */}
            <EnhancedPropertyFilters
              filters={{
                search: currentFilters.search || "",
                status: currentFilters.status || [],
                verification: currentFilters.verification || [],
                propertyType: currentFilters.propertyType || [],
                bedrooms: currentFilters.bedrooms || [],
                priceRange: currentFilters.priceRange || [0, 10000000],
                location: currentFilters.location || [],
                dateRange: currentFilters.dateRange || [null, null],
                sortBy: currentFilters.sortBy || "",
                sortOrder: currentFilters.sortOrder || "asc",
              }}
              onChange={handleFilterChange}
              onClearAll={clearFilters}
              resultCount={properties.length}
            />

            {/* Properties Table/Grid */}
            {properties.length > 0 ? (
              <>
                <Group justify="space-between" mb="md">
                  <Text size="sm" c="dimmed">
                    {properties.length} of {allProperties.length} properties
                  </Text>
                  <Group>
                    <ActionIcon.Group>
                      <ActionIcon
                        variant={viewMode === "table" ? "filled" : "light"}
                        onClick={() => setViewMode("table")}
                      >
                        <IconLayoutList size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant={viewMode === "grid" ? "filled" : "light"}
                        onClick={() => setViewMode("grid")}
                      >
                        <IconLayoutGrid size={16} />
                      </ActionIcon>
                    </ActionIcon.Group>
                  </Group>
                </Group>
                <EnhancedPropertyTable
                  data={properties}
                  onSort={(field) => console.log("Sort by:", field)}
                  viewMode={viewMode}
                  showAdvancedInfo={true}
                />
              </>
            ) : (
              <EmptyState>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't added any properties yet or no properties match
                    your current filters.
                  </p>
                  <Button
                    component={Link}
                    to="/property-owner/properties/add"
                    leftSection={<IconPlus size={16} />}
                  >
                    Add Your First Property
                  </Button>
                </div>
              </EmptyState>
            )}
          </>
        );

      case "analytics":
        return (
          <PropertyAnalytics
            analytics={analytics}
            period={analyticsPeriod}
            onPeriodChange={setAnalyticsPeriod}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container size="xl" py="md">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Properties</Title>
          <Text c="dimmed" size="sm">
            Manage your property portfolio
          </Text>
          {Object.keys(currentFilters).length > 0 && (
            <Badge variant="light" color="blue" mt="xs">
              {properties.length} of {allProperties.length} properties
            </Badge>
          )}
        </div>

        <Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" size="lg">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Export Data</Menu.Label>
              <Menu.Item
                leftSection={<IconFileDownload size={14} />}
                onClick={() => handleExport("csv")}
              >
                Export as CSV
              </Menu.Item>
              <Menu.Item
                leftSection={<IconFileDownload size={14} />}
                onClick={() => handleExport("excel")}
              >
                Export as Excel
              </Menu.Item>
              <Menu.Item
                leftSection={<IconFileDownload size={14} />}
                onClick={() => handleExport("pdf")}
              >
                Export as PDF
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconRefresh size={14} />}
                onClick={refresh}
              >
                Refresh Data
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Button
            component={Link}
            to="/property-owner/properties/add"
            leftSection={<IconPlus size={16} />}
          >
            Add Property
          </Button>
        </Group>
      </Group>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value || "overview")}
      >
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconLayoutGrid size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
            Analytics
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab} pt="xl">
          {renderTabContent()}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default LandlordProperties;
