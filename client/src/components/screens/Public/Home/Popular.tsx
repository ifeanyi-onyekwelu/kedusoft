import { motion } from "framer-motion";
import { Carousel } from "@mantine/carousel";
import { Text, Loader } from "@mantine/core";
import { useState, useEffect, useCallback } from "react";
import PropertyCard from "../../../shared/public/PropertyCard";
import { useUserState } from "../../../../hooks/useUserState";
import { usePublicOperations } from "../../../../apis/publicApi";
import { useLoading } from "../../../../hooks/useLoading";
import "@mantine/carousel/styles.css";

function Popular() {
  const { userState, loading: userStateLoading } = useUserState();
  const { getNearbyProperties } = usePublicOperations();
  const { loading, withLoading } = useLoading();

  const [properties, setProperties] = useState<Property[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch nearby properties
  const fetchNearbyProperties = useCallback(async () => {
    try {
      setError(null);
      const location = userLocation || (await getUserLocation());

      if (!location) {
        throw new Error("Unable to get location");
      }

      const response = await withLoading(
        getNearbyProperties(location.latitude, location.longitude, 20) // 20km radius
      );

      const nearbyProps = response.data.map(
        (item: any) => item.property || item
      );

      setProperties(nearbyProps.slice(0, 6));
    } catch (error: any) {
      setError(error.message || "Failed to load nearby properties");
      setProperties([]);
    }
  }, [userLocation]);

  // Initialize location and fetch properties
  useEffect(() => {
    fetchNearbyProperties();
  }, [fetchNearbyProperties]);

  // Get user's current location
  const getUserLocation = useCallback(async () => {
    try {
      const position: GeolocationPosition = await new Promise(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser"));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(location);
      return location;
    } catch (error) {
      console.error("Error getting user location:", error);
      // Default to Lagos coordinates as fallback
      const defaultLocation = { latitude: 6.5244, longitude: 3.3792 };
      setUserLocation(defaultLocation);
      return defaultLocation;
    }
  }, []);

  const slides = properties.map((property, index) => (
    <Carousel.Slide key={property.id || index}>
      <PropertyCard propertyData={property} />
    </Carousel.Slide>
  ));

  // Loading state
  if (userStateLoading || loading) {
    return (
      <div className="relative h-fit bg-white py-10">
        <div className="max-w-window mx-auto p-8 flex justify-center items-center min-h-96">
          <div className="text-center">
            <Loader size="lg" className="mb-4" />
            <Text>Loading popular properties near you...</Text>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative h-fit bg-white py-10">
        <div className="max-w-window mx-auto p-8">
          <div className="text-center">
            <Text color="red" className="mb-4">
              {error}
            </Text>
            <Text>We'll show you featured properties instead.</Text>
          </div>
        </div>
      </div>
    );
  }

  // No properties found
  if (!properties.length) {
    return (
      <div className="relative h-fit bg-white py-10">
        <div className="max-w-window mx-auto p-8">
          <div className="text-center">
            <Text className="mb-4">
              No properties found near your location.
            </Text>
            <Text>Try expanding your search radius or check back later.</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-fit bg-white py-10">
      <motion.div className="max-w-window mx-auto p-8">
        <motion.div className="space-y-1 mb-14">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl font-bold text-gray-800"
          >
            Popular Near You {userState && `in ${userState}`}
          </motion.h1>
          <motion.p>
            {properties.length} properties found within 20km of your location.
          </motion.p>
        </motion.div>

        <Carousel
          slideSize={{ base: "100%", sm: "50%", md: "33.333%" }}
          slideGap={{ base: "sm", sm: "md" }}
          withControls={true}
        >
          {slides}
        </Carousel>
      </motion.div>
    </div>
  );
}

export default Popular;
