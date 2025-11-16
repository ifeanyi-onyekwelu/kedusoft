import {
  Modal,
  Group,
  Select,
  Checkbox,
  Button,
  Stack,
  TextInput,
  RangeSlider,
  Divider,
  Box,
} from "@mantine/core";
import { useState } from "react";

interface PropertyFilterModalProps {
  opened: boolean;
  onClose: () => void;
}

const bedroomOptions = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const bathroomOptions = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const propertyTypes = [
  { value: "any", label: "Any" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
];

const amenitiesList = [
  "Parking",
  "Furnished",
  "Pet Friendly",
  "Gym",
  "Swimming Pool",
  "Security",
  "Elevator",
  "Laundry",
];

function PropertyFilterModal({ opened, onClose }: PropertyFilterModalProps) {
  const [type, setType] = useState("any");
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState<[number, number]>([0, 5000]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleReset = () => {
    setType("any");
    setBedrooms("any");
    setBathrooms("any");
    setLocation("");
    setSqft([0, 5000]);
    setAmenities([]);
  };

  const handleApply = () => {
    // You can pass the filter values to the parent here if needed
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Filter Properties"
      centered
      size="lg"
      radius="md"
      overlayProps={{ blur: 2 }}
      padding="lg"
    >
      <Stack gap="lg">
        <Group grow>
          <Select
            label="Type"
            data={propertyTypes}
            value={type}
            onChange={(value) => value && setType(value)}
            placeholder="Select type"
            radius="md"
          />
          <Select
            label="Bedrooms"
            data={bedroomOptions}
            value={bedrooms}
            onChange={(value) => value && setBedrooms(value)}
            placeholder="Any"
            radius="md"
          />
          <Select
            label="Bathrooms"
            data={bathroomOptions}
            value={bathrooms}
            onChange={(value) => value && setBathrooms(value)}
            placeholder="Any"
            radius="md"
          />
        </Group>
        <TextInput
          label="Location"
          placeholder="Enter city, area, or landmark"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          radius="md"
        />
        <Divider label="Amenities" />
        <Group
          gap="xs"
          wrap="wrap"
          style={{ background: "#f8fafc", borderRadius: 8, padding: 12 }}
        >
          {amenitiesList.map((amenity) => (
            <Checkbox
              key={amenity}
              label={amenity}
              checked={amenities.includes(amenity)}
              onChange={() => handleAmenityChange(amenity)}
              radius="md"
              size="md"
            />
          ))}
        </Group>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleReset} radius="md">
            Reset
          </Button>
          <Button onClick={handleApply} radius="md">
            Apply Filters
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default PropertyFilterModal;
