import { useUser } from "../../context/UserContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, FormEvent } from "react";
import { useAuthOperations } from "../../apis/authApi";
import {
  IconAt,
  IconLock,
  IconUser,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { BrandedLoader } from "../../components/LoadingSpinner";
import { SocialAuthButtons } from "../../components/SocailAuthButtons";
import { useLoading } from "../../hooks/useLoading";

function SignupPage() {
  const { signup } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { loading, withLoading } = useLoading();
  const { register } = useAuthOperations();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const role = queryParams.get("role") || "tenant";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    terms: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    terms: "",
  });

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (errorMsg) setErrorMsg(null);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate
    const newErrors = {
      firstName: !formData.firstName.trim() ? "First name is required" : "",
      lastName: !formData.lastName.trim() ? "Last name is required" : "",
      email: !validateEmail(formData.email)
        ? "Please enter a valid email address"
        : "",
      password: !validatePassword(formData.password)
        ? "Password must be 6+ characters with uppercase, lowercase, number, and symbol"
        : "",
      password2:
        formData.password !== formData.password2
          ? "Passwords do not match"
          : "",
      terms: !formData.terms ? "You must accept the terms and conditions" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const response = await withLoading(register({ ...formData, role }));
      const { user, accessToken } = response;
      signup(user, accessToken, role);

      navigate("/auth/email/verify");
    } catch (error: any) {
      setErrorMsg(error?.message || "Registration failed. Please try again.");
    }
  };

  if (loading) {
    return <BrandedLoader fullScreen label="Creating your account..." />;
  }

  const getRoleLabel = () => {
    if (role === "admin") return "an Admin";
    if (role === "landlord") return "a Property Owner";
    return "a Tenant";
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create account
        </h2>
        <p className="text-gray-600">
          Sign up as {getRoleLabel()} to get started
        </p>
      </div>

      <SocialAuthButtons authType="signup" />

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconUser size={20} className="text-gray-400" />
              </div>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconUser size={20} className="text-gray-400" />
              </div>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

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
              placeholder="Create a strong password"
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="password2"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconLock size={20} className="text-gray-400" />
            </div>
            <input
              id="password2"
              type={showPassword2 ? "text" : "password"}
              value={formData.password2}
              onChange={(e) => handleInputChange("password2", e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border ${
                errors.password2 ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword2 ? (
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
          {errors.password2 && (
            <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => handleInputChange("terms", e.target.checked)}
              className={`h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer ${
                errors.terms ? "border-red-300" : ""
              }`}
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              I agree to the{" "}
              <Link
                to="/terms-of-service"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
