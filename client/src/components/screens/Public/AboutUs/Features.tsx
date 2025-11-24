import {
  IconCookie,
  IconGauge,
  IconUser,
  IconHeadphones,
  IconDashboard,
} from "@tabler/icons-react";

export function FeaturesSection() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      {/* Features Cards Section */}
      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-lg text-indigo-600 font-semibold mb-4">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Introduction to Nigeria's <br className="hidden md:block" /> Premier
            Real Estate Platform
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing property management with cutting-edge technology and
            personalized service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: IconGauge,
              title: "Secured Data",
              description:
                "Military-grade encryption protecting all your transactions and personal information",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: IconUser,
              title: "Expert Guidance",
              description:
                "Access to Nigeria's top real estate lawyers and property consultants",
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              icon: IconCookie,
              title: "Dedicated Dashboards",
              description:
                "Custom interfaces for tenants, landlords, and property managers",
              color: "bg-amber-100 text-amber-600",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-8">
                <div
                  className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="flex items-center text-indigo-600 font-medium">
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conveniences Section */}
      <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-12">
              <div className="mb-2 text-indigo-300 font-semibold">
                OUR ADVANTAGES
              </div>
              <h2 className="text-4xl font-bold text-white mb-8">
                Platform <span className="text-amber-400">Conveniences</span>{" "}
                <br />
                That Empower You
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: IconHeadphones,
                    title: "Secured Data",
                    description:
                      "Bank-level security protecting all transactions",
                    color: "bg-blue-500",
                  },
                  {
                    icon: IconDashboard,
                    title: "Legal Assistance",
                    description: "On-demand access to property lawyers",
                    color: "bg-emerald-500",
                  },
                  {
                    icon: IconDashboard,
                    title: "24/7 Support",
                    description: "Always available customer service team",
                    color: "bg-amber-500",
                  },
                  {
                    icon: IconGauge,
                    title: "AI Matching",
                    description: "Smart property recommendations",
                    color: "bg-purple-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start">
                      <div
                        className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-indigo-200 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-amber-500 text-indigo-900 font-bold rounded-lg hover:bg-amber-400 transition-colors">
                  Schedule a Demo
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                  View Features
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
              <div className="absolute top-12 right-12 bg-gradient-to-r from-amber-400 to-orange-500 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute bottom-12 left-12 bg-gradient-to-r from-blue-400 to-indigo-500 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

              <div className="relative h-full flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                  {[
                    { value: "10K+", label: "Active Users" },
                    { value: "98%", label: "Satisfaction" },
                    { value: "24/7", label: "Support" },
                    { value: "15+", label: "Years Experience" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center"
                    >
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-indigo-200 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
