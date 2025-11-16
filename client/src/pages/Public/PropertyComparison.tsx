import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconX,
  IconPlus,
  IconMapPin,
  IconBed,
  IconBath,
  IconRuler,
  IconCar,
  IconWifi,
  IconShield,
  IconFlame,
  IconDroplet,
  IconBolt,
  IconCheck,
  IconMinus,
  IconHeart,
  IconShare,
} from "@tabler/icons-react";
import {
  Button,
  Card,
  Group,
  Text,
  Badge,
  Divider,
  Table,
  ActionIcon,
  Tooltip,
  Container,
  Grid,
  Image,
  Stack,
} from "@mantine/core";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  images: string[];
  amenities: string[];
  type: string;
  yearBuilt: number;
  furnishing: string;
  features: {
    security: boolean;
    wifi: boolean;
    generator: boolean;
    water: boolean;
    electricity: boolean;
    parking: boolean;
    garden: boolean;
    balcony: boolean;
  };
}

const PropertyComparison = () => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [searchMode, setSearchMode] = useState(false);

  // Sample properties for demonstration
  const sampleProperties: Property[] = [
    {
      id: "1",
      title: "Luxury 3-Bedroom Apartment",
      location: "Victoria Island, Lagos",
      price: "₦450,000/month",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      parking: 2,
      images: ["/images/property-1.jpeg"],
      amenities: ["Swimming Pool", "Gym", "Security", "Generator"],
      type: "Apartment",
      yearBuilt: 2020,
      furnishing: "Fully Furnished",
      features: {
        security: true,
        wifi: true,
        generator: true,
        water: true,
        electricity: true,
        parking: true,
        garden: false,
        balcony: true,
      },
    },
    {
      id: "2",
      title: "Modern 4-Bedroom Duplex",
      location: "Lekki Phase 1, Lagos",
      price: "₦650,000/month",
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      parking: 3,
      images: ["/images/property-2.jpeg"],
      amenities: ["Garden", "Security", "Generator", "Parking"],
      type: "Duplex",
      yearBuilt: 2019,
      furnishing: "Semi-Furnished",
      features: {
        security: true,
        wifi: false,
        generator: true,
        water: true,
        electricity: true,
        parking: true,
        garden: true,
        balcony: true,
      },
    },
    {
      id: "3",
      title: "Cozy 2-Bedroom Flat",
      location: "Ikeja GRA, Lagos",
      price: "₦280,000/month",
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      parking: 1,
      images: ["/images/property-3.jpeg"],
      amenities: ["Security", "Parking", "Generator"],
      type: "Apartment",
      yearBuilt: 2018,
      furnishing: "Unfurnished",
      features: {
        security: true,
        wifi: false,
        generator: true,
        water: true,
        electricity: true,
        parking: true,
        garden: false,
        balcony: false,
      },
    },
  ];

  const addProperty = (property: Property) => {
    if (
      selectedProperties.length < 3 &&
      !selectedProperties.find((p) => p.id === property.id)
    ) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(
      selectedProperties.filter((p) => p.id !== propertyId)
    );
  };

  const FeatureIcon = ({
    feature,
    available,
  }: {
    feature: string;
    available: boolean;
  }) => {
    const icons = {
      security: IconShield,
      wifi: IconWifi,
      generator: IconFlame,
      water: IconDroplet,
      electricity: IconBolt,
      parking: IconCar,
      garden: IconCheck,
      balcony: IconCheck,
    };

    const Icon = icons[feature as keyof typeof icons] || IconCheck;

    return (
      <Tooltip label={feature.charAt(0).toUpperCase() + feature.slice(1)}>
        <div
          className={`p-2 rounded-full ${
            available
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <Icon size={16} />
        </div>
      </Tooltip>
    );
  };

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Properties
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare up to 3 properties side by side to make an informed decision
          </p>
        </div>

        {/* Selected Properties Count */}
        <Card className="mb-8 p-6">
          <Group justify="space-between">
            <div>
              <Text size="lg" fw={600}>
                Selected Properties: {selectedProperties.length}/3
              </Text>
              <Text size="sm" c="dimmed">
                {3 - selectedProperties.length} more properties can be added
              </Text>
            </div>
            <Button
              variant="outline"
              onClick={() => setSearchMode(!searchMode)}
              disabled={selectedProperties.length >= 3}
            >
              <IconPlus size={16} className="mr-2" />
              Add Property
            </Button>
          </Group>
        </Card>

        {/* Property Selection */}
        {searchMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <Text size="lg" fw={600} mb="md">
                Available Properties
              </Text>
              <Grid>
                {sampleProperties
                  .filter(
                    (p) => !selectedProperties.find((sp) => sp.id === p.id)
                  )
                  .map((property) => (
                    <Grid.Col key={property.id} span={{ base: 12, md: 4 }}>
                      <Card className="h-full">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          height={150}
                          className="rounded-md mb-3"
                        />
                        <Text fw={600} size="sm" mb="xs">
                          {property.title}
                        </Text>
                        <Text size="xs" c="dimmed" mb="xs">
                          <IconMapPin size={12} className="inline mr-1" />
                          {property.location}
                        </Text>
                        <Text fw={700} c="blue" mb="md">
                          {property.price}
                        </Text>
                        <Button
                          fullWidth
                          size="xs"
                          onClick={() => addProperty(property)}
                        >
                          Add to Compare
                        </Button>
                      </Card>
                    </Grid.Col>
                  ))}
              </Grid>
            </Card>
          </motion.div>
        )}

        {/* Comparison Table */}
        {selectedProperties.length > 0 ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="w-48">Features</Table.Th>
                    {selectedProperties.map((property) => (
                      <Table.Th
                        key={property.id}
                        className="text-center min-w-64"
                      >
                        <div className="relative">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={() => removeProperty(property.id)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            height={120}
                            className="rounded-md mb-3"
                          />
                          <Text fw={600} size="sm" mb="xs">
                            {property.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {property.location}
                          </Text>
                        </div>
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {/* Price */}
                  <Table.Tr>
                    <Table.Td className="font-medium">Price</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Text fw={700} c="blue" size="lg">
                          {property.price}
                        </Text>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  {/* Basic Info */}
                  <Table.Tr>
                    <Table.Td className="font-medium">Property Type</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Badge color="blue" variant="light">
                          {property.type}
                        </Badge>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td className="font-medium">Bedrooms</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Group gap="xs" justify="center">
                          <IconBed size={16} />
                          <Text>{property.bedrooms}</Text>
                        </Group>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td className="font-medium">Bathrooms</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Group gap="xs" justify="center">
                          <IconBath size={16} />
                          <Text>{property.bathrooms}</Text>
                        </Group>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td className="font-medium">Area (sqm)</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Group gap="xs" justify="center">
                          <IconRuler size={16} />
                          <Text>{property.area}</Text>
                        </Group>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td className="font-medium">Parking</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Group gap="xs" justify="center">
                          <IconCar size={16} />
                          <Text>{property.parking}</Text>
                        </Group>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td className="font-medium">Year Built</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        {property.yearBuilt}
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td className="font-medium">Furnishing</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Badge
                          color={
                            property.furnishing === "Fully Furnished"
                              ? "green"
                              : property.furnishing === "Semi-Furnished"
                              ? "yellow"
                              : "gray"
                          }
                          variant="light"
                        >
                          {property.furnishing}
                        </Badge>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  {/* Features */}
                  <Table.Tr>
                    <Table.Td className="font-medium">Features</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(property.features).map(
                            ([feature, available]) => (
                              <FeatureIcon
                                key={feature}
                                feature={feature}
                                available={available}
                              />
                            )
                          )}
                        </div>
                      </Table.Td>
                    ))}
                  </Table.Tr>

                  {/* Actions */}
                  <Table.Tr>
                    <Table.Td className="font-medium">Actions</Table.Td>
                    {selectedProperties.map((property) => (
                      <Table.Td key={property.id} className="text-center">
                        <Stack gap="xs">
                          <Button
                            size="xs"
                            fullWidth
                            component={Link}
                            to={`/listings/${property.id}`}
                          >
                            View Details
                          </Button>
                          <Group gap="xs" justify="center">
                            <ActionIcon variant="light" color="red">
                              <IconHeart size={16} />
                            </ActionIcon>
                            <ActionIcon variant="light" color="blue">
                              <IconShare size={16} />
                            </ActionIcon>
                          </Group>
                        </Stack>
                      </Table.Td>
                    ))}
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <IconPlus size={64} className="mx-auto" />
            </div>
            <Text size="lg" fw={600} mb="xs">
              No Properties Selected
            </Text>
            <Text c="dimmed" mb="md">
              Add properties to start comparing their features and prices
            </Text>
            <Button onClick={() => setSearchMode(true)}>
              Add Your First Property
            </Button>
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default PropertyComparison;
