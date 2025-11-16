/**
 * HowItWorks Page Component
 *
 * Step-by-step guide for tenants and landlords on using the platform.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";

export const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"tenants" | "landlords">(
    "tenants"
  );

  const tenantSteps = [
    {
      number: "1",
      title: "Create Your Account",
      description:
        "Sign up for free in minutes with just your email and basic information.",
      details: [
        "Enter your name, email, and phone number",
        "Verify your email address",
        "Complete your profile with preferences",
        "Set up security features like 2FA",
      ],
    },
    {
      number: "2",
      title: "Search for Properties",
      description:
        "Browse thousands of verified listings with powerful search filters.",
      details: [
        "Use filters for location, price, and amenities",
        "View high-quality photos and virtual tours",
        "Save your favorite properties",
        "Get instant notifications for new listings",
      ],
    },
    {
      number: "3",
      title: "Schedule Viewings",
      description: "Book property viewings at times convenient for you.",
      details: [
        "Select available viewing slots",
        "Get instant confirmation",
        "Receive reminders before appointments",
        "Option for virtual or in-person tours",
      ],
    },
    {
      number: "4",
      title: "Submit Application",
      description: "Apply online with our secure document upload system.",
      details: [
        "Fill out the application form",
        "Upload required documents (ID, proof of income)",
        "Submit references",
        "Track application status in real-time",
      ],
    },
    {
      number: "5",
      title: "Sign Lease & Pay",
      description:
        "Complete the process with digital lease signing and secure payments.",
      details: [
        "Review and sign lease agreement digitally",
        "Make secure payments online",
        "Receive confirmation and keys",
        "Access your tenant dashboard",
      ],
    },
    {
      number: "6",
      title: "Move In",
      description: "Get your keys and settle into your new home.",
      details: [
        "Coordinate move-in date with landlord",
        "Complete property inspection",
        "Report any initial issues",
        "Start enjoying your new home",
      ],
    },
  ];

  const landlordSteps = [
    {
      number: "1",
      title: "Create Landlord Account",
      description: "Register as a landlord and verify your identity.",
      details: [
        "Sign up with your business information",
        "Verify your identity and ownership",
        "Complete landlord profile",
        "Set up payment details",
      ],
    },
    {
      number: "2",
      title: "List Your Property",
      description: "Add your property with photos, details, and pricing.",
      details: [
        "Upload high-quality property photos",
        "Enter property details and amenities",
        "Set your rental price and terms",
        "Submit for verification (24-48 hours)",
      ],
    },
    {
      number: "3",
      title: "Receive Applications",
      description: "Get notified when tenants apply for your property.",
      details: [
        "Review tenant applications",
        "Check credit and background reports",
        "Schedule interviews if needed",
        "Request additional information",
      ],
    },
    {
      number: "4",
      title: "Screen & Select Tenant",
      description: "Use our tools to find the best tenant for your property.",
      details: [
        "Review applicant documents",
        "Contact references",
        "Approve or decline applications",
        "Send offer to selected tenant",
      ],
    },
    {
      number: "5",
      title: "Create Lease Agreement",
      description: "Generate and sign lease agreements digitally.",
      details: [
        "Use our lease templates or upload your own",
        "Send lease to tenant for signature",
        "Both parties sign digitally",
        "Secure copy stored in the platform",
      ],
    },
    {
      number: "6",
      title: "Manage Your Property",
      description: "Track rent, maintenance, and communicate with tenants.",
      details: [
        "Receive rent payments automatically",
        "Handle maintenance requests",
        "Communicate through secure messaging",
        "Access financial reports and analytics",
      ],
    },
  ];

  const activeSteps = activeTab === "tenants" ? tenantSteps : landlordSteps;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            From browsing to moving in, we've made the rental process simple and
            straightforward
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("tenants")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "tenants"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              For Tenants
            </button>
            <button
              onClick={() => setActiveTab("landlords")}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "landlords"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              For Landlords
            </button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {activeSteps.map((step, index) => (
              <div key={index} className="flex gap-8 items-start">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  {index < activeSteps.length - 1 && (
                    <div className="w-0.5 h-24 bg-gray-200 mx-auto mt-4"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
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
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600">
              Features that make your rental journey smooth and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Verified
              </h3>
              <p className="text-gray-600">
                All properties and users are verified for your security and
                peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-cyan-600"
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
                Fast Process
              </h3>
              <p className="text-gray-600">
                Streamlined workflows get you from search to move-in faster than
                traditional methods.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-amber-600"
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
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our dedicated team is always available to help you with any
                questions or issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have simplified their rental experience
            with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label={
                activeTab === "tenants"
                  ? "Find a Property"
                  : "List Your Property"
              }
              variant="filled"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                navigate(
                  activeTab === "tenants"
                    ? "/properties"
                    : "/auth/register?role=landlord"
                )
              }
            />
            <Button
              label="Contact Support"
              variant="outlined"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/contact")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
