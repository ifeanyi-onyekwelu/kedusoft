import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaInfoCircle,
} from "react-icons/fa";

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

  // State initialization with defaults
  // Already using preferences, but ensure defaults are correct
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

    navigate("/onboarding/summary");
  };

  const toggleAdditionalCost = (cost: string) => {
    setAdditionalCosts((prev) =>
      prev.includes(cost) ? prev.filter((c) => c !== cost) : [...prev, cost]
    );
  };

  // Budget range slider positions
  const minPosition = ((minBudget - 50000) / (2500000 - 50000)) * 100;
  const maxPosition = ((maxBudget - 50000) / (2500000 - 50000)) * 100;
  const preferredPosition = ((budget - 50000) / (2500000 - 50000)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500 opacity-20"></div>

          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <FaMoneyBillWave className="text-yellow-300" />
              Your Rental Budget & Timeline
            </h1>
            <p className="mt-2 opacity-90">
              Set your financial parameters and move-in schedule
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Budget Range Section */}
          <div className="mb-8 bg-indigo-50 rounded-xl p-5 border border-indigo-100">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                Your Budget Range
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {formatNaira(minBudget)} - {formatNaira(maxBudget)}
              </span>
            </div>

            {/* Range track visualization */}
            <div className="relative h-16 mt-6">
              {/* Background track */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full transform -translate-y-1/2" />

              {/* Active range */}
              <div
                className="absolute top-1/2 h-1.5 bg-indigo-500 rounded-full transform -translate-y-1/2"
                style={{
                  left: `${minPosition}%`,
                  right: `${100 - maxPosition}%`,
                }}
              />

              {/* Min thumb */}
              <div
                className="absolute top-1/2 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center shadow-md cursor-pointer"
                style={{ left: `${minPosition}%` }}
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              </div>

              {/* Max thumb */}
              <div
                className="absolute top-1/2 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center shadow-md cursor-pointer"
                style={{ left: `${maxPosition}%` }}
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              </div>

              {/* Preferred budget indicator */}
              <div
                className="absolute top-1/2 w-8 h-8 bg-indigo-600 rounded-full transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center shadow-lg cursor-pointer"
                style={{ left: `${preferredPosition}%` }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>

              {/* Budget labels */}
              <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>₦50K</span>
                <span>₦1M</span>
                <span>₦2.5M</span>
              </div>
            </div>

            {/* Budget cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <BudgetCard
                title="Minimum Budget"
                value={minBudget}
                formattedValue={formatNaira(minBudget)}
                onChange={setMinBudget}
                min={50000}
                max={maxBudget}
                color="bg-blue-100"
              />
              <BudgetCard
                title="Preferred Budget"
                value={budget}
                formattedValue={formatNaira(budget)}
                onChange={setBudget}
                min={minBudget}
                max={maxBudget}
                color="bg-indigo-100"
              />
              <BudgetCard
                title="Maximum Budget"
                value={maxBudget}
                formattedValue={formatNaira(maxBudget)}
                onChange={setMaxBudget}
                min={minBudget}
                max={2500000}
                color="bg-purple-100"
              />
            </div>

            {/* Budget summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 mt-6">
              <h3 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
                <FaHome className="text-indigo-600" />
                Your Budget Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Budget:</span>
                  <span className="font-medium">{formatNaira(minBudget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Budget:</span>
                  <span className="font-medium text-indigo-700">
                    {formatNaira(budget)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Budget:</span>
                  <span className="font-medium">{formatNaira(maxBudget)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700">Total Range:</span>
                  <span className="text-indigo-700">
                    {formatNaira(minBudget)} - {formatNaira(maxBudget)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Frequency */}
          <div className="mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Frequency
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PAYMENT_FREQUENCIES.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setPaymentFrequency(freq.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center
                    ${
                      paymentFrequency === freq.id
                        ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="text-lg font-medium mb-1">{freq.label}</div>
                  <div className="text-xs text-gray-600">
                    {freq.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Move-in Date */}
          <div className="mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500" />
              When do you plan to move in?
            </label>
            <div className="relative max-w-xs">
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {!moveInDate && (
                <span className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
                  Select a date
                </span>
              )}
            </div>
          </div>

          {/* Additional Costs */}
          <div className="mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaInfoCircle className="text-indigo-500" />
              Which additional costs should be included in your budget?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {ADDITIONAL_COSTS.map((cost) => (
                <button
                  key={cost.id}
                  type="button"
                  onClick={() => toggleAdditionalCost(cost.id)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center
                    ${
                      additionalCosts.includes(cost.id)
                        ? "bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="font-medium mb-1">{cost.label}</div>
                  <div className="text-xs text-gray-600">
                    {cost.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Almost Done - Review Your Preferences
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
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 max-w-xl">
        <p>
          Your budget information helps us find properties that match your
          financial comfort zone. All amounts are in Nigerian Naira (₦).
        </p>
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
  color,
}: {
  title: string;
  value: number;
  formattedValue: string;
  onChange: (value: number) => void;
  min: number;
  max: number;
  color: string;
}) {
  return (
    <div
      className={`${color} rounded-lg p-4 border border-indigo-100 shadow-sm`}
    >
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold text-indigo-700">
          {formattedValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
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
