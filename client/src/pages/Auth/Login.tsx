import { useUser } from "../../context/UserContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { useAuthOperations } from "../../apis/authApi";
import { IconAt, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import { BrandedLoader } from "../../components/LoadingSpinner";
import { SocialAuthButtons } from "../../components/SocailAuthButtons";
import { useLoading } from "../../hooks/useLoading";

function LoginPage() {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const next = queryParams.get("next") || "";
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();
  const { login: apiLogin } = useAuthOperations();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  type Role = "tenant" | "landlord" | "admin";

  const navigateBasedOnRole = (role: Role, args?: any) => {
    const routes = {
      tenant: "/tenants",
      landlord: "/property-owner",
      admin: "/admin",
    };
    navigate((routes[role] as string) || "/", args);
  };

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (errorMsg) setErrorMsg(null);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate
    const newErrors = {
      email: !validateEmail(formData.email)
        ? "Please enter a valid email address"
        : "",
      password: !formData.password ? "Password is required" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const response = await withLoading(apiLogin(formData));

      const { accessToken, is_email_verified, is_onboarded } = response;

      const decoded: any = jwtDecode(accessToken);
      const { role, firstName } = decoded;

      login(accessToken, role);

      if (!is_email_verified) {
        navigate("/auth/email/verify");
        return;
      }

      if (!is_onboarded) {
        if (role === "tenant") {
          navigate("/onboarding/tenant/welcome");
        } else if (role === "landlord") {
          navigate("/onboarding/landlord/welcome");
        }
        return;
      }

      if (next) {
        navigate(next, { replace: true });
      } else {
        navigateBasedOnRole(role, {
          state: {
            showWelcome: true,
            userAction: "login",
            firstName: firstName,
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error: any) {
      setErrorMsg(error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      <SocialAuthButtons authType="login" />

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconAt size={20} className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border ${
                errors.email ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconLock size={20} className="text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border ${
                errors.password ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <IconEyeOff
                  size={20}
                  className="text-gray-400 hover:text-gray-600"
                />
              ) : (
                <IconEye
                  size={20}
                  className="text-gray-400 hover:text-gray-600"
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
