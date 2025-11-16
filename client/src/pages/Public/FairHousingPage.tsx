/**
 * FairHousingPage Component
 *
 * Information about fair housing practices and anti-discrimination policies.
 * Fair Housing laws prohibit discrimination in housing based on protected characteristics.
 */

export const FairHousingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fair Housing Policy
          </h1>
          <p className="text-xl text-blue-100">
            Equal Housing Opportunity for All
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Our Commitment */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Commitment to Fair Housing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              GetMeLeased is committed to promoting equal housing opportunities
              and preventing discrimination in all housing transactions. We
              comply with fair housing laws and actively work to ensure that
              everyone has access to housing without facing discrimination.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe that everyone deserves a safe, decent, and affordable
              place to live, regardless of their background or personal
              characteristics.
            </p>
          </section>

          {/* Protected Characteristics */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Protected Characteristics
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              It is illegal to discriminate in housing based on the following
              protected characteristics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: "👥", text: "Race or Color" },
                { icon: "🌍", text: "National Origin or Ethnicity" },
                { icon: "⛪", text: "Religion" },
                { icon: "⚧️", text: "Gender or Sex" },
                { icon: "♿", text: "Disability or Handicap" },
                { icon: "👨‍👩‍👧", text: "Familial Status (having children)" },
                { icon: "💑", text: "Sexual Orientation" },
                { icon: "💍", text: "Marital Status" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Prohibited Actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Prohibited Discriminatory Practices
            </h2>
            <p className="text-gray-700 mb-4">
              Landlords, property managers, and agents are prohibited from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Refusing to rent or show a property based on protected
                characteristics
              </li>
              <li>
                Setting different terms, conditions, or privileges based on
                protected characteristics
              </li>
              <li>
                Falsely claiming a property is not available when it actually is
              </li>
              <li>
                Advertising in a manner that indicates preference or limitation
                based on protected characteristics
              </li>
              <li>
                Refusing to make reasonable accommodations for persons with
                disabilities
              </li>
              <li>Harassing tenants based on protected characteristics</li>
              <li>
                Retaliating against anyone who exercises their fair housing
                rights
              </li>
              <li>
                Intimidating, threatening, or interfering with anyone's fair
                housing rights
              </li>
            </ul>
          </section>

          {/* Tenant Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights as a Tenant
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  You have the right to:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
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
                    <span>Be treated equally when searching for housing</span>
                  </li>
                  <li className="flex items-start gap-2">
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
                    <span>Have the same access to housing as anyone else</span>
                  </li>
                  <li className="flex items-start gap-2">
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
                    <span>
                      Request reasonable accommodations for disabilities
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
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
                    <span>
                      File a complaint if you experience discrimination
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
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
                    <span>
                      Be protected from retaliation for asserting your rights
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Landlord Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Landlord Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">
              As a landlord or property manager, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Treat all applicants fairly and consistently</li>
              <li>
                Use objective, non-discriminatory criteria for tenant selection
              </li>
              <li>
                Make reasonable accommodations for tenants with disabilities
              </li>
              <li>
                Ensure your property listings and advertisements are
                non-discriminatory
              </li>
              <li>
                Maintain properties in compliance with health and safety
                standards
              </li>
              <li>Respond to tenant concerns and repair requests promptly</li>
              <li>Provide equal services and amenities to all tenants</li>
              <li>Train your staff on fair housing laws and practices</li>
            </ul>
          </section>

          {/* Reasonable Accommodations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Reasonable Accommodations for Disabilities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Landlords must make reasonable accommodations and modifications
              for tenants with disabilities, unless doing so would cause undue
              financial or administrative burden.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Examples of Reasonable Accommodations:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Allowing service animals or emotional support animals</li>
                  <li>Providing accessible parking spaces</li>
                  <li>Modifying policies to accommodate disabilities</li>
                  <li>
                    Installing ramps or grab bars (tenant may pay for
                    modifications)
                  </li>
                  <li>Providing documents in alternative formats</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Platform Enforcement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Enforce Fair Housing
            </h2>
            <p className="text-gray-700 mb-4">
              GetMeLeased takes fair housing seriously and enforces these
              principles through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Prohibiting discriminatory language in property listings</li>
              <li>Requiring all users to agree to our fair housing policy</li>
              <li>Investigating reports of discrimination</li>
              <li>Removing listings that violate fair housing laws</li>
              <li>
                Suspending or banning users who engage in discriminatory
                practices
              </li>
              <li>Providing education and resources on fair housing</li>
              <li>
                Cooperating with authorities investigating discrimination claims
              </li>
            </ul>
          </section>

          {/* Reporting Discrimination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Report Discrimination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you believe you have experienced housing discrimination:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  1. Report to GetMeLeased
                </h3>
                <p className="text-gray-700 mb-3">
                  Contact our support team immediately:
                </p>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>📧 Email: fairhousing@getmeleased.com</li>
                  <li>📞 Phone: +234 812 345 6789</li>
                  <li>💬 Use the "Report" button on property listings</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  2. File a Government Complaint
                </h3>
                <p className="text-gray-700 mb-3">
                  You can also file a complaint with relevant housing
                  authorities or human rights commissions in Nigeria. Complaints
                  should be filed within the time limits specified by law.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  3. Seek Legal Assistance
                </h3>
                <p className="text-gray-700">
                  Consider consulting with a lawyer who specializes in housing
                  discrimination cases. You may be entitled to remedies
                  including damages and legal fees.
                </p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For more information about fair housing rights and
              responsibilities:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Nigerian National Human Rights Commission</li>
              <li>Federal Ministry of Housing and Urban Development</li>
              <li>State housing regulatory agencies</li>
              <li>Legal aid organizations specializing in housing rights</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions About Fair Housing?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about fair housing laws or our policies,
              we're here to help:
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li>📧 Email: fairhousing@getmeleased.com</li>
              <li>📞 Phone: +234 812 345 6789</li>
              <li>🌐 Visit our Help Center for more resources</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FairHousingPage;
