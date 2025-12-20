import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Text,
  SimpleGrid,
  Card,
  Group,
  Box,
} from "@mantine/core";
import { IconTarget, IconBolt, IconShieldCheck } from "@tabler/icons-react";

export const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <IconShieldCheck size={32} />,
      title: "Verified Only",
      description:
        "Every property and landlord on GetMeLeased undergoes a strict verification process to eliminate scams.",
    },
    {
      icon: <IconBolt size={32} />,
      title: "Instant Booking",
      description:
        "No more waiting days for feedback. Our system connects you with landlords in real-time.",
    },
    {
      icon: <IconTarget size={32} />,
      title: "Direct Access",
      description:
        "We cut out the middle-man stress, giving you a direct line to your next home.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* 1. Hero Section with Background Image */}
      <section
        className="relative py-28 text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.7)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <Container size="lg">
          <div className="max-w-3xl">
            <Text className="uppercase tracking-widest font-bold text-secondary mb-4">
              Who we are
            </Text>
            <h1 className="text-5xl md:text-7xl font-montserrat font-bold leading-tight mb-6">
              Simplifying <span className="text-secondary">Rent</span> for every
              Nigerian.
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
              GetMeLeased is a technology-driven marketplace designed to make
              finding and leasing properties fast, transparent, and secure.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Our Story & Bento Stats */}
      <section className="py-24 bg-white">
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80}>
            <Box>
              <h2 className="text-3xl font-montserrat font-bold text-primary mb-6">
                Our Story
              </h2>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Born out of frustration.
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                In 2024, we realized that renting a house in Nigeria felt like a
                full-time job. Between fake agents, inspection fees, and "ghost"
                listings, the process was broken.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We built GetMeLeased to bridge the gap between serious tenants
                and genuine landlords, using technology to build the trust that
                was missing.
              </p>
            </Box>

            {/* Visual Stats Grid from Image */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-3xl border-2 border-blue-100 bg-blue-50/30">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50 text-center">
                <Text className="text-4xl font-bold text-primary">10k+</Text>
                <Text className="text-gray-500 text-sm font-medium">
                  Listings
                </Text>
              </div>
              <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100 text-center">
                <Text className="text-4xl font-bold text-accent">36</Text>
                <Text className="text-gray-500 text-sm font-medium">
                  States
                </Text>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
                <Text className="text-4xl font-bold text-primary">50k+</Text>
                <Text className="text-gray-500 text-sm font-medium">
                  Active Users
                </Text>
              </div>
              <div className="bg-sky-50 p-8 rounded-2xl border border-sky-100 text-center">
                <Text className="text-4xl font-bold text-secondary">50k+</Text>
                <Text className="text-gray-500 text-sm font-medium">
                  Successful Leases
                </Text>
              </div>
            </div>
          </SimpleGrid>
        </Container>
      </section>

      {/* 3. Why Choose Us (Cards) */}
      <section className="py-24 bg-gray-50">
        <Container size="lg">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
              Why Choose Us?
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
          </div>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {values.map((v, i) => (
              <Card
                key={i}
                padding="xl"
                radius="lg"
                className="border-none shadow-sm hover:shadow-md transition-all bg-white"
              >
                <Box className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center text-primary mb-6">
                  {v.icon}
                </Box>
                <Text className="text-xl font-bold mb-3 text-primary">
                  {v.title}
                </Text>
                <Text className="text-gray-600 leading-relaxed">
                  {v.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* 4. CTA (Impactful Box) */}
      <section className="py-24 bg-white">
        <Container size="lg">
          <div className="bg-primary p-12 md:p-16 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
                Ready to find your space?
              </h2>
              <p className="text-blue-100 mb-10 text-lg leading-relaxed">
                Whether you're a landlord with properties or a tenant searching
                for a home, we've got you covered with a secure, seamless
                experience.
              </p>
              <Group justify="center" gap="lg">
                <Button
                  size="xl"
                  radius="md"
                  className="bg-secondary hover:bg-sky-600 px-10 border-none transition-transform hover:scale-105"
                  onClick={() => navigate("/properties")}
                >
                  Browse Properties
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  radius="md"
                  className="border-white text-white hover:bg-white hover:text-primary px-10 transition-all"
                  onClick={() => navigate("/auth/register?role=landlord")}
                >
                  List Property
                </Button>
              </Group>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
