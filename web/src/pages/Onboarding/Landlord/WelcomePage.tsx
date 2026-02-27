import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconShieldCheck,
  IconUpload,
  IconClock,
  IconChecklist,
  IconCheck,
} from "@tabler/icons-react";

export default function LandlordVerificationWelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
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
              <IconShieldCheck size={48} className="text-white" />
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
              Account Verification Required 🛡️
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              To ensure the safety and security of our platform, we need to
              verify your identity and property ownership details. This helps us
              maintain a trusted community.
            </p>
          </motion.div>

          {/* Verification Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: IconUpload,
                title: "Upload Documents",
                description:
                  "Government ID, property deeds, and bank information",
                time: "5-10 minutes",
              },
              {
                icon: IconClock,
                title: "Verification Review",
                description:
                  "Our team reviews your documents within 24-48 hours",
                time: "1-2 days",
              },
              {
                icon: IconChecklist,
                title: "Get Approved",
                description:
                  "Start listing properties and connecting with tenants",
                time: "Instant access",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all text-center"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <step.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {step.time}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Required Documents */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-blue-50 rounded-2xl p-6 mb-8"
          >
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <IconChecklist size={24} className="text-blue-600" />
              Documents You'll Need
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <IconCheck size={14} className="text-green-600" />
                </div>
                <span>Government-issued ID</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <IconCheck size={14} className="text-green-600" />
                </div>
                <span>Property deed or title</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <IconCheck size={14} className="text-green-600" />
                </div>
                <span>Bank account information</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <IconCheck size={14} className="text-green-600" />
                </div>
                <span>Tax identification number</span>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Link
              to="/onboarding/landlord/verification"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <IconShieldCheck size={24} />
              <span>Start Verification</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Secure and encrypted • We protect your data • Required for listing
              properties
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
