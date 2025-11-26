import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useState, useEffect } from "react";
import {
  IconCurrencyNaira,
  IconCalendar,
  IconCash,
  IconInfoCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";

// Payment frequency options
const PAYMENT_FREQUENCIES = [
  { id: "monthly", label: "Monthly", description: "Pay rent every month" },
  { id: "quarterly", label: "Quarterly", description: "Pay every 3 months" },
  { id: "annually", label: "Annually", description: "Pay once per year" },
];

// Additional cost options
const ADDITIONAL_COSTS = [
  {
    id: "utilities",
    label: "Utilities",
    description: "Water, electricity, gas",
  },
  { id: "internet", label: "Internet", description: "WiFi and cable TV" },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Repairs and upkeep",
  },
  { id: "security", label: "Security", description: "Guard services, CCTV" },
];

export default function BudgetPage() {
  const navigate = useNavigate();
  const { updatePreference, preferences } = useOnboarding();

  const [budget, setBudget] = useState<number>(preferences.budget || 300000);
  const [minBudget, setMinBudget] = useState<number>(
    preferences.minBudget || 100000
  );
  const [maxBudget, setMaxBudget] = useState<number>(
    preferences.maxBudget || 700000
  );
  const [paymentFrequency, setPaymentFrequency] = useState<string>(
    preferences.paymentFrequency || "monthly"
  );
  const [moveInDate, setMoveInDate] = useState<string>(
    preferences.moveInDate || ""
  );
  const [additionalCosts, setAdditionalCosts] = useState<string[]>(
    preferences.additionalCosts || ["utilities"]
  );

  // Update min/max when budget changes
  useEffect(() => {
    if (budget < minBudget) setMinBudget(budget);
    if (budget > maxBudget) setMaxBudget(budget);
  }, [budget, minBudget, maxBudget]);

  // Format currency in Naira
  const formatNaira = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount}`;
  };

  const handleNext = () => {
    updatePreference("budget", budget);
    updatePreference("minBudget", minBudget);
    updatePreference("maxBudget", maxBudget);
    updatePreference("paymentFrequency", paymentFrequency);
    updatePreference("moveInDate", moveInDate);
    updatePreference("additionalCosts", additionalCosts);

    navigate("/onboarding/tenant/summary");
  };

  const toggleAdditionalCost = (cost: string) => {
    setAdditionalCosts((prev) =>
      prev.includes(cost) ? prev.filter((c) => c !== cost) : [...prev, cost]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-900 rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-700">
              Step 5 of 5
            </h2>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Budget & Timeline
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Set your financial parameters and preferred move-in schedule
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            {/* Budget Range Section */}
            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <IconCurrencyNaira size={20} className="text-blue-900" />
                Your Budget Range
              </h3>

              {/* Budget Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <BudgetCard
                  title="Minimum Budget"
                  value={minBudget}
                  formattedValue={formatNaira(minBudget)}
                  onChange={setMinBudget}
                  min={50000}
                  max={maxBudget}
                  icon={IconCurrencyNaira}
                  color="bg-blue-100"
                />
                <BudgetCard
                  title="Preferred Budget"
                  value={budget}
                  formattedValue={formatNaira(budget)}
                  onChange={setBudget}
                  min={minBudget}
                  max={maxBudget}
                  icon={IconCash}
                  color="bg-sky-100"
                />
                <BudgetCard
                  title="Maximum Budget"
                  value={maxBudget}
                  formattedValue={formatNaira(maxBudget)}
                  onChange={setMaxBudget}
                  min={minBudget}
                  max={2500000}
                  icon={IconCurrencyNaira}
                  color="bg-slate-100"
                />
              </div>

              {/* Budget Summary */}
              <div className="bg-slate-900 text-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <IconCheck size={20} className="text-sky-400" />
                  Budget Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Minimum Budget:</span>
                    <span className="font-medium">
                      {formatNaira(minBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Preferred Budget:</span>
                    <span className="font-medium text-sky-400">
                      {formatNaira(budget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Maximum Budget:</span>
                    <span className="font-medium">
                      {formatNaira(maxBudget)}
                    </span>
                  </div>
                  <div className="h-px bg-slate-700 my-3"></div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">Total Range:</span>
                    <span className="text-sky-400">
                      {formatNaira(minBudget)} - {formatNaira(maxBudget)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Payment Frequency */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <IconCash size={20} className="text-blue-900" />
                  Payment Frequency
                </h3>
                <div className="space-y-3">
                  {PAYMENT_FREQUENCIES.map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setPaymentFrequency(freq.id)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left
                        ${
                          paymentFrequency === freq.id
                            ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      <div className="font-medium mb-1">{freq.label}</div>
                      <div
                        className={`text-sm ${
                          paymentFrequency === freq.id
                            ? "text-blue-200"
                            : "text-slate-600"
                        }`}
                      >
                        {freq.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Move-in Date */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <IconCalendar size={20} className="text-blue-900" />
                  Move-in Timeline
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    When do you plan to move in?
                  </label>
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <IconInfoCircle size={20} className="text-blue-900" />
                Additional Costs to Include
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Select which additional costs should be considered in your
                budget
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {ADDITIONAL_COSTS.map((cost) => (
                  <button
                    key={cost.id}
                    type="button"
                    onClick={() => toggleAdditionalCost(cost.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center text-center
                      ${
                        additionalCosts.includes(cost.id)
                          ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="font-medium mb-2">{cost.label}</div>
                    <div
                      className={`text-xs ${
                        additionalCosts.includes(cost.id)
                          ? "text-blue-200"
                          : "text-slate-600"
                      }`}
                    >
                      {cost.description}
                    </div>
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
                className="flex-1 bg-blue-900 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center hover:bg-blue-800 hover:shadow-lg"
              >
                Review Your Preferences
                <IconArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-slate-500 max-w-xl mx-auto">
          <p className="flex items-center justify-center">
            <IconInfoCircle size={16} className="mr-2" />
            Your budget information helps us find properties that match your
            financial comfort zone
          </p>
        </div>
      </div>
    </div>
  );
}

// Budget Card Component
function BudgetCard({
  title,
  value,
  formattedValue,
  onChange,
  min,
  max,
  icon: IconComponent,
  color,
}: {
  title: string;
  value: number;
  formattedValue: string;
  onChange: (value: number) => void;
  min: number;
  max: number;
  icon: any;
  color: string;
}) {
  return (
    <div className={`${color} p-6 rounded-xl border border-slate-200`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <IconComponent size={20} className="text-blue-900" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700">{title}</h4>
          <div className="text-lg font-bold text-blue-900">
            {formattedValue}
          </div>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>{formatNaira(min)}</span>
        <span>{formatNaira(max)}</span>
      </div>
    </div>
  );
}

// Format currency in Naira (for BudgetCard component)
function formatNaira(amount: number) {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}K`;
  }
  return `₦${amount}`;
}
