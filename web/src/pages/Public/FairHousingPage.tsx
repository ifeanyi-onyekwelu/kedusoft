import React from "react";
import {
  ShieldCheck,
  Scale,
  AlertCircle,
  Info,
  Mail,
  Phone,
  FileText,
  UserCheck,
} from "lucide-react";

/**
 * Professional Fair Housing Page - MVP Version
 * Focus: High Trust, Clean UI, No Gradients.
 */
export const FairHousingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Official Header Section */}
      <header className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-lg mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Fair Housing Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Our commitment to ensuring a rental marketplace free from
            discrimination, aligned with international standards and the
            Constitution of the Federal Republic of Nigeria.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Section: Core Policy */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-gray-500" />
                The Core Policy
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 leading-7">
                  LetsTenoperates on a zero-tolerance policy regarding housing
                  discrimination. Every person seeking a safe place to live
                  deserves to be evaluated based on
                  <strong> factual eligibility criteria</strong>—such as
                  creditworthiness and rental history—rather than personal
                  identity or background.
                </p>
              </div>
            </section>

            {/* Section: Protected Classes */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Non-Discrimination Standards
              </h2>
              <p className="text-gray-600 mb-6">
                It is strictly prohibited to discriminate, harass, or provide
                differential service based on:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Race, Color or Ethnicity",
                  "National Origin",
                  "Religious Beliefs",
                  "Gender or Sex",
                  "Disability (Physical or Mental)",
                  "Familial Status (Children)",
                  "Marital Status",
                  "Source of Income",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3" />
                    {text}
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Prohibited Actions */}
            <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  Prohibited Actions
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Refusal to Deal",
                      desc: "Refusing to rent, sell, or negotiate with any person.",
                    },
                    {
                      title: "Differential Terms",
                      desc: "Applying different lease terms or security deposits.",
                    },
                    {
                      title: "Discriminatory Advertising",
                      desc: "Using language that indicates preference or exclusion.",
                    },
                    {
                      title: "Reasonable Accommodation",
                      desc: "Refusing to allow modifications for persons with disabilities.",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-blue-600 font-bold text-sm leading-6 uppercase">
                        0{i + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1 leading-6">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Card: Reporting */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Report a Violation
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                If you believe a listing or landlord on our platform is in
                violation of these policies, report it immediately.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:fairhousing@letsten.com"
                  className="flex items-center gap-3 text-sm hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  fairhousing@letsten.com
                </a>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  +234 812 345 6789
                </div>
              </div>
              <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all">
                Submit Formal Report
              </button>
            </div>

            {/* Card: Official Resources */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Legal Resources
              </h3>
              <ul className="space-y-3">
                {[
                  "National Human Rights Commission",
                  "Federal Ministry of Housing",
                  "Lagos State Rental Laws",
                  "Legal Aid Council Nigeria",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 group font-medium"
                    >
                      {item}
                      <FileText className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card: Landlord Badge */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <UserCheck className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-blue-900 text-sm">
                Are you a Landlord?
              </h3>
              <p className="text-blue-800 text-xs mt-2 leading-relaxed">
                Ensure your listings are compliant. Non-compliant listings are
                automatically flagged and removed by our system.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            Disclaimer: This policy is for informational purposes and does not
            constitute legal advice. LetsTenis not a government agency. For
            legal protection, consult with a qualified legal practitioner.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FairHousingPage;
