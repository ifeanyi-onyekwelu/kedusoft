import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState, useEffect, useRef } from "react";

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
    navigate("/onboarding/vibes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500 opacity-20"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Discover Your Ideal Location
            </h1>
            <p className="opacity-90 max-w-lg">
              Select up to <span className="font-semibold">3</span>{" "}
              neighborhoods that match your lifestyle preferences
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
                {selected.length}/3 selected
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(selected.length / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Selected Locations Tags */}
          {selected.length > 0 && (
            <div className="mb-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div className="flex flex-wrap gap-2">
                {selected.map((loc) => (
                  <div
                    key={loc}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full font-medium shadow-sm"
                  >
                    <span>{loc}</span>
                    <button
                      onClick={() => toggleLocation(loc)}
                      className="ml-2 text-white hover:text-indigo-200 focus:outline-none transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="mb-10" ref={searchRef}>
            <div className="relative">
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
                  ></path>
                </svg>
              </div>
              <input
                id="location-search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Search for cities or neighborhoods..."
                className={`block w-full pl-12 pr-4 py-4 border-2 ${
                  isSearchFocused ? "border-indigo-500" : "border-gray-300"
                } rounded-xl focus:ring-0 focus:outline-none transition-all shadow-sm`}
              />

              {showSuggestions && filteredLocations.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-xl max-h-60 overflow-auto border border-gray-200">
                  {filteredLocations.map((loc) => (
                    <div
                      key={loc}
                      className={`px-4 py-3 cursor-pointer hover:bg-indigo-50 transition ${
                        selected.includes(loc)
                          ? "bg-indigo-50 text-indigo-700"
                          : ""
                      } border-b border-gray-100 last:border-0`}
                      onClick={() => toggleLocation(loc)}
                    >
                      <div className="font-medium">{loc}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {activeState}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* State Selection */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
                    className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                      activeState === stateData.state
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {stateData.state}
                    {activeState === stateData.state && (
                      <svg
                        className="w-4 h-4 ml-1"
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
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Cities */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
                Popular Cities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleLocation(city)}
                    disabled={selected.length === 3 && !selected.includes(city)}
                    className={`p-3 rounded-lg text-center transition-all font-medium
                      ${
                        selected.includes(city)
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
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
          <div className="mt-10 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Neighborhoods in {activeState}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => toggleLocation(loc)}
                  disabled={selected.length === 3 && !selected.includes(loc)}
                  className={`p-3 rounded-xl border transition-all duration-200 font-medium flex items-center justify-center text-center
                    ${
                      selected.includes(loc)
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50"
                    }
                    ${
                      selected.length === 3 && !selected.includes(loc)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }
                  `}
                >
                  {loc}
                  {selected.includes(loc) && (
                    <svg
                      className="w-5 h-5 ml-2 text-white"
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
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
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
              Next: Your Home Vibe
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
              Select at least one location to continue
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
        <p className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Can't find your location? Contact support for assistance
        </p>
      </div>
    </div>
  );
}
