import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconShieldCheck,
  IconMail,
  IconClock,
  IconChecklist,
  IconHome,
  IconStar,
  IconRocket,
} from "@tabler/icons-react";

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"
        />

        {/* Confetti Animation */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-500 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: 0,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 overflow-hidden"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <IconShieldCheck size={64} className="text-white" />
              </div>

              {/* Animated Ring */}
              <motion.div
                className="absolute inset-0 border-4 border-green-300 rounded-full"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Verification Submitted! 🎉
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-6"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Thank you for completing the verification process. Your documents
              are being reviewed and you'll hear back from us within 24-48
              hours.
            </motion.p>

            {/* Status Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold mb-6"
            >
              <IconClock size={20} />
              <span>Under Review</span>
            </motion.div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-100"
          >
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <IconChecklist size={24} className="text-blue-600" />
              What Happens Next?
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: IconMail,
                  title: "Email Confirmation",
                  description:
                    "You'll receive an email confirmation with your submission details",
                  time: "Within 5 minutes",
                },
                {
                  icon: IconClock,
                  title: "Document Review",
                  description:
                    "Our team will verify your documents and information",
                  time: "24-48 hours",
                },
                {
                  icon: IconShieldCheck,
                  title: "Approval Notification",
                  description:
                    "You'll get notified once your account is fully verified",
                  time: "Via email & dashboard",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <step.icon size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {step.title}
                      </h4>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Available After Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconHome size={32} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                List Properties
              </h4>
              <p className="text-sm text-gray-600">
                Start listing your properties immediately
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconStar size={32} className="text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Verified Badge
              </h4>
              <p className="text-sm text-gray-600">Build trust with tenants</p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconRocket size={32} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Priority Support
              </h4>
              <p className="text-sm text-gray-600">Get faster response times</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/property-owner"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              <IconHome size={20} />
              Go to Dashboard
            </Link>

            <Link
              to="/property-owner/properties/create"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              <IconRocket size={20} />
              List Your First Property
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-2">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@propconnect.com"
                className="text-blue-600 hover:underline"
              >
                support@propconnect.com
              </a>
            </p>
            <p className="text-xs text-gray-400">
              You can check your verification status anytime in your dashboard
            </p>
          </motion.div>
        </motion.div>

        {/* Floating Success Elements */}
        <motion.div
          className="absolute -top-4 -right-4 text-6xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring" }}
        >
          🎉
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -left-4 text-6xl"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          ✅
        </motion.div>
      </div>

      {/* Progress Bar Animation */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
    </div>
  );
}
