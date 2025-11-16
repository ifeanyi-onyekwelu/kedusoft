/**
 * PropertyManagement Page Component
 *
 * Information about property management services for landlords.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";

export const PropertyManagement = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: "🏠",
      title: "Tenant Screening",
      description:
        "Comprehensive background checks, credit reports, and reference verification to find reliable tenants.",
    },
    {
      icon: "💰",
      title: "Rent Collection",
      description:
        "Automated rent collection, payment tracking, and late payment reminders to ensure steady cash flow.",
    },
    {
      icon: "🔧",
      title: "Maintenance Coordination",
      description:
        "24/7 maintenance request handling with trusted contractors and repair tracking.",
    },
    {
      icon: "📄",
      title: "Lease Management",
      description:
        "Digital lease creation, signing, renewals, and secure document storage.",
    },
    {
      icon: "📊",
      title: "Financial Reporting",
      description:
        "Detailed monthly reports on income, expenses, and property performance analytics.",
    },
    {
      icon: "⚖️",
      title: "Legal Compliance",
      description:
        "Ensure your properties meet all legal requirements and housing regulations.",
    },
  ];

  const benefits = [
    {
      title: "Save Time",
      description:
        "Let us handle the day-to-day management while you focus on growing your portfolio.",
    },
    {
      title: "Maximize Income",
      description:
        "Professional pricing strategies and tenant retention improve your ROI.",
    },
    {
      title: "Reduce Stress",
      description:
        "No more late-night tenant calls or maintenance emergencies to handle.",
    },
    {
      title: "Professional Service",
      description:
        "Experienced team ensures your properties are well-maintained and profitable.",
    },
  ];

  const packages = [
    {
      name: "Basic",
      price: "5%",
      period: "of monthly rent",
      features: [
        "Tenant screening",
        "Rent collection",
        "Basic maintenance coordination",
        "Monthly financial reports",
        "Online tenant portal",
      ],
      recommended: false,
    },
    {
      name: "Professional",
      price: "8%",
      period: "of monthly rent",
      features: [
        "Everything in Basic",
        "Priority maintenance response",
        "Lease creation & management",
        "Annual property inspections",
        "Legal compliance support",
        "24/7 tenant support",
      ],
      recommended: true,
    },
    {
      name: "Premium",
      price: "10%",
      period: "of monthly rent",
      features: [
        "Everything in Professional",
        "Marketing & listing optimization",
        "Property improvement consulting",
        "Tax preparation assistance",
        "Dedicated account manager",
        "Vacancy guarantee program",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Property Management Services
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Professional property management that maximizes your investment
              while minimizing your workload
            </p>
            <Button
              label="Get Started Today"
              variant="filled"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/auth/register?role=landlord")}
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive property management solutions for landlords
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Property Management
            </h2>
            <p className="text-lg text-gray-600">
              Benefits of professional property management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Packages */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Management Packages
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 border-2 ${
                  pkg.recommended
                    ? "border-blue-600 shadow-xl"
                    : "border-gray-200"
                } relative`}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {pkg.price}
                  </div>
                  <p className="text-gray-600">{pkg.period}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  label="Get Started"
                  variant={pkg.recommended ? "filled" : "outlined"}
                  className={`w-full justify-center ${
                    pkg.recommended
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => navigate("/auth/register?role=landlord")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let our experienced team handle your properties while you enjoy the
            benefits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="Schedule Consultation"
              variant="filled"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate("/contact")}
            />
            <Button
              label="View All Services"
              variant="outlined"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => navigate("/services")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
