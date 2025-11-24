/**
 * ShortletsPage Component
 *
 * Displays shortlet properties with filtering and sorting capabilities.
 * Shortlets are properties available for short-term rental (daily/weekly basis).
 *
 * Features:
 * - Grid layout of shortlet property cards
 * - Filter by location, price range, and bedrooms
 * - Sort by price and date
 * - Responsive design
 * - Click to view property details
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePublicOperations } from "../../apis/publicApi";
import { useLoading } from "../../hooks/useLoading";
import { useDebounce } from "../../hooks/useDebounce";
import ShortletCard from "@/components/ShortletCard";
import ShortletFilters from "@/components/ShortletFilters";
import EmptyState from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";

export const ShortletsPage: React.FC = () => {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, withLoading } = useLoading();
  const { getAllProperties } = usePublicOperations();

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(24);

  // Filter state
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    city: searchParams.get("city") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    sort: searchParams.get("sort") || "newest",
  });

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 800);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetches shortlet properties from API based on active filters
   */
  const fetchShortlets = useCallback(async () => {
    try {
      setError(null);

      // Build API parameters
      const params: Record<string, string> = {
        listing_type: "short-let", // Only fetch shortlets
        page: currentPage.toString(),
        per_page: perPage.toString(),
      };

      // Add filters
      if (debouncedFilters.location)
        params.location = debouncedFilters.location;
      if (debouncedFilters.city) params.city = debouncedFilters.city;
      if (debouncedFilters.min_price)
        params.min_price = debouncedFilters.min_price;
      if (debouncedFilters.max_price)
        params.max_price = debouncedFilters.max_price;
      if (debouncedFilters.bedrooms)
        params.bedrooms = debouncedFilters.bedrooms;
      if (debouncedFilters.sort) params.sort = debouncedFilters.sort;

      // Fetch from API
      const response = await withLoading(getAllProperties(params));

      if (response?.properties && Array.isArray(response.properties)) {
        setProperties(response.properties);
        setTotalCount(response.total || response.properties.length);
      } else {
        setProperties([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Failed to fetch shortlets:", err);
      setError(err.message || "Failed to load shortlets. Please try again.");
      setProperties([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage, debouncedFilters]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Fetch shortlets when filters or page changes
   */
  useEffect(() => {
    fetchShortlets();
  }, [fetchShortlets]);

  /**
   * Update URL params when filters change
   */
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [debouncedFilters, setSearchParams]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  /**
   * Handle property selection - navigate to details page
   */
  const handlePropertyClick = (property: Property) => {
    navigate(`/listings/${property.id}`);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / perPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shortlet Properties
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Find the perfect short-term rental for your stay
              </p>
            </div>

            {/* Results count */}
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">
                      {totalCount}
                    </span>{" "}
                    {totalCount === 1 ? "property" : "properties"} found
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32">
              <ShortletFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
            </div>
          </aside>

          {/* Property Grid */}
          <main className="mt-8 lg:mt-0 lg:col-span-9">
            {/* Error State */}
            {error && (
              <ErrorState
                message={error}
                loading={loading}
                onRetry={fetchShortlets}
              />
            )}

            {/* Loading State */}
            {loading && properties.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading shortlets...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && properties.length === 0 && (
              <EmptyState>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No shortlets found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search in a different location
                </p>
              </EmptyState>
            )}

            {/* Property Grid */}
            {!error && properties.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <ShortletCard
                      key={property.id}
                      property={property}
                      onClick={() => handlePropertyClick(property)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage || loading}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        hasPrevPage && !loading
                          ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage || loading}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        hasNextPage && !loading
                          ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShortletsPage;
