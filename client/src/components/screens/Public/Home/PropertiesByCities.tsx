import { motion } from "framer-motion";
import { Carousel } from "@mantine/carousel";
import { useMantineTheme } from "@mantine/core";
import "@mantine/carousel/styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionHeader from "../SectionHeader";
import { FaCity, FaHouse } from "react-icons/fa6";
import { usePublicOperations } from "@/apis/publicApi";
import { useLoading } from "@/hooks/useLoading";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface City {
  city: string;
  property_count: number;
}

// Generic city images to cycle through
const CITY_IMAGE_URLS = [
  "/images/houses/china.jpg",
  "/images/houses/nigeria.jpg",
  "/images/houses/street.jpg",
  "/images/houses/hero.jpg",
];

// Get image URL by cycling through available images
const getCityImageUrl = (index: number): string => {
  return CITY_IMAGE_URLS[index % CITY_IMAGE_URLS.length];
};

const CityCard = ({
  imageUrl,
  cityName,
  totalProperties,
  linkPath,
  index = 0,
}: {
  imageUrl: string;
  cityName: string;
  totalProperties: number;
  linkPath: string;
  index?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={linkPath} className="block group">
      <motion.div
        className="relative h-[380px] w-full overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-500"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image with zoom effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Gradient overlay - more sophisticated */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500" />

        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* City Info */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
          {/* Top badge with property count */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="self-start"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <FaHouse />
              <span className="text-sm font-semibold">
                {totalProperties}+ Properties
              </span>
            </div>
          </motion.div>

          {/* Bottom section with city name and CTA */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold mb-2 group-hover:text-white transition-colors">
                {cityName}
              </h3>
              <p className="text-sm text-white/80 group-hover:text-white/90 transition-colors my-0">
                Explore available properties
              </p>
            </div>

            {/* CTA Button - slides up on hover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-100 transition-colors">
                View Properties
                <svg
                  className="w-4 h-4"
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
              </div>
            </motion.div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </motion.div>
    </Link>
  );
};

// Example usage
const CityCardsGrid = ({ cities }: { cities: City[] }) => {
  return (
    <>
      {cities.map((city, index) => (
        <Carousel.Slide key={`${city.city}-${index}`}>
          <CityCard
            imageUrl={getCityImageUrl(index)}
            cityName={city.city}
            totalProperties={city.property_count}
            linkPath={`/listings?location=${encodeURIComponent(city.city)}`}
            index={index}
          />
        </Carousel.Slide>
      ))}
    </>
  );
};

function PropertiesByCities() {
  const theme = useMantineTheme();
  const { getCities } = usePublicOperations();
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await withLoading(getCities());
        setCities(response.cities || []);
        setError(null);
      } catch (err) {
        setError("Failed to load cities");
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, []);

  const handleRetry = async () => {
    try {
      const response = await withLoading(getCities());
      setCities(response.cities || []);
      setError(null);
    } catch (err) {
      setError("Failed to load cities");
    }
  };

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
      </div>

      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <SectionHeader
          badgeTitle="Properties by City"
          badgeIcon={<FaCity />}
          title="Browse by Cities"
          emphasizedText="Top Locations"
          description="Find homes across the most popular cities — search by location to discover properties near you."
        />

        {error ? (
          <ErrorState message={error} onRetry={handleRetry} loading={loading} />
        ) : loading ? (
          <LoadingSpinner label="Loading cities" />
        ) : cities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No cities available</p>
          </div>
        ) : (
          <>
            {/* Carousel Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Carousel
                slideSize={{
                  base: "100%",
                  sm: "50%",
                  md: "33.333%",
                  lg: "25%",
                }}
                slideGap={{ base: "md", sm: "lg" }}
                withControls={cities.length > 4}
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
                <CityCardsGrid cities={cities} />
              </Carousel>
            </motion.div>

            {/* View All Cities Button */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link
                to="/locations"
                className="inline-flex items-center gap-2 bg-white hover:bg-primary hover:text-white text-gray-900 px-8 py-4 rounded-full font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105 border border-gray-200 hover:border-transparent"
              >
                View All Locations
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

export default PropertiesByCities;
