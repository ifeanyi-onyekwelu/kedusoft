import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import TenantSettingsLayout from "../layouts/TenantSettingsLayout";
import Dashboard from "../pages/Dashboards/Tenants/Dashboard/Dashboard";
import Applications from "../pages/Dashboards/Tenants/Applications/Applications";
import Transactions from "../pages/Dashboards/Tenants/Transactions/Transactions";
import TransactionsDetails from "../pages/Dashboards/Tenants/Transactions/TransactionsDetails";
import Payment from "../pages/Dashboards/Tenants/Payment";
import ApplicationsDetails from "../pages/Dashboards/Tenants/Applications/ApplicationsDetails";
import TenantMessages from "../pages/Dashboards/Tenants/Messages/Messages";
import LikedPropertiesPage from "../pages/Dashboards/Tenants/LikedProperties";
import RecommendationsPage from "../pages/Dashboards/Tenants/RecommendationsPage";
import { TenantScreenings } from "../pages/Dashboards/Tenants/Screenings";
import { TenantLeases } from "../pages/Dashboards/Tenants/Leases";
import TenantBioData from "../pages/Dashboards/Tenants/Settings/BioData";
import TenantChangePassword from "../pages/Dashboards/Tenants/Settings/ChangePassword";
import TenantNotifications from "../pages/Dashboards/Tenants/Settings/Notifications";
import TenantVerification from "../pages/Dashboards/Tenants/Settings/Verification";
import TenantPayment from "../pages/Dashboards/Tenants/Settings/Payment";
import TenantScreening from "../pages/Dashboards/Tenants/Settings/Screening";

function TenantsRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role="tenant" />}>
        <Route index element={<Dashboard />} />
        <Route path="applications">
          <Route index element={<Applications />} />
          <Route path=":id" element={<ApplicationsDetails />} />
        </Route>
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/details" element={<TransactionsDetails />} />
        <Route path="favorites" element={<LikedPropertiesPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="screenings" element={<TenantScreenings />} />
        <Route path="leases" element={<TenantLeases />} />
        <Route path="payment" element={<Payment />} />
        <Route path="messages" element={<TenantMessages />} />
      </Route>

      {/* Tenant Settings Routes */}
      <Route path="settings" element={<TenantSettingsLayout />}>
        <Route path="profile" element={<TenantBioData />} />
        <Route path="change-password" element={<TenantChangePassword />} />
        <Route path="notifications" element={<TenantNotifications />} />
        <Route path="verification" element={<TenantVerification />} />
        <Route path="payment" element={<TenantPayment />} />
        <Route path="screening" element={<TenantScreening />} />
      </Route>
    </Routes>
  );
}

export default TenantsRoutes;
