import { useState, useEffect, useCallback, useMemo } from "react";
import { useLandlordOperations } from "../apis/landlordApi";

interface TenantFilters {
  search: string;
  paymentStatus: string[];
  leaseStatus: string[];
  dateRange: [Date | null, Date | null];
  sortBy: string;
  sortOrder: "asc" | "desc";
  propertyType: string[];
}

interface TenantStats {
  total: number;
  active: number;
  paid: number;
  unpaid: number;
  overdue: number;
  new_this_month: number;
  moved_out_this_month: number;
  avg_rent: number;
  collection_rate: number;
  // Historical comparison
  changes: {
    total: {
      value: number;
      percentage: number;
      direction: "up" | "down" | "neutral";
    };
    paid: {
      value: number;
      percentage: number;
      direction: "up" | "down" | "neutral";
    };
    revenue: {
      value: number;
      percentage: number;
      direction: "up" | "down" | "neutral";
    };
    occupancy: {
      value: number;
      percentage: number;
      direction: "up" | "down" | "neutral";
    };
  };
}

interface EnhancedTenant extends Tenant {
  move_in_date?: string;
  rent_amount?: number;
  property_type?: string;
  lease_end_date?: string;
  days_until_lease_end?: number;
  payment_history?: Array<{
    date: string;
    amount: number;
    status: string;
  }>;
}

