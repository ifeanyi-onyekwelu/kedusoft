import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminSettingsLayout from "../layouts/AdminSettingsLayout";
import Dashboard from "../pages/Dashboards/Admin/Dashboard/Dashboard";
import Users from "../pages/Dashboards/Admin/users/Users";
import AllUsers from "../pages/Dashboards/Admin/users/All-Users";
import UserDetails from "../pages/Dashboards/Admin/users/UserDetails";
import AllPendingUsers from "../pages/Dashboards/Admin/users/All-Pending-Users";
import PendingUserDetails from "../pages/Dashboards/Admin/users/Pending-User-Details";
import Properties from "../pages/Dashboards/Admin/properties/Properties";
import PropertyDetails from "../pages/Dashboards/Admin/properties/Property-Details";
import AllProperties from "../pages/Dashboards/Admin/properties/All-Properties";
import PendingListings from "../pages/Dashboards/Admin/properties/PendingListings";
import PendingListingsDetails from "../pages/Dashboards/Admin/properties/PendingListingsDetails";
import Applications from "../pages/Dashboards/Admin/applications/Applications";
import AllApplications from "../pages/Dashboards/Admin/applications/All-Applications";
import ApplicationsDetails from "../pages/Dashboards/Admin/applications/ApplicationDetails";
import Transactions from "../pages/Dashboards/Admin/Transactions/Transactions";
import AllTransactions from "../pages/Dashboards/Admin/Transactions/All-Transactions";
import AdminReport from "../pages/Dashboards/Admin/reports/Report";
import AdminSupport from "../pages/Dashboards/Admin/support/Support";
import AdminBioData from "../pages/Dashboards/Admin/Settings/BioData";
import AdminChangePassword from "../pages/Dashboards/Admin/Settings/ChangePassword";
import AdminNotifications from "../pages/Dashboards/Admin/Settings/Notifications";
import AdminVerification from "../pages/Dashboards/Admin/Settings/Verification";
import AdminSecurity from "../pages/Dashboards/Admin/Settings/Security";
import AdminSystem from "../pages/Dashboards/Admin/Settings/System";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout role="admin" />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/all" element={<AllUsers />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/pending" element={<AllPendingUsers />} />
        <Route path="users/pending/id" element={<PendingUserDetails />} />

        {/* Properties Routes */}
        <Route path="properties" element={<Properties />} />
        <Route path="properties/all" element={<AllProperties />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="properties/pending" element={<PendingListings />} />
        <Route
          path="properties/pending/id"
          element={<PendingListingsDetails />}
        />

        {/* Applications Routes */}
        <Route path="applications" element={<Applications />} />
        <Route path="applications/all" element={<AllApplications />} />
        <Route path="applications/:id" element={<ApplicationsDetails />} />

        {/* Transaction Routes */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/all" element={<AllTransactions />} />
        <Route path="transactions/:id" element={<AllTransactions />} />

        <Route path="reports" element={<AdminReport />} />
        <Route path="support" element={<AdminSupport />} />
      </Route>

      {/* Admin Settings Routes */}
      <Route path="settings" element={<AdminSettingsLayout />}>
        <Route path="profile" element={<AdminBioData />} />
        <Route path="change-password" element={<AdminChangePassword />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="verification" element={<AdminVerification />} />
        <Route path="security" element={<AdminSecurity />} />
        <Route path="system" element={<AdminSystem />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
