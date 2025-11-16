import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Tenant Onboarding
import TenantWelcomePage from "../pages/Onboarding/Tenants/WelcomePage.new";
import LocationPage from "../pages/Onboarding/Tenants/LocationPage";
import VibePage from "../pages/Onboarding/Tenants/VibePage";
import SummaryPage from "../pages/Onboarding/SummaryPage";
import BudgetPage from "../pages/Onboarding/Tenants/BudgetPage";
import FeaturesPage from "../pages/Onboarding/Tenants/FeaturesPage";
import PropertyDetailsPage from "../pages/Onboarding/Tenants/PropertyDetailsPage";

// Landlord Onboarding
import LandlordWelcomePage from "../pages/Onboarding/Landlord/WelcomePage";
import LandlordPropertyInfoPage from "../pages/Onboarding/Landlord/PropertyInfoPage";

// Completion Page
import CompletionPage from "../pages/Onboarding/Tenants/CompletionPage";

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
        <Route path="welcome" element={<TenantWelcomePage />} />
        <Route path="property" element={<PropertyDetailsPage />} />
        <Route path="location" element={<LocationPage />} />
        <Route path="vibes" element={<VibePage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="features" element={<FeaturesPage />} />
      </Route>

      {/* Landlord Onboarding */}
      <Route path="landlord">
        <Route path="welcome" element={<LandlordWelcomePage />} />
        <Route path="property-info" element={<LandlordPropertyInfoPage />} />
        <Route
          path="verification"
          element={<Navigate to="/property-owner" />}
        />
      </Route>

      {/* Completion Page - Shared by both roles */}
      <Route path="complete" element={<CompletionPage />} />
    </Routes>
  );
}

export default OnboardingRoutes;
