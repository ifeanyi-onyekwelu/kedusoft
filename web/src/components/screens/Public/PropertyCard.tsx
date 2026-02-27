import React from "react";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { formatPrice } from "../../../utils/helpers.tsx";

interface PropertyCardProps {
  property: Property;
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  showBookmark?: boolean;
}

export const MinimalPropertyCard: React.FC<PropertyCardProps> = ({
                                                                   property,
                                                                   isSelected = false,
                                                                   onClick,
                                                                   onHover,
                                                                   onMouseLeave,
                                                                   className = "",
                                                                 }) => {
  const getStatusColor = () => {
    switch (property.status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
      <div
          className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
              isSelected ? "border-blue-500" : "hover:border-gray-300"
          } transition-colors ${className}`}
          onClick={onClick}
          onMouseEnter={onHover}
          onMouseLeave={onMouseLeave}
      >
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100">
          {property.gallery && property.gallery.length > 0 ? (
              <img
                  src={property.gallery[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
              />
          ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Square className="h-12 w-12" />
              </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-2 py-1 text-xs rounded ${getStatusColor()}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
            {property.is_featured && (
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
              Featured
            </span>
            )}
            {property.is_verified && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Verified
            </span>
            )}
          </div>

          {/* Favorite Button */}
          <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>

          {/* Gallery Counter */}
          {property.gallery && property.gallery.length > 1 && (
              <div className="absolute bottom-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{property.gallery.length - 1} photos
            </span>
              </div>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-2 left-2">
            <div className="text-lg font-bold text-white drop-shadow">
              {formatPrice(property.rent_amount)}
              <span className="text-sm font-normal">
              /{property.listing_type === "short-let" ? "night" : "yr"}
            </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Location */}
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
            {property.area}, {property.city}
          </span>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4 text-gray-500" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-gray-500" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4 text-gray-500" />
                <span>{property.size_sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities?.generator && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              Generator
            </span>
            )}
            {property.water_source && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {property.water_source}
            </span>
            )}
            {property.amenities?.security_guards && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              Security
            </span>
            )}
            {property.furnishing_details?.length > 0 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {property.furnishing_details.length} furnishings
            </span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-3"></div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Landlord */}
            <div className="flex items-center">
              {property.landlord?.profile_picture ? (
                  <img
                      src={property.landlord.profile_picture}
                      alt="Landlord"
                      className="w-6 h-6 rounded-full mr-2"
                  />
              ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <span className="text-xs text-gray-600">
                  {property.landlord?.firstName?.[0] || "L"}
                </span>
                  </div>
              )}
              <div className="text-sm text-gray-700">
                {property.landlord?.firstName || "Landlord"}
              </div>
            </div>

            {/* Availability */}
            <div className="text-sm">
              {property.available_from ? (
                  <span className="text-gray-600">
                Available {new Date(property.available_from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              ) : (
                  <span className={`font-medium ${
                      property.is_available ? 'text-green-600' : 'text-red-600'
                  }`}>
                {property.is_available ? 'Available' : 'Not Available'}
              </span>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default MinimalPropertyCard;