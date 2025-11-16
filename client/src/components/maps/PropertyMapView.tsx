/**
 * PropertyMapView Component
 *
 * This component provides a comprehensive property viewing experience with:
 * - A split-screen layout: property list on left, interactive map on right
 * - Advanced filtering system (location, price range, listing type, category, bedrooms)
 * - Real-time property fetching based on map bounds and filters
 * - Interactive property selection and hover states synchronized between list and map
 * - Debounced API calls to optimize performance and reduce server load
 *
 * The component manages the coordination between the property list and map,
 * ensuring smooth user experience with efficient data fetching.
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { InteractivePropertyMap } from "./InteractivePropertyMap";
import { PropertyCard } from "../PropertyCard";
import { useDebounce } from "../../hooks/useDebounce";
import { usePublicOperations } from "../../apis/publicApi";
import { useLoading } from "../../hooks/useLoading";

/**
 * Interface for map geographical boundaries
 * Used to fetch properties within the visible map area
 */
interface MapBounds {
  north: number; // Northern latitude boundary
  south: number; // Southern latitude boundary
  east: number; // Eastern longitude boundary
  west: number; // Western longitude boundary
}

/**
 * Props for PropertyMapView component
 */
interface PropertyMapViewProps {
  initialProperties?: Property[];
  onPropertySelect?: (property: Property) => void;
  showFilters?: boolean;
  className?: string;
  initialFilters?: {
    min_price?: string;
    max_price?: string;
    bedrooms?: string;
    listing_type?: string;
    category?: string;
    city?: string;
    area?: string;
    location?: string;
    lat?: string;
    lng?: string;
  };
  userLocation?: {
    lat: number;
    lng: number;
  };
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  initialProperties = [],
  onPropertySelect,
  showFilters = true,
  className = "",
  initialFilters = {},
  userLocation,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Core property data - stores all properties fetched from the API
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  // Property currently selected by user (highlighted in both list and map)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Property being hovered over (shows preview state)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  // Loading state management hook
  const { loading, withLoading } = useLoading();

  // Current visible map boundaries (used to fetch properties in view)
  const [currentBounds, setCurrentBounds] = useState<MapBounds | null>(null);

  // Controls visibility of price filter dropdown
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  // Local state for price inputs (separate from filters to prevent UI shake during typing)
  const [localMinPrice, setLocalMinPrice] = useState("");
  const [localMaxPrice, setLocalMaxPrice] = useState("");

  // Active filter state - these values trigger API calls when changed
  const [filters, setFilters] = useState({
    min_price: initialFilters.min_price || "",
    max_price: initialFilters.max_price || "",
    bedrooms: initialFilters.bedrooms || "",
    listing_type: initialFilters.listing_type || "",
    category: initialFilters.category || "",
    city: initialFilters.city || initialFilters.location || "",
    area: initialFilters.area || "",
    location: initialFilters.location || "",
  });
  // API operations hook for fetching properties
  const publicOperations = usePublicOperations();

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Formats a numeric string with thousand separators (commas)
   * Example: "1000000" -> "1,000,000"
   * This improves readability of large numbers in the UI
   */
  const formatNumberWithCommas = (value: string) => {
    if (!value) return "";
    // Remove all non-digits to clean input
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    // Use browser's locale formatting to add commas
    return parseInt(numbers).toLocaleString();
  };

  /**
   * Removes commas from formatted numbers for API calls
   * Example: "1,000,000" -> "1000000"
   * API expects plain numeric strings without formatting
   */
  const removeCommas = (value: string) => {
    return value.replace(/,/g, "");
  };

  // ============================================================================
  // DEBOUNCING
  // ============================================================================

  // Debounce map bounds changes (500ms) - reduces API calls during map pan/zoom
  const debouncedBounds = useDebounce(currentBounds, 500);

