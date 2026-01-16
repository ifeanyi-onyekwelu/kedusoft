import { useEffect, useState } from "react";
import { getLikedProperties } from "@/apis/tenantApi";
import PropertyCard from "@/components/shared/public/PropertyCard";
import { useLoading } from "@/hooks/useLoading";
import { BrandedLoader } from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";
import {IconHeart, IconSearch, IconStar} from "@tabler/icons-react";
import { Button, Text, Title, Stack } from "@mantine/core";
import {ThemeIcon, Box} from "@mantine/core"
import {toast} from "react-hot-toast"

export default function LikedPropertiesPage() {
  const [likedProperties, setLikedProperties] = useState<{ liked_id: string, property: Property }[]>([]);
  const { loading, withLoading } = useLoading();
  const navigate = useNavigate();

  const fetchLikedProperties = async () => {
    try {
      const response = await withLoading(getLikedProperties());
      setLikedProperties(response.properties);
    } catch {
      toast.error("Failed to load liked properties");
    }
  };

  const handleUnlike = (propertyId: string) => {
    setLikedProperties((prev) =>
        prev.filter((item) => item.property.id !== propertyId)
    );
  };


  useEffect(() => {
    fetchLikedProperties();
  }, []);

  if (loading) return <BrandedLoader inDashboard={true} label={"Have you liked any property? Let's see"} />;


  if (!likedProperties || !likedProperties.length) {
    return (
        <div className="px-4 py-6">
          <EmptyState>
            <Stack align="center" gap="xl" className="max-w-md">
              {/* Icon Composition: Favorites/Wishlist focus */}
              <Box className="relative">
                <ThemeIcon
                    size={80}
                    radius="24px"
                    variant="light"
                    color="rose"
                    className="bg-rose-50 border border-rose-100"
                >
                  <IconHeart size={40} stroke={1.5} className="text-rose-600" />
                </ThemeIcon>
                <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                  <IconStar size={16} className="text-amber-500" fill="currentColor" />
                </div>
              </Box>

              {/* Text Content */}
              <Stack gap="xs" align="center" className="text-center">
                <Title
                    order={2}
                    className="text-slate-900 tracking-tight font-extrabold"
                >
                  Your Wishlist is Empty
                </Title>
                <Text
                    size="lg"
                    className="text-slate-500 leading-relaxed font-medium"
                >
                  See a place you like? Tap the heart icon on any property to
                  save it here for later comparison.
                </Text>
              </Stack>

              {/* Action Area */}
              <Stack gap="sm" className="w-full sm:w-auto">
                <Button
                    onClick={() => navigate("/listings")}
                    size="lg"
                    radius="xl"
                    className="bg-slate-900 hover:bg-slate-800 transition-all px-8"
                    leftSection={<IconSearch size={18} />}
                >
                  Explore Listings
                </Button>
                <Text
                    size="xs"
                    className="text-slate-400 font-bold uppercase tracking-widest text-center"
                >
                  Don't miss out on your perfect home
                </Text>
              </Stack>
            </Stack>
          </EmptyState>
        </div>
    );
  }

  return (
    <div className="px-6 space-y-10 py-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {likedProperties &&
            likedProperties?.map((item) => (
                <PropertyCard key={item.liked_id} propertyData={item.property} onUnlike={handleUnlike}
                />
            ))}
      </div>
    </div>
  );
}
