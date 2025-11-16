import { useEffect, useState } from "react";
import { Group, Pagination, Tabs, Paper, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconUsers,
  IconHome,
  IconCurrencyNaira,
  IconAlertTriangle,
  IconChartLine,
  IconTable,
} from "@tabler/icons-react";
import EmptyState from "../../../../components/EmptyState";
import { useLoading } from "../../../../hooks/useLoading";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import EnhancedTenantFilters from "../../../../components/shared/Dashboard/EnhancedTenantFilters";
import EnhancedTenantTable from "../../../../components/shared/Dashboard/EnhancedTenantTable";
import TenantAnalytics from "../../../../components/shared/Dashboard/TenantAnalytics";
import { useEnhancedTenantOperations } from "../../../../hooks/useEnhancedTenantOperations";

interface TenantFilters {
  search: string;
  paymentStatus: string[];
  leaseStatus: string[];
  dateRange: [Date | null, Date | null];
  sortBy: string;
  sortOrder: "asc" | "desc";
  propertyType: string[];
}

function Tenants() {
  const { loading } = useLoading();
  const {
    tenants,
    stats,
    pagination,
    fetchEnhancedTenants,
    fetchEnhancedStats,
    getProcessedTenants,
    exportTenants,
  } = useEnhancedTenantOperations();

  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<TenantFilters>({
    search: "",
    paymentStatus: [],
    leaseStatus: [],
    dateRange: [null, null],
    sortBy: "name",
    sortOrder: "asc",
    propertyType: [],
  });

  useEffect(() => {
    fetchEnhancedTenants(1, filters);
    fetchEnhancedStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    fetchEnhancedTenants(page, filters);
  };

  const handleFiltersChange = (newFilters: TenantFilters) => {
    setFilters(newFilters);
    fetchEnhancedTenants(1, newFilters);
  };

  const handleSort = (field: string) => {
    const newOrder: "asc" | "desc" =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    const newFilters = { ...filters, sortBy: field, sortOrder: newOrder };
    setFilters(newFilters);
    fetchEnhancedTenants(pagination.page, newFilters);
  };

  const handleExport = async () => {
    try {
      const exportedCount = await exportTenants(filters, "csv");
      notifications.show({
        title: "Export Successful",
        message: `Successfully exported ${exportedCount} tenant records to CSV`,
        color: "green",
        icon: <IconUsers size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: "Export Failed",
        message:
          "There was an error exporting the tenant data. Please try again.",
        color: "red",
      });
    }
  };

  const processedTenants = getProcessedTenants(filters);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Tenants */}
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <IconUsers size={20} className="text-blue-600" />
            {stats.changes.total.percentage !== 0 && (
              <span
                className={`text-xs font-medium ${
                  stats.changes.total.direction === "up"
                    ? "text-green-600"
                    : stats.changes.total.direction === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {stats.changes.total.direction === "up"
                  ? "↑"
                  : stats.changes.total.direction === "down"
                  ? "↓"
                  : ""}
                {stats.changes.total.percentage}%
              </span>
            )}
          </Group>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600 mt-1">Total Tenants</p>
        </Paper>

        {/* Active Leases */}
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <IconHome size={20} className="text-green-600" />
          </Group>
          <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          <p className="text-xs text-gray-600 mt-1">Active Leases</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.new_this_month} new this month
          </p>
        </Paper>

        {/* Payment Collection */}
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <IconCurrencyNaira size={20} className="text-violet-600" />
            {stats.changes.paid.percentage !== 0 && (
              <span
                className={`text-xs font-medium ${
                  stats.changes.paid.direction === "up"
                    ? "text-green-600"
                    : stats.changes.paid.direction === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {stats.changes.paid.direction === "up"
                  ? "↑"
                  : stats.changes.paid.direction === "down"
                  ? "↓"
                  : ""}
                {stats.changes.paid.percentage}%
              </span>
            )}
          </Group>
          <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
          <p className="text-xs text-gray-600 mt-1">Paid</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.collection_rate}% collection rate
          </p>
        </Paper>

        {/* Overdue Payments */}
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <IconAlertTriangle
              size={20}
              className={stats.overdue > 5 ? "text-red-600" : "text-orange-600"}
            />
          </Group>
          <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
          <p className="text-xs text-gray-600 mt-1">Overdue Payments</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.moved_out_this_month} moved out this month
          </p>
        </Paper>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value || "overview")}
      >
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconTable size={16} />}>
              Tenants
            </Tabs.Tab>
            <Tabs.Tab
              value="analytics"
              leftSection={<IconChartLine size={16} />}
            >
              Analytics
            </Tabs.Tab>
          </Tabs.List>
        </Paper>

        <Tabs.Panel value="overview" pt="md">
          <div className="space-y-4">
            {/* Enhanced Filters */}
            <EnhancedTenantFilters
              filters={filters}
              onChange={handleFiltersChange}
              onExport={handleExport}
              resultCount={processedTenants.length}
            />

            {/* Tenant Table or Empty State */}
            {tenants && tenants.length ? (
              <div className="space-y-4">
                <EnhancedTenantTable
                  data={processedTenants}
                  onSort={handleSort}
                  sortField={filters.sortBy}
                  sortDirection={filters.sortOrder}
                />

                {pagination.pages > 1 && (
                  <Paper shadow="sm" p="md" radius="md" withBorder>
                    <Pagination.Root
                      total={pagination.pages}
                      value={pagination.page}
                      onChange={handlePageChange}
                    >
                      <Group gap={5} justify="center">
                        <Pagination.First />
                        <Pagination.Previous />
                        <Pagination.Items />
                        <Pagination.Next />
                        <Pagination.Last />
                      </Group>
                    </Pagination.Root>
                  </Paper>
                )}
              </div>
            ) : (
              <Paper shadow="sm" p="xl" radius="md" withBorder>
                <EmptyState>
                  <IconUsers size={48} className="text-gray-400 mb-4" />
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    No tenants found
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {filters.search ||
                    filters.paymentStatus.length > 0 ||
                    filters.leaseStatus.length > 0
                      ? "Try adjusting your filters to see more results"
                      : "You don't have any tenants yet"}
                  </p>
                  {filters.search ||
                  filters.paymentStatus.length > 0 ||
                  filters.leaseStatus.length > 0 ? (
                    <Button
                      variant="light"
                      onClick={() =>
                        handleFiltersChange({
                          search: "",
                          paymentStatus: [],
                          leaseStatus: [],
                          dateRange: [null, null],
                          sortBy: "name",
                          sortOrder: "asc",
                          propertyType: [],
                        })
                      }
                    >
                      Clear Filters
                    </Button>
                  ) : null}
                </EmptyState>
              </Paper>
            )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="analytics">
          <TenantAnalytics
            data={{
              monthly_trends: [],
              payment_distribution: [
                { status: "paid", count: stats.paid, percentage: 0 },
                { status: "unpaid", count: stats.unpaid, percentage: 0 },
                { status: "overdue", count: stats.overdue, percentage: 0 },
              ],
              lease_status_distribution: [
                { status: "active", count: stats.active, percentage: 0 },
              ],
              revenue_trends: [],
              property_performance: [],
            }}
            loading={loading}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Tenants;
