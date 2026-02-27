import { Group, Text, Box, Title, Container } from "@mantine/core";
import {
  IconShieldLock,
  IconScale,
  IconHeadphones,
  IconClock24,
  IconChartBar,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";

function Conveniences() {
  const features = [
    {
      icon: <IconShieldLock size={44} stroke={1.5} />,
      title: "Bank-Level Security",
      description:
        "Military-grade encryption protects all your data and transactions",
    },
    {
      icon: <IconScale size={44} stroke={1.5} />,
      title: "Legal Assistance",
      description: "Dedicated legal team to handle all contract matters",
    },
    {
      icon: <IconHeadphones size={44} stroke={1.5} />,
      title: "24/7 Support",
      description: "Always available customer success team",
    },
    {
      icon: <IconChartBar size={44} stroke={1.5} />,
      title: "Market Insights",
      description: "Real-time analytics and neighborhood reports",
    },
    {
      icon: <IconBuildingSkyscraper size={44} stroke={1.5} />,
      title: "Virtual Tours",
      description: "Immersive 3D property walkthroughs",
    },
    {
      icon: <IconClock24 size={44} stroke={1.5} />,
      title: "Fast Processing",
      description: "Accelerated approval and closing timelines",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <Container size="xl">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="md:w-1/2 space-y-6">
            <Title
              order={2}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              Experience the <span className="text-primary">Difference</span>{" "}
              with Our Platform
            </Title>
            <Text size="lg" className="text-gray-600">
              We've reimagined real estate technology to deliver unparalleled
              convenience at every step of your property journey.
            </Text>
          </div>
          <div className="md:w-2/5 flex items-center">
            <Text size="md" className="text-gray-700">
              Our platform combines cutting-edge technology with deep industry
              expertise to eliminate friction in property transactions. From
              discovery to closing, we've optimized every touchpoint.
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Box
              key={index}
              className="group p-8 rounded-xl bg-white border border-gray-200 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-2"
            >
              <div className="mb-6 p-4 bg-primary/10 text-primary rounded-lg w-max group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <Title
                order={3}
                className="text-xl font-semibold mb-3 text-gray-900"
              >
                {feature.title}
              </Title>
              <Text className="text-gray-600">{feature.description}</Text>
            </Box>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Conveniences;
