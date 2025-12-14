/**
 * AgentsPage Component
 *
 * Information page for real estate agents and property managers
 * interested in using the platform to manage client properties.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

export const AgentsPage = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: "🏢",
      title: "Manage Multiple Properties",
      description:
        "Handle all your client properties from a single dashboard with powerful management tools.",
    },
    {
      icon: "👥",
      title: "Connect with More Clients",
      description:
        "Reach thousands of potential tenants and property owners looking for professional services.",
    },
    {
      icon: "📊",
      title: "Track Performance",
      description:
        "Get detailed analytics on property views, inquiries, and applications in real-time.",
    },
    {
      icon: "💼",
      title: "Professional Tools",
      description:
        "Access tenant screening, lease management, and payment tracking all in one place.",
    },
    {
      icon: "🔔",
      title: "Instant Notifications",
      description:
        "Stay updated with real-time alerts for new inquiries, applications, and messages.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Message tenants and property owners instantly through our secure chat system.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up as Landlord",
      description:
        "Create your account and complete verification to start managing properties.",
    },
    {
      step: "2",
      title: "List Properties",
      description:
        "Add your client's properties with photos, details, and pricing information.",
    },
    {
      step: "3",
      title: "Manage Inquiries",
      description:
        "Receive and respond to tenant applications and schedule property viewings.",
    },
    {
      step: "4",
      title: "Close Deals",
      description:
        "Process applications, screen tenants, and finalize lease agreements online.",
    },
  ];

  const features = [
    "Unlimited property listings",
    "Tenant screening tools",
    "Digital lease agreements",
    "Payment tracking",
    "Application management",
    "Property analytics",
    "24/7 support access",
    "Mobile app access",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80')`,
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative max-w-window mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 border border-white/30">
                <span className="text-2xl">🚀</span>
                <span>Coming Soon - Early Access</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Agents Portal
                <br />
                <span className="text-blue-200">Launching Soon</span>
              </h1>
              <p className="text-xl text-blue-50 mb-8 leading-relaxed">
                We're building an exclusive platform for real estate
                professionals. Join our waitlist to be among the first to access
                powerful tools designed for agents and property managers.
              </p>

              {/* Waitlist CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="filled"
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
                  onClick={() => navigate("/auth/register?role=landlord")}
                >
                  Join Waitlist
                </Button>
                <Button
                  variant="outlined"
                  className="border-2 border-white text-white hover:bg-white/10"
                  onClick={() => {
                    document
                      .getElementById("benefits")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </div>

              {/* Launch Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <div className="font-semibold mb-1">
                      Expected Launch: Q1 2026
                    </div>
                    <div className="text-sm text-blue-100">
                      Be notified when we launch and get early access benefits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Preview */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">What's Coming</h3>
                <div className="space-y-4">
                  {[
                    "Dedicated agent dashboard",
                    "Client property management",
                    "Lead generation tools",
                    "Commission tracking",
                    "Performance analytics",
                    "Professional profile pages",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
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
                      <span className="text-blue-50">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="border-b border-gray-200 bg-blue-50">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-blue-700 mb-4">
              <span>🔨</span>
              <span>IN DEVELOPMENT</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Building Something Special for Agents
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We're developing a comprehensive platform specifically for real
              estate agents. The features below represent our planned
              capabilities. Join our waitlist to be notified when we launch!
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-16 bg-white">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Planned Features for Agents
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you'll need to manage properties and serve your clients
              better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="relative bg-gray-50 rounded-xl p-6 border border-gray-200 opacity-75"
              >
                {/* Coming Soon Overlay */}
                <div className="absolute top-3 right-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    Soon
                  </span>
                </div>
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Will Work */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How It Will Work
            </h2>
            <p className="text-lg text-gray-600">
              Your journey with our platform in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full opacity-75">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="py-16 bg-white">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need in One Platform
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                From listing properties to closing deals, our platform provides
                all the tools you need to run your real estate business
                efficiently.
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Join the Waitlist
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Be among the first agents to access our platform when we launch.
                Early adopters will receive exclusive benefits and premium
                support.
              </p>
              <div className="space-y-4">
                <Button
                  variant="filled"
                  className="w-full bg-blue-600 hover:bg-blue-700 justify-center"
                  onClick={() => navigate("/auth/register?role=landlord")}
                >
                  Join Waitlist
                </Button>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Early Access Benefits:
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Free account for 3 months</li>
                    <li>✓ Priority customer support</li>
                    <li>✓ Exclusive training sessions</li>
                    <li>✓ Beta feature access</li>
                  </ul>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Questions?{" "}
                    <a
                      href="#contact"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Contact our team
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Know More?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about our upcoming agents platform? We'd love to hear
            from you and keep you updated on our progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-left">
              <div className="text-2xl mb-2">📧</div>
              <div className="text-sm text-gray-600 mb-1">Email us at</div>
              <a
                href="mailto:agents@getmeleased.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                agents@getmeleased.com
              </a>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-left">
              <div className="text-2xl mb-2">📞</div>
              <div className="text-sm text-gray-600 mb-1">Call us at</div>
              <a
                href="tel:+2348123456789"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                +234 812 345 6789
              </a>
            </div>
          </div>

          {/* Update Timeline */}
          <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-xl">📅</span>
              <h3 className="font-bold text-gray-900">Development Timeline</h3>
            </div>
            <p className="text-sm text-gray-600">
              We're actively building this feature and targeting a Q1 2026
              launch. Join our waitlist to receive monthly updates on our
              progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
