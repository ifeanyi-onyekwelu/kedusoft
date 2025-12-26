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

  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<number | "">>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value === "" ? "" : parseInt(value, 10));
    };

  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

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

  const isFormValid = bedrooms !== "" && bathrooms !== "";

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-2/5 transition-all duration-500" />
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
            Property Specs
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Define the blueprint of your perfect home.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Configuration - Left Side */}
          <div className="lg:col-span-2 space-y-12">
            {/* Room Counters */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">
                Essential Configuration
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    label: "Bedrooms",
                    val: bedrooms,
                    set: setBedrooms,
                    icon: IconBed,
                  },
                  {
                    label: "Bathrooms",
                    val: bathrooms,
                    set: setBathrooms,
                    icon: IconBath,
                  },
                  {
                    label: "Kitchens",
                    val: kitchens,
                    set: setKitchens,
                    icon: IconToolsKitchen2,
                  },
                  {
                    label: "Floors",
                    val: floorsNo,
                    set: setFloorsNo,
                    icon: IconStairs,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border-2 border-gray-100 bg-gray-50/50 flex flex-col items-center"
                  >
                    <item.icon size={24} className="text-secondary mb-4" />
                    <span className="text-sm font-bold text-gray-700 mb-4">
                      {item.label}
                    </span>
                    <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() =>
                          item.set((prev) =>
                            Math.max(0, (Number(prev) || 0) - 1)
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-primary font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.val}
                        onChange={handleNumberChange(item.set as any)}
                        className="w-12 text-center font-black text-primary focus:outline-none"
                        placeholder="0"
                      />
                      <button
                        onClick={() =>
                          item.set((prev) => (Number(prev) || 0) + 1)
                        }
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-primary font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities Grid */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                Lifestyle Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 font-bold text-sm
                      ${
                        amenities.includes(amenity)
                          ? "border-secondary bg-blue-50/30 text-primary"
                          : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors
                      ${
                        amenities.includes(amenity)
                          ? "bg-secondary border-secondary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {amenities.includes(amenity) && (
                        <IconCheck
                          size={14}
                          className="text-white"
                          stroke={3}
                        />
                      )}
                    </div>
                    {amenity}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Details - Right Side */}
          <div className="space-y-8">
            <section className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Lease & Year
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                    Built Year
                  </label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={handleNumberChange(setYearBuilt)}
                    placeholder="e.g. 2022"
                    className="w-full h-14 px-5 rounded-2xl border-2 border-gray-200 bg-white font-bold text-gray-700 focus:border-secondary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">
                    Min. Lease
                  </label>
                  <select
                    value={minimumLeaseDuration}
                    onChange={(e) => setMinimumLeaseDuration(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl border-2 border-gray-200 bg-white font-bold text-gray-700 focus:border-secondary outline-none appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Duration...</option>
                    {LEASE_DURATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  {
                    label: "Parking Space",
                    state: parkingSpace,
                    set: () => setParkingSpace(!parkingSpace),
                    icon: IconCar,
                  },
                  {
                    label: "Furnished",
                    state: furnished === "yes",
                    set: () => setFurnished(furnished === "yes" ? "no" : "yes"),
                    icon: IconHome,
                  },
                  {
                    label: "Pets Friendly",
                    state: pets === "yes",
                    set: () => setPets(pets === "yes" ? "no" : "yes"),
                    icon: IconCheck,
                  },
                ].map((toggle, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                      <toggle.icon size={18} className="text-gray-400" />{" "}
                      {toggle.label}
                    </span>
                    <button
                      onClick={toggle.set}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        toggle.state ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          toggle.state ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary Visualizer */}
            <div className="bg-primary p-8 rounded-3xl text-white shadow-2xl shadow-blue-900/20">
              <h4 className="text-xs font-black uppercase tracking-widest text-secondary mb-4">
                Live Preview
              </h4>
              <div className="text-2xl font-bold font-sora">
                {bedrooms || 0} Bed • {bathrooms || 0} Bath
              </div>
              <p className="text-blue-200 text-sm mt-2 font-medium">
                {furnished === "yes" ? "Furnished" : "Unfurnished"} •{" "}
                {parkingSpace ? "Parking Inc." : "No Parking"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col items-center">
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full max-w-lg h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${
                !isFormValid
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-black hover:shadow-xl active:scale-[0.98]"
              }`}
          >
            Continue to Location
            <IconArrowRight size={22} />
          </button>
          {!isFormValid && (
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Complete bedrooms and bathrooms to proceed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
