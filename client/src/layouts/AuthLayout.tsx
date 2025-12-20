import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconShieldCheck,
  IconClock,
  IconHomeHeart,
} from "@tabler/icons-react";

function AuthLayout() {
  const location = useLocation();

  const features = [
    {
      icon: IconShieldCheck,
      title: "Zero Scams",
      description:
        "We are manually verifying every landlord and agent to keep you safe.",
    },
    {
      icon: IconHomeHeart,
      title: "Find a Home, Not a Job",
      description:
        "Stop scrolling through fake listings. Get matched with real available spaces.",
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col font-inter">
      {/* Header */}
      <header className="relative z-20 py-5 px-6 lg:px-12 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/">
            <img
              src="/images/brand/logo.png"
              alt="PropConnect"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium text-sm"
          >
            <IconArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto h-full grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Side: Down-to-earth copy */}
          <div className="hidden lg:flex flex-col justify-center p-12 lg:p-16 space-y-8 border-r border-gray-100 bg-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100 uppercase text-[10px] font-bold tracking-widest font-sora">
                Building for Nigeria
              </div>

              <h1 className="text-5xl font-sora font-extrabold text-gray-900 tracking-tight leading-[1.2]">
                House hunting in Nigeria is{" "}
                <span className="text-primary italic">stressful.</span> <br />
                We’re fixing that.
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                No more fake agents, "inspection fees" for empty lots, or ghost
                listings. We're building a simpler way to rent and manage
                properties.
              </p>

              <div className="space-y-4 max-w-md">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:border-primary/20"
                  >
                    <div className="w-10 h-10 bg-white text-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                      <f.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {f.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <div className="h-full overflow-y-auto bg-gray-50 p-6 lg:p-12 custom-scrollbar flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[580px] py-4"
            >
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-8 lg:p-12">
                <div className="mb-10 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <p className="text-xs text-blue-900 leading-relaxed font-medium">
                    👋 <strong>Quick heads up:</strong> We are currently in
                    private beta. Sign up below to join the waitlist and we’ll
                    invite you as soon as your area is live!
                  </p>
                </div>

                <div className="min-h-[300px]">
                  <Outlet />
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
                  {location.pathname.includes("login") ? (
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to="/auth/register"
                        className="text-primary font-bold"
                      >
                        Join the waitlist
                      </Link>
                    </p>
                  ) : (
                    <p>
                      Already on the list?{" "}
                      <Link to="/auth/login" className="text-primary font-bold">
                        Sign in
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 mb-10 flex justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <Link to="/terms" className="hover:text-primary">
                  Terms
                </Link>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy
                </Link>
                <Link to="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
