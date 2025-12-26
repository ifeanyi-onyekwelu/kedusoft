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

const PAYMENT_FREQUENCIES = [
  { id: "monthly", label: "Monthly", description: "Pay rent every month" },
  { id: "quarterly", label: "Quarterly", description: "Pay every 3 months" },
  { id: "annually", label: "Annually", description: "Pay once per year" },
];

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

  useEffect(() => {
    if (budget < minBudget) setMinBudget(budget);
    if (budget > maxBudget) setMaxBudget(budget);
  }, [budget, minBudget, maxBudget]);

  // Load saved values from context when component mounts
  useEffect(() => {
    if (preferences.budget) setBudget(preferences.budget);
    if (preferences.minBudget) setMinBudget(preferences.minBudget);
    if (preferences.maxBudget) setMaxBudget(preferences.maxBudget);
    if (preferences.paymentFrequency)
      setPaymentFrequency(preferences.paymentFrequency);
    if (preferences.moveInDate) setMoveInDate(preferences.moveInDate);
    if (preferences.additionalCosts && preferences.additionalCosts.length > 0) {
      setAdditionalCosts(preferences.additionalCosts);
    }
  }, []);

  const formatNaira = (amount: number) => {
    if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
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
    <div className="min-h-screen bg-white font-manrope">
      {/* Brand Progress Bar - Final Step (100%) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-50">
        <div className="h-full bg-secondary w-full transition-all duration-500" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-primary mb-6 transition-colors font-bold"
          >
            <IconArrowLeft size={18} className="mr-2" />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 font-sora mb-2">
            Budget & Timeline
          </h1>
          <p className="text-gray-500 font-medium">
            Finalize your financial range and moving schedule.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Controls */}
          <div className="lg:col-span-7 space-y-12">
            {/* Range Selectors */}
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                Price Range
              </h3>
              <div className="space-y-8">
                <BudgetSlider
                  label="Minimum Budget"
                  value={minBudget}
                  max={maxBudget}
                  step={10000}
                  onChange={setMinBudget}
                  format={formatNaira}
                />
                <BudgetSlider
                  label="Maximum Budget"
                  value={maxBudget}
                  min={minBudget}
                  max={5000000}
                  step={50000}
                  onChange={setMaxBudget}
                  format={formatNaira}
                />
              </div>
            </section>

            {/* Frequency & Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  Payment Frequency
                </h3>
                <div className="flex flex-col gap-3">
                  {PAYMENT_FREQUENCIES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setPaymentFrequency(f.id)}
                      className={`px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                        paymentFrequency === f.id
                          ? "border-secondary bg-blue-50/30"
                          : "border-gray-50 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p
                        className={`font-bold text-sm ${
                          paymentFrequency === f.id
                            ? "text-secondary"
                            : "text-gray-900"
                        }`}
                      >
                        {f.label}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {f.description}
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  Move-in Date
                </h3>
                <div className="relative group">
                  <IconCalendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors"
                    size={20}
                  />
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full pl-12 pr-4 h-14 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-secondary outline-none font-bold text-sm transition-all"
                  />
                </div>
                <div className="mt-4 p-4 bg-orange-50 rounded-2xl flex gap-3">
                  <IconInfoCircle
                    className="text-orange-500 shrink-0"
                    size={18}
                  />
                  <p className="text-[11px] font-bold text-orange-700 uppercase tracking-tight">
                    Properties are typically listed 30-60 days before
                    availability.
                  </p>
                </div>
              </section>
            </div>

            {/* Additional Costs Chips */}
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                Inclusive of
              </h3>
              <div className="flex flex-wrap gap-3">
                {ADDITIONAL_COSTS.map((cost) => (
                  <button
                    key={cost.id}
                    onClick={() => toggleAdditionalCost(cost.id)}
                    className={`px-6 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all
                      ${
                        additionalCosts.includes(cost.id)
                          ? "border-secondary bg-secondary text-white shadow-lg"
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      }
                    `}
                  >
                    {cost.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-primary rounded-[32px] p-8 text-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 rounded-full -mr-16 -mt-16 blur-3xl" />

              <h2 className="text-2xl font-bold font-sora mb-8 relative">
                Review & Continue
              </h2>

              <div className="space-y-6 relative">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">
                    Price Range
                  </span>
                  <span className="text-xl font-bold font-sora text-secondary">
                    {formatNaira(minBudget)} — {formatNaira(maxBudget)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">
                    Schedule
                  </span>
                  <span className="font-bold text-sm">
                    {paymentFrequency} • {moveInDate || "Not Set"}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest block mb-4">
                    Included Services
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {additionalCosts.map((id) => (
                      <span
                        key={id}
                        className="text-[10px] bg-white/10 px-3 py-1 rounded-full font-bold uppercase tracking-tighter"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-12 h-16 bg-white text-primary rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:bg-secondary hover:text-white group"
              >
                Complete Onboarding
                <IconArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}

function BudgetSlider({
  label,
  value,
  min = 0,
  max,
  step,
  onChange,
  format,
}: SliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-gray-900">{label}</label>
        <span className="text-secondary font-black font-sora">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-secondary"
      />
    </div>
  );
}
