import { Routes, Route, useLocation } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import NotFound from "../pages/Errors/NotFound";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import LoginPage from "@/pages/Auth/Login";
import SignupPage from "@/pages/Auth/Signup";
import SignupRoleSelector from "@/pages/Auth/SignupRoleSelector";

function SignupHandler() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");

  // If role is specified, show signup form
  if (role && ["tenant", "landlord"].includes(role)) {
    return <SignupPage />;
  }

  // Otherwise, show role selector
  return <SignupRoleSelector />;
}

function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<SignupHandler />} />
        <Route path="email/verify" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AuthRoutes;
