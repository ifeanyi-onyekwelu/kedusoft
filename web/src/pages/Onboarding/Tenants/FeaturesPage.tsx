import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useMemo } from "react";
import {
  IconSearch,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
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
} from "@tabler/icons-react";
import { FaDumbbell } from "react-icons/fa6";

const FEATURES = [
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

const CATEGORIES = [
  "All",
  "Amenities",
  "Safety",
  "Utilities",
  "Outdoor",
  "Interior",
  "Technology",
];

export default function FeaturesPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();

  const [selected, setSelected] = useState<string[]>(() => {
    return preferences.features
      ? FEATURES.filter((f) => preferences.features.includes(f.name)).map(
          (f) => f.id
        )
      : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFeatures = useMemo(() => {
    return FEATURES.filter((f) => {
      const matchesSearch = f.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const toggleFeature = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    const names = FEATURES.filter((f) => selected.includes(f.id)).map(
      (f) => f.name
    );
    updatePreference("features", names);
    navigate("/onboarding/tenant/budget");
  };

  return (
    <div className="min-h-screen bg-white font-manrope transition-all">
      {/* Brand Progress Bar - Step 4 of 5 (80%) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-[80%] transition-all duration-500" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-primary mb-6 transition-colors font-bold"
          >
            <IconArrowLeft size={18} className="mr-2" />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 font-sora mb-2">
            Essential Features
          </h1>
          <p className="text-gray-500 font-medium">
            Select the amenities that are non-negotiable for your new home.
          </p>
        </header>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <IconSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-14 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-secondary transition-all outline-none font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar whitespace-nowrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 h-14 rounded-2xl text-sm font-bold transition-all
                  ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[400px]">
          {filteredFeatures.map((feature) => {
            const IconComponent = feature.icon;
            const isSelected = selected.includes(feature.id);

            return (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`relative p-5 rounded-2xl border-2 text-center transition-all duration-300 group flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "border-secondary bg-blue-50/30 shadow-md translate-y-[-2px]"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                  }
                `}
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-all
                  ${
                    isSelected
                      ? "bg-secondary text-white scale-110"
                      : "bg-gray-50 text-gray-400 group-hover:text-primary"
                  }
                `}
                >
                  <IconComponent size={24} />
                </div>

                <span
                  className={`text-xs font-bold uppercase tracking-tight leading-tight ${
                    isSelected ? "text-primary" : "text-gray-900"
                  }`}
                >
                  {feature.name}
                </span>

                {isSelected && (
                  <div className="absolute top-3 right-3 text-secondary animate-in zoom-in duration-200">
                    <IconCheck size={18} stroke={4} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Selected Items:
            </span>
            <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full font-black text-sm">
              {selected.length}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={selected.length === 0}
            className={`w-full max-w-md h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${
                selected.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-black hover:shadow-2xl active:scale-[0.98]"
              }`}
          >
            Continue to Budget
            <IconArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