  // Debounce filter changes (800ms) - allows user to finish typing before fetching
  const debouncedFilters = useDebounce(filters, 800);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetches properties from the API based on map bounds and active filters
   *
   * This function is called when:
   * - Map is panned or zoomed (bounds change)
   * - User applies new filters
   * - Component first loads
   *
   * @param bounds - Optional map boundaries to constrain property search
   * @param searchFilters - Optional filter object (price, bedrooms, etc.)
   */
  const fetchProperties = useCallback(
    async (bounds?: MapBounds, searchFilters?: any) => {
      try {
        // Build URL query parameters for API request
        const params = new URLSearchParams();

        // Add geographical boundaries if map has been moved
        // This fetches only properties visible in the current map view
        if (bounds) {
          params.append("north", bounds.north.toString());
          params.append("south", bounds.south.toString());
          params.append("east", bounds.east.toString());
          params.append("west", bounds.west.toString());
        }

        // Add user-selected filters (price, bedrooms, type, etc.)
        // Only non-empty values are included
        if (searchFilters) {
          Object.entries(searchFilters).forEach(([key, value]) => {
            if (value && value !== "") {
              params.append(key, value as string);
            }
          });
        }

        // Request large batch for map view (shows many properties at once)
        params.append("per_page", "500");

        // Fetch properties with loading state management
        const response = await withLoading(
          publicOperations.getAllProperties(params)
        );

        // Update properties state with fetched data
        setProperties(response.properties || []);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    },
    [] // Empty dependency array - function stable across renders
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Called when user pans or zooms the map
   * Updates current bounds which triggers property fetch after debounce
   */
  const handleMapBoundsChange = useCallback((bounds: MapBounds) => {
    setCurrentBounds(bounds);
  }, []);

  /**
   * Called when user clicks a property (in list or on map)
   * Updates selection state and notifies parent component
   */
  const handlePropertySelect = useCallback(
    (property: Property) => {
      setSelectedProperty(property);
      onPropertySelect?.(property); // Notify parent (usually navigates to details)
    },
    [onPropertySelect]
  );

  /**
   * Called when user hovers over a property card or map marker
   * Provides visual feedback by highlighting the corresponding element
   */
  const handlePropertyHover = useCallback((property: Property | null) => {
    setHoveredProperty(property);
  }, []);

  /**
   * Updates filter state when user changes filter inputs
   * Changes are debounced to prevent excessive API calls
   */
  const handleFilterChange = useCallback(
    (filterName: string, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [filterName]: value,
      }));
    },
    []
  );

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================

  /**
   * Fetch properties when map bounds change (after debounce)
   * This creates a "search as you scroll" experience
   */
  useEffect(() => {
    if (debouncedBounds) {
      fetchProperties(debouncedBounds, debouncedFilters);
    }
  }, [debouncedBounds, fetchProperties, debouncedFilters]);

  /**
   * Fetch properties when filters change (without bounds constraint)
   * Only runs if map hasn't been moved yet (no bounds set)
   */
  useEffect(() => {
    if (!currentBounds) {
      fetchProperties(undefined, debouncedFilters);
    }
  }, [debouncedFilters, currentBounds, fetchProperties]);

  /**
   * Initialize filters from props (usually from URL parameters)
   * This allows users to share filtered map URLs
   */
  useEffect(() => {
    setFilters({
      min_price: initialFilters.min_price || "",
      max_price: initialFilters.max_price || "",
      bedrooms: initialFilters.bedrooms || "",
      listing_type: initialFilters.listing_type || "",
      category: initialFilters.category || "",
      city: initialFilters.city || initialFilters.location || "",
      area: initialFilters.area || "",
      location: initialFilters.location || "",
    });
    // Also initialize local price state for dropdown
    setLocalMinPrice(initialFilters.min_price || "");
    setLocalMaxPrice(initialFilters.max_price || "");
  }, [initialFilters]);

  /**
   * Sync local price inputs with filter state when dropdown opens
   * Ensures dropdown shows current active filter values
   */
  useEffect(() => {
    if (showPriceDropdown) {
      setLocalMinPrice(filters.min_price);
      setLocalMaxPrice(filters.max_price);
    }
  }, [showPriceDropdown, filters.min_price, filters.max_price]);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  /**
   * Filter properties to only include those with valid coordinates
   * Only these properties can be displayed on the map
   * Memoized to prevent unnecessary recalculation
   */
  const mapMarkers = useMemo(() => {
    return properties.filter(
      (property) => property.latitude && property.longitude
    );
  }, [properties]);

  // Currently selected property (passed to map for highlighting)
  const selectedMarker = selectedProperty;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`property-map-view flex flex-col h-full ${className}`}>
      {/* Filters Bar */}
      {showFilters && (
        <div className="filters-bar bg-white border p-2 border-gray-400 mb-0 flex-shrink-0 z-20 relative">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="City, Area, or Location"
                value={filters.location || filters.city || filters.area}
                onChange={(e) => {
                  handleFilterChange("location", e.target.value);
                  handleFilterChange("city", e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {filters.min_price || filters.max_price
                    ? `₦${formatNumberWithCommas(
                        filters.min_price || "0"
                      )} - ₦${
                        filters.max_price
                          ? formatNumberWithCommas(filters.max_price)
                          : "Any"
                      }`
                    : "Price Range"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    showPriceDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Content */}
              {showPriceDropdown && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-[320px]">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Min Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          ₦
                        </span>
                        <input
                          type="text"
                          placeholder="0"
                          value={formatNumberWithCommas(localMinPrice)}
                          onChange={(e) => {
                            const raw = removeCommas(e.target.value);
                            setLocalMinPrice(raw);
                          }}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          ₦
                        </span>
                        <input
                          type="text"
                          placeholder="Any"
                          value={formatNumberWithCommas(localMaxPrice)}
                          onChange={(e) => {
                            const raw = removeCommas(e.target.value);
                            setLocalMaxPrice(raw);
                          }}
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setLocalMinPrice("");
                        setLocalMaxPrice("");
                        handleFilterChange("min_price", "");
                        handleFilterChange("max_price", "");
                        setShowPriceDropdown(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange("min_price", localMinPrice);
                        handleFilterChange("max_price", localMaxPrice);
                        setShowPriceDropdown(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <select
              value={filters.listing_type}
              onChange={(e) =>
                handleFilterChange("listing_type", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Listing Type</option>
              <option value="rent">For Rent</option>
              <option value="short-let">Short Let</option>
              <option value="lease">Lease</option>
              <option value="sale">For Sale</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Category</option>
              <option value="apartment">Apartment</option>
              <option value="duplex">Duplex</option>
              <option value="bungalow">Bungalow</option>
              <option value="lodge">Lodge</option>
              <option value="mansion">Mansion</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
              <option value="townhouse">Townhouse</option>
              <option value="villa">Villa</option>
              <option value="flat">Flat</option>
            </select>

            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5 Bedrooms</option>
              <option value="5+">5+ Bedrooms</option>
            </select>

            <div className="text-sm text-gray-600">
              {properties.length} properties
              {loading && " • Loading..."}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Property List */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 relative z-10 h-full">
          <div className="p-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">
                  Loading properties...
                </span>
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No properties found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or zoom out on the map
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                  onClick={() => handlePropertySelect(property)}
                  onHover={() => handlePropertyHover(property)}
                  onMouseLeave={() => handlePropertyHover(null)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedProperty?.id === property.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : hoveredProperty?.id === property.id
                      ? "ring-1 ring-blue-300 bg-blue-50 shadow-lg transform scale-[1.02]"
                      : "hover:shadow-md"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="w-1/2 h-full sticky top-0 z-0 overflow-hidden">
          <InteractivePropertyMap
            properties={mapMarkers}
            selectedProperty={selectedMarker}
            hoveredProperty={hoveredProperty}
            onPropertySelect={() => {}}
            onPropertyHover={handlePropertyHover}
            onMapBoundsChange={handleMapBoundsChange}
            center={
              userLocation ? [userLocation.lat, userLocation.lng] : undefined
            }
            zoom={userLocation ? 15 : undefined}
            className="h-full w-full"
          />

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30">
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-700">Updating map...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMapView;
