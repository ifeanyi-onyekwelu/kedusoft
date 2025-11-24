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
import { Container, Badge } from "@mantine/core";

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
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-window px-6 sm:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge size="lg" variant="light" color="blue" mb="md">
            HOW IT WORKS
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Your Home in <span className="text-primary">3 Easy Steps</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes renting a property simple and
            stress-free
          </p>
        </motion.div>

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
                <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gray-200 -translate-x-4 z-0">
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
                className="relative bg-white rounded-3xl p-8 h-full border-2 border-gray-100 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-2xl"
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
                }}
              >
                {/* Step number badge */}
                <motion.div
                  className="absolute -top-5 -left-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl z-10"
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
                  className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.color} opacity-5 rounded-bl-full rounded-tr-3xl transition-all duration-300 group-hover:opacity-10 group-hover:w-32 group-hover:h-32`}
                ></div>

                <div className="relative mt-4">
                  {/* Icon with animation */}
                  <motion.div
                    className="mb-6"
                    whileHover={{
                      scale: 1.1,
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
                        className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                      ></div>

                      {/* Icon container */}
                      <div
                        className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                      >
                        <step.icon
                          size={36}
                          className="text-white"
                          stroke={2}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Animated underline on hover */}
                  <motion.div
                    className={`mt-6 h-1 bg-gradient-to-r ${step.color} rounded-full`}
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
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start Your Search
            <IconArrowRight size={20} />
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
