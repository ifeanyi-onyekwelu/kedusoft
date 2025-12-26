import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Tenant Onboarding
import TenantWelcomePage from "../pages/Onboarding/Tenants/WelcomePage.new";
import LocationPage from "../pages/Onboarding/Tenants/LocationPage";
import VibePage from "../pages/Onboarding/Tenants/VibePage";
import CompletionPage from "../pages/Onboarding/Tenants/CompletionPage";
import BudgetPage from "../pages/Onboarding/Tenants/BudgetPage";
import FeaturesPage from "../pages/Onboarding/Tenants/FeaturesPage";
import PropertyDetailsPage from "../pages/Onboarding/Tenants/PropertyDetailsPage";
import PersonalDetailsPage from "@/pages/Onboarding/Tenants/PersonalDetails";

// Landlord Onboarding
import LandlordWelcomePage from "../pages/Onboarding/Landlord/WelcomePage";
import LandlordVerification from "../pages/Onboarding/Landlord/Verification";
import LandlordVerificationSuccess from "../pages/Onboarding/Landlord/VerificationSuccess";

import OnboardingLayout from "../layouts/OnboardingLayout";

// Role-based redirect component
function OnboardingRedirect() {
  const { user } = useUser();
  const role = user?.role || "tenant";

  if (role === "landlord") {
    return <Navigate to="/onboarding/landlord/welcome" replace />;
  }
  return <Navigate to="/onboarding/welcome" replace />;
}

function OnboardingRoutes() {
  return (
    <Routes>
      {/* Default redirect based on role */}
      <Route path="/" element={<OnboardingRedirect />} />

      {/* Tenant Onboarding (default) */}
      <Route element={<OnboardingLayout />}>
        <Route path="tenant">
          <Route path="welcome" element={<TenantWelcomePage />} />
          <Route path="personal" element={<PersonalDetailsPage />} />
          <Route path="property-details" element={<PropertyDetailsPage />} />
          <Route path="location" element={<LocationPage />} />
          <Route path="vibes" element={<VibePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="summary" element={<CompletionPage />} />
        </Route>
      </Route>

      {/* Landlord Onboarding */}
      <Route path="landlord">
        <Route path="welcome" element={<LandlordWelcomePage />} />
        <Route path="verification" element={<LandlordVerification />} />
        <Route
          path="verification-success"
          element={<LandlordVerificationSuccess />}
        />
      </Route>

      {/* Completion Page - Shared by both roles */}
      <Route path="complete" element={<CompletionPage />} />
    </Routes>
  );
}

export default OnboardingRoutes;
