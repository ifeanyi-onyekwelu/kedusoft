import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useEffect, useRef } from "react";
import {
  IconMapPin,
  IconSearch,
  IconWorld,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconX,
  IconCurrentLocation,
  IconMapPins,
} from "@tabler/icons-react";

const LOCATIONS_BY_STATE = [
  {
    state: "Enugu",
    cities: [
      "New Haven",
      "Independence Layout",
      "Trans Ekulu",
      "GRA",
      "Achara Layout",
      "Coal Camp",
      "Uwani",
      "Abakpa",
    ],
  },
  {
    state: "Lagos",
    cities: [
      "Victoria Island",
      "Lekki",
      "Ikeja",
      "Surulere",
      "Yaba",
      "Apapa",
      "Maryland",
      "Ikoyi",
    ],
  },
  {
    state: "Abuja",
    cities: [
      "Maitama",
      "Garki",
      "Wuse",
      "Asokoro",
      "Jabi",
      "Gwarimpa",
      "Utako",
      "Kubwa",
    ],
  },
  {
    state: "Rivers",
    cities: [
      "Port Harcourt GRA",
      "Old GRA",
      "Rumuokoro",
      "Rumuola",
      "Trans Amadi",
      "Ogbunabali",
      "D/Line",
    ],
  },
  {
    state: "Oyo",
    cities: [
      "Bodija",
      "Agodi GRA",
      "Mokola",
      "Sango",
      "UI Area",
      "Challenge",
      "Ring Road",
    ],
  },
  {
    state: "Kano",
    cities: [
      "Nasarawa GRA",
      "Sabon Gari",
      "Bompai",
      "Gyadi-Gyadi",
      "Tarauni",
      "Kumbotso",
      "Dala",
    ],
  },
];

export default function LocationPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(
    preferences.locations || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeState, setActiveState] = useState("Enugu");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const allCities = LOCATIONS_BY_STATE.flatMap((stateData) => stateData.cities);

  const filteredLocations = searchTerm
    ? allCities.filter((loc) =>
        loc.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : LOCATIONS_BY_STATE.find((state) => state.state === activeState)?.cities ||
      [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLocation = (loc: string) => {
    setSelected((prev) => {
      if (prev.includes(loc)) return prev.filter((l) => l !== loc);
      if (prev.length < 3) return [...prev, loc];
      return prev;
    });
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    updatePreference("locations", selected);
    navigate("/onboarding/tenant/vibes");
  };

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Brand Progress Bar - Step 3 of 5 (60%) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-[60%] transition-all duration-500" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
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
            Target Locations
          </h1>
          <p className="text-gray-500 font-medium">
            Where should we look for your next home? Pick up to 3 areas.
          </p>
        </header>

        <div className="space-y-12">
          {/* Search & Selected Tags */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Search Neighborhoods
              </h3>
              <span className="text-xs font-bold text-secondary bg-blue-50 px-3 py-1 rounded-full">
                {selected.length}/3 Selected
              </span>
            </div>

            <div className="relative mb-6" ref={searchRef}>
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <IconSearch
                  size={22}
                  className={
                    isSearchFocused ? "text-secondary" : "text-gray-400"
                  }
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Type a city or area name..."
                className={`w-full h-16 pl-14 pr-6 bg-gray-50 border-2 rounded-2xl transition-all outline-none font-bold text-gray-700 ${
                  isSearchFocused
                    ? "border-secondary bg-white shadow-sm"
                    : "border-gray-100"
                }`}
              />

              {showSuggestions && searchTerm && (
                <div className="absolute z-20 mt-2 w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <IconMapPin
                          size={18}
                          className="text-gray-400 group-hover:text-secondary"
                        />
                        <span className="font-bold text-gray-700">{loc}</span>
                      </div>
                      {selected.includes(loc) && (
                        <IconCheck
                          size={20}
                          className="text-secondary"
                          stroke={3}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Pills */}
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {selected.map((loc) => (
                <div
                  key={loc}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl animate-in zoom-in-95 duration-200"
                >
                  <span className="font-bold text-sm tracking-tight">
                    {loc}
                  </span>
                  <button
                    onClick={() => toggleLocation(loc)}
                    className="hover:text-secondary"
                  >
                    <IconX size={16} stroke={3} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-12 gap-10">
            {/* State Picker - Left Column */}
            <div className="md:col-span-4 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Browse States
              </h3>
              <div className="flex flex-col gap-2">
                {LOCATIONS_BY_STATE.map((s) => (
                  <button
                    key={s.state}
                    onClick={() => {
                      setActiveState(s.state);
                      setSearchTerm("");
                    }}
                    className={`text-left px-5 py-4 rounded-2xl font-black transition-all duration-200 ${
                      activeState === s.state
                        ? "bg-secondary text-white shadow-lg shadow-blue-200 translate-x-1"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {s.state}
                      <IconWorld
                        size={16}
                        className={
                          activeState === s.state ? "opacity-100" : "opacity-0"
                        }
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood Grid - Right Column */}
            <div className="md:col-span-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Neighborhoods in {activeState}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {filteredLocations.map((loc) => {
                  const isSelected = selected.includes(loc);
                  const isLimitReached = selected.length === 3 && !isSelected;
                  return (
                    <button
                      key={loc}
                      disabled={isLimitReached}
                      onClick={() => toggleLocation(loc)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 group relative ${
                        isSelected
                          ? "border-secondary bg-blue-50/30 shadow-sm"
                          : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                      } ${
                        isLimitReached
                          ? "opacity-40 cursor-not-allowed"
                          : "active:scale-95"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-bold ${
                            isSelected ? "text-primary" : "text-gray-600"
                          }`}
                        >
                          {loc}
                        </span>
                        {isSelected && (
                          <IconCheck
                            size={18}
                            stroke={3}
                            className="text-secondary"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
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
            Home Vibe
            <IconArrowRight size={22} />
          </button>
          {selected.length === 0 && (
            <p className="text-center mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Please select at least one location
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
