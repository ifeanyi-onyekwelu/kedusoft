import { createContext, useState, useContext, useEffect } from "react";
import { createRecommendation } from "../apis/tenantApi";

interface Preference {
  // Personal Details
  occupation?: string;
  maritalStatus?: string;
  householdSize?: string;
  hasChildren?: boolean;
  numberOfChildren?: number;
  hasPets?: boolean;

  // Property Details
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

  // Verification
  verificationDocuments?: { [key: string]: File };
}

interface OnboardingContextTypes {
  preferences: Preference;
  updatePreference: <K extends keyof Preference>(
    key: K,
    value: Preference[K]
  ) => void;
  submitPreferences: () => Promise<any>;
  completeOnboarding: () => Promise<any>;
  isOnboardingComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextTypes | undefined>(
  undefined
);

const STORAGE_KEY = "onboarding_preferences";

const DEFAULT_PREFERENCES: Preference = {
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
  occupation: "",
  maritalStatus: "",
  householdSize: "",
  hasChildren: false,
  numberOfChildren: 0,
  hasPets: false,
  verificationDocuments: {},
};

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<Preference>(() => {
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.error("Error loading preferences from localStorage:", error);
    }
    return DEFAULT_PREFERENCES;
  });

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      console.log("Preferences saved to localStorage:", preferences);
    } catch (error) {
      console.error("Error saving preferences to localStorage:", error);
    }
  }, [preferences]);

  const updatePreference = <K extends keyof Preference>(
    key: K,
    value: Preference[K]
  ) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      console.log(`Updated preference ${String(key)}:`, value);
      return updated;
    });
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

  const completeOnboarding = async () => {
    try {
      // Submit preferences to generate recommendations
      const response = await submitPreferences();

      setIsOnboardingComplete(true);
      // Clear localStorage after successful submission
      localStorage.removeItem(STORAGE_KEY);
      return response;
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        preferences,
        updatePreference,
        submitPreferences,
        completeOnboarding,
        isOnboardingComplete,
      }}
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
