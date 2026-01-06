import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { Carousel } from "@mantine/carousel";
import { Skeleton, useMantineTheme } from "@mantine/core";
import PropertyCard from "../../../shared/public/PropertyCard";
import "@mantine/carousel/styles.css";
import SectionHeader from "../SectionHeader";
import { FaClock } from "react-icons/fa6";
import { useLoading } from "@/hooks/useLoading";
import { usePublicOperations } from "@/apis/publicApi";
import { ErrorState } from "@/components/ErrorState";
import { BrandedLoader } from "@/components/LoadingSpinner";
import { PropertyCardSkeleton } from "@/components/common/PropertyCardSkeleton";

function RecentListing() {
  const theme = useMantineTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const { getLatestProperties } = usePublicOperations();
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();
  const fetchAttempted = useRef(false);

  const fetchRecentProperties = useCallback(async () => {
    try {
      const response = await withLoading(getLatestProperties());
      setProperties(response.properties);
      setError(null);
    } catch (error) {
      setError("Failed to load latest properties");
    }
  }, [getLatestProperties, withLoading]);

  useEffect(() => {
    if (!fetchAttempted.current) {
      fetchAttempted.current = true;
      fetchRecentProperties();
    }
  }, [fetchRecentProperties]);

  const slides = properties.map((property, index) => (
    <Carousel.Slide key={`${property.id}-${index}`}>
      <PropertyCard propertyData={property} />
    </Carousel.Slide>
  ));

  if (loading)
    return (
      <div className="relative h-fit bg-white py-10">
        <div className="max-w-window mx-auto p-8">
          {/* Header Skeleton */}
          <div className="space-y-3 mb-14">
            <Skeleton height={35} width={300} />
            <Skeleton height={20} width={200} />
          </div>

          {/* Skeletons Grid (Mimicking 3 columns on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <ErrorState
        message={error}
        onRetry={fetchRecentProperties}
        loading={loading}
      />
    );

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <SectionHeader
          badgeTitle="Recently Added"
          badgeIcon={<FaClock />}
          title="Latest Properties"
          emphasizedText="Just In"
          description="Explore the newest listings added to our platform — fresh options updated regularly."
        />

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Carousel
            slideSize={{ base: "100%", sm: "50%", md: "33.333%" }}
            slideGap={{ base: "md", sm: "lg" }}
            withControls={true}
            styles={{
              control: {
                backgroundColor: "white",
                color: theme.colors.dark[6],
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: theme.colors[theme.primaryColor][6],
                  color: "white",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              },
            }}
          >
            {slides}
          </Carousel>
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            href="/listings"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-900 px-8 py-4 rounded-full font-semibold transition-all shadow-sm hover:shadow-xl hover:scale-105"
          >
            View All Properties
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default RecentListing;
