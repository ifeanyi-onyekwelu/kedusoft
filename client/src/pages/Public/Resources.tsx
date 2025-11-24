/**
 * Resources Page Component
 *
 * Hub for guides, tools, and helpful resources for tenants and landlords.
 */

import { useNavigate } from "react-router-dom";

export const Resources = () => {
  const navigate = useNavigate();

  const guides = [
    {
      title: "Tenant Guide",
      description: "Complete guide for renting a property in Nigeria",
      icon: "📖",
      link: "/tenant-guide",
    },
    {
      title: "How to Apply",
      description: "Step-by-step rental application process",
      icon: "✅",
      link: "/how-to-apply",
    },
    {
      title: "FAQs",
      description: "Answers to frequently asked questions",
      icon: "❓",
      link: "/faqs",
    },
    {
      title: "How It Works",
      description: "Learn how our platform works",
      icon: "⚙️",
      link: "/how-it-works",
    },
  ];

  const tools = [
    {
      title: "Property Search",
      description: "Find your perfect home with advanced filters",
      icon: "🔍",
      link: "/listings",
    },
    {
      title: "Shortlets",
      description: "Browse short-term rental properties",
      icon: "🏖️",
      link: "/shortlet",
    },
    {
      title: "Browse by Location",
      description: "Explore properties by city or area",
      icon: "�",
      link: "/browse-locations",
    },
    {
      title: "Property Management",
      description: "Learn about our management services",
      icon: "🏢",
      link: "/property-management",
    },
  ];

  const legalResources = [
    {
      title: "Terms of Service",
      description: "Platform terms and conditions",
      link: "/terms-of-service",
    },
    {
      title: "Privacy Policy",
      description: "How we protect your data",
      link: "/privacy-policy",
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies",
      link: "/cookie-policy",
    },
    {
      title: "Fair Housing",
      description: "Equal housing opportunity information",
      link: "/fair-housing",
    },
  ];

  const quickLinks = [
    {
      category: "For Tenants",
      links: [
        { label: "Browse Properties", url: "/listings" },
        { label: "Shortlets", url: "/shortlet" },
        { label: "How to Apply", url: "/how-to-apply" },
        { label: "Tenant Guide", url: "/tenant-guide" },
        { label: "FAQs", url: "/faqs" },
      ],
    },
    {
      category: "For Landlords",
      links: [
        { label: "List Property", url: "/auth/register?role=landlord" },
        { label: "Property Management", url: "/property-management" },
        { label: "For Agents", url: "/agents" },
        { label: "Services", url: "/services" },
      ],
    },
    {
      category: "Company",
      links: [
        { label: "About Us", url: "/about-us" },
        { label: "How It Works", url: "/how-it-works" },
        { label: "Blog", url: "/blog" },
        { label: "Contact Us", url: "/contact-us" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Resources</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Everything you need to know about renting—guides, tools, and support
          </p>
        </div>
      </div>

      {/* Guides Section */}
      <div className="py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Helpful Guides
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive guides to help you through the rental process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
              <button
                key={index}
                onClick={() => navigate(guide.link)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all text-left"
              >
                <div className="text-5xl mb-4">{guide.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm">{guide.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Useful Tools
            </h2>
            <p className="text-lg text-gray-600">
              Calculators and tools to make informed decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <button
                key={index}
                onClick={() => navigate(tool.link)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:border-cyan-200 transition-all text-left"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="py-16">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Quick Links
            </h2>
            <p className="text-lg text-gray-600">
              Fast access to important pages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickLinks.map((section, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => navigate(link.url)}
                        className="text-blue-600 hover:text-blue-700 hover:underline text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Resources */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-window mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Legal & Policies
            </h2>
            <p className="text-lg text-gray-600">
              Important legal information and policies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalResources.map((resource, index) => (
              <button
                key={index}
                onClick={() => navigate(resource.link)}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 border border-blue-200 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to
              assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/contact-us")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate("/faqs")}
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                View FAQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
