import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useMemo } from "react";
import {
  IconSearch,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconX,
  IconSwimming,
  IconBuilding,
  IconArmchair,
  IconPaw,
  IconCar,
  IconShieldCheck,
  IconElevator,
  IconPlant,
  IconBallBaseball,
  IconSmartHome,
  IconWashMachine,
  IconSnowflake,
  IconBolt,
  IconVideo,
  IconFlame,
  IconWheelchair,
  IconBuildingSkyscraper,
  IconBox,
  IconBed,
  IconDesk,
  IconWifi,
  IconHanger,
  IconSun,
  IconFilter,
} from "@tabler/icons-react";
import { FaDumbbell } from "react-icons/fa6";

// Feature list with Tabler icons and categories
const features = [
  {
    id: "pool",
    name: "Swimming Pool",
    icon: IconSwimming,
    category: "Outdoor",
  },
  { id: "gym", name: "Gym", icon: FaDumbbell, category: "Amenities" },
  { id: "balcony", name: "Balcony", icon: IconBuilding, category: "Outdoor" },
  {
    id: "furnished",
    name: "Furnished",
    icon: IconArmchair,
    category: "Interior",
  },
  {
    id: "pet-friendly",
    name: "Pet-friendly",
    icon: IconPaw,
    category: "Policies",
  },
  {
    id: "parking-space",
    name: "Parking Space",
    icon: IconCar,
    category: "Parking",
  },
  {
    id: "security",
    name: "Security",
    icon: IconShieldCheck,
    category: "Safety",
  },
  {
    id: "elevator",
    name: "Elevator",
    icon: IconElevator,
    category: "Accessibility",
  },
  { id: "garden", name: "Garden", icon: IconPlant, category: "Outdoor" },
  {
    id: "playground",
    name: "Playground",
    icon: IconBallBaseball,
    category: "Family",
  },
  {
    id: "smart-home",
    name: "Smart Home",
    icon: IconSmartHome,
    category: "Technology",
  },
  {
    id: "laundry-room",
    name: "Laundry Room",
    icon: IconWashMachine,
    category: "Utilities",
  },
  {
    id: "air-conditioning",
    name: "Air Conditioning",
    icon: IconSnowflake,
    category: "Comfort",
  },
  {
    id: "24-7-power",
    name: "24/7 Power",
    icon: IconBolt,
    category: "Utilities",
  },
  { id: "cctv", name: "CCTV", icon: IconVideo, category: "Safety" },
  { id: "fire-alarm", name: "Fire Alarm", icon: IconFlame, category: "Safety" },
  {
    id: "wheelchair-access",
    name: "Wheelchair Access",
    icon: IconWheelchair,
    category: "Accessibility",
  },
  {
    id: "rooftop",
    name: "Rooftop",
    icon: IconBuildingSkyscraper,
    category: "Outdoor",
  },
  { id: "storage", name: "Storage", icon: IconBox, category: "Utilities" },
  { id: "guest-room", name: "Guest Room", icon: IconBed, category: "Interior" },
  {
    id: "study-office",
    name: "Study/Office",
    icon: IconDesk,
    category: "Interior",
  },
  {
    id: "high-speed-internet",
    name: "High-Speed Internet",
    icon: IconWifi,
    category: "Technology",
  },
  {
    id: "water-heater",
    name: "Water Heater",
    icon: IconFlame,
    category: "Utilities",
  },
  {
    id: "walk-in-closet",
    name: "Walk-in Closet",
    icon: IconHanger,
    category: "Interior",
  },
  {
    id: "solar-power",
    name: "Solar Power",
    icon: IconSun,
    category: "Utilities",
  },
];

// Categories for filtering
const categories = [
  "All",
  "Amenities",
  "Safety",
  "Utilities",
  "Outdoor",
  "Interior",
  "Technology",
  "Accessibility",
  "Family",
  "Policies",
  "Parking",
  "Comfort",
];

