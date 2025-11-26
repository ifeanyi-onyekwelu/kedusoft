import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState } from "react";
import {
  IconBed,
  IconBath,
  IconCar,
  IconHome,
  IconToolsKitchen2,
  IconStairs,
  IconBuildingSkyscraper,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";

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

    navigate("/onboarding/tenant/location");
  };

  // Check if required fields are filled
  const isFormValid = bedrooms !== "" && bathrooms !== "";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-700">
              Step 2 of 5
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Property Specifications
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tell us about the specific features and requirements for your ideal
            property
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* Property Features Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Essential Features */}
              <div className="xl:col-span-2 space-y-8">
                {/* Room Configuration */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <IconHome size={20} className="text-blue-900" />
                    Room Configuration
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Bedrooms */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <IconBed size={24} className="text-blue-900" />
                      </div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Bedrooms
                      </label>
                      <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
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
                          className="w-full text-center py-2 focus:outline-none bg-white"
                          min="0"
                          placeholder="0"
                        />
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
                          onClick={() => setBedrooms((prev) => (prev || 0) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <IconBath size={24} className="text-sky-600" />
                      </div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Bathrooms
                      </label>
                      <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
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
                          className="w-full text-center py-2 focus:outline-none bg-white"
                          min="0"
                          placeholder="0"
                        />
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
                          onClick={() =>
                            setBathrooms((prev) => (prev || 0) + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Kitchens */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <IconToolsKitchen2
                          size={24}
                          className="text-amber-600"
                        />
                      </div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Kitchens
                      </label>
                      <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
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
                          className="w-full text-center py-2 focus:outline-none bg-white"
                          min="0"
                          placeholder="0"
                        />
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
                          onClick={() => setKitchens((prev) => (prev || 0) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Floors */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <IconStairs size={24} className="text-slate-600" />
                      </div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Floors
                      </label>
                      <div className="flex border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
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
                          className="w-full text-center py-2 focus:outline-none bg-white"
                          min="0"
                          placeholder="0"
                        />
                        <button
                          className="bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200 transition-colors"
                          onClick={() => setFloorsNo((prev) => (prev || 0) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <IconBuildingSkyscraper
                      size={20}
                      className="text-blue-900"
                    />
                    Property Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Year Built
                      </label>
                      <input
                        type="number"
                        value={yearBuilt}
                        onChange={handleNumberChange(setYearBuilt)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                        placeholder="e.g., 2010"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Minimum Lease Duration
                      </label>
                      <select
                        value={minimumLeaseDuration}
                        onChange={(e) =>
                          setMinimumLeaseDuration(e.target.value)
                        }
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
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

                {/* Amenities */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Desired Amenities
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Select the amenities that are important to you
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all duration-200 ${
                            amenities.includes(amenity)
                              ? "bg-blue-50 border-blue-300 text-blue-900"
                              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              amenities.includes(amenity)
                                ? "bg-blue-900 border-blue-900"
                                : "border-slate-400"
                            }`}
                          >
                            {amenities.includes(amenity) && (
                              <IconCheck size={14} className="text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{amenity}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Property Options */}
              <div className="space-y-8">
                {/* Property Options */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">
                    Property Options
                  </h3>

                  <div className="space-y-4">
                    {/* Parking Space */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <IconCar size={20} className="text-slate-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            Parking Space
                          </div>
                          <div className="text-sm text-slate-600">
                            Dedicated parking spot
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setParkingSpace(!parkingSpace)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          parkingSpace ? "bg-blue-900" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            parkingSpace ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Furnished */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <IconHome size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            Furnished
                          </div>
                          <div className="text-sm text-slate-600">
                            Includes furniture
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFurnished(furnished === "yes" ? "no" : "yes")
                        }
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          furnished === "yes" ? "bg-blue-900" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            furnished === "yes"
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Pets Allowed */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <IconCheck size={20} className="text-pink-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            Pets Allowed
                          </div>
                          <div className="text-sm text-slate-600">
                            Pet-friendly property
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPets(pets === "yes" ? "no" : "yes")}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          pets === "yes" ? "bg-blue-900" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            pets === "yes" ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-900 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">
                    Your Selections
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Bedrooms:</span>
                      <span className="font-medium">
                        {bedrooms || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Bathrooms:</span>
                      <span className="font-medium">
                        {bathrooms || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Parking:</span>
                      <span className="font-medium">
                        {parkingSpace ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Furnished:</span>
                      <span className="font-medium">
                        {furnished === "yes" ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Pets:</span>
                      <span className="font-medium">
                        {pets === "yes" ? "Allowed" : "Not allowed"}
                      </span>
                    </div>
                    <div className="h-px bg-slate-700 my-3"></div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Amenities:</span>
                      <span className="font-medium">
                        {amenities.length} selected
                      </span>
                    </div>
                  </div>
                </div>
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
                disabled={!isFormValid}
                className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                  ${
                    !isFormValid
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg"
                  }`}
              >
                Next: Location Preferences
                <IconArrowRight size={20} className="ml-2" />
              </button>
            </div>

            {!isFormValid && (
              <div className="mt-4 text-center text-slate-500 text-sm">
                Please specify at least bedrooms and bathrooms to continue
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
