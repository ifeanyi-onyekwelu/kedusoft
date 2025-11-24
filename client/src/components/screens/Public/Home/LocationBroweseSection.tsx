import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const nigerianStates = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Oyo",
  "Kano",
  "Kaduna",
  "Enugu",
  "Anambra",
  "Delta",
  "Imo",
  "Ogun",
  "Akwa Ibom",
  "Edo",
  "Plateau",
  "Benue",
  "Abia",
  "Ondo",
  "Osun",
  "Cross River",
  "Kwara",
];

const majorCities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Enugu",
  "Owerri",
  "Kano",
  "Abeokuta",
  "Uyo",
  "Onitsha",
  "Jos",
  "Benin",
  "Kaduna",
  "Asaba",
  "Aba",
  "Awka",
  "Warri",
  "Calabar",
  "Ilorin",
  "Akure",
];

const MotionLink = motion(Link);

const LinkGroup = ({
  title,
  items,
  linkType,
  propertyType,
  showViewAll = false,
}: {
  title: string;
  items: { name: string; linkText: string; href: string }[];
  linkType: "city" | "state";
  propertyType: string;
  showViewAll?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 12);

  return (
    <div className="relative py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {showViewAll && (
          <Link
            to={`/listings`}
            className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
          >
            View all
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3"
      >
        <AnimatePresence initial={false}>
          {displayItems.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className="text-sm"
            >
              <MotionLink
                to={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors group"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="group-hover:underline">{item.linkText}</span>
              </MotionLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {items.length > 12 && (
        <motion.button
          layout
          onClick={() => setExpanded(!expanded)}
          className="mt-5 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary font-medium transition-colors"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          <span>
            {expanded ? "Show less" : `Show ${items.length - 12} more`}
          </span>
          <motion.svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.button>
      )}
    </div>
  );
};

const LocationBrowseSection = () => {
  // Generate state links
  const stateLinks = nigerianStates.map((state) => ({
    name: state,
    linkText: `${state} • Homes for rent`,
    href: `/listings?location=${encodeURIComponent(state)}`,
  }));

  const stateForSaleLinks = nigerianStates.map((state) => ({
    name: state,
    linkText: `${state} • Homes for sale`,
    href: `/listings?location=${encodeURIComponent(state)}&listing_type=sale`,
  }));

  // Generate city links for different property types
  const cityRentLinks = majorCities.map((city) => ({
    name: city,
    linkText: `${city} houses for rent`,
    href: `/listings?location=${encodeURIComponent(city)}&listing_type=rent`,
  }));

  const cityApartmentLinks = majorCities.map((city) => ({
    name: city,
    linkText: `${city} apartments for rent`,
    href: `/listings?location=${encodeURIComponent(
      city
    )}&property_type=apartment`,
  }));

  const cityShortLetLinks = majorCities.map((city) => ({
    name: city,
    linkText: `${city} short let properties`,
    href: `/listings?location=${encodeURIComponent(
      city
    )}&listing_type=short-let`,
  }));

  const cityDuplexLinks = majorCities.map((city) => ({
    name: city,
    linkText: `${city} duplex for rent`,
    href: `/listings?location=${encodeURIComponent(city)}&property_type=duplex`,
  }));

  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl" />
      </div>

      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            BROWSE BY LOCATION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Search Properties by <span className="text-primary">Location</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Find your perfect home in Nigeria's most popular cities and states
            with our comprehensive listings
          </motion.p>
        </motion.div>

        {/* Links Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100"
        >
          <LinkGroup
            title="Search for homes by state"
            items={stateLinks}
            linkType="state"
            propertyType="rent"
            showViewAll={true}
          />

          <LinkGroup
            title="Search for homes for sale by state"
            items={stateForSaleLinks}
            linkType="state"
            propertyType="sale"
          />

          <LinkGroup
            title="Search for houses for rent by city"
            items={cityRentLinks}
            linkType="city"
            propertyType="houses-rent"
            showViewAll={true}
          />

          <LinkGroup
            title="Search for apartments by city"
            items={cityApartmentLinks}
            linkType="city"
            propertyType="apartments"
            showViewAll={true}
          />

          <LinkGroup
            title="Search for short let properties by city"
            items={cityShortLetLinks}
            linkType="city"
            propertyType="short-let"
          />

          <LinkGroup
            title="Search for duplex by city"
            items={cityDuplexLinks}
            linkType="city"
            propertyType="duplex"
          />
        </motion.div>

        {/* SEO Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-gray-500">
            Helping thousands find their dream homes across Nigeria since 2020
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationBrowseSection;
