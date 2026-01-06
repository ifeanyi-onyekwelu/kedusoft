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
import { FaDroplet, FaHouse, FaMapLocationDot, FaRuler } from "react-icons/fa6";

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

      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/listings/${propertyData.id}`} className="no-underline">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {propertyData.name}
          </h3>
        </Link>
        <div className="flex items-start gap-2 mb-4">
          <FaMapLocationDot className="w-5" />
          <span className="text-sm text-gray-600 line-clamp-2">
            {propertyData.address}, {propertyData.city}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4 py-4 border-t border-gray-100">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary mb-1">
                <FaHouse className="w-3" />
                <span className="font-bold text-gray-900 text-xs">
                  {propertyData.bedrooms}
                </span>
              </div>
              <span className="text-xs text-gray-500">bed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary mb-1">
                <FaDroplet className="w-2" />
                <span className="font-bold text-gray-900 text-xs">
                  {propertyData.bathrooms}
                </span>
              </div>
              <span className="text-xs text-gray-500">bath</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary mb-1">
                <FaRuler className="w-3" />
                <span className="font-bold text-gray-900 text-xs">
                  {formatAmount(propertyData.size_sqft)}
                </span>
              </div>
              <span className="text-xs text-gray-500">Sq Ft</span>
            </div>
          </div>

          <Link
            to={`/listings/${propertyData.id}`}
            className="px-5 rounded-sm bg-gradient-to-br from-secondary to-accent text-white py-1"
          >
            VIEW
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
