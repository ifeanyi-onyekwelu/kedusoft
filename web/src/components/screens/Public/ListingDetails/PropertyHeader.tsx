import React from "react";
import { Button, Badge } from "@mantine/core";
import {
  IconMapPin,
  IconShare2,
  IconHeart,
  IconEye,
} from "@tabler/icons-react";
import { formatPrice } from "../../../../utils/helpers";

interface PropertyHeaderProps {
  property: any;
  likedData: { isLiked: boolean };
  handleLike: () => void;
  openSharePropertyModal: () => void;
}

export default function PropertyHeader({
  property,
  likedData,
  handleLike,
  openSharePropertyModal,
}: PropertyHeaderProps) {
  return (
    <div className="py-6 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6">
        {/* Left: Title & Location */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="text-4xl font-bold text-[#008CDB] leading-tight">
              {property.name}
            </h1>
            <Badge size="lg" bg="#CF8205" className="mt-2 font-semibold">
              {property.listing_type || "Rent"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <IconMapPin size={18} color="#CF8205" stroke={2} />
            <span className="font-medium">
              {property.address}, {property.city || "Nigeria"}
            </span>
          </div>
        </div>

        {/* Right: Price & Stats */}
        <div className="lg:text-right">
          <div className="mb-4">
            <div className="text-4xl font-black text-[#008CDB]">
              {formatPrice(property.rent_amount)}
            </div>
            <div className="text-sm text-gray-500 font-medium mt-1">
              per {property.payment_structure || "year"}
            </div>
          </div>

          {/* View count */}
          <div className="flex items-center justify-end gap-2 text-gray-600">
            <IconEye size={16} />
            <span className="text-sm font-semibold">
              {property.views || 0} views
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <Button
          fullWidth={false}
          flex={1}
          size="md"
          bg="#008CDB"
          onClick={openSharePropertyModal}
          leftSection={<IconShare2 size={16} />}
          className="font-semibold hover:bg-[#1e054a] transition-colors rounded-lg"
        >
          Share Listing
        </Button>

        <Button
          fullWidth={false}
          flex={1}
          size="md"
          variant={likedData.isLiked ? "filled" : "outline"}
          bg={likedData.isLiked ? "#008CDB" : undefined}
          color={likedData.isLiked ? "#008CDB" : "gray"}
          onClick={handleLike}
          leftSection={
            <IconHeart
              size={16}
              className={likedData.isLiked ? "fill-white" : ""}
            />
          }
          className="font-semibold rounded-lg"
        >
          {likedData.isLiked ? "Saved" : "Save for Later"}
        </Button>
      </div>
    </div>
  );
}
