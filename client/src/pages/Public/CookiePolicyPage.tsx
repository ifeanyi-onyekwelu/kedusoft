/**
 * CookiePolicyPage Component
 * Detailed technical breakdown of cookie usage and user control.
 */

export const CookiePolicyPage = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-[#0f172a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Cookie Policy
          </h1>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="h-px w-8 bg-blue-500"></span>
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Version 1.1
            </p>
            <span className="h-px w-8 bg-blue-500"></span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              Cookies are small data fragments stored on your browser. They
              enable LetsTento remember your login status, saved properties, and
              preference settings across different sessions.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Section 2: Cookie Categories Table */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-full"></span>
                2. Categories of Cookies We Use
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 font-bold text-gray-900">Type</th>
                      <th className="py-3 font-bold text-gray-900">Purpose</th>
                      <th className="py-3 font-bold text-gray-900">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-50">
                      <td className="py-4 font-semibold text-blue-600">
                        Strictly Necessary
                      </td>
                      <td className="py-4">
                        Essential for login, security, and load balancing.
                      </td>
                      <td className="py-4 italic">Session</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-4 font-semibold text-blue-600">
                        Performance/Analytics
                      </td>
                      <td className="py-4">
                        Anonymous tracking of site traffic (Google Analytics).
                      </td>
                      <td className="py-4 italic">2 Years</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-4 font-semibold text-blue-600">
                        Functionality
                      </td>
                      <td className="py-4">
                        Remembers your dark mode settings and language.
                      </td>
                      <td className="py-4 italic">1 Year</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-semibold text-blue-600">
                        Targeting/Adverts
                      </td>
                      <td className="py-4">
                        Used to show you relevant property listings via
                        Facebook/Google.
                      </td>
                      <td className="py-4 italic">90 Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Third Party Cookies */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                3. Third-Party Technologies
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                We also use web beacons and pixels from the following partners:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Google Analytics",
                  "Hotjar",
                  "Facebook Pixel",
                  "Intercom",
                  "Paystack",
                ].map((partner) => (
                  <span
                    key={partner}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </section>

            {/* Section 4: Management */}
            <section className="bg-gray-900 rounded-xl p-8 text-white">
              <h2 className="text-xl font-bold mb-4 text-center">
                How to Opt-Out
              </h2>
              <p className="text-gray-400 text-xs text-center mb-8 px-4">
                You can change your cookie settings within your browser. Note
                that blocking essential cookies will prevent the platform from
                functioning correctly.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="#"
                  className="p-2 border border-gray-700 rounded text-center text-[10px] hover:border-blue-500 transition-colors uppercase"
                >
                  Chrome Settings
                </a>
                <a
                  href="#"
                  className="p-2 border border-gray-700 rounded text-center text-[10px] hover:border-blue-500 transition-colors uppercase"
                >
                  Safari Privacy
                </a>
                <a
                  href="#"
                  className="p-2 border border-gray-700 rounded text-center text-[10px] hover:border-blue-500 transition-colors uppercase"
                >
                  Firefox Options
                </a>
                <a
                  href="#"
                  className="p-2 border border-gray-700 rounded text-center text-[10px] hover:border-blue-500 transition-colors uppercase"
                >
                  Edge Privacy
                </a>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-xs">
                For a more detailed list of specific cookies used, please email
                <span className="text-blue-600 font-bold ml-1">
                  privacy@letsten.com
                </span>
              </p>
            </section>
          </div>

          <div className="bg-gray-50 p-6 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            © 2025 LetsTenCookie Policy v1.1
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
