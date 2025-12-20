import {
  TextInput,
  Select,
  Button,
  Text,
  Container,
  Group,
  SegmentedControl,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconMapPin,
  IconStars,
  IconCash,
  IconHome,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Variants } from "framer-motion";

function Hero() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("rent"); // rent, sale, or shortlet
  const [category, setCategory] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const searchListings = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (category) params.append("category", category.toLowerCase());
    if (budget) params.append("budget", budget);

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background & Overlays */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
        style={{
          backgroundImage: `url('/images/houses/luxury-1.jpg')`,
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#05110E]/60 via-[#05110E]/40 to-[#05110E]/90" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full z-10" />

      <Container size="lg" className="relative z-20 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Top Badge */}
          <motion.div
            variants={containerVariants}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <IconStars size={16} className="text-emerald-300" />
              <span className="text-white text-xs font-semibold uppercase tracking-widest">
                Premium Properties Only
              </span>
            </div>
          </motion.div>

          {/* Hero Text */}
          <motion.div variants={containerVariants} className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none font-manrope">
              DREAM DEEPER. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                LIVE BETTER.
              </span>
            </h1>
          </motion.div>

          {/* Floating Search Bar Container */}
          <motion.div
            variants={containerVariants}
            className="w-full max-w-5xl mx-auto mt-12"
          >
            {/* Transaction Type Selector (Rent/Sale/Shortlet) */}
            <Group justify="center" mb="lg">
              <SegmentedControl
                value={type}
                onChange={setType}
                data={[
                  { label: "For Rent", value: "rent" },
                  { label: "For Sale", value: "sale" },
                  { label: "Shortlet", value: "shortlet" },
                ]}
                radius="xl"
                size="md"
                className="bg-white/10 backdrop-blur-md border border-white/10"
                styles={{
                  root: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  indicator: { backgroundColor: "#fb7185" }, // emerald-500
                  label: { color: "white", fontWeight: 600 },
                }}
              />
            </Group>

            <div className="bg-white/10 p-3 rounded-[3rem] border border-white/20 backdrop-blur-2xl shadow-2xl">
              <div className="bg-white rounded-[2.5rem] p-2 md:p-3 flex flex-col lg:flex-row items-center gap-2">
                {/* 1. Location Input */}
                <TextInput
                  placeholder="Location"
                  variant="unstyled"
                  leftSection={
                    <IconMapPin size={20} className="text-emerald-600 ml-2" />
                  }
                  className="w-full lg:flex-1 px-4"
                  styles={{
                    input: {
                      height: "50px",
                      fontSize: "16px",
                      fontWeight: 500,
                    },
                  }}
                  value={location}
                  onChange={(e) => setLocation(e.currentTarget.value)}
                />

                <div className="hidden lg:block w-[1px] h-8 bg-gray-200" />

                {/* 2. Category Select (Apartment, Duplex, etc) */}
                <Select
                  placeholder="Category"
                  variant="unstyled"
                  leftSection={
                    <IconHome size={20} className="text-emerald-600 ml-2" />
                  }
                  data={["Apartment", "Duplex", "Penthouse", "Studio", "Villa"]}
                  className="w-full lg:w-44 px-4"
                  styles={{ input: { height: "50px", fontWeight: 500 } }}
                  value={category}
                  onChange={setCategory}
                  clearable
                />

                <div className="hidden lg:block w-[1px] h-8 bg-gray-200" />

                {/* 3. Budget Select */}
                <Select
                  placeholder="Budget"
                  variant="unstyled"
                  leftSection={
                    <IconCash size={20} className="text-emerald-600 ml-2" />
                  }
                  data={[
                    { label: "Under ₦1M", value: "0-1000000" },
                    { label: "₦1M - ₦5M", value: "1000000-5000000" },
                    { label: "₦5M - ₦10M", value: "5000000-10000000" },
                    { label: "₦10M+", value: "10000000-999999999" },
                  ]}
                  className="w-full lg:w-48 px-4"
                  styles={{ input: { height: "50px", fontWeight: 500 } }}
                  value={budget}
                  onChange={setBudget}
                  clearable
                />

                {/* Search Button */}
                <Button
                  size="xl"
                  radius="xl"
                  className="w-full lg:w-auto bg-[#05110E] hover:bg-emerald-800 text-white px-10 h-[56px] transition-all"
                  leftSection={<IconSearch size={20} />}
                  onClick={searchListings}
                >
                  Explore
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}

export default Hero;
