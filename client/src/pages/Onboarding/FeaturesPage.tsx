import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState, useMemo } from "react";

// Feature list with icons and categories
const features = [
  { id: "pool", name: "Pool", icon: "🏊‍♂️", category: "Outdoor" },
  { id: "gym", name: "Gym", icon: "💪", category: "Amenities" },
  { id: "balcony", name: "Balcony", icon: "🌆", category: "Outdoor" },
  { id: "furnished", name: "Furnished", icon: "🛋️", category: "Interior" },
  {
    id: "pet-friendly",
    name: "Pet-friendly",
    icon: "🐾",
    category: "Policies",
  },
  {
    id: "parking-space",
    name: "Parking Space",
    icon: "🚗",
    category: "Parking",
  },
  { id: "security", name: "Security", icon: "👮", category: "Safety" },
  { id: "elevator", name: "Elevator", icon: "🛗", category: "Accessibility" },
  { id: "garden", name: "Garden", icon: "🌷", category: "Outdoor" },
  { id: "playground", name: "Playground", icon: "🧒", category: "Family" },
  { id: "smart-home", name: "Smart Home", icon: "🏠", category: "Technology" },
  {
    id: "laundry-room",
    name: "Laundry Room",
    icon: "🧺",
    category: "Utilities",
  },
  {
    id: "air-conditioning",
    name: "Air Conditioning",
    icon: "❄️",
    category: "Comfort",
  },
  { id: "24-7-power", name: "24/7 Power", icon: "⚡", category: "Utilities" },
  { id: "cctv", name: "CCTV", icon: "📹", category: "Safety" },
  { id: "fire-alarm", name: "Fire Alarm", icon: "🔥", category: "Safety" },
  {
    id: "wheelchair-access",
    name: "Wheelchair Access",
    icon: "♿",
    category: "Accessibility",
  },
  { id: "rooftop", name: "Rooftop", icon: "🏙️", category: "Outdoor" },
  { id: "storage", name: "Storage", icon: "📦", category: "Utilities" },
  { id: "guest-room", name: "Guest Room", icon: "🛏️", category: "Interior" },
  {
    id: "study-office",
    name: "Study/Office",
    icon: "💼",
    category: "Interior",
  },
  {
    id: "high-speed-internet",
    name: "High-Speed Internet",
    icon: "🌐",
    category: "Technology",
  },
  {
    id: "water-heater",
    name: "Water Heater",
    icon: "🚿",
    category: "Utilities",
  },
  {
    id: "walk-in-closet",
    name: "Walk-in Closet",
    icon: "👗",
    category: "Interior",
  },
  { id: "solar-power", name: "Solar Power", icon: "☀️", category: "Utilities" },
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
    // Map saved feature names to their IDs
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

    // Map selected IDs to feature names
    const selectedFeatures = features
      .filter((feature) => selected.includes(feature.id))
      .map((feature) => feature.name);

    updatePreference("features", selectedFeatures);
    navigate("/onboarding/budget");
  };

  // Get selected feature objects
  const selectedFeatures = features.filter((feature) =>
    selected.includes(feature.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500 opacity-20"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Your Must-Have Features
            </h1>
            <p className="opacity-90 max-w-lg">
              Select all the features that are non-negotiable for your dream
              home
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Search and Filter Section */}
          <div className="mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search features..."
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Filter by category:
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Features Preview */}
          {selected.length > 0 && (
            <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Your Selected Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center bg-white px-3 py-2 rounded-lg font-medium shadow-sm border border-indigo-200"
                  >
                    <span className="mr-2">{feature.icon}</span>
                    <span>{feature.name}</span>
                    <button
                      onClick={() => toggleFeature(feature.id)}
                      className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {filteredFeatures.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => toggleFeature(feature.id)}
                className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[100px] ${
                  selected.includes(feature.id)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:shadow-md"
                }`}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <span className="text-sm font-medium">{feature.name}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {feature.category}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition font-medium flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={selected.length === 0}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center ${
                selected.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              Next: Budget & Move-in
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {selected.length === 0 && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              Select at least one feature to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
