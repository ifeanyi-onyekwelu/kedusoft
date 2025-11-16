import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconHome,
  IconShieldCheck,
  IconUsers,
  IconStar,
} from "@tabler/icons-react";

function AuthLayout() {
  const location = useLocation();

  const features = [
    {
      icon: IconHome,
      title: "10,000+ Properties",
      description: "Browse verified listings across Nigeria",
    },
    {
      icon: IconShieldCheck,
      title: "Secure & Safe",
      description: "All transactions are protected",
    },
    {
      icon: IconUsers,
      title: "50,000+ Users",
      description: "Join our growing community",
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-2xl font-black text-primary tracking-tight"
            >
              KEDUSOFT
            </motion.div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <IconArrowLeft size={18} />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Marketing Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100">
                  <IconStar
                    size={16}
                    className="text-amber-500"
                    fill="currentColor"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Rated 4.9/5 by 10,000+ users
                  </span>
                </div>

                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Find Your Perfect <span className="text-blue-600">Home</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of Nigerians who found their dream property
                  through our trusted platform.
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

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">
                      Properties Listed
                    </div>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600">Happy Tenants</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">5K+</div>
                    <div className="text-sm text-gray-600">Property Owners</div>
                  </div>
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
                          Sign up
                        </Link>
                      </>
                    ) : location.pathname.includes("register") ? (
                      <>
                        Already have an account?{" "}
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
