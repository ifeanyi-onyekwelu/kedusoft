import { useState } from "react";

export const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "tenants" | "landlords" | "security"
  >("tenants");

  const tenantFAQs = [
    {
      question: "How does the identity verification process work?",
      answer:
        "To ensure safety, we require all tenants to upload a government-issued ID and a live 'selfie' for AI-matching. This verification badge is shown to landlords to increase your chances of approval. Your data is encrypted and never shared directly with third parties without consent.",
    },
    {
      question: "Are security deposits handled through GetMeLeased?",
      answer:
        "Yes. For participating listings, we offer an Escrow-style service where deposits are held securely until the move-in inspection is completed and both parties sign off. This protects tenants from 'fake landlord' scams.",
    },
    {
      question: "What happens if a property doesn't match the listing photos?",
      answer:
        "We have a 24-hour 'Inspection Guarantee.' If you arrive and the property is significantly different from the listing, you can report it via the dashboard to pause fund disbursement and initiate a refund or dispute resolution.",
    },
    {
      question: "Can I pay my rent in installments?",
      answer:
        "While the standard lease requires monthly payments, some 'Verified Premium' landlords offer flexible payment plans. You can filter your search for 'Installment Friendly' properties.",
    },
  ];

  const landlordFAQs = [
    {
      question: "How do you protect me from fraudulent tenants?",
      answer:
        "Every tenant application includes a 'Trust Score' based on ID verification, previous landlord references on our platform, and optional credit-linking. We filter out unverified profiles before they can message you.",
    },
    {
      type: "FEES",
      question: "What are the service fees for listing a property?",
      answer:
        "Listing a basic property is free. We charge a small success fee (2.5%) only when a lease is successfully signed through the platform. This covers the cost of digital contract signing and payment processing.",
    },
    {
      question: "How long does it take for rent to reach my bank account?",
      answer:
        "Once a tenant pays via the platform, funds are processed immediately. Depending on your bank, the transfer typically reflects in your linked account within 12–24 business hours.",
    },
    {
      question: "Does the platform handle legal eviction notices?",
      answer:
        "We provide legally-vetted templates for 'Notice to Quit' and other formal communications in accordance with local tenancy laws. However, GetMeLeased does not provide legal representation in court.",
    },
  ];

  const securityFAQs = [
    {
      question: "How do I report a suspicious listing?",
      answer:
        "Every listing has a 'Report' flag. If a landlord asks for payment outside the platform before an inspection, report them immediately. Our safety team reviews flagged listings within 2 hours.",
    },
    {
      question: "How is my financial information protected?",
      answer:
        "We use PCI-DSS compliant payment gateways (Paystack/Stripe). GetMeLeased never stores your full card numbers or BVN on our local servers.",
    },
  ];

  const getActiveContent = () => {
    if (activeTab === "tenants") return tenantFAQs;
    if (activeTab === "landlords") return landlordFAQs;
    return securityFAQs;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header - Consistent with Legal Pages */}
      <div className="bg-[#0f172a] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Support Center
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about leasing, payments, and safety on
            GetMeLeased.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        {/* Tab Navigation - Solid & Professional */}
        <div className="flex bg-white rounded-t-xl border-x border-t border-gray-200 overflow-hidden shadow-sm">
          {[
            { id: "tenants", label: "For Tenants" },
            { id: "landlords", label: "For Landlords" },
            { id: "security", label: "Safety & Trust" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setOpenIndex(null);
              }}
              className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "bg-gray-50 text-gray-500 border-b border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white shadow-xl border border-gray-200 rounded-b-xl overflow-hidden">
          <div className="p-6 md:p-12">
            <div className="space-y-4">
              {getActiveContent().map((faq, index) => (
                <div
                  key={index}
                  className={`border ${
                    openIndex === index
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-gray-200"
                  } rounded-lg transition-all`}
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full px-6 py-5 text-left flex items-start justify-between"
                  >
                    <div className="flex">
                      <span className="text-blue-600 font-mono font-bold mr-4">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                      <span className="font-bold text-gray-900 leading-tight">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className={`ml-4 mt-1 flex-shrink-0 text-blue-500 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>

                  {openIndex === index && (
                    <div className="px-16 pb-6 text-sm text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1">
                      <div className="h-px bg-blue-100 mb-4 w-full" />
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Support CTA */}
            <div className="mt-16 p-8 bg-gray-900 rounded-2xl text-center">
              <h3 className="text-white text-xl font-bold mb-2">
                Still need help?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Our legal and support teams are available 24/7 for urgent
                matters.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:support@getmeleased.com"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
                >
                  Email Support
                </a>
                <a
                  href="tel:+234800GETLEASE"
                  className="bg-transparent border border-gray-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors text-sm"
                >
                  Request a Callback
                </a>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.3em]">
              Documentation Reference: FAQ-V2-2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
