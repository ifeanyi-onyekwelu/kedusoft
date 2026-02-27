import { Card, ActionIcon, Badge } from "@mantine/core";
import formatAmount from "../../../utils/helpers";
import { Button } from "@mantine/core";
import { useUser } from "../../../context/UserContext";
import {
  applyForProperty,
  checkIfLiked,
  likeProperty,
  unlikeProperty,
} from "../../../apis/tenantApi";
import {
  IconBath,
  IconBed,
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconRuler,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { showNotification } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

function PropertyCard({ propertyData }: { propertyData: Property }) {
  // Calculate annual rent based on payment structure
  const getAnnualRent = () => {
    if (propertyData.payment_structure === "monthly") {
      return propertyData.rent_amount * 12;
    }
    return propertyData.rent_amount;
  };

  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const navigate = useNavigate();

  const handleApply = async () => {
    try {
      await applyForProperty(propertyData.id);
      showNotification(
        "success",
        "Success",
        "Successfully applied to property"
      );
    } catch (error: any) {
      showNotification(
        "error",
        "Error",
        `Error applying to property: ${error.response.data.message}`
      );
    }
  };

  // Check if property is liked on mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user?.role !== "tenant") return;

      try {
        const response = await checkIfLiked(propertyData.id);
        setIsLiked(response.data.isLiked);
        setLikeId(response.data.likeId);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, []);

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      if (isLiked) {
        await unlikeProperty(likeId!);
        setIsLiked(false);
        setLikeId(null);
      } else {
        const response = await likeProperty(propertyData.id);
        setIsLiked(true);
        setLikeId(response.data.like_id);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <Card
      shadow="sm"
      radius="lg"
      withBorder
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl max-w-md"
    >
      {/* Image Section */}
      <Card.Section className="relative h-64 overflow-hidden">
        <img
          src={propertyData.cover_image}
          alt={propertyData.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 absolute"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

        {/* Like Button - Top Right */}
        {user?.role === "tenant" && (
          <ActionIcon
            variant="light"
            color={isLiked ? "red" : "gray"}
            onClick={handleLike}
            className="relative top-3 left-2 z-50"
            loading={loadingLike}
            size="xl"
            radius="xl"
          >
            {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
          </ActionIcon>
        )}

        {/* Status Badges - Bottom Left */}
        <div className="absolute bottom-3 left-3 flex gap-2 z-10">
          {!propertyData.is_available && (
            <Badge color="red" variant="filled">
              Not Available
            </Badge>
          )}
          {propertyData.verification_status === "verified" && (
            <Badge color="green" variant="light">
              Verified
            </Badge>
          )}
        </div>

        {/* Price Tag - Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-sm z-10">
          <span className="font-bold text-primary">
            ₦{formatAmount(getAnnualRent())}
          </span>
          <span className="ml-1 text-xs text-gray-600">/year</span>
        </div>
      </Card.Section>

      {/* Content Section */}
      <div className="px-5 pb-5 pt-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
            {propertyData.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <IconMapPin size={16} className="mr-1" />
            <span className="line-clamp-1">{propertyData.address}</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <IconBed size={16} className="text-primary" />
              <span className="ml-1 font-medium">{propertyData.bedrooms}</span>
            </div>
            <span className="text-xs text-gray-500">Beds</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <IconBath size={16} className="text-primary" />
              <span className="ml-1 font-medium">{propertyData.bathrooms}</span>
            </div>
            <span className="text-xs text-gray-500">Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <IconRuler size={16} className="text-primary" />
              <span className="ml-1 font-medium">
                {formatAmount(propertyData.size_sqft)}
              </span>
            </div>
            <span className="text-xs text-gray-500">m²</span>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {propertyData.furnished === "yes" && (
            <Badge variant="light" color="indigo" size="sm">
              Furnished
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate(
                `${user?.role === "tenant" ? "/properties/" : ""}${
                  propertyData.id
                }`
              )
            }
            variant="outlined"
          >
            View Details
          </Button>
          {user?.role === "tenant" && (
            <Button variant="filled" onClick={handleApply}>
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default PropertyCard;
