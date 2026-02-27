import React, { useState, useEffect, useCallback, useMemo } from "react";
import { InteractivePropertyMap } from "./InteractivePropertyMap";
import PropertyCard from "../screens/Public/PropertyCard.tsx";
import { useDebounce } from "../../hooks/useDebounce";
import { usePublicOperations } from "../../apis/publicApi";
import { useLoading } from "../../hooks/useLoading";


interface MapBounds {
  north: number; // Northern latitude boundary
  south: number; // Southern latitude boundary
  east: number; // Eastern longitude boundary
  west: number; // Western longitude boundary
}


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

  // Controls visibility of mobile filter panel
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const handleMapBoundsChange = useCallback((bounds: MapBounds) => {
    setCurrentBounds(bounds);
  }, []);

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
      {/* Mobile Filter Toggle Button */}
      {showFilters && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-2 flex-shrink-0 z-20">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
            </div>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">
              {Object.values(filters).filter((v) => v).length}
            </span>
          </button>
        </div>
      )}

      {/* Filters - Collapsible on mobile, always visible on desktop */}
      {showFilters && (
        <div
          className={`${
            showMobileFilters ? "block lg:flex" : "hidden lg:flex"
          } bg-white border-b border-gray-200 flex-shrink-0 z-20`}
        >
          <div className="w-full flex flex-col lg:flex-row gap-2 lg:gap-3 p-3 lg:p-4 items-stretch lg:items-center">
            {/* Search Input */}
            <div className="w-full lg:flex-1 lg:min-w-[240px]">
              <input
                type="text"
                placeholder="City, Area, or Location"
                value={filters.location || filters.city || filters.area}
                onChange={(e) => {
                  handleFilterChange("location", e.target.value);
                  handleFilterChange("city", e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Price Filter */}
            <div className="relative w-full lg:w-auto lg:flex-shrink-0">
              <button
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors flex items-center justify-between lg:justify-center gap-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600 flex-shrink-0"
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
                  <span className="hidden sm:inline">
                    {filters.min_price || filters.max_price
                      ? `₦${formatNumberWithCommas(
                          filters.min_price || "0"
                        )} - ₦${
                          filters.max_price
                            ? formatNumberWithCommas(filters.max_price)
                            : "Any"
                        }`
                      : "Price"}
                  </span>
                  <span className="sm:hidden">Price</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0`}
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

              {/* Price Dropdown */}
              {showPriceDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 lg:left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 min-w-full lg:min-w-[340px]">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Min
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
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
                          className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
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
                          className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setLocalMinPrice("");
                        setLocalMaxPrice("");
                        handleFilterChange("min_price", "");
                        handleFilterChange("max_price", "");
                        setShowPriceDropdown(false);
                      }}
                      className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange("min_price", localMinPrice);
                        handleFilterChange("max_price", localMaxPrice);
                        setShowPriceDropdown(false);
                      }}
                      className="flex-1 px-2 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Listing Type */}
            <select
              value={filters.listing_type}
              onChange={(e) =>
                handleFilterChange("listing_type", e.target.value)
              }
              className="w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Listing</option>
              <option value="rent">Rent</option>
              <option value="short-let">Short Let</option>
              <option value="lease">Lease</option>
              <option value="sale">Sale</option>
            </select>

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Category</option>
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

            {/* Bedrooms */}
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              className="w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Bed</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="5+">5+</option>
            </select>

            {/* Property Count */}
            <div className="text-xs lg:text-sm text-gray-600 font-medium py-1 lg:py-0">
              {properties.length} found {loading && "..."}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        {/* Property List - Full width on mobile, 50% on desktop */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50 relative z-10 h-1/2 lg:h-full flex flex-col">
          <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 text-sm">Loading...</span>
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4 text-sm">
                  No properties found
                </p>
                <p className="text-xs text-gray-500">
                  Try adjusting filters or zoom out
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
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

        {/* Interactive Map - Full width on mobile, 50% on desktop */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full sticky bottom-0 lg:sticky lg:top-0 z-0 overflow-hidden">
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
              <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-700 text-sm">Updating...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMapView;
