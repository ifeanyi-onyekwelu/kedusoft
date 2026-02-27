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
  ThemeIcon,
  Paper,
  Alert,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import {
  IconClock,
  IconChevronRight,
  IconPercentage,
  IconBrain,
  IconSparkles,
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

  const insights = [
    {
      id: 1,
      title: "Application Success",
      value: "Coming Soon",
      description: "Track your approval rates",
      icon: IconPercentage,
      color: "indigo",
    },
    {
      id: 2,
      title: "Avg. Response",
      value: "Coming Soon",
      description: "Monitor landlord feedback",
      icon: IconClock,
      color: "teal",
    },
    {
      id: 3,
      title: "Market Insight",
      value: "Coming Soon",
      description: "Property competition levels",
      icon: IconUsers,
      color: "red",
    },
  ];

  return (
    <Box>
      {/* HEADER SECTION */}
      <Paper withBorder p="xl" radius="lg" mb="md" bg="white">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Group gap="xs" mb={4}>
                <ThemeIcon size={34} radius="md" color="blue" variant="light">
                  <IconBrain size={20} />
                </ThemeIcon>
                <Title order={3} fw={800} style={{ letterSpacing: "-0.5px" }}>
                  Intelligence Center
                </Title>
              </Group>
              <Text size="sm" c="dimmed" fw={500}>
                Data-driven insights to accelerate your rental journey.
              </Text>
            </Box>
            <Badge size="lg" radius="sm" variant="filled" color="blue">
              V2.0 Pipeline
            </Badge>
          </Group>

          <Alert
            color="blue"
            radius="md"
            variant="light"
            icon={<IconSparkles size={18} />}
          >
            <Text size="sm" fw={500}>
              We are currently training our AI models on local market data.
              Personalized success metrics will appear here once the analysis is
              complete.
            </Text>
          </Alert>
        </Stack>
      </Paper>

      {/* ANALYTICS GRID */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="md">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <Paper
              key={insight.id}
              withBorder
              p="xl"
              radius="lg"
              bg="white"
              style={{
                transition: "transform 0.2s ease",
                borderBottom: `3px solid var(--mantine-color-${insight.color}-filled)`,
              }}
            >
              <Stack align="center" gap="sm">
                <ThemeIcon
                  size={48}
                  radius="xl"
                  color={insight.color}
                  variant="light"
                >
                  <Icon size={24} />
                </ThemeIcon>
                <Text
                  fw={700}
                  size="sm"
                  c="dimmed"
                  ta="center"
                  tt="uppercase"
                  lts={1}
                >
                  {insight.title}
                </Text>
                <Title order={2} fw={800} c={insight.color}>
                  {insight.value}
                </Title>
                <Text size="xs" c="dimmed" ta="center">
                  {insight.description}
                </Text>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>

      {/* MARKET TRENDS & ACTIVE TOOLS */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
        {/* Active Features */}
        <Paper withBorder p="xl" radius="lg" bg="white">
          <Group justify="space-between" mb="xl">
            <Title order={4} fw={700}>
              Active Tools
            </Title>
            <Badge color="green" variant="dot" size="sm">
              Available Now
            </Badge>
          </Group>

          <Stack gap="md">
            <UnstyledButton
              onClick={() => navigate("/listings")}
              p="md"
              style={{ borderRadius: "8px", border: "1px solid #f1f3f5" }}
              className="hover-bg-gray"
            >
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="blue" variant="light" size="lg">
                    <IconHome size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600} size="sm">
                      Property Search
                    </Text>
                    <Text size="xs" c="dimmed">
                      Find your next home
                    </Text>
                  </Box>
                </Group>
                <IconChevronRight size={16} color="gray" />
              </Group>
            </UnstyledButton>

            <UnstyledButton
              onClick={() => navigate("/tenants/applications")}
              p="md"
              style={{ borderRadius: "8px", border: "1px solid #f1f3f5" }}
              className="hover-bg-gray"
            >
              <Group justify="space-between">
                <Group>
                  <ThemeIcon color="green" variant="light" size="lg">
                    <IconCalendarStats size={18} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600} size="sm">
                      Track Applications
                    </Text>
                    <Text size="xs" c="dimmed">
                      Check status updates
                    </Text>
                  </Box>
                </Group>
                <IconChevronRight size={16} color="gray" />
              </Group>
            </UnstyledButton>
          </Stack>
        </Paper>

        {/* Market Intelligence */}
        <Paper
          withBorder
          p="xl"
          radius="lg"
          bg="gray.0"
          style={{ borderStyle: "dashed" }}
        >
          <Group justify="space-between" mb="xl">
            <Title order={4} fw={700} c="gray.7">
              Market Pulse
            </Title>
            <IconSettings size={20} color="gray" />
          </Group>

          <Stack align="center" justify="center" style={{ minHeight: 120 }}>
            <ThemeIcon size={40} radius="md" color="gray" variant="light">
              <IconChartLine size={20} />
            </ThemeIcon>
            <Text fw={600} size="sm" mt="sm">
              Data Integration Pending
            </Text>
            <Text size="xs" c="dimmed" ta="center" px="xl">
              Real-time pricing data for your selected regions is being indexed.
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>

      {/* FOOTER ROADMAP */}
      <Paper withBorder p="md" radius="lg" bg="white">
        <Group justify="center" gap="xl">
          <Group gap="xs">
            <IconBulb size={16} color="orange" />
            <Text size="xs" fw={600} c="dimmed">
              Smart Matching
            </Text>
          </Group>
          <Divider orientation="vertical" />
          <Group gap="xs">
            <IconChecklist size={16} color="teal" />
            <Text size="xs" fw={600} c="dimmed">
              Predictive Analytics
            </Text>
          </Group>
          <Button
            variant="subtle"
            size="compact-xs"
            color="blue"
            rightSection={<IconChevronRight size={14} />}
            onClick={() => navigate("/features/roadmap")}
          >
            Full Roadmap
          </Button>
        </Group>
      </Paper>
    </Box>
  );
};

export default EnhancedRecommendations;
