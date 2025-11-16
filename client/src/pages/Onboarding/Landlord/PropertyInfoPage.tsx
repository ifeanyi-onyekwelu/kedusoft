import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBuilding,
  IconMapPin,
  IconUsers,
  IconCheck,
  IconHome,
} from "@tabler/icons-react";

export default function LandlordPropertyInfoPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    propertyCount: "",
    propertyTypes: [] as string[],
    primaryLocation: "",
    managementStyle: "",
  });

  const propertyTypes = [
    { id: "apartment", label: "Apartments", icon: "🏢" },
    { id: "house", label: "Houses", icon: "🏠" },
    { id: "condo", label: "Condos", icon: "🏘️" },
    { id: "commercial", label: "Commercial", icon: "🏪" },
    { id: "shortlet", label: "Shortlets", icon: "🏖️" },
  ];

  const managementStyles = [
    {
      id: "self",
      label: "Self-Managed",
      description: "I manage everything myself",
    },
    {
      id: "hybrid",
      label: "Hybrid",
      description: "Mix of self and professional management",
    },
    {
      id: "full",
      label: "Full Service",
      description: "I want complete property management",
    },
  ];

  const togglePropertyType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to context or API
    console.log("Landlord Property Info:", formData);
    navigate("/onboarding/complete");
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.propertyCount !== "";
      case 2:
        return formData.propertyTypes.length > 0;
      case 3:
        return formData.primaryLocation !== "";
      case 4:
        return formData.managementStyle !== "";
      default:
        return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 4
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Property Count */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconBuilding size={24} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      How many properties do you own?
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["1-2", "3-5", "6-10", "10+"].map((range) => (
                      <motion.button
                        key={range}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFormData({ ...formData, propertyCount: range });
                          setTimeout(() => setCurrentStep(2), 300);
                        }}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          formData.propertyCount === range
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {range}
                        </div>
                        <div className="text-sm text-gray-600">Properties</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Property Types */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                      <IconHome size={24} className="text-cyan-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      What types of properties?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6">Select all that apply</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {propertyTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => togglePropertyType(type.id)}
                        className={`p-6 rounded-xl border-2 transition-all relative ${
                          formData.propertyTypes.includes(type.id)
                            ? "border-cyan-600 bg-cyan-50"
                            : "border-gray-200 hover:border-cyan-300"
                        }`}
                      >
                        {formData.propertyTypes.includes(type.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
                            <IconCheck size={16} className="text-white" />
                          </div>
                        )}
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <div className="font-semibold text-gray-900">
                          {type.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={formData.propertyTypes.length === 0}
                      className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <IconMapPin size={24} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Where are your properties located?
                    </h2>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Location (City)
                    </label>
                    <input
                      type="text"
                      value={formData.primaryLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryLocation: e.target.value,
                        })
                      }
                      placeholder="e.g., Lagos, Abuja, Port Harcourt"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      autoFocus
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      You can add more locations later
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      disabled={!formData.primaryLocation}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Management Style */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <IconUsers size={24} className="text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      How do you manage your properties?
                    </h2>
                  </div>

                  <div className="space-y-4 mb-8">
                    {managementStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            managementStyle: style.id,
                          })
                        }
                        className={`w-full p-6 rounded-xl border-2 transition-all text-left relative ${
                          formData.managementStyle === style.id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {formData.managementStyle === style.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <IconCheck size={16} className="text-white" />
                          </div>
                        )}
                        <div className="font-bold text-xl text-gray-900 mb-1">
                          {style.label}
                        </div>
                        <div className="text-gray-600">{style.description}</div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.managementStyle}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Complete Setup
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                step === currentStep
                  ? "w-8 bg-blue-600"
                  : isStepComplete(step)
                  ? "w-2 bg-green-600"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
