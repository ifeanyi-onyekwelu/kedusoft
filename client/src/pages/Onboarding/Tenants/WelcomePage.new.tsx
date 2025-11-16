import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconHome,
  IconMapPin,
  IconStar,
  IconSearch,
} from "@tabler/icons-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-200 rounded-full opacity-20 blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <IconHome size={48} className="text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect <span className="text-blue-600">Home</span> 🏡
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let's make finding your dream apartment easy and fun! Answer a few
              quick questions and we'll match you with properties you'll love.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: IconSearch,
                title: "Smart Search",
                description:
                  "AI-powered matching finds properties that fit your needs",
                color: "blue",
              },
              {
                icon: IconMapPin,
                title: "Perfect Location",
                description: "Discover neighborhoods that match your lifestyle",
                color: "cyan",
              },
              {
                icon: IconStar,
                title: "Verified Properties",
                description:
                  "All listings are verified by our team for your safety",
                color: "purple",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-14 h-14 bg-${benefit.color}-100 rounded-lg flex items-center justify-center mb-4`}
                >
                  <benefit.icon
                    size={28}
                    className={`text-${benefit.color}-600`}
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Link
              to="/onboarding/property"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              <span>Start Your Journey</span>
              <motion.svg
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Takes only 2 minutes • Skip questions anytime
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
