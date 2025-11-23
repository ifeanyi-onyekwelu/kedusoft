/**
 * TenantGuidePage Component
 *
 * Comprehensive guide for tenants on renting properties.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

export const TenantGuidePage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Before You Start",
      icon: "📋",
      content: [
        {
          subtitle: "Determine Your Budget",
          points: [
            "Calculate your monthly income and expenses",
            "Rule of thumb: Rent should not exceed 30% of your monthly income",
            "Factor in additional costs (utilities, internet, transportation)",
            "Save for upfront costs (deposit, agreement fee, caution fee)",
          ],
        },
        {
          subtitle: "Know What You Want",
          points: [
            "Location preferences (proximity to work, schools, amenities)",
            "Number of bedrooms and bathrooms needed",
            "Essential amenities (parking, security, generator, etc.)",
            "Preferred lease duration",
          ],
        },
      ],
    },
    {
      title: "Searching for Properties",
      icon: "🔍",
      content: [
        {
          subtitle: "Use Search Filters",
          points: [
            "Filter by location, price range, and property type",
            "Use the map view to explore neighborhoods",
            "Save properties to your favorites",
            "Set up alerts for new listings matching your criteria",
          ],
        },
        {
          subtitle: "Research the Area",
          points: [
            "Check proximity to work, schools, and essential services",
            "Research neighborhood safety and security",
            "Investigate public transportation options",
            "Visit the area at different times of day",
          ],
        },
      ],
    },
    {
      title: "Property Viewing",
      icon: "👀",
      content: [
        {
          subtitle: "Schedule Viewings",
          points: [
            "Contact landlords through the platform",
            "Schedule viewings at convenient times",
            "Ask to see the property during daylight hours",
            "Bring a friend or family member if possible",
          ],
        },
        {
          subtitle: "What to Check",
          points: [
            "Water supply and pressure",
            "Electrical outlets and switches",
            "Plumbing and drainage systems",
            "Windows, doors, and locks",
            "Wall and ceiling condition",
            "Appliances and fixtures (if furnished)",
            "Cell phone signal strength",
            "Noise levels from neighbors",
          ],
        },
      ],
    },
    {
      title: "Application Process",
      icon: "📝",
      content: [
        {
          subtitle: "Required Documents",
          points: [
            "Valid government-issued ID",
            "Proof of income (pay slips, bank statements)",
            "Employment verification letter",
            "Previous landlord reference (if applicable)",
            "Guarantor information",
          ],
        },
        {
          subtitle: "Application Tips",
          points: [
            "Fill out applications completely and honestly",
            "Respond to landlord queries promptly",
            "Be professional in all communications",
            "Keep copies of all submitted documents",
          ],
        },
      ],
    },
    {
      title: "Understanding Your Lease",
      icon: "📄",
      content: [
        {
          subtitle: "Key Lease Terms",
          points: [
            "Lease duration (start and end dates)",
            "Monthly rent amount and payment schedule",
            "Security deposit and caution fee amounts",
            "What utilities are included vs. tenant responsibility",
            "Maintenance responsibilities",
            "Rules about pets, guests, and subletting",
            "Notice period for termination",
          ],
        },
        {
          subtitle: "Before Signing",
          points: [
            "Read the entire lease agreement carefully",
            "Ask questions about anything unclear",
            "Negotiate terms if necessary",
            "Get everything in writing",
            "Keep a copy of the signed lease",
          ],
        },
      ],
    },
    {
      title: "Move-In Checklist",
      icon: "✅",
      content: [
        {
          subtitle: "Before Moving In",
          points: [
            "Document property condition with photos/videos",
            "Test all appliances and utilities",
            "Check for existing damages and report them",
            "Confirm all agreed repairs are completed",
            "Get keys and access codes",
          ],
        },
        {
          subtitle: "After Moving In",
          points: [
            "Update your address with relevant institutions",
            "Set up utilities in your name (if required)",
            "Install renter's insurance (recommended)",
            "Introduce yourself to neighbors",
            "Keep landlord's contact information handy",
          ],
        },
      ],
    },
    {
      title: "During Your Tenancy",
      icon: "🏠",
      content: [
        {
          subtitle: "Your Responsibilities",
          points: [
            "Pay rent on time every month",
            "Report maintenance issues promptly",
            "Keep the property clean and well-maintained",
            "Respect neighbors and property rules",
            "Don't make unauthorized alterations",
            "Give proper notice before moving out",
          ],
        },
        {
          subtitle: "Your Rights",
          points: [
            "Right to a habitable living space",
            "Right to privacy (with proper notice for landlord visits)",
            "Right to have repairs done in a timely manner",
            "Protection from unlawful eviction",
            "Return of security deposit (minus legitimate deductions)",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tenant's Guide
          </h1>
          <p className="text-xl text-green-50">
            Everything you need to know about renting a property
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {sections.map((section, index) => (
            <div key={index} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">{section.icon}</div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-8">
                {section.content.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {item.subtitle}
                    </h3>
                    <ul className="space-y-2">
                      {item.points.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
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
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need More Help?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is here to assist you throughout your rental
            journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="Contact Support"
              variant="filled"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigate("/contact")}
            />
            <Button
              label="View FAQs"
              variant="outlined"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => navigate("/faqs")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantGuidePage;
