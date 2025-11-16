/**
 * CookiePolicyPage Component
 *
 * Explains how cookies and tracking technologies are used.
 */

export const CookiePolicyPage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files stored on your device when you visit
              our website. They help us recognize your device, remember your
              preferences, and provide you with a better experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Similar technologies include web beacons, pixels, and local
              storage, which we collectively refer to as "cookies" in this
              policy.
            </p>
          </section>

          {/* Why We Use Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Why We Use Cookies
            </h2>
            <p className="text-gray-700 mb-4">We use cookies to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services and features</li>
              <li>Provide personalized content and recommendations</li>
              <li>Analyze traffic and usage patterns</li>
              <li>Prevent fraud and enhance security</li>
              <li>Display relevant advertisements</li>
            </ul>
          </section>

          {/* Types of Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Types of Cookies We Use
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Essential Cookies (Required)
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies are necessary for the platform to function
                  properly. They enable core features like security,
                  authentication, and accessibility.
                </p>
                <p className="text-sm text-gray-600">
                  Examples: Session management, authentication tokens, security
                  cookies
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Functional Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies remember your choices and preferences to provide
                  enhanced features and personalization.
                </p>
                <p className="text-sm text-gray-600">
                  Examples: Language preferences, saved searches, favorite
                  properties, display settings
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies help us understand how visitors interact with
                  our platform by collecting anonymous information about usage
                  patterns.
                </p>
                <p className="text-sm text-gray-600">
                  Examples: Google Analytics, page views, click tracking, time
                  spent on pages
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  These cookies track your activity across websites to display
                  relevant advertisements and measure the effectiveness of our
                  marketing campaigns.
                </p>
                <p className="text-sm text-gray-600">
                  Examples: Facebook Pixel, Google Ads, retargeting cookies,
                  conversion tracking
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Third-Party Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We work with third-party service providers who may set cookies on
              our platform. These providers have their own privacy policies
              governing their use of cookies.
            </p>
            <p className="text-gray-700 mb-4">
              Third parties we work with include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Google Analytics:</strong> Website analytics and usage
                tracking
              </li>
              <li>
                <strong>Payment Processors:</strong> Secure payment processing
              </li>
              <li>
                <strong>Social Media Platforms:</strong> Social sharing and
                login features
              </li>
              <li>
                <strong>Advertising Networks:</strong> Targeted advertising and
                remarketing
              </li>
              <li>
                <strong>Customer Support Tools:</strong> Live chat and support
                features
              </li>
            </ul>
          </section>

          {/* Cookie Duration */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. How Long Do Cookies Last?
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Session Cookies:
                </h3>
                <p className="text-gray-700">
                  Temporary cookies that are deleted when you close your
                  browser. Used for essential functions like maintaining your
                  login session.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Persistent Cookies:
                </h3>
                <p className="text-gray-700">
                  Cookies that remain on your device until they expire or you
                  delete them. Duration varies from a few days to several years,
                  depending on the cookie type.
                </p>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. How to Manage Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Browser Settings:
                </h3>
                <p className="text-gray-700 mb-3">
                  Most browsers allow you to view, delete, and block cookies
                  through their settings. Here's how to manage cookies in
                  popular browsers:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and Security →
                    Cookies
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options → Privacy & Security →
                    Cookies
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Cookies
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Privacy & Security →
                    Cookies
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Opt-Out Tools:
                </h3>
                <p className="text-gray-700">
                  You can opt out of certain third-party cookies through
                  industry opt-out pages or browser extensions like Privacy
                  Badger or uBlock Origin.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Platform Settings:
                </h3>
                <p className="text-gray-700">
                  You can manage some cookie preferences through your account
                  settings on our platform.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Blocking or deleting cookies may affect
                your experience on our platform. Some features may not work
                properly without cookies enabled.
              </p>
            </div>
          </section>

          {/* Do Not Track */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Do Not Track Signals
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers have a "Do Not Track" feature that signals websites
              you visit that you do not want to be tracked. Currently, there is
              no universal standard for how to respond to these signals. We do
              not alter our practices when we receive a Do Not Track signal.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Updates to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in technology or legal requirements. The "Last Updated"
              date at the top indicates when the policy was last revised. We
              encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Questions?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li>Email: privacy@getmeleased.com</li>
              <li>Phone: +234 812 345 6789</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
