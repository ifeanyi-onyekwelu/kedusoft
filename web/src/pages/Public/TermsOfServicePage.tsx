/**
 * TermsOfServicePage Component
 * Updated with comprehensive legal clauses and professional "Legal Paper" UI.
 */

export const TermsOfServicePage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header - Solid Navy */}
      <div className="bg-[#0f172a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="h-px w-8 bg-blue-500"></span>
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Effective Date: {lastUpdated}
            </p>
            <span className="h-px w-8 bg-blue-500"></span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          {/* Agreement Notice */}
          <div className="p-8 md:p-12 border-b border-gray-100 bg-blue-50/30">
            <h2 className="text-xl font-bold text-gray-900 mb-4 underline decoration-blue-500 underline-offset-8">
              User Agreement
            </h2>
            <p className="text-gray-600 leading-relaxed italic text-sm">
              Please read these terms carefully. LetsTen("the Platform")
              provides a digital marketplace connecting landlords and tenants.
              By creating an account or accessing our services, you enter into a
              legally binding agreement. If you do not agree to these terms, you
              must immediately cease all use of the Platform.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Section 01: Platform Role */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm mr-3 font-mono">
                  01
                </span>
                Nature of Service
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed pl-11">
                LetsTenacts solely as a neutral venue. We are{" "}
                <strong>not</strong> a real estate agent, landlord, or property
                manager. We do not own, inspect, or manage the properties
                listed. Any lease agreement formed is strictly between the User
                (Tenant) and the Property Provider (Landlord). We are not a
                party to any rental contract.
              </p>
            </section>

            {/* Section 02: User Eligibility */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm mr-3 font-mono">
                  02
                </span>
                Eligibility & Registration
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed pl-11">
                You must be at least 18 years old to use this Platform. You
                agree to provide accurate, current, and complete information
                during registration. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
            </section>

            {/* Section 03: Prohibited Conduct */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm mr-3 font-mono">
                  03
                </span>
                Acceptable Use Policy
              </h2>
              <div className="pl-11 space-y-4">
                <p className="text-gray-600 text-sm">
                  Users are strictly prohibited from:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Posting fraudulent or bait-and-switch listings",
                    "Discriminating based on race, religion, or gender",
                    "Scraping or data-mining platform content",
                    "Circumventing platform fees via offline payments",
                    "Impersonating legal property owners",
                    "Harassing other users or staff",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="text-[10px] font-bold text-red-700 bg-red-50 p-2 rounded border border-red-100 uppercase tracking-tight"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 04: Fees and Payments */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm mr-3 font-mono">
                  04
                </span>
                Financial Transactions
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed pl-11">
                Access to certain features or listings may require payment of a
                service fee. All fees paid to LetsTenare{" "}
                <strong>non-refundable</strong> unless otherwise specified in
                writing. We use third-party processors (e.g., Paystack/Stripe);
                we do not store full credit card details on our servers.
              </p>
            </section>

            {/* Section 05: Disclaimer of Warranties */}
            <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                5. Limitation of Liability
              </h2>
              <p className="text-gray-600 text-[11px] leading-relaxed uppercase font-bold tracking-tight">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                LetsTenDISCLAIMS ALL LIABILITY FOR PROPERTY DAMAGE, PERSONAL
                INJURY, OR FINANCIAL LOSS ARISING FROM LISTINGS POSTED BY THIRD
                PARTIES. WE DO NOT GUARANTEE THAT A LISTING IS CURRENT,
                ACCURATE, OR AUTHORIZED BY THE OWNER. USERS PROCEED AT THEIR OWN
                RISK.
              </p>
            </section>

            {/* Section 06: Intellectual Property */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm mr-3 font-mono">
                  06
                </span>
                Intellectual Property
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed pl-11">
                By uploading photos or descriptions, you grant LetsTena
                perpetual, royalty-free license to use, reproduce, and display
                that content for marketing and operational purposes. All
                platform software, logos, and designs remain the exclusive
                property of letsten.
              </p>
            </section>

            {/* Section 07: Governing Law */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm mr-3 font-mono">
                  07
                </span>
                Governing Law & Disputes
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed pl-11">
                These terms shall be governed by the laws of the Federal
                Republic of Nigeria. Any disputes arising from these terms that
                cannot be settled amicably shall be subject to the exclusive
                jurisdiction of the courts in Lagos State.
              </p>
            </section>

            {/* Final Contact Section */}
            <section className="pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Questions or Notices
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                If you have questions regarding these Terms or need to report a
                fraudulent listing, please contact our legal department:
              </p>
              <div className="flex flex-col space-y-2">
                <a
                  href="mailto:legal@letsten.com"
                  className="text-blue-600 font-bold hover:underline flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  legal@letsten.com
                </a>
                <span className="text-gray-500 text-sm font-mono">
                  +234 (0) 800-GET-LEASE
                </span>
              </div>
            </section>
          </div>

          {/* Footer Bar */}
          <div className="bg-gray-900 p-4 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            Official Electronic Record — LetsTenTerms of Service v1.2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
