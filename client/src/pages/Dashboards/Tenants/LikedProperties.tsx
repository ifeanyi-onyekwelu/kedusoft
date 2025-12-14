import { useEffect, useState } from "react";
import { getLikedProperties } from "../../../apis/tenantApi";
import PropertyCard from "../../../components/shared/Dashboard/PropertyCard";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function LikedPropertiesPage() {
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { loading, stopLoading, startLoading } = useLoading();

  const navigate = useNavigate();

  const fetchLikedProperties = async () => {
    try {
      startLoading();
      const response = await getLikedProperties();
      console.log("LIKED PROPERTIES RESPONSE: ", response);
      setLikedProperties(response.data.properties);
    } catch (err) {
      setError("Failed to load liked properties");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchLikedProperties();
  }, []);
  if (loading) return <LoadingSpinner />;
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
          <div className="space-y-4 flex flex-col justify-center items-center">
            <h2 className="text-4xl font-semibold text-gray-800">
              You have not liked any properties
            </h2>
            <p className="text-sm text-gray-500">
              Looks like you haven't liked any properties yet. Start browsing
              properties to find your next home!
            </p>

            <Button
              onClick={() => navigate("/properties/search")}
              variant="outlined"
            >
              Browse Properties
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {likedProperties.map((item) => (
            <PropertyCard key={item.id} propertyData={item} />
          ))}
        </div>
      )}
    </div>
  );
}
