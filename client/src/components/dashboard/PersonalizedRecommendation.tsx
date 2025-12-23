// components/screens/Dashboards/PersonalizedRecommendations.tsx
import {
  Card,
  Group,
  Text,
  Box,
  SimpleGrid,
  Title,
  Button,
  Badge,
  Stack,
  Progress,
  ThemeIcon,
  Paper,
  Flex,
  Tooltip,
  ActionIcon,
  RingProgress,
  Center,
} from "@mantine/core";
import {
  IconMapPin,
  IconBed,
  IconBath,
  IconRuler,
  IconHeart,
  IconStar,
  IconTrendingUp,
  IconCheck,
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconShield,
  IconPercentage,
  IconFlame,
  IconBuilding,
  IconWalk,
  IconTrain,
  IconCar,
  IconBrain,
  IconFileStack,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock personalized recommendations data
const getPersonalizedRecommendations = (
  userLocation?: string,
  userBudget?: number
) => {
  const baseRecommendations = [
    {
      id: 1,
      title: "Modern Downtown Loft",
      location: "Downtown",
      price: 1850,
      matchScore: 95,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      amenities: ["Pet Friendly", "Gym", "Pool", "In-unit Laundry"],
      commuteTime: 15,
      commuteType: "walk",
      images: ["/api/placeholder/400/300"],
      saved: true,
      matchReasons: [
        "Your preferred neighborhood",
        "Within budget",
        "Pet-friendly",
      ],
      landlordResponseTime: "2 hours",
      availableDate: "2024-03-15",
      applicationPriority: "High",
    },
    {
      id: 2,
      title: "Quiet Suburban Home",
      location: "West Suburbs",
      price: 2200,
      matchScore: 88,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 950,
      amenities: ["Backyard", "Parking", "Quiet Area", "Updated Kitchen"],
      commuteTime: 25,
      commuteType: "drive",
      images: ["/api/placeholder/400/300"],
      saved: false,
      matchReasons: [
        "Extra space you wanted",
        "Good school district",
        "Safe neighborhood",
      ],
      landlordResponseTime: "4 hours",
      availableDate: "2024-03-20",
      applicationPriority: "Medium",
    },
    {
      id: 3,
      title: "Luxury Apartment with Views",
      location: "Riverside",
      price: 2500,
      matchScore: 82,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      amenities: ["Balcony", "Concierge", "Roof Deck", "Smart Home"],
      commuteTime: 20,
      commuteType: "transit",
      images: ["/api/placeholder/400/300"],
      saved: true,
      matchReasons: [
        "Matches luxury preference",
        "Great amenities",
        "Near your work",
      ],
      landlordResponseTime: "1 hour",
      availableDate: "2024-04-01",
      applicationPriority: "High",
    },
  ];

  // Filter based on user preferences if available
  if (userBudget) {
    return baseRecommendations.filter((rec) => rec.price <= userBudget * 1.1); // 10% buffer
  }

  return baseRecommendations;
};

// Match score indicator with color
const MatchScoreIndicator = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    if (score >= 90) return "#10B981"; // Emerald
    if (score >= 80) return "#3B82F6"; // Blue
    if (score >= 70) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  return (
    <Tooltip label={`${score}% match with your preferences`}>
      <Box style={{ position: "relative", width: 60, height: 60 }}>
        <RingProgress
          size={60}
          thickness={4}
          sections={[{ value: score, color: getColor(score) }]}
          label={
            <Center>
              <Text size="xs" fw={700} style={{ color: getColor(score) }}>
                {score}
              </Text>
            </Center>
          }
        />
      </Box>
    </Tooltip>
  );
};

