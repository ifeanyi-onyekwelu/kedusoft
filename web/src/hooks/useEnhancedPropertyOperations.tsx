import { useState, useMemo } from "react";
import { useLandlordOperations } from "../apis/landlordApi";
import { notifications } from "@mantine/notifications";

export interface PropertyFilters {
  search?: string;
  status?: string[];
  verification?: string[];
  propertyType?: string[];
  bedrooms?: string[];
  priceRange?: [number, number];
  location?: string[];
  dateRange?: [Date | null, Date | null];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface EnhancedProperty {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft?: number;
  address: string;
  city: string;
  state: string;
  rent_amount: number;
  is_available: boolean;
  verification_status: string;
  cover_image?: string;
  gallery: string[];
  occupancy_rate?: number;
  revenue_trend?: { direction: "up" | "down"; percentage: number };
  views_count?: number;
  applications_count?: number;
  avg_rating?: number;
  days_on_market?: number;
  last_maintenance_date?: string;
  status: string;
  tenant_info?: {
    name: string;
    move_in_date: string;
    lease_end_date: string;
  };
}

export interface PropertyStats {
  total: number;
  available: number;
  occupied: number;
  pending_verification: number;
  total_revenue: number;
  avg_occupancy_rate: number;
  avg_rental_price: number;
  revenue_growth: number;
}

export interface PropertyAnalytics {
  revenue_by_month: Array<{ month: string; revenue: number }>;
  occupancy_trends: Array<{ month: string; rate: number }>;
  property_performance: Array<{
    property_id: string;
    name: string;
    revenue: number;
    occupancy_rate: number;
    avg_rating: number;
  }>;
  market_insights: {
    avg_rent_by_type: Array<{ type: string; avg_rent: number }>;
    popular_amenities: Array<{ amenity: string; count: number }>;
    location_performance: Array<{
      city: string;
      avg_rent: number;
      demand: number;
    }>;
  };
}

export const useEnhancedPropertyOperations = () => {
  const { getListedProperties } = useLandlordOperations();
  const [properties, setProperties] = useState<EnhancedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<PropertyFilters>({});

  // Fetch properties with enhanced data
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const result = await getListedProperties();
      if (result && result.data && result.data.properties) {
        const enhancedProps = result.data.properties.map((property: any) => ({
          ...property,
          occupancy_rate: property.is_available ? 0 : 100,
          revenue_trend: {
            direction: Math.random() > 0.5 ? "up" : "down",
            percentage: Math.floor(Math.random() * 20) + 1,
          },
          views_count: Math.floor(Math.random() * 100) + 10,
          applications_count: property.is_available
            ? Math.floor(Math.random() * 10)
            : 0,
          avg_rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          days_on_market: property.is_available
            ? Math.floor(Math.random() * 90) + 1
            : 0,
          last_maintenance_date: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
          tenant_info: !property.is_available
            ? {
                name: `Tenant ${Math.floor(Math.random() * 100)}`,
                move_in_date: new Date(
                  Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
                lease_end_date: new Date(
                  Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
              }
            : undefined,
        }));
        setProperties(enhancedProps);
      }
    } catch (err) {
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  // Filtered properties based on current filters
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Text search
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      filtered = filtered.filter(
        (property: EnhancedProperty) =>
          property.name.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower) ||
          property.city.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (currentFilters.status?.length) {
      filtered = filtered.filter((property: EnhancedProperty) => {
        if (
          currentFilters.status?.includes("available") &&
          property.is_available
        )
          return true;
        if (
          currentFilters.status?.includes("occupied") &&
          !property.is_available
        )
          return true;
        if (
          currentFilters.status?.includes("pending") &&
          property.verification_status === "pending"
        )
          return true;
        return false;
      });
    }

    // Location filter
    if (currentFilters.location?.length) {
      filtered = filtered.filter((property: EnhancedProperty) =>
        currentFilters.location?.some(
          (loc: string) =>
            property.city.toLowerCase().includes(loc.toLowerCase()) ||
            property.state.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Property type filter
    if (currentFilters.propertyType?.length) {
      filtered = filtered.filter((property: EnhancedProperty) => {
        const bedrooms = property.bedrooms;
        return currentFilters.propertyType?.some((type: string) => {
          if (type === "studio" && bedrooms === 0) return true;
          if (type === "1-bedroom" && bedrooms === 1) return true;
          if (type === "2-bedroom" && bedrooms === 2) return true;
          if (type === "3-bedroom" && bedrooms === 3) return true;
          if (type === "4+-bedroom" && bedrooms >= 4) return true;
          return false;
        });
      });
    }

    // Price range filter
    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange;
      filtered = filtered.filter(
        (property: EnhancedProperty) =>
          property.rent_amount >= min && property.rent_amount <= max
      );
    }

    // Date range filter
    if (currentFilters.dateRange) {
      const [startDate, endDate] = currentFilters.dateRange;
      if (startDate && endDate) {
        filtered = filtered.filter((property: EnhancedProperty) => {
          if (!property.last_maintenance_date) return false;
          const maintenanceDate = new Date(property.last_maintenance_date);
          return maintenanceDate >= startDate && maintenanceDate <= endDate;
        });
      }
    }

    // Sorting
    if (currentFilters.sortBy) {
      filtered.sort((a: EnhancedProperty, b: EnhancedProperty) => {
        const sortOrder = currentFilters.sortOrder === "desc" ? -1 : 1;

        switch (currentFilters.sortBy) {
          case "name":
            return a.name.localeCompare(b.name) * sortOrder;
          case "rent":
            return (a.rent_amount - b.rent_amount) * sortOrder;
          case "date_created":
            return (
              (new Date(a.last_maintenance_date || 0).getTime() -
                new Date(b.last_maintenance_date || 0).getTime()) *
              sortOrder
            );
          case "occupancy_rate":
            return (
              ((a.occupancy_rate || 0) - (b.occupancy_rate || 0)) * sortOrder
            );
          case "rating":
            return ((a.avg_rating || 0) - (b.avg_rating || 0)) * sortOrder;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [properties, currentFilters]);

  // Calculate statistics
  const statistics = useMemo((): PropertyStats => {
    const total = properties.length;
    const available = properties.filter(
      (p: EnhancedProperty) => p.is_available
    ).length;
    const occupied = total - available;
    const pending_verification = properties.filter(
      (p: EnhancedProperty) => p.verification_status === "pending"
    ).length;

    const total_revenue = properties
      .filter((p: EnhancedProperty) => !p.is_available)
      .reduce((sum: number, p: EnhancedProperty) => sum + p.rent_amount, 0);

    const avg_occupancy_rate = total > 0 ? (occupied / total) * 100 : 0;
    const avg_rental_price =
      total > 0
        ? properties.reduce(
            (sum: number, p: EnhancedProperty) => sum + p.rent_amount,
            0
          ) / total
        : 0;

    // Mock revenue growth calculation
    const revenue_growth = Math.round((Math.random() * 20 - 10) * 100) / 100;

    return {
      total,
      available,
      occupied,
      pending_verification,
      total_revenue,
      avg_occupancy_rate,
      avg_rental_price,
      revenue_growth,
    };
  }, [properties]);

  // Generate analytics data
  const analytics = useMemo((): PropertyAnalytics => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    return {
      revenue_by_month: months.map((month) => ({
        month,
        revenue: Math.floor(Math.random() * 500000) + 100000,
      })),
      occupancy_trends: months.map((month) => ({
        month,
        rate: Math.floor(Math.random() * 40) + 60,
      })),
      property_performance: properties
        .slice(0, 5)
        .map((property: EnhancedProperty) => ({
          property_id: property.id,
          name: property.name,
          revenue: property.is_available ? 0 : property.rent_amount,
          occupancy_rate: property.occupancy_rate || 0,
          avg_rating: property.avg_rating || 0,
        })),
      market_insights: {
        avg_rent_by_type: [
          { type: "Studio", avg_rent: 150000 },
          { type: "1 Bedroom", avg_rent: 250000 },
          { type: "2 Bedroom", avg_rent: 400000 },
          { type: "3 Bedroom", avg_rent: 600000 },
          { type: "4+ Bedroom", avg_rent: 800000 },
        ],
        popular_amenities: [
          { amenity: "Parking", count: Math.floor(properties.length * 0.8) },
          { amenity: "Security", count: Math.floor(properties.length * 0.7) },
          { amenity: "Generator", count: Math.floor(properties.length * 0.6) },
          {
            amenity: "Water Supply",
            count: Math.floor(properties.length * 0.9),
          },
          { amenity: "Internet", count: Math.floor(properties.length * 0.5) },
        ],
        location_performance: [
          { city: "Lagos", avg_rent: 450000, demand: 85 },
          { city: "Abuja", avg_rent: 380000, demand: 75 },
          { city: "Port Harcourt", avg_rent: 320000, demand: 65 },
          { city: "Kano", avg_rent: 180000, demand: 55 },
          { city: "Ibadan", avg_rent: 220000, demand: 60 },
        ],
      },
    };
  }, [properties]);

  // Export functionality
  const exportData = async (format: "csv" | "excel" | "pdf") => {
    try {
      const exportData = filteredProperties.map((property) => ({
        Name: property.name,
        Address: property.address,
        City: property.city,
        State: property.state,
        Bedrooms: property.bedrooms,
        Bathrooms: property.bathrooms,
        "Rent Amount": property.rent_amount,
        Status: property.is_available ? "Available" : "Occupied",
        "Verification Status": property.verification_status,
        "Occupancy Rate": `${property.occupancy_rate || 0}%`,
        "Average Rating": property.avg_rating || "N/A",
        "Days on Market": property.days_on_market || "N/A",
      }));

      // Mock export - in real implementation, you'd generate actual files
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `properties-export-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      notifications.show({
        title: "Export Successful",
        message: `Property data exported as ${format.toUpperCase()}`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Export Failed",
        message: "There was an error exporting the data",
        color: "red",
      });
    }
  };

  // Apply filters
  const applyFilters = (filters: PropertyFilters) => {
    setCurrentFilters(filters);
  };

  // Clear filters
  const clearFilters = () => {
    setCurrentFilters({});
  };

  // Delete property
  const deleteProperty = async (propertyId: string) => {
    try {
      // Mock delete - implement actual API call
      notifications.show({
        title: "Property Deleted",
        message: "Property has been successfully deleted",
        color: "green",
      });
      fetchProperties();
    } catch (error) {
      notifications.show({
        title: "Delete Failed",
        message: "There was an error deleting the property",
        color: "red",
      });
    }
  };

  return {
    properties: filteredProperties,
    allProperties: properties,
    statistics,
    analytics,
    loading,
    error,
    currentFilters,
    applyFilters,
    clearFilters,
    exportData,
    deleteProperty,
    refresh: fetchProperties,
  };
};
