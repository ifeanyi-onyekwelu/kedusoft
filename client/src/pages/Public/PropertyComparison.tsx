import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  IconHeart,
  IconShare,
  IconLayoutColumns,
  IconSearch,
} from "@tabler/icons-react";
import {
  Button,
  Card,
  Group,
  Text,
  Badge,
  Table,
  ActionIcon,
  Tooltip,
  Container,
  Grid,
  Image,
  Stack,
  Box,
  Paper,
  Divider,
  Title,
} from "@mantine/core";

// Interface and Sample Data (unchanged for logic)
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
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800",
      ],
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
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800",
      ],
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
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800",
      ],
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
    const icons: Record<string, any> = {
      security: IconShield,
      wifi: IconWifi,
      generator: IconFlame,
      water: IconDroplet,
      electricity: IconBolt,
      parking: IconCar,
      garden: IconCheck,
      balcony: IconCheck,
    };
    const Icon = icons[feature] || IconCheck;

    return (
      <Tooltip
        label={feature.charAt(0).toUpperCase() + feature.slice(1)}
        withArrow
      >
        <Box
          className={`flex items-center justify-center p-2 rounded-sm border transition-all ${
            available
              ? "bg-white border-blue-200 text-blue-700 shadow-sm"
              : "bg-gray-50 border-gray-100 text-gray-300"
          }`}
        >
          <Icon size={16} stroke={1.5} />
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
      component="main"
      style={{
        backgroundColor: "var(--color-gray-50)",
        minHeight: "100vh",
        fontFamily: "var(--font-manrope)",
      }}
    >
      <Container size="xl" py={60}>
        {/* Header - No Gradients, Clean Typography */}
        <Box mb={50}>
          <Group justify="space-between" align="flex-end">
            <Box>
              <Text
                fw={800}
                tt="uppercase"
                lts={2}
                size="xs"
                style={{ color: "var(--color-secondary)" }}
              >
                Market Insight
              </Text>
              <Title
                order={1}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "3rem",
                  color: "var(--color-primary)",
                }}
              >
                Compare Properties
              </Title>
              <Text size="lg" c="dimmed" mt="xs" style={{ maxWidth: 500 }}>
                Side-by-side technical analysis of your shortlisted real estate
                assets.
              </Text>
            </Box>
            <Button
              size="lg"
              radius="0"
              style={{ backgroundColor: "var(--color-primary)" }}
              leftSection={
                searchMode ? <IconX size={20} /> : <IconSearch size={20} />
              }
              onClick={() => setSearchMode(!searchMode)}
              disabled={!searchMode && selectedProperties.length >= 3}
            >
              {searchMode ? "Close Inventory" : "Browse Inventory"}
            </Button>
          </Group>
          <Divider mt="xl" color="var(--color-gray-200)" />
        </Box>

        {/* Browser Inventory Grid */}
        <AnimatePresence>
          {searchMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-12"
            >
              <Grid gutter="xl">
                {sampleProperties
                  .filter(
                    (p) => !selectedProperties.find((sp) => sp.id === p.id)
                  )
                  .map((property) => (
                    <Grid.Col key={property.id} span={{ base: 12, md: 4 }}>
                      <Card
                        radius="0"
                        withBorder
                        padding="0"
                        className="bg-white hover:border-blue-400 transition-colors"
                      >
                        <Image
                          src={property.images[0]}
                          height={200}
                          alt={property.title}
                        />
                        <Box p="md">
                          <Text
                            fw={700}
                            style={{ fontFamily: "var(--font-sora)" }}
                          >
                            {property.title}
                          </Text>
                          <Text size="xs" c="dimmed" mb="md">
                            {property.location}
                          </Text>
                          <Group justify="space-between">
                            <Text
                              fw={800}
                              size="lg"
                              style={{ color: "var(--color-primary)" }}
                            >
                              {property.price}
                            </Text>
                            <Button
                              radius="0"
                              size="xs"
                              variant="outline"
                              color="var(--color-primary)"
                              onClick={() => addProperty(property)}
                            >
                              Add to Compare
                            </Button>
                          </Group>
                        </Box>
                      </Card>
                    </Grid.Col>
                  ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Table - The Professional Tool */}
        {selectedProperties.length > 0 ? (
          <motion.div layout>
            <Paper
              radius="0"
              withBorder
              style={{
                backgroundColor: "white",
                boxShadow: "0 20px 40px rgba(0,0,0,0.03)",
              }}
            >
              <div className="overflow-x-auto">
                <Table
                  verticalSpacing="xl"
                  horizontalSpacing="xl"
                  withColumnBorders
                >
                  <Table.Thead className="bg-gray-50">
                    <Table.Tr>
                      <Table.Th style={{ width: 250 }}>
                        <Text
                          fw={800}
                          size="xs"
                          tt="uppercase"
                          lts={1}
                          c="dimmed"
                        >
                          Technical Specs
                        </Text>
                      </Table.Th>
                      {selectedProperties.map((property) => (
                        <Table.Th key={property.id} className="min-w-[300px]">
                          <Box className="relative">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              radius="0"
                              size="md"
                              className="absolute top-0 right-0"
                              onClick={() => removeProperty(property.id)}
                            >
                              <IconX size={18} />
                            </ActionIcon>
                            <Image
                              src={property.images[0]}
                              height={140}
                              radius="0"
                              mb="md"
                            />
                            <Text
                              fw={800}
                              size="md"
                              style={{
                                fontFamily: "var(--font-sora)",
                                color: "var(--color-primary)",
                              }}
                            >
                              {property.title}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {property.location}
                            </Text>
                          </Box>
                        </Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {/* Rows with High Precision Labels */}
                    {[
                      {
                        label: "Financial / Mo",
                        key: "price",
                        highlight: true,
                      },
                      { label: "Asset Type", key: "type", badge: true },
                      {
                        label: "Sleep Quarters",
                        key: "bedrooms",
                        icon: <IconBed size={16} />,
                      },
                      {
                        label: "Sanitary Areas",
                        key: "bathrooms",
                        icon: <IconBath size={16} />,
                      },
                      {
                        label: "Surface Area",
                        key: "area",
                        suffix: " sqm",
                        icon: <IconRuler size={16} />,
                      },
                      { label: "Construction", key: "yearBuilt" },
                      { label: "Status", key: "furnishing" },
                    ].map((row) => (
                      <Table.Tr key={row.label}>
                        <Table.Td>
                          <Group gap="xs">
                            {row.icon && <Box c="dimmed">{row.icon}</Box>}
                            <Text fw={600} size="sm" c="gray.7">
                              {row.label}
                            </Text>
                          </Group>
                        </Table.Td>
                        {selectedProperties.map((p) => (
                          <Table.Td key={p.id}>
                            {row.highlight ? (
                              <Text
                                fw={900}
                                size="xl"
                                style={{
                                  color: "var(--color-primary)",
                                  fontFamily: "var(--font-oswald)",
                                }}
                              >
                                {(p as any)[row.key as string]}
                              </Text>
                            ) : row.badge ? (
                              <Badge radius="0" variant="light" color="blue">
                                {(p as any)[row.key as string]}
                              </Badge>
                            ) : (
                              <Text fw={600} size="sm" c="gray.8">
                                {(p as any)[row.key as string]}
                                {row.suffix}
                              </Text>
                            )}
                          </Table.Td>
                        ))}
                      </Table.Tr>
                    ))}

                    {/* Features Row */}
                    <Table.Tr>
                      <Table.Td className="align-top pt-8">
                        <Text fw={600} size="sm" c="gray.7">
                          Building Utilities
                        </Text>
                      </Table.Td>
                      {selectedProperties.map((p) => (
                        <Table.Td key={p.id} className="pt-8">
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(p.features).map(
                              ([feature, val]) => (
                                <FeatureIcon
                                  key={feature}
                                  feature={feature}
                                  available={val}
                                />
                              )
                            )}
                          </div>
                        </Table.Td>
                      ))}
                    </Table.Tr>

                    {/* Footer Actions */}
                    <Table.Tr>
                      <Table.Td />
                      {selectedProperties.map((p) => (
                        <Table.Td key={p.id} className="pb-8">
                          <Stack gap="xs">
                            <Button
                              component={Link}
                              to={`/listings/${p.id}`}
                              radius="0"
                              fullWidth
                              style={{
                                backgroundColor: "var(--color-primary)",
                              }}
                            >
                              Final Review
                            </Button>
                            <Group grow gap="xs">
                              <Button variant="outline" radius="0" color="gray">
                                <IconHeart size={16} />
                              </Button>
                              <Button variant="outline" radius="0" color="gray">
                                <IconShare size={16} />
                              </Button>
                            </Group>
                          </Stack>
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            </Paper>
          </motion.div>
        ) : (
          /* Empty State - Minimalist */
          <Paper
            radius="0"
            p={100}
            withBorder
            style={{ borderStyle: "dashed", backgroundColor: "white" }}
          >
            <Stack align="center" gap="md">
              <IconLayoutColumns
                size={48}
                stroke={1}
                color="var(--color-gray-500)"
              />
              <Text
                fw={700}
                size="xl"
                style={{ color: "var(--color-primary)" }}
              >
                No Assets Selected
              </Text>
              <Text c="dimmed" style={{ maxWidth: 300, textAlign: "center" }}>
                Select up to three properties from the inventory to generate a
                technical comparison report.
              </Text>
              <Button
                variant="outline"
                radius="0"
                size="lg"
                color="var(--color-primary)"
                onClick={() => setSearchMode(true)}
              >
                Browse Inventory
              </Button>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PropertyComparison;
