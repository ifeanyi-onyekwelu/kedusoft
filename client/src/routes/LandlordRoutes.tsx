import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LandlordSettingsLayout from "../layouts/LandlordSettingsLayout";
import Dashboard from "../pages/Dashboards/Landlords/Dashboard/Dashboard";
import Applications from "../pages/Dashboards/Landlords/Applications/Applications";
import Tenants from "../pages/Dashboards/Landlords/Tenants/Tenants";
import ApplicationsDetails from "../pages/Dashboards/Landlords/Applications/ApplicationsDetails";
import TenantDetails from "../pages/Dashboards/Landlords/Tenants/TenantDetails";
import LandlordProperties from "../pages/Dashboards/Landlords/Properties/Properties";
import PropertyDetails from "../pages/Dashboards/Landlords/Properties/PropertyDetails";
import CreateProperty from "../pages/Dashboards/Landlords/Properties/CreateProperty";
import PropertyOwnerMessages from "../pages/Dashboards/Landlords/Messages/Messages";
import PropertyOwnerReports from "../pages/Dashboards/Landlords/Reports/Reports";
import ApplicantDetails from "../pages/Dashboards/Landlords/Applications/ApplicantsDetails";
import Applicants from "../pages/Dashboards/Landlords/Applications/Applicants";
import { LandlordScreenings } from "../pages/Dashboards/Landlords/Screenings";
import { LandlordLeases } from "../pages/Dashboards/Landlords/Leases";
import PropertyViewsAnalytics from "../pages/Dashboards/Landlords/Analytics/PropertyViewsAnalytics";
import TransactionAnalytics from "../pages/Dashboards/Landlords/Analytics/TransactionAnalytics";
import Transactions from "../pages/Dashboards/Landlords/Transactions/Transactions";
import Maintenance from "../pages/Dashboards/Landlords/Maintenance/Maintenance";
import Inspections from "../pages/Dashboards/Landlords/Inspections/Inspections";
import LandlordBioData from "../pages/Dashboards/Landlords/Settings/BioData";
import LandlordChangePassword from "../pages/Dashboards/Landlords/Settings/ChangePassword";
import LandlordNotifications from "../pages/Dashboards/Landlords/Settings/Notifications";
import LandlordVerification from "../pages/Dashboards/Landlords/Settings/Verification";
import LandlordPayments from "../pages/Dashboards/Landlords/Settings/Payments";
import LandlordDocuments from "../pages/Dashboards/Landlords/Settings/Documents";

function LandlordRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role="landlord" />}>
        <Route index element={<Dashboard />} />

        <Route path="applications">
          <Route index element={<Applications />} />
          <Route
            path=":applicationId/:propertyId"
            element={<ApplicationsDetails />}
          />

          <Route path="applicants">
            <Route index element={<Applicants />} />
            <Route path=":id" element={<ApplicantDetails />} />
          </Route>
        </Route>

        <Route path="tenants">
          <Route index element={<Tenants />} />
          <Route path=":id" element={<TenantDetails />} />
        </Route>

        <Route path="properties">
          <Route index element={<LandlordProperties />} />
          <Route path=":id" element={<PropertyDetails />} />
          <Route path="add" element={<CreateProperty />} />
        </Route>

        <Route path="screenings" element={<LandlordScreenings />} />
        <Route path="leases" element={<LandlordLeases />} />
        <Route path="messages" element={<PropertyOwnerMessages />} />
        <Route path="reports" element={<PropertyOwnerReports />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="inspections" element={<Inspections />} />

        {/* Analytics Routes */}
        <Route path="analytics">
          <Route path="views" element={<PropertyViewsAnalytics />} />
          <Route path="transactions" element={<TransactionAnalytics />} />
        </Route>
      </Route>

      {/* Landlord Settings Routes */}
      <Route path="settings" element={<LandlordSettingsLayout />}>
        <Route path="profile" element={<LandlordBioData />} />
        <Route path="change-password" element={<LandlordChangePassword />} />
        <Route path="notifications" element={<LandlordNotifications />} />
        <Route path="verification" element={<LandlordVerification />} />
        <Route path="payments" element={<LandlordPayments />} />
        <Route path="documents" element={<LandlordDocuments />} />
      </Route>
    </Routes>
  );
}

export default LandlordRoutes;
