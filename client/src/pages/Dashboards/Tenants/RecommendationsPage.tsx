import { useEffect, useState } from "react";
import { useTenantOperations } from "../../../apis/tenantApi";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorState } from "../../../components/ErrorState";
import { BrandedLoader } from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import { Stack, Text, Title, Button, ThemeIcon, Box } from "@mantine/core";
import {
  IconBrain,
  IconAdjustments,
  IconStar,
  IconMapPin,
  IconCurrencyNaira,
  IconBed,
  IconRefresh,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PropertyCard from "@/components/shared/public/PropertyCard";

interface RecommendedProperty extends Property {
  recommendation_score: number;
  match_reason: string[];
}

interface RecommendationResponse {
  properties: RecommendedProperty[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, withLoading } = useLoading();
  const { getRecommendedProperties } = useTenantOperations();
  const navigate = useNavigate();

  const fetchRecommendations = async (page = 1) => {
    setError(null);
    try {
      const response = await withLoading(
        getRecommendedProperties({ page, per_page: 12 })
      );
      console.log("Fetched Recommendations:", response);

      setRecommendations(response);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      toast.error("Error fetching recommendations");
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleLoadMore = () => {
    if (recommendations && currentPage < recommendations.pagination.pages) {
      fetchRecommendations(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchRecommendations(1);
  };

  if (loading) return <BrandedLoader inDashboard={true} />;

  if (error) {
    return (
      <div className="px-6 py-8">
        <ErrorState message={error} onRetry={handleRefresh} loading={loading} />
      </div>
    );
  }

  console.log("Rendering Recommendations:", recommendations);

  if (!recommendations || recommendations?.properties.length === 0) {
    return (
      <div className="px-4 py-6">
        <EmptyState>
          <Stack align="center" gap="xl" className="max-w-md">
            {/* Icon Composition */}
            <Box className="relative">
              <ThemeIcon
                size={80}
                radius="24px"
                variant="light"
                color="blue"
                className="bg-blue-50 border border-blue-100"
              >
                <IconBrain size={40} stroke={1.5} className="text-blue-600" />
              </ThemeIcon>
              <div className="absolute -top-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                <IconSparkles size={16} className="text-amber-500" />
              </div>
            </Box>

            {/* Text Content */}
            <Stack gap="xs" align="center" className="text-center">
              <Title
                order={2}
                className="text-slate-900 tracking-tight font-extrabold"
              >
                Personalize Your Search
              </Title>
              <Text
                size="lg"
                className="text-slate-500 leading-relaxed font-medium"
              >
                We haven't met your preferences yet. Complete your onboarding to
                unlock AI-driven property matches.
              </Text>
            </Stack>

            {/* Action Area */}
            <Stack gap="sm" className="w-full sm:w-auto">
              <Button
                onClick={() => navigate("/onboarding")}
                size="lg"
                radius="xl"
                className="bg-slate-900 hover:bg-slate-800 transition-all px-8"
                rightSection={<IconArrowRight size={18} />}
              >
                Start Onboarding
              </Button>
              <Text
                size="xs"
                className="text-slate-400 font-bold uppercase tracking-widest text-center"
              >
                Takes less than 2 minutes
              </Text>
            </Stack>
          </Stack>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconBrain size={20} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Property Recommendations
            </h1>
          </div>
          <p className="text-gray-600">
            Properties matched to your preferences •{" "}
            {recommendations?.pagination.total} found
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            variant="outlined"
            leftSection={<IconRefresh size={18} />}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            onClick={() => navigate("onboarding")}
            variant="filled"
            leftSection={<IconAdjustments size={18} />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update Preferences
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendations?.properties.map((property) => (
            <div
              key={property.id}
              className="relative bg-white rounded-xl shadow-sm"
            >
              {/* Recommendation Score Badge */}
              <div className="absolute top-4 left-3 z-20 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {Math.round(property.recommendation_score)}% match
              </div>

              {/* Property Card */}
              <PropertyCard propertyData={property} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {currentPage < recommendations?.pagination.pages && (
          <div className="text-center pt-8">
            <Button
              onClick={handleLoadMore}
              variant="outlined"
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? "Loading..." : "Load More Properties"}
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        <div className="text-center text-sm text-gray-500 pt-4">
          Showing {recommendations?.properties.length} of{" "}
          {recommendations?.pagination.total} recommended properties
        </div>
      </div>
    </div>
  );
}
