import { Button } from "@mantine/core";
import PropertyCard from "../../../shared/public/PropertyCard";
import { getFeaturedProperties } from "../../../../apis/publicApi";
import { useState, useEffect } from "react";
import { useLoading } from "../../../../hooks/useLoading";
import { BrandedLoader } from "../../../LoadingSpinner";
import { ErrorState } from "../../../ErrorState";
import { useNavigate } from "react-router-dom";

const FeaturedListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    startLoading();
    setError(null);

    try {
      const response = await getFeaturedProperties();

      const mappedProperties = response["properties"].map((property: any) => ({
        ...property,
        coverImage: property.gallery?.[0] || "", // Optional chaining
      }));
      setProperties(mappedProperties);
    } catch (error: any) {
      setError("Failed to load featured properties. Please try again later.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (error)
    return (
      <ErrorState message={error} loading={loading} onRetry={fetchProperties} />
    );

  if (properties.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-secondary via-purple-900 to-secondary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl\"></div>
      </div>

      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 px-4 md:px-8 gap-6">
          <div className="flex-1">
            <div className="inline-block bg-primary/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm border border-white/20">
              ✨ HANDPICKED FOR YOU
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
              Featured{" "}
              <span className="bg-primary text-white px-3 rounded-lg">
                Listings
              </span>
            </h1>
            <p className="text-gray-200 text-xl">
              Premium properties carefully selected by our expert team
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => navigate("/listings?featured=true")}
              className="bg-white text-secondary px-8 py-4 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-base font-semibold"
            >
              View All Properties
            </Button>
            <Button
              onClick={() => navigate("/listings?listing_type=rent")}
              className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-secondary transition-all text-base font-semibold"
            >
              For Rent
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="transform hover:-translate-y-2 transition-transform duration-300"
              >
                <PropertyCard propertyData={property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
