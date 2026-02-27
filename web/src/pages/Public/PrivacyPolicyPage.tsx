/**
 * PrivacyPolicyPage Component
 * Comprehensive legal content compliant with NDPR/GDPR standards.
 */

export const PrivacyPolicyPage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header - Solid Navy */}
      <div className="bg-[#0f172a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="h-px w-8 bg-blue-500"></span>
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Last updated: {lastUpdated}
            </p>
            <span className="h-px w-8 bg-blue-500"></span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          {/* Section 1: Introduction */}
          <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. Introduction & Scope
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              LetsTen("we," "us," or "our") operates as a Data Controller. We
              are committed to protecting your personal data in accordance with
              the <strong>Nigeria Data Protection Regulation (NDPR)</strong>.
              This policy describes how we handle information collected through
              our web platform, mobile applications, and related services.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Section 2: Data Collection Categories */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-full"></span>
                2. Data We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-gray-100 rounded-lg bg-white shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">
                    Identifiable Information
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 italic">
                    Provided directly by you:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                    <li>Full Name and Government-issued ID numbers.</li>
                    <li>Contact details (Email, Phone, Physical Address).</li>
                    <li>
                      Financial data (Bank Verification Number, if applicable,
                      and payment tokens).
                    </li>
                    <li>
                      Employment history and income proof for lease
                      applications.
                    </li>
                  </ul>
                </div>
                <div className="p-5 border border-gray-100 rounded-lg bg-white shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">
                    Technical & Usage Data
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 italic">
                    Collected automatically:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                    <li>IP Address and Geolocation data.</li>
                    <li>Device metadata (Browser type, Operating System).</li>
                    <li>
                      Interaction logs (Search history, clicked listings).
                    </li>
                    <li>Referral sources and exit pages.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Legal Basis */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                3. Legal Basis for Processing
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Under NDPR, we process your data based on:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Contractual Necessity",
                    desc: "To facilitate lease agreements between you and landlords.",
                  },
                  {
                    title: "Consent",
                    desc: "Where you have opted-in to receive marketing or shared location data.",
                  },
                  {
                    title: "Legal Obligation",
                    desc: "To comply with anti-money laundering (AML) and KYC regulations.",
                  },
                  {
                    title: "Legitimate Interest",
                    desc: "To detect fraud and maintain platform security.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-3 bg-gray-50 rounded border-l-4 border-blue-500"
                  >
                    <span className="font-bold text-gray-900 text-xs">
                      {item.title}
                    </span>
                    <span className="text-gray-600 text-xs">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Data Sharing */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                4. Third-Party Disclosures
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We do not sell your personal data. We share information only
                with:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 pl-5 list-decimal">
                <li>
                  <strong>Verified Landlords:</strong> When you submit a lease
                  application.
                </li>
                <li>
                  <strong>Payment Processors:</strong> Such as Paystack or
                  Flutterwave to handle transactions.
                </li>
                <li>
                  <strong>Verification Services:</strong> To validate identity
                  documents and creditworthiness.
                </li>
                <li>
                  <strong>Law Enforcement:</strong> When required by a valid
                  court order or statutory requirement.
                </li>
              </ul>
            </section>

            {/* Section 5: Rights (Critical for Compliance) */}
            <section className="bg-gray-900 rounded-xl p-8 text-white">
              <h2 className="text-xl font-bold mb-4">
                5. Your Data Subject Rights
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                You have the following rights regarding your data:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[10px] uppercase font-bold tracking-widest text-center">
                <div className="p-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                  Right to Access
                </div>
                <div className="p-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                  Right to Rectify
                </div>
                <div className="p-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                  Right to Erasure
                </div>
                <div className="p-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                  Data Portability
                </div>
                <div className="p-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                  Object to Processing
                </div>
                <div className="p-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                  Withdraw Consent
                </div>
              </div>
            </section>

            {/* Section 6: Retention */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We retain personal data for as long as your account is active or
                as needed to provide services. Legislative requirements (such as
                tax laws or AML regulations) may require us to hold certain
                records for up to <strong>7 years</strong> after account
                deactivation.
              </p>
            </section>

            {/* Contact Section */}
            <section className="pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Contact Our Data Protection Officer (DPO)
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                For requests related to your data rights or to report a breach:
              </p>
              <div className="inline-flex flex-col space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center text-blue-900 font-semibold text-sm">
                  <span className="text-blue-500 italic mr-2">Email:</span>{" "}
                  dpo@letsten.com
                </div>
                <div className="text-blue-900 text-xs">
                  Subject Line: "Data Subject Access Request"
                </div>
              </div>
            </section>
          </div>

          <div className="bg-gray-50 p-6 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            © 2025 LetsTenLegal Dept. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
