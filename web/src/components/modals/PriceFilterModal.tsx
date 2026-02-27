import React, { useState, useEffect } from "react";

interface PriceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  minPrice: string;
  maxPrice: string;
  onApply: (minPrice: string, maxPrice: string) => void;
}

export const PriceFilterModal: React.FC<PriceFilterModalProps> = ({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  onApply,
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localMinPrice, localMaxPrice);
  };

  const handleClear = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onApply("", "");
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = parseFloat(value);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Price Range</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Min Price */}
          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Minimum Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₦
              </span>
              <input
                id="minPrice"
                type="number"
                placeholder="0"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {localMinPrice && (
              <p className="mt-1 text-sm text-gray-600">
                {formatCurrency(localMinPrice)}
              </p>
            )}
          </div>

          {/* Max Price */}
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Maximum Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₦
              </span>
              <input
                id="maxPrice"
                type="number"
                placeholder="Any"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {localMaxPrice && (
              <p className="mt-1 text-sm text-gray-600">
                {formatCurrency(localMaxPrice)}
              </p>
            )}
          </div>

          {/* Price Range Display */}
          {(localMinPrice || localMaxPrice) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                Selected Range:
              </p>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {formatCurrency(localMinPrice || "0")} -{" "}
                {localMaxPrice ? formatCurrency(localMaxPrice) : "Any"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
