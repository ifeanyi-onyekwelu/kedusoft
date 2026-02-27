import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Text,
  Title,
  SimpleGrid,
  Card,
  ThemeIcon,
  List,
  Badge,
  Paper,
  Stack,
  Group,
  Divider,
  Box,
} from "@mantine/core";
import {
  IconUsers,
  IconReceipt2,
  IconTools,
  IconFileText,
  IconChartBar,
  IconScale,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";

export const PropertyManagement = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: IconUsers,
      title: "Tenant Screening",
      description:
        "Rigorous background checks and credit verification to secure reliable, long-term tenants.",
    },
    {
      icon: IconReceipt2,
      title: "Rent Collection",
      description:
        "Automated systems ensuring timely payments and professional handling of late accounts.",
    },
    {
      icon: IconTools,
      title: "Maintenance",
      description:
        "Round-the-clock maintenance management with a network of vetted, licensed contractors.",
    },
    {
      icon: IconFileText,
      title: "Lease Management",
      description:
        "End-to-end digital documentation including drafting, signing, and compliance renewals.",
    },
    {
      icon: IconChartBar,
      title: "Financial Analytics",
      description:
        "Transparent, real-time reporting on property performance, expenses, and cash flow.",
    },
    {
      icon: IconScale,
      title: "Legal Compliance",
      description:
        "Mitigate risk with expert oversight on local housing laws and safety regulations.",
    },
  ];

  const packages = [
    {
      name: "Standard",
      price: "5%",
      period: "monthly revenue",
      features: [
        "Tenant screening",
        "Rent collection",
        "Basic maintenance",
        "Financial reports",
        "Online portal",
      ],
      recommended: false,
    },
    {
      name: "Professional",
      price: "8%",
      period: "monthly revenue",
      features: [
        "Everything in Standard",
        "Priority response",
        "Lease drafting",
        "Annual inspections",
        "Legal support",
        "24/7 support",
      ],
      recommended: true,
    },
    {
      name: "Elite",
      price: "10%",
      period: "monthly revenue",
      features: [
        "Everything in Professional",
        "Marketing optimization",
        "Value-add consulting",
        "Tax assistance",
        "Account manager",
        "Vacancy protection",
      ],
      recommended: false,
    },
  ];

  return (
    <Box
      component="main"
      style={{
        backgroundColor: "var(--color-gray-50)",
        fontFamily: "var(--font-manrope)",
      }}
    >
      {/* Hero Section */}
      <Box
        py={120}
        style={{
          backgroundColor: "var(--color-primary)",
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.9)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "4px solid var(--color-secondary)",
        }}
      >
        <Container size="xl">
          <Stack gap="xl">
            <Badge
              variant="outline"
              color="var(--color-secondary)"
              size="lg"
              radius="sm"
              style={{
                fontFamily: "var(--font-urbanist)",
                border: "1px solid var(--color-secondary)",
                color: "white",
              }}
            >
              Institutional Management
            </Badge>
            <Box style={{ maxWidth: 800 }}>
              <Title
                order={1}
                className="text-white tracking-tighter"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  lineHeight: 1.1,
                }}
              >
                High-Performance <br />
                <span style={{ color: "var(--color-secondary)" }}>
                  Property Operations.
                </span>
              </Title>
              <Text
                size="xl"
                mt="xl"
                style={{ color: "var(--color-gray-200)", maxWidth: 600 }}
              >
                Maximizing asset value through rigorous tenant vetting,
                proactive maintenance, and transparent financial reporting.
              </Text>
            </Box>
            <Group mt="lg">
              <Button
                size="xl"
                radius="0"
                style={{
                  backgroundColor: "var(--color-secondary)",
                  fontFamily: "var(--font-urbanist)",
                }}
                onClick={() => navigate("/auth/register?role=landlord")}
              >
                Partner With Us
              </Button>
              <Button
                size="xl"
                radius="0"
                variant="outline"
                style={{
                  color: "white",
                  borderColor: "white",
                  fontFamily: "var(--font-urbanist)",
                }}
              >
                Our Process
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Services Section */}
      <Container size="xl" py={100}>
        <Group justify="space-between" align="flex-end" mb={60}>
          <Box>
            <Text
              fw={700}
              style={{
                color: "var(--color-secondary)",
                fontFamily: "var(--font-urbanist)",
                letterSpacing: 2,
              }}
            >
              CORE CAPABILITIES
            </Text>
            <Title
              order={2}
              mt="sm"
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: "2.5rem",
                color: "var(--color-gray-900)",
              }}
            >
              Full-Suite Management
            </Title>
          </Box>
          <Text c="dimmed" style={{ maxWidth: 400 }}>
            We handle the complexities of property ownership so you can focus on
            expanding your portfolio.
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={30}>
          {services.map((service, index) => (
            <Card
              key={index}
              p={40}
              radius="0"
              style={{
                border: "1px solid var(--color-gray-200)",
                backgroundColor: "white",
                transition: "transform 0.2s ease",
              }}
            >
              <ThemeIcon
                size={50}
                radius="0"
                style={{ backgroundColor: "var(--color-primary)" }}
                mb="xl"
              >
                <service.icon size={26} stroke={1.5} />
              </ThemeIcon>
              <Title
                order={4}
                mb="md"
                style={{
                  fontFamily: "var(--font-sora)",
                  color: "var(--color-primary)",
                }}
              >
                {service.title}
              </Title>
              <Text c="dimmed" size="sm" style={{ lineHeight: 1.7 }}>
                {service.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Pricing Section */}
      <Box style={{ backgroundColor: "var(--color-gray-100)" }} py={100}>
        <Container size="xl">
          <Stack align="center" mb={60}>
            <Title
              order={2}
              style={{ fontFamily: "var(--font-syne)", fontSize: "2.5rem" }}
            >
              Management Tiers
            </Title>
            <Divider w={80} size="xl" color="var(--color-accent)" />
          </Stack>

          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            spacing={0}
            style={{ border: "1px solid var(--color-gray-200)" }}
          >
            {packages.map((pkg, index) => (
              <Paper
                key={index}
                p={50}
                radius="0"
                style={{
                  backgroundColor: pkg.recommended ? "white" : "transparent",
                  border: pkg.recommended
                    ? "2px solid var(--color-primary)"
                    : "none",
                  zIndex: pkg.recommended ? 2 : 1,
                  position: "relative",
                }}
              >
                {pkg.recommended && (
                  <Badge
                    style={{
                      backgroundColor: "var(--color-accent)",
                      position: "absolute",
                      top: 20,
                      right: 20,
                    }}
                    radius="0"
                  >
                    Most Popular
                  </Badge>
                )}

                <Text
                  fw={800}
                  tt="uppercase"
                  lts={1}
                  c="dimmed"
                  size="xs"
                  mb="sm"
                  style={{ fontFamily: "var(--font-urbanist)" }}
                >
                  {pkg.name}
                </Text>
                <Group align="flex-end" gap={5} mb="xl">
                  <Text
                    style={{
                      fontSize: "4rem",
                      fontWeight: 900,
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-oswald)",
                      lineHeight: 1,
                    }}
                  >
                    {pkg.price}
                  </Text>
                  <Text c="dimmed" mb={10} fw={600}>
                    {pkg.period}
                  </Text>
                </Group>

                <Divider mb="xl" color="var(--color-gray-200)" />

                <List
                  spacing="md"
                  size="sm"
                  mb={40}
                  icon={
                    <ThemeIcon
                      color="var(--color-success)"
                      size={18}
                      radius="xl"
                    >
                      <IconCheck size={12} stroke={4} />
                    </ThemeIcon>
                  }
                >
                  {pkg.features.map((f, i) => (
                    <List.Item
                      key={i}
                      style={{
                        color: "var(--color-gray-900)",
                        fontWeight: 500,
                      }}
                    >
                      {f}
                    </List.Item>
                  ))}
                </List>

                <Button
                  fullWidth
                  size="lg"
                  radius="0"
                  variant={pkg.recommended ? "filled" : "outline"}
                  style={{
                    backgroundColor: pkg.recommended
                      ? "var(--color-primary)"
                      : "transparent",
                    borderColor: "var(--color-primary)",
                    color: pkg.recommended ? "white" : "var(--color-primary)",
                    fontFamily: "var(--font-urbanist)",
                  }}
                  rightSection={<IconArrowRight size={16} />}
                  onClick={() => navigate("/auth/register?role=landlord")}
                >
                  Select Plan
                </Button>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={80} style={{ borderTop: "1px solid var(--color-gray-200)" }}>
        <Container size="md">
          <Stack align="center" style={{ textAlign: "center" }}>
            <Title
              order={2}
              style={{
                fontFamily: "var(--font-syne)",
                color: "var(--color-primary)",
              }}
            >
              Ready for Worry-Free Ownership?
            </Title>
            <Text size="lg" c="dimmed" mb="xl">
              Contact our specialist team today to receive a custom proposal for
              your portfolio.
            </Text>
            <Group>
              <Button
                size="xl"
                radius="0"
                style={{
                  backgroundColor: "var(--color-accent)",
                  fontFamily: "var(--font-urbanist)",
                }}
              >
                Schedule Consultation
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default PropertyManagement;
