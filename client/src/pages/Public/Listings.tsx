/**
 * PropertyMapPage Component
 *
 * Main page for the map-based property listing view.
 * This is the entry point that:
 * - Fetches initial property data from the API
 * - Extracts filter parameters from URL (for shareable links)
 * - Handles navigation to property details
 * - Manages loading and error states
 * - Renders the PropertyMapView component with initial data
 *
 * URL Parameters Supported:
 * - city, area, location: Geographic filters
 * - min_price, max_price: Price range
 * - bedrooms: Number of bedrooms
 * - listing_type: rent, sale, lease, etc.
 * - property_type: apartment, duplex, etc.
 * - lat, lng: User's current location
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PropertyMapView } from "../../components/maps/PropertyMapView";
import { usePublicOperations } from "../../apis/publicApi";
import { useLoading } from "../../hooks/useLoading";
import { ErrorState } from "../../components/ErrorState";

interface PropertyMapPageProps {}

export const PropertyMapPage: React.FC<PropertyMapPageProps> = () => {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  // Navigation hook for routing to property details
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { loading, withLoading } = useLoading();

  const { getAllProperties } = usePublicOperations();

  const [initialProperties, setInitialProperties] = useState<Property[]>([]);

  const [error, setError] = useState<string | null>(null);

  const getInitialFilters = useCallback(() => {
    const propertyType = searchParams.get("property_type") || "";
    const lat = searchParams.get("lat") || "";
    const lng = searchParams.get("lng") || "";

    return {
      city: searchParams.get("city") || "",
      area: searchParams.get("area") || "",
      location: searchParams.get("location") || "",
      min_price: searchParams.get("min_price") || "",
      max_price: searchParams.get("max_price") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      listing_type: searchParams.get("listing_type") || "",
      category: propertyType,
      lat,
      lng,
    };
  }, [searchParams]);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  /**
   * Loads initial set of properties from the API
   *
   * This provides PropertyMapView with starting data before
   * the user interacts with the map. The component will fetch
   * more properties as the user pans/zooms.
   *
   * Fetches up to 100 properties based on URL filter parameters
   */
  const loadInitialProperties = useCallback(async () => {
    try {
      // Clear any previous errors
      setError(null);

      // Build API parameters from URL filters
      const params: Record<string, any> = {};
      const filters = getInitialFilters();

      // Add non-empty filter values to API params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          params[key] = value;
        }
      });

      // Request initial batch of 100 properties
      params.per_page = 100;

      // Fetch properties with loading state
      const response = await withLoading(getAllProperties(params));

      // Update state with fetched properties
      if (response?.properties && Array.isArray(response.properties)) {
        setInitialProperties(response.properties);
      } else {
        setInitialProperties([]);
      }
    } catch (err: any) {
      // Handle and display errors
      console.error("Failed to fetch initial properties:", err);
      setError(err.message || "Failed to load properties. Please try again.");
      setInitialProperties([]);
    }
  }, [getInitialFilters]);

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  /**
   * Load properties when component mounts
   * Empty dependency array ensures this runs only once
   */
  useEffect(() => {
    loadInitialProperties();
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Called when user clicks a property (from list or map)
   * Navigates to the property details page
   */
  const handlePropertySelect = (property: Property) => {
    navigate(`/listings/${property.id}`);
  };

  /**
   * Navigates back to the list view
   * Preserves current filter parameters in URL
   */
  const handleBackToList = () => {
    const currentParams = new URLSearchParams(searchParams);
    navigate(`/listings?${currentParams.toString()}`);
  };

  /**
   * Reloads properties from the API
   * Useful if data becomes stale or after errors
   */
  const handleRefresh = () => {
    loadInitialProperties();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  /**
   * LOADING STATE
   * Shown when initially fetching properties (before any data exists)
   */
  if (loading && initialProperties.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ERROR STATE
   * Shown when API request fails
   * Displays error message with option to return to list view
   */
  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-white shadow-sm border-b flex-shrink-0 z-10">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Property Map
                </h1>
                <p className="text-sm text-gray-600">
                  Find properties on the interactive map
                </p>
              </div>
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                List View
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <ErrorState message={error} loading={loading} />
        </div>
      </div>
    );
  }

  /**
   * MAIN VIEW
   * Renders the PropertyMapView component with initial data
   * Takes full screen height with proper overflow handling
   */
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Map View - Takes remaining height */}
      <div className="flex-1 overflow-hidden">
        {/* PropertyMapView Component with all necessary props */}
        <PropertyMapView
          initialProperties={initialProperties}
          onPropertySelect={handlePropertySelect}
          showFilters={true}
          className="h-full"
          initialFilters={getInitialFilters()}
          userLocation={
            searchParams.get("lat") && searchParams.get("lng")
              ? {
                  lat: parseFloat(searchParams.get("lat")!),
                  lng: parseFloat(searchParams.get("lng")!),
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default PropertyMapPage;
