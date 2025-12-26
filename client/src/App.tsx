import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import TenantsRoutes from "./routes/TenantsRoutes";
import LandlordRoutes from "./routes/LandlordRoutes";
import NotFound from "./pages/Errors/NotFound";
import RequireAuth from "./utils/requireAuth";
import ScrollToTop from "./utils/scrollToTop";
import "@mantine/dates/styles.css";
import { RouterProgress } from "./components/RouterProgress";
import OnboardingRoutes from "./routes/OnboardingRoutes";
import Toast from "@/components/common/Toast.tsx";

const ROLES = {
  Tenant: "tenant",
  Admin: "admin",
  Landlord: "landlord",
};

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <RouterProgress />
        <Toast />

        <Routes>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="auth/*" element={<AuthRoutes />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin/*" element={<AdminRoutes />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Tenant]} />}>
            <Route path="tenants/*" element={<TenantsRoutes />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Landlord]} />}>
            <Route path="property-owner/*" element={<LandlordRoutes />} />
          </Route>
          <Route path="onboarding/*" element={<OnboardingRoutes />}></Route>
          <Route path="error-500" element={<h1>Error 500</h1>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
