import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import {
  IconCheck,
  IconEdit,
  IconHome,
  IconMapPin,
  IconPalette,
  IconStar,
  IconCurrencyNaira,
  IconUser,
  IconArrowLeft,
} from "@tabler/icons-react";
import { FaIdCard } from "react-icons/fa6";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { preferences, completeOnboarding } = useOnboarding();

  const handleComplete = async () => {
    await completeOnboarding();
    navigate("/onboarding/completion");
  };

  const formatNaira = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount}`;
  };

  const sections = [
    {
      id: "personal",
      title: "Personal Profile",
      icon: IconUser,
      data: [
        { label: "Occupation", value: preferences.occupation },
        { label: "Marital Status", value: preferences.maritalStatus },
        { label: "Household Size", value: preferences.householdSize },
        {
          label: "Children",
          value: preferences.hasChildren
            ? `${preferences.numberOfChildren} children`
            : "No children",
        },
        { label: "Pets", value: preferences.hasPets ? "Yes" : "No" },
      ],
      route: "/onboarding/personal",
    },
    {
      id: "property",
      title: "Property Specifications",
      icon: IconHome,
      data: [
        { label: "Bedrooms", value: preferences.bedrooms },
        { label: "Bathrooms", value: preferences.bathrooms },
        { label: "Kitchens", value: preferences.kitchens },
        { label: "Floors", value: preferences.floors_no },
        {
          label: "Parking",
          value: preferences.parking_space ? "Required" : "Not required",
        },
        { label: "Furnished", value: preferences.furnished },
        { label: "Pets Allowed", value: preferences.pets },
      ],
      route: "/onboarding/property-details",
    },
    {
      id: "location",
      title: "Preferred Locations",
      icon: IconMapPin,
      data: [
        { label: "Selected Areas", value: preferences.locations?.join(", ") },
      ],
      route: "/onboarding/location",
    },
    {
      id: "vibe",
      title: "Home Style",
      icon: IconPalette,
      data: [{ label: "Selected Styles", value: preferences.vibe?.join(", ") }],
      route: "/onboarding/vibes",
    },
    {
      id: "features",
      title: "Essential Features",
      icon: IconStar,
      data: [
        { label: "Selected Features", value: preferences.features?.join(", ") },
      ],
      route: "/onboarding/features",
    },
    {
      id: "budget",
      title: "Budget & Timeline",
      icon: IconCurrencyNaira,
      data: [
        {
          label: "Budget Range",
          value: `${formatNaira(preferences.minBudget || 0)} - ${formatNaira(
            preferences.maxBudget || 0
          )}`,
        },
        {
          label: "Preferred Budget",
          value: formatNaira(preferences.budget || 0),
        },
        { label: "Payment Frequency", value: preferences.paymentFrequency },
        { label: "Move-in Date", value: preferences.moveInDate },
      ],
      route: "/onboarding/budget",
    },
    {
      id: "verification",
      title: "Verification",
      icon: FaIdCard,
      data: [
        { label: "Status", value: "Completed" },
        {
          label: "Documents",
          value: `${
            Object.keys(preferences.verificationDocuments || {}).length
          } documents uploaded`,
        },
      ],
      route: "/onboarding/verification",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-700">
              Final Review
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Review Your Preferences
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything is set! Review your selections before we start finding
            your perfect home
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Completion Header */}
          <div className="bg-slate-900 text-white p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              All Set for Your Home Search
            </h1>
            <p className="text-slate-300">
              {sections.length} sections completed successfully
            </p>
          </div>

          <div className="p-8">
            {/* Progress Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-900">
                  {sections.length}
                </div>
                <div className="text-sm text-blue-700">Sections Completed</div>
              </div>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-center">
                <div className="text-2xl font-bold text-sky-700">
                  {preferences.locations?.length || 0}
                </div>
                <div className="text-sm text-sky-700">Locations</div>
              </div>
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {preferences.features?.length || 0}
                </div>
                <div className="text-sm text-slate-600">Features</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-700">
                  {Object.keys(preferences.verificationDocuments || {}).length}
                </div>
                <div className="text-sm text-green-700">Documents</div>
              </div>
            </div>

            {/* Sections Review */}
            <div className="space-y-6 mb-8">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={section.id}
                    className="border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent size={20} className="text-blue-900" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            {section.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {section.data.length} details provided
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(section.route)}
                        className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                      >
                        <IconEdit size={16} />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.data.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-slate-100"
                        >
                          <span className="text-sm text-slate-600 font-medium">
                            {item.label}
                          </span>
                          <span className="text-sm text-slate-800 bg-slate-50 px-3 py-1 rounded-md">
                            {item.value || "Not specified"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <IconCheck size={20} className="text-green-600" />
                Ready to Find Your Home
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                <p>
                  Based on your preferences, we'll start matching you with
                  properties that meet your specific requirements.
                </p>
                <p>
                  You can always update your preferences later from your account
                  settings.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate("/onboarding/verification")}
                className="flex-1 bg-white text-slate-700 px-6 py-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <IconArrowLeft size={20} className="mr-2" />
                Back to Verification
              </button>

              <button
                onClick={handleComplete}
                className="flex-1 bg-blue-900 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center hover:bg-blue-800 hover:shadow-lg"
              >
                Complete Onboarding
                <IconCheck size={20} className="ml-2" />
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 text-center text-sm text-slate-500">
              <p>
                By completing onboarding, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-900 hover:underline font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-900 hover:underline font-medium"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
