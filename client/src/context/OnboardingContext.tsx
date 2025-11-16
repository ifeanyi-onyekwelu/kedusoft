import { createContext, useState, useContext, ReactNode } from "react";
import { createRecommendation } from "../apis/tenantApi";

interface Preference {
  locations: string[];
  vibe: string[];
  features: string[];
  budget: number;
  minBudget: number;
  maxBudget: number;
  paymentFrequency: string;
  moveInDate: string;
  additionalCosts: string[];
  bedrooms?: number;
  bathrooms?: number;
  parking_space?: boolean;
  furnished?: string;
  pets?: string;
  kitchens?: number;
  floors_no?: number;
  year_built?: number;
  minimum_lease_duration?: string;
  amenities?: string[];
}

interface OnboardingContextTypes {
  preferences: Preference;
  updatePreference: <K extends keyof Preference>(
    key: K,
    value: Preference[K]
  ) => void;
  submitPreferences: () => Promise<any>;
}

const OnboardingContext = createContext<OnboardingContextTypes | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<Preference>({
    locations: [],
    vibe: [],
    features: [],
    budget: 0,
    minBudget: 0,
    maxBudget: 0,
    paymentFrequency: "monthly",
    moveInDate: "",
    additionalCosts: [],
    bedrooms: undefined,
    bathrooms: undefined,
    parking_space: undefined,
    furnished: undefined,
    pets: undefined,
    kitchens: undefined,
    floors_no: undefined,
    year_built: undefined,
    minimum_lease_duration: undefined,
    amenities: [],
  });

  const updatePreference = (key: keyof Preference, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const submitPreferences = async () => {
    const payload = {
      ...preferences,
      min_budget: preferences.minBudget,
      max_budget: preferences.maxBudget,
      preferred_price_range: [preferences.minBudget, preferences.maxBudget],
      preferred_amenities: preferences.features,
      preferred_location: preferences.locations,
      property_category: "",
    };

    return createRecommendation(payload);
  };

  return (
    <OnboardingContext.Provider
      value={{ preferences, updatePreference, submitPreferences }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
