import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks"; // For the Modal
import {
  IconPencil,
  IconMapPin,
  IconBed,
  IconSquare,
  IconArrowLeft,
  IconInfoCircle,
  IconBath,
  IconArmchair,
  IconChefHat,
  IconCircleCheckFilled
} from "@tabler/icons-react";
import { useLandlordOperations } from "@/apis/landlordApi";
import { useLoading } from "@/hooks/useLoading";
import {
  Button,
  Card,
  Grid,
  Group,
  Text,
  Badge,
  Paper,
  Stack,
  Divider,
  Box,
  Image,
  SimpleGrid,
  Title,
  Container,
  Modal,
} from "@mantine/core";
import { BrandedLoader } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false); // Modal state
  const { loading, withLoading } = useLoading();
  const { getProperty } = useLandlordOperations();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (val: any) => Number(val || 0).toLocaleString();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await withLoading(getProperty(id!));
        console.log(response);
        if (response?.property) setPropertyData(response);
      } catch (err: any) {
        setError(err.message || "Failed to fetch property");
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) return <BrandedLoader inDashboard={true} />;
  if (error || !propertyData?.property)
    return (
        <ErrorState
            loading={loading}
            message={error || "Not found"}
            onRetry={() => window.location.reload()}
        />
    );

  const { property, category, current_lease, tenant } = propertyData;

  // 1. Get unique gallery images (excluding the cover image from the side thumbnails)
  const sideImages = property.gallery?.filter((img: string) => img !== property.cover_image) || [];

  const amenitiesList = property.amenities
      ? Object.entries(property.amenities)
          .filter(([_, value]) => value === true || (Array.isArray(value) && value.length > 0))
          .map(([key]) => key.replace(/_/g, " "))
      : [];

  return (
      <Box bg="#fcfcfc" mih="100vh" py="xl">
        {/* FULL GALLERY MODAL */}
        <Modal
            opened={opened}
            onClose={close}
            size="70%"
            title={<Title order={3}>Property Gallery</Title>}
            radius="md"
        >
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {property.gallery?.map((img: string, index: number) => (
                <Image
                    key={index}
                    src={img}
                    radius="md"
                    alt={`Gallery ${index}`}
                    fallbackSrc="https://placehold.co/600x400?text=Property+Image"
                />
            ))}
          </SimpleGrid>
        </Modal>

        <Container size="xl">
          {/* Header Navigation */}
          <Group justify="space-between" mb="lg">
            <Button
                variant="subtle"
                color="dark"
                leftSection={<IconArrowLeft size={18} />}
                onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
                variant="filled"
                color="dark.8"
                radius="md"
                leftSection={<IconPencil size={18} />}
            >
              Edit Property
            </Button>
          </Group>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
              <Stack gap="xl">
                {/* Refined Gallery Grid */}
                <Box>
                  <Grid gutter="xs">
                    <Grid.Col span={8}>
                      <Image
                          src={property.cover_image}
                          radius="lg"
                          height={400}
                          fit="cover"
                          style={{ cursor: 'pointer' }}
                          onClick={open}
                          fallbackSrc="https://placehold.co/600x400?text=No+Image"
                      />
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <Stack gap="xs">
                        {sideImages.slice(0, 2).map((img: string, i: number) => (
                            <Box key={i} pos="relative" style={{ cursor: 'pointer' }} onClick={open}>
                              <Image
                                  src={img}
                                  radius="md"
                                  height={195}
                                  fit="cover"
                                  fallbackSrc="https://placehold.co/600x400?text=Property+Image"
                              />
                              {/* Show Overlay on the second thumbnail if there are more images */}
                              {i === 1 && sideImages.length > 2 && (
                                  <Box
                                      pos="absolute"
                                      inset={0}
                                      bg="rgba(0,0,0,0.6)"
                                      style={{
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.3s ease'
                                      }}
                                  >
                                    <Text c="white" fw={700} size="lg">+{sideImages.length - 1} More</Text>
                                  </Box>
                              )}
                            </Box>
                        ))}
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Box>

                {/* Title Section */}
                <Box>
                  <Group justify="space-between" align="center" mb="xs">
                    <Title order={1} fw={900} c="dark.9">{property.name}</Title>
                    <Badge size="lg" color="blue" variant="light" radius="sm">
                      {category?.name || "Property"}
                    </Badge>
                  </Group>
                  <Group gap="xs" c="gray.6">
                    <IconMapPin size={18} />
                    <Text fw={500}>{property.address}, {property.city}</Text>
                  </Group>
                </Box>

                {/* Core Features */}
                <Paper withBorder radius="md" p="lg" bg="white">
                  <SimpleGrid cols={{ base: 2, sm: 4 }}>
                    <FeatureBox icon={IconBed} label="Bedrooms" value={property.bedrooms} />
                    <FeatureBox icon={IconBath} label="Bathrooms" value={property.bathrooms} />
                    <FeatureBox icon={IconChefHat} label="Kitchens" value={property.kitchens} />
                    <FeatureBox icon={IconSquare} label="Size" value={`${property.size_sqft} sqft`} />
                  </SimpleGrid>
                </Paper>

                <Box>
                  <Title order={4} mb="sm">Description</Title>
                  <Text c="gray.7" style={{ lineHeight: 1.8 }}>{property.description}</Text>
                </Box>

                <Box>
                  <Title order={4} mb="md">Amenities & Facilities</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
                    {amenitiesList.map((item) => (
                        <Group key={item} gap="xs">
                          <IconCircleCheckFilled size={18} color="#22c55e" />
                          <Text size="sm" fw={500} tt="capitalize">{item}</Text>
                        </Group>
                    ))}
                  </SimpleGrid>
                </Box>
              </Stack>
            </Grid.Col>

            {/* SIDEBAR */}
            <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
              <Stack gap="lg">
                <Card withBorder radius="lg" p="xl" shadow="sm">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">Annual Rent</Text>
                  <Group align="flex-end" gap={4} mb="xl">
                    <Text size="32px" fw={900}>₦{formatCurrency(property.rent_amount)}</Text>
                    <Text size="sm" c="dimmed" mb={6}>/ year</Text>
                  </Group>

                  <Stack gap="md">
                    <SidebarRow label="Caution Fee" value={property.caution_fee} />
                    <SidebarRow label="Legal & Agreement" value={property.agreement_fee} />
                    <SidebarRow label="Service Charge" value={property.service_charge} />
                    <Divider my="xs" />
                    <Group justify="space-between">
                      <Text fw={700}>Initial Deposit</Text>
                      <Text fw={900} c="blue.7" size="lg">
                        ₦{formatCurrency(Number(property.rent_amount) + Number(property.caution_fee || 0) + Number(property.agreement_fee || 0))}
                      </Text>
                    </Group>
                  </Stack>
                  <Button fullWidth size="md" mt="xl" color="dark.8" radius="md">Payment History</Button>
                </Card>

                <Paper withBorder radius="lg" p="xl">
                  <Title order={5} mb="lg">Technical Details</Title>
                  <Stack gap="sm">
                    <TechRow label="Furnishing" value={property.furnished} />
                    <TechRow label="Year Built" value={property.year_built} />
                    <TechRow label="Toilets" value={property.toilets} />
                    <TechRow label="Water Source" value={property.water_source} />
                    <TechRow label="Floors" value={property.floors_no} />
                  </Stack>
                </Paper>

                <Card withBorder radius="lg" p="xl" bg={tenant ? "white" : "blue.0"}>
                  <Title order={5} mb="md">Occupancy</Title>
                  {tenant ? (
                      <Group wrap="nowrap">
                        <Paper radius="xl" bg="gray.1" p="sm"><IconArmchair size={24} /></Paper>
                        <Box>
                          <Text fw={700} size="sm">{tenant.full_name}</Text>
                          <Text size="xs" c="dimmed">Lease ends: {new Date(current_lease?.end_date).toLocaleDateString()}</Text>
                        </Box>
                      </Group>
                  ) : (
                      <Group gap="xs" c="blue.7">
                        <IconInfoCircle size={20} />
                        <Text size="sm" fw={600}>Available for lease</Text>
                      </Group>
                  )}
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
  );
}

// Sub-components (Keep these below the main function)
const FeatureBox = ({ icon: Icon, label, value }: any) => (
    <Stack gap={4}>
      <Group gap={6}>
        <Icon size={20} color="#1c7ed6" stroke={1.5} />
        <Text size="xs" fw={700} c="dimmed" tt="uppercase">{label}</Text>
      </Group>
      <Text fw={700} size="md" ml={26}>{value || "0"}</Text>
    </Stack>
);

const SidebarRow = ({ label, value }: any) => (
    <Group justify="space-between">
      <Text size="sm" c="gray.6">{label}</Text>
      <Text size="sm" fw={600}>₦{Number(value || 0).toLocaleString()}</Text>
    </Group>
);

const TechRow = ({ label, value }: any) => (
    <Group justify="space-between" py={4} style={{ borderBottom: "1px solid #f1f3f5" }}>
      <Text size="xs" fw={600} c="gray.5" tt="uppercase">{label}</Text>
      <Text size="sm" fw={600} c="dark.7">{value || "—"}</Text>
    </Group>
);

export default PropertyDetails;