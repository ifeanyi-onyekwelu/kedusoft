import React, { useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Card,
  Text,
  Group,
  ThemeIcon,
  Button,
  Stack,
  TextInput,
  Grid,
  Box,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconMapPin,
  IconCurrentLocation,
  IconSearch,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

// Fix default markers in react-leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom red marker for location selection
const createLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background: #ef4444;
        border: 3px solid #ffffff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      </style>
    `,
    className: "custom-location-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address?: string;
    addressComponents?: {
      street?: string;
      area?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    };
  }) => void;
  initialLocation?: { lat: number; lng: number };
  address?: string;
  onAddressChange?: (address: string) => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

// Component to update map center when location changes
const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({
  center,
}) => {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 16, { animate: true, duration: 1 });
    }
  }, [center, map]);

  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  address = "",
  onAddressChange,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);
  const [searchAddress, setSearchAddress] = useState(address);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation
      ? [initialLocation.lat, initialLocation.lng]
      : [6.5244, 3.3792] // Lagos, Nigeria
  );

  // Parse address components from Nominatim response
  const parseAddressComponents = (data: any) => {
    const address = data.address || {};
    const components: any = {};

    // Extract address components with fallbacks
    components.street =
      address.road || address.pedestrian || address.footway || "";
    components.area =
      address.suburb || address.neighbourhood || address.quarter || "";
    components.city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      "";
    components.state = address.state || address.region || "";
    components.zipcode = address.postcode || "";

    return components;
  };

  // Reverse geocoding using Nominatim (free service)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const formattedAddress = data.display_name;
        const addressComponents = parseAddressComponents(data);

        setSearchAddress(formattedAddress);
        onAddressChange?.(formattedAddress);

        return {
          address: formattedAddress,
          components: addressComponents,
        };
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsGeocoding(false);
    }
    return undefined;
  };

  // Forward geocoding using Nominatim
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    try {
      setIsGeocoding(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address + ", Nigeria"
        )}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name, address: addressDetails } = data[0];
        const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
        const addressComponents = parseAddressComponents({
          address: addressDetails,
        });

        setSelectedLocation(location);
        setMapCenter([location.lat, location.lng]);
        setSearchAddress(display_name);
        onAddressChange?.(display_name);

        onLocationSelect({
          ...location,
          address: display_name,
          addressComponents,
        });
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const location = { lat, lng };
    setSelectedLocation(location);
    setMapCenter([lat, lng]);

    // Try to get address for the selected location
    const result = await reverseGeocode(lat, lng);
    if (result) {
      onLocationSelect({
        ...location,
        address: result.address,
        addressComponents: result.components,
      });
    } else {
      onLocationSelect(location);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setSelectedLocation(location);
          setMapCenter([latitude, longitude]);

          // Get address for current location
          const result = await reverseGeocode(latitude, longitude);
          if (result) {
            onLocationSelect({
              ...location,
              address: result.address,
              addressComponents: result.components,
            });
          } else {
            onLocationSelect(location);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    geocodeAddress(searchAddress);
  };

  // Handle Enter key press in the search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      geocodeAddress(searchAddress);
    }
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSearchAddress("");
    onAddressChange?.("");
  };

  return (
    <Card shadow="sm" p="lg" radius="md">
      <Card.Section p="md" bg="gray.0">
        <Group justify="space-between">
          <Group>
            <ThemeIcon size="lg" variant="light">
              <IconMapPin size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600}>Property Location</Text>
              <Text size="sm" c="dimmed">
                Click on the map or search for the property address
              </Text>
            </div>
          </Group>
          {selectedLocation && (
            <Badge color="green" leftSection={<IconCheck size={12} />}>
              Location Selected
            </Badge>
          )}
        </Group>
      </Card.Section>

      <Stack gap="md" mt="md">
        {/* Address Search */}
        <div>
          <Grid align="end">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                placeholder="Enter property address to search..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                leftSection={<IconSearch size={16} />}
                disabled={isGeocoding}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group gap="xs">
                <Button
                  onClick={() => geocodeAddress(searchAddress)}
                  loading={isGeocoding}
                  disabled={!searchAddress.trim()}
                  size="sm"
                >
                  Search
                </Button>
                <Tooltip label="Use current location">
                  <ActionIcon
                    variant="light"
                    onClick={handleCurrentLocation}
                    size="lg"
                  >
                    <IconCurrentLocation size={18} />
                  </ActionIcon>
                </Tooltip>
                {selectedLocation && (
                  <Tooltip label="Clear location">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={clearLocation}
                      size="lg"
                    >
                      <IconX size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Grid.Col>
          </Grid>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <Box p="sm" bg="blue.0" style={{ borderRadius: 8 }}>
            <Text size="sm" fw={500} mb="xs">
              Selected Location:
            </Text>
            <Text size="xs" c="dimmed">
              Latitude: {selectedLocation.lat.toFixed(6)}
            </Text>
            <Text size="xs" c="dimmed">
              Longitude: {selectedLocation.lng.toFixed(6)}
            </Text>
            {searchAddress && (
              <Text size="xs" mt="xs">
                Address: {searchAddress}
              </Text>
            )}
          </Box>
        )}

        {/* Map */}
        <Box style={{ height: "400px", borderRadius: 8, overflow: "hidden" }}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Update map center when location changes */}
            <MapCenterUpdater center={mapCenter} />

            <MapClickHandler onLocationSelect={handleMapClick} />

            {selectedLocation && (
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={createLocationIcon()}
              />
            )}
          </MapContainer>
        </Box>

        <Text size="xs" c="dimmed" ta="center">
          💡 Tip: Click anywhere on the map to set the property location, or
          search for an address above
        </Text>
      </Stack>
    </Card>
  );
};

export default LocationPicker;
