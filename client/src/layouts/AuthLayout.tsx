import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconShieldCheck,
  IconClock,
  IconRocket,
} from "@tabler/icons-react";

function AuthLayout() {
  const location = useLocation();

  const features = [
    {
      icon: IconRocket,
      title: "Coming Soon",
      description:
        "Be among the first to experience revolutionary property hunting",
    },
    {
      icon: IconClock,
      title: "Early Access",
      description: "Join our waitlist for exclusive launch benefits",
    },
    {
      icon: IconShieldCheck,
      title: "Verified Platform",
      description: "We're building a trusted community from day one",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-50 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 py-6 px-6 lg:px-12">
        <div className="max-w-max-window mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center"
            >
              <motion.img
                src="/images/brand/logo_cropped.png"
                alt="PropConnect Logo"
                className="h-14 w-auto object-contain"
              />
            </motion.div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors font-medium"
          >
            <IconArrowLeft size={18} />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-8 px-6 lg:px-12">
        <div className="max-w-window mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Pre-launch Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100">
                  <IconRocket size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Launching Soon • Join the Waitlist
                  </span>
                </div>

                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Property Hunting{" "}
                  <span className="text-blue-600">Reimagined</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  We're building the future of real estate in Nigeria. Get ready
                  for a seamless, secure, and smarter way to find your perfect
                  property.
                </p>

                {/* Features */}
                <div className="space-y-4 pt-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Value Proposition */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                    Why Join Early?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Exclusive early access to platform features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Special launch bonuses and incentives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Help shape the future of PropConnect</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
                {/* Pre-launch notice */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <IconClock
                      size={20}
                      className="text-amber-600 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">
                        We're launching soon!
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Join our community early and be the first to experience
                        PropConnect.
                      </p>
                    </div>
                  </div>
                </div>

                <Outlet />

                {/* Footer links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    {location.pathname.includes("login") ? (
                      <>
                        Don't have an account?{" "}
                        <Link
                          to="/auth/register"
                          className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                          Join waitlist
                        </Link>
                      </>
                    ) : location.pathname.includes("register") ? (
                      <>
                        Already signed up?{" "}
                        <Link
                          to="/auth/login"
                          className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                          Sign in
                        </Link>
                      </>
                    ) : null}
                  </p>
                  <div className="mt-4 text-center text-xs text-gray-500 space-x-2">
                    <Link
                      to="/terms-of-service"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Terms
                    </Link>
                    <span>·</span>
                    <Link
                      to="/privacy-policy"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Privacy
                    </Link>
                    <span>·</span>
                    <Link
                      to="/contact-us"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Help
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
