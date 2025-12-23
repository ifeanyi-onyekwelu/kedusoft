// components/shared/Dashboard/EnhancedRecommendations.tsx
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
  Container,
  Center,
  Alert,
  Divider,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconChevronRight,
  IconClock,
  IconShield,
  IconPercentage,
  IconBrain,
  IconRocket,
  IconLeaf,
  IconSparkles,
  IconHourglass,
  IconSettings,
  IconBulb,
  IconChartLine,
  IconUsers,
  IconHome,
  IconChecklist,
  IconCalendarStats,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const EnhancedRecommendations = ({
  user,
  applicationsCount,
  viewedProperties,
}: {
  user: any;
  applicationsCount: number;
  viewedProperties: number;
}) => {
  const navigate = useNavigate();

  // Mock insights data
  const insights = [
    {
      id: 1,
      type: "success_rate",
      title: "Application Success",
      value: "Coming Soon",
      description: "Track your application approval rates",
      icon: IconPercentage,
      color: "#4F46E5",
      status: "in-development",
    },
    {
      id: 2,
      type: "response_time",
      title: "Avg. Response",
      value: "Coming Soon",
      description: "Monitor landlord response times",
      icon: IconClock,
      color: "#059669",
      status: "in-development",
    },
    {
      id: 3,
      type: "competition",
      title: "Market Insight",
      value: "Coming Soon",
      description: "Understand property competition levels",
      icon: IconUsers,
      color: "#DC2626",
      status: "in-development",
    },
  ];

  const marketTrends = [
    {
      area: "Downtown",
      priceChange: "Analysis",
      demand: "In Progress",
      avgPrice: "Calculating...",
    },
    {
      area: "Suburbs",
      priceChange: "Analysis",
      demand: "In Progress",
      avgPrice: "Calculating...",
    },
    {
      area: "North Side",
      priceChange: "Analysis",
      demand: "In Progress",
      avgPrice: "Calculating...",
    },
  ];

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
      {/* Header with AI Assistant */}
      <Group justify="space-between" mb="xl" align="center">
        <Box>
          <Group gap="xs" mb={4}>
            <ThemeIcon
              size={32}
              radius="md"
              color="blue"
              variant="light"
              style={{ border: "1px solid #E5E7EB" }}
            >
              <IconBrain size={18} />
            </ThemeIcon>
            <Title
              order={3}
              style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F2937" }}
            >
              Smart Insights Dashboard
            </Title>
          </Group>
          <Text size="sm" c="dimmed">
            Advanced analytics and recommendations powered by AI
          </Text>
        </Box>
        <Badge
          color="blue"
          variant="light"
          size="lg"
          style={{
            fontWeight: 600,
            padding: "8px 16px",
            border: "1px solid #DBEAFE",
          }}
        >
          <IconHourglass size={14} style={{ marginRight: 6 }} />
          Launching Q2 2024
        </Badge>
      </Group>

      {/* Development Notice */}
      <Alert
        icon={<IconSparkles size={20} />}
        title="Feature Preview"
        color="blue"
        variant="light"
        radius="md"
        mb="xl"
        style={{
          backgroundColor: "#EFF6FF",
          border: "1px solid #BFDBFE",
        }}
      >
        <Text size="sm" style={{ color: "#1E40AF" }}>
          This section shows a preview of our upcoming AI-powered insights.
          We're working hard to bring you personalized recommendations, market
          analysis, and predictive insights to help you find your perfect home.
        </Text>
      </Alert>

      {/* Insights Dashboard */}
      <Box mb="xl">
        <Group justify="space-between" mb="md" align="center">
          <Text fw={600} size="lg" style={{ color: "#374151" }}>
            Analytics & Insights
          </Text>
          <Badge variant="outline" color="gray" size="sm">
            Preview Mode
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {insights.map((insight) => {
            const InsightIcon = insight.icon;
            return (
              <Paper
                key={insight.id}
                withBorder
                radius="md"
                p="lg"
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderLeft: `4px solid ${insight.color}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Development Badge */}
                <Badge
                  color="gray"
                  variant="light"
                  size="xs"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontSize: "10px",
                    fontWeight: 500,
                  }}
                >
                  In Development
                </Badge>

                <Stack gap="md">
                  <Group gap="sm">
                    <ThemeIcon
                      size={42}
                      radius="md"
                      color={insight.color}
                      variant="light"
                      style={{
                        backgroundColor: `${insight.color}10`,
                        border: `1px solid ${insight.color}30`,
                      }}
                    >
                      <InsightIcon size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={600} style={{ color: "#374151" }}>
                        {insight.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {insight.description}
                      </Text>
                    </Box>
                  </Group>

                  <Box
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #F3F4F6",
                      borderRadius: 8,
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <Text size="xl" fw={700} style={{ color: insight.color }}>
                      {insight.value}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Data collection in progress
                    </Text>
                  </Box>

                  <Group gap="xs" justify="center">
                    <IconLeaf size={12} color="#9CA3AF" />
                    <Text size="xs" c="dimmed">
                      Powered by machine learning algorithms
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Box>

      {/* Market Trends */}
      <Card
        withBorder
        radius="md"
        mb="lg"
        style={{
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
        }}
      >
        <Group justify="space-between" mb="md">
          <Box>
            <Text fw={600} size="lg" style={{ color: "#374151" }}>
              Market Intelligence
            </Text>
            <Text size="sm" c="dimmed">
              Real-time rental market analysis
            </Text>
          </Box>
          <Badge
            color="orange"
            variant="light"
            leftSection={<IconHourglass size={12} />}
          >
            Beta Preview
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {marketTrends.map((trend, index) => (
            <Paper
              key={index}
              p="lg"
              radius="md"
              style={{
                backgroundColor: "white",
                border: "1px solid #F3F4F6",
                position: "relative",
              }}
            >
              {/* Coming Soon Overlay */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  zIndex: 1,
                }}
              >
                <Stack gap="xs" align="center">
                  <IconSettings size={24} color="#6B7280" />
                  <Text size="sm" fw={500} style={{ color: "#374151" }}>
                    Data Processing
                  </Text>
                </Stack>
              </Box>

              <Box style={{ opacity: 0.3 }}>
                <Group justify="space-between">
                  <Text fw={600}>{trend.area}</Text>
                  <Badge color="gray" variant="light" size="sm">
                    {trend.priceChange}
                  </Badge>
                </Group>
                <Progress
                  value={50}
                  color="gray"
                  size="sm"
                  mt="xs"
                  style={{ backgroundColor: "#F3F4F6" }}
                />
                <Group justify="space-between" mt="xs">
                  <Text size="sm" c="dimmed">
                    Demand: {trend.demand}
                  </Text>
                  <Text size="sm" fw={600}>
                    {trend.avgPrice}
                  </Text>
                </Group>
              </Box>
            </Paper>
          ))}
        </SimpleGrid>

        <Divider my="md" />

        <Group justify="center" mt="md">
          <IconChartLine size={18} color="#6B7280" />
          <Text size="sm" c="dimmed" ta="center">
            Real-time market data integration in progress
          </Text>
        </Group>
      </Card>

      {/* Actionable Recommendations - Working Features */}
      <Card
        withBorder
        radius="md"
        mb="lg"
        style={{
          backgroundColor: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <Group justify="space-between" mb="md">
          <Box>
            <Text fw={600} size="lg" style={{ color: "#374151" }}>
              Available Now
            </Text>
            <Text size="sm" c="dimmed">
              Features you can use today
            </Text>
          </Box>
          <Badge color="green" variant="light">
            <IconChecklist size={12} style={{ marginRight: 4 }} />
            Live
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {/* Property Search */}
          <Paper
            p="lg"
            radius="md"
            style={{
              backgroundColor: "#F0F9FF",
              border: "1px solid #BAE6FD",
              borderLeft: "4px solid #0284C7",
            }}
          >
            <Group gap="md" align="flex-start">
              <ThemeIcon size={44} radius="md" color="blue" variant="light">
                <IconHome size={22} />
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text fw={600} size="md" style={{ color: "#0369A1" }}>
                  Property Search
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Browse available properties in your area
                </Text>
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  fullWidth
                  onClick={() => navigate("/listings")}
                  rightSection={<IconChevronRight size={14} />}
                >
                  Search Properties
                </Button>
              </Box>
            </Group>
          </Paper>

          {/* Application Tracking */}
          <Paper
            p="lg"
            radius="md"
            style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderLeft: "4px solid #16A34A",
            }}
          >
            <Group gap="md" align="flex-start">
              <ThemeIcon size={44} radius="md" color="green" variant="light">
                <IconCalendarStats size={22} />
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text fw={600} size="md" style={{ color: "#166534" }}>
                  Track Applications
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Monitor your rental application progress
                </Text>
                <Button
                  variant="light"
                  color="green"
                  size="sm"
                  fullWidth
                  onClick={() => navigate("/tenants/applications")}
                  rightSection={<IconChevronRight size={14} />}
                >
                  View Applications
                </Button>
              </Box>
            </Group>
          </Paper>
        </SimpleGrid>
      </Card>

      {/* Coming Soon Features */}
      <Card
        withBorder
        radius="md"
        style={{
          backgroundColor: "#FAFAFA",
          border: "1px dashed #D1D5DB",
        }}
      >
        <Center p="lg">
          <Stack gap="md" align="center" style={{ maxWidth: 600 }}>
            <ThemeIcon
              size={60}
              radius="md"
              color="gray"
              variant="light"
              style={{
                backgroundColor: "#F3F4F6",
                border: "1px solid #E5E7EB",
              }}
            >
              <IconBulb size={28} />
            </ThemeIcon>

            <Box style={{ textAlign: "center" }}>
              <Text fw={600} size="lg" style={{ color: "#1F2937" }}>
                Intelligent Features Coming Soon
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                We're building advanced AI-powered tools to help you find the
                perfect rental
              </Text>
            </Box>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" mt="md">
              <Box
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <Text size="xs" fw={600} style={{ color: "#4F46E5" }}>
                  Smart Matching
                </Text>
                <Text size="xs" c="dimmed">
                  AI property recommendations
                </Text>
              </Box>
              <Box
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <Text size="xs" fw={600} style={{ color: "#059669" }}>
                  Market Predictions
                </Text>
                <Text size="xs" c="dimmed">
                  Price & demand forecasts
                </Text>
              </Box>
              <Box
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <Text size="xs" fw={600} style={{ color: "#DC2626" }}>
                  Success Analytics
                </Text>
                <Text size="xs" c="dimmed">
                  Application success rates
                </Text>
              </Box>
            </SimpleGrid>

            <Button
              variant="subtle"
              color="gray"
              size="sm"
              mt="md"
              onClick={() => navigate("/features/roadmap")}
              rightSection={<IconChevronRight size={14} />}
            >
              View Development Roadmap
            </Button>
          </Stack>
        </Center>
      </Card>

      {/* Footer Note */}
      <Box mt="lg" pt="md" style={{ borderTop: "1px solid #F3F4F6" }}>
        <Group gap="xs" justify="center">
          <IconSparkles size={14} color="#6B7280" />
          <Text size="xs" c="dimmed" ta="center">
            Building intelligent rental tools to simplify your search experience
          </Text>
        </Group>
      </Box>
    </Card>
  );
};

export default EnhancedRecommendations;
