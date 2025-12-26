import { useEffect, useState } from "react";
import { getLikedProperties } from "../../../apis/tenantApi";
import PropertyCard from "../../../components/shared/Dashboard/PropertyCard";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconHeartOff } from "@tabler/icons-react";
import { Button, Text, Title, Stack } from "@mantine/core";

export default function LikedPropertiesPage() {
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();
  const navigate = useNavigate();

  const fetchLikedProperties = async () => {
    try {
      const response = await withLoading(getLikedProperties());
      setLikedProperties(response.properties);
    } catch (err) {
      setError("Failed to load liked properties");
    }
  };

  useEffect(() => {
    fetchLikedProperties();
  }, []);

  if (loading) return <LoadingSpinner label="Fetching your favorites" />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchLikedProperties}
        loading={loading}
      />
    );
  }

  return (
    <div className="px-6 space-y-10 py-5">
      {likedProperties.length === 0 ? (
        <EmptyState>
          <Stack align="center" gap="lg" className="text-center">
            {/* Modern Icon Presentation */}
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-2">
              <IconHeartOff size={40} stroke={1.5} className="text-slate-400" />
            </div>

            <div className="max-w-md space-y-2">
              <Title
                order={2}
                className="text-2xl font-bold text-gray-900 tracking-tight"
              >
                No liked properties yet
              </Title>
              <Text size="sm" className="text-gray-500 leading-relaxed">
                When you find a property you love, tap the heart icon to save it
                here. It's the easiest way to keep track of your top choices.
              </Text>
            </div>

            <Button
              onClick={() => navigate("/properties/search")}
              variant="filled"
              color="dark"
              size="md"
              radius="md"
              leftSection={<IconSearch size={18} />}
              className="bg-gray-900 hover:bg-black px-8 mt-2 transition-transform active:scale-95"
            >
              Browse Properties
            </Button>
          </Stack>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {likedProperties &&
            likedProperties?.map((item) => (
              <PropertyCard key={item.id} propertyData={item} />
            ))}
        </div>
      )}
    </div>
  );
}
