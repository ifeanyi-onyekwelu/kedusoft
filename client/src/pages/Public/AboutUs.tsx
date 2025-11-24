/**
 * AboutUs Page Component
 *
 * Company information, mission, vision, and team.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

export const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: "🎯",
      title: "Trust & Transparency",
      description: "We believe in honest, open communication with all parties.",
    },
    {
      icon: "⚡",
      title: "Speed & Efficiency",
      description: "Quick responses and streamlined processes save your time.",
    },
    {
      icon: "🤝",
      title: "Customer First",
      description: "Your satisfaction and success drive everything we do.",
    },
    {
      icon: "🔒",
      title: "Security & Safety",
      description: "Verified listings and secure transactions protect you.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "50,000+", label: "Happy Tenants" },
    { number: "5,000+", label: "Trusted Landlords" },
    { number: "36", label: "States Covered" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-gray-200">
              Making property rental simple, secure, and accessible for everyone
              across Nigeria
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded in 2024, GetMeLeased was born from a simple idea: finding
              and renting a home in Nigeria should be easy, transparent, and
              stress-free.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We noticed the challenges both tenants and landlords faced—endless
              property searches, unreliable listings, complicated paperwork, and
              lack of trust. So we built a platform that solves these problems,
              bringing verified properties, genuine landlords, and serious
              tenants together in one trusted marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To simplify the rental process by providing a reliable,
                transparent platform that connects landlords and tenants
                efficiently. We're committed to making quality housing
                accessible to everyone through technology and exceptional
                service.
              </p>
            </div>

            <div className="bg-cyan-50 rounded-2xl p-8 border border-cyan-200">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become Nigeria's most trusted property rental platform,
                transforming how people find homes by leveraging technology to
                create seamless experiences. We envision a future where every
                Nigerian can find their perfect home with confidence and ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-blue-100">
              Growing stronger every day with your trust
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a listing platform—we're your trusted partner
              in finding the perfect home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Verified Listings
              </h3>
              <p className="text-gray-600">
                Every property is verified by our team. No fake listings, no
                scams—just genuine homes ready for you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast & Simple Process
              </h3>
              <p className="text-gray-600">
                From browsing to moving in, our streamlined process gets you
                into your new home quickly and hassle-free.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Customer Support
              </h3>
              <p className="text-gray-600">
                Our dedicated support team is always here to help you with any
                questions or concerns, any time of day.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied tenants and landlords who trust us for
            their rental needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="Browse Properties"
              variant="filled"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/properties")}
            />
            <Button
              label="List Your Property"
              variant="outlined"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/auth/register?role=landlord")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
