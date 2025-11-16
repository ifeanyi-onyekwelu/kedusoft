/**
 * FAQsPage Component
 *
 * Frequently Asked Questions for tenants and landlords.
 */

import { useState } from "react";

export const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"tenants" | "landlords">(
    "tenants"
  );

  const tenantFAQs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on 'Sign Up' in the top navigation, select 'Tenant' as your role, fill in your details, and verify your email address. Once verified, you can start browsing properties immediately.",
    },
    {
      question: "Is the platform free to use?",
      answer:
        "Yes, creating an account and browsing properties is completely free for tenants. There are no hidden fees for viewing listings or submitting applications.",
    },
    {
      question: "How do I apply for a property?",
      answer:
        "Once you find a property you like, click the 'Apply Now' button. You'll need to fill out an application form and upload required documents like your ID, proof of income, and references.",
    },
    {
      question: "What documents do I need to apply?",
      answer:
        "Typically, you'll need: a valid government-issued ID, proof of income (pay slips or bank statements), employment verification, and possibly a guarantor's information. Specific requirements may vary by property.",
    },
    {
      question: "How long does the application process take?",
      answer:
        "Application review times vary by landlord, but most respond within 2-5 business days. You'll receive notifications about your application status through email and your dashboard.",
    },
    {
      question: "Can I apply for multiple properties?",
      answer:
        "Yes, you can submit applications for multiple properties simultaneously. However, be mindful that you may need to pay application fees for each property (if applicable).",
    },
    {
      question: "What happens after my application is approved?",
      answer:
        "Once approved, you'll receive a lease agreement to review and sign digitally. You'll then need to pay the required deposits and fees before moving in.",
    },
    {
      question: "How do I pay rent?",
      answer:
        "Rent payments can be made through the platform using bank transfer or card payment. You'll receive automatic reminders before your rent is due.",
    },
    {
      question: "Can I cancel my application?",
      answer:
        "Yes, you can withdraw your application at any time before it's approved. Simply go to your dashboard, find the application, and click 'Withdraw Application.'",
    },
    {
      question: "What if I have issues with the property?",
      answer:
        "Report any maintenance issues directly to your landlord through the messaging system. For urgent issues, contact your landlord by phone. Keep all communication documented on the platform.",
    },
  ];

  const landlordFAQs = [
    {
      question: "How do I list my property?",
      answer:
        "After creating a landlord account, go to your dashboard and click 'Add Property.' Fill in the property details, upload photos, set your price, and submit for verification. Approved listings go live within 24-48 hours.",
    },
    {
      question: "How much does it cost to list properties?",
      answer:
        "Creating an account and listing your first few properties is free. We offer different pricing plans for landlords managing multiple properties or requiring premium features.",
    },
    {
      question: "How do I screen potential tenants?",
      answer:
        "When you receive an application, you can review the tenant's profile, documents, and references. You can also request additional information or schedule an interview before making a decision.",
    },
    {
      question: "Can I manage multiple properties?",
      answer:
        "Yes, our platform is designed to help you manage unlimited properties from a single dashboard. You can track applications, communicate with tenants, and monitor payments all in one place.",
    },
    {
      question: "How do I create a lease agreement?",
      answer:
        "Once you approve an application, you can generate a lease agreement using our templates or upload your own. The tenant will receive it digitally for review and signature.",
    },
    {
      question: "How do I receive rent payments?",
      answer:
        "Tenants can pay rent through the platform, and funds are transferred directly to your linked bank account. You'll receive notifications for all payments and can track payment history.",
    },
    {
      question: "What if a tenant doesn't pay rent?",
      answer:
        "The platform will send automatic reminders to tenants. You can also send payment reminders through the messaging system. For persistent non-payment, you may need to follow legal eviction processes.",
    },
    {
      question: "Can I edit my property listing?",
      answer:
        "Yes, you can update your listing at any time. Go to 'My Properties' in your dashboard, select the property, and click 'Edit.' Changes will be reflected immediately after saving.",
    },
    {
      question: "How do I remove a property listing?",
      answer:
        "You can deactivate or delete your listing from your dashboard. Deactivated listings are hidden but can be reactivated later. Deleted listings are permanently removed.",
    },
    {
      question: "What support is available for landlords?",
      answer:
        "We offer 24/7 customer support via email and phone. You also have access to our resource center with guides on property management, legal requirements, and best practices.",
    },
  ];

  const generalFAQs = [
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we use bank-level encryption to protect your data. All personal information and documents are stored securely and never shared without your permission.",
    },
    {
      question: "How do I verify my account?",
      answer:
        "After signing up, verify your email address by clicking the link sent to your inbox. For enhanced security, you can also enable two-factor authentication in your account settings.",
    },
    {
      question: "Can I use the platform on my mobile device?",
      answer:
        "Yes, our platform is fully responsive and works on all devices. We also have mobile apps available for iOS and Android for a better mobile experience.",
    },
    {
      question: "What if I forget my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email address, and you'll receive a link to reset your password. Make sure to check your spam folder if you don't see the email.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our support team via email at support@getmeleased.com, call us at +234 812 345 6789, or use the live chat feature in your dashboard.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account from the settings page. Please note that this action is permanent and all your data will be removed from our system.",
    },
  ];

  const activeFAQs = activeTab === "tenants" ? tenantFAQs : landlordFAQs;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-100">
            Find answers to common questions about using our platform
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => {
                setActiveTab("tenants");
                setOpenIndex(null);
              }}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === "tenants"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              For Tenants
            </button>
            <button
              onClick={() => {
                setActiveTab("landlords");
                setOpenIndex(null);
              }}
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

      {/* FAQs Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {activeFAQs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* General FAQs */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            General Questions
          </h2>
          <div className="space-y-4">
            {generalFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(
                      openIndex === index + 1000 ? null : index + 1000
                    )
                  }
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      openIndex === index + 1000 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index + 1000 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find the answer you're looking for? Our support team is here
            to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@getmeleased.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+2348123456789"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
