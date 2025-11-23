/**
 * HowToApplyPage Component
 *
 * Step-by-step guide for tenants on how to apply for rental properties.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

export const HowToApplyPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description:
        "Sign up as a tenant and complete your profile with accurate information.",
      details: [
        "Provide your full name, email, and phone number",
        "Upload a profile photo (optional but recommended)",
        "Verify your email address",
      ],
    },
    {
      number: "2",
      title: "Browse Properties",
      description: "Search and filter properties that match your preferences.",
      details: [
        "Use filters for location, price, bedrooms, and amenities",
        "Save properties to your favorites for later",
        "View property details, photos, and virtual tours",
      ],
    },
    {
      number: "3",
      title: "Prepare Your Documents",
      description:
        "Gather required documents before applying to speed up the process.",
      details: [
        "Valid government-issued ID (National ID, Driver's License, or Passport)",
        "Proof of income (Pay slips, bank statements, or employment letter)",
        "References (Previous landlord contact or character references)",
        "Guarantor information (if required)",
      ],
    },
    {
      number: "4",
      title: "Submit Application",
      description:
        "Complete and submit your rental application through the platform.",
      details: [
        "Click 'Apply Now' on your chosen property",
        "Fill out the application form completely",
        "Upload all required documents",
        "Review and submit your application",
      ],
    },
    {
      number: "5",
      title: "Application Review",
      description:
        "The landlord will review your application and may request additional information.",
      details: [
        "Respond promptly to any landlord inquiries",
        "Check your dashboard for application status updates",
        "Be available for property viewing appointments",
      ],
    },
    {
      number: "6",
      title: "Sign Lease Agreement",
      description:
        "Once approved, review and sign your lease agreement digitally.",
      details: [
        "Review lease terms carefully",
        "Ask questions about anything unclear",
        "Sign the lease electronically",
        "Pay required deposits and fees",
      ],
    },
  ];

  const requirements = [
    {
      icon: "📄",
      title: "Valid ID",
      description: "Government-issued identification document",
    },
    {
      icon: "💰",
      title: "Proof of Income",
      description: "Recent pay slips or bank statements",
    },
    {
      icon: "👤",
      title: "References",
      description: "Contact information for references",
    },
    {
      icon: "🤝",
      title: "Guarantor",
      description: "May be required for some properties",
    },
  ];

  const tips = [
    "Complete your profile fully to increase your chances of approval",
    "Be honest and accurate in all information provided",
    "Respond to landlord messages within 24 hours",
    "Have all documents ready before starting your application",
    "Read property descriptions and lease terms carefully",
    "Ask questions if anything is unclear",
    "Be professional in all communications",
    "Keep copies of all submitted documents",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How to Apply for a Property
          </h1>
          <p className="text-xl text-blue-50">
            Follow these simple steps to submit your rental application
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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

      {/* Requirements Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What You'll Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-200 text-center"
              >
                <div className="text-4xl mb-3">{req.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {req.title}
                </h3>
                <p className="text-sm text-gray-600">{req.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Application Tips
        </h2>
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0"
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
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse thousands of verified properties and apply in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="Browse Properties"
              variant="filled"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/listings")}
            />
            <Button
              label="Create Account"
              variant="outlined"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/auth/register?role=tenant")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToApplyPage;