export default function FeaturesPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(() => {
    return preferences.features
      ? features
          .filter((feature) => preferences.features.includes(feature.name))
          .map((feature) => feature.id)
      : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter features based on search and category
  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      const matchesSearch = feature.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || feature.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const toggleFeature = (featureId: string) => {
    setSelected((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) return;

    const selectedFeatures = features
      .filter((feature) => selected.includes(feature.id))
      .map((feature) => feature.name);

    updatePreference("features", selectedFeatures);
    navigate("/onboarding/tenant/budget");
  };

  // Get selected feature objects
  const selectedFeatures = features.filter((feature) =>
    selected.includes(feature.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-700">
              Step 4 of 5
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Essential Features
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the amenities and features that matter most for your ideal
            home
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* Progress and Selection Summary */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Progress Section */}
              <div className="lg:flex-1">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Selection Progress
                    </h3>
                    <span className="text-sm font-medium text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                      {selected.length} selected
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (selected.length / 10) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Select features that are important to you. There's no limit!
                  </p>
                </div>
              </div>

              {/* Selected Features Preview */}
              {selected.length > 0 && (
                <div className="lg:flex-1">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <IconCheck size={20} className="text-blue-900" />
                      Your Selections
                    </h3>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {selectedFeatures.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                          <div
                            key={feature.id}
                            className="flex items-center bg-white px-3 py-2 rounded-lg font-medium text-sm shadow-sm border border-slate-200"
                          >
                            <IconComponent
                              size={16}
                              className="text-blue-900 mr-2"
                            />
                            <span className="mr-2">{feature.name}</span>
                            <button
                              onClick={() => toggleFeature(feature.id)}
                              className="text-slate-400 hover:text-red-500 focus:outline-none transition-colors"
                            >
                              <IconX size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Search */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <IconSearch size={18} className="text-blue-900" />
                    Search Features
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconSearch size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Type to search features..."
                      className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <IconFilter size={18} className="text-blue-900" />
                    Filter by Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeCategory === category
                            ? "bg-blue-900 text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Available Features
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    ({filteredFeatures.length} features)
                  </span>
                </h3>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="text-sm text-blue-900 hover:text-blue-700 font-medium"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleFeature(feature.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[140px] group relative
                        ${
                          selected.includes(feature.id)
                            ? "border-blue-900 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                        }
                      `}
                    >
                      <div
                        className={`p-3 rounded-lg mb-3 transition-colors ${
                          selected.includes(feature.id)
                            ? "bg-blue-900"
                            : "bg-slate-100 group-hover:bg-slate-200"
                        }`}
                      >
                        <IconComponent
                          size={22}
                          className={
                            selected.includes(feature.id)
                              ? "text-white"
                              : "text-slate-600"
                          }
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-800 mb-1 leading-tight">
                        {feature.name}
                      </span>
                      <span
                        className={`text-xs ${
                          selected.includes(feature.id)
                            ? "text-blue-700"
                            : "text-slate-500"
                        }`}
                      >
                        {feature.category}
                      </span>

                      {/* Selection indicator */}
                      {selected.includes(feature.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-900 rounded-full flex items-center justify-center">
                          <IconCheck size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary and Navigation */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Summary Card */}
              <div className="lg:flex-1">
                <div className="bg-slate-900 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">
                    Selection Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Features Selected:</span>
                      <span className="font-medium">{selected.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">
                        Categories Covered:
                      </span>
                      <span className="font-medium">
                        {
                          [...new Set(selectedFeatures.map((f) => f.category))]
                            .length
                        }
                      </span>
                    </div>
                    <div className="h-px bg-slate-700 my-3"></div>
                    <div className="text-slate-300 text-sm">
                      {selected.length === 0
                        ? "Select features to see your preferences summary"
                        : "Your selected features will help us find properties that match your specific needs"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="lg:w-80">
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full bg-white text-slate-700 px-6 py-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-200 font-medium flex items-center justify-center"
                  >
                    <IconArrowLeft size={20} className="mr-2" />
                    Back to Styles
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={selected.length === 0}
                    className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                      ${
                        selected.length === 0
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg"
                      }`}
                  >
                    Continue to Budget
                    <IconArrowRight size={20} className="ml-2" />
                  </button>

                  {selected.length === 0 && (
                    <div className="text-center text-slate-500 text-sm">
                      Select at least one feature to continue
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
