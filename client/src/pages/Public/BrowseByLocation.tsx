import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconSearch,
  IconMapPin,
  IconHome,
  IconBuilding,
  IconBed,
} from "@tabler/icons-react";
import {
  Button,
  TextInput,
  Select,
  Card,
  Badge,
  Group,
  Text,
  Grid,
} from "@mantine/core";

const BrowseByLocation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Popular states with more details
  const popularStates = [
    {
      name: "Lagos",
      image: "/images/houses/nigeria.jpg",
      propertyCount: 2845,
      averageRent: "₦250,000",
      description: "Nigeria's commercial capital with endless opportunities",
      region: "south-west",
    },
    {
      name: "Abuja",
      image: "/images/houses/hero.jpg",
      propertyCount: 1856,
      averageRent: "₦300,000",
      description: "Federal capital territory with modern infrastructure",
      region: "north-central",
    },
    {
      name: "Rivers",
      image: "/images/houses/street.jpg",
      propertyCount: 987,
      averageRent: "₦180,000",
      description: "Oil-rich state with beautiful waterfront properties",
      region: "south-south",
    },
    {
      name: "Enugu",
      image: "/images/houses/china.jpg",
      propertyCount: 743,
      averageRent: "₦150,000",
      description: "Coal city with rich cultural heritage",
      region: "south-east",
    },
    {
      name: "Oyo",
      image: "/images/houses/nigeria.jpg",
      propertyCount: 654,
      averageRent: "₦120,000",
      description: "Ancient city with modern developments",
      region: "south-west",
    },
    {
      name: "Kano",
      image: "/images/houses/hero.jpg",
      propertyCount: 521,
      averageRent: "₦100,000",
      description: "Northern commercial hub with affordable housing",
      region: "north-west",
    },
  ];

  // All Nigerian states
  const allStates = [
    { name: "Abia", region: "south-east", properties: 432 },
    { name: "Adamawa", region: "north-east", properties: 234 },
    { name: "Akwa Ibom", region: "south-south", properties: 567 },
    { name: "Anambra", region: "south-east", properties: 789 },
    { name: "Bauchi", region: "north-east", properties: 145 },
    { name: "Bayelsa", region: "south-south", properties: 234 },
    { name: "Benue", region: "north-central", properties: 345 },
    { name: "Borno", region: "north-east", properties: 123 },
    { name: "Cross River", region: "south-south", properties: 456 },
    { name: "Delta", region: "south-south", properties: 678 },
    { name: "Ebonyi", region: "south-east", properties: 234 },
    { name: "Edo", region: "south-south", properties: 567 },
    { name: "Ekiti", region: "south-west", properties: 234 },
    { name: "Enugu", region: "south-east", properties: 743 },
    { name: "Gombe", region: "north-east", properties: 123 },
    { name: "Imo", region: "south-east", properties: 456 },
    { name: "Jigawa", region: "north-west", properties: 123 },
    { name: "Kaduna", region: "north-west", properties: 456 },
    { name: "Kano", region: "north-west", properties: 521 },
    { name: "Katsina", region: "north-west", properties: 234 },
    { name: "Kebbi", region: "north-west", properties: 123 },
    { name: "Kogi", region: "north-central", properties: 234 },
    { name: "Kwara", region: "north-central", properties: 345 },
    { name: "Lagos", region: "south-west", properties: 2845 },
    { name: "Nasarawa", region: "north-central", properties: 234 },
    { name: "Niger", region: "north-central", properties: 345 },
    { name: "Ogun", region: "south-west", properties: 567 },
    { name: "Ondo", region: "south-west", properties: 345 },
    { name: "Osun", region: "south-west", properties: 234 },
    { name: "Oyo", region: "south-west", properties: 654 },
    { name: "Plateau", region: "north-central", properties: 345 },
    { name: "Rivers", region: "south-south", properties: 987 },
    { name: "Sokoto", region: "north-west", properties: 123 },
    { name: "Taraba", region: "north-east", properties: 145 },
    { name: "Yobe", region: "north-east", properties: 123 },
    { name: "Zamfara", region: "north-west", properties: 123 },
    { name: "Abuja", region: "north-central", properties: 1856 },
  ];

  // Major cities
  const majorCities = [
    { name: "Lagos", state: "Lagos", properties: 2845 },
    { name: "Abuja", state: "FCT", properties: 1856 },
    { name: "Port Harcourt", state: "Rivers", properties: 987 },
    { name: "Ibadan", state: "Oyo", properties: 743 },
    { name: "Kano", state: "Kano", properties: 654 },
    { name: "Enugu", state: "Enugu", properties: 521 },
    { name: "Aba", state: "Abia", properties: 432 },
    { name: "Onitsha", state: "Anambra", properties: 387 },
    { name: "Warri", state: "Delta", properties: 324 },
    { name: "Kaduna", state: "Kaduna", properties: 298 },
    { name: "Jos", state: "Plateau", properties: 267 },
    { name: "Ilorin", state: "Kwara", properties: 234 },
  ];

  // Property types
  const propertyTypes = [
    {
      type: "Apartments",
      description: "Modern apartments in city centers",
      icon: IconBuilding,
      color: "blue",
    },
    {
      type: "Houses",
      description: "Family homes in residential areas",
      icon: IconHome,
      color: "green",
    },
    {
      type: "Duplex",
      description: "Spacious two-story homes",
      icon: IconBuilding,
      color: "violet",
    },
    {
      type: "Self-Contain",
      description: "Affordable single-room units",
      icon: IconBed,
      color: "orange",
    },
  ];

  // Filter states based on search and region
  const filteredStates = allStates.filter((state) => {
    const matchesSearch = state.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === "all" || state.region.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/sunset.jpg ')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Home Anywhere in Nigeria
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Browse properties by state and discover your next home in
              Nigeria's most vibrant locations
            </p>
            <div className="max-w-md mx-auto">
              <TextInput
                placeholder="Search by state or city..."
                size="lg"
                leftSection={<IconSearch size={20} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                className="w-full"
                styles={{
                  input: {
                    backgroundColor: "white",
                    border: "none",
                    fontSize: "16px",
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular States Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular States
            </h2>
            <p className="text-gray-600 text-lg">
              Most searched locations with high property availability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularStates.map((state, index) => (
              <motion.div
                key={state.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Link
                  to={`/listings?location=${encodeURIComponent(state.name)}`}
                  className="group block"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                    <div className="relative h-48 mb-4">
                      <img
                        src={state.image}
                        alt={state.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-md" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{state.name}</h3>
                        <p className="text-sm text-gray-200">
                          {state.propertyCount} properties
                        </p>
                      </div>
                      <Badge
                        className="absolute top-4 right-4"
                        color="blue"
                        variant="filled"
                      >
                        Popular
                      </Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4 text-sm">
                        {state.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500">
                            Avg. Rent
                          </span>
                          <div className="font-semibold text-blue-600 text-lg">
                            {state.averageRent}
                          </div>
                        </div>
                        <IconArrowRight
                          size={20}
                          className="text-gray-400 group-hover:text-blue-600 transition-colors"
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All States Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Nigerian States
            </h2>
            <p className="text-gray-600">
              Browse properties in any of Nigeria's 36 states + FCT
            </p>
          </div>

          {/* Filter Controls */}
          <Card className="mb-8 p-6">
            <Group gap="md" className="flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <TextInput
                  placeholder="Search states..."
                  leftSection={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                />
              </div>
              <Select
                placeholder="Select region"
                value={selectedRegion}
                onChange={(value) => setSelectedRegion(value || "all")}
                data={[
                  { value: "all", label: "All Regions" },
                  { value: "north", label: "Northern States" },
                  { value: "south", label: "Southern States" },
                  { value: "east", label: "Eastern States" },
                  { value: "west", label: "Western States" },
                ]}
                className="min-w-[150px]"
              />
            </Group>
          </Card>

          {/* States Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredStates.map((state) => (
              <Link
                key={state.name}
                to={`/listings?location=${encodeURIComponent(state.name)}`}
                className="group"
              >
                <Card className="text-center hover:shadow-md transition-all duration-200 group-hover:scale-105">
                  <div className="p-4">
                    <IconMapPin
                      size={24}
                      className="mx-auto text-gray-400 group-hover:text-blue-600 mb-2"
                    />
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                      {state.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {state.properties} properties
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Major Cities Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Major Cities
            </h2>
            <p className="text-gray-600">
              Explore properties in Nigeria's largest cities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {majorCities.map((city) => (
              <Link
                key={city.name}
                to={`/listings?location=${encodeURIComponent(city.name)}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <div className="p-6">
                    <Group justify="space-between" mb="xs">
                      <Text
                        size="lg"
                        fw={600}
                        className="group-hover:text-blue-600"
                      >
                        {city.name}
                      </Text>
                      <IconArrowRight
                        size={16}
                        className="text-gray-400 group-hover:text-blue-600"
                      />
                    </Group>
                    <Text size="sm" c="dimmed" mb="md">
                      {city.state} State
                    </Text>
                    <Badge color="blue" variant="light" size="sm">
                      {city.properties} properties
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Property Types Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Browse by Property Type
              </h2>
              <p className="text-gray-600">
                Find the perfect property type for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {propertyTypes.map((type) => (
                <Link
                  key={type.type}
                  to={`/listings?property_type=${type.type.toLowerCase()}`}
                  className="group"
                >
                  <Card className="p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group-hover:scale-105 text-center">
                    <type.icon
                      size={32}
                      className={`mx-auto mb-4 text-${type.color}-500 group-hover:text-${type.color}-600`}
                    />
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                      {type.type}
                    </h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseByLocation;
