/**
 * PrivacyPolicyPage Component
 *
 * Privacy policy explaining how user data is collected and used.
 */

export const PrivacyPolicyPage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At GetMeLeased, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, share, and protect your
              personal information when you use our platform and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our platform, you consent to the practices described in
              this Privacy Policy. If you do not agree with our policies, please
              do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Information You Provide:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Account information (name, email, phone number, password)
                  </li>
                  <li>Profile information (photo, bio, preferences)</li>
                  <li>Identity verification documents (ID, passport)</li>
                  <li>
                    Financial information (bank details, payment information)
                  </li>
                  <li>Property listings and descriptions</li>
                  <li>Messages and communications</li>
                  <li>Application information and documents</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Information Collected Automatically:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and analytics data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Information from Third Parties:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Social media platforms (if you connect your account)</li>
                  <li>Payment processors</li>
                  <li>Background check and verification services</li>
                  <li>Public databases and records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Process rental applications and transactions</li>
              <li>Verify user identities and prevent fraud</li>
              <li>Facilitate communication between users</li>
              <li>Send notifications and updates about your account</li>
              <li>Personalize your experience on our platform</li>
              <li>Analyze usage patterns and improve our services</li>
              <li>Comply with legal obligations</li>
              <li>Enforce our Terms of Service</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* How We Share Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. How We Share Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information with:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Other Users:
                </h3>
                <p className="text-gray-700">
                  When you apply for a property, landlords can see your profile
                  and application details. When you list a property, tenants can
                  see your profile and contact information.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Service Providers:
                </h3>
                <p className="text-gray-700">
                  We work with third-party service providers who help us operate
                  our platform (payment processors, hosting providers, analytics
                  services, etc.).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Legal Requirements:
                </h3>
                <p className="text-gray-700">
                  We may disclose information when required by law, to protect
                  our rights, or to prevent fraud and abuse.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Business Transfers:
                </h3>
                <p className="text-gray-700">
                  If we are involved in a merger, acquisition, or sale of
                  assets, your information may be transferred to the new entity.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your
              information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no system is completely secure. We cannot guarantee
              absolute security of your data.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and information</li>
              <li>Object to processing of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
              <li>Lodge a complaint with data protection authorities</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@getmeleased.com.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to remember your
              preferences, analyze usage, and provide personalized content. You
              can control cookies through your browser settings.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For more information, see our Cookie Policy.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide our
              services and comply with legal obligations. When you delete your
              account, we will delete or anonymize your information, except
              where required by law to retain it.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 18. We do not
              knowingly collect information from children. If you believe we
              have collected information from a child, please contact us
              immediately.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your information in accordance with this Privacy
              Policy.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you
              of material changes via email or platform notification. The "Last
              Updated" date at the top indicates when the policy was last
              revised.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data
              practices, contact us:
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li>Email: privacy@getmeleased.com</li>
              <li>Phone: +234 812 345 6789</li>
              <li>Address: Lagos, Nigeria</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
