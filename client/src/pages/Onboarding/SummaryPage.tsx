import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import {
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
  FaCouch,
} from "react-icons/fa";

export default function SummaryPage() {
  const navigate = useNavigate();
  const { preferences, submitPreferences } = useOnboarding();

  // Format currency (Naira only)
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Payment frequency label
  const getPaymentFrequencyLabel = () => {
    switch (preferences.paymentFrequency) {
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      case "annually":
        return "Annually";
      default:
        return preferences.paymentFrequency;
    }
  };

  // Submit preferences and go to completion page
  const handleSubmit = async () => {
    try {
      const response = await submitPreferences();
      console.log("Reponse", response);
      navigate("/onboarding/complete"); // Navigate to completion animation
    } catch (err) {
      // Handle error (show toast, etc)
      console.log("Error submiting onboarding preferences", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FaHome className="text-2xl text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Your Perfect Home Blueprint
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review your preferences below. We'll use this information to find
          properties that match your exact needs.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Location & Vibe */}
        <div className="space-y-6">
          {/* Locations Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Preferred Areas
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.locations.map((location) => (
                <span
                  key={location}
                  className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium border"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>

          {/* Vibe Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Lifestyle Preference
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.vibe.map((vibe) => (
                <span
                  key={vibe}
                  className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Features */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCouch className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Essential Features
              </h3>
            </div>
            <div className="space-y-3">
              {preferences.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-green-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Budget & Timeline */}
        <div className="space-y-6">
          {/* Budget Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="text-center">
                  <p className="text-sm text-emerald-700 mb-1">
                    Preferred Amount
                  </p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {formatCurrency(preferences.budget)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budget Range:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(preferences.minBudget)} -{" "}
                    {formatCurrency(preferences.maxBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {getPaymentFrequencyLabel()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Move-In Date</p>
                <p className="font-semibold text-orange-800">
                  {formatDate(preferences.moveInDate)}
                </p>
              </div>
              {preferences.additionalCosts.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Additional Costs:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.additionalCosts.map((cost) => (
                      <span
                        key={cost}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs border"
                      >
                        {cost}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-2xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Find Your Perfect Home?
          </h3>
          <p className="text-gray-600 mb-8">
            We'll use these preferences to search thousands of properties and
            find the ones that match your exact requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
            >
              ← Go Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Find My Perfect Home! 🏠
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Verified properties</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          You can always update your preferences later in your dashboard
        </p>
      </div>
    </div>
  );
}
