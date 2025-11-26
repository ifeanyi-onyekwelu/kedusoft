import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState } from "react";
import {
  IconSchool,
  IconBriefcase,
  IconRocket,
  IconUserOff,
  IconBeach,
  IconUser,
  IconUsers,
  IconHeartOff,
  IconUserX,
  IconUserExclamation,
  IconArrowLeft,
  IconArrowRight,
  IconPaw,
  IconBabyCarriage,
} from "@tabler/icons-react";

// Occupation options - professional icons and labels
const OCCUPATIONS = [
  {
    id: "student",
    label: "Student",
    icon: IconSchool,
    description: "Currently pursuing education",
  },
  {
    id: "employed",
    label: "Employed",
    icon: IconBriefcase,
    description: "Full-time professional",
  },
  {
    id: "self-employed",
    label: "Self-Employed",
    icon: IconRocket,
    description: "Entrepreneur or freelancer",
  },
  {
    id: "unemployed",
    label: "Unemployed",
    icon: IconUserOff,
    description: "Seeking employment",
  },
  {
    id: "retired",
    label: "Retired",
    icon: IconBeach,
    description: "Not in workforce",
  },
];

// Marital status options
const MARITAL_STATUSES = [
  { id: "single", label: "Single", icon: IconUser, description: "Not married" },
  {
    id: "married",
    label: "Married",
    icon: IconUsers,
    description: "With spouse",
  },
  {
    id: "divorced",
    label: "Divorced",
    icon: IconHeartOff,
    description: "Previously married",
  },
  {
    id: "widowed",
    label: "Widowed",
    icon: IconUserX,
    description: "Lost spouse",
  },
  {
    id: "separated",
    label: "Separated",
    icon: IconUserExclamation,
    description: "Living apart",
  },
];

// Household size options
const HOUSEHOLD_SIZES = [
  { id: "1", label: "Living alone", description: "Just me" },
  { id: "2", label: "Couple", description: "Me + 1" },
  { id: "3", label: "Small family", description: "2-3 people" },
  { id: "4", label: "Family", description: "3-4 people" },
  { id: "5+", label: "Large family", description: "4+ people" },
];

export default function PersonalDetailsPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();

  const [occupation, setOccupation] = useState<string>(
    preferences.occupation || ""
  );
  const [maritalStatus, setMaritalStatus] = useState<string>(
    preferences.maritalStatus || ""
  );
  const [householdSize, setHouseholdSize] = useState<string>(
    preferences.householdSize || ""
  );
  const [hasChildren, setHasChildren] = useState<boolean>(
    preferences.hasChildren || false
  );
  const [numberOfChildren, setNumberOfChildren] = useState<number>(
    preferences.numberOfChildren || 0
  );
  const [hasPets, setHasPets] = useState<boolean>(preferences.hasPets || false);

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section - Clean and professional */}
        <div className="bg-slate-900 p-8 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h1 className="text-xl font-semibold text-slate-300">
                Step 1 of 3
              </h1>
            </div>
            <h2 className="text-3xl font-bold mb-3">Personal Profile</h2>
            <p className="text-slate-400 text-lg">
              Help us understand your lifestyle to find the perfect home match
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* Occupation Section */}
          <div className="mb-12">
            <label className="block text-lg font-semibold text-slate-800 mb-6">
              What is your occupation?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OCCUPATIONS.map((job) => {
                const IconComponent = job.icon;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setOccupation(job.id)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 flex flex-col items-center text-center group
                      ${
                        occupation === job.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }
                    `}
                  >
                    <div
                      className={`p-3 rounded-lg mb-4 transition-colors ${
                        occupation === job.id
                          ? "bg-blue-500"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    >
                      <IconComponent
                        size={24}
                        className={
                          occupation === job.id
                            ? "text-white"
                            : "text-slate-600"
                        }
                      />
                    </div>
                    <div className="font-semibold text-slate-800 mb-1">
                      {job.label}
                    </div>
                    <div className="text-sm text-slate-600">
                      {job.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marital Status */}
          <div className="mb-12">
            <label className="block text-lg font-semibold text-slate-800 mb-6">
              Marital Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {MARITAL_STATUSES.map((status) => {
                const IconComponent = status.icon;
                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setMaritalStatus(status.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center group
                      ${
                        maritalStatus === status.id
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md"
                      }
                    `}
                  >
                    <IconComponent size={20} className="mb-2" />
                    <div className="font-medium text-sm">{status.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Household Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Household Size */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">
                Household Size
              </h3>
              <div className="space-y-3">
                {HOUSEHOLD_SIZES.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setHouseholdSize(size.id)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 text-left
                      ${
                        householdSize === size.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }
                    `}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-sm opacity-80">{size.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              {/* Children */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <IconBabyCarriage size={20} className="text-slate-600" />
                  <label className="font-semibold text-slate-800">
                    Do you have children?
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHasChildren(true);
                      if (!hasChildren) setNumberOfChildren(1);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 font-medium ${
                      hasChildren
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasChildren(false);
                      setNumberOfChildren(0);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 font-medium ${
                      !hasChildren
                        ? "bg-slate-100 text-slate-800 border-slate-300"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    No
                  </button>
                </div>

                {hasChildren && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Number of children
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfChildren(Math.max(0, numberOfChildren - 1))
                        }
                        className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <span className="text-lg font-semibold text-slate-700">
                          -
                        </span>
                      </button>
                      <span className="text-xl font-semibold text-slate-900 w-12 text-center">
                        {numberOfChildren}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfChildren(numberOfChildren + 1)
                        }
                        className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <span className="text-lg font-semibold text-slate-700">
                          +
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pets */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <IconPaw size={20} className="text-slate-600" />
                  <label className="font-semibold text-slate-800">
                    Do you have pets?
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setHasPets(true)}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 font-medium ${
                      hasPets
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPets(false)}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all duration-200 font-medium ${
                      !hasPets
                        ? "bg-slate-100 text-slate-800 border-slate-300"
                        : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
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
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg"
                }
              `}
            >
              Next: Property Details
              <IconArrowRight size={20} className="ml-2" />
            </button>
          </div>

          {!isFormValid && (
            <div className="mt-4 text-center text-slate-500 text-sm">
              Please complete all required fields to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
