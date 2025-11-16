import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState } from "react";

const vibes = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    icon: "🧘",
    description: "Clean lines, uncluttered spaces, and functional design",
  },
  {
    id: "cozy-traditional",
    name: "Cozy & Traditional",
    icon: "🛋️",
    description: "Warm textures, classic furniture, and inviting atmosphere",
  },
  {
    id: "vibrant-eclectic",
    name: "Vibrant & Eclectic",
    icon: "🎨",
    description: "Bold colors, mixed patterns, and personal collections",
  },
  {
    id: "spacious-family",
    name: "Spacious Family Home",
    icon: "👨‍👩‍👧‍👦",
    description:
      "Practical layouts, durable materials, and kid-friendly spaces",
  },
  {
    id: "urban-loft",
    name: "Urban Loft",
    icon: "🏙️",
    description: "Open layouts, industrial elements, and city views",
  },
  {
    id: "luxury-living",
    name: "Luxury Living",
    icon: "💎",
    description: "Premium finishes, statement pieces, and elegant details",
  },
  {
    id: "nature-inspired",
    name: "Nature Inspired",
    icon: "🌿",
    description: "Natural materials, organic shapes, and indoor plants",
  },
  {
    id: "industrial-chic",
    name: "Industrial Chic",
    icon: "🏭",
    description: "Exposed structures, raw materials, and utilitarian aesthetic",
  },
  {
    id: "scandinavian-calm",
    name: "Scandinavian Calm",
    icon: "❄️",
    description: "Light colors, functional simplicity, and hygge elements",
  },
  {
    id: "bohemian-retreat",
    name: "Bohemian Retreat",
    icon: "🧿",
    description: "Layered textiles, global influences, and free-spirited vibe",
  },
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    icon: "🏛️",
    description:
      "Timeless furniture, refined details, and sophisticated palette",
  },
  {
    id: "smart-techy",
    name: "Smart & Techy",
    icon: "📱",
    description: "Automated systems, integrated tech, and futuristic elements",
  },
  {
    id: "artistic-studio",
    name: "Artistic Studio",
    icon: "🎭",
    description: "Creative spaces, gallery walls, and inspiring environment",
  },
  {
    id: "resort-style",
    name: "Resort Style",
    icon: "🏝️",
    description: "Spa-like bathrooms, outdoor living, and vacation vibes",
  },
  {
    id: "vintage-charm",
    name: "Vintage Charm",
    icon: "🕰️",
    description: "Antique pieces, nostalgic elements, and retro flair",
  },
  {
    id: "zen-sanctuary",
    name: "Zen Sanctuary",
    icon: "🧘‍♂️",
    description: "Tranquil spaces, minimalist design, and peaceful atmosphere",
  },
];

export default function VibePage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(() => {
    // Map saved vibe names to their IDs
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

    // Map selected IDs to vibe names
    const selectedVibes = vibes
      .filter((vibe) => selected.includes(vibe.id))
      .map((vibe) => vibe.name);

    updatePreference("vibe", selectedVibes);
    navigate("/onboarding/features");
  };

  // Get selected vibe objects
  const selectedVibes = vibes.filter((vibe) => selected.includes(vibe.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500 opacity-20"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Define Your Home Vibe
            </h1>
            <p className="opacity-90 max-w-lg">
              Select up to <span className="font-semibold">2</span> styles that
              reflect your personality
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Your selections
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {selected.length}/2 selected
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(selected.length / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Selected Vibes Preview */}
          {selected.length > 0 && (
            <div className="mb-8 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
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
                Your Selected Vibes
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedVibes.map((vibe) => (
                  <div
                    key={vibe.id}
                    className="flex items-center bg-white px-4 py-3 rounded-lg font-medium shadow-sm border border-indigo-200"
                  >
                    <span className="text-xl mr-2">{vibe.icon}</span>
                    <span>{vibe.name}</span>
                    <button
                      onClick={() => toggleVibe(vibe.id)}
                      className="ml-3 text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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

          {/* Vibe Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {vibes.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                onClick={() => toggleVibe(vibe.id)}
                disabled={selected.length === 2 && !selected.includes(vibe.id)}
                className={`
                  group relative p-5 rounded-xl border transition-all duration-200
                  flex flex-col items-center justify-center text-center
                  min-h-[140px] overflow-hidden
                  ${
                    selected.includes(vibe.id)
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg transform scale-[1.02]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:shadow-md"
                  }
                  ${
                    selected.length === 2 && !selected.includes(vibe.id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {/* Background pattern */}
                <div
                  className={`
                  absolute inset-0 opacity-10 transition-opacity
                  ${selected.includes(vibe.id) ? "opacity-20" : ""}
                `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-300"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-3xl mb-3">{vibe.icon}</div>
                  <h3 className="font-semibold mb-1">{vibe.name}</h3>
                  <p className="text-xs opacity-80 mt-2 max-w-[140px]">
                    {vibe.description}
                  </p>
                </div>

                {/* Selection indicator */}
                {selected.includes(vibe.id) && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center
                ${
                  selected.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
                }
              `}
            >
              Next: Must-Have Features
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
              Select at least one vibe to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
