import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState } from "react";
import {
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconX,
  IconLeaf,
  IconArmchair,
  IconPalette,
  IconUsers,
  IconBuildingSkyscraper,
  IconCrown,
  IconTrees,
  IconBuildingFactory,
  IconSnowflake,
  IconMoon,
  IconBuildingLighthouse,
  IconClock,
  IconYoga,
  IconDeviceGamepad,
  IconBrush,
  IconBeach,
} from "@tabler/icons-react";

const VIBES = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    icon: IconLeaf,
    description: "Clean lines and functional design",
  },
  {
    id: "cozy-traditional",
    name: "Cozy & Traditional",
    icon: IconArmchair,
    description: "Warm textures and inviting atmosphere",
  },
  {
    id: "vibrant-eclectic",
    name: "Vibrant & Eclectic",
    icon: IconPalette,
    description: "Bold colors and mixed patterns",
  },
  {
    id: "spacious-family",
    name: "Spacious Family",
    icon: IconUsers,
    description: "Practical and kid-friendly layouts",
  },
  {
    id: "urban-loft",
    name: "Urban Loft",
    icon: IconBuildingSkyscraper,
    description: "Industrial elements and city views",
  },
  {
    id: "luxury-living",
    name: "Luxury Living",
    icon: IconCrown,
    description: "Premium finishes and elegant details",
  },
  {
    id: "nature-inspired",
    name: "Nature Inspired",
    icon: IconTrees,
    description: "Natural materials and organic shapes",
  },
  {
    id: "industrial-chic",
    name: "Industrial Chic",
    icon: IconBuildingFactory,
    description: "Raw materials and utilitarian vibes",
  },
  {
    id: "scandinavian-calm",
    name: "Scandinavian Calm",
    icon: IconSnowflake,
    description: "Light colors and simple hygge",
  },
  {
    id: "bohemian-retreat",
    name: "Bohemian Retreat",
    icon: IconMoon,
    description: "Layered textiles and global vibes",
  },
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    icon: IconBuildingLighthouse,
    description: "Timeless and sophisticated palette",
  },
  {
    id: "smart-techy",
    name: "Smart & Techy",
    icon: IconDeviceGamepad,
    description: "Integrated tech and automation",
  },
  {
    id: "artistic-studio",
    name: "Artistic Studio",
    icon: IconBrush,
    description: "Creative and inspiring environments",
  },
  {
    id: "resort-style",
    name: "Resort Style",
    icon: IconBeach,
    description: "Spa-like and vacation feelings",
  },
  {
    id: "vintage-charm",
    name: "Vintage Charm",
    icon: IconClock,
    description: "Antique pieces and nostalgic flair",
  },
  {
    id: "zen-sanctuary",
    name: "Zen Sanctuary",
    icon: IconYoga,
    description: "Tranquil and peaceful atmosphere",
  },
];

export default function VibePage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();

  const [selected, setSelected] = useState<string[]>(() => {
    return preferences.vibe
      ? VIBES.filter((v) => preferences.vibe.includes(v.name)).map((v) => v.id)
      : [];
  });

  const toggleVibe = (vibeId: string) => {
    setSelected((prev) =>
      prev.includes(vibeId)
        ? prev.filter((v) => v !== vibeId)
        : prev.length < 2
        ? [...prev, vibeId]
        : prev
    );
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    const selectedVibeNames = VIBES.filter((v) => selected.includes(v.id)).map(
      (v) => v.name
    );
    updatePreference("vibe", selectedVibeNames);
    navigate("/onboarding/tenant/features");
  };

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Brand Progress Bar - Step 4 of 5 (80%) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-[80%] transition-all duration-500" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors font-bold"
          >
            <IconArrowLeft size={18} className="mr-2" />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 font-sora mb-2">
            Home Aesthetic
          </h1>
          <p className="text-gray-500 font-medium">
            Define the atmosphere of your ideal home. Pick up to 2 vibes.
          </p>
        </header>

        <div className="space-y-10">
          {/* Selection Counter */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Choose your style
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-black ${
                  selected.length === 2 ? "text-secondary" : "text-gray-400"
                }`}
              >
                {selected.length} of 2 SELECTED
              </span>
            </div>
          </div>

          {/* Vibe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIBES.map((vibe) => {
              const IconComponent = vibe.icon;
              const isSelected = selected.includes(vibe.id);
              const isDisabled = selected.length === 2 && !isSelected;

              return (
                <button
                  key={vibe.id}
                  onClick={() => toggleVibe(vibe.id)}
                  disabled={isDisabled}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group flex flex-col h-full
                    ${
                      isSelected
                        ? "border-secondary bg-blue-50/30 shadow-md translate-y-[-4px]"
                        : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                    }
                    ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed grayscale"
                        : "active:scale-95"
                    }
                  `}
                >
                  <div
                    className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors
                    ${
                      isSelected
                        ? "bg-secondary text-white"
                        : "bg-white text-gray-400 group-hover:text-primary shadow-sm"
                    }
                  `}
                  >
                    <IconComponent size={24} stroke={1.5} />
                  </div>

                  <h4
                    className={`font-bold text-sm mb-1 ${
                      isSelected ? "text-primary" : "text-gray-900"
                    }`}
                  >
                    {vibe.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {vibe.description}
                  </p>

                  {isSelected && (
                    <div className="absolute top-4 right-4 text-secondary">
                      <IconCheck size={20} stroke={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-20 border-t border-gray-100 pt-10">
          <button
            onClick={handleNext}
            disabled={selected.length === 0}
            className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${
                selected.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-black hover:shadow-[0_20px_50px_rgba(30,58,138,0.3)] active:scale-[0.98]"
              }`}
          >
            Must-Have Features
            <IconArrowRight size={22} />
          </button>
          {selected.length === 0 && (
            <p className="text-center mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Select at least one vibe to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
