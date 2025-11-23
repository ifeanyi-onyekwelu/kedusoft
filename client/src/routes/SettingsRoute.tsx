import { Route, Routes } from "react-router-dom";
import SettingsLayout from "../layouts/SettingsLayout";
import BioData from "../pages/Dashboards/General/Settings/BioData";
import ChangePassword from "../pages/Dashboards/General/Settings/ChangePassword";
import Notifications from "../pages/Dashboards/General/Settings/Notifications";
import Verification from "../pages/Dashboards/General/Settings/Verification";
import QrVerification from "../pages/Dashboards/General/Settings/QrVerification";

function SettingsRoute() {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route path="profile" element={<BioData />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="verification">
          <Route index element={<Verification />} />
          <Route path="qr" element={<QrVerification />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default SettingsRoute;
