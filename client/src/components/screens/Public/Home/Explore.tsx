import { Stack } from "@mantine/core";
import {
  FaHome,
  FaBuilding,
  FaCity,
  FaHotel,
  FaHouseUser,
  FaBed,
  FaWarehouse,
} from "react-icons/fa";
import { Carousel } from "@mantine/carousel";
import { motion } from "framer-motion";
import { ElementType } from "react";
import { Link } from "react-router-dom";
import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./Popular.module.css";
import "@mantine/carousel/styles.css";

interface ApartmentCardProps {
  icon: ElementType;
  title: string;
  href: string;
  totalProperties: string;
}

const MotionLink = motion(Link);

const apartmentTypes: ApartmentCardProps[] = [
  {
    icon: FaWarehouse,
    title: "Lodge",
    href: "/listings?property_type=lodge",
    totalProperties: "240",
  },
  {
    icon: FaBed,
    title: "Studio",
    href: "/listings?property_type=studio",
    totalProperties: "180",
  },
  {
    icon: FaCity,
    title: "Penthouse",
    href: "/listings?property_type=penthouse",
    totalProperties: "45",
  },
  {
    icon: FaBuilding,
    title: "Apartment",
    href: "/listings?property_type=apartment",
    totalProperties: "420",
  },
  {
    icon: FaHome,
    title: "Duplex",
    href: "/listings?property_type=duplex",
    totalProperties: "165",
  },
  {
    icon: FaHotel,
    title: "Self-Contain",
    href: "/listings?property_type=self_contain",
    totalProperties: "280",
  },
  {
    icon: FaBuilding,
    title: "Mini Flat",
    href: "/listings?property_type=mini_flat",
    totalProperties: "195",
  },
];

const ApartmentCard = ({
  data,
  index,
}: {
  data: ApartmentCardProps;
  index: number;
}) => {
  return (
    <MotionLink to={data.href} className="block group h-full">
      <motion.div
        className="relative rounded-2xl p-8 bg-white cursor-pointer overflow-hidden h-full flex flex-col justify-between min-h-[200px] shadow-sm hover:shadow-2xl transition-shadow duration-500"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          y: -12,
          transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
        }}
      >
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-all duration-300 group-hover:bg-primary/10 group-hover:w-32 group-hover:h-32"></div>

        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-2xl border border-gray-100 group-hover:border-primary/30 transition-all duration-300"></div>

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
            <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors duration-300">
              {data.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">
                {data.totalProperties}
              </span>
              <span className="text-xs text-gray-400">
                Properties Available
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
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const items = apartmentTypes.map((item, index) => (
    <Carousel.Slide key={item.title}>
      <ApartmentCard data={item} index={index} />
    </Carousel.Slide>
  ));

  return (
    <div className="relative h-fit bg-gray-50 py-20">
      <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-6"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            PROPERTY TYPES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Explore <span className="text-primary">Property Types</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
          >
            From cozy studios to spacious penthouses - find the perfect home
            that suits your lifestyle and budget
          </motion.p>
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
            align="start"
            slidesToScroll={mobile ? 1 : 2}
            withControls={true}
            loop={false}
            containScroll="trimSnaps"
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
            {items}
          </Carousel>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Explore;