// Commute time indicator
const CommuteIndicator = ({ time, type }: { time: number; type: string }) => {
  const getIcon = () => {
    switch (type) {
      case "walk":
        return <IconWalk size={16} />;
      case "drive":
        return <IconCar size={16} />;
      case "transit":
        return <IconTrain size={16} />;
      default:
        return <IconWalk size={16} />;
    }
  };

  const getColor = (time: number) => {
    if (time <= 15) return "#10B981";
    if (time <= 30) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <Tooltip label={`${time} min ${type}`}>
      <Badge
        leftSection={getIcon()}
        variant="light"
        color={getColor(time)}
        size="sm"
        style={{ padding: "4px 8px" }}
      >
        {time} min
      </Badge>
    </Tooltip>
  );
};

const PersonalizedRecommendations = ({ user }: { user?: any }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(
    getPersonalizedRecommendations(user?.location, user?.budget)
  );

  const handleSaveProperty = (id: number) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, saved: !rec.saved } : rec))
    );
  };

  const handleQuickApply = (id: number) => {
    // Navigate to application page
    navigate(`/properties/${id}/apply`);
  };

  return (
    <Card
      withBorder
      radius="md"
      p="lg"
      style={{
        backgroundColor: "white",
        border: "1px solid #E0E0E0",
      }}
    >
      <Group justify="space-between" mb="md" align="center">
        <Box>
          <Title
            order={3}
            style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1A1A1A" }}
          >
            Personalized For You
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            Properties matched to your preferences and search history
          </Text>
        </Box>
        <Button
          variant="light"
          color="blue"
          rightSection={<IconChevronRight size={14} />}
          onClick={() => navigate("/tenants/recommendations")}
          style={{ fontWeight: 600 }}
        >
          View All Matches
        </Button>
      </Group>

      {/* Match Summary Bar */}
      <Paper
        p="md"
        radius="md"
        mb="lg"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Group justify="space-between" align="center">
          <Box>
            <Group gap="xs" mb={4}>
              <IconStar size={18} color="white" />
              <Text size="sm" fw={600}>
                Your Match Summary
              </Text>
            </Group>
            <Text size="xs" opacity={0.9}>
              Based on 12 viewed properties and 8 saved preferences
            </Text>
          </Box>
          <Group gap="xl">
            <Box style={{ textAlign: "center" }}>
              <Text size="xl" fw={700}>
                92%
              </Text>
              <Text size="xs" opacity={0.9}>
                Avg. Match
              </Text>
            </Box>
            <Box style={{ textAlign: "center" }}>
              <Text size="xl" fw={700}>
                3
              </Text>
              <Text size="xs" opacity={0.9}>
                Top Picks
              </Text>
            </Box>
            <Box style={{ textAlign: "center" }}>
              <Text size="xl" fw={700}>
                8
              </Text>
              <Text size="xs" opacity={0.9}>
                New Today
              </Text>
            </Box>
          </Group>
        </Group>
      </Paper>

      {/* Top Recommendations Grid */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {recommendations.map((property) => (
          <Paper
            key={property.id}
            withBorder
            radius="md"
            p="md"
            style={{
              border: "1px solid #E0E0E0",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => navigate(`/properties/${property.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Match Score Badge */}
            <Box
              style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
            >
              <MatchScoreIndicator score={property.matchScore} />
            </Box>

            {/* Property Image */}
            <Box
              style={{
                height: 180,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                marginBottom: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Favorite Button */}
              <ActionIcon
                variant="filled"
                color={property.saved ? "red" : "gray"}
                size="lg"
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 2,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveProperty(property.id);
                }}
              >
                <IconHeart
                  size={18}
                  fill={property.saved ? "currentColor" : "none"}
                />
              </ActionIcon>

              {/* Priority Badge */}
              {property.applicationPriority === "High" && (
                <Badge
                  color="red"
                  variant="filled"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 2,
                  }}
                >
                  <IconFlame size={12} style={{ marginRight: 4 }} />
                  Hot Property
                </Badge>
              )}
            </Box>

            {/* Property Details */}
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Text size="lg" fw={700} lineClamp={1}>
                    {property.title}
                  </Text>
                  <Group gap="xs" align="center" mt={2}>
                    <IconMapPin size={14} color="#666" />
                    <Text size="sm" c="dimmed">
                      {property.location}
                    </Text>
                  </Group>
                </Box>
              </Group>

              {/* Price and Match Info */}
              <Group justify="space-between" align="center">
                <Box>
                  <Text size="xl" fw={700} style={{ color: "#1A1A1A" }}>
                    ${property.price}
                    <Text component="span" size="sm" fw={400} c="dimmed">
                      /month
                    </Text>
                  </Text>
                </Box>
                <CommuteIndicator
                  time={property.commuteTime}
                  type={property.commuteType}
                />
              </Group>

              {/* Property Features */}
              <Group gap="lg" mt="xs">
                <Tooltip label="Bedrooms">
                  <Group gap={4}>
                    <IconBed size={16} color="#666" />
                    <Text size="sm" fw={500}>
                      {property.bedrooms}
                    </Text>
                  </Group>
                </Tooltip>
                <Tooltip label="Bathrooms">
                  <Group gap={4}>
                    <IconBath size={16} color="#666" />
                    <Text size="sm" fw={500}>
                      {property.bathrooms}
                    </Text>
                  </Group>
                </Tooltip>
                <Tooltip label="Square Feet">
                  <Group gap={4}>
                    <IconRuler size={16} color="#666" />
                    <Text size="sm" fw={500}>
                      {property.sqft}
                    </Text>
                  </Group>
                </Tooltip>
              </Group>

              {/* Match Reasons */}
              <Box mt="xs">
                <Text size="xs" fw={600} c="dimmed" mb={4}>
                  Why this matches:
                </Text>
                <Stack gap={2}>
                  {property.matchReasons.slice(0, 2).map((reason, idx) => (
                    <Group key={idx} gap="xs">
                      <IconCheck size={12} color="#10B981" />
                      <Text size="xs" c="dimmed">
                        {reason}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Box>

              {/* Quick Actions */}
              <Group gap="xs" mt="md">
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  radius="md"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickApply(property.id);
                  }}
                  leftSection={<IconFileStack size={14} />}
                >
                  Quick Apply
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  size="sm"
                  radius="md"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/properties/${property.id}`);
                  }}
                  rightSection={<IconChevronRight size={14} />}
                >
                  Details
                </Button>
              </Group>

              {/* Additional Info */}
              <Group justify="space-between" mt="xs">
                <Tooltip label="Landlord response time">
                  <Badge variant="light" color="green" size="xs">
                    <IconClock size={10} style={{ marginRight: 4 }} />
                    {property.landlordResponseTime}
                  </Badge>
                </Tooltip>
                <Tooltip label="Available date">
                  <Badge variant="light" color="blue" size="xs">
                    <IconCalendar size={10} style={{ marginRight: 4 }} />
                    {new Date(property.availableDate).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </Badge>
                </Tooltip>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Insights & Tips */}
      <Paper
        p="md"
        radius="md"
        mt="lg"
        style={{
          backgroundColor: "#F0F9FF",
          border: "1px solid #BAE6FD",
        }}
      >
        <Group gap="md">
          <ThemeIcon size={40} radius="md" color="blue" variant="light">
            <IconBrain size={20} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={600} style={{ color: "#0369A1" }}>
              Smart Tip for You
            </Text>
            <Text size="sm" c="dimmed">
              Based on your activity, properties in the Downtown area have a 40%
              faster approval rate. Consider applying to 2-3 properties
              simultaneously to increase your chances.
            </Text>
          </Box>
          <Button
            variant="subtle"
            color="blue"
            size="sm"
            rightSection={<IconTrendingUp size={14} />}
            onClick={() => navigate("/tenants/insights")}
          >
            View Insights
          </Button>
        </Group>
      </Paper>
    </Card>
  );
};

export default PersonalizedRecommendations;
