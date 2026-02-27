/**
 * ShortletFilters Component
 *
 * Filter sidebar for shortlet listings with location, price, and bedroom filters.
 */

import React, { useState } from "react";

interface ShortletFiltersProps {
  filters: {
    location: string;
    city: string;
    min_price: string;
    max_price: string;
    bedrooms: string;
    sort: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  loading: boolean;
}

export const ShortletFilters: React.FC<ShortletFiltersProps> = ({
  filters,
  onFilterChange,
  loading,
}) => {
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState(filters.min_price);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.max_price);

  /**
   * Formats number with commas for better readability
   */
  const formatNumberWithCommas = (value: string) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    return parseInt(numbers).toLocaleString();
  };

  /**
   * Removes commas from formatted numbers
   */
  const removeCommas = (value: string) => {
    return value.replace(/,/g, "");
  };

  /**
   * Apply price filter
   */
  const applyPriceFilter = () => {
    onFilterChange("min_price", localMinPrice);
    onFilterChange("max_price", localMaxPrice);
    setShowPriceDropdown(false);
  };

  /**
   * Clear price filter
   */
  const clearPriceFilter = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onFilterChange("min_price", "");
    onFilterChange("max_price", "");
    setShowPriceDropdown(false);
  };

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    onFilterChange("location", "");
    onFilterChange("city", "");
    onFilterChange("min_price", "");
    onFilterChange("max_price", "");
    onFilterChange("bedrooms", "");
    setLocalMinPrice("");
    setLocalMaxPrice("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.location ||
    filters.city ||
    filters.min_price ||
    filters.max_price ||
    filters.bedrooms;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          placeholder="City, Area, or Neighborhood"
          value={filters.location || filters.city}
          onChange={(e) => {
            onFilterChange("location", e.target.value);
            onFilterChange("city", e.target.value);
          }}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Price Range Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (per day)
        </label>

        {/* Price Button */}
        <button
          onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-sm text-gray-700">
            {filters.min_price || filters.max_price
              ? `₦${formatNumberWithCommas(filters.min_price || "0")} - ₦${
                  filters.max_price
                    ? formatNumberWithCommas(filters.max_price)
                    : "Any"
                }`
              : "Any Price"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
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

        {/* Price Dropdown */}
        {showPriceDropdown && (
          <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-3">
              {/* Min Price */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Minimum
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

              {/* Max Price */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Maximum
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

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={clearPriceFilter}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={applyPriceFilter}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bedrooms Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <select
          value={filters.bedrooms}
          onChange={(e) => onFilterChange("bedrooms", e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Any</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4 Bedrooms</option>
          <option value="5">5 Bedrooms</option>
          <option value="6">6+ Bedrooms</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange("sort", e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="bedrooms_desc">Most Bedrooms</option>
        </select>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Prices shown are per day. Weekly and monthly
          rates may be available upon request.
        </p>
      </div>
    </div>
  );
};

export default ShortletFilters;
