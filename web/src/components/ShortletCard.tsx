/**
 * ShortletCard Component
 *
 * Displays a shortlet property in a card format with image, price, and key details.
 * Optimized for shortlet-specific information (daily/weekly rates).
 */

import React from "react";

interface ShortletCardProps {
  property: Property;
  onClick: () => void;
}

export const ShortletCard: React.FC<ShortletCardProps> = ({
  property,
  onClick,
}) => {
  // Get primary image
  const primaryImage =
    property.gallery && property.gallery.length > 0
      ? property.gallery[0]
      : property.cover_image ||
        "https://via.placeholder.com/400x300?text=No+Image";

  // Format price per day
  const pricePerDay = property.rent_amount?.toLocaleString() || "N/A";

  // Property tags (furnished, serviced, etc.)
  const tags = [];
  if (property.furnished) tags.push("Furnished");
  if ((property as any).is_serviced) tags.push("Serviced");
  if ((property as any).is_new) tags.push("Newly Built");

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />

        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-lg">
          ₦{pricePerDay}/day
        </div>

        {/* Image Count Badge */}
        {property.gallery && property.gallery.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {property.gallery.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Property Name */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-2">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">
            {property.area}, {property.city}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-700 mb-3 pb-3 border-b border-gray-200">
          {/* Bedrooms */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-gray-500">
              {property.bedrooms === 1 ? "bed" : "beds"}
            </span>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-gray-500">
              {property.bathrooms === 1 ? "bath" : "baths"}
            </span>
          </div>

          {/* Size if available */}
          {property.size_sqft && (
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {property.size_sqft.toLocaleString()}
              </span>
              <span className="text-gray-500">sqft</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded border border-green-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {typeof property.category === "string"
              ? property.category
              : property.category?.name || "Apartment"}
          </span>

          {/* View Details Arrow */}
          <div className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortletCard;
