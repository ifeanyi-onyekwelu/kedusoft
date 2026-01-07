import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IconArrowRight, IconShieldCheck } from "@tabler/icons-react";
import {
  Button,
  Text,
  Title,
  Container,
  Stack,
  Group,
  Image,
} from "@mantine/core";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-manrope">
      <Container size="sm">
        <Stack gap={60} align="center" className="text-center">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Stack align="center" gap="xs">
              {/* Replace 'logo.png' with your actual path */}
              <Image
                src="/images/brand/logo.png"
                alt="Letsten Logo"
                w={200}
                fallbackSrc="https://placehold.co/80x80?text=K"
              />
              <Text
                className="font-syne text-primary uppercase tracking-[0.2em] font-bold"
                size="xl"
              >
                KeduSoft
              </Text>
            </Stack>
          </motion.div>

          {/* Core Message */}
          <Stack gap="md">
            <Title
              order={1}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-sora"
            >
              Your Journey to a <br />
              <span className="text-accent">Better Home</span> Starts Here.
            </Title>
            <Text
              size="lg"
              className="text-gray-500 max-w-md mx-auto leading-relaxed"
            >
              Verified listings and seamless bookings. Experience the most
              secure property network in Nigeria.
            </Text>
          </Stack>

          {/* Primary Action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xs"
          >
            <Stack gap="sm">
              <Button
                component={Link}
                to="/onboarding/tenant/personal"
                size="xl"
                radius="md"
                fullWidth
                rightSection={<IconArrowRight size={20} />}
                className="bg-primary hover:bg-[#152a63] h-14 transition-all"
              >
                Get Started
              </Button>

              <Group justify="center" gap={6}>
                <IconShieldCheck size={14} className="text-success" />
                <Text
                  size="xs"
                  fw={600}
                  className="text-gray-500 uppercase tracking-wide"
                >
                  100% Secure & Vetted
                </Text>
              </Group>
            </Stack>
          </motion.div>

          {/* Minimal Footer Links */}
          <Group
            gap="xl"
            className="pt-8 border-t border-gray-100 w-full justify-center"
          >
            <Text
              component={Link}
              to="/about"
              size="sm"
              fw={600}
              className="text-gray-500 hover:text-primary transition-colors uppercase tracking-wider"
            >
              How it works
            </Text>
            <Text
              component={Link}
              to="/support"
              size="sm"
              fw={600}
              className="text-gray-500 hover:text-primary transition-colors uppercase tracking-wider"
            >
              Support
            </Text>
          </Group>
        </Stack>
      </Container>
    </div>
  );
}
