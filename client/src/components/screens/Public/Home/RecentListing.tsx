import { motion } from "framer-motion";
import { Carousel } from "@mantine/carousel";
import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import PropertyCard from "../../../shared/public/PropertyCard";
import classes from "./Popular.module.css";
import { useUserState } from "../../../../hooks/useUserState";
import "@mantine/carousel/styles.css";

const properties: Property[] = [
  {
    id: "prop-001",
    name: "Luxury Apartment in Victoria Island",
    description:
      "A modern luxury apartment with stunning views and high-end finishes",
    bedrooms: 3,
    bathrooms: 2,
    parking_space: 2,
    furnished: "fully",
    pets: "allowed",
    kitchens: 1,
    floors_no: 1,
    size_sqft: 1800,
    year_built: 2018,
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    address: "123 Ocean View Road",
    street: "Ocean View Road",
    closest_landmark: "Eko Hotel",
    city: "Lagos",
    state: "Lagos",
    zipcode: 101241,
    payment_structure: "monthly",
    rent_amount: 1500000,
    available_from: "2023-11-01",
    minimum_lease_duration: "12 months",
    service_charge: 50000,
    security_deposit: 1500000,
    is_available: true,
    verification_status: "verified",
    flagged: false,
    tenant_id: "tenant-001",
    category: {
      id: "cat-001",
      name: "Apartment",
    },
    landlord: {
      id: "landlord-001",
      firstName: "James",
      lastName: "Smith",
      phone_number: "+2348012345678",
      email: "james.smith@example.com",
      profile_picture: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    reviews: [
      {
        review_id: 1,
        rating: 4.8,
        feedback: "Great apartment with amazing amenities",
        date: "2023-05-15",
        user: {
          id: "user-001",
          firstName: "Sarah",
          lastName: "Johnson",
          profile_picture: "https://randomuser.me/api/portraits/women/44.jpg",
        },
      },
      {
        review_id: 2,
        rating: 4.9,
        feedback: "The location is perfect and the landlord is very responsive",
        date: "2023-06-20",
        user: {
          id: "user-002",
          firstName: "Michael",
          lastName: "Brown",
          profile_picture: "https://randomuser.me/api/portraits/men/22.jpg",
        },
      },
    ],
  },
  {
    id: "prop-002",
    name: "Modern Duplex in Lekki Phase 1",
    description:
      "Spacious duplex with contemporary design and ample natural light",
    bedrooms: 4,
    bathrooms: 3,
    parking_space: 3,
    furnished: "semi",
    pets: "case-by-case",
    kitchens: 1,
    floors_no: 2,
    size_sqft: 3200,
    year_built: 2020,
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    address: "45 Admiralty Way",
    street: "Admiralty Way",
    closest_landmark: "Lekki Mall",
    city: "Lagos",
    state: "Lagos",
    zipcode: 106104,
    payment_structure: "annually",
    rent_amount: 25000000,
    available_from: "2023-12-01",
    minimum_lease_duration: "24 months",
    service_charge: 75000,
    security_deposit: 2500000,
    is_available: true,
    verification_status: "verified",
    flagged: false,
    tenant_id: "tenant-002",
    category: {
      id: "cat-002",
      name: "Duplex",
    },
    landlord: {
      id: "landlord-002",
      firstName: "Adeola",
      lastName: "Williams",
      phone_number: "+2348098765432",
      email: "adeola.w@example.com",
      profile_picture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    reviews: [
      {
        review_id: 3,
        rating: 4.9,
        feedback: "Absolutely stunning property with top-notch finishes",
        date: "2023-04-10",
        user: {
          id: "user-003",
          firstName: "David",
          lastName: "Miller",
          profile_picture: "https://randomuser.me/api/portraits/men/75.jpg",
        },
      },
    ],
  },
  {
    id: "prop-002",
    name: "Modern Duplex in Lekki Phase 1",
    description:
      "Spacious duplex with contemporary design and ample natural light",
    bedrooms: 4,
    bathrooms: 3,
    parking_space: 3,
    furnished: "semi",
    pets: "case-by-case",
    kitchens: 1,
    floors_no: 2,
    size_sqft: 3200,
    year_built: 2020,
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    address: "45 Admiralty Way",
    street: "Admiralty Way",
    closest_landmark: "Lekki Mall",
    city: "Lagos",
    state: "Lagos",
    zipcode: 106104,
    payment_structure: "annually",
    rent_amount: 25000000,
    available_from: "2023-12-01",
    minimum_lease_duration: "24 months",
    service_charge: 75000,
    security_deposit: 2500000,
    is_available: true,
    verification_status: "verified",
    flagged: false,
    tenant_id: "tenant-002",
    category: {
      id: "cat-002",
      name: "Duplex",
    },
    landlord: {
      id: "landlord-002",
      firstName: "Adeola",
      lastName: "Williams",
      phone_number: "+2348098765432",
      email: "adeola.w@example.com",
      profile_picture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    reviews: [
      {
        review_id: 3,
        rating: 4.9,
        feedback: "Absolutely stunning property with top-notch finishes",
        date: "2023-04-10",
        user: {
          id: "user-003",
          firstName: "David",
          lastName: "Miller",
          profile_picture: "https://randomuser.me/api/portraits/men/75.jpg",
        },
      },
    ],
  },
  {
    id: "prop-002",
    name: "Modern Duplex in Lekki Phase 1",
    description:
      "Spacious duplex with contemporary design and ample natural light",
    bedrooms: 4,
    bathrooms: 3,
    parking_space: 3,
    furnished: "semi",
    pets: "case-by-case",
    kitchens: 1,
    floors_no: 2,
    size_sqft: 3200,
    year_built: 2020,
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    address: "45 Admiralty Way",
    street: "Admiralty Way",
    closest_landmark: "Lekki Mall",
    city: "Lagos",
    state: "Lagos",
    zipcode: 106104,
    payment_structure: "annually",
    rent_amount: 25000000,
    available_from: "2023-12-01",
    minimum_lease_duration: "24 months",
    service_charge: 75000,
    security_deposit: 2500000,
    is_available: true,
    verification_status: "verified",
    flagged: false,
    tenant_id: "tenant-002",
    category: {
      id: "cat-002",
      name: "Duplex",
    },
    landlord: {
      id: "landlord-002",
      firstName: "Adeola",
      lastName: "Williams",
      phone_number: "+2348098765432",
      email: "adeola.w@example.com",
      profile_picture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    reviews: [
      {
        review_id: 3,
        rating: 4.9,
        feedback: "Absolutely stunning property with top-notch finishes",
        date: "2023-04-10",
        user: {
          id: "user-003",
          firstName: "David",
          lastName: "Miller",
          profile_picture: "https://randomuser.me/api/portraits/men/75.jpg",
        },
      },
    ],
  },
  {
    id: "prop-002",
    name: "Modern Duplex in Lekki Phase 1",
    description:
      "Spacious duplex with contemporary design and ample natural light",
    bedrooms: 4,
    bathrooms: 3,
    parking_space: 3,
    furnished: "semi",
    pets: "case-by-case",
    kitchens: 1,
    floors_no: 2,
    size_sqft: 3200,
    year_built: 2020,
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    address: "45 Admiralty Way",
    street: "Admiralty Way",
    closest_landmark: "Lekki Mall",
    city: "Lagos",
    state: "Lagos",
    zipcode: 106104,
    payment_structure: "annually",
    rent_amount: 25000000,
    available_from: "2023-12-01",
    minimum_lease_duration: "24 months",
    service_charge: 75000,
    security_deposit: 2500000,
    is_available: true,
    verification_status: "verified",
    flagged: false,
    tenant_id: "tenant-002",
    category: {
      id: "cat-002",
      name: "Duplex",
    },
    landlord: {
      id: "landlord-002",
      firstName: "Adeola",
      lastName: "Williams",
      phone_number: "+2348098765432",
      email: "adeola.w@example.com",
      profile_picture: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    reviews: [
      {
        review_id: 3,
        rating: 4.9,
        feedback: "Absolutely stunning property with top-notch finishes",
        date: "2023-04-10",
        user: {
          id: "user-003",
          firstName: "David",
          lastName: "Miller",
          profile_picture: "https://randomuser.me/api/portraits/men/75.jpg",
        },
      },
    ],
  },
  // You can add more properties following the same structure
];

function RecentListing() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { userState, loading } = useUserState();

  const slides = properties.map((property, index) => (
    <Carousel.Slide key={`${property.id}-${index}`}>
      <PropertyCard propertyData={property} />
    </Carousel.Slide>
  ));

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-6"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            RECENTLY ADDED
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            {loading ? (
              "Discover Properties in Nigeria"
            ) : (
              <>
                Recent Listings in{" "}
                <span className="text-primary">{userState}</span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            The most viewed and favorited homes in the past 24 hours
          </motion.p>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Carousel
            slideSize={{ base: "100%", sm: "50%", md: "33.333%" }}
            slideGap={{ base: "md", sm: "lg" }}
            align="start"
            slidesToScroll={mobile ? 1 : 2}
            withControls={true}
            loop={false}
            className={classes.rootCarousel}
            styles={{
              control: {
                backgroundColor: "white",
                color: theme.colors.dark[6],
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: theme.colors[theme.primaryColor][6],
                  color: "white",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              },
            }}
          >
            {slides}
          </Carousel>
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            href="/listings"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-900 px-8 py-4 rounded-full font-semibold transition-all shadow-sm hover:shadow-xl hover:scale-105"
          >
            View All Properties
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default RecentListing;
