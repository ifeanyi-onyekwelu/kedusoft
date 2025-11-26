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

const vibes = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    icon: IconLeaf,
    description: "Clean lines, uncluttered spaces, and functional design",
  },
  {
    id: "cozy-traditional",
    name: "Cozy & Traditional",
    icon: IconArmchair,
    description: "Warm textures, classic furniture, and inviting atmosphere",
  },
  {
    id: "vibrant-eclectic",
    name: "Vibrant & Eclectic",
    icon: IconPalette,
    description: "Bold colors, mixed patterns, and personal collections",
  },
  {
    id: "spacious-family",
    name: "Spacious Family Home",
    icon: IconUsers,
    description:
      "Practical layouts, durable materials, and kid-friendly spaces",
  },
  {
    id: "urban-loft",
    name: "Urban Loft",
    icon: IconBuildingSkyscraper,
    description: "Open layouts, industrial elements, and city views",
  },
  {
    id: "luxury-living",
    name: "Luxury Living",
    icon: IconCrown,
    description: "Premium finishes, statement pieces, and elegant details",
  },
  {
    id: "nature-inspired",
    name: "Nature Inspired",
    icon: IconTrees,
    description: "Natural materials, organic shapes, and indoor plants",
  },
  {
    id: "industrial-chic",
    name: "Industrial Chic",
    icon: IconBuildingFactory,
    description: "Exposed structures, raw materials, and utilitarian aesthetic",
  },
  {
    id: "scandinavian-calm",
    name: "Scandinavian Calm",
    icon: IconSnowflake,
    description: "Light colors, functional simplicity, and hygge elements",
  },
  {
    id: "bohemian-retreat",
    name: "Bohemian Retreat",
    icon: IconMoon,
    description: "Layered textiles, global influences, and free-spirited vibe",
  },
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    icon: IconBuildingLighthouse,
    description:
      "Timeless furniture, refined details, and sophisticated palette",
  },
  {
    id: "smart-techy",
    name: "Smart & Techy",
    icon: IconDeviceGamepad,
    description: "Automated systems, integrated tech, and futuristic elements",
  },
  {
    id: "artistic-studio",
    name: "Artistic Studio",
    icon: IconBrush,
    description: "Creative spaces, gallery walls, and inspiring environment",
  },
  {
    id: "resort-style",
    name: "Resort Style",
    icon: IconBeach,
    description: "Spa-like bathrooms, outdoor living, and vacation vibes",
  },
  {
    id: "vintage-charm",
    name: "Vintage Charm",
    icon: IconClock,
    description: "Antique pieces, nostalgic elements, and retro flair",
  },
  {
    id: "zen-sanctuary",
    name: "Zen Sanctuary",
    icon: IconYoga,
    description: "Tranquil spaces, minimalist design, and peaceful atmosphere",
  },
];

export default function VibePage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(() => {
    return preferences.vibe
      ? vibes
          .filter((vibe) => preferences.vibe.includes(vibe.name))
          .map((vibe) => vibe.id)
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

    const selectedVibes = vibes
      .filter((vibe) => selected.includes(vibe.id))
      .map((vibe) => vibe.name);

    updatePreference("vibe", selectedVibes);
    navigate("/onboarding/tenant/features");
  };

  const selectedVibes = vibes.filter((vibe) => selected.includes(vibe.id));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-700">
              Step 3 of 5
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Define Your Home Vibe
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select up to 2 styles that reflect your personality and preferences
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">
                  Your selections
                </span>
                <span className="text-sm font-medium text-blue-900">
                  {selected.length}/2 selected
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(selected.length / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Selected Vibes Preview */}
            {selected.length > 0 && (
              <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <IconCheck size={20} className="text-blue-900" />
                  Your Selected Styles
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedVibes.map((vibe) => {
                    const IconComponent = vibe.icon;
                    return (
                      <div
                        key={vibe.id}
                        className="flex items-center bg-white px-4 py-3 rounded-lg font-medium shadow-sm border border-slate-200"
                      >
                        <IconComponent
                          size={18}
                          className="text-blue-900 mr-2"
                        />
                        <span>{vibe.name}</span>
                        <button
                          onClick={() => toggleVibe(vibe.id)}
                          className="ml-3 text-slate-500 hover:text-red-500 focus:outline-none transition-colors"
                        >
                          <IconX size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vibe Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {vibes.map((vibe) => {
                const IconComponent = vibe.icon;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => toggleVibe(vibe.id)}
                    disabled={
                      selected.length === 2 && !selected.includes(vibe.id)
                    }
                    className={`p-6 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[160px] group
                      ${
                        selected.includes(vibe.id)
                          ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }
                      ${
                        selected.length === 2 && !selected.includes(vibe.id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                  >
                    <div
                      className={`p-3 rounded-lg mb-4 transition-colors ${
                        selected.includes(vibe.id)
                          ? "bg-blue-800"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    >
                      <IconComponent
                        size={24}
                        className={
                          selected.includes(vibe.id)
                            ? "text-white"
                            : "text-slate-600"
                        }
                      />
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">{vibe.name}</h3>
                    <p
                      className={`text-xs ${
                        selected.includes(vibe.id)
                          ? "text-blue-200"
                          : "text-slate-500"
                      }`}
                    >
                      {vibe.description}
                    </p>

                    {/* Selection indicator */}
                    {selected.includes(vibe.id) && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <IconCheck size={14} className="text-blue-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="bg-slate-900 text-white p-6 rounded-xl mb-8">
              <h3 className="text-lg font-semibold mb-4">Style Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Styles Selected:</span>
                  <span className="font-medium">{selected.length}/2</span>
                </div>
                {selected.length > 0 && (
                  <>
                    <div className="h-px bg-slate-700 my-3"></div>
                    <div className="text-slate-300 text-sm">
                      Your selected styles will help us match you with
                      properties that fit your aesthetic preferences
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-white text-slate-700 px-6 py-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <IconArrowLeft size={20} className="mr-2" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={selected.length === 0}
                className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                  ${
                    selected.length === 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg"
                  }`}
              >
                Next: Must-Have Features
                <IconArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {selected.length === 0 && (
              <div className="mt-4 text-center text-slate-500 text-sm">
                Please select at least one style to continue
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
