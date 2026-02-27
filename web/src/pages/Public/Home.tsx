import Hero from "../../components/screens/Public/Home/Hero";
import FeaturedListings from "../../components/screens/Public/Home/FeaturedListings";
import Testimonials from "../../components/screens/Public/Home/Testimonials";
import Popular from "../../components/screens/Public/Home/Popular";
import useAuth from "../../hooks/useAuth";
import Feed from "../../components/screens/Public/Home/Feed";
import LocationBrowseSection from "../../components/screens/Public/Home/LocationBroweseSection";
import Explore from "../../components/screens/Public/Home/Explore";
import RecentListing from "../../components/screens/Public/Home/RecentListing";
import PropertiesByCities from "../../components/screens/Public/Home/PropertiesByCities";
import { motion } from "framer-motion";
import {
  IconHome,
  IconSearch,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/screens/Public/SectionHeader";
import { FaLightbulb } from "react-icons/fa6";

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      icon: IconSearch,
      title: "Search Properties",
      description:
        "Browse thousands of verified listings across Nigeria with advanced filters to find exactly what you need",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: IconHome,
      title: "Schedule Viewing",
      description:
        "Book virtual or in-person property viewings instantly at your convenience with just a few clicks",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: IconCheck,
      title: "Apply & Move In",
      description:
        "Complete your application and sign lease agreements digitally - fast, secure, and hassle-free",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-10 left-4 w-48 h-48 sm:top-20 sm:left-10 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-4 w-56 h-56 sm:bottom-20 sm:right-10 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-window mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeTitle="How We Work"
          badgeIcon={<FaLightbulb />}
          title="Our Process"
          emphasizedText="Made Simple"
          description="Our streamlined process makes renting a property simple and stress-free."
        />

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative group"
            >
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 lg:top-20 left-full w-full h-0.5 bg-gray-200 -translate-x-4 z-0">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
                    style={{ transformOrigin: "left" }}
                  ></motion.div>
                </div>
              )}

              <motion.div
                className="relative bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 h-full border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl lg:hover:shadow-2xl"
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
                }}
              >
                {/* Step number badge - Fixed for mobile */}
                <motion.div
                  className="absolute -top-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold shadow-lg z-10"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 },
                  }}
                >
                  {index + 1}
                </motion.div>

                {/* Decorative corner accent */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${step.color} opacity-5 rounded-bl-full rounded-tr-2xl lg:rounded-tr-3xl transition-all duration-300 group-hover:opacity-10 group-hover:w-20 group-hover:h-20 sm:group-hover:w-28 sm:group-hover:h-28 lg:group-hover:w-32 lg:group-hover:h-32`}
                ></div>

                <div className="relative mt-2 sm:mt-4">
                  {/* Icon with animation */}
                  <motion.div
                    className="mb-4 sm:mb-6"
                    whileHover={{
                      scale: 1.05,
                      rotate: 5,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      },
                    }}
                  >
                    <div className="relative inline-flex">
                      {/* Glow effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-xl lg:rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                      ></div>

                      {/* Icon container */}
                      <div
                        className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-gradient-to-br ${step.color} shadow-md lg:shadow-lg`}
                      >
                        <step.icon
                          size={24}
                          className="sm:w-6 sm:h-6 lg:w-9 lg:h-9 text-white"
                          stroke={2}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Animated underline on hover */}
                  <motion.div
                    className={`mt-4 sm:mt-6 h-0.5 sm:h-1 bg-gradient-to-r ${step.color} rounded-full`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.8, duration: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  ></motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
          >
            Start Your Search
            <IconArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="bg-gray-50">
      <Hero />
      {isAuthenticated ? <Feed /> : <Popular />}
      <Explore />
      <HowItWorksSection />
      <RecentListing />
      <PropertiesByCities />
      <FeaturedListings />
      <Testimonials />
      <LocationBrowseSection />
    </div>
  );
}

export default Home;