export const useEnhancedTenantOperations = () => {
  const { getTenants, getTenantStats } = useLandlordOperations();
  const [tenants, setTenants] = useState<EnhancedTenant[]>([]);
  const [stats, setStats] = useState<TenantStats>({
    total: 0,
    active: 0,
    paid: 0,
    unpaid: 0,
    overdue: 0,
    new_this_month: 0,
    moved_out_this_month: 0,
    avg_rent: 0,
    collection_rate: 0,
    changes: {
      total: { value: 0, percentage: 0, direction: "neutral" },
      paid: { value: 0, percentage: 0, direction: "neutral" },
      revenue: { value: 0, percentage: 0, direction: "neutral" },
      occupancy: { value: 0, percentage: 0, direction: "neutral" },
    },
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Enhanced fetch function with filters
  const fetchEnhancedTenants = useCallback(
    async (
      page: number = 1,
      filters: TenantFilters,
      includeAnalytics: boolean = false
    ) => {
      try {
        setLoading(true);

        // Prepare API parameters
        const params = {
          page,
          limit: pagination.limit,
          search: filters.search || undefined,
          payment_status:
            filters.paymentStatus.length > 0
              ? filters.paymentStatus.join(",")
              : undefined,
          lease_status:
            filters.leaseStatus.length > 0
              ? filters.leaseStatus.join(",")
              : undefined,
          sort_by: filters.sortBy,
          sort_order: filters.sortOrder,
          start_date: filters.dateRange[0]?.toISOString() || undefined,
          end_date: filters.dateRange[1]?.toISOString() || undefined,
          include_analytics: includeAnalytics,
        };

        const response = await getTenants(params);

        if (response && response.items) {
          // Enhanced tenant data processing
          const enhancedTenants = response.items.map((tenant: any) => ({
            ...tenant,
            move_in_date: tenant.properties?.[0]?.lease?.start_date,
            rent_amount: tenant.properties?.[0]?.lease?.monthly_rent,
            property_type: tenant.properties?.[0]?.category?.name,
            lease_end_date: tenant.properties?.[0]?.lease?.end_date,
            days_until_lease_end: tenant.properties?.[0]?.lease?.end_date
              ? Math.ceil(
                  (new Date(tenant.properties[0].lease.end_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : null,
          }));

          setTenants(enhancedTenants);
          setPagination({
            page,
            limit: pagination.limit,
            total: response.total || enhancedTenants.length,
            pages:
              response.pages ||
              Math.ceil(
                (response.total || enhancedTenants.length) / pagination.limit
              ),
          });
        }
      } catch (error) {
        console.error("Error fetching enhanced tenants:", error);
      } finally {
        setLoading(false);
      }
    },
    [getTenants, pagination.limit]
  );

  // Enhanced stats fetch with historical comparison
  const fetchEnhancedStats = useCallback(async () => {
    try {
      const currentStats = await getTenantStats();

      // Simulate historical comparison (in real app, this would come from API)
      const previousMonthStats = {
        total: currentStats.total - 2,
        paid: currentStats.paid - 1,
        revenue: 2500000, // Previous month revenue
        occupancy: 85, // Previous month occupancy
      };

      const calculateChange = (current: number, previous: number) => {
        const value = current - previous;
        const percentage =
          previous > 0 ? Math.abs((value / previous) * 100) : 0;
        const direction = value > 0 ? "up" : value < 0 ? "down" : "neutral";
        return {
          value,
          percentage: Math.round(percentage * 10) / 10,
          direction,
        };
      };

      const currentRevenue = 3000000; // This should come from API
      const currentOccupancy = 92; // This should come from API

      const enhancedStats: TenantStats = {
        ...currentStats,
        new_this_month: 3,
        moved_out_this_month: 1,
        avg_rent: 850000,
        collection_rate: 94.5,
        changes: {
          total: calculateChange(currentStats.total, previousMonthStats.total),
          paid: calculateChange(currentStats.paid, previousMonthStats.paid),
          revenue: calculateChange(currentRevenue, previousMonthStats.revenue),
          occupancy: calculateChange(
            currentOccupancy,
            previousMonthStats.occupancy
          ),
        },
      };

      setStats(enhancedStats);
    } catch (error) {
      console.error("Error fetching enhanced stats:", error);
    }
  }, [getTenantStats]);

  // Filter tenants client-side (for immediate feedback)
  const filterTenants = useCallback(
    (tenants: EnhancedTenant[], filters: TenantFilters) => {
      return tenants.filter((tenant) => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch =
            tenant.name?.toLowerCase().includes(searchLower) ||
            tenant.email?.toLowerCase().includes(searchLower) ||
            tenant.properties?.[0]?.address
              ?.toLowerCase()
              .includes(searchLower);

          if (!matchesSearch) return false;
        }

        // Payment status filter
        if (filters.paymentStatus.length > 0) {
          if (!filters.paymentStatus.includes(tenant.payment_status))
            return false;
        }

        // Lease status filter
        if (filters.leaseStatus.length > 0) {
          const leaseStatus = tenant.properties?.[0]?.lease?.status;
          if (!leaseStatus || !filters.leaseStatus.includes(leaseStatus))
            return false;
        }

        // Property type filter
        if (filters.propertyType.length > 0) {
          if (
            !tenant.property_type ||
            !filters.propertyType.includes(tenant.property_type.toLowerCase())
          )
            return false;
        }

        // Date range filter (move-in date)
        if (filters.dateRange[0] || filters.dateRange[1]) {
          const moveInDate = tenant.move_in_date
            ? new Date(tenant.move_in_date)
            : null;
          if (!moveInDate) return false;

          if (filters.dateRange[0] && moveInDate < filters.dateRange[0])
            return false;
          if (filters.dateRange[1] && moveInDate > filters.dateRange[1])
            return false;
        }

        return true;
      });
    },
    []
  );

  // Sort tenants
  const sortTenants = useCallback(
    (tenants: EnhancedTenant[], sortBy: string, sortOrder: "asc" | "desc") => {
      return [...tenants].sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case "name":
            aValue = a.name?.toLowerCase() || "";
            bValue = b.name?.toLowerCase() || "";
            break;
          case "move_in_date":
            aValue = a.move_in_date ? new Date(a.move_in_date).getTime() : 0;
            bValue = b.move_in_date ? new Date(b.move_in_date).getTime() : 0;
            break;
          case "rent_amount":
            aValue = a.rent_amount || 0;
            bValue = b.rent_amount || 0;
            break;
          case "last_payment":
            aValue = a.last_payment_date
              ? new Date(a.last_payment_date).getTime()
              : 0;
            bValue = b.last_payment_date
              ? new Date(b.last_payment_date).getTime()
              : 0;
            break;
          case "lease_end":
            aValue = a.lease_end_date
              ? new Date(a.lease_end_date).getTime()
              : 0;
            bValue = b.lease_end_date
              ? new Date(b.lease_end_date).getTime()
              : 0;
            break;
          default:
            aValue = a.name?.toLowerCase() || "";
            bValue = b.name?.toLowerCase() || "";
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    },
    []
  );

  // Get filtered and sorted tenants
  const getProcessedTenants = useCallback(
    (filters: TenantFilters) => {
      const filtered = filterTenants(tenants, filters);
      const sorted = sortTenants(filtered, filters.sortBy, filters.sortOrder);
      return sorted;
    },
    [tenants, filterTenants, sortTenants]
  );

  // Export functionality
  const exportTenants = useCallback(
    async (
      filters: TenantFilters,
      format: "csv" | "excel" = "csv"
    ): Promise<number> => {
      const processedTenants = getProcessedTenants(filters);

      if (processedTenants.length === 0) {
        throw new Error("No tenants to export");
      }

      // Prepare export data with comprehensive information
      const exportData = processedTenants.map((tenant) => ({
        "Tenant ID": tenant.id || "N/A",
        "Full Name": tenant.name || "N/A",
        "Email Address": tenant.email || "N/A",
        "Phone Number": tenant.phone || "N/A",
        "Property Address": tenant.properties?.[0]?.address || "N/A",
        "Property Type": tenant.property_type || "N/A",
        "Move-in Date": tenant.move_in_date
          ? new Date(tenant.move_in_date).toLocaleDateString()
          : "N/A",
        "Monthly Rent": tenant.rent_amount
          ? `₦${tenant.rent_amount.toLocaleString()}`
          : "N/A",
        "Payment Status": tenant.payment_status || "N/A",
        "Lease Status": tenant.properties?.[0]?.lease?.status || "N/A",
        "Lease Start Date": tenant.properties?.[0]?.lease?.start_date
          ? new Date(tenant.properties[0].lease.start_date).toLocaleDateString()
          : "N/A",
        "Lease End Date": tenant.lease_end_date
          ? new Date(tenant.lease_end_date).toLocaleDateString()
          : "N/A",
        "Days Until Lease End":
          tenant.days_until_lease_end?.toString() || "N/A",
        "Last Payment Date": tenant.last_payment_date
          ? new Date(tenant.last_payment_date).toLocaleDateString()
          : "N/A",
        "Emergency Contact": (tenant as any).emergency_contact || "N/A",
        "Created Date": tenant.created_at
          ? new Date(tenant.created_at).toLocaleDateString()
          : "N/A",
      }));

      try {
        // Convert to CSV
        if (format === "csv") {
          const headers = Object.keys(exportData[0] || {});
          const csvContent = [
            headers.join(","),
            ...exportData.map((row) =>
              headers
                .map((header) => {
                  const value = (row as any)[header];
                  // Escape quotes and wrap in quotes if contains comma or quote
                  if (
                    typeof value === "string" &&
                    (value.includes(",") || value.includes('"'))
                  ) {
                    return `"${value.replace(/"/g, '""')}"`;
                  }
                  return `"${value}"`;
                })
                .join(",")
            ),
          ].join("\n");

          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `tenants-export-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log(`Exported ${exportData.length} tenants to CSV`);
          return exportData.length;
        }

        return 0;
      } catch (error) {
        console.error("Error exporting tenants:", error);
        throw new Error("Failed to export tenant data");
      }
    },
    [getProcessedTenants]
  );

  return {
    tenants,
    stats,
    loading,
    pagination,
    fetchEnhancedTenants,
    fetchEnhancedStats,
    getProcessedTenants,
    exportTenants,
    filterTenants,
    sortTenants,
  };
};
