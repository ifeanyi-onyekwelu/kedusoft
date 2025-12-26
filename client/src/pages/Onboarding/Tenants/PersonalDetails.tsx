import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState } from "react";
import {
  IconSchool,
  IconBriefcase,
  IconRocket,
  IconUserOff,
  IconBeach,
  IconArrowLeft,
  IconArrowRight,
  IconPaw,
  IconBabyCarriage,
} from "@tabler/icons-react";

const OCCUPATIONS = [
  { id: "student", label: "Student", icon: IconSchool },
  { id: "employed", label: "Employed", icon: IconBriefcase },
  { id: "self-employed", label: "Self-Employed", icon: IconRocket },
  { id: "unemployed", label: "Unemployed", icon: IconUserOff },
  { id: "retired", label: "Retired", icon: IconBeach },
];

const MARITAL_STATUSES = [
  { id: "single", label: "Single" },
  { id: "married", label: "Married" },
  { id: "divorced", label: "Divorced" },
  { id: "widowed", label: "Widowed" },
  { id: "separated", label: "Separated" },
];

export default function PersonalDetailsPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();

  const [occupation, setOccupation] = useState(preferences.occupation || "");
  const [maritalStatus, setMaritalStatus] = useState(
    preferences.maritalStatus || ""
  );
  const [householdSize, setHouseholdSize] = useState(
    preferences.householdSize || ""
  );
  const [hasChildren, setHasChildren] = useState(
    preferences.hasChildren || false
  );
  const [numberOfChildren, setNumberOfChildren] = useState(
    preferences.numberOfChildren || 0
  );
  const [hasPets, setHasPets] = useState(preferences.hasPets || false);

  const handleNext = () => {
    updatePreference("occupation", occupation);
    updatePreference("maritalStatus", maritalStatus);
    updatePreference("householdSize", householdSize);
    updatePreference("hasChildren", hasChildren);
    updatePreference("numberOfChildren", numberOfChildren);
    updatePreference("hasPets", hasPets);
    navigate("/onboarding/tenant/property-details");
  };

  const isFormValid = occupation && maritalStatus && householdSize;

  return (
    <div className="min-h-screen bg-white font-manrope">
      {/* Brand Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-1/3 transition-all duration-500" />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors font-bold"
          >
            <IconArrowLeft size={18} className="mr-2" />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 font-sora mb-2">
            Personal Profile
          </h1>
          <p className="text-gray-500 font-medium">
            Let's build your identity to find your ideal space.
          </p>
        </header>

        <div className="space-y-12">
          {/* Employment - Card Grid */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
              Employment Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {OCCUPATIONS.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setOccupation(job.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200
                    ${
                      occupation === job.id
                        ? "border-secondary bg-blue-50/30 text-primary shadow-md"
                        : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300"
                    }`}
                >
                  <job.icon
                    size={28}
                    stroke={1.5}
                    className={
                      occupation === job.id ? "text-secondary" : "text-gray-400"
                    }
                  />
                  <span className="text-sm font-bold mt-3">{job.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Relationship - Pill Scroller */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
              Relationship Status
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {MARITAL_STATUSES.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setMaritalStatus(status.id)}
                  className={`flex-shrink-0 px-8 py-3 rounded-xl border-2 font-bold text-sm transition-all
                    ${
                      maritalStatus === status.id
                        ? "border-primary bg-primary text-white shadow-lg"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </section>

          {/* Household Info */}
          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                Household Size
              </h3>
              <div className="relative">
                <select
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl border-2 border-gray-200 bg-gray-50 font-bold text-gray-700 focus:border-secondary focus:bg-white focus:outline-none appearance-none transition-all"
                >
                  <option value="">Select size...</option>
                  <option value="1">1 Person (Just me)</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5+">5+ People</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <IconArrowRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                Dependents & Pets
              </h3>

              {/* Children Toggle */}
              <div
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  hasChildren
                    ? "border-secondary bg-blue-50/20"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconBabyCarriage
                    size={22}
                    className={hasChildren ? "text-secondary" : "text-gray-400"}
                  />
                  <span className="font-bold text-gray-700">Children</span>
                </div>
                <div className="flex bg-gray-200/50 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setHasChildren(false);
                      setNumberOfChildren(0);
                    }}
                    className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
                      !hasChildren
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    NO
                  </button>
                  <button
                    onClick={() => setHasChildren(true)}
                    className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
                      hasChildren
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    YES
                  </button>
                </div>
              </div>

              {/* Pets Toggle */}
              <div
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  hasPets
                    ? "border-secondary bg-blue-50/20"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconPaw
                    size={22}
                    className={hasPets ? "text-secondary" : "text-gray-400"}
                  />
                  <span className="font-bold text-gray-700">Pets</span>
                </div>
                <div className="flex bg-gray-200/50 rounded-xl p-1">
                  <button
                    onClick={() => setHasPets(false)}
                    className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
                      !hasPets
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    NO
                  </button>
                  <button
                    onClick={() => setHasPets(true)}
                    className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
                      hasPets
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    YES
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Action */}
        <div className="mt-20 border-t border-gray-100 pt-10">
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${
                !isFormValid
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-black hover:shadow-[0_20px_50px_rgba(30,58,138,0.3)] active:scale-[0.98]"
              }`}
          >
            Property Details
            <IconArrowRight size={22} />
          </button>
          {!isFormValid && (
            <p className="text-center mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Please select all required fields
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
