import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import {
  IconCheck,
  IconEdit,
  IconHome,
  IconMapPin,
  IconPalette,
  IconCurrencyNaira,
  IconUser,
  IconArrowLeft,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function CompletionPage() {
  const navigate = useNavigate();
  const { preferences, completeOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        { label: "Occupation", value: preferences.occupation },
        { label: "Marital Status", value: preferences.maritalStatus },
        {
          label: "Household",
          value: preferences.householdSize
            ? `${preferences.householdSize} Persons`
            : null,
        },
      ],
    },
    {
      id: "property",
      title: "Property Specs",
      icon: IconHome,
      route: "/onboarding/tenant/property-details",
      data: [
        { label: "Bedrooms", value: preferences.bedrooms },
        { label: "Furnished", value: preferences.furnished },
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
        { label: "Frequency", value: preferences.paymentFrequency },
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
      title: "Lifestyle",
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
    <div className="min-h-screen bg-[#F8F9FA] font-manrope">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-50">
        <div className="h-full bg-secondary w-full transition-all duration-500" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Navigation Header */}
        <header className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-gray-500 hover:text-secondary mb-4 transition-colors"
          >
            <IconArrowLeft
              size={20}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xs font-bold uppercase tracking-widest">
              Go Back
            </span>
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-sora tracking-tight">
                Review Profile
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Everything looks great! Take a quick look before finishing.
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-700 font-bold text-sm animate-pulse">
            <IconExclamationCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Grid */}
          <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`bg-white rounded-[24px] border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg hover:border-secondary/20 transition-all duration-300 ${
                  section.fullWidth ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary">
                      <section.icon size={24} />
                    </div>
                    <button
                      onClick={() => navigate(section.route)}
                      className="p-2 hover:bg-secondary/10 text-gray-400 hover:text-secondary rounded-xl transition-all"
                    >
                      <IconEdit size={18} />
                    </button>
                  </div>

                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-5">
                    {section.title}
                  </h3>

                  <div className="grid gap-y-5">
                    {section.data.map((item, i) => (
                      <div key={i} className="border-l-2 border-gray-100 pl-4">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-gray-800 break-words">
                          {item.value || "Not specified"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Action Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-10">
            <div className="bg-primary rounded-[32px] p-8 sm:p-10 text-white shadow-xl shadow-primary/20 overflow-hidden relative">
              {/* Subtle Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary/20 rounded-2xl mb-6">
                  <IconCheck size={28} className="text-secondary" />
                </div>

                <h2 className="text-2xl font-bold font-sora mb-3">
                  All systems go!
                </h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  We'll use these preferences to filter through verified
                  properties and find the ones that truly match your lifestyle.
                </p>

                <div className="space-y-3 mb-8">
                  <BadgeItem label="Identity Verified" />
                  <BadgeItem label="Preferences Optimized" />
                </div>

                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="w-full h-16 bg-secondary text-white rounded-2xl font-black text-base hover:bg-secondary/90 transition-all hover:shadow-[0_8px_20px_rgba(240,188,11,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Complete My Profile"
                  )}
                </button>

                <p className="text-[9px] text-gray-500 text-center mt-6 uppercase tracking-widest font-bold">
                  Safe & Secure • Encrypted Profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
        <IconCheck size={12} className="text-green-500" />
      </div>
      {label}
    </div>
  );
}
