import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Text, Group, Box, SimpleGrid } from "@mantine/core";
import {
  IconCircleCheck,
  IconUsers,
  IconHome,
  IconHeadset,
} from "@tabler/icons-react";

export const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tenants");

  const tenantSteps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up for free in minutes with just your email and basic information.",
      details: ["Enter basic info", "Verify email", "Set preferences"],
    },
    {
      number: "02",
      title: "Search Properties",
      description:
        "Browse thousands of verified listings with powerful search filters.",
      details: ["Filter by price/location", "View HD photos", "Save favorites"],
    },
    {
      number: "03",
      title: "Schedule Viewings",
      description: "Book property viewings at times convenient for you.",
      details: ["Select slots", "Instant confirmation", "Virtual options"],
    },
    {
      number: "04",
      title: "Submit Application",
      description: "Apply online with our secure document upload system.",
      details: ["Fill application", "Upload ID/Income", "Track status"],
    },
  ];

  const landlordSteps = [
    {
      number: "01",
      title: "Register Account",
      description: "Register as a landlord and verify your identity.",
      details: ["Business information", "Verify ownership", "Set payments"],
    },
    {
      number: "02",
      title: "List Property",
      description: "Add your property with photos, details, and pricing.",
      details: ["Upload photos", "Set rental terms", "Verification check"],
    },
    {
      number: "03",
      title: "Screen Tenants",
      description: "Use our tools to find the best tenant for your property.",
      details: ["Review applications", "Background checks", "Approve online"],
    },
    {
      number: "04",
      title: "Collect Rent",
      description: "Manage your property and receive payments automatically.",
      details: [
        "Digital signatures",
        "Auto-rent collection",
        "Financial reports",
      ],
    },
  ];

  const activeSteps = activeTab === "tenants" ? tenantSteps : landlordSteps;

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* 1. Solid Hero Section (No Gradients) */}
      <section className="bg-primary py-24 text-white">
        <Container size="lg">
          <div className="max-w-3xl">
            <Text className="uppercase tracking-widest font-bold text-secondary mb-4">
              Step-by-Step Guide
            </Text>
            <h1 className="text-5xl md:text-7xl font-montserrat font-bold leading-tight mb-6">
              How it <span className="text-secondary">Works.</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
              From browsing to moving in, we've simplified the rental process to
              be fast, transparent, and completely digital.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Sticky Toggle Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <Container size="lg">
          <div className="flex justify-center md:justify-start gap-8">
            <button
              onClick={() => setActiveTab("tenants")}
              className={`py-6 px-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${
                activeTab === "tenants"
                  ? "border-secondary text-primary"
                  : "border-transparent text-gray-400"
              }`}
            >
              For Tenants
            </button>
            <button
              onClick={() => setActiveTab("landlords")}
              className={`py-6 px-4 font-bold text-sm uppercase tracking-wider transition-all border-b-4 ${
                activeTab === "landlords"
                  ? "border-secondary text-primary"
                  : "border-transparent text-gray-400"
              }`}
            >
              For Landlords
            </button>
          </div>
        </Container>
      </div>

      {/* 3. Steps Section (Modern Bento/List Style) */}
      <section className="py-20">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {activeSteps.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-xl font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-4">
                    {step.description}
                  </p>
                  <ul className="grid grid-cols-1 gap-2">
                    {step.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-500 font-medium"
                      >
                        <IconCircleCheck size={18} className="text-secondary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Feature Highlights */}
      <section className="py-20 bg-gray-50">
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            <Box className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <IconUsers size={40} className="text-primary mb-4" />
              <Text className="text-xl font-bold text-primary mb-2">
                100% Verified
              </Text>
              <Text className="text-gray-600">
                All properties and users undergo strict identity verification.
              </Text>
            </Box>
            <Box className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <IconHome size={40} className="text-secondary mb-4" />
              <Text className="text-xl font-bold text-primary mb-2">
                Fast Process
              </Text>
              <Text className="text-gray-600">
                Cut out middle-man delays with our direct application system.
              </Text>
            </Box>
            <Box className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <IconHeadset size={40} className="text-accent mb-4" />
              <Text className="text-xl font-bold text-primary mb-2">
                24/7 Support
              </Text>
              <Text className="text-gray-600">
                Our dedicated team is always here to help with your leasing
                journey.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24">
        <Container size="lg">
          <div className="bg-primary p-12 md:p-16 rounded-[3rem] text-white text-center">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
              Join thousands of users simplifying their property experience in
              Nigeria today.
            </p>
            <Group justify="center" gap="md">
              <Button
                size="xl"
                className="bg-secondary hover:bg-sky-600 px-10 border-none"
                onClick={() =>
                  navigate(
                    activeTab === "tenants"
                      ? "/properties"
                      : "/auth/register?role=landlord"
                  )
                }
              >
                {activeTab === "tenants"
                  ? "Find a Property"
                  : "List Your Property"}
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-primary px-10"
                onClick={() => navigate("/contact")}
              >
                Contact Support
              </Button>
            </Group>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HowItWorks;
