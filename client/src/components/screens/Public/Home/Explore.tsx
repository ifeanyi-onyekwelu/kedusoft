import {
  FaHome,
  FaBuilding,
  FaCity,
  FaHotel,
  FaBed,
  FaWarehouse,
  FaStar,
  FaLandmark,
  FaKey,
  FaUsers,
  FaGraduationCap,
  FaBriefcase,
  FaStore,
  FaMapPin,
} from "react-icons/fa";
import { Carousel } from "@mantine/carousel";
import { motion } from "framer-motion";
import { ElementType, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMantineTheme, Skeleton } from "@mantine/core";
import "@mantine/carousel/styles.css";
import SectionHeader from "../SectionHeader";
import { usePublicOperations } from "@/apis/publicApi";
import { useLoading } from "@/hooks/useLoading";
import { ErrorState } from "@/components/ErrorState";

interface CategoryCardProps {
  icon: ElementType;
  title: string;
  href: string;
  totalProperties: number;
  id?: string;
}

interface Category {
  id: string;
  name: string;
  property_count: number;
  description?: string;
}

const MotionLink = motion(Link);

// Mapping of category names to icons
const categoryIconMap: Record<string, ElementType> = {
  apartment: FaBuilding,
  "self-contained / studio / mini-flat": FaBed,
  duplex: FaHome,
  bungalow: FaLandmark,
  "detached / semi-detached": FaHome,
  "serviced apartment / condo": FaCity,
  "boys' quarters (bq)": FaKey,
  "shared apartment / co-living": FaUsers,
  "hostel / student housing": FaGraduationCap,
  "short-let": FaHotel,
  "office space": FaBriefcase,
  "shop / store": FaStore,
  "co-office space": FaBriefcase,
  "warehouse / industrial space": FaWarehouse,
  "lodge / guest house": FaHotel,
  "land (residential / commercial / agricultural)": FaMapPin,
};

// Function to get icon based on category name
const getIconForCategory = (categoryName: string): ElementType => {
  const lowerName = categoryName.toLowerCase().trim();
  return categoryIconMap[lowerName] || FaHome; // Default to FaHome if not found
};

// Function to truncate long category names
const truncateCategoryName = (name: string, maxLength: number = 12): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + "...";
};

const CategoryCard = ({
  data,
  index,
}: {
  data: CategoryCardProps;
  index: number;
}) => {
  return (
    <MotionLink to={data.href} className="block group h-full">
      <motion.div
        className="relative rounded-2xl p-8 bg-white border border-accent/20 cursor-pointer overflow-hidden h-full flex flex-col justify-between min-h-[200px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        title={data.title}
      >
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-all duration-300 group-hover:bg-accent group-hover:w-32 group-hover:h-32"></div>

        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-2xl border border-gray-100 group-hover:border-accent/30 transition-all duration-300"></div>

        <div className="relative z-10">
          {/* Icon container */}
          <div className="mb-8">
            <motion.div
              className="inline-flex"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon background */}
                <div className="relative bg-gray-50 group-hover:bg-primary rounded-xl p-4 transition-all duration-300">
                  <data.icon
                    className="text-primary group-hover:text-white transition-all duration-300"
                    size={32}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text content */}
          <div className="space-y-2">
            <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-300 truncate">
              {truncateCategoryName(data.title)}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">
                {data.totalProperties}
              </span>
              <span className="text-xs text-gray-400">
                {data.totalProperties === 1
                  ? "Property Available"
                  : "Properties Available"}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow indicator - slides in from bottom right */}
        <motion.div
          className="absolute bottom-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300"
          initial={{ opacity: 0, x: -10, y: 10 }}
          whileHover={{ opacity: 1, x: 0, y: 0 }}
        >
          <svg
            className="w-4 h-4 text-transparent group-hover:text-white transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </motion.div>
      </motion.div>
    </MotionLink>
  );
};

function Explore() {
  const theme = useMantineTheme();
  const { getAllCategories } = usePublicOperations();
  const { loading, withLoading } = useLoading();
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await withLoading(getAllCategories());

      // Transform API response to component format
      const transformedCategories: Category[] = Array.isArray(response)
        ? response
        : response.data || [];

      setCategories(transformedCategories);
    } catch (error) {
      setError("Failed to fetch categories. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="relative h-fit bg-gray-50 py-20">
        <div className="max-w-window mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <SectionHeader
              badgeTitle="PROPERTY TYPES"
              badgeIcon={<FaStar />}
              title="Explore"
              emphasizedText="Property Types"
              description="Loading property types..."
            />
          </div>
          <Skeleton height={200} circle mb="xl" />
        </div>
      </div>
    );

  if (error)
    return (
      <ErrorState message={error} onRetry={fetchCategories} loading={loading} />
    );

  // Transform categories to category cards with icons
  const categoryCards: CategoryCardProps[] = categories.map((category) => ({
    id: category.id,
    icon: getIconForCategory(category.name),
    title: category.name.charAt(0).toUpperCase() + category.name.slice(1),
    href: `/listings?category=${encodeURIComponent(category.name)}`,
    totalProperties: category.property_count,
  }));

  const items = categoryCards.map((item, index) => (
    <Carousel.Slide key={item.id || item.title}>
      <CategoryCard data={item} index={index} />
    </Carousel.Slide>
  ));

  return (
    <div className="relative h-fit bg-gray-50 py-20">
      <motion.div className="max-w-window mx-auto px-4 sm:px-6 md:px-8">
        <motion.div className="text-center mb-12">
          <SectionHeader
            badgeTitle="PROPERTY TYPES"
            badgeIcon={<FaStar />}
            title="Explore"
            emphasizedText="Property Types"
            description="From cozy studios to spacious penthouses - find the perfect home that suits your lifestyle and budget"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Carousel
            slideSize={{ base: "50%", sm: "33.33%", md: "25%", lg: "16.66%" }}
            slideGap={{ base: "md", sm: "lg" }}
            withControls={true}
            styles={{
              control: {
                backgroundColor: "white",
                color: theme.colors.dark[6],
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
              },
            }}
          >
            {items}
          </Carousel>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Explore;
