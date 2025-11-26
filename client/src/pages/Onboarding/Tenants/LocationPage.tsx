import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useEffect, useRef } from "react";
import {
  IconMapPin,
  IconSearch,
  IconWorld,
  IconBuildingSkyscraper,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";

// Expanded locations dataset with multiple states
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

// Popular cities across Nigeria
const POPULAR_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Enugu",
  "Abeokuta",
  "Benin City",
  "Uyo",
  "Calabar",
  "Kaduna",
  "Owerri",
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

  // Get all cities from all states
  const allCities = LOCATIONS_BY_STATE.flatMap((stateData) => stateData.cities);

  // Filter locations based on search
  const filteredLocations = searchTerm
    ? allCities.filter(
        (loc) =>
          loc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activeState.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : LOCATIONS_BY_STATE.find((state) => state.state === activeState)?.cities ||
      [];

  // Close suggestions when clicking outside
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
      if (prev.includes(loc)) {
        return prev.filter((l) => l !== loc);
      } else if (prev.length < 3) {
        return [...prev, loc];
      }
      return prev;
    });
    setSearchTerm("");
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
    setIsSearchFocused(true);
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    updatePreference("locations", selected);
    navigate("/onboarding/tenant/vibes");
  };

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
            Preferred Locations
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select up to 3 neighborhoods or cities that match your lifestyle
            preferences
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
                  {selected.length}/3 selected
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(selected.length / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Selected Locations Tags */}
            {selected.length > 0 && (
              <div className="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <IconCheck size={20} className="text-blue-900" />
                  Selected Locations
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selected.map((loc) => (
                    <div
                      key={loc}
                      className="flex items-center bg-blue-900 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <span>{loc}</span>
                      <button
                        onClick={() => toggleLocation(loc)}
                        className="ml-2 text-white hover:text-blue-200 focus:outline-none transition-colors"
                      >
                        <IconX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Section */}
            <div className="mb-8" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconSearch size={20} className="text-slate-400" />
                </div>
                <input
                  id="location-search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder="Search for cities or neighborhoods..."
                  className={`block w-full pl-12 pr-4 py-4 border-2 ${
                    isSearchFocused ? "border-blue-900" : "border-slate-300"
                  } rounded-lg focus:ring-0 focus:outline-none transition-all bg-white`}
                />

                {showSuggestions && filteredLocations.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border border-slate-200">
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc}
                        className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition border-b border-slate-100 last:border-0 ${
                          selected.includes(loc)
                            ? "bg-blue-50 text-blue-900"
                            : "text-slate-700"
                        }`}
                        onClick={() => toggleLocation(loc)}
                      >
                        <div className="font-medium">{loc}</div>
                        <div className="text-sm text-slate-500 flex items-center mt-1">
                          <IconMapPin size={14} className="mr-1" />
                          {activeState}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* State Selection */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <IconWorld size={20} className="text-blue-900" />
                  Browse by State
                </h3>
                <div className="flex flex-wrap gap-3">
                  {LOCATIONS_BY_STATE.map((stateData) => (
                    <button
                      key={stateData.state}
                      onClick={() => {
                        setActiveState(stateData.state);
                        setSearchTerm("");
                      }}
                      className={`px-4 py-3 rounded-lg transition-all flex items-center ${
                        activeState === stateData.state
                          ? "bg-blue-900 text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      {stateData.state}
                      {activeState === stateData.state && (
                        <IconCheck size={16} className="ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Cities */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <IconBuildingSkyscraper size={20} className="text-blue-900" />
                  Popular Cities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => toggleLocation(city)}
                      disabled={
                        selected.length === 3 && !selected.includes(city)
                      }
                      className={`p-3 rounded-lg text-center transition-all font-medium
                        ${
                          selected.includes(city)
                            ? "bg-blue-900 text-white shadow-sm"
                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                        }
                        ${
                          selected.length === 3 && !selected.includes(city)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <IconMapPin size={20} className="text-blue-900" />
                  Neighborhoods in {activeState}
                </h3>
                <span className="text-sm text-slate-500">
                  {filteredLocations.length} locations
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocation(loc)}
                    disabled={selected.length === 3 && !selected.includes(loc)}
                    className={`p-4 rounded-lg border transition-all duration-200 font-medium flex items-center justify-center text-center
                      ${
                        selected.includes(loc)
                          ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }
                      ${
                        selected.length === 3 && !selected.includes(loc)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                  >
                    {loc}
                    {selected.includes(loc) && (
                      <IconCheck size={18} className="ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-200">
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
                Next: Home Vibe
                <IconArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {selected.length === 0 && (
              <div className="mt-4 text-center text-slate-500 text-sm">
                Please select at least one location to continue
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-slate-500 max-w-md mx-auto">
          <p className="flex items-center justify-center">
            <IconMapPin size={16} className="mr-2" />
            Can't find your location? Contact support for assistance
          </p>
        </div>
      </div>
    </div>
  );
}
