import { BiLockAlt, BiSupport, BiSearch } from "react-icons/bi";

function WhyChooseUs() {
  const features = [
    {
      icon: BiLockAlt,
      title: "Bank-grade Security",
      description:
        "Your data protected with military-grade encryption and regular security audits",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: BiSearch,
      title: "Legal Expertise",
      description:
        "Access to Nigeria's top real estate lawyers and property consultants",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: BiSupport,
      title: "24/7 Support",
      description:
        "Dedicated team available round the clock for all your inquiries",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: BiLockAlt,
      title: "Verified Listings",
      description:
        "Every property undergoes strict verification before listing",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-indigo-600">Us?</span>
          </h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience real estate services that prioritize your needs and
            security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className={`mb-6 p-5 rounded-2xl ${feature.bg} transition-colors duration-300`}
                >
                  <feature.icon className={`w-12 h-12 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="mt-auto w-full">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-1 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${85 + index * 5}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${feature.bg
                          .replace("bg-", "bg-")
                          .replace("50", "500")}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Ready to find your dream property?
              </h3>
              <p className="text-lg text-indigo-100 mb-6">
                Join thousands of satisfied clients who found their perfect home
                through our platform
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Browse Properties
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-indigo-200">Properties Listed</div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-indigo-200">Client Satisfaction</div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-indigo-200">Years Experience</div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-indigo-200">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
