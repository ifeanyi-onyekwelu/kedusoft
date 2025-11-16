/**
 * TermsOfServicePage Component
 *
 * Terms and conditions for using the platform.
 */

export const TermsOfServicePage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
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
              Welcome to GetMeLeased. These Terms of Service ("Terms") govern
              your access to and use of our platform, website, and services. By
              accessing or using our services, you agree to be bound by these
              Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree to these Terms, please do not use our
              services. We reserve the right to update these Terms at any time,
              and your continued use of the platform constitutes acceptance of
              any changes.
            </p>
          </section>

          {/* Account Registration */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Account Registration
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You must be at least 18 years old to create an account</li>
              <li>
                You must provide accurate and complete information during
                registration
              </li>
              <li>
                You are responsible for maintaining the security of your account
                credentials
              </li>
              <li>
                You must notify us immediately of any unauthorized access to
                your account
              </li>
              <li>One person or entity may not maintain multiple accounts</li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these Terms
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Responsibilities
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  For Tenants:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide truthful information in rental applications</li>
                  <li>Honor lease agreements once signed</li>
                  <li>Communicate respectfully with landlords</li>
                  <li>Report issues or violations through proper channels</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  For Landlords:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate property information and photos</li>
                  <li>
                    Comply with all applicable housing laws and regulations
                  </li>
                  <li>Respond to tenant inquiries in a timely manner</li>
                  <li>Maintain properties in habitable condition</li>
                  <li>Not discriminate based on protected characteristics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Prohibited Activities
            </h2>
            <p className="text-gray-700 mb-4">
              You may not use our platform to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Post false, misleading, or fraudulent listings</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute spam, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or collect data</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </section>

          {/* Property Listings */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Property Listings
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Landlords are solely responsible for the accuracy of their
              property listings. We verify basic information but do not
              guarantee the accuracy of all listing details. Tenants should
              conduct their own due diligence before renting any property.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to remove any listing that violates these
              Terms or applicable laws.
            </p>
          </section>

          {/* Payments and Fees */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Payments and Fees
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>All fees are clearly disclosed before you incur them</li>
              <li>
                Payment processing is handled securely through third-party
                providers
              </li>
              <li>
                Refund policies vary by service and are specified at time of
                purchase
              </li>
              <li>
                You are responsible for any taxes associated with your use of
                the platform
              </li>
              <li>
                We reserve the right to change our fee structure with notice
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The platform, including its design, code, content, and trademarks,
              is owned by GetMeLeased and protected by intellectual property
              laws. You may not copy, modify, or distribute our content without
              permission.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By posting content on our platform, you grant us a license to use,
              display, and distribute that content as necessary to provide our
              services.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Disclaimers and Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform is provided "as is" without warranties of any kind.
              We do not guarantee uninterrupted access, error-free operation, or
              specific results from using our services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are not a party to rental agreements between landlords and
              tenants. We are not responsible for disputes, damages, or losses
              arising from rental transactions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our liability is limited to the maximum extent permitted by law.
              We are not liable for indirect, incidental, or consequential
              damages.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Dispute Resolution
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have a dispute with another user, please attempt to resolve
              it directly. We may provide support but are not obligated to
              mediate disputes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Any disputes with GetMeLeased will be governed by Nigerian law and
              resolved in Nigerian courts.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may terminate your account at any time through your account
              settings. We may suspend or terminate your account if you violate
              these Terms or engage in fraudulent activity.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the platform ceases
              immediately. We may retain certain information as required by law.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms periodically. We will notify you of
              material changes via email or platform notification. Your
              continued use after changes constitutes acceptance of the new
              Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li>Email: legal@getmeleased.com</li>
              <li>Phone: +234 812 345 6789</li>
              <li>Address: Lagos, Nigeria</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
