import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconSearch,
  IconMapPin,
  IconShieldCheck,
  IconHeart,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";

export default function WelcomePage() {
  // Brand colors configuration
  const brandColors = {
    primary: "from-blue-600 to-indigo-600",
    secondary: "from-purple-500 to-pink-500",
    accent: "from-cyan-400 to-blue-400",
    background: "from-slate-900 via-blue-900 to-slate-900",
  };

  const features = [
    {
      icon: IconSearch,
      title: "Smart Matching",
      description: "AI-powered home recommendations",
    },
    {
      icon: IconMapPin,
      title: "Prime Locations",
      description: "Verified properties in best neighborhoods",
    },
    {
      icon: IconShieldCheck,
      title: "Verified Listings",
      description: "Thoroughly vetted for your safety",
    },
    {
      icon: IconHeart,
      title: "Personalized",
      description: "Tailored to your preferences",
    },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${brandColors.background} relative overflow-hidden`}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r ${brandColors.primary} rounded-full opacity-20 blur-3xl`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r ${brandColors.secondary} rounded-full opacity-20 blur-3xl`}
        />
      </div>

      <div className="relative z-10 w-full max-w-window">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
        >
          {/* Hero Content */}
          <div className="text-white space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Find Your
                <span
                  className={`block bg-gradient-to-r ${brandColors.accent} bg-clip-text text-transparent`}
                >
                  Perfect Home
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                AI-powered platform that matches you with properties tailored to
                your lifestyle, budget, and preferences.
              </p>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {[
                "10K+ Verified Properties",
                "50+ Neighborhoods",
                "98% Satisfaction Rate",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <IconCheck
                    size={20}
                    className="text-green-400 flex-shrink-0"
                  />
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/onboarding/tenant/personal"
                className={`group relative bg-gradient-to-r ${brandColors.primary} text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3`}
              >
                <span>Find My Home</span>
                <IconArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${brandColors.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <div className="text-white text-sm">
              <strong>Ready to get started?</strong>
              <span className="text-gray-300 ml-2">
                Join thousands of happy tenants
              </span>
            </div>
            <Link
              to="/onboarding/tenant/personal"
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              Get Started
              <IconArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
