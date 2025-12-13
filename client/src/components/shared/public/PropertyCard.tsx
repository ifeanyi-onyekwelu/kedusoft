import { ActionIcon, Tooltip, Button, Stack, Group, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import formatAmount from "../../../utils/helpers";
import { motion } from "framer-motion";
import { IconHeart, IconShare } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { modals } from "@mantine/modals";
import { useLoading } from "@/hooks/useLoading";
import { useTenantOperations } from "@/apis/tenantApi";

const PropertyCard = ({ propertyData }: { propertyData: Property }) => {
  const [isFavorite] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const { loading, withLoading } = useLoading();
  const navigate = useNavigate();

  const handleShare = async () => {
    const shareData = {
      title: propertyData.name,
      text: `Check out this property: ${propertyData.name}`,
      url: `${window.location.origin}/listings/${propertyData.id}`,
    };

    // Try native share first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Property link copied to clipboard");
      } catch (err) {
        // User cancelled, do nothing
      }
    } else {
      // Fallback: Copy link to clipboard
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  const handleLike = async () => {
    // If not logged in, show login prompt
    if (!isAuthenticated) {
      modals.open({
        title: "Save this property",
        children: (
          <Stack>
            <Text size="sm">
              Sign in to save properties and get personalized recommendations!
            </Text>
            <Group grow>
              <Button
                onClick={() => {
                  modals.closeAll();
                  navigate("/auth/login", {
                    state: { from: window.location.pathname },
                  });
                }}
                color="#1e3a8a"
              >
                Sign In
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  modals.closeAll();
                  navigate("/auth/register");
                }}
                color="#fb7185"
              >
                Create Account
              </Button>
            </Group>
          </Stack>
        ),
      });
      return;
    }

    // Optimistic update
    setIsLiked(!isLiked);

    try {
      if (isLiked) {
        // Unlike/Remove from favorites
        await withLoading(
          useTenantOperations().unlikeProperty(propertyData.id)
        );
        toast.success("Property removed from your saved list");
      } else {
        // Like/Add to favorites
        await withLoading(useTenantOperations().likeProperty(propertyData.id));
        toast.success("Property saved to your favorites");
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      toast.error("Could not save property. Please try again.");
    }
  };

  return (
    <motion.div
      className="group relative w-full overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Image Section */}
      <Link
        to={`/listings/${propertyData.id}`}
        className="relative block overflow-hidden"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={propertyData.cover_image}
            alt={propertyData.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

          {/* Status Badge */}
          {propertyData.verification_status === "verified" && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Tooltip label="Share listing">
              <ActionIcon
                size="lg"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleShare();
                }}
                color="#fb7185"
                radius="xl"
              >
                <IconShare size={18} className="text-gray-200" />
              </ActionIcon>
            </Tooltip>

            <Tooltip
              label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <ActionIcon
                size="lg"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleLike();
                }}
                loading={loading}
                color={isFavorite ? "#ef4444" : "#0ea5e9"}
                radius="xl"
              >
                <IconHeart
                  size={18}
                  className={isFavorite ? "text-white" : "text-gray-200"}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </ActionIcon>
            </Tooltip>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1.5 shadow-lg border border-accent">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary">
                ₦{formatAmount(propertyData.rent_amount)}
              </span>
              <span className="text-xs font-bold text-accent">/month</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/property/${propertyData.id}`} className="no-underline">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {propertyData.name}
          </h3>
          <div className="flex items-start gap-2 mb-4">
            <svg
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            <span className="text-sm text-gray-600 line-clamp-2">
              {propertyData.address}, {propertyData.city}
            </span>
          </div>
        </Link>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-bold text-gray-900">
                {propertyData.bedrooms}
              </span>
            </div>
            <span className="text-xs text-gray-500">Bedrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-bold text-gray-900">
                {propertyData.bathrooms}
              </span>
            </div>
            <span className="text-xs text-gray-500">Bathrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="font-bold text-gray-900">
                {formatAmount(propertyData.size_sqft)}
              </span>
            </div>
            <span className="text-xs text-gray-500">Sq Ft</span>
          </div>
        </div>

        {/* Additional Features */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
          {propertyData.furnished && propertyData.furnished !== "no" && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              Furnished
            </span>
          )}
          {propertyData.pets && propertyData.pets === "allowed" && (
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
              Pets Allowed
            </span>
          )}
          {propertyData.parking_spaces > 0 && (
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
              {propertyData.parking_spaces} Parking
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
