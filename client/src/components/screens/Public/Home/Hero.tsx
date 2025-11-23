import { Group, TextInput, Combobox, useCombobox, Button } from "@mantine/core";
import { IconSearch, IconMapPin } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import type { Variants } from "framer-motion";

interface GeocodingResponse {
  address: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
  display_name: string;
}

function Hero() {
  const [location, setLocation] = useState("");

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const handleGetCurrentLocation = async () => {
    combobox.closeDropdown();

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      // Get user's coordinates
      const position: GeolocationPosition = await new Promise(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get full address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      const data: GeocodingResponse = await response.json();

      // Extract address components
      const address = data.address;
      const addressParts = [
        address.house_number,
        address.road,
        address.neighbourhood || address.suburb,
      ].filter(Boolean);

      const fullAddress = addressParts.join(" ");
      const city = address.city || address.state || address.county || "";

      // Build location string - prefer specific address or fall back to city/state
      const locationString = fullAddress || city;

      // Navigate to listings page with location and coordinates
      const params = new URLSearchParams();
      params.append("location", locationString);
      params.append("lat", latitude.toString());
      params.append("lng", longitude.toString());
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error(
        "Unable to get your location. Please check your browser settings and try again."
      );
    }
  };

  const searchListings = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative bg-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/houses/nigeria.jpg')`,
        }}
      />

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Hero Section */}
      <div className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-black/20" />

        <motion.div
          className="relative z-10 w-max-window mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="text-start space-y-12">
            {/* Main Heading - Exact Zillow Style */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-white font-black text-4xl md:text-5xl lg:text-6xl leading-tight">
                Agents. Tours.
                <br />
                Loans. Homes.
              </h1>
            </motion.div>

            {/* Simple Search Bar - Zillow Style */}
            <motion.div variants={itemVariants} className="max-w-2xl">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex">
                  <div className="flex-1">
                    <Combobox store={combobox} withinPortal={false}>
                      <Combobox.Target>
                        <TextInput
                          placeholder="Enter an address, neighborhood, city, or ZIP code"
                          value={location}
                          onChange={(e) => {
                            setLocation(e.currentTarget.value);
                            combobox.openDropdown();
                          }}
                          onClick={() => combobox.openDropdown()}
                          onFocus={() => combobox.openDropdown()}
                          size="xl"
                          variant="unstyled"
                          className="w-full"
                          styles={{
                            input: {
                              fontSize: "18px",
                              fontWeight: 400,
                              padding: "20px 24px",
                              border: "none",
                              "&:focus": {
                                outline: "none",
                              },
                            },
                          }}
                        />
                      </Combobox.Target>

                      <Combobox.Dropdown>
                        <Combobox.Options>
                          <Combobox.Option
                            value="current-location"
                            onClick={handleGetCurrentLocation}
                          >
                            <Group gap={8}>
                              <IconMapPin size={16} />
                              <span>Use Current Location</span>
                            </Group>
                          </Combobox.Option>
                        </Combobox.Options>
                      </Combobox.Dropdown>
                    </Combobox>
                  </div>

                  <Button
                    leftSection={<IconSearch color="black" />}
                    onClick={searchListings}
                    className="bg-transparent hover:bg-gray-100 border-0 rounded-l-none px-8 font-semibold h-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
