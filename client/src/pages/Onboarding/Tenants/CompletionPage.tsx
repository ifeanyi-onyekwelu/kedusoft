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
  IconExclamationCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { FaIdCard } from "react-icons/fa6";
import { useState, useEffect } from "react";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { preferences, completeOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug: Log preferences on mount
  useEffect(() => {
    console.log("CompletionPage preferences:", preferences);
  }, [preferences]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const success = await completeOnboarding();
      if (success) {
        navigate("/onboarding/tenant/personalizing");
      } else {
        setError("Failed to save your preferences. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNaira = (amount: number) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
    return `₦${amount}`;
  };

  const formatArrayDisplay = (arr: any[] | undefined): string => {
    if (!arr || arr.length === 0) return "Not specified";
    return arr.join(", ");
  };

  const sections = [
    {
      id: "personal",
      title: "Personal Profile",
      icon: IconUser,
      route: "/onboarding/tenant/personal",
      data: [
        {
          label: "Occupation",
          value: preferences.occupation || "Not specified",
        },
        {
          label: "Marital Status",
          value: preferences.maritalStatus || "Not specified",
        },
        {
          label: "Household",
          value: preferences.householdSize
            ? `${preferences.householdSize} Persons`
            : "Not specified",
        },
      ],
    },
    {
      id: "property",
      title: "Property Specs",
      icon: IconHome,
      route: "/onboarding/tenant/property-details",
      data: [
        { label: "Bedrooms", value: preferences.bedrooms || "Not specified" },
        { label: "Furnished", value: preferences.furnished || "Not specified" },
        {
          label: "Parking",
          value: preferences.parking_space ? "Required" : "Not required",
        },
      ],
    },
    {
      id: "budget",
      title: "Financials",
      icon: IconCurrencyNaira,
      route: "/onboarding/tenant/budget",
      data: [
        {
          label: "Range",
          value: `${formatNaira(preferences.minBudget || 0)} - ${formatNaira(
            preferences.maxBudget || 0
          )}`,
        },
        {
          label: "Frequency",
          value: preferences.paymentFrequency || "Not specified",
        },
      ],
    },
    {
      id: "locations",
      title: "Preferred Locations",
      icon: IconMapPin,
      route: "/onboarding/tenant/location",
      fullWidth: true,
      data: [
        {
          label: "Locations",
          value: formatArrayDisplay(preferences.locations),
        },
      ],
    },
    {
      id: "vibe",
      title: "Lifestyle Preferences",
      icon: IconPalette,
      route: "/onboarding/tenant/vibes",
      fullWidth: true,
      data: [
        { label: "Styles", value: formatArrayDisplay(preferences.vibe) },
        { label: "Features", value: formatArrayDisplay(preferences.features) },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* 100% Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-primary mb-6 transition-colors font-bold"
          >
            <IconArrowLeft size={18} className="mr-2" />
            <span className="text-xs uppercase tracking-widest text-primary">
              Back
            </span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 font-sora mb-2">
            Final Review
          </h1>
          <p className="text-gray-500 font-medium">
            Review your selections before we generate your personalized home
            matches.
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-2xl border-2 border-red-100 flex items-center gap-3 text-red-700 font-bold text-sm">
            <IconExclamationCircle size={20} />
            {error}
            <button onClick={handleComplete} className="ml-auto underline">
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Detailed Review Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`p-8 rounded-[32px] border-2 border-gray-50 bg-gray-50/50 hover:border-secondary transition-all group ${
                  section.fullWidth ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    <section.icon size={24} />
                  </div>
                  <button
                    onClick={() => navigate(section.route)}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <IconEdit size={14} /> Edit
                  </button>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.data.map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {item.value || "Not specified"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submission Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-primary rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 rounded-full -mr-16 -mt-16 blur-3xl" />

              <div className="w-16 h-16 bg-secondary/20 rounded-3xl flex items-center justify-center mb-8">
                <IconCheck size={32} className="text-secondary" />
              </div>

              <h2 className="text-3xl font-bold font-sora mb-4 leading-tight">
                Ready to Find Your Home?
              </h2>
              <p className="text-gray-400 font-medium text-sm mb-8 leading-relaxed">
                By clicking complete, we'll analyze your preferences against
                thousands of listings to find your best matches.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <IconCheck size={12} />
                  </div>
                  Identity Verified
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <IconCheck size={12} />
                  </div>
                  Profile Completed
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full h-16 bg-secondary text-white rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/20 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Complete Profile"
                )}
              </button>

              <p className="text-[10px] text-gray-500 text-center mt-6 uppercase tracking-widest font-bold">
                Terms & Privacy Apply
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
