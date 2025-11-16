import React from "react";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { formatPrice } from "../utils/helpers";

// Use the same Property interface that matches the backend model

interface PropertyCardProps {
  property: Property;
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  showBookmark?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSelected = false,
  onClick,
  onHover,
  onMouseLeave,
  className = "",
}) => {
  const formatArea = (sqft: number) => {
    return `${sqft.toLocaleString()} sqft`;
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case "rent":
        return "bg-green-100 text-green-800";
      case "short-let":
        return "bg-blue-100 text-blue-800";
      case "lease":
        return "bg-purple-100 text-purple-800";
      case "sale":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`property-card bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"
      } ${className}`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
    >
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden">
        {property.gallery && property.gallery.length > 0 ? (
          <img
            src={property.gallery[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Square className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Gallery Indicator */}
        {property.gallery && property.gallery.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              +{property.gallery.length - 1} photos
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(property.rent_amount)}
          </span>
          <span className="text-sm text-gray-600">
            /{property.listing_type === "short-let" ? "night" : "yearly"}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>
              {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>
              {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{formatArea(property.size_sqft)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-1 mb-3">
          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-gray-600 line-clamp-2">
            {property.area}, {property.city}, {property.state}
          </span>
        </div>

        {/* Amenities Preview */}
        {property.amenities && (
          <div className="flex flex-wrap gap-1 mb-3">
            {Object.entries(property.amenities)
              .filter(([_, value]) => value === true)
              .slice(0, 3)
              .map(([key, _]) => (
                <span
                  key={key}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {key.replace(/_/g, " ")}
                </span>
              ))}
            {Object.entries(property.amenities).filter(
              ([_, value]) => value === true
            ).length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                +
                {Object.entries(property.amenities).filter(
                  ([_, value]) => value === true
                ).length - 3}{" "}
                more
              </span>
            )}
          </div>
        )}

        {/* Landlord Info */}
        {property.landlord && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {property.landlord.profile_picture ? (
              <img
                src={property.landlord.profile_picture}
                alt="Landlord"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {property.landlord.firstName?.[0]}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">
              {property.landlord.firstName} {property.landlord.lastName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
