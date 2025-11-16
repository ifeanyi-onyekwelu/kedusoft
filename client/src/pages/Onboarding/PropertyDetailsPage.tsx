import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState } from "react";

// Amenities options
const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gym",
  "Garden",
  "Security",
  "Air Conditioning",
  "Balcony",
  "Laundry",
  "Elevator",
  "Wi-Fi",
];

// Lease duration options
const LEASE_DURATION_OPTIONS = [
  { value: "1 month", label: "1 Month" },
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "1 year", label: "1 Year" },
  { value: "2 years", label: "2 Years" },
  { value: "Flexible", label: "Flexible" },
];

export default function PropertyDetailsPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();

  // State management
  const [bedrooms, setBedrooms] = useState<number | "">(
    preferences.bedrooms ?? ""
  );
  const [bathrooms, setBathrooms] = useState<number | "">(
    preferences.bathrooms ?? ""
  );
  const [parkingSpace, setParkingSpace] = useState<boolean>(
    preferences.parking_space ?? false
  );
  const [furnished, setFurnished] = useState<string>(
    preferences.furnished ?? "no"
  );
  const [pets, setPets] = useState<string>(preferences.pets ?? "no");
  const [kitchens, setKitchens] = useState<number | "">(
    preferences.kitchens ?? ""
  );
  const [floorsNo, setFloorsNo] = useState<number | "">(
    preferences.floors_no ?? ""
  );
  const [yearBuilt, setYearBuilt] = useState<number | "">(
    preferences.year_built ?? ""
  );
  const [minimumLeaseDuration, setMinimumLeaseDuration] = useState<string>(
    preferences.minimum_lease_duration ?? ""
  );
  const [amenities, setAmenities] = useState<string[]>(
    preferences.amenities ?? []
  );

  // Handle number input changes
  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<number | "">>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value === "" ? "" : parseInt(value, 10));
    };

  // Handle amenity selection
  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Submit handler
  const handleNext = () => {
    updatePreference("bedrooms", bedrooms === "" ? undefined : bedrooms);
    updatePreference("bathrooms", bathrooms === "" ? undefined : bathrooms);
    updatePreference("parking_space", parkingSpace);
    updatePreference("furnished", furnished);
    updatePreference("pets", pets);
    updatePreference("kitchens", kitchens === "" ? undefined : kitchens);
    updatePreference("floors_no", floorsNo === "" ? undefined : floorsNo);
    updatePreference("year_built", yearBuilt === "" ? undefined : yearBuilt);
    updatePreference("minimum_lease_duration", minimumLeaseDuration);
    updatePreference("amenities", amenities);

    navigate("/onboarding/location");
  };

  // Check if required fields are filled
  const isFormValid = bedrooms !== "" && bathrooms !== "";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl p-4">
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            Property Preferences
          </h2>
          <p className="text-gray-600">
            Tell us about your ideal property features
          </p>
        </div>

        {/* Property Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Essential Features */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Essential Features
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() =>
                        setBedrooms((prev) => Math.max(0, (prev || 0) - 1))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={handleNumberChange(setBedrooms)}
                      className="w-full text-center py-2 focus:outline-none"
                      min="0"
                      placeholder="0"
                    />
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() => setBedrooms((prev) => (prev || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() =>
                        setBathrooms((prev) => Math.max(0, (prev || 0) - 1))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={handleNumberChange(setBathrooms)}
                      className="w-full text-center py-2 focus:outline-none"
                      min="0"
                      placeholder="0"
                    />
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() => setBathrooms((prev) => (prev || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kitchens
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() =>
                        setKitchens((prev) => Math.max(0, (prev || 0) - 1))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={kitchens}
                      onChange={handleNumberChange(setKitchens)}
                      className="w-full text-center py-2 focus:outline-none"
                      min="0"
                      placeholder="0"
                    />
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() => setKitchens((prev) => (prev || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floors
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() =>
                        setFloorsNo((prev) => Math.max(0, (prev || 0) - 1))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={floorsNo}
                      onChange={handleNumberChange(setFloorsNo)}
                      className="w-full text-center py-2 focus:outline-none"
                      min="0"
                      placeholder="0"
                    />
                    <button
                      className="bg-gray-200 px-3 py-2 text-lg"
                      onClick={() => setFloorsNo((prev) => (prev || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Property Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={handleNumberChange(setYearBuilt)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 2010"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Lease Duration
                  </label>
                  <select
                    value={minimumLeaseDuration}
                    onChange={(e) => setMinimumLeaseDuration(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select duration</option>
                    {LEASE_DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Property Options */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Property Options
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parkingSpace"
                    checked={parkingSpace}
                    onChange={() => setParkingSpace(!parkingSpace)}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="parkingSpace" className="ml-2 text-gray-700">
                    Parking Space
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    checked={furnished === "yes"}
                    onChange={() =>
                      setFurnished(furnished === "yes" ? "no" : "yes")
                    }
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="furnished" className="ml-2 text-gray-700">
                    Furnished
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pets"
                    checked={pets === "yes"}
                    onChange={() => setPets(pets === "yes" ? "no" : "yes")}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="pets" className="ml-2 text-gray-700">
                    Pets Allowed
                  </label>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                Amenities
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Select desired amenities
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={amenity}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition
              ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
          >
            Next: Select Location
          </button>
        </div>
      </div>
    </div>
  );
}
